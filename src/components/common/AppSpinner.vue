<template>
  <svg
    :width="sizeInPixels"
    :height="sizeInPixels"
    :class="['animate-spin', colorClass]"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      :stroke="currentColor"
      stroke-width="4"
      fill="none"
    />
    <path
      class="opacity-75"
      :stroke="currentColor"
      stroke-width="4"
      fill="none"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

/**
 * AppSpinner Component
 *
 * An animated SVG spinner component for loading states.
 * Supports multiple sizes and custom colors.
 *
 * @props
 * @param {string} [size='md'] - Spinner size ('sm'|'md'|'lg')
 * @param {string} [color='blue-600'] - Spinner color (CSS color class or value)
 */
const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: 'blue-600'
  }
})

/**
 * Map size prop to pixel values
 */
const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32
}

/**
 * Convert size to pixels
 */
const sizeInPixels = computed(() => sizeMap[props.size] || sizeMap.md)

/**
 * Resolve color class - support both Tailwind classes and custom colors
 */
const colorClass = computed(() => {
  // If it's a custom color (hex, rgb, etc.), return empty and use stroke directly
  if (!props.color.match(/^[a-z]+-[0-9]+$/)) {
    return ''
  }
  // Otherwise it's a Tailwind class
  return `text-${props.color}`
})

/**
 * Get current color for SVG strokes
 */
const currentColor = computed(() => {
  // If it's not a Tailwind class, use it directly
  if (!props.color.match(/^[a-z]+-[0-9]+$/)) {
    return props.color
  }
  // For Tailwind classes, we use currentColor and apply via text- class
  return 'currentColor'
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
