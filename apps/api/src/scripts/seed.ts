import bcrypt from 'bcrypt'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq, sql } from 'drizzle-orm'
import { admins } from '../db/schema/admins'
import { users } from '../db/schema/users'
import { permissions, roles, rolePermissions, adminRoles } from '../db/schema/permissions'

const PERMISSIONS_DATA = [
  { key: 'users.read', name: 'View Users', description: 'View user list and details', group: 'Users' },
  { key: 'users.write', name: 'Create/Edit Users', description: 'Create and update users', group: 'Users' },
  { key: 'users.delete', name: 'Delete Users', description: 'Delete users', group: 'Users' },
  { key: 'admins.read', name: 'View Admins', description: 'View admin list and details', group: 'Admins' },
  { key: 'admins.write', name: 'Create/Edit Admins', description: 'Create and update admins', group: 'Admins' },
  { key: 'admins.delete', name: 'Delete Admins', description: 'Delete admins', group: 'Admins' },
  { key: 'roles.read', name: 'View Roles', description: 'View role list and details', group: 'Roles' },
  { key: 'roles.write', name: 'Create/Edit Roles', description: 'Create and update roles', group: 'Roles' },
  { key: 'roles.delete', name: 'Delete Roles', description: 'Delete roles', group: 'Roles' },
]

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/saas'
  const client = postgres(connectionString)
  const db = drizzle(client)

  try {
    console.log('Seeding permissions...')
    for (const perm of PERMISSIONS_DATA) {
      await db.insert(permissions).values(perm).onConflictDoUpdate({
        target: permissions.key,
        set: { name: sql`excluded.name`, description: sql`excluded.description`, group: sql`excluded.group` },
      })
    }
    console.log(`  ${PERMISSIONS_DATA.length} permissions seeded`)

    // Create roles
    console.log('Seeding roles...')

    const editorRoleData = { name: 'Editor', description: 'Can view and edit users' }
    await db.insert(roles).values(editorRoleData).onConflictDoNothing()
    const [editorRole] = await db.select().from(roles).where(eq(roles.name, 'Editor'))

    const managerRoleData = { name: 'Manager', description: 'Full access to users and admins' }
    await db.insert(roles).values(managerRoleData).onConflictDoNothing()
    const [managerRole] = await db.select().from(roles).where(eq(roles.name, 'Manager'))

    const viewerRoleData = { name: 'Viewer', description: 'Read-only access' }
    await db.insert(roles).values(viewerRoleData).onConflictDoNothing()
    const [viewerRole] = await db.select().from(roles).where(eq(roles.name, 'Viewer'))

    console.log('  3 roles created')

    // Assign permissions to roles
    const allPerms = await db.select().from(permissions)
    const permMap = new Map(allPerms.map(p => [p.key, p.id]))

    // Editor: users.read, users.write, roles.read
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, editorRole.id))
    await db.insert(rolePermissions).values([
      { roleId: editorRole.id, permissionId: permMap.get('users.read')! },
      { roleId: editorRole.id, permissionId: permMap.get('users.write')! },
      { roleId: editorRole.id, permissionId: permMap.get('roles.read')! },
    ])

    // Manager: all permissions
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, managerRole.id))
    await db.insert(rolePermissions).values(
      allPerms.map(p => ({ roleId: managerRole.id, permissionId: p.id })),
    )

    // Viewer: *.read only
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, viewerRole.id))
    await db.insert(rolePermissions).values(
      allPerms.filter(p => p.key.endsWith('.read')).map(p => ({ roleId: viewerRole.id, permissionId: p.id })),
    )

    console.log('  Permissions assigned to roles')

    // Create superadmin
    console.log('Seeding admin users...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const existing = await db.select().from(admins).where(eq(admins.email, 'admin@example.com'))
    if (existing.length === 0) {
      await db.insert(admins).values({
        email: 'admin@example.com',
        name: 'Super Admin',
        passwordHash: adminPassword,
        isSuperuser: true,
      })
      console.log('  Super Admin created (admin@example.com / admin123)')
    } else {
      console.log('  Super Admin already exists')
    }

    // Create editor admin
    const editorExists = await db.select().from(admins).where(eq(admins.email, 'editor@example.com'))
    if (editorExists.length === 0) {
      const editorPassword = await bcrypt.hash('editor123', 10)
      const [editor] = await db.insert(admins).values({
        email: 'editor@example.com',
        name: 'Editor Admin',
        passwordHash: editorPassword,
        isSuperuser: false,
      }).returning()
      await db.insert(adminRoles).values({ adminId: editor.id, roleId: editorRole.id })
      console.log('  Editor Admin created (editor@example.com / editor123)')
    } else {
      console.log('  Editor Admin already exists')
    }

    // Create test users
    console.log('Seeding users...')
    const userPassword = await bcrypt.hash('user123', 10)
    const testUsers = [
      { email: 'john@example.com', name: 'John Doe' },
      { email: 'jane@example.com', name: 'Jane Smith' },
      { email: 'bob@example.com', name: 'Bob Wilson' },
    ]

    for (const u of testUsers) {
      const exists = await db.select().from(users).where(eq(users.email, u.email))
      if (exists.length === 0) {
        await db.insert(users).values({ ...u, passwordHash: userPassword })
        console.log(`  User ${u.name} created (${u.email} / user123)`)
      } else {
        console.log(`  User ${u.email} already exists`)
      }
    }

    console.log('\nSeed complete!')
    console.log('\nTest accounts:')
    console.log('  Admin: admin@example.com / admin123 (superuser)')
    console.log('  Admin: editor@example.com / editor123 (Editor role)')
    console.log('  User:  john@example.com / user123')
    console.log('  User:  jane@example.com / user123')
    console.log('  User:  bob@example.com / user123')
  } catch (error: any) {
    console.error('Seed error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
