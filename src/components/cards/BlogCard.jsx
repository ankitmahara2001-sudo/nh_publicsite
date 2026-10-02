import { BLOG_CATEGORY_LABELS, formatDate } from '@nh/shared';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { cn } from '@/lib/cn';

export function PostMeta({ post, className }) {
  return (
    <span className={cn('text-xs text-muted lg:text-[13px]', className)}>
      <span className="font-bold tracking-[1.2px] text-gold-text uppercase lg:tracking-[1.4px]">
        {BLOG_CATEGORY_LABELS[post.category]}
      </span>
      {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
    </span>
  );
}

/**
 * Blog post card. Desktop: photo on top (design/Blog grid, home "Guides for the road").
 * Phone: small square photo on the left (design/MobileBlog, MobileHome).
 */
export function BlogCard({ post, showExcerpt = false, imageHeight = 'lg:h-[220px]' }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-3.5 text-ink lg:flex-col lg:items-stretch lg:gap-3"
    >
      <div
        className={cn(
          'relative size-24 shrink-0 overflow-hidden rounded-[10px] lg:w-full lg:rounded-xl',
          imageHeight,
        )}
      >
        <Photo
          src={post.coverImageUrl}
          alt=""
          sizes="(min-width: 1024px) 400px, 104px"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1 lg:gap-3">
        <PostMeta post={post} />
        <h3 className="text-[15px] leading-[21px] font-bold group-hover:text-gold-text lg:text-xl lg:leading-7">
          {post.title}
        </h3>
        {showExcerpt && (
          <>
            <p className="hidden text-[15px] leading-6 text-muted lg:block">{post.excerpt}</p>
            <span className="hidden text-sm font-bold lg:block">Read more →</span>
          </>
        )}
      </div>
    </Link>
  );
}
