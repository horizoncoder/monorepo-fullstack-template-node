<script setup lang="ts">
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Product } from '@repo/shared'

const { t } = useI18n()
useHead({ title: t('products.title') })
const { data: products, isPending } = useAdminProducts()
const { mutate: deleteProduct } = useDeleteProduct()

const columns: ColumnDef<Product>[] = [
  { accessorKey: 'name', header: () => t('products.name') },
  { accessorKey: 'description', header: () => t('products.description') },
  { accessorKey: 'price', header: () => t('products.price'), cell: ({ row }) => `$${row.getValue<number>('price').toFixed(2)}` },
  { accessorKey: 'stock', header: () => t('products.stock'), cell: ({ row }) => h(Badge, { variant: row.getValue<number>('stock') > 0 ? 'default' : 'destructive' }, () => String(row.getValue('stock'))) },
  { accessorKey: 'createdAt', header: () => t('products.created'), cell: ({ row }) => new Date(row.getValue<string>('createdAt')).toLocaleDateString() },
  { id: 'actions', header: '', cell: ({ row }) => h(Button, { variant: 'destructive', size: 'sm', onClick: () => deleteProduct(row.original.id) }, () => t('common.delete')) },
]
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('products.title') }}</h1>
    <div v-if="isPending" class="text-muted-foreground">{{ t('common.loading') }}</div>
    <DataTable v-else :columns="columns" :data="products ?? []" />
  </div>
</template>
