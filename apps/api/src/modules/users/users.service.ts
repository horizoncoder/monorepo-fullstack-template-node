import type { CreateUser, UpdateUser } from '@repo/shared'
import { HTTPException } from 'hono/http-exception'
import { usersRepository } from './users.repository'

export const usersService = {
  getAll() { return usersRepository.findAll() },
  getById(id: string) {
    const user = usersRepository.findById(id)
    if (!user) throw new HTTPException(404, { message: 'User not found' })
    return user
  },
  create(data: CreateUser) {
    const existing = usersRepository.findByEmail(data.email)
    if (existing) throw new HTTPException(409, { message: 'User with this email already exists' })
    return usersRepository.create(data)
  },
  update(id: string, data: UpdateUser) {
    const user = usersRepository.update(id, data)
    if (!user) throw new HTTPException(404, { message: 'User not found' })
    return user
  },
  delete(id: string) {
    const deleted = usersRepository.delete(id)
    if (!deleted) throw new HTTPException(404, { message: 'User not found' })
  },
}
