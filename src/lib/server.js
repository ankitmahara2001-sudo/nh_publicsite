import { cookies } from 'next/headers';
import { ApiError, getApi, getOrNull } from './api';

// Server-only helpers shared by layouts and pages.

/** Every public site setting (company, home texts, about, contact…), cached for 60 s. */
export async function getSiteSettings() {
  return (await getApi('/settings/public')).data;
}

/** The visitor's Cookie header, to call customer endpoints on their behalf. */
async function cookieHeader() {
  const store = await cookies();
  return store
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
}

/** The logged-in customer, or null. */
export async function getCustomer() {
  const store = await cookies();
  if (!store.get('nh_customer')) return null;
  try {
    return (await getApi('/me', { cookie: await cookieHeader() })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

/** GET a customer endpoint with the visitor's cookie (never cached). */
export async function getAsCustomer(path, params) {
  return getApi(path, { params, cookie: await cookieHeader() });
}

export { getOrNull };
