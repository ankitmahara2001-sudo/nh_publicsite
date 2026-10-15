import { BLOG_CATEGORY_LABELS } from '@/domain/enums';
import { formatDate } from '@/domain/format';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { ArrowIcon } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

function postMeta(post) {
  return [BLOG_CATEGORY_LABELS[post.category], post.publishedAt && formatDate(post.publishedAt)]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Blog post card. Desktop: paper card with the photo on top, a "Guides · date" pill, Kalam
 * "field notes —" and a serif title (design: Main blog card). Phone: photo on the left
 * (design: Mobile-Home blog row).
 */
export function BlogCard({ post, showExcerpt = false, imageHeight = 'lg:h-[220px]' }) {
  const meta = postMeta(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="lift group flex overflow-hidden rounded-3xl border border-line bg-surface text-ink lg:flex-col lg:rounded-[28px]"
    >
      <div
        className={cn(
          'relative min-h-[140px] w-[120px] shrink-0 overflow-hidden bg-placeholder lg:min-h-0 lg:w-full',
          imageHeight,
        )}
      >
        <Photo
          src={post.coverImageUrl}
          alt=""
          sizes="(min-width: 1024px) 420px, 120px"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3.5 left-3.5 hidden rounded-full bg-surface px-3 py-1.5 text-xs font-bold tracking-[.12em] uppercase lg:block">
          {meta}
        </span>
      </div>
      <div className="flex flex-col justify-center gap-1 px-[18px] py-4 lg:gap-2.5 lg:px-[26px] lg:pt-6 lg:pb-7">
        <span className="text-[11px] font-bold tracking-[.14em] text-pine uppercase lg:hidden">{meta}</span>
        <span aria-hidden="true" className="hidden font-hand text-xl text-gold-text lg:block">
          field notes —
        </span>
        <h3 className="text-[19px] leading-[1.15] group-hover:text-gold-text lg:text-[22px] lg:leading-[1.1]">
          {post.title}
        </h3>
        {showExcerpt && post.excerpt && (
          <p className="hidden text-[15px] leading-6 text-muted lg:block">{post.excerpt}</p>
        )}
        <span className="inline-flex items-center gap-2 text-sm font-bold text-gold-text lg:mt-1.5 lg:text-base lg:text-ink">
          Read the guide
          <ArrowIcon size={16} />
        </span>
      </div>
    </Link>
  );
}
