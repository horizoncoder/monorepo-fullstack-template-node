<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@repo/shared'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const config = useRuntimeConfig()
useHead({ title: t('auth.login') })

const hasOAuthProviders = computed(() => !!config.public.googleClientId || !!config.public.telegramBotUsername)

const validationSchema = toTypedSchema(loginSchema)
const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema })
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
    toast.success(t('auth.loginSuccess'))
    navigateTo('/')
  } catch (e: any) {
    toast.error(e?.data?.message || t('auth.invalidCredentials'))
  }
})

async function handleGoogleLogin(credential: string) {
  try {
    await authStore.googleLogin(credential)
    toast.success(t('auth.loginSuccess'))
    navigateTo('/')
  } catch (e: any) {
    toast.error(e?.data?.message || t('auth.oauthError'))
  }
}

async function handleTelegramLogin(data: Record<string, any>) {
  try {
    await authStore.telegramLogin(data)
    toast.success(t('auth.loginSuccess'))
    navigateTo('/')
  } catch (e: any) {
    toast.error(e?.data?.message || t('auth.oauthError'))
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo & Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4 shadow-lg shadow-primary/25">S</div>
      <h1 class="text-2xl font-bold text-foreground">{{ t('auth.welcomeBack') }}</h1>
      <p class="mt-2 text-sm text-muted-foreground">{{ t('auth.loginSubtitle') }}</p>
    </div>

    <!-- Login Card -->
    <Card class="shadow-xl border-border">
      <CardContent class="p-6">
        <form @submit.prevent="onSubmit" class="space-y-4">
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
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-foreground">{{ t('auth.password') }}</label>
              <NuxtLink to="/forgot-password" class="text-xs text-primary hover:text-primary/80">{{ t('auth.forgotPasswordLink') }}</NuxtLink>
            </div>
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
            {{ isSubmitting ? t('common.loading') : t('auth.signIn') }}
          </Button>
        </form>

        <!-- OAuth Section -->
        <template v-if="hasOAuthProviders">
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border"></div></div>
            <div class="relative flex justify-center text-xs"><span class="bg-card px-2 text-muted-foreground">{{ t('auth.orContinueWith') }}</span></div>
          </div>

          <div class="space-y-3">
            <GoogleSignInButton @success="handleGoogleLogin" />
            <TelegramSignInButton @success="handleTelegramLogin" />
          </div>
        </template>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          {{ t('auth.noAccount') }}
          <NuxtLink to="/register" class="font-medium text-primary hover:text-primary/80">{{ t('auth.signUp') }}</NuxtLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
