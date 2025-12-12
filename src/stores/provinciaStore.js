import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import provinciaService from '@/services/provinciaService'

/**
 * Store para gestión de provincias
 * Utiliza el patrón Setup Store con Composition API
 */
export const useProvinciaStore = defineStore('provincia', () => {
  // State
  const provincias = ref([])
  const provinciaActual = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const provinciaById = computed(() => (id) => {
    return provincias.value.find(p => p.id === id)
  })

  const provinciasOrdenadas = computed(() => {
    return [...provincias.value].sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  // Actions
  async function fetchProvincias() {
    try {
      loading.value = true
      error.value = null
      const data = await provinciaService.getAll()
      provincias.value = data
    } catch (err) {
      error.value = { message: err.message, code: err.code || 'UNKNOWN' }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProvincia(id) {
    try {
      loading.value = true
      error.value = null
      const data = await provinciaService.getById(id)
      provinciaActual.value = data
      return data
    } catch (err) {
      error.value = { message: err.message, code: err.code || 'UNKNOWN' }
      throw err
    } finally {
      loading.value = false
    }
  }

  function setProvinciaActual(provincia) {
    provinciaActual.value = provincia
  }

  return {
    // State
    provincias,
    provinciaActual,
    loading,
    error,

    // Getters
    provinciaById,
    provinciasOrdenadas,

    // Actions
    fetchProvincias,
    fetchProvincia,
    setProvinciaActual
  }
})
