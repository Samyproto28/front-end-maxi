<template>
  <span :class="badgeClasses">
    {{ text }}
  </span>
</template>

<script setup>
/**
 * AppBadge Component
 *
 * A pill-shaped badge component for displaying status indicators
 * with different color variants for various contexts.
 *
 * @props
 * @param {string} variant - Badge style variant ('success'|'warning'|'danger'|'info'|'neutral')
 * @param {string} text - Badge text content
 */
const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => ['success', 'warning', 'danger', 'info', 'neutral'].includes(value)
  },
  text: {
    type: String,
    required: true
  }
})

/**
 * Computed classes for badge styling based on variant
 */
const badgeClasses = computed(() => {
  const variantMap = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800'
  }

  return [
    'px-2 py-1 rounded-full text-xs font-medium inline-block',
    variantMap[props.variant] || variantMap.neutral
  ]
})
</script>
