import { prisma } from '../../db'

export const profileRepository = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async updateProfile(id: string, data: { name: string; email: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    })
  },

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
}
