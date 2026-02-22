import { Hono } from 'hono'
import { usersService } from '../users/users.service'

export const clientProfileRoutes = new Hono()
  .get('/', (c) => {
    const user = c.get('user')
    return c.json({
      data: {
        id: user.id, email: user.email, name: user.name,
        createdAt: user.createdAt, updatedAt: user.updatedAt,
      },
    })
  })
  .patch('/', async (c) => {
    const user = c.get('user')
    const data = await c.req.json()
    const updated = await usersService.update(user.id, data)
    return c.json({ data: updated })
  })
