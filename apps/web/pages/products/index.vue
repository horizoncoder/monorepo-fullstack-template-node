<script setup lang="ts">
const { t } = useI18n()
useHead({ title: t('products.title') })
const { data: products, isPending, error } = useProducts()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold tracking-tight">{{ t('products.title') }}</h1>
    <div v-if="isPending" class="text-muted-foreground">{{ t('products.loading') }}</div>
    <div v-else-if="error" class="text-destructive">{{ t('common.error') }}: {{ error.message }}</div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card v-for="product in products" :key="product.id">
        <CardHeader><CardTitle>{{ product.name }}</CardTitle></CardHeader>
        <CardContent class="space-y-2">
          <p class="text-sm text-muted-foreground">{{ product.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">${{ product.price }}</span>
            <Badge :variant="product.stock > 0 ? 'default' : 'destructive'">
              {{ product.stock > 0 ? t('products.inStock', { count: product.stock }) : t('products.outOfStock') }}
            </Badge>
          </div>
          <Button variant="outline" class="w-full"><NuxtLink :to="`/products/${product.id}`">{{ t('products.viewDetails') }}</NuxtLink></Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
