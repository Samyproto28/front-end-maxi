import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import resultadoService from '../services/resultadoService'

/**
 * Store para consulta de resultados provinciales y nacionales
 * Utiliza el patrón Setup Store con Composition API
 * Implementa sistema de caché de 30 segundos y auto-refresh opcional
 */
export const useResultadoStore = defineStore('resultado', () => {
  // ============================================
  // STATE
  // ============================================
  const resultadoProvincial = ref(null)
  const resultadoNacional = ref(null)
  const cargoSeleccionado = ref('DIPUTADOS')
  const loading = ref(false)
  const error = ref(null)

  // Tracking para auto-refresh
  const autoRefreshInterval = ref(null)
  const currentProvinciaId = ref(null)

  // ============================================
  // CACHE SYSTEM (30 segundos)
  // ============================================
  const CACHE_DURATION = 30000 // 30 segundos en milisegundos
  const cacheProvincial = new Map() // key: `${provinciaId}-${cargo}`, value: { data, timestamp }
  const cacheNacional = new Map() // key: cargo, value: { data, timestamp }

  /**
   * Verifica si el cache es válido
   * @param {number} timestamp - Timestamp del cache
   * @returns {boolean} true si el cache es válido
   */
  function isCacheValid(timestamp) {
    return Date.now() - timestamp < CACHE_DURATION
  }

  /**
   * Genera la clave de cache para resultado provincial
   * @param {number} provinciaId
   * @param {string} cargo
   * @returns {string}
   */
  function getCacheKeyProvincial(provinciaId, cargo) {
    return `${provinciaId}-${cargo}`
  }

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Listas ordenadas por votos descendentes
   * Prioriza resultadoProvincial si existe, sino usa resultadoNacional
   */
  const listasMasVotadas = computed(() => {
    const resultado = resultadoProvincial.value || resultadoNacional.value
    if (!resultado?.listas) return []
    return [...resultado.listas].sort((a, b) => b.votos - a.votos)
  })

  /**
   * Porcentaje de participación: (votos_emitidos / electores) * 100
   * Retorna con 2 decimales
   */
  const participacionPorcentaje = computed(() => {
    const resultado = resultadoProvincial.value || resultadoNacional.value
    if (!resultado?.votos_emitidos || !resultado?.electores) return 0
    return ((resultado.votos_emitidos / resultado.electores) * 100).toFixed(2)
  })

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Obtiene resultados provinciales
   * Usa cache si está disponible y válido
   * @param {number} provinciaId - ID de la provincia
   */
  async function fetchResultadoProvincial(provinciaId) {
    const cacheKey = getCacheKeyProvincial(provinciaId, cargoSeleccionado.value)
    const cached = cacheProvincial.get(cacheKey)

    // Retornar cache si es válido
    if (cached && isCacheValid(cached.timestamp)) {
      resultadoProvincial.value = cached.data
      currentProvinciaId.value = provinciaId
      return cached.data
    }

    loading.value = true
    error.value = null

    try {
      const data = await resultadoService.getProvincial(provinciaId, {
        cargo: cargoSeleccionado.value
      })

      resultadoProvincial.value = data
      currentProvinciaId.value = provinciaId

      // Guardar en cache
      cacheProvincial.set(cacheKey, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (e) {
      error.value = {
        message: 'Error al cargar resultados provinciales',
        details: e.response?.data?.message || e.message
      }
      console.error('Error fetchResultadoProvincial:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene resultados nacionales
   * Usa cache si está disponible y válido
   */
  async function fetchResultadoNacional() {
    const cacheKey = cargoSeleccionado.value
    const cached = cacheNacional.get(cacheKey)

    // Retornar cache si es válido
    if (cached && isCacheValid(cached.timestamp)) {
      resultadoNacional.value = cached.data
      return cached.data
    }

    loading.value = true
    error.value = null

    try {
      const data = await resultadoService.getNacional({
        cargo: cargoSeleccionado.value
      })

      resultadoNacional.value = data

      // Guardar en cache
      cacheNacional.set(cacheKey, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (e) {
      error.value = {
        message: 'Error al cargar resultados nacionales',
        details: e.response?.data?.message || e.message
      }
      console.error('Error fetchResultadoNacional:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Cambia el cargo seleccionado y recarga los datos
   * @param {string} cargo - Nuevo cargo (DIPUTADOS, SENADORES, etc.)
   */
  async function setCargo(cargo) {
    cargoSeleccionado.value = cargo

    // Limpiar caches para forzar recarga con nuevo cargo
    cacheProvincial.clear()
    cacheNacional.clear()

    // Re-fetch datos actuales
    const promises = []

    if (currentProvinciaId.value) {
      promises.push(fetchResultadoProvincial(currentProvinciaId.value))
    }

    if (resultadoNacional.value) {
      promises.push(fetchResultadoNacional())
    }

    if (promises.length > 0) {
      await Promise.all(promises)
    }
  }

  /**
   * Limpia los caches y recarga todos los datos actuales
   */
  async function refresh() {
    // Limpiar caches
    cacheProvincial.clear()
    cacheNacional.clear()

    // Re-fetch datos
    const promises = []

    if (currentProvinciaId.value) {
      promises.push(fetchResultadoProvincial(currentProvinciaId.value))
    }

    if (resultadoNacional.value !== null) {
      promises.push(fetchResultadoNacional())
    }

    if (promises.length > 0) {
      await Promise.all(promises)
    }
  }

  /**
   * Inicia auto-refresh para dashboard en vivo
   * @param {number} segundos - Intervalo de actualización en segundos
   */
  function startAutoRefresh(segundos = 30) {
    // Detener cualquier auto-refresh existente
    stopAutoRefresh()

    autoRefreshInterval.value = setInterval(async () => {
      try {
        await refresh()
      } catch (e) {
        console.error('Error en auto-refresh:', e)
      }
    }, segundos * 1000)
  }

  /**
   * Detiene el auto-refresh
   */
  function stopAutoRefresh() {
    if (autoRefreshInterval.value) {
      clearInterval(autoRefreshInterval.value)
      autoRefreshInterval.value = null
    }
  }

  /**
   * Limpia el estado del store
   */
  function clearState() {
    resultadoProvincial.value = null
    resultadoNacional.value = null
    currentProvinciaId.value = null
    error.value = null
    cacheProvincial.clear()
    cacheNacional.clear()
    stopAutoRefresh()
  }

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    resultadoProvincial,
    resultadoNacional,
    cargoSeleccionado,
    loading,
    error,

    // Getters
    listasMasVotadas,
    participacionPorcentaje,

    // Actions
    fetchResultadoProvincial,
    fetchResultadoNacional,
    setCargo,
    refresh,
    startAutoRefresh,
    stopAutoRefresh,
    clearState
  }
})
