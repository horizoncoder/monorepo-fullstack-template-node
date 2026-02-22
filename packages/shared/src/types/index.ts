import type { z } from 'zod'
import type {
  userSchema,
  createUserSchema,
  updateUserSchema,
  loginSchema,
} from '../schemas/user'
import type {
  adminSchema,
  createAdminSchema,
  updateAdminSchema,
} from '../schemas/admin'
import type {
  permissionEnum,
  sessionSchema,
  registerSchema,
} from '../schemas/auth'
import type {
  roleSchema,
  createRoleSchema,
  updateRoleSchema,
} from '../schemas/role'

// User types
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// Admin types
export type Admin = z.infer<typeof adminSchema>
export type CreateAdmin = z.infer<typeof createAdminSchema>
export type UpdateAdmin = z.infer<typeof updateAdminSchema>

// Role types
export type Role = z.infer<typeof roleSchema>
export type CreateRole = z.infer<typeof createRoleSchema>
export type UpdateRole = z.infer<typeof updateRoleSchema>

// Auth types
export type Permission = z.infer<typeof permissionEnum>
export type Session = z.infer<typeof sessionSchema>

// API response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code: string
  status: number
}
