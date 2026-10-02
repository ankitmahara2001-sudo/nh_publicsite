'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * − value + counter for travellers (design: booking card and booking step 1).
 * Controlled: `value` + `onChange(number)`; `note` is the small line under the label ("12 years and above").
 */
export function NumberStepper({ label, note, value, onChange, min = 0, max = 20, error, className }) {
  const id = useId();
  const button =
    'flex size-11 items-center justify-center rounded-full border border-input bg-surface text-lg text-ink transition hover:border-navy disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div role="group" aria-labelledby={`${id}-label`} className="flex items-center justify-between gap-3">
        <span className="flex flex-col">
          <span id={`${id}-label`} className="text-[15px] font-bold">
            {label}
          </span>
          {note && <span className="text-xs text-muted">{note}</span>}
        </span>
        <span className="flex items-center gap-2.5 lg:gap-3.5">
          <button
            type="button"
            className={button}
            aria-label={`Fewer ${label.toLowerCase()}`}
            disabled={value <= min}
            onClick={() => onChange(value - 1)}
          >
            −
          </button>
          <output
            aria-live="polite"
            aria-label={`${label}: ${value}`}
            className="min-w-5 text-center text-[17px] font-extrabold"
          >
            {value}
          </output>
          <button
            type="button"
            className={button}
            aria-label={`More ${label.toLowerCase()}`}
            disabled={value >= max}
            onClick={() => onChange(value + 1)}
          >
            +
          </button>
        </span>
      </div>
      {error && <span className="text-[13px] font-semibold text-danger">{error}</span>}
    </div>
  );
}
