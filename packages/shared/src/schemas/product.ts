import { z } from 'zod'

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
})

export const updateProductSchema = createProductSchema.partial()
