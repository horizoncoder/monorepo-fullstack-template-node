import { prisma } from '../../db'

function resolveRolesAndPermissions(adminRoles: any[]) {
  const rolesMap = new Map<string, { id: string; name: string }>()
  const permissionSet = new Set<string>()

  for (const ar of adminRoles) {
    rolesMap.set(ar.role.id, { id: ar.role.id, name: ar.role.name })
    for (const rp of ar.role.rolePermissions) {
      permissionSet.add(rp.permission.key)
    }
  }

  return {
    roles: Array.from(rolesMap.values()),
    permissions: Array.from(permissionSet),
  }
}

const adminWithRolesInclude = {
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
} as const

export const adminsRepository = {
  async findAll() {
    const allAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isSuperuser: true,
        createdAt: true,
        updatedAt: true,
        ...adminWithRolesInclude,
      },
    })

    return allAdmins.map((admin) => {
      const { adminRoles, ...rest } = admin
      return { ...rest, ...resolveRolesAndPermissions(adminRoles) }
    })
  },

  async findById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        isSuperuser: true,
        createdAt: true,
        updatedAt: true,
        ...adminWithRolesInclude,
      },
    })
    if (!admin) return null

    const { adminRoles, ...rest } = admin
    return { ...rest, ...resolveRolesAndPermissions(adminRoles) }
  },

  async findByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } })
  },

  async create(data: { email: string; name: string; passwordHash: string; isSuperuser: boolean }) {
    return prisma.admin.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isSuperuser: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  },

  async update(id: string, data: Partial<{ email: string; name: string; passwordHash: string; isSuperuser: boolean }>) {
    try {
      return await prisma.admin.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          isSuperuser: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    } catch {
      return null
    }
  },

  async setRoles(adminId: string, roleIds: string[]) {
    await prisma.adminRole.deleteMany({ where: { adminId } })

    if (roleIds.length > 0) {
      await prisma.adminRole.createMany({
        data: roleIds.map((roleId) => ({ adminId, roleId })),
      })
    }
  },

  async delete(id: string) {
    try {
      await prisma.admin.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  },

  async count() {
    return prisma.admin.count()
  },

  async getAdminRolesAndPermissions(adminId: string) {
    const adminRoles = await prisma.adminRole.findMany({
      where: { adminId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true },
            },
          },
        },
      },
    })
    return resolveRolesAndPermissions(adminRoles)
  },
}
