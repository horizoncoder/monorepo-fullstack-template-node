<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const id = route.params.id as string
const { data: product, isPending, error } = useProduct(id)
useHead({ title: () => product.value?.name ?? t('products.title') })
</script>

<template>
  <div class="space-y-6">
    <Button variant="ghost"><NuxtLink to="/products">&larr; {{ t('products.backToProducts') }}</NuxtLink></Button>
    <div v-if="isPending" class="text-muted-foreground">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="text-destructive">{{ t('common.error') }}: {{ error.message }}</div>
    <Card v-else-if="product" class="max-w-2xl">
      <CardHeader><CardTitle>{{ product.name }}</CardTitle></CardHeader>
      <CardContent class="space-y-4">
        <p class="text-muted-foreground">{{ product.description }}</p>
        <div class="flex items-center gap-4">
          <span class="text-2xl font-bold">${{ product.price }}</span>
          <Badge :variant="product.stock > 0 ? 'default' : 'destructive'">
            {{ product.stock > 0 ? t('products.inStock', { count: product.stock }) : t('products.outOfStock') }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
