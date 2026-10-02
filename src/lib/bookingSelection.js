// A visitor's booking choice (package, price option, date, travellers, coupon) and its
// URL form for /booking?… — shared by the package page and the booking page.

const COUNT_KEYS = ['adults', 'children', 'infants', 'units'];

/** Selection -> URLSearchParams string for /booking. */
export function toBookingSearch({ slug, priceId, travelDate, departureId, counts, couponCode }) {
  const params = new URLSearchParams({ package: slug, price: String(priceId) });
  if (departureId) params.set('departure', String(departureId));
  else if (travelDate) params.set('date', travelDate);
  for (const key of COUNT_KEYS) if (counts[key]) params.set(key, String(counts[key]));
  if (couponCode) params.set('coupon', couponCode);
  return `?${params.toString()}`;
}

/** /booking search params -> selection (numbers parsed, missing counts = 0). */
export function fromBookingSearch(searchParams) {
  const get = (key) =>
    (typeof searchParams.get === 'function' ? searchParams.get(key) : searchParams[key]) ?? undefined;
  const number = (key) => (Number.isInteger(Number(get(key))) ? Number(get(key)) : 0);
  return {
    slug: get('package'),
    priceId: number('price') || null,
    travelDate: get('date') ?? null,
    departureId: number('departure') || null,
    counts: Object.fromEntries(COUNT_KEYS.map((key) => [key, Math.max(0, number(key))])),
    couponCode: get('coupon') ?? '',
  };
}

/** Request body for POST /pricing/quote and POST /bookings. */
export function toQuoteRequest({ packageId, priceId, travelDate, departureId, counts, couponCode }) {
  return {
    packageId,
    priceId,
    counts,
    ...(departureId ? { departureId } : travelDate ? { travelDate } : {}),
    ...(couponCode ? { couponCode } : {}),
  };
}

/** Default counts for a price option: 1 adult per person, or 1 couple/group. */
export function defaultCounts(priceType) {
  return priceType === 'per_person'
    ? { adults: 1, children: 0, infants: 0, units: 0 }
    : { adults: 0, children: 0, infants: 0, units: 1 };
}
