import { z } from 'zod'

export const permissionEnum = z.enum([
  'users.read',
  'users.write',
  'users.delete',
  'admins.read',
  'admins.write',
  'admins.delete',
  'roles.read',
  'roles.write',
  'roles.delete',
])

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6),
})

export const sessionSchema = z.object({
  id: z.string().uuid(),
  adminId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
})
