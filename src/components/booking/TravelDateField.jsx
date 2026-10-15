'use client';

import { formatDate, formatDateRange } from '@/domain/format';
import Link from 'next/link';
import { Input } from '@/components/ui/FormFields';
import { OptionCard } from '@/components/ui/OptionCard';
import { enquiryHref } from '@/lib/enquiry';

function seatsLabel(departure) {
  if (departure.soldOut) return 'Sold out';
  if (departure.seatsLeft === null) return 'Seats available';
  return `${departure.seatsLeft} seat${departure.seatsLeft === 1 ? '' : 's'} left`;
}

/**
 * Date choice for a package (CLAUDE.md "Availability type"): the departure list with seats left
 * for fixed_date packages, a date picker for all_season ones.
 * Used by the package booking card and booking step 1.
 */
export function TravelDateField({
  pkg,
  departureId,
  onDepartureChange,
  travelDate,
  onTravelDateChange,
  error,
}) {
  if (pkg.availabilityType === 'fixed_date') {
    return (
      <div role="radiogroup" aria-label="Departure date" className="flex flex-col gap-2">
        <span className="text-sm font-semibold">Departure date</span>
        {pkg.departures.length === 0 ? (
          <p className="text-sm text-muted">
            No departures are open right now.{' '}
            <Link href={enquiryHref(pkg.title)} className="font-bold text-navy underline">
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
                onSelect={() => onDepartureChange(d.id)}
                title={formatDateRange(d.startDate, d.endDate)}
                aside={
                  <span
                    className={
                      d.soldOut ? 'text-[13px] font-bold text-danger' : 'text-[13px] font-bold text-success'
                    }
                  >
                    {seatsLabel(d)}
                  </span>
                }
              />
            ))}
          </div>
        )}
        {error && <span className="text-[13px] font-semibold text-danger">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        label="Travel date"
        type="date"
        min={pkg.pricing.earliestTravelDate}
        value={travelDate ?? ''}
        onChange={(e) => onTravelDateChange(e.target.value)}
        error={error}
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
  );
}
