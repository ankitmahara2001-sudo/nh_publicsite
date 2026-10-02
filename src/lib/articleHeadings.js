import { slugify } from './text';

// Adds anchor ids to the <h2> headings of an article (sanitised HTML from the API) and
// returns them for the "In this article" table of contents. Only <h2> opening tags are
// touched, and ids are built from [a-z0-9-] only, so no markup can be injected.

const H2_PATTERN = /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi;
const ID_ATTRIBUTE = /\sid\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i;
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' };

function plainText(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (match, name) => ENTITIES[name])
    .replace(/\s+/g, ' ')
    .trim();
}

/** @returns {{ html: string, headings: { id: string, text: string }[] }} */
export function withHeadingIds(html = '') {
  const headings = [];
  const used = new Set();

  const result = html.replace(H2_PATTERN, (match, attributes = '', inner) => {
    const text = plainText(inner);
    const base = slugify(text) || 'section';
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    headings.push({ id, text });
    const otherAttributes = attributes.replace(ID_ATTRIBUTE, '');
    return `<h2 id="${id}"${otherAttributes}>${inner}</h2>`;
  });

  return { html: result, headings };
}
