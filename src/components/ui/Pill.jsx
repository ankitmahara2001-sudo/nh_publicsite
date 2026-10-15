import { cn } from '@/lib/cn';

// Badges & tags (design kit): Buransh "Featured", Marigold "20% off", Deodar altitude chips,
// sand "3 days · 2 nights" tags.
const TONES = {
  white: 'bg-surface text-ink',
  gold: 'bg-gold tracking-[.1em] text-ink uppercase',
  buransh: 'bg-buransh tracking-[.1em] text-white uppercase',
  glass: 'bg-navy/80 text-page',
  sand: 'bg-sand text-ink',
  navy: 'bg-navy text-page',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  muted: 'bg-selected text-body',
};

const SIZES = {
  sm: 'text-xs font-bold',
  md: 'text-[13px] font-semibold',
};

/** Rounded label (badges on cards, status chips). `size="md"` is the larger tag (rating, duration). */
export function Pill({ tone = 'white', size = 'sm', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-[5px] whitespace-nowrap lg:px-3 lg:py-1.5',
        SIZES[size],
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
