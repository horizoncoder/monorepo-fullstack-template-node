import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema } from '@repo/shared'
import { usersController } from './users.controller'

const adminUserRoutes = new Hono()
  .get('/', (c) => usersController.getAll(c))
  .get('/:id', (c) => usersController.getById(c))
  .post('/', zValidator('json', createUserSchema), (c) => usersController.create(c))
  .patch('/:id', zValidator('json', updateUserSchema), (c) => usersController.update(c))
  .delete('/:id', (c) => usersController.delete(c))

const clientUserRoutes = new Hono()
  .get('/:id', (c) => usersController.getById(c))

export { adminUserRoutes, clientUserRoutes }
