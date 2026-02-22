import { pgTable, uuid, varchar, text, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { admins } from './admins'

// Master list of all available permissions
export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  group: varchar('group', { length: 100 }).notNull(),
})

// Named groups of permissions
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Many-to-many: role <-> permission
export const rolePermissions = pgTable('role_permissions', {
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (t) => [
  primaryKey({ columns: [t.roleId, t.permissionId] }),
])

// Many-to-many: admin <-> role
export const adminRoles = pgTable('admin_roles', {
  adminId: uuid('admin_id').notNull().references(() => admins.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.adminId, t.roleId] }),
])
