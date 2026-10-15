import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

// The mark's "NH" letters are navy, so dark backgrounds (header, footer, menu, login scene) use a
// copy with white letters; the gold mountains are the same in both.
const MARK_SRC = { dark: '/logo-mark.png', light: '/logo-mark-light.png' };
const MARK_WIDTH = 233;
const MARK_HEIGHT = 144;

/** @param {{ tone?: 'dark' | 'light', className?: string }} props */
export function LogoMark({ tone = 'dark', className }) {
  return (
    <Image
      src={MARK_SRC[tone]}
      alt=""
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      unoptimized
      loading="eager"
      className={cn('h-9 w-auto shrink-0 lg:h-11', className)}
    />
  );
}

/** @param {{ name: string, tone?: 'dark' | 'light', className?: string }} props */
export function Logo({ name, tone = 'dark', className }) {
  return (
    <Link
      href="/"
      aria-label={`${name} home`}
      className={cn(
        'flex items-center gap-2 lg:gap-2.5',
        tone === 'light' ? 'text-page' : 'text-ink',
        className,
      )}
    >
      <LogoMark tone={tone} />
      <span className="font-display text-[19px] leading-none lg:text-[20px]">{name}</span>
    </Link>
  );
}
