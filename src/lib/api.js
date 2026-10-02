// The only place the website talks to the API.
// - Server components call `getApi()` (cached for 60 s, or uncached with the visitor's cookie).
// - Client components call `clientApi.*` (browser fetch with the login cookie).

const REVALIDATE_SECONDS = 60;
const SERVER_BASE = (
  process.env.API_URL_INTERNAL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:5000/api'
).replace(/\/$/, '');
const BROWSER_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

/** Origin the browser calls (preconnected from the root layout). */
export const BROWSER_API_ORIGIN = new URL(BROWSER_BASE).origin;

export class ApiError extends Error {
  constructor(status, code, message, fields) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields ?? {};
  }
}

function withParams(base, path, params) {
  const url = new URL(base + path);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, v));
    else url.searchParams.set(key, value);
  }
  return url;
}

async function parse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload?.error;
    throw new ApiError(
      response.status,
      error?.code ?? `HTTP_${response.status}`,
      error?.message ?? 'Something went wrong. Please try again.',
      error?.fields,
    );
  }
  return payload;
}

/**
 * Server-side GET. Public data is cached and refreshed every 60 s.
 * Pass `cookie` (the visitor's Cookie header) for account data: those requests are never cached.
 * @returns {Promise<{ data: any, meta?: object }>}
 */
export async function getApi(path, { params, cookie } = {}) {
  const response = await fetch(
    withParams(SERVER_BASE, path, params),
    cookie ? { headers: { cookie }, cache: 'no-store' } : { next: { revalidate: REVALIDATE_SECONDS } },
  );
  return parse(response);
}

/** Server-side GET that resolves to `data`, or `null` when the API answers 404. */
export async function getOrNull(path, options) {
  try {
    return (await getApi(path, options)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

async function browserRequest(method, path, body, params) {
  let response;
  try {
    response = await fetch(withParams(BROWSER_BASE, path, params), {
      method,
      credentials: 'include',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'NETWORK', 'We could not reach our server. Check your connection and try again.');
  }
  return parse(response);
}

/** Browser-side calls (send and receive the login cookie). Each resolves to `{ data, meta }`. */
export const clientApi = {
  get: (path, params) => browserRequest('GET', path, undefined, params),
  post: (path, body) => browserRequest('POST', path, body ?? {}),
  patch: (path, body) => browserRequest('PATCH', path, body),
};
