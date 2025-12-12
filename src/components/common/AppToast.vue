<script setup>
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

/**
 * Props for the AppToast component
 */
const props = defineProps({
  /**
   * Type of the toast - determines colors and icon
   */
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  /**
   * Toast message text
   */
  message: {
    type: String,
    required: true
  },
  /**
   * Whether the toast can be dismissed manually
   */
  dismissible: {
    type: Boolean,
    default: true
  }
})

/**
 * Emitted events
 */
const emit = defineEmits(['close'])

/**
 * Computed property for toast CSS classes based on type
 */
const toastClasses = computed(() => {
  const baseClasses = 'flex items-start p-4 rounded-lg shadow-lg border-l-4 bg-white'

  const typeClasses = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  }

  return `${baseClasses} ${typeClasses[props.type]}`
})

/**
 * Computed property for the icon component based on type
 */
const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }

  return icons[props.type]
})

/**
 * Computed property for icon color classes
 */
const iconColorClasses = computed(() => {
  const colors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  return colors[props.type]
})

/**
 * Computed property for text color classes
 */
const textColorClasses = computed(() => {
  const colors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }

  return colors[props.type]
})

/**
 * Handle close action
 */
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div
    :class="toastClasses"
    role="alert"
    :aria-label="`Notificación: ${message}`"
  >
    <!-- Icon -->
    <div class="flex-shrink-0 mr-3">
      <component
        :is="iconComponent"
        :class="['w-5 h-5', iconColorClasses]"
        aria-hidden="true"
      />
    </div>

    <!-- Message content -->
    <div class="flex-grow min-w-0">
      <p :class="['text-sm font-medium break-words', textColorClasses]">
        {{ message }}
      </p>
    </div>

    <!-- Close button -->
    <div v-if="dismissible" class="flex-shrink-0 ml-3">
      <button
        type="button"
        @click="handleClose"
        class="inline-flex rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
        aria-label="Cerrar notificación"
      >
        <XMarkIcon class="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
