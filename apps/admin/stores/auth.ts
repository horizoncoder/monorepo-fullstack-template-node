import { defineStore } from 'pinia'

interface AdminRole {
  id: string
  name: string
}

interface Admin {
  id: string
  email: string
  name: string
  roles: AdminRole[]
  permissions: string[]
  isSuperuser: boolean
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const admin = ref<Admin | null>(null)
  const isLoading = ref(false)
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  const isAuthenticated = computed(() => !!admin.value)

  async function login(email: string, password: string) {
    const res = await $fetch<{ data: Admin }>(`${baseUrl}/api/admin/auth/login`, {
      method: 'POST',
      body: { email, password },
      credentials: 'include',
    })
    admin.value = res.data
    return res.data
  }

  async function logout() {
    await $fetch(`${baseUrl}/api/admin/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    admin.value = null
  }

  async function fetchMe() {
    isLoading.value = true
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const res = await $fetch<{ data: Admin }>(`${baseUrl}/api/admin/auth/me`, {
        credentials: 'include',
        headers,
      })
      admin.value = res.data
      return res.data
    } catch {
      admin.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  function hasPermission(permission: string) {
    if (!admin.value) return false
    if (admin.value.isSuperuser) return true
    return admin.value.permissions.includes(permission)
  }

  return { admin, isLoading, isAuthenticated, login, logout, fetchMe, hasPermission }
})
