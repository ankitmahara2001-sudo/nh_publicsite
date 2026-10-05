import { z } from 'zod';
import {
  MAX_BOOKING_PERCENT,
  MAX_REVIEW_RATING,
  MIN_BOOKING_PERCENT,
  DEFAULT_MIN_DAYS_BEFORE_BOOKING,
} from '../constants.js';
import { AVAILABILITY_TYPES, INCLUSION_TYPES, PRICE_TYPES, REGIONS, TRIP_TYPES } from '../enums.js';
import {
  isoDateSchema,
  optionalText,
  positivePaiseSchema,
  requiredText,
  slugSchema,
  sortOrderSchema,
  urlSchema,
} from './common.js';

// ---- Destinations ----------------------------------------------------------

export const destinationSchema = z.object({
  name: requiredText(120),
  slug: slugSchema,
  region: z.enum(REGIONS),
  district: requiredText(120),
  shortDescription: optionalText(500),
  coverImageUrl: urlSchema.nullish(),
  coverImagePublicId: optionalText(),
  sortOrder: sortOrderSchema,
  isActive: z.boolean().default(true),
});

// ---- Package details tab ---------------------------------------------------

export const packageDetailsSchema = z
  .object({
    destinationId: z.int().positive('Choose a destination.'),
    title: requiredText(160),
    slug: slugSchema,
    tripType: z.enum(TRIP_TYPES),
    fromCity: requiredText(120),
    toCity: requiredText(120),
    durationDays: z.int().min(1).max(60),
    durationNights: z.int().min(0).max(60),
    overview: requiredText(10_000),
    groupSizeMin: z.int().min(1).nullish(),
    groupSizeMax: z.int().min(1).nullish(),
    bestTime: optionalText(160),
    staySummary: optionalText(160),
    transport: optionalText(160),
    coverImageUrl: urlSchema.nullish(),
    coverImagePublicId: optionalText(),
    availabilityType: z.enum(AVAILABILITY_TYPES),
    minDaysBeforeBooking: z.int().min(0).max(365).default(DEFAULT_MIN_DAYS_BEFORE_BOOKING),
    bookingAmountPercent: z.int().min(MIN_BOOKING_PERCENT).max(MAX_BOOKING_PERCENT).nullish(),
    isFeatured: z.boolean().default(false),
    isPopular: z.boolean().default(false),
    isActive: z.boolean().default(true),
    sortOrder: sortOrderSchema,
    seoTitle: optionalText(160),
    seoDescription: optionalText(320),
  })
  .refine((p) => p.groupSizeMin == null || p.groupSizeMax == null || p.groupSizeMax >= p.groupSizeMin, {
    message: 'Maximum group size must be at least the minimum.',
    path: ['groupSizeMax'],
  });

export const packageFlagsSchema = z
  .object({
    isFeatured: z.boolean(),
    isPopular: z.boolean(),
    isActive: z.boolean(),
  })
  .partial()
  .refine((flags) => Object.keys(flags).length > 0, { message: 'Send at least one flag.' });

export const reorderSchema = z.object({
  ids: z.array(z.int().positive()).min(1),
});

// ---- Pricing tab -----------------------------------------------------------

export const packagePriceSchema = z
  .object({
    id: z.int().positive().optional(),
    label: requiredText(120),
    priceType: z.enum(PRICE_TYPES),
    personsCovered: z.int().min(1).max(50),
    originalPrice: positivePaiseSchema,
    discountedPrice: positivePaiseSchema.nullish(),
    note: optionalText(160),
    isDefault: z.boolean().default(false),
    sortOrder: sortOrderSchema,
  })
  .refine((p) => p.discountedPrice == null || p.discountedPrice < p.originalPrice, {
    message: 'Discounted price must be lower than the original price.',
    path: ['discountedPrice'],
  })
  .refine((p) => p.priceType !== 'per_person' || p.personsCovered === 1, {
    message: 'A per person price covers exactly 1 person.',
    path: ['personsCovered'],
  });

export const packagePricesSchema = z
  .object({ prices: z.array(packagePriceSchema).min(1, 'Add at least one price option.') })
  .refine((v) => v.prices.filter((p) => p.isDefault).length <= 1, {
    message: 'Only one price option can be the default.',
    path: ['prices'],
  });

// ---- Dates tab -------------------------------------------------------------

export const departureSchema = z.object({
  id: z.int().positive().optional(),
  startDate: isoDateSchema,
  totalSeats: z.int().min(1).nullish(),
  isActive: z.boolean().default(true),
});
export const departuresSchema = z
  .object({ departures: z.array(departureSchema) })
  .refine((v) => new Set(v.departures.map((d) => d.startDate)).size === v.departures.length, {
    message: 'Each departure date can only be added once.',
    path: ['departures'],
  });

export const blockedDateSchema = z
  .object({
    id: z.int().positive().optional(),
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    reason: optionalText(160),
  })
  .refine((b) => b.endDate >= b.startDate, {
    message: 'End date must be on or after the start date.',
    path: ['endDate'],
  });
export const blockedDatesSchema = z.object({ blockedDates: z.array(blockedDateSchema) });

// ---- Content tabs ----------------------------------------------------------

export const itineraryDaySchema = z.object({
  dayNumber: z.int().min(1),
  title: requiredText(160),
  description: requiredText(4000),
  meals: optionalText(160),
  stay: optionalText(160),
});
export const itinerarySchema = z
  .object({ days: z.array(itineraryDaySchema) })
  .refine((v) => new Set(v.days.map((d) => d.dayNumber)).size === v.days.length, {
    message: 'Day numbers must be unique.',
    path: ['days'],
  });

export const inclusionSchema = z.object({
  type: z.enum(INCLUSION_TYPES),
  text: requiredText(255),
  sortOrder: sortOrderSchema,
});
export const inclusionsSchema = z.object({ items: z.array(inclusionSchema) });

export const highlightSchema = z.object({
  title: requiredText(120),
  text: requiredText(255),
  sortOrder: sortOrderSchema,
});
export const highlightsSchema = z.object({ items: z.array(highlightSchema) });

export const hotelSchema = z.object({
  name: requiredText(160),
  rating: z.number().min(0).max(MAX_REVIEW_RATING).nullish(),
  roomType: optionalText(120),
  nights: z.int().min(0).max(60).nullish(),
  amenities: optionalText(255),
  imageUrl: urlSchema.nullish(),
  imagePublicId: optionalText(),
  sortOrder: sortOrderSchema,
});
export const hotelsSchema = z.object({ items: z.array(hotelSchema) });

export const faqSchema = z.object({
  question: requiredText(255),
  answer: requiredText(2000),
  sortOrder: sortOrderSchema,
});
export const faqsSchema = z.object({ items: z.array(faqSchema) });

export const packageImageSchema = z.object({
  url: urlSchema,
  publicId: optionalText(),
  altText: optionalText(255),
  width: z.int().positive().nullish(),
  height: z.int().positive().nullish(),
});
export const packageImagesCreateSchema = z.object({ images: z.array(packageImageSchema).min(1) });

// ---- Public listing filters --------------------------------------------------

export const PACKAGE_SORTS = ['recommended', 'price_asc', 'price_desc', 'duration'];

export const DURATION_BUCKETS = ['short', 'medium', 'long'];

export const packageListQuerySchema = z.object({
  destination: z.string().trim().optional(),
  tripType: z.enum(TRIP_TYPES).optional(),
  duration: z
    .union([z.enum(DURATION_BUCKETS), z.array(z.enum(DURATION_BUCKETS))])
    .optional()
    .transform((v) => (v == null ? undefined : Array.isArray(v) ? v : [v])),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  priceType: z.enum(PRICE_TYPES).optional(),
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM.')
    .optional(),
  sort: z.enum(PACKAGE_SORTS).default('recommended'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(9),
});

export const reviewSchema = z.object({
  packageId: z.int().positive().nullish(),
  name: requiredText(120),
  tripLabel: optionalText(160),
  rating: z.int().min(1).max(MAX_REVIEW_RATING),
  text: requiredText(2000),
  isPublished: z.boolean().default(true),
  sortOrder: sortOrderSchema,
});
