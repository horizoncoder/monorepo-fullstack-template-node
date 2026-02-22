import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { admins } from '../../db/schema/admins'
import { adminRoles, rolePermissions, roles, permissions } from '../../db/schema/permissions'

// Helper: get admin's roles and resolved permissions
async function getAdminRolesAndPermissions(adminId: string) {
  const adminRoleRows = await db
    .select({
      roleId: roles.id,
      roleName: roles.name,
      permissionKey: permissions.key,
    })
    .from(adminRoles)
    .innerJoin(roles, eq(adminRoles.roleId, roles.id))
    .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
    .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(adminRoles.adminId, adminId))

  const rolesMap = new Map<string, { id: string; name: string }>()
  const permissionSet = new Set<string>()

  for (const row of adminRoleRows) {
    rolesMap.set(row.roleId, { id: row.roleId, name: row.roleName })
    if (row.permissionKey) permissionSet.add(row.permissionKey)
  }

  return {
    roles: Array.from(rolesMap.values()),
    permissions: Array.from(permissionSet),
  }
}

export const adminsRepository = {
  async findAll() {
    const allAdmins = await db.select({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      isSuperuser: admins.isSuperuser,
      createdAt: admins.createdAt,
      updatedAt: admins.updatedAt,
    }).from(admins)

    return Promise.all(allAdmins.map(async (admin) => {
      const { roles, permissions } = await getAdminRolesAndPermissions(admin.id)
      return { ...admin, roles, permissions }
    }))
  },

  async findById(id: string) {
    const [admin] = await db.select({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      isSuperuser: admins.isSuperuser,
      createdAt: admins.createdAt,
      updatedAt: admins.updatedAt,
    }).from(admins).where(eq(admins.id, id))
    if (!admin) return null

    const { roles, permissions } = await getAdminRolesAndPermissions(admin.id)
    return { ...admin, roles, permissions }
  },

  async findByEmail(email: string) {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email))
    return admin ?? null
  },

  async create(data: { email: string; name: string; passwordHash: string; isSuperuser: boolean }) {
    const [admin] = await db.insert(admins).values({
      email: data.email,
      name: data.name,
      passwordHash: data.passwordHash,
      isSuperuser: data.isSuperuser,
    }).returning({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      isSuperuser: admins.isSuperuser,
      createdAt: admins.createdAt,
      updatedAt: admins.updatedAt,
    })
    return admin
  },

  async update(id: string, data: Partial<{ email: string; name: string; passwordHash: string; isSuperuser: boolean }>) {
    const [admin] = await db.update(admins)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(admins.id, id))
      .returning({
        id: admins.id,
        email: admins.email,
        name: admins.name,
        isSuperuser: admins.isSuperuser,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
      })
    return admin ?? null
  },

  async setRoles(adminId: string, roleIds: string[]) {
    await db.delete(adminRoles).where(eq(adminRoles.adminId, adminId))

    if (roleIds.length > 0) {
      await db.insert(adminRoles).values(
        roleIds.map((roleId) => ({ adminId, roleId })),
      )
    }
  },

  async delete(id: string) {
    const [deleted] = await db.delete(admins).where(eq(admins.id, id)).returning({ id: admins.id })
    return !!deleted
  },

  async count() {
    const result = await db.select({ id: admins.id }).from(admins)
    return result.length
  },

  getAdminRolesAndPermissions,
}
