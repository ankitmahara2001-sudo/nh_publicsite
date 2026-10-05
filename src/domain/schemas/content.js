import { z } from 'zod';
import { emailSchema, optionalText, phoneSchema, requiredText } from './common.js';

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
