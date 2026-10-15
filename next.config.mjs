// When the browser calls "/api" (NEXT_PUBLIC_API_URL=/api), proxy it to the real API so the customer
// login cookie is first-party. Netlify does the same in production (netlify.toml); this rewrite makes
// `next dev` / `next start` behave the same way locally.
const API_ORIGIN_URL = process.env.API_URL_INTERNAL ?? '';

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!/^https?:\/\//.test(API_ORIGIN_URL)) return [];
    return [{ source: '/api/:path*', destination: `${API_ORIGIN_URL.replace(/\/$/, '')}/:path*` }];
  },
  images: {
    // Images are resized by Cloudinary (f_auto,q_auto,w_<size>) through a custom loader.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;
