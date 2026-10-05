const DEFAULT_AFTER_LOGIN = '/account/bookings';

/**
 * The `?next=` target after login, limited to paths on this site: "/…" but not "//…" or "/\…",
 * which browsers treat as another host. Stops the login page being used as an open redirect.
 */
export function safeNextPath(value) {
  const path = Array.isArray(value) ? value[0] : value;
  const isLocalPath =
    typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
  return isLocalPath ? path : DEFAULT_AFTER_LOGIN;
}
