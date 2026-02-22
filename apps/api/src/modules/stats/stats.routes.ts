import { Hono } from 'hono'
import { usersRepository } from '../users/users.repository'
import { adminsRepository } from '../admins/admins.repository'
import { rolesRepository } from '../roles/roles.repository'

export const adminStatsRoutes = new Hono()
  .get('/', async (c) => {
    const [usersCount, adminsCount, rolesCount] = await Promise.all([
      usersRepository.count(),
      adminsRepository.count(),
      rolesRepository.count(),
    ])
    return c.json({ data: { usersCount, adminsCount, rolesCount } })
  })
