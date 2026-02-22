<script setup lang="ts">
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'

definePageMeta({ middleware: ['auth'] })

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

const { t } = useI18n()
useHead({ title: t('admins.title') })
const { data: admins, isPending } = useAdminAdmins()
const { mutate: deleteAdmin } = useDeleteAdmin()
const { hasPermission } = useAdminAuth()

const columns: ColumnDef<Admin>[] = [
  { accessorKey: 'name', header: () => t('admins.name') },
  { accessorKey: 'email', header: () => t('admins.email') },
  {
    accessorKey: 'isSuperuser',
    header: () => t('admins.role'),
    cell: ({ row }) => h(Badge, { variant: row.original.isSuperuser ? 'default' : 'secondary' }, () => row.original.isSuperuser ? 'Superuser' : 'Admin'),
  },
  {
    id: 'roles',
    header: () => t('admins.roles'),
    cell: ({ row }) => row.original.isSuperuser
      ? h(Badge, { variant: 'default' }, () => 'All Access')
      : row.original.roles.length > 0
        ? h('div', { class: 'flex flex-wrap gap-1' }, row.original.roles.map(r =>
            h(Badge, { variant: 'outline', class: 'text-xs' }, () => r.name),
          ))
        : '—',
  },
  {
    id: 'permissions',
    header: () => t('admins.permissions'),
    cell: ({ row }) => row.original.isSuperuser
      ? 'All'
      : row.original.permissions.length > 0
        ? `${row.original.permissions.length} permissions`
        : 'None',
  },
  { accessorKey: 'createdAt', header: () => t('admins.created'), cell: ({ row }) => new Date(row.getValue<string>('createdAt')).toLocaleDateString() },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => hasPermission('admins.delete')
      ? h(Button, { variant: 'destructive', size: 'sm', onClick: () => deleteAdmin(row.original.id) }, () => t('common.delete'))
      : null,
  },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ t('admins.title') }}</h1>
    </div>
    <Card class="border-gray-200 dark:border-gray-800">
      <CardContent class="p-0">
        <div v-if="isPending" class="p-6 text-muted-foreground">{{ t('common.loading') }}</div>
        <DataTable v-else :columns="columns" :data="admins ?? []" />
      </CardContent>
    </Card>
  </div>
</template>
