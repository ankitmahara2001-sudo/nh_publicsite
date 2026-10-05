import { z } from 'zod';
import { MAX_TRAVELLER_COUNT } from '../constants.js';
import { GENDERS } from '../enums.js';
import { isoDateSchema, optionalText, phoneSchema, requiredText } from './common.js';

const counter = (min) => z.int().min(min).max(MAX_TRAVELLER_COUNT);

/**
 * Traveller counts. For per_person prices use adults/children; for per_couple and
 * per_group prices use units. Infants always travel free.
 */
const travellerCountsSchema = z.object({
  adults: counter(0).default(0),
  children: counter(0).default(0),
  infants: counter(0).default(0),
  units: counter(0).default(0),
});

const tripChoiceShape = {
  packageId: z.int().positive(),
  priceId: z.int().positive(),
  counts: travellerCountsSchema,
  // all_season packages send travelDate; fixed_date packages send departureId.
  travelDate: isoDateSchema.optional(),
  departureId: z.int().positive().optional(),
  couponCode: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v.toUpperCase() : undefined)),
};

const travellerSchema = z.object({
  fullName: requiredText(120),
  age: z.int().min(0).max(120),
  gender: z.enum(GENDERS),
});

export const createBookingSchema = z.object({
  ...tripChoiceShape,
  pickupPoint: requiredText(160),
  leadName: requiredText(120),
  leadPhone: phoneSchema,
  specialRequests: optionalText(2000),
  // First traveller is the lead traveller.
  travellers: z.array(travellerSchema).min(1, 'Add traveller details.'),
  acceptTerms: z.literal(true, 'Please accept the booking terms.'),
});
