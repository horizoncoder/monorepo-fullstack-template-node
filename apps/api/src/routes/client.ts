import { Hono } from 'hono'
import { clientUserRoutes } from '../modules/users/users.routes'
import { clientProductRoutes } from '../modules/products/products.routes'

const clientRoutes = new Hono()

const routes = clientRoutes
  .route('/users', clientUserRoutes)
  .route('/products', clientProductRoutes)

export { routes as clientRoutes }
