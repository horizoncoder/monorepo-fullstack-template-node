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
    <header class="border-b">
      <nav class="container mx-auto flex h-16 items-center justify-between px-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-lg font-semibold">{{ t('common.nav.store') }}</NuxtLink>
          <NuxtLink to="/products" class="text-sm text-muted-foreground hover:text-foreground">
            {{ t('common.nav.products') }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <Button v-for="loc in availableLocales" :key="loc.code" variant="ghost" size="sm" @click="locale = loc.code">
            {{ loc.name }}
          </Button>
          <Button variant="outline" size="sm" @click="showCustomizer = !showCustomizer">
            {{ t('common.theme') }}
          </Button>
        </div>
      </nav>
    </header>
    <div v-if="showCustomizer" class="border-b bg-card p-4">
      <div class="container mx-auto"><ThemeCustomizer /></div>
    </div>
    <main class="container mx-auto px-4 py-8"><slot /></main>
  </div>
</template>
