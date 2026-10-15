import { cn } from '@/lib/cn';
import { CopyCodeButton } from './CopyCodeButton';
import { discountLabel, kindLabel, offerRules, validityLabel } from './offerText';

// Light coupon palettes: a pale ticket, a deeper pastel stub and one strong accent for the discount.
const TONES = {
  peach: {
    card: 'bg-[#fff4ec]',
    accent: 'text-[#e0612b]',
    stub: 'bg-[#ffdcc4]',
    bar: '#e0612b',
  },
  mint: {
    card: 'bg-[#eafaf5]',
    accent: 'text-[#0f9384]',
    stub: 'bg-[#c4eee3]',
    bar: '#0f9384',
  },
  lavender: {
    card: 'bg-[#f3efff]',
    accent: 'text-[#6a4bd0]',
    stub: 'bg-[#dcd2fb]',
    bar: '#6a4bd0',
  },
  butter: {
    card: 'bg-[#fff9e3]',
    accent: 'text-[#c98a00]',
    stub: 'bg-[#ffe8a3]',
    bar: '#b07800',
  },
};
const TONE_ORDER = ['peach', 'mint', 'lavender', 'butter'];

/** Cycles the coupon colours along a list of offers. */
export const offerTone = (index) => TONE_ORDER[index % TONE_ORDER.length];

/** Decorative barcode drawn from the code's characters, so every coupon gets its own pattern. */
function Barcode({ code, color }) {
  const widths = Array.from(`${code}*${code}`).map((char) => 1 + (char.charCodeAt(0) % 3));
  let x = 0;
  const bars = widths.map((width, index) => {
    const bar = { x, width };
    x += width + 1.5 + (index % 2);
    return bar;
  });
  return (
    <svg
      viewBox={`0 0 ${x} 30`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-7 w-full max-w-[120px] lg:h-8"
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.width} height="30" fill={color} />
      ))}
    </svg>
  );
}

/**
 * Two-part coupon ticket: the offer on the left, a stub with a scalloped tear edge on the right
 * holding the code, a barcode and "Copy code". Wobbles for a second on hover (globals.css `.coupon`).
 */
function Coupon({ offer, tone = 'peach', title, eyebrow, lines }) {
  const t = TONES[tone] ?? TONES.peach;
  return (
    <article
      className={cn(
        'coupon relative flex overflow-hidden rounded-[18px] text-ink shadow-[0_18px_40px_-24px_rgba(18,38,31,.5)]',
        t.card,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3 p-[18px] lg:gap-4 lg:p-7">
        <span
          aria-hidden="true"
          className={cn(
            'hidden shrink-0 rotate-180 text-[10px] font-bold tracking-[.22em] uppercase [writing-mode:vertical-rl] sm:block',
            t.accent,
          )}
        >
          Limited time only
        </span>
        <div className="flex min-w-0 flex-col gap-1 lg:gap-1.5">
          <span className={cn('text-[11px] font-bold tracking-[.18em] uppercase lg:text-xs', t.accent)}>
            {eyebrow}
          </span>
          <span
            className={cn(
              'font-display text-[30px] leading-[.95] font-extrabold uppercase lg:text-[44px]',
              t.accent,
            )}
          >
            {discountLabel(offer)}
          </span>
          {title}
          <div className="flex flex-col gap-0.5 text-[13px] text-muted lg:mt-auto lg:pt-1.5">{lines}</div>
        </div>
      </div>
      <div
        className={cn(
          'coupon-stub flex w-[128px] shrink-0 flex-col items-center justify-center gap-2 py-5 pr-3 pl-5 text-center sm:w-[176px] lg:w-[196px] lg:gap-2.5 lg:pr-4 lg:pl-7',
          t.stub,
        )}
      >
        <span className="text-[10px] font-bold tracking-[.18em] text-ink/70 uppercase lg:text-[11px]">
          Use code
        </span>
        <span className="font-display text-lg leading-none font-extrabold tracking-[.06em] break-all lg:text-[24px]">
          {offer.code}
        </span>
        <Barcode code={offer.code} color={t.bar} />
        <CopyCodeButton code={offer.code} variant="pill" />
      </div>
    </article>
  );
}

/** Compact offer coupon on the dark band of the home page. */
export function OfferTeaserCard({ offer, tone = 'peach' }) {
  return (
    <Coupon
      offer={offer}
      tone={tone}
      eyebrow={kindLabel(offer) === 'Flat' ? 'Flat discount' : 'Coupon'}
      title={<span className="text-[15px] font-semibold lg:text-base">{offer.description}</span>}
      lines={
        <>
          <span>{offerRules(offer)[0]}</span>
          <span>{validityLabel(offer)}</span>
        </>
      }
    />
  );
}

/** Full offer coupon on the Offers page. */
export function OfferCard({ offer, tone = 'peach' }) {
  return (
    <Coupon
      offer={offer}
      tone={tone}
      eyebrow={kindLabel(offer)}
      title={
        <h2 className="font-sans text-base leading-6 font-bold tracking-normal lg:text-[17px]">
          {offer.description}
        </h2>
      }
      lines={
        <ul className="flex list-disc flex-col gap-0.5 pl-[18px] text-[13px] lg:text-sm">
          {offerRules(offer).map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
          <li>{validityLabel(offer)}</li>
        </ul>
      }
    />
  );
}
