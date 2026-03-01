<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl

useHead({ title: t('auth.resetPassword') })

const token = computed(() => route.query.token as string)

const schema = toTypedSchema(
  z.object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
)

const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema })
const { value: newPassword } = useField<string>('newPassword')
const { value: confirmPassword } = useField<string>('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch(`${baseUrl}/api/client/auth/reset-password`, {
      method: 'POST',
      body: { token: token.value, newPassword: values.newPassword },
    })
    toast.success(t('auth.resetSuccess'))
    navigateTo('/login')
  } catch (e: any) {
    toast.error(e?.data?.message || t('common.error'))
  }
})
</script>

<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4 shadow-lg shadow-primary/25">S</div>
      <h1 class="text-2xl font-bold text-foreground">{{ t('auth.resetPassword') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('auth.resetPasswordSubtitle') }}</p>
    </div>

    <Card class="shadow-xl border-border">
      <CardContent class="p-6">
        <div v-if="!token" class="text-center text-sm text-destructive">
          {{ t('auth.invalidResetLink') }}
        </div>

        <form v-else @submit.prevent="onSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('profile.newPassword') }}</label>
            <Input
              v-model="newPassword"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="h-11"
              :class="{ 'border-destructive': errors.newPassword }"
            />
            <p v-if="errors.newPassword" class="text-xs text-destructive">{{ errors.newPassword }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('profile.confirmPassword') }}</label>
            <Input
              v-model="confirmPassword"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              class="h-11"
              :class="{ 'border-destructive': errors.confirmPassword }"
            />
            <p v-if="errors.confirmPassword" class="text-xs text-destructive">{{ errors.confirmPassword }}</p>
          </div>

          <Button type="submit" class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" :disabled="isSubmitting">
            {{ isSubmitting ? t('common.loading') : t('auth.resetPassword') }}
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          <NuxtLink to="/login" class="font-medium text-primary hover:text-primary/80">{{ t('auth.backToLogin') }}</NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
