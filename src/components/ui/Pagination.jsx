import Link from 'next/link';
import { cn } from '@/lib/cn';

const MAX_VISIBLE_PAGES = 7;

/** Page numbers to show, with gaps when there are many pages: 1 … 4 5 6 … 12. */
function pageItems(page, totalPages) {
  if (totalPages <= MAX_VISIBLE_PAGES) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const items = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(totalPages - 1, page + 1);
  if (from > 2) items.push('gap-start');
  for (let n = from; n <= to; n += 1) items.push(n);
  if (to < totalPages - 1) items.push('gap-end');
  items.push(totalPages);
  return items;
}

const SQUARE = 'flex size-11 items-center justify-center rounded-[var(--radius-control)] font-bold';
const IDLE = 'border border-input hover:border-navy';

/** Prev / numbered / Next links (design/Blog.dc.html). `hrefFor(page)` builds each link. */
export function Pagination({ page, totalPages, hrefFor, className }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap justify-center gap-2', className)}>
      {page > 1 && (
        <Link href={hrefFor(page - 1)} aria-label="Previous page" className={cn(SQUARE, IDLE)}>
          <span aria-hidden="true">‹</span>
        </Link>
      )}
      {pageItems(page, totalPages).map((item) =>
        typeof item === 'number' ? (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Page ${item}`}
            className={cn(SQUARE, item === page ? 'bg-navy text-white' : IDLE)}
          >
            {item}
          </Link>
        ) : (
          <span key={item} aria-hidden="true" className={cn(SQUARE, 'text-muted')}>
            …
          </span>
        ),
      )}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} aria-label="Next page" className={cn(SQUARE, IDLE)}>
          <span aria-hidden="true">›</span>
        </Link>
      )}
    </nav>
  );
}
