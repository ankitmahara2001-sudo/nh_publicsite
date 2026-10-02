/** Public base URL of the website (absolute links: share buttons, JSON-LD, metadata). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** Absolute URL for a site path, e.g. absoluteUrl('/blog/my-post'). */
export const absoluteUrl = (path) => `${SITE_URL}${path}`;
