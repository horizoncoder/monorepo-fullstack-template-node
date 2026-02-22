import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Product, CreateProduct, ApiResponse } from '@repo/shared'

export function useAdminProducts() {
  const client = useAdminClient()
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async (): Promise<Product[]> => {
      const res = await client.api.admin.products.$get()
      const json = (await res.json()) as ApiResponse<Product[]>
      return json.data
    },
  })
}

export function useCreateProduct() {
  const client = useAdminClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateProduct) => {
      const res = await client.api.admin.products.$post({ json: data })
      const json = (await res.json()) as ApiResponse<Product>
      return json.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }) },
  })
}

export function useDeleteProduct() {
  const client = useAdminClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.api.admin.products[':id'].$delete({ param: { id } })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }) },
  })
}
