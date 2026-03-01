import { useAuthStore } from '../stores/auth'

export { useAuthStore }

export function useAuth() {
  const store = useAuthStore()
  return {
    currentUser: computed(() => store.user),
    isLoading: computed(() => store.isLoading),
    isAuthenticated: computed(() => store.isAuthenticated),
    login: store.login,
    logout: store.logout,
    fetchMe: store.fetchMe,
  }
}
