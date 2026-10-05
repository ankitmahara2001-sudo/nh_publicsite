import { z } from 'zod';
import { OTP_LENGTH } from '../constants.js';
import { emailSchema, phoneSchema, requiredText } from './common.js';

const MIN_ADMIN_PASSWORD_LENGTH = 10;

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

// ---- Admin -------------------------------------------------------------------------

export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.').max(200),
});

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.').max(200),
    newPassword: z
      .string()
      .min(MIN_ADMIN_PASSWORD_LENGTH, `Use at least ${MIN_ADMIN_PASSWORD_LENGTH} characters.`)
      .max(200),
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: 'The new password must be different.',
    path: ['newPassword'],
  });
