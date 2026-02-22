import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createProductSchema, updateProductSchema } from '@repo/shared'
import { productsController } from './products.controller'

const adminProductRoutes = new Hono()
  .get('/', (c) => productsController.getAll(c))
  .get('/:id', (c) => productsController.getById(c))
  .post('/', zValidator('json', createProductSchema), (c) => productsController.create(c))
  .patch('/:id', zValidator('json', updateProductSchema), (c) => productsController.update(c))
  .delete('/:id', (c) => productsController.delete(c))

const clientProductRoutes = new Hono()
  .get('/', (c) => productsController.getAll(c))
  .get('/:id', (c) => productsController.getById(c))

export { adminProductRoutes, clientProductRoutes }
