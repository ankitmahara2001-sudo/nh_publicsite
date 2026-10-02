import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Overline({ children, light = false, className }) {
  return (
    <span
      className={cn(
        'text-[11px] font-bold tracking-[2px] uppercase lg:text-xs lg:tracking-[2.4px]',
        light ? 'text-gold-light' : 'text-gold-text',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Overline + H2 + optional "View all →" link, as used by every home page section.
 * On phones the overline is hidden (as in the mobile design) unless `overlineOnMobile`.
 */
export function SectionHeading({ overline, title, linkLabel, href, overlineOnMobile = false, className }) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="flex flex-col gap-2.5">
        {overline && <Overline className={overlineOnMobile ? '' : 'hidden lg:inline'}>{overline}</Overline>}
        <h2 className="text-2xl leading-[30px] font-extrabold tracking-[-0.5px] lg:text-[36px] lg:leading-[44px] lg:tracking-[-1px]">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-2 text-sm font-bold text-navy hover:text-gold-text lg:text-[15px]"
        >
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
