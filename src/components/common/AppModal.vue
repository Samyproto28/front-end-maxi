<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogOverlay,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
})

// Emits
const emit = defineEmits(['close'])

// Body scroll prevention
const preventBodyScroll = (shouldPrevent) => {
  if (shouldPrevent) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Watch isOpen to manage body scroll
watch(
  () => props.isOpen,
  (newValue) => {
    preventBodyScroll(newValue)
  },
  { immediate: true }
)

// Cleanup on unmount
onUnmounted(() => {
  preventBodyScroll(false)
})

// Size classes mapping
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog
      as="div"
      class="relative z-50"
      :static="!closeOnClickOutside"
      @close="emit('close')"
    >
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <!-- Modal Container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <!-- Modal Panel -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all',
                sizeClasses[props.size],
              ]"
            >
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <DialogTitle
                  as="h3"
                  class="text-lg font-semibold leading-6 text-gray-900"
                >
                  {{ props.title }}
                </DialogTitle>
                <button
                  type="button"
                  class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="emit('close')"
                >
                  <span class="sr-only">Cerrar</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <!-- Content -->
              <div class="px-6 py-4">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="px-6 py-4 border-t border-gray-200 bg-gray-50"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
