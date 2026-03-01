<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { registerSchema } from '@repo/shared'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
useHead({ title: t('auth.register') })

const validationSchema = toTypedSchema(registerSchema)
const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema })
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register(values.name, values.email, values.password)
    toast.success(t('auth.registerSuccess'))
    navigateTo('/')
  } catch (e: any) {
    toast.error(e?.data?.message || t('auth.registerError'))
  }
})
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo & Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4 shadow-lg shadow-primary/25">S</div>
      <h1 class="text-2xl font-bold text-foreground">{{ t('auth.createAccount') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('auth.registerSubtitle') }}</p>
    </div>

    <!-- Register Card -->
    <Card class="shadow-xl border-border">
      <CardContent class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('auth.name') }}</label>
            <Input
              v-model="name"
              type="text"
              :placeholder="t('auth.namePlaceholder')"
              class="h-11"
              :class="{ 'border-destructive': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-destructive">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('auth.email') }}</label>
            <Input
              v-model="email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              class="h-11"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('auth.password') }}</label>
            <Input
              v-model="password"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="h-11"
              :class="{ 'border-destructive': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
          </div>

          <Button type="submit" class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" :disabled="isSubmitting">
            {{ isSubmitting ? t('common.loading') : t('auth.signUp') }}
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          {{ t('auth.alreadyHaveAccount') }}
          <NuxtLink to="/login" class="font-medium text-primary hover:text-primary/80">{{ t('auth.signIn') }}</NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
