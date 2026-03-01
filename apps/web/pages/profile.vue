<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { updateProfileSchema, changePasswordSchema } from '@repo/shared'
import { toast } from 'vue-sonner'

definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const baseUrl = config.public.apiBaseUrl

useHead({ title: t('profile.title') })

// Profile form
const profileSchema = toTypedSchema(updateProfileSchema)
const {
  handleSubmit: handleProfileSubmit,
  errors: profileErrors,
  isSubmitting: profileSubmitting,
} = useForm({ validationSchema: profileSchema })
const { value: name } = useField<string>('name', undefined, { initialValue: authStore.user?.name ?? '' })
const { value: email } = useField<string>('email', undefined, { initialValue: authStore.user?.email ?? '' })

const onProfileSubmit = handleProfileSubmit(async (values) => {
  try {
    const res = await $fetch<{ data: any }>(`${baseUrl}/api/client/profile`, {
      method: 'PATCH',
      body: values,
      credentials: 'include',
    })
    if (authStore.user) {
      authStore.user.name = res.data.name
      authStore.user.email = res.data.email
    }
    toast.success(t('profile.updateSuccess'))
  } catch (e: any) {
    toast.error(e?.data?.message || t('common.error'))
  }
})

// Password form
const passwordSchema = toTypedSchema(changePasswordSchema)
const {
  handleSubmit: handlePasswordSubmit,
  errors: passwordErrors,
  isSubmitting: passwordSubmitting,
  resetForm: resetPasswordForm,
} = useForm({ validationSchema: passwordSchema })
const { value: currentPassword } = useField<string>('currentPassword')
const { value: newPassword } = useField<string>('newPassword')
const confirmPassword = ref('')
const confirmError = ref('')

const onPasswordSubmit = handlePasswordSubmit(async (values) => {
  confirmError.value = ''
  if (confirmPassword.value !== values.newPassword) {
    confirmError.value = t('profile.passwordMismatch')
    return
  }
  try {
    await $fetch(`${baseUrl}/api/client/profile/password`, {
      method: 'POST',
      body: values,
      credentials: 'include',
    })
    toast.success(t('profile.passwordChanged'))
    resetPasswordForm()
    confirmPassword.value = ''
  } catch (e: any) {
    toast.error(e?.data?.message || t('common.error'))
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-foreground">{{ t('profile.title') }}</h1>

    <!-- Personal Info -->
    <Card class="border-border">
      <CardHeader>
        <CardTitle class="text-lg">{{ t('profile.personalInfo') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onProfileSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('auth.name') }}</label>
            <Input
              v-model="name"
              type="text"
              class="h-11"
              :class="{ 'border-destructive': profileErrors.name }"
            />
            <p v-if="profileErrors.name" class="text-xs text-destructive">{{ profileErrors.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('auth.email') }}</label>
            <Input
              v-model="email"
              type="email"
              class="h-11"
              :class="{ 'border-destructive': profileErrors.email }"
            />
            <p v-if="profileErrors.email" class="text-xs text-destructive">{{ profileErrors.email }}</p>
          </div>

          <Button type="submit" class="bg-primary hover:bg-primary/90 text-primary-foreground" :disabled="profileSubmitting">
            {{ profileSubmitting ? t('common.loading') : t('profile.save') }}
          </Button>
        </form>
      </CardContent>
    </Card>

    <!-- Change Password (local auth only) -->
    <Card v-if="!authStore.user?.provider || authStore.user.provider === 'local'" class="border-border">
      <CardHeader>
        <CardTitle class="text-lg">{{ t('profile.changePassword') }}</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onPasswordSubmit" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('profile.currentPassword') }}</label>
            <Input
              v-model="currentPassword"
              type="password"
              class="h-11"
              :class="{ 'border-destructive': passwordErrors.currentPassword }"
            />
            <p v-if="passwordErrors.currentPassword" class="text-xs text-destructive">{{ passwordErrors.currentPassword }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('profile.newPassword') }}</label>
            <Input
              v-model="newPassword"
              type="password"
              class="h-11"
              :class="{ 'border-destructive': passwordErrors.newPassword }"
            />
            <p v-if="passwordErrors.newPassword" class="text-xs text-destructive">{{ passwordErrors.newPassword }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">{{ t('profile.confirmPassword') }}</label>
            <Input
              v-model="confirmPassword"
              type="password"
              class="h-11"
              :class="{ 'border-destructive': confirmError }"
            />
            <p v-if="confirmError" class="text-xs text-destructive">{{ confirmError }}</p>
          </div>

          <Button type="submit" class="bg-primary hover:bg-primary/90 text-primary-foreground" :disabled="passwordSubmitting">
            {{ passwordSubmitting ? t('common.loading') : t('profile.updatePassword') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
