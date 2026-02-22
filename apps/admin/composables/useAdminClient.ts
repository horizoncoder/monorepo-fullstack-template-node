import { hc } from 'hono/client'
import type { AppType } from '@repo/api/src/app'

export function useAdminClient() {
  const config = useRuntimeConfig()
  return hc<AppType>(config.public.apiBaseUrl, {
    headers: { Authorization: 'Bearer admin-token' },
  })
}
