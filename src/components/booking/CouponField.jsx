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
      <label htmlFor={id} className="text-sm font-bold">
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
            'h-[46px] min-w-0 flex-1 rounded-[var(--radius-control)] border bg-surface px-3.5 text-[15px] uppercase focus:border-navy',
            result && !result.valid ? 'border-danger' : 'border-input',
          )}
        />
        <button
          type="submit"
          className="h-[46px] shrink-0 rounded-[var(--radius-control)] border border-navy bg-surface px-[18px] text-sm font-bold text-navy hover:bg-selected"
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
