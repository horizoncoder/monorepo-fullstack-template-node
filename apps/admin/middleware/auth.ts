export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const { currentAdmin, fetchMe } = useAdminAuth()

  if (!currentAdmin.value) {
    await fetchMe()
  }

  if (!currentAdmin.value) {
    return navigateTo('/login')
  }
})
