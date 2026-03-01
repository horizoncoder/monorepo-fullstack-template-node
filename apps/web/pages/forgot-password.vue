<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { forgotPasswordSchema } from '@repo/shared'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl

useHead({ title: t('auth.forgotPassword') })

const sent = ref(false)
const validationSchema = toTypedSchema(forgotPasswordSchema)
const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema })
const { value: email } = useField<string>('email')

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch(`${baseUrl}/api/client/auth/forgot-password`, {
      method: 'POST',
      body: values,
    })
    sent.value = true
  } catch (e: any) {
    toast.error(e?.data?.message || t('common.error'))
  }
})
</script>

<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4 shadow-lg shadow-primary/25">S</div>
      <h1 class="text-2xl font-bold text-foreground">{{ t('auth.forgotPassword') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('auth.forgotPasswordSubtitle') }}</p>
    </div>

    <Card class="shadow-xl border-border">
      <CardContent class="p-6">
        <!-- Success state -->
        <div v-if="sent" class="text-center space-y-4">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          </div>
          <p class="text-sm text-foreground font-medium">{{ t('auth.checkEmail') }}</p>
          <p class="text-xs text-muted-foreground">{{ t('auth.checkEmailSubtitle') }}</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="onSubmit" class="space-y-4">
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

          <Button type="submit" class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25" :disabled="isSubmitting">
            {{ isSubmitting ? t('common.loading') : t('auth.sendResetLink') }}
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          <NuxtLink to="/login" class="font-medium text-primary hover:text-primary/80">{{ t('auth.backToLogin') }}</NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
