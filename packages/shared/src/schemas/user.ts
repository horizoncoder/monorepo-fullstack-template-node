import { z } from 'zod'

export const userRoleEnum = z.enum(['admin', 'user'])

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: userRoleEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: userRoleEnum.default('user'),
})

export const updateUserSchema = createUserSchema.partial()

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
