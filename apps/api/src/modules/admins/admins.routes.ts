import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createAdminSchema, updateAdminSchema } from '@repo/shared'
import { adminsService } from './admins.service'
import { requirePermission } from '../../middleware/permissions'

export const adminAdminsRoutes = new Hono()
  .get('/', requirePermission('admins.read'), async (c) => {
    const admins = await adminsService.getAll()
    return c.json({ data: admins })
  })
  .get('/:id', requirePermission('admins.read'), async (c) => {
    const admin = await adminsService.getById(c.req.param('id'))
    return c.json({ data: admin })
  })
  .post('/', requirePermission('admins.write'), zValidator('json', createAdminSchema), async (c) => {
    const admin = await adminsService.create(c.req.valid('json'))
    return c.json({ data: admin }, 201)
  })
  .patch('/:id', requirePermission('admins.write'), zValidator('json', updateAdminSchema), async (c) => {
    const admin = await adminsService.update(c.req.param('id'), c.req.valid('json'))
    return c.json({ data: admin })
  })
  .delete('/:id', requirePermission('admins.delete'), async (c) => {
    await adminsService.delete(c.req.param('id'))
    return c.json({ message: 'Admin deleted' })
  })
