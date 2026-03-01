export default defineNuxtConfig({
  extends: ['../../packages/ui'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@pinia/nuxt', '@vee-validate/nuxt'],
  tailwindcss: { configPath: '../../packages/ui/tailwind.config.ts' },
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'uk', name: 'Українська', file: 'uk.json' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      fallbackLocale: 'en',
    },
    bundle: { fullInstall: false },
  },
  veeValidate: {
    autoImports: true,
  },
  runtimeConfig: {
    apiInternalUrl: '', // overridden at runtime by NUXT_API_INTERNAL_URL
    public: {
      apiBaseUrl: '',
      googleClientId: '',
      telegramBotUsername: '',
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2025-01-01',
})
