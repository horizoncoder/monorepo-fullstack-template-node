<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '../../../lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const classes = computed(() =>
  cn(
    'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
    props.class,
  ),
)
</script>

<template>
  <th :class="classes">
    <slot />
  </th>
</template>
