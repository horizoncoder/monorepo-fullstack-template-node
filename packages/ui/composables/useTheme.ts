import { ref, watch, onMounted } from 'vue'

export interface ThemePreset {
  name: string
  label: string
  primary: string
  primaryForeground: string
}

export const themePresets: ThemePreset[] = [
  { name: 'zinc', label: 'Zinc', primary: '240 5.9% 10%', primaryForeground: '0 0% 98%' },
  { name: 'blue', label: 'Blue', primary: '221.2 83.2% 53.3%', primaryForeground: '210 40% 98%' },
  { name: 'green', label: 'Green', primary: '142.1 76.2% 36.3%', primaryForeground: '355.7 100% 97.3%' },
  { name: 'orange', label: 'Orange', primary: '24.6 95% 53.1%', primaryForeground: '60 9.1% 97.8%' },
  { name: 'rose', label: 'Rose', primary: '346.8 77.2% 49.8%', primaryForeground: '355.7 100% 97.3%' },
  { name: 'violet', label: 'Violet', primary: '263.4 70% 50.4%', primaryForeground: '210 20% 98%' },
]

export const textColorPresets = [
  { name: 'default', label: 'Default', foreground: '222.2 84% 4.9%', darkForeground: '210 40% 98%' },
  { name: 'warm', label: 'Warm', foreground: '20 14.3% 4.1%', darkForeground: '60 9.1% 97.8%' },
  { name: 'cool', label: 'Cool', foreground: '222.2 47.4% 11.2%', darkForeground: '210 40% 98%' },
  { name: 'soft', label: 'Soft', foreground: '240 3.8% 46.1%', darkForeground: '240 5% 64.9%' },
]

const STORAGE_KEY = 'theme-preferences'

interface ThemeState {
  mode: 'light' | 'dark'
  accent: string
  textColor: string
}

function getStoredTheme(): ThemeState {
  if (typeof window === 'undefined') {
    return { mode: 'light', accent: 'zinc', textColor: 'default' }
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { mode: 'light', accent: 'zinc', textColor: 'default' }
}

const themeMode = ref<'light' | 'dark'>('light')
const accentName = ref('zinc')
const textColorName = ref('default')

export function useTheme() {
  onMounted(() => {
    const stored = getStoredTheme()
    themeMode.value = stored.mode
    accentName.value = stored.accent
    textColorName.value = stored.textColor
    applyTheme()
  })

  function applyTheme() {
    if (typeof document === 'undefined') return

    const root = document.documentElement

    // Dark mode
    if (themeMode.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Accent color
    const preset = themePresets.find((p) => p.name === accentName.value)
    if (preset) {
      root.style.setProperty('--primary', preset.primary)
      root.style.setProperty('--primary-foreground', preset.primaryForeground)
      root.style.setProperty('--ring', preset.primary)
    }

    // Text color
    const textPreset = textColorPresets.find((p) => p.name === textColorName.value)
    if (textPreset) {
      const fg = themeMode.value === 'dark' ? textPreset.darkForeground : textPreset.foreground
      root.style.setProperty('--foreground', fg)
      root.style.setProperty('--card-foreground', fg)
    }

    // Persist
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mode: themeMode.value, accent: accentName.value, textColor: textColorName.value }),
      )
    } catch {}
  }

  function toggleMode() {
    themeMode.value = themeMode.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  function setAccent(name: string) {
    accentName.value = name
    applyTheme()
  }

  function setTextColor(name: string) {
    textColorName.value = name
    applyTheme()
  }

  watch([themeMode, accentName, textColorName], applyTheme)

  return {
    themeMode,
    accentName,
    textColorName,
    toggleMode,
    setAccent,
    setTextColor,
    themePresets,
    textColorPresets,
  }
}
