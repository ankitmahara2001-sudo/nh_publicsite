import { BLOG_CATEGORY_LABELS } from '@/domain/enums';
import { formatDate } from '@/domain/format';
import { notFound } from 'next/navigation';
import { ArticleSidebar } from '@/components/blog/ArticleSidebar';
import { BlogCard } from '@/components/cards/BlogCard';
import { Avatar } from '@/components/cards/ReviewCard';
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
    post.publishedAt && formatDate(post.publishedAt),
    post.readMinutes && `${post.readMinutes} min read`,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <>
      <Header variant="solid" active="blog" />
      <Container className="pt-6 lg:pt-14">
        <Breadcrumb
          light={false}
          className="mb-4"
          items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: category }]}
        />
        <section className="relative isolate flex min-h-[340px] items-end overflow-hidden rounded-3xl bg-navy-2 text-page lg:min-h-[440px] lg:rounded-[30px]">
          <Photo
            src={post.coverImageUrl}
            alt=""
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent"
          />
          <div className="flex max-w-[860px] flex-col gap-3 p-6 lg:px-11 lg:py-10">
            <p className="flex flex-wrap gap-2.5 text-xs font-bold tracking-[.12em] uppercase lg:text-[13px]">
              <span className="rounded-full bg-gold px-3 py-[5px] text-ink">{category}</span>
              {meta && <span className="rounded-full bg-navy/80 px-3 py-[5px]">{meta}</span>}
            </p>
            <h1 className="text-[26px] leading-[1.06] lg:text-[clamp(28px,3.4vw,44px)] lg:leading-[1.04]">
              {post.title}
            </h1>
          </div>
        </section>
      </Container>
    </>
  );
}

function AuthorRow({ post }) {
  if (!post.authorName) return null;
  return (
    <div className="flex items-center gap-3">
      <Avatar name={post.authorName} />
      <span className="flex flex-col leading-[1.3]">
        <span className="font-bold">{post.authorName}</span>
        {post.authorRole && <span className="text-sm text-muted">{post.authorRole}</span>}
      </span>
    </div>
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
          'grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:pt-12',
          post.relatedPosts.length === 0 && 'pb-14 lg:pb-[110px]',
        )}
      >
        <div className="flex min-w-0 max-w-[760px] flex-col gap-6">
          <AuthorRow post={post} />
          <article
            className="prose-article min-w-0 [&>p:first-child]:font-display [&>p:first-child]:text-[20px] [&>p:first-child]:leading-[1.4] [&>p:first-child]:text-ink lg:[&>p:first-child]:text-[22px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
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
          className="flex flex-col gap-4 py-14 lg:gap-10 lg:py-[110px]"
        >
          <SectionHeading
            overline="keep reading"
            title="Related articles"
            linkLabel="All articles"
            href="/blog"
          />
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-7 lg:grid-cols-3">
            {post.relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} imageHeight="lg:h-[200px]" />
            ))}
          </div>
        </Container>
      )}
    </main>
  );
}
