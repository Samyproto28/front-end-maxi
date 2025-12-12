<template>
  <div class="relative">
    <Listbox v-if="!searchable" v-model="selectedValue" @update:modelValue="$emit('update:modelValue', $event)">
      <div class="relative">
        <ListboxLabel v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
        </ListboxLabel>

        <ListboxButton
          class="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:bg-gray-50"
          :class="{ 'border-red-500': error }"
        >
          <span class="block truncate">
            {{ displayValue || placeholder }}
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ListboxOption
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              v-slot="{ active, selected }"
              class="relative cursor-pointer select-none py-2 px-4"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                selected ? 'bg-primary text-white' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="block truncate" :class="[selected ? 'font-medium' : 'font-normal']">
                  {{ option.label }}
                </span>
                <span v-if="selected" class="flex items-center">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>

    <Combobox v-else v-model="selectedValue" @update:modelValue="$emit('update:modelValue', $event)">
      <div class="relative">
        <ComboboxLabel v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
          {{ label }}
        </ComboboxLabel>

        <div class="relative">
          <ComboboxInput
            class="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:bg-gray-50"
            :class="{ 'border-red-500': error }"
            :display-value="(value) => getOptionLabel(value)"
            :placeholder="placeholder"
            @change="searchQuery = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <ComboboxOptions
            v-if="filteredOptions.length > 0"
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <ComboboxOption
              v-for="option in filteredOptions"
              :key="option.value"
              :value="option.value"
              v-slot="{ active, selected }"
              class="relative cursor-pointer select-none py-2 px-4"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-900',
                selected ? 'bg-primary text-white' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="block truncate" :class="[selected ? 'font-medium' : 'font-normal']">
                  {{ option.label }}
                </span>
                <span v-if="selected" class="flex items-center">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </ComboboxOption>
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions
} from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar...'
  },
  searchable: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedValue = ref(props.modelValue)
const searchQuery = ref('')

const displayValue = computed(() => {
  if (!selectedValue.value) return ''
  const option = props.options.find(opt => opt.value === selectedValue.value)
  return option ? option.label : ''
})

const getOptionLabel = (value) => {
  if (!value) return ''
  const option = props.options.find(opt => opt.value === value)
  return option ? option.label : ''
}

const filteredOptions = computed(() => {
  if (!props.searchable) return props.options

  if (!searchQuery.value) {
    return props.options
  }

  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query)
  )
})

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})
</script>
