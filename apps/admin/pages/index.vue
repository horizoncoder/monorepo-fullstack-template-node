<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { t } = useI18n()
useHead({ title: t('dashboard.title') })
const { data: stats } = useAdminStats()
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold">{{ t('dashboard.title') }}</h1>
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
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.usersCount') }}</p>
              <p class="mt-1 text-3xl font-bold text-foreground">{{ stats?.usersCount ?? '-' }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.adminsCount') }}</p>
              <p class="mt-1 text-3xl font-bold text-foreground">{{ stats?.adminsCount ?? '-' }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="group hover:shadow-lg transition-all duration-200 border-border">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{{ t('dashboard.rolesCount') }}</p>
              <p class="mt-1 text-3xl font-bold text-foreground">{{ stats?.rolesCount ?? '-' }}</p>
            </div>
            <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
