import { useQuery } from '@tanstack/vue-query'

interface Stats {
  usersCount: number
  adminsCount: number
  rolesCount: number
}

export function useAdminStats() {
  const client = useAdminFetch()
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async (): Promise<Stats> => {
      const res = await client.get<{ data: Stats }>('/api/admin/stats')
      return res.data
    },
  })
}
