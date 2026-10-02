'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox, Select } from '@/components/ui/FormFields';
import { RadioGroup } from '@/components/ui/RadioGroup';
import {
  BUDGET_OPTIONS,
  DURATION_OPTIONS,
  PRICE_TYPE_OPTIONS,
  SORT_OPTIONS,
  activeFilterCount,
  filtersHref,
} from '@/lib/packageFilters';

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

/** Filters that reset when "Clear" is pressed (trip type and sort are kept). */
const clearedFilters = (filters) => ({
  ...filters,
  destination: '',
  duration: [],
  budget: [],
  priceType: '',
  month: '',
  page: 1,
});

/** Moves to the filtered URL; any filter change goes back to page 1. */
function useApplyFilters() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const apply = (filters) =>
    startTransition(() => router.push(filtersHref({ ...filters, page: 1 }), { scroll: false }));
  return { apply, pending };
}

/** The filter fields shared by the desktop sidebar and the mobile sheet. */
function FilterFields({ filters, onChange, destinations, months, idPrefix }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });
  return (
    <>
      <Select
        id={`${idPrefix}-destination`}
        label="Destination"
        value={filters.destination}
        onChange={(e) => set('destination', e.target.value)}
        options={[
          { value: '', label: 'All of Uttarakhand' },
          ...destinations.map((d) => ({ value: d.slug, label: d.name })),
        ]}
      />
      <fieldset>
        <legend className="pb-1 text-sm font-bold">Duration</legend>
        {DURATION_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            id={`${idPrefix}-duration-${option.value}`}
            label={option.label}
            checked={filters.duration.includes(option.value)}
            onChange={() => set('duration', toggle(filters.duration, option.value))}
          />
        ))}
      </fieldset>
      <fieldset>
        <legend className="pb-1 text-sm font-bold">Budget per person</legend>
        {BUDGET_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            id={`${idPrefix}-budget-${option.value}`}
            label={option.label}
            checked={filters.budget.includes(option.value)}
            onChange={() => set('budget', toggle(filters.budget, option.value))}
          />
        ))}
      </fieldset>
      <RadioGroup
        legend="Price type"
        options={PRICE_TYPE_OPTIONS}
        value={filters.priceType}
        onChange={(value) => set('priceType', value)}
      />
      <Select
        id={`${idPrefix}-month`}
        label="Travel month"
        value={filters.month}
        onChange={(e) => set('month', e.target.value)}
        options={[{ value: '', label: 'Any month' }, ...months]}
      />
    </>
  );
}

/** Desktop sidebar (design/Packages.dc.html): every change updates the results at once. */
export function FilterSidebar({ filters, destinations, months }) {
  const { apply, pending } = useApplyFilters();
  return (
    <aside
      aria-label="Filters"
      aria-busy={pending}
      className="hidden w-[280px] shrink-0 flex-col gap-[26px] rounded-[var(--radius-card)] border border-line bg-surface p-6 lg:flex"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Filters</h2>
        {activeFilterCount(filters) > 0 && (
          <button
            type="button"
            onClick={() => apply(clearedFilters(filters))}
            className="min-h-11 text-sm font-bold text-gold-text underline"
          >
            Clear all
          </button>
        )}
      </div>
      <FilterFields
        filters={filters}
        onChange={apply}
        destinations={destinations}
        months={months}
        idPrefix="side"
      />
    </aside>
  );
}

/** Sort select; on phones it sits next to the "Filters" button. */
export function SortSelect({ id, filters, className }) {
  const { apply } = useApplyFilters();
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only text-sm text-muted lg:not-sr-only">
        Sort by
      </label>
      <select
        id={id}
        value={filters.sort}
        onChange={(e) => apply({ ...filters, sort: e.target.value })}
        className="h-[46px] w-full rounded-[var(--radius-control)] border border-input bg-surface px-2.5 text-sm text-ink focus:border-navy lg:h-11 lg:w-auto lg:px-3"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Phones (design/MobilePackages.dc.html): "Filters (n)" opens a bottom sheet; "Show results" applies. */
export function FilterSheet({ filters, destinations, months }) {
  const { apply } = useApplyFilters();
  const dialogRef = useRef(null);
  const [draft, setDraft] = useState(filters);
  const count = activeFilterCount(filters);

  const open = () => {
    setDraft(filters);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const submit = (next) => {
    apply(next);
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="h-[46px] flex-1 rounded-[var(--radius-control)] border border-input bg-surface text-sm font-bold text-ink"
      >
        Filters{count > 0 ? ` (${count})` : ''}
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Filters"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-0 mt-auto max-h-[90dvh] w-full max-w-none rounded-t-[20px] bg-surface p-0 text-ink backdrop:bg-navy/60 lg:hidden"
      >
        <div className="flex flex-col gap-[18px] p-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Filters</h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close filters"
              className="flex size-11 items-center justify-center text-2xl"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <FilterFields
            filters={draft}
            onChange={setDraft}
            destinations={destinations}
            months={months}
            idPrefix="sheet"
          />
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              size="custom"
              className="h-[50px] flex-1 border-input text-[15px] text-ink"
              onClick={() => submit(clearedFilters(filters))}
            >
              Clear
            </Button>
            <Button size="custom" className="h-[50px] flex-1 text-[15px]" onClick={() => submit(draft)}>
              Show results
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
