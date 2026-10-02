import { BLOG_CATEGORIES, BLOG_CATEGORY_LABELS } from '@nh/shared';
import Link from 'next/link';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { BlogCard } from '@/components/cards/BlogCard';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterTabs } from '@/components/ui/FilterTabs';
import { PageHero } from '@/components/ui/PageHero';
import { Pagination } from '@/components/ui/Pagination';
import { getApi } from '@/lib/api';
import { pageMetadata } from '@/lib/metadata';
import { getSiteSettings } from '@/lib/server';
import { buildHref, oneOf, pageParam } from '@/lib/url';

export const revalidate = 60;

const POSTS_PER_PAGE = 6;

export async function generateMetadata() {
  const { pages, company } = await getSiteSettings();
  const hero = pages.blog;
  return pageMetadata({
    title: hero.title,
    description: hero.subtitle,
    imageUrl: hero.imageUrl,
    path: '/blog',
    siteName: company.name,
  });
}

export default async function BlogPage({ searchParams }) {
  const query = await searchParams;
  const category = oneOf(query.category, BLOG_CATEGORIES);
  const page = pageParam(query.page);

  const [{ data, meta }, { pages }] = await Promise.all([
    getApi('/blog', { params: { category, page, pageSize: POSTS_PER_PAGE } }),
    getSiteSettings(),
  ]);
  const hero = pages.blog;
  // The featured article leads the first page only; the API always lists it separately.
  const featured = page === 1 ? data.featured : null;
  const totalPages = Math.ceil(meta.total / meta.pageSize);
  const isEmpty = !featured && data.posts.length === 0;

  const tabs = [
    { key: 'all', label: 'All', href: '/blog', active: !category },
    ...BLOG_CATEGORIES.map((key) => ({
      key,
      label: BLOG_CATEGORY_LABELS[key],
      href: buildHref('/blog', { category: key }),
      active: category === key,
    })),
  ];

  return (
    <main>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        imageUrl={hero.imageUrl}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        active="blog"
      />

      <Container
        as="section"
        aria-label="Articles"
        className="flex flex-col gap-[22px] pt-4 pb-10 lg:gap-8 lg:pt-14 lg:pb-20"
      >
        <FilterTabs label="Blog category" items={tabs} />

        {featured && <FeaturedPost post={featured} />}

        {data.posts.length > 0 && (
          <div className="flex flex-col gap-[22px] md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {data.posts.map((post) => (
              <BlogCard key={post.id} post={post} showExcerpt />
            ))}
          </div>
        )}

        {isEmpty && (
          <EmptyState
            title="No articles here yet"
            text="Our team is writing new guides. Try another category in the meantime."
          >
            <Link href="/blog" className="text-sm font-bold text-navy underline">
              See all articles
            </Link>
          </EmptyState>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          hrefFor={(n) => buildHref('/blog', { category, page: n })}
        />
      </Container>
    </main>
  );
}
