'use client';

import { cn } from '@/lib/cn';

/**
 * Selectable card used as a radio button (package type, departure date).
 * Put several inside an element with role="radiogroup" and an aria-label.
 * Design: selected = 2px navy border on #F2F4F7, unselected = 1px border-line on white.
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
        'flex min-h-[60px] w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left text-ink transition lg:min-h-16',
        selected ? 'border-2 border-navy bg-selected' : 'border border-line bg-surface hover:border-input',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'size-[18px] shrink-0 rounded-full',
            selected ? 'border-[5px] border-navy' : 'border-2 border-[#B9BEC7]',
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
