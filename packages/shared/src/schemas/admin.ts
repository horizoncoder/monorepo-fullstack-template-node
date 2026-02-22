import { z } from 'zod'
import { roleSchema } from './role'

export const adminSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  roles: z.array(roleSchema.pick({ id: true, name: true })),
  permissions: z.array(z.string()),
  isSuperuser: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createAdminSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  roleIds: z.array(z.string().uuid()).default([]),
  isSuperuser: z.boolean().default(false),
})

export const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  roleIds: z.array(z.string().uuid()).optional(),
  isSuperuser: z.boolean().optional(),
})
