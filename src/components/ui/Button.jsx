import Link from 'next/link';
import { cn } from '@/lib/cn';

const VARIANTS = {
  primary: 'bg-navy text-white hover:bg-navy-2',
  accent: 'bg-gold text-navy hover:brightness-95',
  outline: 'border border-navy bg-surface text-navy hover:bg-selected',
  'outline-light': 'border border-white/60 text-white hover:bg-white/10',
  ghost: 'text-navy hover:bg-selected',
};

const SIZES = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-11 px-[18px] text-sm lg:h-[50px] lg:px-6 lg:text-[15px]',
  lg: 'h-12 px-6 text-[15px] lg:h-[52px] lg:px-7 lg:text-base',
  // The caller passes its own height/padding/text classes (avoids conflicting utilities).
  custom: '',
};

export function buttonClasses({ variant = 'primary', size = 'md', block = false, className } = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    block && 'w-full',
    className,
  );
}

/** Pill button. Renders a Next.js <Link> when `href` is given, otherwise a <button>. */
export function Button({ href, variant, size, block, className, children, type = 'button', ...props }) {
  const classes = buttonClasses({ variant, size, block, className });
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
