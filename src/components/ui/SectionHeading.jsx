import Link from 'next/link';
import { cn } from '@/lib/cn';

/** Arrow used after "View all" style links and on CTA buttons (design kit icon). */
export function ArrowIcon({ size = 18, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Handwritten Kalam aside shown above headings ("pick a valley —"). Design rule: only short asides
 * above headings and captions, never body text. `light` is for dark backgrounds.
 */
export function Overline({ children, light = false, dash = true, className }) {
  return (
    <span
      className={cn(
        'font-hand text-lg leading-snug lg:text-[20px]',
        light ? 'text-gold-light' : 'text-gold-text',
        className,
      )}
    >
      {children}
      {dash && <span aria-hidden="true"> —</span>}
    </span>
  );
}

/** Small uppercase label (design kit "Eyebrow label · 12 / 700 / +0.2em"). */
export function Eyebrow({ children, light = false, className }) {
  return (
    <span
      className={cn(
        'text-xs font-bold tracking-[.16em] uppercase',
        light ? 'text-gold-light' : 'text-pine',
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Kalam aside + serif H2 + optional "View all →" link, as used by every home page section.
 * `light` is for sections on the dark Deodar background.
 */
export function SectionHeading({ overline, title, linkLabel, href, light = false, className }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-x-6 gap-y-3', className)}>
      <div className="flex max-w-[620px] flex-col gap-1 lg:gap-2">
        {overline && <Overline light={light}>{overline}</Overline>}
        <h2 className="text-[24px] leading-[1.1] lg:text-[clamp(28px,3.2vw,40px)] lg:leading-[1.05]">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 border-b-2 border-gold pb-1 text-[15px] font-bold',
            light ? 'text-page hover:text-gold-light' : 'text-ink hover:text-gold-text',
          )}
        >
          {linkLabel}
          <ArrowIcon />
        </Link>
      )}
    </div>
  );
}
