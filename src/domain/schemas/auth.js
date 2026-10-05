import { z } from 'zod';
import { OTP_LENGTH } from '../constants.js';
import { emailSchema, phoneSchema, requiredText } from './common.js';

// ---- Customer (email + OTP) ----------------------------------------------------

export const otpRequestSchema = z.object({ email: emailSchema });

export const otpVerifySchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code.`),
});

export const customerProfileSchema = z.object({
  name: requiredText(120),
  phone: phoneSchema,
});
