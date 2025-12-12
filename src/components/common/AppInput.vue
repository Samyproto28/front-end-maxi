<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  type?: 'text' | 'number' | 'email' | 'password'
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

// Generate unique ID for input
const inputId = computed(() => `app-input-${Math.random().toString(36).substr(2, 9)}`)

// Generate unique ID for error message
const errorId = computed(() => props.error ? `${inputId.value}-error` : undefined)

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
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

    <!-- Input wrapper with suffix slot support -->
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :value="modelValue"
        @input="handleInput"
        :aria-invalid="!!error"
        :aria-describedby="errorId"
        :aria-required="required"
        :inputmode="type === 'number' ? 'numeric' : undefined"
        class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        :class="[
          error
            ? 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        ]"
      />

      <!-- Suffix slot for icons or additional content -->
      <slot name="suffix"></slot>
    </div>

    <!-- Error message -->
    <Transition name="slide-fade">
      <p
        v-if="error"
        :id="errorId"
        class="text-sm text-red-600 mt-1"
      >
        {{ error }}
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
