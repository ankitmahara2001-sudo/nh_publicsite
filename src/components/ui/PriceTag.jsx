import { formatRupees, priceUnitLabel } from '@nh/shared';
import { cn } from '@/lib/cn';

/**
 * Selling price with the original struck through and the unit underneath ("per person").
 * Listed prices exclude GST (CLAUDE.md), so a small "+ GST" note can be shown.
 * `size`: "lg" (home card), "md" (packages grid), "sm" (compact).
 */
export function PriceTag({ price, size = 'md', showFrom = false, showGst = false, className }) {
  if (!price) return null;
  const amountClass = { lg: 'text-[19px] lg:text-[22px]', md: 'text-[19px] lg:text-xl', sm: 'text-[17px]' }[
    size
  ];
  const struck = price.discountedPrice != null && price.originalPrice > price.sellingPrice;
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      {showFrom && <span className="text-[13px] text-muted">Starting from</span>}
      <span className={cn('font-extrabold', amountClass)}>
        {formatRupees(price.sellingPrice)}{' '}
        {struck && (
          <span className="text-xs font-medium text-muted line-through lg:text-sm">
            <span className="sr-only">was </span>
            {formatRupees(price.originalPrice)}
          </span>
        )}
      </span>
      <span className="text-xs text-muted lg:text-[13px]">
        {priceUnitLabel(price.priceType, price.label)}
        {showGst && ' · + GST'}
      </span>
    </div>
  );
}
