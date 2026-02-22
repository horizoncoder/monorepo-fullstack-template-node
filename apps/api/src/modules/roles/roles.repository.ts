import { prisma } from '../../db'

export const rolesRepository = {
  async findAll() {
    const allRoles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    })

    return allRoles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.rolePermissions.map((rp) => rp.permission.key),
    }))
  },

  async findById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    })
    if (!role) return null

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.rolePermissions.map((rp) => rp.permission.key),
    }
  },

  async findByName(name: string) {
    return prisma.role.findUnique({ where: { name } })
  },

  async create(data: { name: string; description?: string }) {
    return prisma.role.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    })
  },

  async update(id: string, data: Partial<{ name: string; description: string }>) {
    try {
      return await prisma.role.update({ where: { id }, data })
    } catch {
      return null
    }
  },

  async delete(id: string) {
    try {
      await prisma.role.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  },

  async setPermissions(roleId: string, permissionKeys: string[]) {
    await prisma.rolePermission.deleteMany({ where: { roleId } })

    if (permissionKeys.length === 0) return

    const perms = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
      select: { id: true },
    })

    if (perms.length > 0) {
      await prisma.rolePermission.createMany({
        data: perms.map((p) => ({ roleId, permissionId: p.id })),
      })
    }
  },

  async count() {
    return prisma.role.count()
  },
}
