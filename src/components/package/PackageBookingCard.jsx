'use client';

import { formatDate, formatDateRange, formatRupees } from '@/domain/format';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CouponField } from '@/components/booking/CouponField';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { useQuote } from '@/components/booking/useQuote';
import { buttonClasses } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormFields';
import { NumberStepper } from '@/components/ui/NumberStepper';
import { OptionCard } from '@/components/ui/OptionCard';
import { defaultCounts, toBookingSearch, toQuoteRequest } from '@/lib/bookingSelection';
import { firstOpenDate } from '@/lib/dates';

const MAX_PER_COUNTER = 20;

function seatsLabel(departure) {
  if (departure.soldOut) return 'Sold out';
  if (departure.seatsLeft === null) return 'Seats available';
  return `${departure.seatsLeft} seat${departure.seatsLeft === 1 ? '' : 's'} left`;
}

/** Traveller counters for the chosen price option (CLAUDE.md "Travellers and quantity"). */
function TravellerCounters({ price, counts, setCount, error }) {
  if (price.priceType === 'per_person') {
    return (
      <div className="flex flex-col gap-3">
        <NumberStepper
          label="Adults"
          note="12 years and above"
          value={counts.adults}
          min={1}
          max={MAX_PER_COUNTER}
          onChange={(v) => setCount('adults', v)}
          error={error}
        />
        <NumberStepper
          label="Children"
          note="5 to 11 years"
          value={counts.children}
          max={MAX_PER_COUNTER}
          onChange={(v) => setCount('children', v)}
        />
        <NumberStepper
          label="Infants"
          note="Under 5, travel free"
          value={counts.infants}
          max={MAX_PER_COUNTER}
          onChange={(v) => setCount('infants', v)}
        />
      </div>
    );
  }
  const unit = price.priceType === 'per_couple' ? 'Couples' : `${price.label}`;
  return (
    <div className="flex flex-col gap-3">
      <NumberStepper
        label={unit}
        note={`${price.personsCovered} travellers each`}
        value={counts.units}
        min={1}
        max={MAX_PER_COUNTER}
        onChange={(v) => setCount('units', v)}
        error={error}
      />
      <NumberStepper
        label="Infants"
        note="Under 5, travel free"
        value={counts.infants}
        max={MAX_PER_COUNTER}
        onChange={(v) => setCount('infants', v)}
      />
    </div>
  );
}

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

        {fixed ? (
          <div role="radiogroup" aria-label="Departure date" className="flex flex-col gap-2">
            <span className="text-sm font-bold">Departure date</span>
            {pkg.departures.length === 0 ? (
              <p className="text-sm text-muted">
                No departures are open right now.{' '}
                <Link href="/contact" className="font-bold text-navy underline">
                  Ask us for the next dates
                </Link>
                .
              </p>
            ) : (
              <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
                {pkg.departures.map((d) => (
                  <OptionCard
                    key={d.id}
                    selected={d.id === departureId}
                    disabled={d.soldOut}
                    onSelect={() => setDepartureId(d.id)}
                    title={formatDateRange(d.startDate, d.endDate)}
                    aside={
                      <span
                        className={
                          d.soldOut
                            ? 'text-[13px] font-bold text-danger'
                            : 'text-[13px] font-bold text-success'
                        }
                      >
                        {seatsLabel(d)}
                      </span>
                    }
                  />
                ))}
              </div>
            )}
            {dateError && <span className="text-[13px] font-semibold text-danger">{dateError}</span>}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Input
              label="Travel date"
              type="date"
              min={earliest}
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              error={dateError}
            />
            {pkg.blockedDates.length > 0 && (
              <p className="text-xs text-muted">
                Not available:{' '}
                {pkg.blockedDates
                  .map(
                    (b) =>
                      `${formatDate(b.startDate)} – ${formatDate(b.endDate)}${b.reason ? ` (${b.reason})` : ''}`,
                  )
                  .join('; ')}
              </p>
            )}
          </div>
        )}

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
