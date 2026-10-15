'use client';

import { formatRupees } from '@/domain/format';
import { Input, Select } from '@/components/ui/FormFields';
import { OptionCard } from '@/components/ui/OptionCard';
import { TravelDateField } from './TravelDateField';
import { TravellerCounters } from './TravellerCounters';

/** Step 1 (design/Booking.dc.html "Trip details"): date, pickup point, package type, travellers. */
export function TripStep({ pkg, trip, setTrip, pickupPoints, errors }) {
  const price = pkg.prices.find((p) => p.id === trip.priceId);
  const setCount = (key, value) => setTrip({ counts: { ...trip.counts, [key]: value } });

  return (
    <div className="flex flex-col gap-5 lg:gap-[22px]">
      <h2 className="text-xl font-extrabold lg:text-[21px]">Trip details</h2>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-[18px]">
        <TravelDateField
          pkg={pkg}
          departureId={trip.departureId}
          onDepartureChange={(departureId) => setTrip({ departureId })}
          travelDate={trip.travelDate}
          onTravelDateChange={(travelDate) => setTrip({ travelDate })}
          error={errors.date}
        />
        {pickupPoints.length > 0 ? (
          <Select
            label="Pickup point"
            value={trip.pickupPoint}
            onChange={(e) => setTrip({ pickupPoint: e.target.value })}
            options={[
              { value: '', label: 'Choose a pickup point' },
              ...pickupPoints.map((point) => ({ value: point, label: point })),
            ]}
            error={errors.pickupPoint}
          />
        ) : (
          <Input
            label="Pickup point"
            value={trip.pickupPoint}
            onChange={(e) => setTrip({ pickupPoint: e.target.value })}
            placeholder="Where should we pick you up?"
            error={errors.pickupPoint}
          />
        )}
      </div>

      <div role="radiogroup" aria-label="Package type" className="flex flex-col gap-2.5">
        <span className="text-sm font-bold">Package type</span>
        {pkg.prices.map((option) => (
          <OptionCard
            key={option.id}
            selected={option.id === trip.priceId}
            onSelect={() => setTrip({ priceId: option.id })}
            title={option.label}
            note={option.note}
            aside={<span className="text-base font-extrabold">{formatRupees(option.sellingPrice)}</span>}
          />
        ))}
      </div>

      {price && (
        <TravellerCounters
          price={price}
          counts={trip.counts}
          setCount={setCount}
          error={errors.counts}
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          stepperClassName="rounded-xl border border-line px-4 py-3"
        />
      )}
    </div>
  );
}
