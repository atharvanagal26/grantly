import { z } from 'zod';

export const emailSchema = z.string().trim().email('Enter a valid email address.');
export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Enter at least 2 characters.'),
  email: emailSchema,
  password: z.string().min(8, 'Use at least 8 characters for this demo form.'),
});
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter a password to continue.'),
});
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.'),
  email: emailSchema,
  educationLevel: z.string().optional(),
  course: z.string().optional(),
  institution: z.string().optional(),
  state: z.string().optional(),
  annualFamilyIncome: z.union([z.literal(''), z.coerce.number().min(0, 'Income cannot be negative.')]).optional(),
  percentage: z.union([z.literal(''), z.coerce.number().min(0).max(100, 'Enter a percentage from 0 to 100.')]).optional(),
});
