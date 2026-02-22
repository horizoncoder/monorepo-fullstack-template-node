import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export function useAdminUsers() {
  const client = useAdminFetch()
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      const res = await client.get<{ data: User[] }>('/api/admin/users')
      return res.data
    },
  })
}

export function useCreateUser() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; name: string; password: string }) => {
      const res = await client.post<{ data: User }>('/api/admin/users', data)
      return res.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) },
  })
}

export function useDeleteUser() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.del(`/api/admin/users/${id}`)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) },
  })
}
