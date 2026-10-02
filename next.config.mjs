/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    // Images are resized by Cloudinary (f_auto,q_auto,w_<size>) through a custom loader.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;
