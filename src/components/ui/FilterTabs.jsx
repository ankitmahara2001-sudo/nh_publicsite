import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Pill filters that are plain links (?region=, ?category=), so they work without JavaScript
 * (design: Destinations, Gallery and Blog tabs). Scrolls sideways on phones.
 * `items`: [{ key, label, href, active }].
 */
export function FilterTabs({ label, items, className }) {
  return (
    <nav
      aria-label={label}
      className={cn('no-scrollbar -mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0', className)}
    >
      <ul className="flex gap-2 lg:flex-wrap">
        {items.map((item) => (
          <li key={item.key} className="shrink-0">
            <Link
              href={item.href}
              scroll={false}
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'inline-flex h-11 items-center rounded-full border px-[18px] text-sm font-semibold transition lg:text-[15px]',
                item.active
                  ? 'border-navy bg-navy text-page'
                  : 'border-chip bg-transparent text-ink hover:border-navy',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
