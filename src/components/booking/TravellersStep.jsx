'use client';

import { GENDER_LABELS, GENDERS } from '@/domain/enums';
import { Input, Select, Textarea } from '@/components/ui/FormFields';

const GENDER_OPTIONS = [
  { value: '', label: 'Select' },
  ...GENDERS.map((gender) => ({ value: gender, label: GENDER_LABELS[gender] })),
];

/** "Traveller 1 (lead)", "Traveller 2", … then "Infant 1" for the free infants at the end. */
function travellerTitle(index, seats) {
  if (index === 0) return 'Traveller 1 (lead)';
  return index < seats ? `Traveller ${index + 1}` : `Infant ${index - seats + 1}`;
}

/**
 * Step 2 (design/Booking.dc.html "Traveller details"): name, age and gender for everyone on the
 * trip; booking email comes from the account (read-only), phone is editable.
 * `errors` keys follow the API: "travellers.0.fullName", "leadPhone"…
 */
export function TravellersStep({ details, setDetails, seats, email, errors }) {
  const setTraveller = (index, patch) =>
    setDetails({
      travellers: details.travellers.map((traveller, i) =>
        i === index ? { ...traveller, ...patch } : traveller,
      ),
    });

  return (
    <div className="flex flex-col gap-4 lg:gap-[22px]">
      <h2 className="text-xl font-extrabold lg:text-[21px]">Traveller details</h2>
      {errors.travellers && <p className="text-sm font-semibold text-danger">{errors.travellers}</p>}

      {details.travellers.map((traveller, index) => (
        <fieldset
          // Rows are positional (traveller 1, 2…), so the index is the stable identity.
          key={index}
          className="grid gap-3 rounded-xl border border-line p-3.5 lg:grid-cols-[2fr_1fr_1fr] lg:gap-3.5 lg:p-[18px]"
        >
          <legend className="px-1.5 text-sm font-extrabold lg:text-[15px]">
            {travellerTitle(index, seats)}
          </legend>
          <Input
            label="Full name (as on ID)"
            value={traveller.fullName}
            onChange={(e) => setTraveller(index, { fullName: e.target.value })}
            autoComplete={index === 0 ? 'name' : 'off'}
            error={errors[`travellers.${index}.fullName`]}
          />
          <Input
            label="Age"
            type="number"
            inputMode="numeric"
            min={0}
            max={120}
            value={traveller.age}
            onChange={(e) => setTraveller(index, { age: e.target.value })}
            error={errors[`travellers.${index}.age`]}
          />
          <Select
            label="Gender"
            value={traveller.gender}
            onChange={(e) => setTraveller(index, { gender: e.target.value })}
            options={GENDER_OPTIONS}
            error={errors[`travellers.${index}.gender`]}
          />
        </fieldset>
      ))}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-[18px]">
        <Input label="Email for booking updates" type="email" value={email} readOnly disabled />
        <Input
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          value={details.leadPhone}
          onChange={(e) => setDetails({ leadPhone: e.target.value })}
          error={errors.leadPhone}
        />
      </div>
      <Textarea
        label="Special requests"
        optional
        rows={3}
        value={details.specialRequests}
        onChange={(e) => setDetails({ specialRequests: e.target.value })}
        placeholder="Dietary needs, medical conditions, room preferences…"
        error={errors.specialRequests}
      />
    </div>
  );
}
