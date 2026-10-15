'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Coupon code input with an Apply button (package booking card and booking summary).
 * `onApply(code)` receives the uppercased code; `result` is the quote's coupon result
 * ({ valid, message }) shown under the field.
 */
export function CouponField({ initialCode = '', onApply, result }) {
  const id = useId();
  const [value, setValue] = useState(initialCode);
  const messageId = `${id}-message`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        Coupon code <span className="font-medium text-muted">(optional)</span>
      </label>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onApply(value.trim().toUpperCase());
        }}
      >
        <input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
          placeholder="Try NORTH10"
          autoComplete="off"
          aria-describedby={messageId}
          aria-invalid={result && !result.valid ? true : undefined}
          className={cn(
            'h-12 min-w-0 flex-1 rounded-xl border-[1.5px] border-dashed px-3.5 text-[15px] font-bold tracking-[.06em] uppercase placeholder:font-medium placeholder:tracking-normal focus:border-pine focus:shadow-[0_0_0_4px_rgba(43,82,67,.15)] focus:outline-none',
            result && !result.valid
              ? 'border-danger bg-danger-bg'
              : result?.valid
                ? 'border-pine bg-success-bg'
                : 'border-chip bg-page',
          )}
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-navy px-[18px] text-sm font-bold text-page transition hover:bg-navy-2"
        >
          Apply
        </button>
      </form>
      <span
        id={messageId}
        aria-live="polite"
        className={cn('text-[13px] font-semibold', result?.valid ? 'text-success' : 'text-danger')}
      >
        {result?.message}
      </span>
    </div>
  );
}
