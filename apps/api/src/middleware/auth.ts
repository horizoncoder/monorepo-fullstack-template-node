import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function authMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    // TODO: Replace with real token verification (JWT, session, etc.)
    const isAdmin = token === 'admin-token'
    c.set('userId', isAdmin ? 'mock-admin-id' : 'mock-user-id')
    c.set('userRole', isAdmin ? 'admin' : 'user')

    await next()
  }
}

export function adminMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const role = c.get('userRole')

    if (role !== 'admin') {
      throw new HTTPException(403, { message: 'Forbidden: admin access required' })
    }

    await next()
  }
}
