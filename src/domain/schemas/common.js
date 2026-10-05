import { z } from 'zod';

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

/** Calendar date as YYYY-MM-DD (no time, no timezone). */
export const isoDateSchema = z.iso.date('Enter a valid date (YYYY-MM-DD).');

export const emailSchema = z
  .email('Enter a valid email address.')
  .trim()
  .max(255)
  .transform((value) => value.toLowerCase());

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ]{10,15}$/, 'Enter a valid phone number.');
