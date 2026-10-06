// Safe display defaults for a new database. Real settings always take precedence.
// Do not invent contact details, reviews, legal policies, or booking promises.
const section = (title, linkLabel = '') => ({ overline: '', title, subtitle: '', linkLabel });
const hero = (title) => ({ title, subtitle: '', imageUrl: '' });

const defaults = {
  company: {
    name: 'Norther Harier',
    legalName: '',
    tagline: '',
    phone: '',
    whatsapp: '',
    supportPhone: '',
    email: '',
    address: '',
    shortAddress: '',
    officeHours: '',
    mapEmbedUrl: '',
  },
  social: {},
  seo: {
    defaultTitle: 'Norther Harier',
    titleTemplate: '%s | Norther Harier',
    description: 'Explore Uttarakhand with Norther Harier.',
    ogImageUrl: '',
  },
  home: {
    hero: {
      overline: 'EXPLORE UTTARAKHAND',
      heading: 'Discover your next journey',
      subheading: 'Explore destinations and travel packages with Norther Harier.',
      primaryCtaLabel: 'Explore packages',
      secondaryCtaLabel: 'Contact us',
    },
    destinations: section('Destinations', 'All destinations'),
    packages: section('Travel packages', 'View all packages'),
    offers: section('Offers', 'All offers'),
    gallery: section('Gallery', 'Open gallery'),
    about: { ...section('About Norther Harier', 'About us'), imageUrl: '', stats: [] },
    testimonials: section('Traveller stories'),
    blog: section('Travel stories and guides', 'All articles'),
    ctaBanner: {
      title: 'Plan your next journey',
      text: 'Get in touch with your travel enquiry.',
      buttonLabel: 'Contact us',
    },
  },
  about: {
    hero: hero('About Norther Harier'),
    story: { ...section('Our story'), paragraphs: [], imageUrl: '' },
    valuesHeading: section('Our values'),
    values: [],
    stats: [],
    teamHeading: section('Our team'),
    team: [],
    cta: {
      title: 'Explore your next trip',
      text: '',
      primaryLabel: 'Contact us',
      secondaryLabel: 'Browse packages',
    },
  },
  contact: {
    hero: hero('Contact us'),
    channels: [],
    formTitle: 'Send us a message',
    formNote: '',
    successMessage: 'Thank you, {name}. Your message has been received.',
    quickLinks: [],
  },
  booking: { pickupPoints: [], termsText: '', freeCancellationNote: '', nextSteps: [] },
  policies: {},
  pages: {
    packages: hero('Travel packages'),
    destinations: hero('Explore Uttarakhand'),
    offers: { ...hero('Offers'), steps: [], termsText: '' },
    gallery: hero('Gallery'),
    blog: hero('Travel stories and guides'),
  },
};

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function mergeDefaults(fallback, value) {
  if (Array.isArray(fallback)) return Array.isArray(value) ? value : [...fallback];
  if (!isObject(fallback)) return typeof value === typeof fallback ? value : fallback;
  const source = isObject(value) ? value : {};
  const result = { ...source };
  for (const [key, entry] of Object.entries(fallback)) {
    result[key] = mergeDefaults(entry, source[key]);
  }
  return result;
}

export function normalizeSiteSettings(settings) {
  return mergeDefaults(defaults, settings);
}
