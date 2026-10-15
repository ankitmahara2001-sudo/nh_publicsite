import Link from 'next/link';
import { cn } from '@/lib/cn';

// Design kit: Marigold is the one primary action per screen; Deodar and outline are secondary.
// Hover lifts 1px; the focus ring is the global 2px marigold outline. `className` must not repeat a
// property the variant/size already sets (cn() only joins classes; it does not resolve conflicts).
const VARIANTS = {
  primary: 'bg-navy text-page hover:bg-navy-2',
  accent: 'bg-gold text-ink hover:brightness-[1.06]',
  outline: 'border-[1.5px] border-navy bg-transparent text-ink hover:bg-selected',
  'outline-light': 'border border-page/45 text-page hover:bg-page/10',
  ghost: 'text-ink hover:bg-selected',
};

const SIZES = {
  sm: 'h-11 px-5 text-sm',
  md: 'h-11 px-[18px] text-sm lg:h-[50px] lg:px-6 lg:text-[15px]',
  lg: 'h-[52px] px-6 text-base lg:h-[54px] lg:px-7 lg:text-[17px]',
  // The caller passes its own height/padding/text classes (avoids conflicting utilities).
  custom: '',
};

export function buttonClasses({ variant = 'primary', size = 'md', block = false, className } = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
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
