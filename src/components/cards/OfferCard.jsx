import { Pill } from '@/components/ui/Pill';
import { cn } from '@/lib/cn';
import { CopyCodeButton } from './CopyCodeButton';
import { discountLabel, kindLabel, offerRules, validityLabel } from './offerText';

function CodeChip({ code, large }) {
  return (
    <span
      className={cn(
        'rounded-lg border border-dashed border-gold bg-sand-light font-extrabold text-gold-text',
        large
          ? 'px-3.5 py-2 text-[15px] tracking-[1px]'
          : 'px-2.5 py-1.5 text-[13px] tracking-[0.8px] lg:px-3.5 lg:py-[7px] lg:text-sm lg:tracking-[1px]',
      )}
    >
      {code}
    </span>
  );
}

/** Compact offer card on the sand band of the home page (design/Main "Offers for you"). */
export function OfferTeaserCard({ offer }) {
  const terms = [offerRules(offer)[0], validityLabel(offer)].join(' · ');
  return (
    <div className="flex w-[270px] shrink-0 flex-col gap-2 rounded-[var(--radius-card)] bg-surface p-4 lg:w-auto lg:gap-2.5 lg:p-[22px]">
      <span className="text-[22px] font-extrabold text-navy lg:text-[28px]">{discountLabel(offer)}</span>
      <span className="text-sm font-bold lg:text-base">{offer.description}</span>
      <span className="text-xs text-muted lg:text-[13px]">{terms}</span>
      <div className="mt-auto flex items-center justify-between border-t border-dashed border-dash pt-2.5 lg:pt-3">
        <CodeChip code={offer.code} />
        <CopyCodeButton code={offer.code} />
      </div>
    </div>
  );
}

/** Full offer card on the Offers page (design/Offers.dc.html). */
export function OfferCard({ offer }) {
  return (
    <article className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[30px] font-extrabold text-navy">{discountLabel(offer)}</span>
        <Pill tone="sand">{kindLabel(offer)}</Pill>
      </div>
      <h2 className="text-[17px] leading-6 font-bold">{offer.description}</h2>
      <ul className="flex list-disc flex-col gap-1 pl-[18px] text-sm text-muted">
        {offerRules(offer).map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
        <li>{validityLabel(offer)}</li>
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-dash pt-3.5">
        <CodeChip code={offer.code} large />
        <CopyCodeButton code={offer.code} variant="pill" />
      </div>
    </article>
  );
}
