import { BLOG_CATEGORY_LABELS } from '@/domain/enums';
import { formatDate } from '@/domain/format';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { ArrowIcon } from '@/components/ui/SectionHeading';

/** Large featured article on top of the blog list: photo banner with the title over it (design: Blog board). */
export function FeaturedPost({ post }) {
  const meta = [
    post.publishedAt && formatDate(post.publishedAt),
    post.readMinutes && `${post.readMinutes} min read`,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative isolate flex min-h-[380px] items-end overflow-hidden rounded-3xl bg-navy-2 text-page lg:min-h-[440px] lg:rounded-[30px]"
    >
      <Photo
        src={post.coverImageUrl}
        alt=""
        priority
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="-z-10 transition duration-500 group-hover:scale-[1.03]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent"
      />
      <div className="flex max-w-[820px] flex-col gap-3 p-6 lg:px-11 lg:py-10">
        <span className="flex flex-wrap gap-2.5 text-xs font-bold tracking-[.12em] uppercase lg:text-[13px]">
          <span className="rounded-full bg-gold px-3 py-[5px] text-ink">
            Featured · {BLOG_CATEGORY_LABELS[post.category]}
          </span>
          {meta && <span className="rounded-full bg-navy/80 px-3 py-[5px]">{meta}</span>}
        </span>
        <h2 className="text-[24px] leading-[1.06] lg:text-[clamp(28px,3.4vw,44px)] lg:leading-[1.04]">
          {post.title}
        </h2>
        {post.excerpt && <p className="max-w-[640px] text-page/85 lg:text-lg">{post.excerpt}</p>}
        <span className="inline-flex items-center gap-2 font-bold text-gold-light">
          Read article
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
