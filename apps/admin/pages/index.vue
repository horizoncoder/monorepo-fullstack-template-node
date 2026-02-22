<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t('dashboard.title') })
const { data: users } = useAdminUsers()
const { data: products } = useAdminProducts()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('dashboard.title') }}</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>{{ t('dashboard.usersCount') }}</CardTitle></CardHeader>
        <CardContent><p class="text-3xl font-bold">{{ users?.length ?? '-' }}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{{ t('dashboard.productsCount') }}</CardTitle></CardHeader>
        <CardContent><p class="text-3xl font-bold">{{ products?.length ?? '-' }}</p></CardContent>
      </Card>
    </div>
  </div>
</template>
