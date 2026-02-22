<script setup lang="ts">
import { ref } from 'vue'
const { t, locale, locales } = useI18n()
const showCustomizer = ref(false)
const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter((l) => l.code !== locale.value),
)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="flex">
      <aside class="w-64 border-r min-h-screen p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ t('common.nav.adminPanel') }}</h2>
        </div>
        <div class="flex gap-1">
          <Button v-for="loc in availableLocales" :key="loc.code" variant="ghost" size="sm" @click="locale = loc.code">{{ loc.name }}</Button>
          <Button variant="ghost" size="sm" @click="showCustomizer = !showCustomizer">{{ t('common.theme') }}</Button>
        </div>
        <div v-if="showCustomizer" class="rounded-md border bg-card p-3"><ThemeCustomizer /></div>
        <nav class="space-y-1">
          <NuxtLink to="/" class="block rounded-md px-3 py-2 text-sm hover:bg-accent" active-class="bg-accent">{{ t('common.nav.dashboard') }}</NuxtLink>
          <NuxtLink to="/users" class="block rounded-md px-3 py-2 text-sm hover:bg-accent" active-class="bg-accent">{{ t('common.nav.users') }}</NuxtLink>
          <NuxtLink to="/products" class="block rounded-md px-3 py-2 text-sm hover:bg-accent" active-class="bg-accent">{{ t('common.nav.products') }}</NuxtLink>
        </nav>
      </aside>
      <main class="flex-1 p-8"><slot /></main>
    </div>
  </div>
</template>
