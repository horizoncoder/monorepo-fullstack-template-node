import { hc } from 'hono/client'
import type { AppType } from '@repo/api/src/app'

export function useApiClient() {
  const config = useRuntimeConfig()
  return hc<AppType>(config.public.apiBaseUrl)
}
