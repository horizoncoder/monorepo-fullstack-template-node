import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { User, CreateUser, ApiResponse } from '@repo/shared'

export function useAdminUsers() {
  const client = useAdminClient()
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async (): Promise<User[]> => {
      const res = await client.api.admin.users.$get()
      const json = (await res.json()) as ApiResponse<User[]>
      return json.data
    },
  })
}

export function useCreateUser() {
  const client = useAdminClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateUser) => {
      const res = await client.api.admin.users.$post({ json: data })
      const json = (await res.json()) as ApiResponse<User>
      return json.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) },
  })
}

export function useDeleteUser() {
  const client = useAdminClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.api.admin.users[':id'].$delete({ param: { id } })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }) },
  })
}
