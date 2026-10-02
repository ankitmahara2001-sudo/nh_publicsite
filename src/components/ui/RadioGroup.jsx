'use client';

import { useId } from 'react';

/**
 * Radio buttons in a fieldset with a legend. `options`: [{ value, label }].
 * Controlled: `value` + `onChange(value)`.
 */
export function RadioGroup({ legend, options, value, onChange, name }) {
  const autoName = useId();
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="pb-2.5 text-sm font-bold">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
          <input
            type="radio"
            name={name ?? autoName}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="size-[18px] shrink-0 accent-navy lg:size-[18px]"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
