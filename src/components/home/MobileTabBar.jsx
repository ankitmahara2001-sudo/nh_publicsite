import Link from 'next/link';
import { enquiryHref } from '@/lib/enquiry';

const ICON = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const TAB = 'flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold';

/**
 * Floating quick-links bar on phones (design: Mobile-Home bottom tab bar). Plain links to existing
 * pages; `data-tabbar` lets the footer leave room for it (globals.css).
 */
export function MobileTabBar() {
  return (
    <nav
      aria-label="Quick links"
      data-tabbar
      className="fixed inset-x-3 bottom-4 z-30 flex items-center justify-between rounded-[22px] bg-navy/94 p-2 text-footer-text shadow-[0_16px_30px_-14px_rgba(0,0,0,.6)] backdrop-blur-sm lg:hidden"
    >
      <Link href="/" aria-current="page" className={`${TAB} font-bold text-gold-light`}>
        <svg {...ICON}>
          <path d="M2 20 L9 9 L13 15 L16 11 L22 20 Z" />
        </svg>
        Explore
      </Link>
      <Link href="/packages" className={TAB}>
        <svg {...ICON}>
          <path d="M3 8h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
          <path d="M14 8v10" strokeDasharray="2 2" />
        </svg>
        Packages
      </Link>
      <Link
        href={enquiryHref()}
        className="flex min-h-12 shrink-0 items-center rounded-2xl bg-gold px-[18px] text-sm font-extrabold text-ink"
      >
        Enquire
      </Link>
      <Link href="/gallery" className={TAB}>
        <svg {...ICON}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M21 16l-5-5-8 8" />
        </svg>
        Gallery
      </Link>
      <Link href="/account/bookings" className={TAB}>
        <svg {...ICON}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
        Account
      </Link>
    </nav>
  );
}
