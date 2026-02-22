import type { CreateUser, UpdateUser } from '@repo/shared'
import { HTTPException } from 'hono/http-exception'
import bcrypt from 'bcrypt'
import { usersRepository } from './users.repository'

export const usersService = {
  async getAll() {
    return usersRepository.findAll()
  },

  async getById(id: string) {
    const user = await usersRepository.findById(id)
    if (!user) throw new HTTPException(404, { message: 'User not found' })
    return user
  },

  async create(data: CreateUser) {
    const existing = await usersRepository.findByEmail(data.email)
    if (existing) throw new HTTPException(409, { message: 'User with this email already exists' })
    const passwordHash = await bcrypt.hash(data.password, 10)
    return usersRepository.create({ email: data.email, name: data.name, passwordHash })
  },

  async update(id: string, data: UpdateUser) {
    const updateData: Partial<{ email: string; name: string; passwordHash: string }> = {}
    if (data.email) updateData.email = data.email
    if (data.name) updateData.name = data.name
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10)

    const user = await usersRepository.update(id, updateData)
    if (!user) throw new HTTPException(404, { message: 'User not found' })
    return user
  },

  async delete(id: string) {
    const deleted = await usersRepository.delete(id)
    if (!deleted) throw new HTTPException(404, { message: 'User not found' })
  },
}
