// Packages page filters: URL search params <-> UI values <-> API query (CLAUDE.md: every filter in the URL).

const RUPEE = 100;

export const DURATION_OPTIONS = [
  { value: 'short', label: 'Up to 3 days' },
  { value: 'medium', label: '4 to 6 days' },
  { value: 'long', label: '7 days or more' },
];

/** Budget buckets in paise (design: "Budget per person"). */
export const BUDGET_OPTIONS = [
  { value: 'under10', label: 'Under ₹10,000', min: 0, max: 10000 * RUPEE },
  { value: '10to25', label: '₹10,000 – ₹25,000', min: 10000 * RUPEE, max: 25000 * RUPEE },
  { value: 'over25', label: 'Above ₹25,000', min: 25000 * RUPEE, max: null },
];

export const PRICE_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'per_person', label: 'Per person' },
  { value: 'per_couple', label: 'Per couple' },
  { value: 'per_group', label: 'Group / family' },
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'duration', label: 'Duration' },
];

const list = (value) => (Array.isArray(value) ? value : value ? [value] : []);

/** Search params (object from Next) -> filter values used by the UI. */
export function parseFilters(searchParams) {
  return {
    destination: searchParams.destination ?? '',
    tripType: searchParams.tripType ?? '',
    duration: list(searchParams.duration).filter((v) => DURATION_OPTIONS.some((o) => o.value === v)),
    budget: list(searchParams.budget).filter((v) => BUDGET_OPTIONS.some((o) => o.value === v)),
    priceType: searchParams.priceType ?? '',
    month: searchParams.month ?? '',
    sort: SORT_OPTIONS.some((o) => o.value === searchParams.sort) ? searchParams.sort : 'recommended',
    page: Math.max(1, Number.parseInt(searchParams.page ?? '1', 10) || 1),
  };
}

/** Several budget boxes -> one price range covering all of them. */
function budgetRange(budget) {
  const chosen = BUDGET_OPTIONS.filter((o) => budget.includes(o.value));
  if (!chosen.length) return {};
  const min = Math.min(...chosen.map((o) => o.min));
  const max = chosen.some((o) => o.max === null) ? null : Math.max(...chosen.map((o) => o.max));
  return { ...(min > 0 ? { minPrice: min } : {}), ...(max !== null ? { maxPrice: max } : {}) };
}

/** Filter values -> GET /packages query. */
export function toApiQuery(filters, pageSize) {
  return {
    destination: filters.destination || undefined,
    tripType: filters.tripType || undefined,
    duration: filters.duration.length ? filters.duration : undefined,
    priceType: filters.priceType || undefined,
    month: filters.month || undefined,
    sort: filters.sort,
    page: filters.page,
    pageSize,
    ...budgetRange(filters.budget),
  };
}

/** Filter values -> "/packages?…" (drops defaults and empty values; page 1 is implicit). */
export function filtersHref(filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'sort' && value === 'recommended') continue;
    if (key === 'page' && value <= 1) continue;
    for (const item of list(value)) if (item !== '' && item !== null) params.append(key, String(item));
  }
  const query = params.toString();
  return query ? `/packages?${query}` : '/packages';
}

/** Number of filters set from the sidebar (for the mobile "Filters (n)" button). */
export function activeFilterCount(filters) {
  return (
    [filters.destination, filters.priceType, filters.month].filter(Boolean).length +
    filters.duration.length +
    filters.budget.length
  );
}

/** The next six months as { value: "2026-10", label: "October 2026" }. */
export function upcomingMonths(count = 6, from = new Date()) {
  const format = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + i, 15));
    return { value: date.toISOString().slice(0, 7), label: format.format(date) };
  });
}
