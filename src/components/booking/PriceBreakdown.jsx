import { formatRupees } from '@nh/shared';
import { cn } from '@/lib/cn';

const UNIT_WORDS = {
  per_person: ['person', 'persons'],
  per_couple: ['couple', 'couples'],
  per_group: ['group', 'groups'],
};

/** "₹12,999 × 2 persons" */
export function quantityLine(quote) {
  const [one, many] = UNIT_WORDS[quote.priceType];
  return `${formatRupees(quote.unitPrice)} × ${quote.quantity} ${quote.quantity === 1 ? one : many}`;
}

function Row({ label, value, className, valueClass }) {
  return (
    <div className={cn('flex justify-between gap-3', className)}>
      <dt className="text-muted">{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}

/**
 * Price summary from a quote (CLAUDE.md: unit × quantity, coupon, GST %, Total, Pay now (X%), Balance due).
 * Used by the package booking card and the booking page.
 */
export function PriceBreakdown({ quote, className }) {
  return (
    <div className={cn('flex flex-col gap-2.5 text-sm lg:text-[15px]', className)}>
      <dl className="flex flex-col gap-2.5">
        <Row label={quantityLine(quote)} value={formatRupees(quote.subtotal)} />
        <Row
          label={quote.coupon?.valid ? `Coupon ${quote.coupon.code}` : 'Coupon discount'}
          value={quote.discount ? `−${formatRupees(quote.discount)}` : '₹0'}
          valueClass="text-success"
        />
        <Row label={`GST (${quote.gstPercent}%)`} value={formatRupees(quote.gstAmount)} />
        <Row
          label="Total"
          value={formatRupees(quote.total)}
          className="pt-1.5 text-[17px] font-extrabold lg:text-lg [&_dt]:text-ink"
        />
      </dl>
      {/* A second list: a <dl> may only contain dt/dd groups, not a styled panel. */}
      <dl className="flex flex-col gap-2 rounded-[var(--radius-control)] bg-sand-light px-3.5 py-3">
        <Row
          label={`Pay now (${quote.bookingAmountPercent}%)`}
          value={formatRupees(quote.payNow)}
          className="font-bold [&_dt]:text-ink"
        />
        <Row label="Balance due before travel" value={formatRupees(quote.balanceDue)} />
      </dl>
    </div>
  );
}
