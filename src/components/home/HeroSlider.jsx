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
        'flex shrink-0 items-center justify-center rounded-full border border-white/35 text-white hover:bg-white/10',
        className,
      )}
    >
      <svg
        width="16"
        height="16"
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
 * Full-width hero photos that crossfade every 5 s, with the "Up next" card (design/Main.dc.html).
 * Pauses while hovered or focused and does not auto-advance for prefers-reduced-motion.
 * `children` (header + hero text) is rendered above the photos.
 */
export function HeroSlider({ slides, children }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const regionRef = useRef(null);
  const count = slides.length;

  const go = useCallback((step) => setCurrent((index) => (index + step + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return undefined;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, count, go]);

  const next = slides[(current + 1) % count];

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => !regionRef.current?.contains(event.relatedTarget) && setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-navy"
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
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/60 via-navy/10 to-navy/80"
      />

      {children}

      {count > 1 && (
        <div className="absolute right-4 bottom-5 z-10 flex w-[220px] flex-col gap-2.5 rounded-xl border border-white/16 bg-navy/80 p-2.5 text-white backdrop-blur-sm lg:right-20 lg:bottom-24 lg:w-[340px] lg:gap-3.5 lg:rounded-[var(--radius-card)] lg:p-4">
          <div className="flex items-center gap-2.5 lg:gap-3.5">
            <div
              aria-hidden="true"
              className="relative size-[52px] shrink-0 overflow-hidden rounded-lg lg:size-[84px] lg:rounded-[10px]"
            >
              <Image src={next.imageUrl} alt="" fill sizes="84px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col lg:gap-0.5">
              <span className="text-[10px] font-bold tracking-[1.4px] text-gold-light lg:text-xs lg:tracking-[1.6px]">
                UP NEXT
              </span>
              <span className="truncate text-[15px] font-bold lg:text-lg">{next.title}</span>
              <span className="hidden text-[13px] text-white/70 lg:block">{next.region}, Uttarakhand</span>
            </div>
            <ArrowButton direction="next" onClick={() => go(1)} className="size-11 lg:hidden" />
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <span className="text-[11px] font-bold lg:w-[52px] lg:text-[13px]" aria-live="polite">
              {pad(current + 1)} / {pad(count)}
            </span>
            <div className="flex flex-1 gap-1 lg:gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-current={index === current}
                  onClick={() => setCurrent(index)}
                  className="flex h-3 flex-1 items-center"
                >
                  <span
                    className={cn(
                      'h-[3px] w-full rounded-sm transition-colors',
                      index === current ? 'bg-gold' : 'bg-white/30',
                    )}
                  />
                </button>
              ))}
            </div>
            <ArrowButton direction="prev" onClick={() => go(-1)} className="hidden size-9 lg:flex" />
            <ArrowButton direction="next" onClick={() => go(1)} className="hidden size-9 lg:flex" />
          </div>
        </div>
      )}
    </section>
  );
}
