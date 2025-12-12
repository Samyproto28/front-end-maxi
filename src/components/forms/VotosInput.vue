<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatNumero } from '@/utils/formatters'

interface Props {
  modelValue: number | string
  max?: number
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  input: [value: number]
}>()

// Generate unique ID for input
const inputId = computed(() => `votos-input-${Math.random().toString(36).substr(2, 9)}`)

// Generate unique ID for error message
const errorId = computed(() => props.error ? `${inputId.value}-error` : undefined)

// Track if input is focused for formatting toggle
const isFocused = ref(false)

// Validation logic
const validateValue = (value: number | string): { isValid: boolean; error?: string } => {
  const numValue = typeof value === 'string' ? Number(value) : value

  // Check if it's a valid number
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Debe ser un número válido' }
  }

  // Check if negative
  if (numValue < 0) {
    return { isValid: false, error: 'No puede ser negativo' }
  }

  // Check if it's an integer
  if (!Number.isInteger(numValue)) {
    return { isValid: false, error: 'Debe ser un número entero' }
  }

  // Check max constraint if defined
  if (props.max !== undefined && numValue > props.max) {
    return { isValid: false, error: `No puede ser mayor a ${props.max}` }
  }

  return { isValid: true }
}

// Computed validation state
const validation = computed(() => validateValue(props.modelValue))

// Get display value (formatted when not focused and has value)
const displayValue = computed(() => {
  if (!props.modelValue || isFocused.value) {
    return props.modelValue?.toString() || ''
  }

  const numValue = typeof props.modelValue === 'string'
    ? Number(props.modelValue)
    : props.modelValue

  if (isNaN(numValue)) return ''

  return formatNumero(numValue)
})

// Handle keypress to prevent non-numeric characters
const handleKeypress = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter']
  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  const ctrlKeys = ['a', 'c', 'v', 'x']
  // Allow: home, end, left, right, down, up
  const navigationKeys = ['Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

  const key = event.key

  if (
    allowedKeys.includes(key) ||
    (event.ctrlKey && ctrlKeys.includes(key.toLowerCase())) ||
    navigationKeys.includes(key)
  ) {
    return
  }

  // Allow only digits (0-9)
  if (!/^\d$/.test(key)) {
    event.preventDefault()
  }
}

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)

  if (!isNaN(value)) {
    emit('update:modelValue', value)
    emit('input', value)
  }
}

// Handle focus - remove formatting for editing
const handleFocus = () => {
  isFocused.value = true
}

// Handle blur - apply formatting
const handleBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input -->
    <div class="relative">
      <input
        :id="inputId"
        type="number"
        :placeholder="placeholder || '0'"
        :disabled="disabled"
        :required="required"
        :value="displayValue"
        min="0"
        step="1"
        inputmode="numeric"
        :aria-invalid="!!validation.error"
        :aria-describedby="errorId"
        :aria-required="required"
        @keypress="handleKeypress"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors font-mono text-right"
        :class="[
          validation.error
            ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        ]"
      />
    </div>

    <!-- Error message -->
    <Transition name="slide-fade">
      <p
        v-if="validation.error"
        :id="errorId"
        class="text-sm text-red-600 mt-1"
      >
        {{ validation.error }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
