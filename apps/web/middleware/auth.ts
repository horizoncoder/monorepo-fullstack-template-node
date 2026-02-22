export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.fetchMe()
  }

  if (!authStore.user) {
    return navigateTo('/login')
  }
})
