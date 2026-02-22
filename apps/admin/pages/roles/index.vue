<script setup lang="ts">
import { h, ref } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'

definePageMeta({ middleware: ['auth'] })

interface Role {
  id: string
  name: string
  description: string | null
  permissions: string[]
  createdAt: string
  updatedAt: string
}

const { t } = useI18n()
useHead({ title: t('roles.title') })
const { data: roles, isPending } = useAdminRoles()
const { data: allPermissions } = useAdminPermissions()
const { mutate: createRole } = useCreateRole()
const { mutate: updateRole } = useUpdateRole()
const { mutate: deleteRole } = useDeleteRole()
const { hasPermission } = useAdminAuth()

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const editingRole = ref<Role | null>(null)
const formName = ref('')
const formDescription = ref('')
const formPermissions = ref<string[]>([])

// Group permissions by group name
const permissionsByGroup = computed(() => {
  if (!allPermissions.value) return {}
  const grouped: Record<string, Array<{ key: string; name: string; description: string | null }>> = {}
  for (const perm of allPermissions.value) {
    if (!grouped[perm.group]) grouped[perm.group] = []
    grouped[perm.group].push(perm)
  }
  return grouped
})

function openCreate() {
  formName.value = ''
  formDescription.value = ''
  formPermissions.value = []
  showCreateDialog.value = true
}

function openEdit(role: Role) {
  editingRole.value = role
  formName.value = role.name
  formDescription.value = role.description || ''
  formPermissions.value = [...role.permissions]
  showEditDialog.value = true
}

function handleCreate() {
  createRole({
    name: formName.value,
    description: formDescription.value || undefined,
    permissions: formPermissions.value,
  })
  showCreateDialog.value = false
}

function handleUpdate() {
  if (!editingRole.value) return
  updateRole({
    id: editingRole.value.id,
    name: formName.value,
    description: formDescription.value || undefined,
    permissions: formPermissions.value,
  })
  showEditDialog.value = false
}

function togglePermission(key: string) {
  const idx = formPermissions.value.indexOf(key)
  if (idx >= 0) formPermissions.value.splice(idx, 1)
  else formPermissions.value.push(key)
}

const columns: ColumnDef<Role>[] = [
  { accessorKey: 'name', header: () => t('roles.name') },
  { accessorKey: 'description', header: () => t('roles.description'), cell: ({ row }) => row.original.description || '—' },
  {
    accessorKey: 'permissions',
    header: () => t('roles.permissions'),
    cell: ({ row }) => row.original.permissions.length > 0
      ? h('div', { class: 'flex flex-wrap gap-1' }, row.original.permissions.map(p =>
          h(Badge, { variant: 'secondary', class: 'text-xs' }, () => p),
        ))
      : '—',
  },
  { accessorKey: 'createdAt', header: () => t('roles.created'), cell: ({ row }) => new Date(row.getValue<string>('createdAt')).toLocaleDateString() },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      hasPermission('roles.write')
        ? h(Button, { variant: 'outline', size: 'sm', onClick: () => openEdit(row.original) }, () => t('common.edit'))
        : null,
      hasPermission('roles.delete')
        ? h(Button, { variant: 'destructive', size: 'sm', onClick: () => deleteRole(row.original.id) }, () => t('common.delete'))
        : null,
    ]),
  },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ t('roles.title') }}</h1>
      <Button v-if="hasPermission('roles.write')" @click="openCreate">{{ t('roles.create') }}</Button>
    </div>

    <Card class="border-gray-200 dark:border-gray-800">
      <CardContent class="p-0">
        <div v-if="isPending" class="p-6 text-muted-foreground">{{ t('common.loading') }}</div>
        <DataTable v-else :columns="columns" :data="roles ?? []" />
      </CardContent>
    </Card>

    <!-- Create Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ t('roles.create') }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('roles.name') }}</label>
            <Input v-model="formName" :placeholder="t('roles.namePlaceholder')" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('roles.description') }}</label>
            <Input v-model="formDescription" :placeholder="t('roles.descriptionPlaceholder')" />
          </div>
          <div class="space-y-3">
            <label class="text-sm font-medium">{{ t('roles.permissions') }}</label>
            <div v-for="(perms, group) in permissionsByGroup" :key="group" class="space-y-2">
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ group }}</p>
              <div class="flex flex-wrap gap-2">
                <label v-for="perm in perms" :key="perm.key" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="formPermissions.includes(perm.key)"
                    class="rounded border-gray-300"
                    @change="togglePermission(perm.key)"
                  />
                  {{ perm.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false">{{ t('common.cancel') }}</Button>
          <Button @click="handleCreate" :disabled="!formName">{{ t('common.save') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ t('roles.edit') }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('roles.name') }}</label>
            <Input v-model="formName" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">{{ t('roles.description') }}</label>
            <Input v-model="formDescription" />
          </div>
          <div class="space-y-3">
            <label class="text-sm font-medium">{{ t('roles.permissions') }}</label>
            <div v-for="(perms, group) in permissionsByGroup" :key="group" class="space-y-2">
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ group }}</p>
              <div class="flex flex-wrap gap-2">
                <label v-for="perm in perms" :key="perm.key" class="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="formPermissions.includes(perm.key)"
                    class="rounded border-gray-300"
                    @change="togglePermission(perm.key)"
                  />
                  {{ perm.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showEditDialog = false">{{ t('common.cancel') }}</Button>
          <Button @click="handleUpdate" :disabled="!formName">{{ t('common.save') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
