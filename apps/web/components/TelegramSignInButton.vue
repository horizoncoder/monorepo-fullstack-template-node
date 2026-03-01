<script setup lang="ts">
const emit = defineEmits<{
  success: [data: {
    id: number; first_name: string; last_name?: string;
    username?: string; photo_url?: string; auth_date: number; hash: string;
  }]
}>()

const config = useRuntimeConfig()
const container = ref<HTMLElement>()

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void
  }
}

onMounted(() => {
  const botUsername = config.public.telegramBotUsername
  if (!botUsername) return

  window.onTelegramAuth = (user: any) => {
    emit('success', user)
  }

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', botUsername)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  script.async = true

  container.value?.appendChild(script)
})
</script>

<template>
  <div ref="container" class="w-full flex justify-center" />
</template>
