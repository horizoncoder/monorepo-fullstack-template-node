<script setup lang="ts">
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '@repo/shared'

const { t } = useI18n()
useHead({ title: t('users.title') })
const { data: users, isPending } = useAdminUsers()
const { mutate: deleteUser } = useDeleteUser()

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: () => t('users.name') },
  { accessorKey: 'email', header: () => t('users.email') },
  { accessorKey: 'role', header: () => t('users.role'), cell: ({ row }) => h(Badge, { variant: row.getValue<string>('role') === 'admin' ? 'default' : 'secondary' }, () => row.getValue('role')) },
  { accessorKey: 'createdAt', header: () => t('users.created'), cell: ({ row }) => new Date(row.getValue<string>('createdAt')).toLocaleDateString() },
  { id: 'actions', header: '', cell: ({ row }) => h(Button, { variant: 'destructive', size: 'sm', onClick: () => deleteUser(row.original.id) }, () => t('common.delete')) },
]
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('users.title') }}</h1>
    <div v-if="isPending" class="text-muted-foreground">{{ t('common.loading') }}</div>
    <DataTable v-else :columns="columns" :data="users ?? []" />
  </div>
</template>
