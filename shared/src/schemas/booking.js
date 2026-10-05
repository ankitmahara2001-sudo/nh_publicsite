import { z } from 'zod';
import { MAX_TRAVELLER_COUNT } from '../constants.js';
import { BOOKING_STATUSES, GENDERS, OFFLINE_PAYMENT_METHODS, PAYMENT_STATUSES } from '../enums.js';
import { isoDateSchema, optionalText, phoneSchema, positivePaiseSchema, requiredText } from './common.js';

const counter = (min) => z.int().min(min).max(MAX_TRAVELLER_COUNT);

/**
 * Traveller counts. For per_person prices use adults/children; for per_couple and
 * per_group prices use units. Infants always travel free.
 */
export const travellerCountsSchema = z.object({
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

export const pricingQuoteSchema = z.object(tripChoiceShape);

export const travellerSchema = z.object({
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

export const paymentVerifySchema = z.object({
  razorpayOrderId: requiredText(64),
  razorpayPaymentId: requiredText(64),
  razorpaySignature: requiredText(256),
});

// ---- Admin booking actions ---------------------------------------------------------

export const recordBalancePaymentSchema = z.object({
  method: z.enum(OFFLINE_PAYMENT_METHODS),
  amount: positivePaiseSchema,
  reference: optionalText(120),
  paidAt: isoDateSchema,
  notes: optionalText(1000),
});

export const cancelBookingSchema = z.object({ reason: requiredText(1000) });

export const recordRefundSchema = z.object({
  amount: positivePaiseSchema,
  reference: optionalText(120),
  refundedAt: isoDateSchema,
  notes: optionalText(1000),
});

export const bookingStatusUpdateSchema = z.object({ status: z.literal('completed') });

export const adminBookingListQuerySchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  packageId: z.coerce.number().int().positive().optional(),
  from: isoDateSchema.optional(),
  to: isoDateSchema.optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
