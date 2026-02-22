<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t('home.title') })
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-4xl font-bold tracking-tight">{{ t('home.title') }}</h1>
    <p class="text-lg text-muted-foreground">{{ t('home.subtitle') }}</p>
    <Button><NuxtLink to="/products">{{ t('home.viewProducts') }}</NuxtLink></Button>
  </div>
</template>
