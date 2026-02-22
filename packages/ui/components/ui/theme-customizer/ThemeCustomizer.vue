<script setup lang="ts">
import { useTheme, themePresets, textColorPresets } from '../../../composables/useTheme'

const { themeMode, accentName, textColorName, toggleMode, setAccent, setTextColor } = useTheme()
</script>

<template>
  <div class="space-y-4">
    <!-- Dark / Light mode -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Mode</label>
      <div class="flex gap-2">
        <Button
          size="sm"
          :variant="themeMode === 'light' ? 'default' : 'outline'"
          @click="themeMode !== 'light' && toggleMode()"
        >
          Light
        </Button>
        <Button
          size="sm"
          :variant="themeMode === 'dark' ? 'default' : 'outline'"
          @click="themeMode !== 'dark' && toggleMode()"
        >
          Dark
        </Button>
      </div>
    </div>

    <!-- Accent color -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Accent Color</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in themePresets"
          :key="preset.name"
          class="h-8 w-8 rounded-full border-2 transition-all"
          :class="accentName === preset.name ? 'border-foreground scale-110' : 'border-transparent'"
          :style="{ backgroundColor: `hsl(${preset.primary})` }"
          :title="preset.label"
          @click="setAccent(preset.name)"
        />
      </div>
    </div>

    <!-- Text color -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Text Style</label>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="preset in textColorPresets"
          :key="preset.name"
          size="sm"
          :variant="textColorName === preset.name ? 'default' : 'outline'"
          @click="setTextColor(preset.name)"
        >
          {{ preset.label }}
        </Button>
      </div>
    </div>
  </div>
</template>
