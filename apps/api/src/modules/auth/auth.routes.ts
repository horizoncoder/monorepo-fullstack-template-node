import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema } from '@repo/shared'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { authService } from './auth.service'

const cookieDomain = process.env.COOKIE_DOMAIN || '.develop'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
  domain: cookieDomain,
}

const DELETE_OPTS = { path: '/', domain: cookieDomain }

export const adminAuthRoutes = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json')
    const { session, admin } = await authService.adminLogin(email, password)
    setCookie(c, 'admin_session', session.id, COOKIE_OPTIONS)
    return c.json({
      data: {
        id: admin.id, email: admin.email, name: admin.name,
        roles: admin.roles, permissions: admin.permissions, isSuperuser: admin.isSuperuser,
      },
    })
  })
  .post('/logout', async (c) => {
    const sessionId = getCookie(c, 'admin_session')
    if (sessionId) {
      await authService.logout(sessionId)
      deleteCookie(c, 'admin_session', DELETE_OPTS)
    }
    return c.json({ message: 'Logged out' })
  })

export const adminAuthProtectedRoutes = new Hono()
  .get('/me', (c) => {
    const admin = c.get('admin')
    return c.json({
      data: {
        id: admin.id, email: admin.email, name: admin.name,
        roles: admin.roles, permissions: admin.permissions, isSuperuser: admin.isSuperuser,
      },
    })
  })

export const clientAuthRoutes = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json')
    const { session, user } = await authService.userLogin(email, password)
    setCookie(c, 'user_session', session.id, COOKIE_OPTIONS)
    return c.json({ data: { id: user.id, email: user.email, name: user.name } })
  })
  .post('/logout', async (c) => {
    const sessionId = getCookie(c, 'user_session')
    if (sessionId) {
      await authService.logout(sessionId)
      deleteCookie(c, 'user_session', DELETE_OPTS)
    }
    return c.json({ message: 'Logged out' })
  })

export const clientAuthProtectedRoutes = new Hono()
  .get('/me', (c) => {
    const user = c.get('user')
    return c.json({ data: { id: user.id, email: user.email, name: user.name } })
  })
