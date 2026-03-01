<script setup lang="ts">
import { ref } from 'vue'

const { t, locale, locales, setLocale } = useI18n()
const authStore = useAuthStore()
const { collapsed, toggle: toggleSidebar } = useSidebar()
const showCustomizer = ref(false)
const showUserMenu = ref(false)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter((l) => l.code !== locale.value),
)

const sidebarLinks = computed(() => [
  { to: '/', label: t('common.nav.dashboard'), icon: 'dashboard' },
  { to: '/profile', label: t('common.nav.profile'), icon: 'profile' },
])

async function handleLogout() {
  await authStore.logout()
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <Sonner />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300"
      :class="collapsed ? 'w-16' : 'w-64'"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center border-b border-border" :class="collapsed ? 'justify-center px-2' : 'px-6'">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">S</div>
          <span v-if="!collapsed" class="text-lg font-semibold text-foreground whitespace-nowrap">{{ t('common.appName') }}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="link in sidebarLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          :class="collapsed ? 'justify-center px-0' : 'px-3'"
          :title="collapsed ? link.label : undefined"
          active-class="!bg-primary/10 !text-primary"
        >
          <svg v-if="link.icon === 'dashboard'" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          <svg v-if="link.icon === 'profile'" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
          <span v-if="!collapsed">{{ link.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Bottom section -->
      <div class="border-t border-border" :class="collapsed ? 'p-2' : 'p-4 space-y-3'">
        <template v-if="!collapsed">
          <div class="flex gap-1">
            <Button v-for="loc in availableLocales" :key="loc.code" variant="ghost" size="sm" class="text-xs" @click="setLocale(loc.code)">{{ loc.name }}</Button>
            <Button variant="ghost" size="sm" class="text-xs" @click="showCustomizer = !showCustomizer">{{ t('common.theme') }}</Button>
          </div>
          <div v-if="showCustomizer" class="rounded-lg border bg-card p-3"><ThemeCustomizer /></div>
        </template>

        <!-- Toggle button -->
        <button
          class="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          :title="collapsed ? t('common.expandSidebar') : t('common.collapseSidebar')"
          @click="toggleSidebar"
        >
          <svg class="w-5 h-5 transition-transform duration-300" :class="{ 'rotate-180': collapsed }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="transition-all duration-300" :class="collapsed ? 'pl-16' : 'pl-64'">
      <!-- Top bar -->
      <header class="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-border">
        <div class="h-full flex items-center justify-end px-6 gap-4">
          <div v-if="authStore.user" class="relative">
            <button
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
              @click="showUserMenu = !showUserMenu"
            >
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {{ authStore.user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="text-sm font-medium text-foreground">{{ authStore.user.name }}</span>
            </button>
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-popover rounded-lg border border-border shadow-lg py-1"
            >
              <div class="px-4 py-2 border-b border-border">
                <p class="text-sm font-medium text-foreground">{{ authStore.user.name }}</p>
                <p class="text-xs text-muted-foreground">{{ authStore.user.email }}</p>
              </div>
              <NuxtLink to="/profile" class="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent" @click="showUserMenu = false">
                {{ t('common.nav.profile') }}
              </NuxtLink>
              <button class="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent" @click="handleLogout">
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
