import { cn } from '@/lib/cn';

export const BOOKING_STEPS = ['Trip details', 'Traveller details', 'Payment'];

/**
 * Step indicator (design/Booking.dc.html boxes on desktop, MobileBooking.dc.html bars on phones).
 * `step` is 1-based.
 */
export function BookingSteps({ step }) {
  return (
    <ol aria-label="Booking steps" className="flex gap-1.5 lg:gap-3">
      {BOOKING_STEPS.map((label, index) => {
        const number = index + 1;
        const done = number < step;
        const current = number === step;
        return (
          <li
            key={label}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'flex flex-1 flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-3 lg:rounded-xl lg:border lg:px-[18px] lg:py-3.5',
              current ? 'lg:border-navy lg:bg-surface' : 'lg:border-line',
            )}
          >
            <span
              aria-hidden="true"
              className={cn('h-1 rounded-sm lg:hidden', done || current ? 'bg-navy' : 'bg-line')}
            />
            <span
              aria-hidden="true"
              className={cn(
                'hidden size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold lg:flex',
                done || current ? 'bg-navy text-white' : 'bg-line text-muted',
              )}
            >
              {done ? '✓' : number}
            </span>
            <span
              className={cn(
                'text-xs font-bold lg:text-[15px]',
                done || current ? 'text-ink' : 'text-muted',
              )}
            >
              {label}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
