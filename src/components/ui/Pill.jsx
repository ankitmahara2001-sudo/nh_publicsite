import { cn } from '@/lib/cn';

const TONES = {
  white: 'bg-white text-gold-text',
  gold: 'bg-gold text-navy',
  glass: 'bg-white/16 text-white',
  sand: 'bg-sand text-gold-text',
  navy: 'bg-navy text-white',
  success: 'bg-success-bg text-success',
  danger: 'bg-[#fbecea] text-danger',
  muted: 'bg-selected text-body',
};

/** Rounded label (badges on cards, status chips). */
export function Pill({ tone = 'white', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap lg:px-3 lg:text-[13px]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
