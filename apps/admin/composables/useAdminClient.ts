export function useAdminFetch() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  return {
    async get<T>(path: string): Promise<T> {
      return $fetch<T>(`${baseUrl}${path}`, { credentials: 'include' })
    },
    async post<T>(path: string, body?: unknown): Promise<T> {
      return $fetch<T>(`${baseUrl}${path}`, { method: 'POST', body, credentials: 'include' })
    },
    async patch<T>(path: string, body?: unknown): Promise<T> {
      return $fetch<T>(`${baseUrl}${path}`, { method: 'PATCH', body, credentials: 'include' })
    },
    async del<T>(path: string): Promise<T> {
      return $fetch<T>(`${baseUrl}${path}`, { method: 'DELETE', credentials: 'include' })
    },
  }
}
