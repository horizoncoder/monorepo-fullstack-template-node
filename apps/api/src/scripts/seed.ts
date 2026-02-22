import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
  try {
    console.log('Seeding permissions...')
    for (const perm of PERMISSIONS_DATA) {
      await prisma.permission.upsert({
        where: { key: perm.key },
        update: { name: perm.name, description: perm.description, group: perm.group },
        create: perm,
      })
    }
    console.log(`  ${PERMISSIONS_DATA.length} permissions seeded`)

    // Create roles
    console.log('Seeding roles...')

    const editorRole = await prisma.role.upsert({
      where: { name: 'Editor' },
      update: {},
      create: { name: 'Editor', description: 'Can view and edit users' },
    })

    const managerRole = await prisma.role.upsert({
      where: { name: 'Manager' },
      update: {},
      create: { name: 'Manager', description: 'Full access to users and admins' },
    })

    const viewerRole = await prisma.role.upsert({
      where: { name: 'Viewer' },
      update: {},
      create: { name: 'Viewer', description: 'Read-only access' },
    })

    console.log('  3 roles created')

    // Assign permissions to roles
    const allPerms = await prisma.permission.findMany()
    const permMap = new Map(allPerms.map(p => [p.key, p.id]))

    // Editor: users.read, users.write, roles.read
    await prisma.rolePermission.deleteMany({ where: { roleId: editorRole.id } })
    await prisma.rolePermission.createMany({
      data: [
        { roleId: editorRole.id, permissionId: permMap.get('users.read')! },
        { roleId: editorRole.id, permissionId: permMap.get('users.write')! },
        { roleId: editorRole.id, permissionId: permMap.get('roles.read')! },
      ],
    })

    // Manager: all permissions
    await prisma.rolePermission.deleteMany({ where: { roleId: managerRole.id } })
    await prisma.rolePermission.createMany({
      data: allPerms.map(p => ({ roleId: managerRole.id, permissionId: p.id })),
    })

    // Viewer: *.read only
    await prisma.rolePermission.deleteMany({ where: { roleId: viewerRole.id } })
    await prisma.rolePermission.createMany({
      data: allPerms.filter(p => p.key.endsWith('.read')).map(p => ({ roleId: viewerRole.id, permissionId: p.id })),
    })

    console.log('  Permissions assigned to roles')

    // Create superadmin
    console.log('Seeding admin users...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const existing = await prisma.admin.findUnique({ where: { email: 'admin@example.com' } })
    if (!existing) {
      await prisma.admin.create({
        data: {
          email: 'admin@example.com',
          name: 'Super Admin',
          passwordHash: adminPassword,
          isSuperuser: true,
        },
      })
      console.log('  Super Admin created (admin@example.com / admin123)')
    } else {
      console.log('  Super Admin already exists')
    }

    // Create editor admin
    const editorExists = await prisma.admin.findUnique({ where: { email: 'editor@example.com' } })
    if (!editorExists) {
      const editorPassword = await bcrypt.hash('editor123', 10)
      const editor = await prisma.admin.create({
        data: {
          email: 'editor@example.com',
          name: 'Editor Admin',
          passwordHash: editorPassword,
          isSuperuser: false,
        },
      })
      await prisma.adminRole.create({
        data: { adminId: editor.id, roleId: editorRole.id },
      })
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
      const exists = await prisma.user.findUnique({ where: { email: u.email } })
      if (!exists) {
        await prisma.user.create({ data: { ...u, passwordHash: userPassword } })
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
    await prisma.$disconnect()
  }
}

main()
