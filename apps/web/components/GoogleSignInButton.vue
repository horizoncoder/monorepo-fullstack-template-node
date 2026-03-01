<script setup lang="ts">
const emit = defineEmits<{ success: [credential: string] }>()
const config = useRuntimeConfig()
const container = ref<HTMLElement>()

declare global {
  interface Window {
    google?: any
  }
}

onMounted(() => {
  const clientId = config.public.googleClientId
  if (!clientId) return

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.onload = () => {
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        emit('success', response.credential)
      },
    })
    if (container.value) {
      window.google?.accounts.id.renderButton(container.value, {
        theme: 'outline',
        size: 'large',
        width: container.value.offsetWidth,
        text: 'signin_with',
      })
    }
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div ref="container" class="w-full flex justify-center" />
</template>
