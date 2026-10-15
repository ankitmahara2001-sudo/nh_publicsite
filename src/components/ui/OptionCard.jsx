'use client';

import { cn } from '@/lib/cn';

/**
 * Selectable card used as a radio button (package type, departure date).
 * Put several inside an element with role="radiogroup" and an aria-label.
 * Design: selected = 1.5px pine border on mint (#E4ECE6), unselected = 1.5px sand border on paper.
 */
export function OptionCard({ selected, onSelect, disabled = false, title, note, aside, className }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        'flex min-h-[60px] w-full items-center justify-between gap-3 rounded-[var(--radius-control)] border-[1.5px] px-3.5 py-3 text-left text-ink transition lg:min-h-16',
        selected ? 'border-pine bg-success-bg' : 'border-input bg-page hover:border-chip',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'size-[18px] shrink-0 rounded-full',
            selected ? 'border-[5px] border-pine' : 'border-2 border-chip',
          )}
        />
        <span className="flex flex-col">
          <span className="text-[15px] font-bold">{title}</span>
          {note && <span className="text-xs text-muted lg:text-[13px]">{note}</span>}
        </span>
      </span>
      {aside && <span className="flex flex-col items-end">{aside}</span>}
    </button>
  );
}
