<template>
  <div
    class="bg-white rounded-lg shadow-md p-6"
    :class="variantClasses"
  >
    <div v-if="title || subtitle" class="mb-4">
      <h3 v-if="title" class="text-lg font-semibold text-gray-900">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * AppCard Component
 *
 * A flexible card container component with optional title and subtitle props.
 * Supports different visual variants and provides a slot for custom content.
 *
 * @props
 * @param {string} [title] - Optional card title
 * @param {string} [subtitle] - Optional card subtitle
 * @param {string} [variant='default'] - Visual variant ('default'|'outlined'|'elevated')
 */
const props = defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated'].includes(value)
  }
})

/**
 * Computed classes for variant styling
 */
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outlined':
      return 'border border-gray-200'
    case 'elevated':
      return 'shadow-lg'
    default:
      return ''
  }
})
</script>
