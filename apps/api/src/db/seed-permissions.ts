import { PrismaClient } from '@prisma/client'

const PERMISSIONS = [
  // Users management
  { key: 'users.read', name: 'View Users', description: 'View user list and details', group: 'Users' },
  { key: 'users.write', name: 'Create/Edit Users', description: 'Create and update users', group: 'Users' },
  { key: 'users.delete', name: 'Delete Users', description: 'Delete users', group: 'Users' },

  // Admins management
  { key: 'admins.read', name: 'View Admins', description: 'View admin list and details', group: 'Admins' },
  { key: 'admins.write', name: 'Create/Edit Admins', description: 'Create and update admins', group: 'Admins' },
  { key: 'admins.delete', name: 'Delete Admins', description: 'Delete admins', group: 'Admins' },

  // Roles management
  { key: 'roles.read', name: 'View Roles', description: 'View role list and details', group: 'Roles' },
  { key: 'roles.write', name: 'Create/Edit Roles', description: 'Create and update roles', group: 'Roles' },
  { key: 'roles.delete', name: 'Delete Roles', description: 'Delete roles', group: 'Roles' },
]

export async function seedPermissions() {
  const prisma = new PrismaClient()

  try {
    for (const perm of PERMISSIONS) {
      await prisma.permission.upsert({
        where: { key: perm.key },
        update: { name: perm.name, description: perm.description, group: perm.group },
        create: perm,
      })
    }
    console.log(`Seeded ${PERMISSIONS.length} permissions`)
  } finally {
    await prisma.$disconnect()
  }
}

// Run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPermissions()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1) })
}
