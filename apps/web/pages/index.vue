<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
const { currentUser } = useAuth()

useHead({ title: t('dashboard.title') })
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold">{{ t('dashboard.welcome', { name: currentUser?.name || '' }) }}</h1>
        <p class="mt-2 text-primary-foreground/70 text-lg">{{ t('dashboard.subtitle') }}</p>
      </div>
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10"></div>
      <div class="absolute -right-5 -bottom-10 h-32 w-32 rounded-full bg-primary-foreground/5"></div>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card class="group hover:shadow-lg transition-all duration-200 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.profile') }}</p>
              <p class="mt-1 text-2xl font-bold text-foreground">{{ currentUser?.name }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.email') }}</p>
              <p class="mt-1 text-lg font-semibold text-foreground truncate">{{ currentUser?.email }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.status') }}</p>
              <p class="mt-1 text-2xl font-bold text-foreground">
                <Badge class="bg-primary/10 text-primary">{{ t('dashboard.active') }}</Badge>
              </p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity Section -->
    <Card class="border-border">
      <CardHeader>
        <CardTitle class="text-lg">{{ t('dashboard.recentActivity') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8 text-muted-foreground">
          <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{{ t('dashboard.noRecentActivity') }}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
