/**
 * Builds "path?key=value" for in-page filter and pagination links.
 * Empty values (and page 1) are left out so URLs stay short and canonical.
 */
export function buildHref(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'page' && Number(value) === 1) continue;
    query.set(key, String(value));
  }
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

/** A single string search param (the first one when repeated), or undefined. */
export function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

/** `value` when it is one of `allowed`, otherwise undefined (ignores unknown filter values). */
export function oneOf(value, allowed) {
  const single = firstParam(value);
  return allowed.includes(single) ? single : undefined;
}

/** Positive page number from a search param, defaulting to 1. */
export function pageParam(value) {
  const page = Number.parseInt(firstParam(value), 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
