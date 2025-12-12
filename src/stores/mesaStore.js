import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import mesaService from '../services/mesaService'

/**
 * Store para gestión de mesas de votación con filtrado por provincia
 * Utiliza el patrón Setup Store con Composition API
 */
export const useMesaStore = defineStore('mesa', () => {
  // Estado
  const mesas = ref([])
  const mesaSeleccionada = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const cache = ref(new Map())

  // Getters
  const mesasPorProvincia = computed(() => (provinciaId) => {
    // Primero buscar en cache, luego en mesas.value
    if (cache.value.has(provinciaId)) {
      return cache.value.get(provinciaId)
    }
    return mesas.value.filter(mesa => mesa.provincia_id === provinciaId)
  })

  const mesaById = computed(() => (id) => {
    return mesas.value.find(mesa => mesa.id === id)
  })

  // Actions
  async function fetchMesas(params = {}) {
    loading.value = true
    error.value = null
    try {
      const data = await mesaService.getAll(params)
      mesas.value = data
      return data
    } catch (e) {
      error.value = 'Error al cargar las mesas'
      console.error('Error fetching mesas:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchMesasPorProvincia(provinciaId) {
    // Verificar si ya existe en cache
    if (cache.value.has(provinciaId)) {
      return cache.value.get(provinciaId)
    }

    loading.value = true
    error.value = null
    try {
      const data = await mesaService.getByProvincia(provinciaId)
      // Guardar en cache con provinciaId como key
      cache.value.set(provinciaId, data)
      return data
    } catch (e) {
      error.value = `Error al cargar mesas de la provincia ${provinciaId}`
      console.error('Error fetching mesas by provincia:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  function setMesaSeleccionada(mesa) {
    mesaSeleccionada.value = mesa
  }

  // Debounce timer para búsqueda
  let searchTimeout = null

  function buscarMesa(query) {
    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    return new Promise((resolve) => {
      // Aplicar debounce de 300ms
      searchTimeout = setTimeout(() => {
        const queryLower = query.toLowerCase().trim()

        if (!queryLower) {
          resolve(mesas.value)
          return
        }

        const resultados = mesas.value.filter(mesa => {
          const numeroMesa = mesa.numero?.toString() || ''
          const direccion = mesa.direccion?.toLowerCase() || ''
          const escuela = mesa.escuela?.toLowerCase() || ''

          return numeroMesa.includes(queryLower) ||
                 direccion.includes(queryLower) ||
                 escuela.includes(queryLower)
        })

        resolve(resultados)
      }, 300)
    })
  }

  return {
    // Estado
    mesas,
    mesaSeleccionada,
    loading,
    error,
    cache,

    // Getters
    mesasPorProvincia,
    mesaById,

    // Actions
    fetchMesas,
    fetchMesasPorProvincia,
    setMesaSeleccionada,
    buscarMesa
  }
})
