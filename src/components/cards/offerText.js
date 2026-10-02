import { PRICE_TYPE_LABELS, formatDate, formatRupees } from '@nh/shared';

// Turns an offer (coupon) from the API into the short texts shown on offer cards.

export function discountLabel(offer) {
  return offer.discountType === 'percent'
    ? `${offer.discountValue}% off`
    : `${formatRupees(offer.discountValue)} off`;
}

export function kindLabel(offer) {
  return offer.discountType === 'percent' ? 'Percent' : 'Flat';
}

export function validityLabel(offer) {
  return offer.validUntil ? `Valid till ${formatDate(offer.validUntil)}` : 'No end date';
}

/** Up to two rule lines, e.g. "Min. booking ₹30,000" and "Char Dham Yatra by Road only". */
export function offerRules(offer) {
  const rules = [];
  if (offer.discountType === 'percent' && offer.maxDiscount)
    rules.push(`Up to ${formatRupees(offer.maxDiscount)} off`);
  if (offer.minOrderAmount) rules.push(`Min. booking ${formatRupees(offer.minOrderAmount)}`);
  if (offer.appliesToPriceType) rules.push(`${PRICE_TYPE_LABELS[offer.appliesToPriceType]} option only`);
  if (!offer.appliesToAllPackages && offer.packages.length) {
    rules.push(
      offer.packages.length <= 2
        ? `${offer.packages.map((p) => p.title).join(' and ')} only`
        : `${offer.packages.length} selected packages`,
    );
  }
  if (rules.length === 0) rules.push('All packages');
  return rules;
}
