import { z } from 'zod';

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().regex(/^09\d{9}$/, 'Must be a valid Philippine mobile number (e.g., 09123456789)'),
  campName: z.string().min(1, 'Camp name is required'),
  ticketCount: z.number().min(1, 'At least 1 ticket required').max(100, 'Maximum limit reached'),
});

export const paymentSchema = z.object({
  paymentMethod: z.enum(['gcash', 'bank']),
  referenceNumber: z.string().regex(/^[a-zA-Z0-9]{8,30}$/, 'Reference number must be 8-30 alphanumeric characters'),
  proofOfPaymentPath: z.string().min(1, 'Proof of payment is required'),
});

export const validateField = (schema: z.ZodSchema, fieldName: string, value: any): string | null => {
  if (schema instanceof z.ZodObject) {
    const fieldSchema = schema.shape[fieldName];
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        return result.error.errors[0].message;
      }
    }
  }
  return null;
};
