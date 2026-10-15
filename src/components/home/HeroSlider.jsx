'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

const AUTOPLAY_MS = 5000;
const pad = (n) => String(n).padStart(2, '0');

function ArrowButton({ direction, onClick, className }) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      onClick={onClick}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full transition',
        direction === 'prev'
          ? 'border border-page/40 text-page hover:bg-page/10'
          : 'bg-gold text-ink hover:brightness-[1.06]',
        className,
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d={direction === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  );
}

/**
 * Full-width hero photos that crossfade every 5 s, with the "Now showing" controller
 * (design: Main hero slide controller; Mobile-Home counter and dots).
 * Pauses while the "Up next" controls are hovered or keyboard-focused, and does not
 * auto-advance for prefers-reduced-motion.
 * `children` (header + hero text) is rendered above the photos.
 */
export function HeroSlider({ slides, children }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const controlsRef = useRef(null);
  const count = slides.length;

  const go = useCallback((step) => setCurrent((index) => (index + step + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Restarts on every slide change, so a manual change also gets the full 5 s.
  useEffect(() => {
    if (paused || reducedMotion || count < 2) return undefined;
    const timer = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, paused, reducedMotion, count, go]);

  const next = slides[(current + 1) % count];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}
      className="relative isolate flex min-h-[max(600px,100svh)] flex-col overflow-hidden bg-navy"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}: ${slide.caption ?? slide.title}`}
          aria-hidden={index !== current}
          className={cn(
            'absolute inset-0 -z-10 transition-opacity duration-[900ms] ease-in-out',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Image
            src={slide.imageUrl}
            alt=""
            fill
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/55 via-navy/15 to-navy/75"
      />

      {children}

      {/* Ridge silhouette into the page (design kit "Section edge"). */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 block h-10 w-full lg:h-16"
      >
        <path
          d="M0 60 L0 40 L80 22 L150 34 L240 8 L320 30 L420 14 L520 36 L610 18 L720 32 L820 6 L910 28 L1010 16 L1110 34 L1200 12 L1300 30 L1380 20 L1440 28 L1440 60 Z"
          fill="#f5f1e8"
        />
      </svg>

      {count > 1 && (
        // Pause only while the slider's own controls are in use: the hero fills the screen, so
        // pausing on hover of the whole hero would stop autoplay whenever the pointer is on it.
        // Keyboard focus pauses; a mouse click on an arrow (focus without :focus-visible) doesn't.
        <div className="pointer-events-none absolute inset-x-0 bottom-14 z-10 lg:bottom-24">
          <div className="mx-auto flex max-w-[1280px] justify-end px-5 lg:px-8">
            <div
              ref={controlsRef}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={(event) => event.target.matches(':focus-visible') && setPaused(true)}
              onBlur={(event) => !controlsRef.current?.contains(event.relatedTarget) && setPaused(false)}
              className="pointer-events-auto flex w-full items-center justify-between gap-4 text-page lg:w-auto lg:gap-[18px] lg:rounded-[18px] lg:bg-navy/72 lg:py-3.5 lg:pr-3.5 lg:pl-[22px] lg:backdrop-blur-md"
            >
              <div className="flex min-w-0 flex-col gap-2 lg:gap-0 lg:leading-tight">
                <span className="text-[13px] lg:text-[11px] lg:font-bold lg:tracking-[.2em] lg:text-gold-light lg:uppercase">
                  <span className="hidden lg:inline">Now showing · </span>
                  <span
                    aria-live="polite"
                    className="font-bold tracking-[.14em] text-gold-light lg:tracking-[inherit]"
                  >
                    {pad(current + 1)} / {pad(count)}
                  </span>
                  <span className="lg:hidden"> · Up next: {next.title}</span>
                </span>
                <span className="hidden font-display text-xl lg:block">{slides[current].title}</span>
                <span className="hidden text-[13px] text-footer-text lg:block">
                  {slides[current].region ? `${slides[current].region} · ` : ''}up next: {next.title}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2.5 lg:flex-row lg:items-center">
                <div className="flex items-center gap-0.5">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Show slide ${index + 1}: ${slide.title}`}
                      aria-current={index === current}
                      onClick={() => setCurrent(index)}
                      className="flex h-6 min-w-4 items-center justify-center px-0.5"
                    >
                      <span
                        className={cn(
                          'h-1.5 rounded-full transition-all',
                          index === current ? 'w-[22px] bg-gold' : 'w-1.5 bg-page/60',
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="hidden gap-2 lg:flex">
                  <ArrowButton direction="prev" onClick={() => go(-1)} className="size-11" />
                  <ArrowButton direction="next" onClick={() => go(1)} className="size-11" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
