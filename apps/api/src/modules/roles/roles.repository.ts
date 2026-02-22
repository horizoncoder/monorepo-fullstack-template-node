import { eq, inArray } from 'drizzle-orm'
import { db } from '../../db'
import { roles, rolePermissions, permissions } from '../../db/schema/permissions'

export const rolesRepository = {
  async findAll() {
    const allRoles = await db.select().from(roles)
    const allRolePerms = await db
      .select({
        roleId: rolePermissions.roleId,
        permissionKey: permissions.key,
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))

    return allRoles.map((role) => ({
      ...role,
      permissions: allRolePerms.filter((rp) => rp.roleId === role.id).map((rp) => rp.permissionKey),
    }))
  },

  async findById(id: string) {
    const [role] = await db.select().from(roles).where(eq(roles.id, id))
    if (!role) return null

    const perms = await db
      .select({ key: permissions.key })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, id))

    return { ...role, permissions: perms.map((p) => p.key) }
  },

  async findByName(name: string) {
    const [role] = await db.select().from(roles).where(eq(roles.name, name))
    return role ?? null
  },

  async create(data: { name: string; description?: string }) {
    const [role] = await db.insert(roles).values({
      name: data.name,
      description: data.description ?? null,
    }).returning()
    return role
  },

  async update(id: string, data: Partial<{ name: string; description: string }>) {
    const [role] = await db.update(roles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning()
    return role ?? null
  },

  async delete(id: string) {
    const [deleted] = await db.delete(roles).where(eq(roles.id, id)).returning({ id: roles.id })
    return !!deleted
  },

  async setPermissions(roleId: string, permissionKeys: string[]) {
    // Remove existing
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, roleId))

    if (permissionKeys.length === 0) return

    // Find permission IDs by keys
    const perms = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(inArray(permissions.key, permissionKeys))

    if (perms.length > 0) {
      await db.insert(rolePermissions).values(
        perms.map((p) => ({ roleId, permissionId: p.id })),
      )
    }
  },

  async count() {
    const result = await db.select({ id: roles.id }).from(roles)
    return result.length
  },
}
