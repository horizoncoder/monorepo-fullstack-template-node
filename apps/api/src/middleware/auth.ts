import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { authService } from '../modules/auth/auth.service'

export function adminAuthMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const sessionId = getCookie(c, 'admin_session')
    if (!sessionId) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const result = await authService.validateAdminSession(sessionId)
    if (!result) {
      throw new HTTPException(401, { message: 'Session expired or invalid' })
    }

    c.set('admin', result.admin)
    c.set('session', result.session)
    await next()
  }
}

export function userAuthMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const sessionId = getCookie(c, 'user_session')
    if (!sessionId) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const result = await authService.validateUserSession(sessionId)
    if (!result) {
      throw new HTTPException(401, { message: 'Session expired or invalid' })
    }

    c.set('user', result.user)
    c.set('session', result.session)
    await next()
  }
}
