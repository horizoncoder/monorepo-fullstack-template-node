<script setup lang="ts">
import { ref } from 'vue'

const { t, locale, locales } = useI18n()
const { currentAdmin, logout, hasPermission } = useAdminAuth()
const showCustomizer = ref(false)
const showUserMenu = ref(false)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter((l) => l.code !== locale.value),
)

const sidebarLinks = computed(() => {
  const links = [
    { to: '/', label: t('common.nav.dashboard'), icon: 'dashboard', show: true },
    { to: '/users', label: t('common.nav.users'), icon: 'users', show: hasPermission('users.read') },
    { to: '/admins', label: t('common.nav.admins'), icon: 'admins', show: hasPermission('admins.read') },
    { to: '/roles', label: t('common.nav.roles'), icon: 'roles', show: hasPermission('roles.read') },
  ]
  return links.filter(l => l.show)
})

async function handleLogout() {
  await logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <Sonner />
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 dark:bg-gray-950 border-r border-gray-800 flex flex-col">
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">A</div>
          <span class="text-lg font-semibold text-white">{{ t('common.nav.adminPanel') }}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          active-class="!bg-gray-800 !text-white"
        >
          <svg v-if="link.icon === 'dashboard'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          <svg v-else-if="link.icon === 'users'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          <svg v-else-if="link.icon === 'admins'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          <svg v-else-if="link.icon === 'roles'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="p-4 border-t border-gray-800 space-y-3">
        <div class="flex gap-1">
          <Button v-for="loc in availableLocales" :key="loc.code" variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white" @click="locale = loc.code">{{ loc.name }}</Button>
          <Button variant="ghost" size="sm" class="text-xs text-gray-400 hover:text-white" @click="showCustomizer = !showCustomizer">{{ t('common.theme') }}</Button>
        </div>
        <div v-if="showCustomizer" class="rounded-lg border border-gray-700 bg-gray-800 p-3"><ThemeCustomizer /></div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="pl-64">
      <!-- Top bar -->
      <header class="sticky top-0 z-40 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div class="h-full flex items-center justify-end px-6 gap-4">
          <div v-if="currentAdmin" class="relative">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="showUserMenu = !showUserMenu"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-medium">
                {{ currentAdmin.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ currentAdmin.name }}</span>
              <Badge v-if="currentAdmin.isSuperuser" variant="secondary" class="text-xs">Super</Badge>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg py-1"
            >
              <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentAdmin.name }}</p>
                <p class="text-xs text-gray-500">{{ currentAdmin.email }}</p>
              </div>
              <button class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800" @click="handleLogout">
                {{ t('common.logout') }}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-6"><slot /></main>
    </div>
  </div>
</template>
