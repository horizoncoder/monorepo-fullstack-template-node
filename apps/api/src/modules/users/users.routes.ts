import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema } from '@repo/shared'
import { usersService } from './users.service'

export const adminUserRoutes = new Hono()
  .get('/', async (c) => {
    const users = await usersService.getAll()
    return c.json({ data: users })
  })
  .get('/:id', async (c) => {
    const user = await usersService.getById(c.req.param('id'))
    return c.json({ data: user })
  })
  .post('/', zValidator('json', createUserSchema), async (c) => {
    const user = await usersService.create(c.req.valid('json'))
    return c.json({ data: user }, 201)
  })
  .patch('/:id', zValidator('json', updateUserSchema), async (c) => {
    const user = await usersService.update(c.req.param('id'), c.req.valid('json'))
    return c.json({ data: user })
  })
  .delete('/:id', async (c) => {
    await usersService.delete(c.req.param('id'))
    return c.json({ message: 'User deleted' })
  })
