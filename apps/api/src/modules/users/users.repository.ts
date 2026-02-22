import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema/users'

export const usersRepository = {
  async findAll() {
    return db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users)
  },

  async findById(id: string) {
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, id))
    return user ?? null
  },

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user ?? null
  },

  async create(data: { email: string; name: string; passwordHash: string }) {
    const [user] = await db.insert(users).values({
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    return user
  },

  async update(id: string, data: Partial<{ email: string; name: string; passwordHash: string }>) {
    const [user] = await db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
    return user ?? null
  },

  async delete(id: string) {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
    return !!deleted
  },

  async count() {
    const result = await db.select({ id: users.id }).from(users)
    return result.length
  },
}
