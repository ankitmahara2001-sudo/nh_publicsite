import { cn } from '@/lib/cn';
import { CopyCodeButton } from './CopyCodeButton';
import { discountLabel, kindLabel, offerRules, validityLabel } from './offerText';

// Coupon colours (design: "Offers on the trail"): Snow coupons with a sand stub, alternating with
// Marigold coupons with a lighter marigold stub.
const TONES = {
  snow: {
    card: 'bg-page text-ink',
    eyebrow: 'text-pine',
    text: 'text-muted',
    label: 'text-muted',
    stub: 'border-[#c9bfa8] bg-stub',
  },
  marigold: {
    card: 'bg-gold text-ink',
    eyebrow: 'font-extrabold text-ink',
    text: 'text-[#2a1c0c]',
    label: 'font-extrabold text-ink',
    stub: 'border-navy/45 bg-gold-2',
  },
};

/** Alternates the coupon colour along a list of offers. */
export const offerTone = (index) => (index % 2 === 1 ? 'marigold' : 'snow');

/**
 * Two-part coupon: offer on the left, dashed tear line, code stub with "Copy code" on the right.
 * Stacks into a compact row on phones (design: Mobile-Home offers).
 */
function Coupon({ offer, tone = 'snow', title, eyebrow, lines, outlined = false }) {
  const t = TONES[tone];
  return (
    <article
      className={cn(
        'flex overflow-hidden rounded-[18px] lg:rounded-[20px]',
        t.card,
        outlined && tone === 'snow' && 'border border-line',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-[18px] lg:gap-2 lg:p-7">
        <span
          className={cn(
            'text-[11px] font-bold tracking-[.16em] uppercase lg:text-xs lg:tracking-[.18em]',
            t.eyebrow,
          )}
        >
          {eyebrow}
        </span>
        <span className="font-display text-[24px] leading-[1.1] lg:text-[34px] lg:leading-none">
          {discountLabel(offer)}
        </span>
        {title}
        <div className={cn('flex flex-col gap-0.5 text-[13px] lg:mt-auto lg:pt-2', t.text)}>{lines}</div>
      </div>
      <div
        className={cn(
          'flex w-[118px] shrink-0 flex-col items-center justify-center gap-1.5 border-l-2 border-dashed px-3 py-4 text-center sm:w-[180px] lg:w-[200px] lg:items-start lg:gap-2.5 lg:px-[22px] lg:py-7 lg:text-left',
          t.stub,
        )}
      >
        <span className={cn('hidden text-xs font-bold tracking-[.14em] uppercase lg:block', t.label)}>
          Use code
        </span>
        <span className="font-display text-lg tracking-[.06em] break-all lg:text-[24px]">{offer.code}</span>
        <CopyCodeButton code={offer.code} variant="pill" />
      </div>
    </article>
  );
}

/** Compact offer coupon on the dark band of the home page (design/Main "Offers on the trail"). */
export function OfferTeaserCard({ offer, tone = 'snow' }) {
  const t = TONES[tone];
  return (
    <Coupon
      offer={offer}
      tone={tone}
      eyebrow={kindLabel(offer) === 'Flat' ? 'Flat discount' : 'Coupon'}
      title={<span className={cn('text-[15px] lg:text-base', t.text)}>{offer.description}</span>}
      lines={
        <>
          <span>{offerRules(offer)[0]}</span>
          <span>{validityLabel(offer)}</span>
        </>
      }
    />
  );
}

/** Full offer coupon on the Offers page (design/Offers via the home coupons). */
export function OfferCard({ offer, tone = 'snow' }) {
  return (
    <Coupon
      offer={offer}
      tone={tone}
      outlined
      eyebrow={kindLabel(offer)}
      title={<h2 className="font-sans text-base leading-6 font-bold lg:text-[17px]">{offer.description}</h2>}
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
