import { z } from 'zod';

export const SignupSchema = z.object({
	name: z.string(),
	email: z.string().email(),
  	password: z.string().min(6),
});

export const AddressSchema = z.object({
	line1: z.string(),
	line2: z.string(),
	city: z.string(),
	state: z.string(),
	zip: z.string().length(5),
});

export const UpdateUserSchema = z.object({
	name: z.string().optional(),
	defaultShippingAddress: z.number().optional(),
	defaultBillingAddress: z.number().optional(),
});