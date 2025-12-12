<script setup>
import { Teleport, TransitionGroup } from 'vue'
import AppToast from './AppToast.vue'
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

/**
 * Handle toast close event
 * @param {string} id - ID del toast a cerrar
 */
const handleClose = (id) => {
  remove(id)
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup name="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <AppToast
            :type="toast.type"
            :message="toast.message"
            @close="handleClose(toast.id)"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* Animaciones para TransitionGroup */
.toast-list-move,
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Asegurar que los elementos que salen no afecten el layout */
.toast-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
