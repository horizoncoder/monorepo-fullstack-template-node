import type { Context } from 'hono'
import { usersService } from './users.service'

export const usersController = {
  getAll(c: Context) {
    const users = usersService.getAll()
    return c.json({ data: users })
  },
  getById(c: Context) {
    const id = c.req.param('id')
    const user = usersService.getById(id)
    return c.json({ data: user })
  },
  create(c: Context) {
    const data = c.req.valid('json' as never)
    const user = usersService.create(data)
    return c.json({ data: user }, 201)
  },
  update(c: Context) {
    const id = c.req.param('id')
    const data = c.req.valid('json' as never)
    const user = usersService.update(id, data)
    return c.json({ data: user })
  },
  delete(c: Context) {
    const id = c.req.param('id')
    usersService.delete(id)
    return c.json({ message: 'User deleted' })
  },
}
