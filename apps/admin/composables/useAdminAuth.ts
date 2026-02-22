import { useAdminAuthStore } from '../stores/auth'

// Backwards-compatible wrapper used by existing pages/layouts
export function useAdminAuth() {
  const store = useAdminAuthStore()
  return {
    currentAdmin: computed(() => store.admin),
    isLoading: computed(() => store.isLoading),
    login: store.login,
    logout: store.logout,
    fetchMe: store.fetchMe,
    hasPermission: store.hasPermission,
  }
}
