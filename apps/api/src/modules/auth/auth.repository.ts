import { prisma } from '../../db'

export const authRepository = {
  async findAdminByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } })
  },

  async findAdminById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: {
        adminRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    })
    if (!admin) return null

    const rolesMap = new Map<string, { id: string; name: string }>()
    const permissionSet = new Set<string>()

    for (const ar of admin.adminRoles) {
      rolesMap.set(ar.role.id, { id: ar.role.id, name: ar.role.name })
      for (const rp of ar.role.rolePermissions) {
        permissionSet.add(rp.permission.key)
      }
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      passwordHash: admin.passwordHash,
      isSuperuser: admin.isSuperuser,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      roles: Array.from(rolesMap.values()),
      permissions: Array.from(permissionSet),
    }
  },

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  async createSession(data: { adminId?: string; userId?: string; expiresAt: Date }) {
    return prisma.session.create({
      data: {
        adminId: data.adminId ?? null,
        userId: data.userId ?? null,
        expiresAt: data.expiresAt,
      },
    })
  },

  async findSessionById(id: string) {
    return prisma.session.findUnique({ where: { id } })
  },

  async deleteSession(id: string) {
    await prisma.session.delete({ where: { id } }).catch(() => {})
  },
}
