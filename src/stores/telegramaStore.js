import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import telegramaService from '../services/telegramaService'

/**
 * Store para gestión de telegramas electorales
 * Utiliza el patrón Setup Store con Composition API
 * Implementa validación local y manejo de errores de validación del backend
 */
export const useTelegramaStore = defineStore('telegrama', () => {
  // State reactivo
  const telegramas = ref([])
  const telegramaActual = ref(null)
  const mesaSeleccionada = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref(null)
  const validationErrors = ref({})

  // Getters computados
  const telegramasPorMesa = computed(() => {
    return (mesaId) => {
      return telegramas.value.filter(t => t.mesa_id === mesaId)
    }
  })

  const totalVotos = computed(() => {
    if (!telegramaActual.value) return 0

    let total = 0

    // Sumar votos de diputados y senadores
    if (telegramaActual.value.votos && Array.isArray(telegramaActual.value.votos)) {
      telegramaActual.value.votos.forEach(voto => {
        total += parseInt(voto.votos_diputados || 0, 10)
        total += parseInt(voto.votos_senadores || 0, 10)
      })
    }

    // Sumar votos en blanco
    total += parseInt(telegramaActual.value.blancos || 0, 10)

    // Sumar votos nulos
    total += parseInt(telegramaActual.value.nulos || 0, 10)

    // Sumar votos recurridos
    total += parseInt(telegramaActual.value.recurridos || 0, 10)

    return total
  })

  // Actions
  async function fetchTelegramas() {
    loading.value = true
    error.value = null

    try {
      const data = await telegramaService.getAll()
      telegramas.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al cargar telegramas'
      console.error('Error fetchTelegramas:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function guardarTelegrama(data) {
    saving.value = true
    error.value = null
    validationErrors.value = {}

    try {
      // Validación local: suma de votos debe ser <= electores de la mesa
      if (data.mesa_id && mesaSeleccionada.value?.electores) {
        const totalVotosData = calcularTotalVotos(data)
        if (totalVotosData > mesaSeleccionada.value.electores) {
          validationErrors.value = {
            general: 'La suma de votos no puede ser mayor al número de electores de la mesa'
          }
          return { success: false, error: 'La suma de votos excede el número de electores' }
        }
      }

      // Llamar al servicio API
      const telegramaCreado = await telegramaService.create(data)

      // Agregar a la lista local
      telegramas.value.push(telegramaCreado)

      return { success: true, data: telegramaCreado }
    } catch (err) {
      error.value = err.message || 'Error al guardar telegrama'

      // Manejar errores 422 de validación del backend
      if (err.errors && typeof err.errors === 'object') {
        validationErrors.value = err.errors
      }

      return { success: false, error: err }
    } finally {
      saving.value = false
    }
  }

  async function actualizarTelegrama(id, data) {
    saving.value = true
    error.value = null
    validationErrors.value = {}

    try {
      // Validación local antes de enviar
      if (data.mesa_id && mesaSeleccionada.value?.electores) {
        const totalVotosData = calcularTotalVotos(data)
        if (totalVotosData > mesaSeleccionada.value.electores) {
          validationErrors.value = {
            general: 'La suma de votos no puede ser mayor al número de electores de la mesa'
          }
          return { success: false, error: 'La suma de votos excede el número de electores' }
        }
      }

      // Llamar al servicio API
      const telegramaActualizado = await telegramaService.update(id, data)

      // Actualizar en la lista local
      const index = telegramas.value.findIndex(t => t.id === id)
      if (index !== -1) {
        telegramas.value[index] = telegramaActualizado
      }

      return { success: true, data: telegramaActualizado }
    } catch (err) {
      error.value = err.message || 'Error al actualizar telegrama'

      // Manejar errores 422 de validación del backend
      if (err.errors && typeof err.errors === 'object') {
        validationErrors.value = err.errors
      }

      return { success: false, error: err }
    } finally {
      saving.value = false
    }
  }

  async function eliminarTelegrama(id) {
    loading.value = true
    error.value = null

    try {
      const telegramaEliminado = await telegramaService.delete(id)

      // Remover de la lista local
      const index = telegramas.value.findIndex(t => t.id === id)
      if (index !== -1) {
        telegramas.value.splice(index, 1)
      }

      return { success: true, data: telegramaEliminado }
    } catch (err) {
      error.value = err.message || 'Error al eliminar telegrama'
      return { success: false, error: err }
    } finally {
      loading.value = false
    }
  }

  function limpiarFormulario() {
    telegramaActual.value = null
    mesaSeleccionada.value = null
    error.value = null
    validationErrors.value = {}
  }

  // Helper function para calcular total de votos
  function calcularTotalVotos(data) {
    let total = 0

    // Sumar votos de diputados y senadores
    if (data.votos && Array.isArray(data.votos)) {
      data.votos.forEach(voto => {
        total += parseInt(voto.votos_diputados || 0, 10)
        total += parseInt(voto.votos_senadores || 0, 10)
      })
    }

    // Sumar votos en blanco
    total += parseInt(data.blancos || 0, 10)

    // Sumar votos nulos
    total += parseInt(data.nulos || 0, 10)

    // Sumar votos recurridos
    total += parseInt(data.recurridos || 0, 10)

    return total
  }

  return {
    // State
    telegramas,
    telegramaActual,
    mesaSeleccionada,
    loading,
    saving,
    error,
    validationErrors,

    // Getters
    telegramasPorMesa,
    totalVotos,

    // Actions
    fetchTelegramas,
    guardarTelegrama,
    actualizarTelegrama,
    eliminarTelegrama,
    limpiarFormulario
  }
})
