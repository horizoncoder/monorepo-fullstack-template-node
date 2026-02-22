import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { sessions } from '../../db/schema/sessions'
import { admins } from '../../db/schema/admins'
import { users } from '../../db/schema/users'
import { adminRoles, rolePermissions, roles, permissions } from '../../db/schema/permissions'

export const authRepository = {
  async findAdminByEmail(email: string) {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email))
    return admin ?? null
  },

  async findAdminById(id: string) {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id))
    if (!admin) return null

    // Resolve roles and permissions
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
      .where(eq(adminRoles.adminId, id))

    const rolesMap = new Map<string, { id: string; name: string }>()
    const permissionSet = new Set<string>()

    for (const row of adminRoleRows) {
      rolesMap.set(row.roleId, { id: row.roleId, name: row.roleName })
      if (row.permissionKey) permissionSet.add(row.permissionKey)
    }

    return {
      ...admin,
      roles: Array.from(rolesMap.values()),
      permissions: Array.from(permissionSet),
    }
  },

  async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user ?? null
  },

  async findUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user ?? null
  },

  async createSession(data: { adminId?: string; userId?: string; expiresAt: Date }) {
    const [session] = await db.insert(sessions).values({
      adminId: data.adminId ?? null,
      userId: data.userId ?? null,
      expiresAt: data.expiresAt,
    }).returning()
    return session
  },

  async findSessionById(id: string) {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id))
    return session ?? null
  },

  async deleteSession(id: string) {
    await db.delete(sessions).where(eq(sessions.id, id))
  },
}
