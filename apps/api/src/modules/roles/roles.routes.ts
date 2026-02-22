import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createRoleSchema, updateRoleSchema } from '@repo/shared'
import { rolesService } from './roles.service'
import { requirePermission } from '../../middleware/permissions'

export const adminRolesRoutes = new Hono()
  .get('/', requirePermission('roles.read'), async (c) => {
    const roles = await rolesService.getAll()
    return c.json({ data: roles })
  })
  .get('/:id', requirePermission('roles.read'), async (c) => {
    const role = await rolesService.getById(c.req.param('id'))
    return c.json({ data: role })
  })
  .post('/', requirePermission('roles.write'), zValidator('json', createRoleSchema), async (c) => {
    const role = await rolesService.create(c.req.valid('json'))
    return c.json({ data: role }, 201)
  })
  .patch('/:id', requirePermission('roles.write'), zValidator('json', updateRoleSchema), async (c) => {
    const role = await rolesService.update(c.req.param('id'), c.req.valid('json'))
    return c.json({ data: role })
  })
  .delete('/:id', requirePermission('roles.delete'), async (c) => {
    await rolesService.delete(c.req.param('id'))
    return c.json({ message: 'Role deleted' })
  })
