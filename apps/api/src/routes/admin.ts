import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'
import { adminAuthMiddleware } from '../middleware/auth'
import { adminAuthRoutes, adminAuthProtectedRoutes } from '../modules/auth/auth.routes'
import { adminUserRoutes } from '../modules/users/users.routes'
import { adminAdminsRoutes } from '../modules/admins/admins.routes'
import { adminRolesRoutes } from '../modules/roles/roles.routes'
import { adminPermissionsRoutes } from '../modules/permissions/permissions.routes'
import { adminStatsRoutes } from '../modules/stats/stats.routes'
import { adminOpenApiSpec } from '../docs/admin-spec'

const adminRoutes = new Hono()

// Swagger docs (public)
adminRoutes.get('/docs', swaggerUI({ url: '/api/admin/openapi.json' }))
adminRoutes.get('/openapi.json', (c) => c.json(adminOpenApiSpec))

// Public auth routes (login/logout)
adminRoutes.route('/auth', adminAuthRoutes)

// Protected routes — require admin session
const protectedRoutes = new Hono()
protectedRoutes.use('*', adminAuthMiddleware())
protectedRoutes.route('/auth', adminAuthProtectedRoutes)
protectedRoutes.route('/users', adminUserRoutes)
protectedRoutes.route('/admins', adminAdminsRoutes)
protectedRoutes.route('/roles', adminRolesRoutes)
protectedRoutes.route('/permissions', adminPermissionsRoutes)
protectedRoutes.route('/stats', adminStatsRoutes)

adminRoutes.route('/', protectedRoutes)

export { adminRoutes }
