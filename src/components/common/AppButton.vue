<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :class="buttonClasses"
    :aria-busy="props.loading"
    :aria-disabled="props.disabled || props.loading"
    @click="handleClick"
  >
    <Transition name="fade" mode="out-in">
      <!-- Loading state with spinner -->
      <div
        v-if="props.loading"
        key="loading"
        class="flex items-center justify-center"
      >
        <AppSpinner
          :size="spinnerSize"
          :color="spinnerColor"
          class="mr-2"
        />
        <span v-if="$slots.default" class="sr-only">Cargando...</span>
      </div>

      <!-- Normal state with slots -->
      <div
        v-else
        key="content"
        class="flex items-center"
        :class="contentClasses"
      >
        <!-- Icon left slot -->
        <span v-if="$slots['icon-left']" class="mr-2">
          <slot name="icon-left" />
        </span>

        <!-- Default slot for button text -->
        <span v-if="$slots.default">
          <slot />
        </span>
        <span v-else-if="!$slots['icon-left'] && !$slots['icon-right']">
          Botón
        </span>

        <!-- Icon right slot -->
        <span v-if="$slots['icon-right']" class="ml-2">
          <slot name="icon-right" />
        </span>
      </div>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppSpinner from './AppSpinner.vue'

// Type definitions
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

// Props
const props = defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: ButtonType
}>()

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Default values
const propsWithDefaults = computed(() => ({
  variant: props.variant ?? 'primary',
  size: props.size ?? 'md',
  disabled: props.disabled ?? false,
  loading: props.loading ?? false,
  type: props.type ?? 'button',
}))

// Size configurations
const sizeConfig = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    spinnerSize: 'sm' as const,
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    spinnerSize: 'md' as const,
  },
  lg: {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    spinnerSize: 'lg' as const,
  },
}

// Variant configurations
const variantConfig = {
  primary: {
    base: 'bg-primary hover:bg-primary-dark text-white',
    spinnerColor: 'white',
  },
  secondary: {
    base: 'bg-secondary hover:bg-secondary-dark text-white',
    spinnerColor: 'white',
  },
  danger: {
    base: 'bg-danger hover:bg-danger-dark text-white',
    spinnerColor: 'white',
  },
  ghost: {
    base: 'bg-transparent hover:bg-gray-100 text-primary border border-primary',
    spinnerColor: 'primary',
  },
}

// Computed classes
const buttonClasses = computed(() => {
  const { variant, size, disabled, loading } = propsWithDefaults.value
  const sizeClasses = sizeConfig[size]
  const variantClasses = variantConfig[variant]

  return [
    // Base styles
    'rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Size styles
    sizeClasses.padding,
    sizeClasses.fontSize,
    // Variant styles
    variantClasses.base,
    // Disabled/Loading states
    (disabled || loading) && 'opacity-50 cursor-not-allowed',
    // Focus ring color based on variant
    variant === 'ghost'
      ? 'focus:ring-primary'
      : `focus:ring-${variant === 'danger' ? 'danger' : 'primary'}`,
  ].filter(Boolean)
})

// Spinner size based on button size
const spinnerSize = computed(() => {
  return sizeConfig[propsWithDefaults.value.size].spinnerSize
})

// Spinner color based on variant
const spinnerColor = computed(() => {
  return variantConfig[propsWithDefaults.value.variant].spinnerColor
})

// Content spacing based on size
const contentClasses = computed(() => {
  const { size } = propsWithDefaults.value
  const spacingMap = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  }
  return spacingMap[size]
})

// Click handler
const handleClick = (event: MouseEvent) => {
  const { disabled, loading } = propsWithDefaults.value

  if (disabled || loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
