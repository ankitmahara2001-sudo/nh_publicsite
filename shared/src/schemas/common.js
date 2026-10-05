import { z } from 'zod';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants.js';

/** Required, trimmed, non-empty text. */
export const requiredText = (max = 255) => z.string().trim().min(1, 'This field is required.').max(max);

/** Optional text: empty strings become null so the database stores NULL, not ''. */
export const optionalText = (max = 255) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value ? value : null));

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug is required.')
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens.');

/** Money in integer paise (₹1 = 100 paise). */
export const paiseSchema = z.int('Enter a whole amount.').nonnegative('Amount cannot be negative.');
export const positivePaiseSchema = z.int('Enter a whole amount.').positive('Amount must be more than zero.');

export const idSchema = z.coerce.number().int().positive();
export const idParamSchema = z.object({ id: idSchema });

/** Calendar date as YYYY-MM-DD (no time, no timezone). */
export const isoDateSchema = z.iso.date('Enter a valid date (YYYY-MM-DD).');

export const sortOrderSchema = z.int().nonnegative().default(0);

export const emailSchema = z
  .email('Enter a valid email address.')
  .trim()
  .max(255)
  .transform((value) => value.toLowerCase());

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ]{10,15}$/, 'Enter a valid phone number.');

export const urlSchema = z.url('Enter a valid URL.').max(2048);

/** An uploaded image as returned by Cloudinary and saved through the API. */
export const imageSchema = z.object({
  url: urlSchema,
  publicId: optionalText(255),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});
