import { useQuery } from '@tanstack/vue-query'
import type { Product, ApiResponse } from '@repo/shared'

export function useProducts() {
  const client = useApiClient()
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const res = await client.api.client.products.$get()
      const json = (await res.json()) as ApiResponse<Product[]>
      return json.data
    },
  })
}

export function useProduct(id: string) {
  const client = useApiClient()
  return useQuery({
    queryKey: ['products', id],
    queryFn: async (): Promise<Product> => {
      const res = await client.api.client.products[':id'].$get({ param: { id } })
      const json = (await res.json()) as ApiResponse<Product>
      return json.data
    },
    enabled: !!id,
  })
}
