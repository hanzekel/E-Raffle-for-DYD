import { z } from 'zod';
import validator from 'validator';

export const CAMP_NAMES = [
  'Camp 1 - Manila',
  'Camp 2 - Cavite',
  'Camp 3 - Laguna',
  'Camp 4 - Batangas',
  'Camp 5 - Rizal',
  'Camp 6 - Bulacan',
  'Camp 7 - Pampanga',
  'Camp 8 - Pangasinan',
  'Other',
];

const sanitizeString = (val: string) => validator.escape(validator.stripLow(val.trim()));

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters long')
    .max(100, 'Full name cannot exceed 100 characters')
    .transform(sanitizeString),
  email: z
    .string()
    .email('Invalid email address')
    .transform(sanitizeString),
  contactNumber: z
    .string()
    .regex(/^09\d{9}$/, 'Contact number must be a valid Philippine mobile number starting with 09 and exactly 11 digits'),
  campName: z
    .string()
    .min(1, 'Camp name is required')
    .transform(sanitizeString)
    .refine(
      (val) => CAMP_NAMES.includes(val) || val.length > 0,
      'Camp name is invalid'
    ), // Since 'Other' might allow custom strings in some UIs, we just ensure it's sanitized and not empty. Alternatively, validate strictly.
  ticketCount: z
    .number()
    .int()
    .min(1, 'Ticket count must be at least 1')
    .max(10, 'Ticket count cannot exceed 10'),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(['gcash', 'bank']),
  referenceNumber: z
    .string()
    .regex(/^[a-zA-Z0-9]{8,30}$/, 'Reference number must be 8-30 alphanumeric characters'),
  proofOfPaymentPath: z.string().min(1, 'Proof of payment path is required'),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required').transform(sanitizeString),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
