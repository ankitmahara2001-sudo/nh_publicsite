// next/image loader: asks Cloudinary for a resized, auto-format, auto-quality version
// (f_auto,q_auto,w_<width>). Images from other hosts (pasted URLs) are returned unchanged,
// with the width as a harmless query string so every srcset entry is unique.

const CLOUDINARY_UPLOAD = '/image/upload/';

export default function cloudinaryLoader({ src, width, quality }) {
  const url = new URL(src);
  if (url.hostname !== 'res.cloudinary.com' || !url.pathname.includes(CLOUDINARY_UPLOAD)) {
    url.searchParams.set('w', String(width));
    return url.toString();
  }
  const transform = ['f_auto', `q_${quality || 'auto'}`, `w_${width}`, 'c_limit'].join(',');
  url.pathname = url.pathname.replace(CLOUDINARY_UPLOAD, `${CLOUDINARY_UPLOAD}${transform}/`);
  return url.toString();
}
