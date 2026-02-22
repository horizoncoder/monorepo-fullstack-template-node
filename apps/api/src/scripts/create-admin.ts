import bcrypt from 'bcrypt'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { admins } from '../db/schema/admins'

const args = process.argv.slice(2)

function getArg(name: string): string | undefined {
  const index = args.indexOf(`--${name}`)
  if (index === -1) return undefined
  return args[index + 1]
}

const hasFlag = (name: string) => args.includes(`--${name}`)

async function main() {
  const email = getArg('email')
  const password = getArg('password')
  const name = getArg('name') || 'Admin'
  const isSuperuser = hasFlag('superuser')

  if (!email || !password) {
    console.error('Usage: tsx src/scripts/create-admin.ts --email <email> --password <password> [--name <name>] [--superuser]')
    process.exit(1)
  }

  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/saas'
  const client = postgres(connectionString)
  const db = drizzle(client)

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const [admin] = await db.insert(admins).values({
      email,
      name,
      passwordHash,
      isSuperuser,
    }).returning({
      id: admins.id,
      email: admins.email,
      name: admins.name,
      isSuperuser: admins.isSuperuser,
    })

    console.log('Admin created successfully:')
    console.log(`  ID: ${admin.id}`)
    console.log(`  Email: ${admin.email}`)
    console.log(`  Name: ${admin.name}`)
    console.log(`  Superuser: ${admin.isSuperuser}`)
  } catch (error: any) {
    if (error.code === '23505') {
      console.error(`Error: Admin with email "${email}" already exists`)
    } else {
      console.error('Error creating admin:', error.message)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
