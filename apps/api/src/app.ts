import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { adminRoutes } from './routes/admin'
import { clientRoutes } from './routes/client'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', cors())
app.use('*', errorHandler())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Mount routes
const routes = app
  .route('/api/admin', adminRoutes)
  .route('/api/client', clientRoutes)

export { app }
export type AppType = typeof routes
