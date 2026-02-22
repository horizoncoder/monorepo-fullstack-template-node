import { Hono } from 'hono'
import { prisma } from '../../db'

export const adminPermissionsRoutes = new Hono()
  .get('/', async (c) => {
    const allPermissions = await prisma.permission.findMany()
    return c.json({ data: allPermissions })
  })
