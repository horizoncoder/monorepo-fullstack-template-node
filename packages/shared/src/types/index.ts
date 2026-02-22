import type { z } from 'zod'
import type {
  userSchema,
  createUserSchema,
  updateUserSchema,
  userRoleEnum,
  loginSchema,
} from '../schemas/user'
import type {
  productSchema,
  createProductSchema,
  updateProductSchema,
} from '../schemas/product'

// User types
export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type UserRole = z.infer<typeof userRoleEnum>
export type LoginInput = z.infer<typeof loginSchema>

// Product types
export type Product = z.infer<typeof productSchema>
export type CreateProduct = z.infer<typeof createProductSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>

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
