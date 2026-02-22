import type { Context } from 'hono'
import { productsService } from './products.service'

export const productsController = {
  getAll(c: Context) {
    const products = productsService.getAll()
    return c.json({ data: products })
  },
  getById(c: Context) {
    const id = c.req.param('id')
    const product = productsService.getById(id)
    return c.json({ data: product })
  },
  create(c: Context) {
    const data = c.req.valid('json' as never)
    const product = productsService.create(data)
    return c.json({ data: product }, 201)
  },
  update(c: Context) {
    const id = c.req.param('id')
    const data = c.req.valid('json' as never)
    const product = productsService.update(id, data)
    return c.json({ data: product })
  },
  delete(c: Context) {
    const id = c.req.param('id')
    productsService.delete(id)
    return c.json({ message: 'Product deleted' })
  },
}
