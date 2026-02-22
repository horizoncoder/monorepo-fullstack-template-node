<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const { currentUser } = useAuth()

useHead({ title: t('dashboard.title') })
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 p-8 text-white">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold">{{ t('dashboard.welcome', { name: currentUser?.name || '' }) }}</h1>
        <p class="mt-2 text-emerald-100 text-lg">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
      <div class="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-white/5"></div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card class="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.profile') }}</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ currentUser?.name }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.email') }}</p>
              <p class="mt-1 text-lg font-semibold text-gray-900 dark:text-white truncate">{{ currentUser?.email }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('dashboard.status') }}</p>
              <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                <Badge class="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">{{ t('dashboard.active') }}</Badge>
              </p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity Section -->
    <Card class="border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle class="text-lg">{{ t('dashboard.recentActivity') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8 text-gray-400 dark:text-gray-600">
          <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{{ t('dashboard.noRecentActivity') }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
