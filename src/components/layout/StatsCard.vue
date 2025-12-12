<template>
  <AppCard
    class="transition-transform duration-200 ease-in-out hover:scale-105 cursor-default"
    :class="variantClasses"
  >
    <div class="grid grid-cols-2 gap-4">
      <!-- Icon Section -->
      <div class="flex items-center justify-center">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="iconBackgroundClasses"
        >
          <component :is="icon" class="w-8 h-8" :class="iconColorClasses" />
        </div>
      </div>

      <!-- Text Section -->
      <div class="flex flex-col justify-center">
        <div class="text-3xl font-bold text-gray-900">
          {{ formattedValue }}
        </div>
        <div class="text-sm text-gray-600 mt-1">
          {{ label }}
        </div>
        <div v-if="subvalue" class="text-xs text-gray-500 mt-1">
          {{ subvalue }}
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
/**
 * StatsCard Component
 *
 * A reusable statistics card component that displays an icon, value, and label.
 * Designed for dashboard metrics display with hover effects and color variants.
 *
 * @props
 * @param {Component} icon - Heroicon component to display
 * @param {string} label - Label text below the value
 * @param {string|number} value - Main value to display
 * @param {string|number} [subvalue] - Optional subvalue to display below label
 * @param {string} [variant='primary'] - Color variant ('primary'|'success'|'warning')
 */

import { computed } from 'vue'
import AppCard from '@/components/common/AppCard.vue'

const props = defineProps({
  icon: {
    type: [Object, Function],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subvalue: {
    type: [String, Number],
    default: null
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning'].includes(value)
  }
})

/**
 * Computed property to format the value with locale string if it's a number
 */
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

/**
 * Computed classes for variant styling
 */
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'border-l-4 border-green-500'
    case 'warning':
      return 'border-l-4 border-yellow-500'
    case 'primary':
    default:
      return 'border-l-4 border-blue-500'
  }
})

/**
 * Computed classes for icon background color based on variant
 */
const iconBackgroundClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'primary':
    default:
      return 'bg-blue-100'
  }
})

/**
 * Computed classes for icon color based on variant
 */
const iconColorClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'primary':
    default:
      return 'text-blue-600'
  }
})
</script>
