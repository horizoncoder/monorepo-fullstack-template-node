import { prisma } from '../../db'

const selectPublic = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} as const

export const usersRepository = {
  async findAll() {
    return prisma.user.findMany({ select: selectPublic })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: selectPublic })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async create(data: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({ data, select: selectPublic })
  },

  async update(id: string, data: Partial<{ email: string; name: string; passwordHash: string }>) {
    try {
      return await prisma.user.update({ where: { id }, data, select: selectPublic })
    } catch {
      return null
    }
  },

  async delete(id: string) {
    try {
      await prisma.user.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  },

  async count() {
    return prisma.user.count()
  },
}
