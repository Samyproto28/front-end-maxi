/**
 * Composable para manejo de estados de peticiones API
 *
 * Proporciona un sistema reactivo para gestionar el estado de llamadas API
 * incluyendo loading, data y error de forma reutilizable en múltiples componentes.
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * @param {Function} apiFunction - Función que ejecuta la petición API (puede ser async)
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.immediate - Si debe ejecutar la petición automáticamente al crear el composable
 * @returns {Object} - API reactiva para manejo de la petición
 *
 * @example
 * // Uso { data, loading básico
 * const, error, execute } = useApi(() => provinciaService.getAll())
 * await execute()
 *
 * @example
 * // Con parámetros
 * const api = useApi((id) => provinciaService.getById(id))
 * await api.execute(1)
 *
 * @example
 * // Con ejecución inmediata
 * const { data, loading, error } = useApi(() => provinciaService.getAll(), { immediate: true })
 */
export function useApi(apiFunction, options = {}) {
  const {
    immediate = false
  } = options

  // Estado reactivo para los datos de la respuesta
  const data = ref(null)

  // Estado reactivo para el indicador de carga
  const loading = ref(false)

  // Estado reactivo para errores
  const error = ref(null)

  /**
   * Ejecuta la función de API
   * @param {...any} args - Argumentos para pasar a la función API
   * @returns {Promise} - Promesa que resuelve con los datos o rechaza con error
   */
  const execute = async (...args) => {
    // Iniciar estado de carga
    loading.value = true

    // Limpiar error previo
    error.value = null

    try {
      // Ejecutar la función API con los argumentos proporcionados
      const result = await apiFunction(...args)

      // Asignar el resultado a data
      data.value = result

      return result
    } catch (err) {
      // Capturar y almacenar el error
      error.value = err

      // Re-lanzar el error para manejo adicional si es necesario
      throw err
    } finally {
      // Finalizar estado de carga siempre
      loading.value = false
    }
  }

  /**
   * Resetea todos los estados del composable a sus valores iniciales
   */
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  // Si immediate es true, ejecutar automáticamente al montar
  if (immediate) {
    onMounted(() => {
      execute()
    })
  }

  // Limpiar estado al desmontar el componente
  onUnmounted(() => {
    reset()
  })

  // Retornar la API reactiva
  return {
    // Estados reactivos
    data,
    loading,
    error,

    // Métodos
    execute,
    reset
  }
}
