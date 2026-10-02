'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Single-open accordion (itinerary days, FAQs). `items`: [{ key, header (node), content (node) }].
 * The open panel can be closed again; `defaultOpen` is an index or -1.
 */
export function Accordion({ items, defaultOpen = 0, variant = 'faq' }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2.5 lg:gap-3">
      {items.map((item, index) => {
        const isOpen = index === open;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.key} className="overflow-hidden rounded-xl border border-line bg-surface">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className={cn(
                  'flex w-full items-center gap-3 text-left text-ink lg:gap-4',
                  variant === 'itinerary'
                    ? 'min-h-14 px-3.5 py-3 lg:min-h-16 lg:px-5 lg:py-4'
                    : 'min-h-[52px] justify-between px-3.5 py-3 lg:min-h-14 lg:px-5 lg:py-3.5',
                )}
              >
                <span className="flex-1">{item.header}</span>
                <span aria-hidden="true" className="text-lg text-muted lg:text-xl">
                  {isOpen ? '−' : '+'}
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
