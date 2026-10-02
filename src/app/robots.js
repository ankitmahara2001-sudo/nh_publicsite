import { absoluteUrl } from '@/lib/site';

/** Account, login and booking pages are private; everything else may be indexed. */
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/account', '/login', '/booking'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
