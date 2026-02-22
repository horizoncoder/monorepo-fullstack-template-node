import { Hono } from 'hono'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { adminUserRoutes } from '../modules/users/users.routes'
import { adminProductRoutes } from '../modules/products/products.routes'

const adminRoutes = new Hono()

adminRoutes.use('*', authMiddleware())
adminRoutes.use('*', adminMiddleware())

const routes = adminRoutes
  .route('/users', adminUserRoutes)
  .route('/products', adminProductRoutes)

export { routes as adminRoutes }
