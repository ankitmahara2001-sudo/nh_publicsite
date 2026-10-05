import { PAISE_PER_RUPEE } from './constants.js';

const RUPEE_FORMAT = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const RUPEE_FORMAT_PAISE = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Paise -> "₹12,999" (or "₹12,999.50" when there are paise). */
export function formatRupees(paise) {
  const amount = Number(paise ?? 0) / PAISE_PER_RUPEE;
  const formatter = Number.isInteger(amount) ? RUPEE_FORMAT : RUPEE_FORMAT_PAISE;
  return `₹${formatter.format(amount)}`;
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

/** "2026-10-18" or a Date -> "18 Oct 2026". Plain YYYY-MM-DD dates are read as calendar dates. */
export function formatDate(value) {
  if (!value) return '';
  const date =
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T12:00:00+05:30`)
      : new Date(value);
  return DATE_FORMAT.format(date);
}

/** "18 – 22 Oct 2026" style range for two YYYY-MM-DD dates. */
export function formatDateRange(start, end) {
  const from = formatDate(start);
  const to = formatDate(end);
  if (!end || from === to) return from;
  const [fromDay, fromMonth, fromYear] = from.split(' ');
  const [toDay, toMonth, toYear] = to.split(' ');
  if (fromYear === toYear && fromMonth === toMonth) return `${fromDay} – ${toDay} ${toMonth} ${toYear}`;
  if (fromYear === toYear) return `${fromDay} ${fromMonth} – ${toDay} ${toMonth} ${toYear}`;
  return `${from} – ${to}`;
}

/** "5 days · 4 nights" */
export function formatDuration(days, nights) {
  const d = `${days} day${days === 1 ? '' : 's'}`;
  const n = `${nights} night${nights === 1 ? '' : 's'}`;
  return `${d} · ${n}`;
}

/** Unit text under a price: "per person", "per couple", or the group label ("per family of 4"). */
export function priceUnitLabel(priceType, label) {
  if (priceType === 'per_person') return 'per person';
  if (priceType === 'per_couple') return 'per couple';
  return `per ${String(label || 'group').toLowerCase()}`;
}
