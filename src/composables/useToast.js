/**
 * Composable para gestión de notificaciones toast
 *
 * Proporciona un sistema reactivo global para mostrar notificaciones toast
 * con auto-dismiss, stack de mensajes y diferentes tipos de alerta.
 */

import { ref } from 'vue'

/**
 * Array reactivo global para almacenar los toasts activos
 * Está fuera del composable para ser compartido entre todas las instancias
 */
const toasts = ref([])

/**
 * Límite máximo de toasts simultáneos
 */
const MAX_TOASTS = 5

/**
 * Genera un ID único para cada toast
 * @returns {string} - ID único basado en timestamp y random
 */
const generateId = () => {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * @returns {Object} - API del sistema de toasts
 */
export function useToast() {
  /**
   * Muestra una notificación toast
   * @param {Object} options - Opciones del toast
   * @param {string} options.type - Tipo de toast: 'success' | 'error' | 'warning' | 'info'
   * @param {string} options.message - Mensaje a mostrar
   * @param {number} [options.duration=3000] - Duración en ms antes de auto-dismiss (0 para persistente)
   * @returns {string} - ID del toast creado
   */
  const show = ({ type = 'info', message, duration = 3000 }) => {
    const id = generateId()

    const toast = {
      id,
      type,
      message,
      duration
    }

    // Si excedemos el límite máximo, eliminar el más antiguo
    if (toasts.value.length >= MAX_TOASTS) {
      const oldestToast = toasts.value[0]
      remove(oldestToast.id)
    }

    // Agregar el nuevo toast al array
    toasts.value.push(toast)

    // Programar auto-dismiss si duration > 0
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }

    return id
  }

  /**
   * Elimina un toast por su ID
   * @param {string} id - ID del toast a eliminar
   */
  const remove = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Elimina todos los toasts
   */
  const clear = () => {
    toasts.value = []
  }

  /**
   * Métodos de conveniencia para cada tipo de toast
   */
  const success = (message, duration = 3000) => {
    return show({ type: 'success', message, duration })
  }

  const error = (message, duration = 5000) => {
    return show({ type: 'error', message, duration })
  }

  const warning = (message, duration = 4000) => {
    return show({ type: 'warning', message, duration })
  }

  const info = (message, duration = 3000) => {
    return show({ type: 'info', message, duration })
  }

  return {
    // Estado reactivo (solo lectura recomendado)
    toasts,

    // Métodos principales
    show,
    remove,
    clear,

    // Métodos de conveniencia
    success,
    error,
    warning,
    info
  }
}
