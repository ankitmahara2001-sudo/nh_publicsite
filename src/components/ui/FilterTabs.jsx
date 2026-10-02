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
                'inline-flex h-11 items-center rounded-full border px-4 text-[13px] font-bold transition lg:px-5 lg:text-sm',
                item.active
                  ? 'border-navy bg-navy text-white'
                  : 'border-input bg-surface text-ink hover:border-navy',
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
