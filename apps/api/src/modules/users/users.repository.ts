import type { User, CreateUser, UpdateUser } from '@repo/shared'
import { randomUUID } from 'crypto'

const users: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const usersRepository = {
  findAll(): User[] {
    return users
  },

  findById(id: string): User | undefined {
    return users.find((u) => u.id === id)
  },

  findByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email)
  },

  create(data: CreateUser): User {
    const now = new Date().toISOString()
    const user: User = {
      id: randomUUID(),
      ...data,
      role: data.role ?? 'user',
      createdAt: now,
      updatedAt: now,
    }
    users.push(user)
    return user
  },

  update(id: string, data: UpdateUser): User | undefined {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return undefined
    users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() }
    return users[index]
  },

  delete(id: string): boolean {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  },
}
