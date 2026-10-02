/** "2 adults, 1 child, 1 infant" (or "2 couples · 4 travellers" for couple/group prices). */
export function travellerSummary({ adults, children, infants, units, seats }) {
  const plural = (count, word, many = `${word}s`) => `${count} ${count === 1 ? word : many}`;
  const parts = [];
  if (units > 0) parts.push(plural(seats, 'traveller'));
  else {
    if (adults > 0) parts.push(plural(adults, 'adult'));
    if (children > 0) parts.push(plural(children, 'child', 'children'));
  }
  if (infants > 0) parts.push(plural(infants, 'infant'));
  return parts.join(', ');
}
