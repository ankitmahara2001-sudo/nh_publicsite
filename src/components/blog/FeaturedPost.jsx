import { BLOG_CATEGORY_LABELS, formatDate } from '@nh/shared';
import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';

/** Large "Featured" article on top of the blog list (design/Blog + MobileBlog). */
export function FeaturedPost({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-2.5 border-b border-line pb-[22px] text-ink lg:grid lg:grid-cols-[1.3fr_1fr] lg:gap-0 lg:overflow-hidden lg:rounded-[var(--radius-panel)] lg:border lg:bg-surface lg:pb-0"
    >
      <div className="relative h-[210px] overflow-hidden rounded-[var(--radius-card)] lg:h-[380px] lg:rounded-none">
        <Photo
          src={post.coverImageUrl}
          alt=""
          priority
          sizes="(min-width: 1024px) 720px, 100vw"
          className="transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col justify-center gap-2.5 lg:gap-4 lg:p-10">
        <span className="text-xs text-muted lg:text-[13px]">
          <span className="font-bold tracking-[1.2px] text-gold-text uppercase lg:tracking-[1.4px]">
            Featured<span className="hidden lg:inline"> · {BLOG_CATEGORY_LABELS[post.category]}</span>
          </span>
          {post.publishedAt && ` · ${formatDate(post.publishedAt)}`}
          {post.readMinutes ? ` · ${post.readMinutes} min read` : ''}
        </span>
        <h2 className="text-[22px] leading-7 font-extrabold group-hover:text-gold-text lg:text-[32px] lg:leading-10 lg:tracking-[-0.8px]">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm leading-[22px] text-muted lg:text-base lg:leading-[26px] lg:text-body">
            {post.excerpt}
          </p>
        )}
        <span className="hidden text-[15px] font-bold lg:block">
          Read article <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
