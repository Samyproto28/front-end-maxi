import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import listaService from '@/services/listaService'

/**
 * Store para gestión de listas electorales - INTEGRADO CON API
 * Utiliza el patrón Setup Store con Composition API
 */
export const useListaStore = defineStore('lista', () => {
  // Estado
  const listas = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const listasActivas = computed(() => {
    return listas.value.filter(lista => lista.activa)
  })

  const listasPorCargo = computed(() => (cargo) => {
    return listas.value.filter(lista => lista.cargo === cargo)
  })

  const listasPorProvincia = computed(() => (provinciaId) => {
    return listas.value.filter(lista => lista.provincia_id === provinciaId)
  })

  const totalListas = computed(() => listas.value.length)

  // Acciones
  async function cargarListas() {
    loading.value = true
    error.value = null
    try {
      // ✅ INTEGRACIÓN CON API REAL
      const data = await listaService.getAll()
      listas.value = data
      console.log('✅ Listas cargadas:', data.length)
    } catch (e) {
      error.value = 'Error al cargar listas: ' + e.message
      console.error('Error:', e)
    } finally {
      loading.value = false
    }
  }

  async function cargarListasPorProvincia(provinciaId) {
    try {
      const data = await listaService.getByProvincia(provinciaId)
      console.log(`✅ Listas de provincia ${provinciaId} cargadas:`, data.length)
      return data
    } catch (e) {
      error.value = `Error al cargar listas de provincia ${provinciaId}: ${e.message}`
      console.error('Error:', e)
      return []
    }
  }

  async function cargarCandidatosDeLista(listaId) {
    try {
      const candidatos = await listaService.getCandidatos(listaId)
      console.log(`✅ Candidatos de lista ${listaId} cargados:`, candidatos.length)
      return candidatos
    } catch (e) {
      error.value = `Error al cargar candidatos de lista ${listaId}: ${e.message}`
      console.error('Error:', e)
      return []
    }
  }

  function agregarLista(lista) {
    const nuevaLista = {
      id: Date.now(),
      activa: true,
      ...lista
    }
    listas.value.push(nuevaLista)
    return nuevaLista
  }

  function actualizarLista(id, datosActualizados) {
    const index = listas.value.findIndex(l => l.id === id)
    if (index !== -1) {
      listas.value[index] = { ...listas.value[index], ...datosActualizados }
      return listas.value[index]
    }
    return null
  }

  function desactivarLista(id) {
    const lista = listas.value.find(l => l.id === id)
    if (lista) {
      lista.activa = false
      return lista
    }
    return null
  }

  function limpiarError() {
    error.value = null
  }

  return {
    // Estado
    listas,
    loading,
    error,

    // Getters
    listasActivas,
    listasPorCargo,
    listasPorProvincia,
    totalListas,

    // Acciones
    cargarListas,
    cargarListasPorProvincia,
    cargarCandidatosDeLista,
    agregarLista,
    actualizarLista,
    desactivarLista,
    limpiarError
  }
})
