import { BLOG_CATEGORY_LABELS, formatDate } from '@nh/shared';
import { notFound } from 'next/navigation';
import { ArticleSidebar } from '@/components/blog/ArticleSidebar';
import { BlogCard } from '@/components/cards/BlogCard';
import { Header } from '@/components/layout/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Container } from '@/components/ui/Container';
import { Photo } from '@/components/ui/Photo';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { withHeadingIds } from '@/lib/articleHeadings';
import { cn } from '@/lib/cn';
import { pageMetadata } from '@/lib/metadata';
import { getOrNull, getSiteSettings } from '@/lib/server';
import { absoluteUrl } from '@/lib/site';
import { initials } from '@/lib/text';

export const revalidate = 60;

const getPost = (slug) => getOrNull(`/blog/${encodeURIComponent(slug)}`);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [post, { company }] = await Promise.all([getPost(slug), getSiteSettings()]);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    imageUrl: post.coverImageUrl,
    path: `/blog/${post.slug}`,
    siteName: company.name,
    type: 'article',
  });
}

/** schema.org Article for search engines. "<" is escaped so the JSON cannot close the script tag. */
function ArticleJsonLd({ post, url, publisher }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    datePublished: post.publishedAt ?? undefined,
    author: post.authorName ? { '@type': 'Person', name: post.authorName } : undefined,
    publisher: { '@type': 'Organization', name: publisher },
    mainEntityOfPage: url,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

function ArticleHero({ post }) {
  const category = BLOG_CATEGORY_LABELS[post.category];
  const meta = [
    category,
    post.publishedAt && formatDate(post.publishedAt),
    post.readMinutes && `${post.readMinutes} min read`,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <section className="relative isolate flex min-h-[440px] flex-col overflow-hidden bg-[#1F3044] text-white lg:h-[480px]">
      <Photo src={post.coverImageUrl} alt="" priority sizes="100vw" className="-z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/35 to-navy/85"
      />
      <Header variant="transparent" active="blog" />
      <Container className="mt-auto flex flex-col gap-3 pt-10 pb-7 lg:gap-4 lg:pb-16">
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: category }]}
        />
        <p className="text-xs font-bold tracking-[1.6px] text-gold-light uppercase lg:text-[13px] lg:tracking-[1.8px]">
          {meta}
        </p>
        <h1 className="max-w-[900px] text-[32px] leading-9 font-extrabold tracking-[-0.8px] lg:text-[52px] lg:leading-[58px] lg:tracking-[-1.4px]">
          {post.title}
        </h1>
        {post.authorName && (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-sand text-sm font-extrabold text-gold-text"
            >
              {initials(post.authorName)}
            </span>
            <span className="flex flex-col">
              <span className="font-bold">{post.authorName}</span>
              {post.authorRole && <span className="text-[13px] text-white/75">{post.authorRole}</span>}
            </span>
          </div>
        )}
      </Container>
    </section>
  );
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [post, { company }] = await Promise.all([getPost(slug), getSiteSettings()]);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const { html, headings } = withHeadingIds(post.content);

  return (
    <main>
      <ArticleJsonLd post={post} url={url} publisher={company.name} />
      <ArticleHero post={post} />

      <Container
        className={cn(
          'grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-20 lg:pt-16',
          post.relatedPosts.length === 0 && 'pb-10 lg:pb-20',
        )}
      >
        <article
          className="prose-article min-w-0 lg:[&>p:first-child]:text-xl lg:[&>p:first-child]:leading-8 [&>p:first-child]:text-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <ArticleSidebar
          headings={headings}
          shareUrl={url}
          title={post.title}
          relatedPackage={post.relatedPackage}
        />
      </Container>

      {post.relatedPosts.length > 0 && (
        <Container
          as="section"
          aria-label="Related articles"
          className="flex flex-col gap-4 py-10 lg:gap-7 lg:py-20"
        >
          <SectionHeading title="Related articles" linkLabel="All articles" href="/blog" />
          <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {post.relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} imageHeight="lg:h-[200px]" />
            ))}
          </div>
        </Container>
      )}
    </main>
  );
}
