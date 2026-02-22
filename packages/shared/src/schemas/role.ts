import { z } from 'zod'
import { permissionEnum } from './auth'

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  permissions: z.array(permissionEnum),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(permissionEnum).default([]),
})

export const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(permissionEnum).optional(),
})
