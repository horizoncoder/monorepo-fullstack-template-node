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
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xl font-bold mb-4 shadow-lg shadow-emerald-500/25">S</div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('auth.createAccount') }}</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('auth.registerSubtitle') }}</p>
    </div>

    <!-- Register Card -->
    <Card class="shadow-xl shadow-gray-200/50 dark:shadow-none border-gray-200 dark:border-gray-800">
      <CardContent class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('auth.name') }}</label>
            <Input
              v-model="name"
              type="text"
              :placeholder="t('auth.namePlaceholder')"
              class="h-11"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('auth.email') }}</label>
            <Input
              v-model="email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              class="h-11"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('auth.password') }}</label>
            <Input
              v-model="password"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="h-11"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <Button type="submit" class="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25" :disabled="isSubmitting">
            {{ isSubmitting ? t('common.loading') : t('auth.signUp') }}
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {{ t('auth.alreadyHaveAccount') }}
          <NuxtLink to="/login" class="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">{{ t('auth.signIn') }}</NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
