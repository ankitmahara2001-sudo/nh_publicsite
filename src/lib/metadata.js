/**
 * Page metadata from admin-managed texts: title, description, canonical path and Open Graph image.
 * The title template comes from the root layout. Next.js replaces (does not merge) a parent's
 * `openGraph`, so the site name and locale are repeated here.
 */
export function pageMetadata({ title, description, path, imageUrl, siteName, type = 'website' }) {
  return {
    title,
    description: description || undefined,
    alternates: path ? { canonical: path } : undefined,
    openGraph: {
      title,
      description: description || undefined,
      url: path,
      siteName,
      locale: 'en_IN',
      type,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}
