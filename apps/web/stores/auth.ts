import { defineStore } from 'pinia'

interface User {
  id: string
  email: string | null
  name: string
  provider?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const isAuthenticated = computed(() => !!user.value)

  async function register(name: string, email: string, password: string) {
    const res = await $fetch<{ data: User }>(`${baseUrl}/api/client/auth/register`, {
      method: 'POST',
      body: { name, email, password },
      credentials: 'include',
    })
    user.value = res.data
    return res.data
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{ data: User }>(`${baseUrl}/api/client/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    user.value = res.data
    return res.data
  }

  async function logout() {
    await $fetch(`${baseUrl}/api/client/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    user.value = null
  }

  async function fetchMe() {
    isLoading.value = true
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const ssrBaseUrl = import.meta.server ? (config.apiInternalUrl || baseUrl) : baseUrl
      const res = await $fetch<{ data: User }>(`${ssrBaseUrl}/api/client/auth/me`, {
        credentials: 'include',
        headers,
      })
      user.value = res.data
      return res.data
    } catch {
      user.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function googleLogin(credential: string) {
    const res = await $fetch<{ data: User }>(`${baseUrl}/api/client/auth/google`, {
      method: 'POST',
      body: { credential },
      credentials: 'include',
    })
    user.value = res.data
    return res.data
  }

  async function telegramLogin(data: Record<string, any>) {
    const res = await $fetch<{ data: User }>(`${baseUrl}/api/client/auth/telegram`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    })
    user.value = res.data
    return res.data
  }

  return { user, isLoading, isAuthenticated, register, login, logout, fetchMe, googleLogin, telegramLogin }
})
