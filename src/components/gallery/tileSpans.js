// Masonry-like tile sizes for the gallery grid, repeating the patterns of the designs:
// desktop (design/Gallery, 4 columns) repeats every 15 photos, phone (MobileGallery, 2 columns)
// every 10. Class names are written out in full so Tailwind can find them.

const DESKTOP_PATTERN_LENGTH = 15;
const PHONE_PATTERN_LENGTH = 10;

/** Desktop: index -> classes (both axes, so phone spans never leak through); others are 1×1. */
const DESKTOP_SPANS = {
  0: 'lg:col-span-2 lg:row-span-2',
  2: 'lg:col-span-1 lg:row-span-2',
  6: 'lg:col-span-1 lg:row-span-2',
  7: 'lg:col-span-2 lg:row-span-2',
  12: 'lg:col-span-2 lg:row-span-1',
};

/** Phone: index -> classes; others are 1×1. */
const PHONE_SPANS = {
  0: 'row-span-2',
  3: 'col-span-2',
  5: 'row-span-2',
  9: 'col-span-2',
};

// Undo the phone span on desktop when the desktop pattern has a 1×1 tile there.
const DESKTOP_RESET = 'lg:col-span-1 lg:row-span-1';

/** Grid span classes for the tile at `index`. */
export function tileSpanClasses(index) {
  const phone = PHONE_SPANS[index % PHONE_PATTERN_LENGTH] ?? '';
  const desktop = DESKTOP_SPANS[index % DESKTOP_PATTERN_LENGTH] ?? DESKTOP_RESET;
  return `${phone} ${desktop}`;
}
