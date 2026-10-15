'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Single-open accordion (itinerary days, FAQs). `items`: [{ key, header (node), content (node), marker? }].
 * The open panel can be closed again; `defaultOpen` is an index or -1.
 * `variant="faq"`: paper cards (design "Good to know"). `variant="itinerary"`: the day-by-day trail —
 * a round `marker` ("01") per item, linked by a dashed line; the open day's marker is marigold.
 */
export function Accordion({ items, defaultOpen = 0, variant = 'faq' }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  const trail = variant === 'itinerary';

  return (
    <div className={cn('flex flex-col', !trail && 'gap-2.5')}>
      {items.map((item, index) => {
        const isOpen = index === open;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        const last = index === items.length - 1;
        return (
          <div
            key={item.key}
            className={cn(
              trail
                ? cn(
                    'relative',
                    !last &&
                      'pb-7 before:absolute before:top-[64px] before:bottom-1.5 before:left-[25px] before:border-l-2 before:border-dashed before:border-chip',
                  )
                : 'overflow-hidden rounded-2xl border border-line bg-surface',
            )}
          >
            <h3 className="font-sans">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={cn(
                  'flex w-full items-center text-left font-sans text-ink',
                  trail
                    ? 'min-h-[52px] gap-4 lg:gap-5'
                    : 'min-h-14 justify-between gap-3 px-[18px] py-3.5 text-[17px] font-bold lg:gap-4 lg:px-[22px] lg:py-[18px]',
                )}
              >
                {trail && item.marker && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-[52px] shrink-0 items-center justify-center rounded-full font-display text-lg',
                      isOpen
                        ? 'bg-gold text-ink'
                        : last
                          ? 'border-2 border-navy bg-surface text-ink'
                          : 'bg-navy text-gold-light',
                    )}
                  >
                    {item.marker}
                  </span>
                )}
                <span className="flex-1">{item.header}</span>
                <span aria-hidden="true" className="w-5 text-center text-xl text-muted">
                  {isOpen ? '–' : '+'}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
