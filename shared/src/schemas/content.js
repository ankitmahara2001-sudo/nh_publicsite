import { z } from 'zod';
import {
  BLOG_CATEGORIES,
  BLOG_STATUSES,
  DISCOUNT_TYPES,
  ENQUIRY_STATUSES,
  GALLERY_CATEGORIES,
  PRICE_TYPES,
  UPLOAD_FOLDERS,
} from '../enums.js';
import {
  emailSchema,
  optionalText,
  paiseSchema,
  phoneSchema,
  requiredText,
  slugSchema,
  sortOrderSchema,
  urlSchema,
} from './common.js';

// ---- Home hero slides --------------------------------------------------------

export const heroSlideSchema = z.object({
  title: requiredText(120),
  region: requiredText(120),
  caption: optionalText(255),
  imageUrl: urlSchema,
  imagePublicId: optionalText(),
  linkUrl: optionalText(2048),
  sortOrder: sortOrderSchema,
  isActive: z.boolean().default(true),
});

// ---- Gallery -------------------------------------------------------------------

export const galleryImageSchema = z.object({
  url: urlSchema,
  publicId: optionalText(),
  caption: optionalText(255),
  place: optionalText(120),
  category: z.enum(GALLERY_CATEGORIES),
  width: z.int().positive().nullish(),
  height: z.int().positive().nullish(),
  sortOrder: sortOrderSchema,
  isActive: z.boolean().default(true),
});

export const galleryBulkCreateSchema = z.object({ images: z.array(galleryImageSchema).min(1) });

export const galleryQuerySchema = z.object({ category: z.enum(GALLERY_CATEGORIES).optional() });

// ---- Blog ----------------------------------------------------------------------

export const blogPostSchema = z.object({
  title: requiredText(200),
  slug: slugSchema,
  category: z.enum(BLOG_CATEGORIES),
  excerpt: requiredText(500),
  // HTML from the rich-text editor; the API sanitises it with an allowlist before saving.
  content: requiredText(200_000),
  coverImageUrl: urlSchema.nullish(),
  coverImagePublicId: optionalText(),
  authorName: requiredText(120),
  authorRole: optionalText(120),
  readMinutes: z.int().min(1).max(120),
  relatedPackageId: z.int().positive().nullish(),
  isFeatured: z.boolean().default(false),
  status: z.enum(BLOG_STATUSES).default('draft'),
  publishedAt: z.iso.datetime({ offset: true }).nullish(),
});

export const blogQuerySchema = z.object({
  category: z.enum(BLOG_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(6),
});

// ---- Coupons -------------------------------------------------------------------

const MAX_PERCENT_DISCOUNT = 100;

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3)
      .max(40)
      .regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, hyphens or underscores.')
      .transform((v) => v.toUpperCase()),
    description: requiredText(255),
    discountType: z.enum(DISCOUNT_TYPES),
    // Percent: whole number (10 = 10%). Flat: paise.
    discountValue: z.int().positive(),
    maxDiscount: paiseSchema.nullish(),
    minOrderAmount: paiseSchema.nullish(),
    appliesToPriceType: z.enum(PRICE_TYPES).nullish(),
    appliesToAllPackages: z.boolean().default(true),
    packageIds: z.array(z.int().positive()).default([]),
    validFrom: z.iso.datetime({ offset: true }).nullish(),
    validUntil: z.iso.datetime({ offset: true }).nullish(),
    totalUsageLimit: z.int().positive().nullish(),
    perCustomerLimit: z.int().positive().nullish(),
    showOnSite: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .refine((c) => c.discountType !== 'percent' || c.discountValue <= MAX_PERCENT_DISCOUNT, {
    message: 'A percent discount cannot be more than 100.',
    path: ['discountValue'],
  })
  .refine((c) => c.appliesToAllPackages || c.packageIds.length > 0, {
    message: 'Pick at least one package or apply the coupon to all packages.',
    path: ['packageIds'],
  })
  .refine((c) => !c.validFrom || !c.validUntil || c.validUntil > c.validFrom, {
    message: 'The end of validity must be after the start.',
    path: ['validUntil'],
  });

// ---- Enquiries -----------------------------------------------------------------

export const enquiryCreateSchema = z.object({
  name: requiredText(120),
  email: emailSchema,
  phone: phoneSchema,
  destination: optionalText(120),
  travellers: optionalText(40),
  travelMonth: optionalText(40),
  message: optionalText(4000),
});

export const enquiryStatusSchema = z.object({ status: z.enum(ENQUIRY_STATUSES) });

// ---- Uploads -------------------------------------------------------------------

export const uploadSignatureSchema = z.object({ folder: z.enum(UPLOAD_FOLDERS) });
export const uploadDeleteSchema = z.object({ publicId: requiredText(255) });
