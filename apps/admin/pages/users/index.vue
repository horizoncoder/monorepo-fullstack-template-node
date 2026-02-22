<script setup lang="ts">
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'

definePageMeta({ middleware: ['auth'] })

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

const { t } = useI18n()
useHead({ title: t('users.title') })
const { data: users, isPending } = useAdminUsers()
const { mutate: deleteUser } = useDeleteUser()

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: () => t('users.name') },
  { accessorKey: 'email', header: () => t('users.email') },
  { accessorKey: 'createdAt', header: () => t('users.created'), cell: ({ row }) => new Date(row.getValue<string>('createdAt')).toLocaleDateString() },
  { id: 'actions', header: '', cell: ({ row }) => h(Button, { variant: 'destructive', size: 'sm', onClick: () => deleteUser(row.original.id) }, () => t('common.delete')) },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ t('users.title') }}</h1>
    </div>
    <Card class="border-gray-200 dark:border-gray-800">
      <CardContent class="p-0">
        <div v-if="isPending" class="p-6 text-muted-foreground">{{ t('common.loading') }}</div>
        <DataTable v-else :columns="columns" :data="users ?? []" />
      </CardContent>
    </Card>
  </div>
</template>
