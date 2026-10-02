/** Initials for an avatar circle: "Rahul & Neha Verma" -> "RV". */
export function initials(name = '') {
  const words = name
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return ((words[0]?.[0] ?? '') + (words.at(-1)?.[0] ?? '')).toUpperCase();
}

/** "Trek, pony or helicopter?" -> "trek-pony-or-helicopter". */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "Thank you, {name}." with {name} filled in. */
export function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}
