import { z } from 'zod';
import { MAX_BOOKING_PERCENT, MIN_BOOKING_PERCENT } from '../constants.js';
import { emailSchema, requiredText } from './common.js';

// Site settings are stored as key -> JSONB. Each key has its own schema so the admin
// form and the API validate exactly the same shape.

const text = (max = 500) => z.string().trim().max(max).default('');
// Empty string, null (image removed) or missing all mean “no URL”.
const optionalUrl = z
  .union([z.url().max(2048), z.literal('')])
  .nullish()
  .transform((value) => value ?? '');
// Cloudinary public id of an uploaded image (null for pasted URLs and seeded placeholders).
const publicId = z.string().max(255).nullish().default(null);

const sectionHeading = z.object({
  overline: text(80),
  title: text(160),
  subtitle: text(500),
  linkLabel: text(80),
});

const statItem = z.object({ value: requiredText(40), label: requiredText(120) });
const numberedItem = z.object({ title: requiredText(120), text: requiredText(500) });

export const gstPercentSettingSchema = z.int().min(0).max(28);
export const defaultBookingPercentSettingSchema = z.int().min(MIN_BOOKING_PERCENT).max(MAX_BOOKING_PERCENT);

export const companySettingSchema = z.object({
  name: requiredText(120),
  legalName: text(160),
  tagline: text(300),
  phone: text(40),
  whatsapp: text(40),
  supportPhone: text(40),
  email: z.union([emailSchema, z.literal('')]).default(''),
  address: text(500),
  shortAddress: text(120),
  officeHours: text(120),
  mapEmbedUrl: optionalUrl,
});

export const socialSettingSchema = z.object({
  instagram: optionalUrl,
  facebook: optionalUrl,
  youtube: optionalUrl,
});

export const homeSettingSchema = z.object({
  hero: z.object({
    overline: text(80),
    heading: text(160),
    subheading: text(500),
    primaryCtaLabel: text(60),
    secondaryCtaLabel: text(60),
  }),
  destinations: sectionHeading,
  packages: sectionHeading,
  offers: sectionHeading,
  gallery: sectionHeading,
  about: sectionHeading.extend({
    imageUrl: optionalUrl,
    imagePublicId: publicId,
    stats: z.array(statItem).max(4).default([]),
  }),
  testimonials: sectionHeading,
  blog: sectionHeading,
  ctaBanner: z.object({ title: text(160), text: text(500), buttonLabel: text(60) }),
});

export const aboutSettingSchema = z.object({
  hero: z.object({ title: text(160), subtitle: text(500), imageUrl: optionalUrl, imagePublicId: publicId }),
  story: z.object({
    overline: text(80),
    title: text(160),
    paragraphs: z.array(requiredText(2000)).default([]),
    imageUrl: optionalUrl,
    imagePublicId: publicId,
  }),
  valuesHeading: z.object({ overline: text(80), title: text(160) }),
  values: z.array(numberedItem).default([]),
  stats: z.array(statItem).default([]),
  teamHeading: z.object({ overline: text(80), title: text(160) }),
  team: z
    .array(
      z.object({
        name: requiredText(120),
        role: requiredText(120),
        photoUrl: optionalUrl,
        photoPublicId: publicId,
      }),
    )
    .default([]),
  cta: z.object({
    title: text(160),
    text: text(500),
    primaryLabel: text(60),
    secondaryLabel: text(60),
  }),
});

export const contactSettingSchema = z.object({
  hero: z.object({ title: text(160), subtitle: text(500), imageUrl: optionalUrl, imagePublicId: publicId }),
  channels: z
    .array(z.object({ title: requiredText(60), value: requiredText(120), note: text(120), href: text(300) }))
    .default([]),
  formTitle: text(120),
  formNote: text(200),
  successMessage: text(300),
  quickLinks: z.array(z.object({ label: requiredText(120), href: requiredText(300) })).default([]),
});

export const bookingSettingSchema = z.object({
  pickupPoints: z.array(requiredText(160)).default([]),
  termsText: text(5000),
  freeCancellationNote: text(200),
  nextSteps: z.array(numberedItem).default([]),
});

const policyItem = z.object({ title: requiredText(160), content: text(100_000) });
export const policiesSettingSchema = z.object({
  cancellation: policyItem,
  privacy: policyItem,
  terms: policyItem,
});

export const seoSettingSchema = z.object({
  defaultTitle: requiredText(160),
  titleTemplate: text(160),
  description: text(320),
  ogImageUrl: optionalUrl,
  ogImagePublicId: publicId,
});

export const emailSettingSchema = z.object({
  senderName: requiredText(120),
  footerText: text(500),
});

/** Hero texts for listing pages and the Offers page explainer. */
export const pagesSettingSchema = z.object({
  packages: z.object({
    title: text(160),
    subtitle: text(500),
    imageUrl: optionalUrl,
    imagePublicId: publicId,
  }),
  destinations: z.object({
    title: text(160),
    subtitle: text(500),
    imageUrl: optionalUrl,
    imagePublicId: publicId,
  }),
  offers: z.object({
    title: text(160),
    subtitle: text(500),
    imageUrl: optionalUrl,
    imagePublicId: publicId,
    steps: z.array(requiredText(200)).default([]),
    termsText: text(1000),
  }),
  gallery: z.object({
    title: text(160),
    subtitle: text(500),
    imageUrl: optionalUrl,
    imagePublicId: publicId,
  }),
  blog: z.object({ title: text(160), subtitle: text(500), imageUrl: optionalUrl, imagePublicId: publicId }),
});

export const settingSchemas = {
  gst_percent: gstPercentSettingSchema,
  default_booking_percent: defaultBookingPercentSettingSchema,
  company: companySettingSchema,
  social: socialSettingSchema,
  home: homeSettingSchema,
  about: aboutSettingSchema,
  contact: contactSettingSchema,
  booking: bookingSettingSchema,
  policies: policiesSettingSchema,
  seo: seoSettingSchema,
  email: emailSettingSchema,
  pages: pagesSettingSchema,
};

export const SETTING_KEYS = Object.keys(settingSchemas);

/** Keys safe to expose on GET /settings/public (all of them today; none hold secrets). */
export const PUBLIC_SETTING_KEYS = SETTING_KEYS;
