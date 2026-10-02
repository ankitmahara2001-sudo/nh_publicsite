import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/lib/cn';

/** "Home / Packages / Kedarnath Yatra". `items`: [{ label, href? }] — the last item is the current page. */
export function Breadcrumb({ items, light = true, className }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('text-[13px] lg:text-sm', light ? 'text-white/75' : 'text-muted', className)}
    >
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span aria-hidden="true"> &nbsp;/&nbsp; </span>}
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
