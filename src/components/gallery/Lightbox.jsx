'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const ROUND_BUTTON =
  'flex size-11 shrink-0 items-center justify-center rounded-full border border-footer-ring text-xl text-white transition hover:bg-white/10';

/**
 * Full-screen photo preview (design/Gallery "Photo preview"). A native modal <dialog>: it traps
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
      className="m-auto h-[min(720px,calc(100dvh-32px))] w-[calc(100vw-32px)] max-w-[1280px] max-h-none rounded-[var(--radius-panel)] bg-navy p-0 text-white backdrop:bg-black/75 lg:w-[calc(100vw-160px)]"
    >
      <div className="flex h-full flex-col gap-4 p-4 lg:p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[15px] font-bold lg:text-base">
            {photo.caption}
            {photo.place && <span className="font-normal text-footer-muted"> · {photo.place}</span>}
          </p>
          <div className="flex items-center gap-3">
            {hasMany && (
              <span className="text-sm text-footer-muted" aria-live="polite">
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

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
          <Image
            key={photo.id}
            src={photo.url}
            alt={photo.caption ?? ''}
            fill
            sizes="100vw"
            className="object-contain"
          />
          {hasMany && (
            <>
              <button
                type="button"
                onClick={() => show(index - 1)}
                aria-label="Previous photo"
                className={`${ROUND_BUTTON} absolute top-1/2 left-2 -translate-y-1/2 bg-navy/70`}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                onClick={() => show(index + 1)}
                aria-label="Next photo"
                className={`${ROUND_BUTTON} absolute top-1/2 right-2 -translate-y-1/2 bg-navy/70`}
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
