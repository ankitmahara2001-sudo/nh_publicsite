import { formatRupees, priceUnitLabel } from '@/domain/format';
import { cn } from '@/lib/cn';

/**
 * Selling price with the original struck through and the unit (design: ticket stub of a package card,
 * "From ~~₹20,000~~ / ₹16,999 / person"). Listed prices exclude GST (CLAUDE.md), so a small "+ GST" note can be shown.
 * `size`: "lg" (home card), "md" (packages grid), "sm" (compact).
 */
export function PriceTag({ price, size = 'md', showFrom = false, showGst = false, className }) {
  if (!price) return null;
  const amountClass = {
    lg: 'text-[21px] lg:text-[24px]',
    md: 'text-[21px] lg:text-[22px]',
    sm: 'text-xl',
  }[size];
  const struck = price.discountedPrice != null && price.originalPrice > price.sellingPrice;
  const unit = priceUnitLabel(price.priceType, price.label);
  return (
    <div className={cn('flex flex-col leading-[1.2]', className)}>
      {(showFrom || struck) && (
        <span className="text-xs text-muted lg:text-[13px]">
          {showFrom && 'From '}
          {struck && (
            <s>
              <span className="sr-only">was </span>
              {formatRupees(price.originalPrice)}
            </s>
          )}
        </span>
      )}
      <span className={cn('font-display', amountClass)}>
        {formatRupees(price.sellingPrice)}{' '}
        <span className="font-sans text-[13px] text-muted lg:text-sm">
          {unit.startsWith('per ') ? `/ ${unit.slice(4)}` : unit}
          {showGst && ' · + GST'}
        </span>
      </span>
    </div>
  );
}
