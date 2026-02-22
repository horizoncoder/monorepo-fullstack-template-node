import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { adminRoutes } from './routes/admin'
import { clientRoutes } from './routes/client'
import { errorHandler } from './middleware/error-handler'

const app = new Hono()

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['https://develop', 'https://api.develop']

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: corsOrigins,
  credentials: true,
}))
app.use('*', errorHandler())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Mount routes
const routes = app
  .route('/api/admin', adminRoutes)
  .route('/api/client', clientRoutes)

export { app }
export type AppType = typeof routes
