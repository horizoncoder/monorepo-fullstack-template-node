import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: resolve(__dirname, './tailwind.config.ts'),
  },

  css: [resolve(__dirname, './assets/css/globals.css')],

  components: [
    {
      path: resolve(__dirname, './components/ui'),
      prefix: '',
      pathPrefix: false,
      extensions: ['vue'],
    },
  ],

  imports: {
    dirs: [
      resolve(__dirname, './composables'),
      resolve(__dirname, './lib'),
    ],
  },
})
