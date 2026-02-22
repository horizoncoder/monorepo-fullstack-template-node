import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const options: VueQueryPluginOptions = {
    queryClientConfig: {
      defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
    },
  }
  nuxtApp.vueApp.use(VueQueryPlugin, options)
})
