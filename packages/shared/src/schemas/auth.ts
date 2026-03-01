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

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
})

export const googleAuthSchema = z.object({
  credential: z.string().min(1),
})

export const telegramAuthSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string(),
})
