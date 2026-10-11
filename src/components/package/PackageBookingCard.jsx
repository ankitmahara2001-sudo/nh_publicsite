'use client';

import { formatRupees } from '@/domain/format';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CouponField } from '@/components/booking/CouponField';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { TravelDateField } from '@/components/booking/TravelDateField';
import { TravellerCounters } from '@/components/booking/TravellerCounters';
import { useQuote } from '@/components/booking/useQuote';
import { buttonClasses } from '@/components/ui/Button';
import { OptionCard } from '@/components/ui/OptionCard';
import { defaultCounts, toBookingSearch, toQuoteRequest } from '@/lib/bookingSelection';
import { firstOpenDate } from '@/lib/dates';

/**
 * Booking card on the package page (design/PackageDetail.dc.html aside + mobile "Choose your package").
 * Live quote from the API; "Proceed to booking" opens /booking (which asks to log in first).
 */
export function PackageBookingCard({ pkg, cancellationNote }) {
  const defaultPrice = pkg.prices.find((p) => p.isDefault) ?? pkg.prices[0];
  const [priceId, setPriceId] = useState(defaultPrice?.id);
  const price = pkg.prices.find((p) => p.id === priceId);
  const [counts, setCounts] = useState(defaultCounts(defaultPrice?.priceType));

  const openDepartures = pkg.departures.filter((d) => !d.soldOut);
  const [departureId, setDepartureId] = useState(openDepartures[0]?.id ?? null);
  const earliest = pkg.pricing.earliestTravelDate;
  const [travelDate, setTravelDate] = useState(() => firstOpenDate(earliest, pkg.blockedDates));
  const [couponCode, setCouponCode] = useState('');

  const fixed = pkg.availabilityType === 'fixed_date';
  const canQuote = price && (fixed ? departureId : travelDate);
  const request = useMemo(
    () =>
      canQuote
        ? toQuoteRequest({
            packageId: pkg.id,
            priceId,
            counts,
            couponCode,
            ...(fixed ? { departureId } : { travelDate }),
          })
        : null,
    [canQuote, pkg.id, priceId, counts, couponCode, fixed, departureId, travelDate],
  );
  const { quote, fieldErrors, error, loading } = useQuote(request);

  if (!price) {
    return (
      <p className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 text-[15px] text-body">
        Prices for this trip are being updated.{' '}
        <Link href="/contact" className="font-bold text-navy underline">
          Send us an enquiry
        </Link>{' '}
        and we will share them.
      </p>
    );
  }

  const choosePrice = (option) => {
    setPriceId(option.id);
    setCounts(defaultCounts(option.priceType));
  };
  const setCount = (key, value) => setCounts((c) => ({ ...c, [key]: value }));
  const bookingHref = `/booking${toBookingSearch({ slug: pkg.slug, priceId, counts, couponCode, ...(fixed ? { departureId } : { travelDate }) })}`;
  const dateError = fieldErrors.travelDate ?? fieldErrors.departureId;
  const countError = fieldErrors['counts.adults'] ?? fieldErrors['counts.units'] ?? fieldErrors.counts;
  const bookable = Boolean(quote) && !loading;

  return (
    <>
      <div className="flex flex-col gap-[18px] rounded-[var(--radius-panel)] border border-line bg-surface p-5 lg:p-6">
        <div role="radiogroup" aria-label="Choose package type" className="flex flex-col gap-2.5">
          <span className="text-[15px] font-bold">Choose package type</span>
          {pkg.prices.map((option) => (
            <OptionCard
              key={option.id}
              selected={option.id === priceId}
              onSelect={() => choosePrice(option)}
              title={option.label}
              note={option.note}
              aside={
                <>
                  <span className="text-base font-extrabold lg:text-[17px]">
                    {formatRupees(option.sellingPrice)}
                  </span>
                  {option.discountedPrice != null && (
                    <span className="text-xs text-muted line-through">
                      {formatRupees(option.originalPrice)}
                    </span>
                  )}
                </>
              }
            />
          ))}
          <span className="text-xs text-muted">Prices exclude GST.</span>
        </div>

        <TravelDateField
          pkg={pkg}
          departureId={departureId}
          onDepartureChange={setDepartureId}
          travelDate={travelDate}
          onTravelDateChange={setTravelDate}
          error={dateError}
        />

        <TravellerCounters price={price} counts={counts} setCount={setCount} error={countError} />

        <CouponField onApply={setCouponCode} result={couponCode ? quote?.coupon : null} />

        <div className="border-t border-line pt-4" aria-live="polite" aria-busy={loading}>
          {quote ? (
            <PriceBreakdown quote={quote} className={loading ? 'opacity-60' : ''} />
          ) : error && !dateError && !countError ? (
            <p className="text-sm font-semibold text-danger">{error}</p>
          ) : (
            <p className="text-sm text-muted">
              {loading ? 'Calculating your price…' : 'Choose a date to see the total.'}
            </p>
          )}
        </div>

        <Link
          href={bookingHref}
          aria-disabled={!bookable}
          className={buttonClasses({
            size: 'lg',
            block: true,
            className: !bookable ? 'pointer-events-none opacity-50' : '',
          })}
        >
          Proceed to booking
        </Link>
        {cancellationNote && <span className="text-center text-[13px] text-muted">{cancellationNote}</span>}
      </div>

      {/* Phones: sticky total + Book now (design/MobilePackageDetail.dc.html). */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-[76px] items-center justify-between gap-3 border-t border-line bg-surface px-5 pb-[env(safe-area-inset-bottom)] lg:hidden">
        <span className="flex flex-col">
          <span className="text-xs text-muted">{quote ? 'Total incl. GST' : 'From'}</span>
          <span className="text-[19px] font-extrabold">
            {quote ? formatRupees(quote.total) : formatRupees(price.sellingPrice)}
          </span>
        </span>
        <Link href={bookable ? bookingHref : '#book'} className={buttonClasses({ size: 'lg' })}>
          Book now
        </Link>
      </div>
    </>
  );
}
