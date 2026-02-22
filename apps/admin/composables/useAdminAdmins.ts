import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

interface AdminRole {
  id: string
  name: string
}

interface Admin {
  id: string
  email: string
  name: string
  roles: AdminRole[]
  permissions: string[]
  isSuperuser: boolean
  createdAt: string
  updatedAt: string
}

export function useAdminAdmins() {
  const client = useAdminFetch()
  return useQuery({
    queryKey: ['admin', 'admins'],
    queryFn: async (): Promise<Admin[]> => {
      const res = await client.get<{ data: Admin[] }>('/api/admin/admins')
      return res.data
    },
  })
}

export function useCreateAdmin() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; name: string; password: string; roleIds?: string[]; isSuperuser?: boolean }) => {
      const res = await client.post<{ data: Admin }>('/api/admin/admins', data)
      return res.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] }) },
  })
}

export function useDeleteAdmin() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.del(`/api/admin/admins/${id}`)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'admins'] }) },
  })
}
