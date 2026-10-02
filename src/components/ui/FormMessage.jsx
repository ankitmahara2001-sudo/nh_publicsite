import { cn } from '@/lib/cn';

const TONES = {
  error: 'bg-[#fbecea] text-danger',
  success: 'bg-success-bg text-success-text',
  info: 'bg-sand-light text-body',
};

/**
 * Message above or below a form (API error, "Saved", "We sent a new code").
 * Errors use role="alert"; other tones are polite status updates for screen readers.
 */
export function FormMessage({ tone = 'error', className, children }) {
  if (!children) return null;
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-[var(--radius-control)] px-3.5 py-3 text-sm leading-[22px] font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
