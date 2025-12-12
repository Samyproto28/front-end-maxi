<template>
  <div class="min-h-screen flex flex-col">
    <!-- AppHeader -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Back Button and Page Title -->
        <div class="mb-6">
          <button
            @click="navigateToDashboard"
            class="inline-flex items-center text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </button>

          <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold text-gray-900">Resultados Provinciales</h1>

            <!-- Export Button -->
            <AppButton
              v-if="hasData"
              variant="secondary"
              :loading="exporting"
              @click="handleExport"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </template>
              Exportar CSV
            </AppButton>
          </div>
        </div>

        <!-- Filters Section -->
        <AppCard class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Provincia Filter -->
            <AppSelect
              v-model="selectedProvincia"
              :options="provinciaOptions"
              label="Provincia"
              placeholder="Seleccionar provincia..."
              searchable
            />

            <!-- Cargo Filter -->
            <AppSelect
              v-model="selectedCargo"
              :options="cargoOptions"
              label="Cargo"
              placeholder="Seleccionar cargo..."
            />
          </div>
        </AppCard>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <AppSpinner size="lg" />
        </div>

        <!-- Error State -->
        <AppCard v-else-if="error" class="mb-6">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Error al cargar resultados</h3>
            <p class="mt-2 text-sm text-gray-500">{{ error.message }}</p>
            <AppButton variant="primary" class="mt-4" @click="loadData">
              Reintentar
            </AppButton>
          </div>
        </AppCard>

        <!-- No Data State -->
        <AppCard v-else-if="!hasData && selectedProvincia" class="mb-6">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Sin resultados</h3>
            <p class="mt-2 text-sm text-gray-500">No hay datos disponibles para los filtros seleccionados.</p>
          </div>
        </AppCard>

        <!-- Select Provincia Message -->
        <AppCard v-else-if="!selectedProvincia" class="mb-6">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Seleccione una provincia</h3>
            <p class="mt-2 text-sm text-gray-500">Elija una provincia del filtro superior para ver los resultados.</p>
          </div>
        </AppCard>

        <!-- Results Content -->
        <template v-else>
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Mesas Escrutadas -->
            <AppCard>
              <div class="text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide">Mesas Escrutadas</div>
                <div class="text-3xl font-bold text-primary mt-2">
                  {{ formatPorcentaje(resumen.mesasEscrutadasPorcentaje) }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ formatNumero(resumen.mesasEscrutadas) }} / {{ formatNumero(resumen.mesasTotales) }}
                </div>
              </div>
            </AppCard>

            <!-- Participación -->
            <AppCard>
              <div class="text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide">Participación</div>
                <div class="text-3xl font-bold text-green-600 mt-2">
                  {{ formatPorcentaje(resumen.participacionPorcentaje) }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ formatNumero(resumen.votosEmitidos) }} votos emitidos
                </div>
              </div>
            </AppCard>

            <!-- Votos Válidos -->
            <AppCard>
              <div class="text-center">
                <div class="text-xs text-gray-500 uppercase tracking-wide">Votos Válidos</div>
                <div class="text-3xl font-bold text-blue-600 mt-2">
                  {{ formatNumero(resumen.votosValidos) }}
                </div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ formatPorcentaje(resumen.votosValidosPorcentaje) }} del total
                </div>
              </div>
            </AppCard>
          </div>

          <!-- Results Table -->
          <AppCard title="Resultados por Lista">
            <ResultadosListaTable
              :listas="listas"
              :cargo="selectedCargo"
              :totales="totales"
              @sort="handleSort"
            />
          </AppCard>
        </template>
      </div>
    </main>

    <!-- AppFooter -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import ResultadosListaTable from '@/components/tables/ResultadosListaTable.vue'

// Stores
import { useResultadoStore } from '@/stores/resultadoStore'
import { useProvinciaStore } from '@/stores/provinciaStore'

// Utils
import { formatNumero, formatPorcentaje } from '@/utils/formatters'
import { CARGOS } from '@/utils/constants'

// Services
import importExportService from '@/services/importExportService'

// Router
const router = useRouter()

// Stores
const resultadoStore = useResultadoStore()
const provinciaStore = useProvinciaStore()

// Store refs
const { resultadoProvincial, loading, error } = storeToRefs(resultadoStore)
const { provinciasOrdenadas } = storeToRefs(provinciaStore)

// Local state
const selectedProvincia = ref(null)
const selectedCargo = ref(CARGOS.DIPUTADOS)
const exporting = ref(false)

// Computed: Provincia options for select
const provinciaOptions = computed(() => {
  return provinciasOrdenadas.value.map(p => ({
    value: p.id,
    label: p.nombre
  }))
})

// Computed: Cargo options for select
const cargoOptions = computed(() => {
  return Object.entries(CARGOS).map(([key, value]) => ({
    value: value,
    label: key.charAt(0) + key.slice(1).toLowerCase()
  }))
})

// Computed: Has data
const hasData = computed(() => {
  return resultadoProvincial.value && resultadoProvincial.value.listas?.length > 0
})

// Computed: Listas from results
const listas = computed(() => {
  return resultadoProvincial.value?.listas || []
})

// Computed: Totales for footer
const totales = computed(() => {
  const data = resultadoProvincial.value
  if (!data) return {}

  return {
    blancos: {
      votos: data.votos_blancos || 0,
      porcentaje: data.votos_blancos_porcentaje || 0
    },
    nulos: {
      votos: data.votos_nulos || 0,
      porcentaje: data.votos_nulos_porcentaje || 0
    },
    recurridos: {
      votos: data.votos_recurridos || 0,
      porcentaje: data.votos_recurridos_porcentaje || 0
    }
  }
})

// Computed: Resumen statistics
const resumen = computed(() => {
  const data = resultadoProvincial.value
  if (!data) {
    return {
      mesasEscrutadas: 0,
      mesasTotales: 0,
      mesasEscrutadasPorcentaje: 0,
      participacionPorcentaje: 0,
      votosEmitidos: 0,
      votosValidos: 0,
      votosValidosPorcentaje: 0
    }
  }

  const mesasEscrutadas = data.mesas_escrutadas || 0
  const mesasTotales = data.mesas_totales || 0
  const votosEmitidos = data.votos_emitidos || 0
  const electores = data.electores || 0
  const votosValidos = data.votos_validos || 0

  return {
    mesasEscrutadas,
    mesasTotales,
    mesasEscrutadasPorcentaje: mesasTotales > 0 ? (mesasEscrutadas / mesasTotales) * 100 : 0,
    participacionPorcentaje: electores > 0 ? (votosEmitidos / electores) * 100 : 0,
    votosEmitidos,
    votosValidos,
    votosValidosPorcentaje: votosEmitidos > 0 ? (votosValidos / votosEmitidos) * 100 : 0
  }
})

// Methods
const navigateToDashboard = () => {
  router.push('/')
}

const loadData = async () => {
  if (!selectedProvincia.value) return

  try {
    await resultadoStore.fetchResultadoProvincial(selectedProvincia.value)
  } catch (e) {
    console.error('Error loading provincial results:', e)
  }
}

const handleSort = (key, order) => {
  // Sort is handled internally by ResultadosListaTable
  console.log('Sort:', key, order)
}

const handleExport = async () => {
  if (!selectedProvincia.value || !hasData.value) return

  exporting.value = true
  try {
    const provincia = provinciasOrdenadas.value.find(p => p.id === selectedProvincia.value)
    const provinciaName = provincia?.nombre?.toLowerCase().replace(/\s+/g, '-') || selectedProvincia.value
    const filename = `resultados-provincial-${provinciaName}-${selectedCargo.value.toLowerCase()}.csv`

    await importExportService.exportProvincialAndDownload(
      selectedProvincia.value,
      filename,
      { cargo: selectedCargo.value }
    )
  } catch (e) {
    console.error('Error exporting results:', e)
  } finally {
    exporting.value = false
  }
}

// Watchers: Reload data when filters change
watch(selectedProvincia, async (newValue) => {
  if (newValue) {
    await loadData()
  }
})

watch(selectedCargo, async (newValue) => {
  if (newValue && selectedProvincia.value) {
    await resultadoStore.setCargo(newValue)
  }
})

// Lifecycle
onMounted(async () => {
  // Load provincias if not loaded
  if (provinciaStore.provincias.length === 0) {
    await provinciaStore.fetchProvincias()
  }
})
</script>
