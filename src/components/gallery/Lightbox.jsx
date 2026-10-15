'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const ROUND_BUTTON =
  'flex size-12 shrink-0 items-center justify-center rounded-full border border-page/40 text-[21px] text-page transition hover:bg-page/10';

/**
 * Full-screen photo preview, shown as a large polaroid (design: Gallery lightbox). A native modal <dialog>: it traps
 * focus, closes on Escape and hides the page from screen readers. Arrow keys move between photos.
 * The page behind is scroll-locked while it is open; focus returns to the opening tile (`onClose`).
 */
export function Lightbox({ photos, index, onIndexChange, onClose }) {
  const dialogRef = useRef(null);
  const photo = photos[index];
  const hasMany = photos.length > 1;

  const show = (next) => onIndexChange((next + photos.length) % photos.length);
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event) => {
    if (!hasMany) return;
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
  };

  // A click on the dialog element itself (not its content) is a click on the backdrop.
  const handleClick = (event) => {
    if (event.target === dialogRef.current) close();
  };

  const label = [photo.caption, photo.place].filter(Boolean).join(' · ') || 'Photo preview';

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className="m-auto h-[min(820px,calc(100dvh-32px))] w-[calc(100vw-32px)] max-w-[940px] max-h-none overflow-visible bg-transparent p-0 text-page backdrop:bg-[rgba(12,22,18,.92)]"
    >
      <div className="flex h-full flex-col gap-4 lg:gap-[18px]">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold tracking-[.16em] text-gold-light uppercase lg:text-[13px]">
            {photo.place || photo.caption}
          </p>
          <div className="flex items-center gap-3">
            {hasMany && (
              <span className="text-sm text-footer-text" aria-live="polite">
                {index + 1} / {photos.length}
              </span>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close preview"
              className={ROUND_BUTTON}
              autoFocus
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 -rotate-1 flex-col bg-white p-3 pb-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,.7)] lg:p-[18px] lg:pb-[26px]">
          <div className="relative min-h-0 flex-1 overflow-hidden bg-navy-2">
            <Image
              key={photo.id}
              src={photo.url}
              alt={photo.caption ?? ''}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-contain"
            />
          </div>
          {photo.caption && (
            <p className="mt-3 font-hand text-xl leading-snug text-ink lg:mt-4 lg:text-[22px]">
              {photo.caption}
            </p>
          )}
          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => show(index - 1)}
                aria-label="Previous photo"
                className={`${ROUND_BUTTON} absolute top-1/2 left-5 -translate-y-1/2 bg-navy/70 lg:left-7`}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                onClick={() => show(index + 1)}
                aria-label="Next photo"
                className={`${ROUND_BUTTON} absolute top-1/2 right-5 -translate-y-1/2 bg-navy/70 lg:right-7`}
              >
                <span aria-hidden="true">›</span>
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
