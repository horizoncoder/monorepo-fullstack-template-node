import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { updateProfileSchema, changePasswordSchema } from '@repo/shared'
import { profileService } from './profile.service'

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
  .patch('/', zValidator('json', updateProfileSchema), async (c) => {
    const user = c.get('user')
    const data = c.req.valid('json')
    const updated = await profileService.updateProfile(user.id, data)
    return c.json({ data: updated })
  })
  .post('/password', zValidator('json', changePasswordSchema), async (c) => {
    const user = c.get('user')
    const { currentPassword, newPassword } = c.req.valid('json')
    await profileService.changePassword(user.id, currentPassword, newPassword)
    return c.json({ message: 'Password updated successfully' })
  })
