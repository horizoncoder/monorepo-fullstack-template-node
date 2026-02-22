<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@repo/shared'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { login } = useAdminAuth()
useHead({ title: t('auth.login') })

const validationSchema = toTypedSchema(loginSchema)
const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema })
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await login(values.email, values.password)
    toast.success(t('auth.loginSuccess'))
    navigateTo('/')
  } catch (e: any) {
    toast.error(e?.data?.message || t('auth.invalidCredentials'))
  }
})
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo & Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white text-xl font-bold mb-4 shadow-lg shadow-emerald-500/25">A</div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('auth.adminLogin') }}</h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('auth.adminLoginSubtitle') }}</p>
    </div>

    <!-- Login Card -->
    <Card class="shadow-xl shadow-gray-200/50 dark:shadow-none border-gray-200 dark:border-gray-800">
      <CardContent class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
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
            {{ isSubmitting ? t('common.loading') : t('auth.signIn') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
