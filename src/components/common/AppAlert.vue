<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

/**
 * Props for the AppAlert component
 */
interface Props {
  /**
   * Type of the alert - determines colors and icon
   */
  type: 'success' | 'error' | 'warning' | 'info'
  /**
   * Alert message text
   */
  message: string
  /**
   * Whether the alert can be dismissed
   */
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: false
})

/**
 * Emitted events
 */
const emit = defineEmits<{
  dismiss: []
}>()

/**
 * Internal visibility state
 */
const isVisible = ref(true)

/**
 * Computed property for alert CSS classes based on type
 */
const alertClasses = computed(() => {
  const baseClasses = 'flex items-start p-4 rounded-lg border-l-4'

  const typeClasses = {
    success: 'bg-green-50 text-green-800 border-green-500',
    error: 'bg-red-50 text-red-800 border-red-500',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-500',
    info: 'bg-blue-50 text-blue-800 border-blue-500'
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
 * Handle dismiss action
 */
const handleDismiss = () => {
  isVisible.value = false
  emit('dismiss')
}
</script>

<template>
  <Transition name="alert-fade">
    <div
      v-if="isVisible"
      :class="alertClasses"
      role="alert"
      :aria-label="`Alert: ${message}`"
    >
      <!-- Icon -->
      <div class="flex-shrink-0 mr-3">
        <component
          :is="iconComponent"
          :class="['w-5 h-5', iconColorClasses]"
          aria-hidden="true"
        />
      </div>

      <!-- Message content (slot or text) -->
      <div class="flex-grow">
        <slot>
          <p class="text-sm font-medium">
            {{ message }}
          </p>
        </slot>
      </div>

      <!-- Dismiss button -->
      <div v-if="props.dismissible" class="flex-shrink-0 ml-3">
        <button
          type="button"
          @click="handleDismiss"
          class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
          :class="iconColorClasses"
          aria-label="Cerrar alerta"
        >
          <XMarkIcon class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: opacity 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
}
</style>
