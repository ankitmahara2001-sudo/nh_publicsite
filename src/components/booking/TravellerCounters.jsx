'use client';

import { NumberStepper } from '@/components/ui/NumberStepper';

const MAX_PER_COUNTER = 20;

/**
 * Traveller counters for the chosen price option (CLAUDE.md "Travellers and quantity"):
 * adults / children / infants per person, or couples / groups + infants.
 * Used by the package booking card and booking step 1 (`stepperClassName` boxes each counter there).
 */
export function TravellerCounters({ price, counts, setCount, error, className, stepperClassName }) {
  if (price.priceType === 'per_person') {
    return (
      <div className={className ?? 'flex flex-col gap-3'}>
        <NumberStepper
          className={stepperClassName}
          label="Adults"
          note="12 years and above"
          value={counts.adults}
          min={1}
          max={MAX_PER_COUNTER}
          onChange={(v) => setCount('adults', v)}
          error={error}
        />
        <NumberStepper
          className={stepperClassName}
          label="Children"
          note="5 to 11 years"
          value={counts.children}
          max={MAX_PER_COUNTER}
          onChange={(v) => setCount('children', v)}
        />
        <NumberStepper
          className={stepperClassName}
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
    <div className={className ?? 'flex flex-col gap-3'}>
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
