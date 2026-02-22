import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'
import { userAuthMiddleware } from '../middleware/auth'
import { clientAuthRoutes, clientAuthProtectedRoutes } from '../modules/auth/auth.routes'
import { clientProfileRoutes } from '../modules/profile/profile.routes'
import { clientOpenApiSpec } from '../docs/client-spec'

const clientRoutes = new Hono()

// Swagger docs (public)
clientRoutes.get('/docs', swaggerUI({ url: '/api/client/openapi.json' }))
clientRoutes.get('/openapi.json', (c) => c.json(clientOpenApiSpec))

// Public auth routes (login/logout)
clientRoutes.route('/auth', clientAuthRoutes)

// Protected routes — require user session
const protectedRoutes = new Hono()
protectedRoutes.use('*', userAuthMiddleware())
protectedRoutes.route('/auth', clientAuthProtectedRoutes)
protectedRoutes.route('/profile', clientProfileRoutes)

clientRoutes.route('/', protectedRoutes)

export { clientRoutes }
