import { z } from 'zod';

export const ProductSchema = z.object({
	name: z.string(),
	description: z.string().max(100),
	price: z.number(),
  	tags: z.string().min(6),
});