import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function requirePermission(permission: string): MiddlewareHandler {
  return async (c, next) => {
    const admin = c.get('admin')
    if (!admin) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    // Superusers bypass all permission checks
    if (admin.isSuperuser) {
      await next()
      return
    }

    if (!admin.permissions.includes(permission)) {
      throw new HTTPException(403, { message: `Missing permission: ${permission}` })
    }

    await next()
  }
}
