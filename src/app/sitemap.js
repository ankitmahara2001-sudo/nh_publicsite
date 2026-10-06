import { getApi } from '@/lib/api';
import { absoluteUrl } from '@/lib/site';
import { connection } from 'next/server';

export const revalidate = 3600;

const PAGE_SIZE = 50; // API maximum
const STATIC_PATHS = [
  '/',
  '/packages',
  '/destinations',
  '/offers',
  '/gallery',
  '/blog',
  '/about',
  '/contact',
];
const POLICY_SLUGS = ['cancellation', 'privacy', 'terms'];

/** Every item of a paginated list endpoint. `pick` extracts the items from one page's `data`. */
async function fetchAll(path, pick) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const { data, meta } = await getApi(path, { params: { page, pageSize: PAGE_SIZE } });
    items.push(...pick(data, page));
    if (page * meta.pageSize >= meta.total) return items;
  }
}

export default async function sitemap() {
  await connection();
  const [packages, posts] = await Promise.all([
    fetchAll('/packages', (data) => data),
    // The featured post comes separately and is not in `posts` on page 1.
    fetchAll('/blog', (data, page) => [
      ...(page === 1 && data.featured ? [data.featured] : []),
      ...data.posts,
    ]),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: 'weekly',
      priority: path === '/' ? 1 : 0.7,
    })),
    ...packages.map((pkg) => ({
      url: absoluteUrl(`/packages/${pkg.slug}`),
      changeFrequency: 'weekly',
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
    ...POLICY_SLUGS.map((slug) => ({
      url: absoluteUrl(`/policies/${slug}`),
      changeFrequency: 'yearly',
      priority: 0.2,
    })),
  ];
}
