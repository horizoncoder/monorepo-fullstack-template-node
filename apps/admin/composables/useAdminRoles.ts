import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  createdAt: string
  updatedAt: string
}

interface PermissionItem {
  id: string
  key: string
  name: string
  description: string | null
  group: string
}

export function useAdminRoles() {
  const client = useAdminFetch()
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async (): Promise<Role[]> => {
      const res = await client.get<{ data: Role[] }>('/api/admin/roles')
      return res.data
    },
  })
}

export function useAdminPermissions() {
  const client = useAdminFetch()
  return useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async (): Promise<PermissionItem[]> => {
      const res = await client.get<{ data: PermissionItem[] }>('/api/admin/permissions')
      return res.data
    },
  })
}

export function useCreateRole() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; permissions?: string[] }) => {
      const res = await client.post<{ data: Role }>('/api/admin/roles', data)
      return res.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }) },
  })
}

export function useUpdateRole() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; description?: string; permissions?: string[] }) => {
      const res = await client.patch<{ data: Role }>(`/api/admin/roles/${id}`, data)
      return res.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }) },
  })
}

export function useDeleteRole() {
  const client = useAdminFetch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.del(`/api/admin/roles/${id}`)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] }) },
  })
}
