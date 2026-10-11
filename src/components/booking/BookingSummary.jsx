'use client';

import { formatDateRange, formatDuration, formatRupees } from '@/domain/format';
import { useId, useState } from 'react';
import { Photo } from '@/components/ui/Photo';
import { CouponField } from './CouponField';
import { PriceBreakdown } from './PriceBreakdown';

function SummaryBody({ pkg, price, quote, quoteState, couponCode, onCoupon, cancellationNote, couponLocked }) {
  const travellers = quote ? quote.seats + quote.infants : null;
  return (
    <div className="flex flex-col gap-3 text-sm lg:text-[15px]">
      <span className="text-base font-extrabold lg:text-lg">{pkg.title}</span>
      <span className="text-muted">
        {quote ? `${formatDateRange(quote.travelDate, quote.endDate)} · ` : ''}
        {formatDuration(pkg.durationDays, pkg.durationNights)}
      </span>
      {price && (
        <span className="text-muted">
          {price.label}
          {travellers ? ` · ${travellers} traveller${travellers === 1 ? '' : 's'}` : ''}
        </span>
      )}
      <div className="border-t border-line pt-3.5" aria-live="polite" aria-busy={quoteState.loading}>
        {quote ? (
          <PriceBreakdown quote={quote} className={quoteState.loading ? 'opacity-60' : ''} />
        ) : (
          <p className={quoteState.error ? 'font-semibold text-danger' : 'text-muted'}>
            {quoteState.loading ? 'Calculating your price…' : quoteState.error || 'Choose your trip details to see the total.'}
          </p>
        )}
      </div>
      {!couponLocked && (
        <CouponField
          initialCode={couponCode}
          onApply={onCoupon}
          result={couponCode ? quote?.coupon : null}
        />
      )}
      {cancellationNote && <span className="text-[13px] text-muted">{cancellationNote}</span>}
    </div>
  );
}

/**
 * Booking summary (design/Booking.dc.html aside; MobileBooking.dc.html collapsible bar with the total).
 * `couponLocked`: once the booking is created the price is fixed, so the coupon can't change.
 */
export function BookingSummary(props) {
  const { pkg, quote } = props;
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <div className="flex flex-col gap-2 lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-14 items-center justify-between rounded-xl border border-line bg-surface px-4 py-3"
        >
          <span className="text-sm font-bold">{open ? 'Hide booking summary' : 'Show booking summary'}</span>
          <span className="text-[17px] font-extrabold">{quote ? formatRupees(quote.total) : ''}</span>
        </button>
        <div id={panelId} hidden={!open} className="rounded-xl border border-line bg-surface px-4 py-3.5">
          <SummaryBody {...props} />
        </div>
      </div>

      <aside
        aria-label="Booking summary"
        className="sticky top-6 hidden w-[360px] shrink-0 overflow-hidden rounded-[var(--radius-panel)] border border-line bg-surface lg:block xl:w-[400px]"
      >
        <div className="relative h-[140px] bg-placeholder">
          <Photo src={pkg.coverImageUrl} alt="" sizes="400px" />
        </div>
        <div className="p-6">
          <SummaryBody {...props} />
        </div>
      </aside>
    </>
  );
}
