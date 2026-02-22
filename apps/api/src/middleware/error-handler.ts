import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'

export function errorHandler(): MiddlewareHandler {
  return async (c, next) => {
    try {
      await next()
    } catch (err) {
      if (err instanceof HTTPException) {
        return c.json(
          { message: err.message, code: 'HTTP_ERROR', status: err.status },
          err.status,
        )
      }

      if (err instanceof ZodError) {
        return c.json(
          { message: 'Validation error', code: 'VALIDATION_ERROR', status: 400, errors: err.errors },
          400,
        )
      }

      console.error('Unhandled error:', err)
      return c.json(
        { message: 'Internal server error', code: 'INTERNAL_ERROR', status: 500 },
        500,
      )
    }
  }
}
