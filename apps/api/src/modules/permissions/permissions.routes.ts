import { Hono } from 'hono'
import { db } from '../../db'
import { permissions } from '../../db/schema/permissions'

export const adminPermissionsRoutes = new Hono()
  .get('/', async (c) => {
    const allPermissions = await db.select().from(permissions)
    return c.json({ data: allPermissions })
  })
