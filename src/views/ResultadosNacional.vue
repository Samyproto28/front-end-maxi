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
            <h1 class="text-3xl font-bold text-gray-900">Resultados Nacionales</h1>

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
          <div class="max-w-md">
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
        <AppCard v-else-if="!hasData" class="mb-6">
          <div class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Sin resultados</h3>
            <p class="mt-2 text-sm text-gray-500">No hay datos disponibles para el cargo seleccionado.</p>
          </div>
        </AppCard>

        <!-- Results Content -->
        <template v-else>
          <!-- Gráficos -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <!-- Gráfico Ranking Nacional -->
            <AppCard title="Ranking Nacional de Listas">
              <div class="h-96">
                <GraficoRanking
                  v-if="rankingData.length > 0"
                  :listas="rankingData"
                  :height="380"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  No hay datos disponibles
                </div>
              </div>
            </AppCard>

            <!-- Gráfico Distribución Nacional -->
            <AppCard title="Distribución Nacional de Votos">
              <div class="h-96">
                <GraficoTorta
                  v-if="labelsTorta.length > 0"
                  :labels="labelsTorta"
                  :data="dataTorta"
                  :height="380"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  No hay datos disponibles
                </div>
              </div>
            </AppCard>
          </div>

          <!-- National Ranking Table -->
          <AppCard title="Ranking Nacional de Listas" class="mb-6">
            <AppTable
              :columns="rankingColumns"
              :data="rankingData"
              :sort-by="rankingSortBy"
              :sort-order="rankingSortOrder"
              @sort="handleRankingSort"
            >
              <!-- Position with medal emojis -->
              <template #cell-posicion="{ value }">
                <span class="text-2xl">{{ getPositionEmoji(value) }}</span>
              </template>

              <!-- Lista name -->
              <template #cell-lista="{ row }">
                <div>
                  <div class="font-medium">{{ row.nombre }}</div>
                  <div v-if="row.alianza" class="text-xs text-gray-500">{{ row.alianza }}</div>
                </div>
              </template>

              <!-- Votes formatted -->
              <template #cell-votos="{ value }">
                <span class="font-mono">{{ formatNumero(value) }}</span>
              </template>

              <!-- Percentage with progress bar -->
              <template #cell-porcentaje="{ value }">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                    <div
                      class="bg-primary h-2 rounded-full transition-all"
                      :style="{ width: `${Math.min(value, 100)}%` }"
                    />
                  </div>
                  <span class="text-sm font-mono w-16 text-right">
                    {{ formatPorcentaje(value) }}
                  </span>
                </div>
              </template>

              <!-- Provincias ganadas -->
              <template #cell-provinciasGanadas="{ value }">
                <span class="font-mono">{{ value }}</span>
              </template>
            </AppTable>
          </AppCard>

          <!-- Participation by Province Table -->
          <AppCard title="Participación por Provincia">
            <AppTable
              :columns="participacionColumns"
              :data="participacionData"
              :sort-by="participacionSortBy"
              :sort-order="participacionSortOrder"
              @sort="handleParticipacionSort"
            >
              <!-- Provincia name -->
              <template #cell-provincia="{ value }">
                <span class="font-medium">{{ value }}</span>
              </template>

              <!-- Mesas totales -->
              <template #cell-mesasTotales="{ value }">
                <span class="font-mono">{{ formatNumero(value) }}</span>
              </template>

              <!-- Escrutadas percentage with progress bar -->
              <template #cell-escrutadasPorcentaje="{ value }">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                    <div
                      class="bg-green-500 h-2 rounded-full transition-all"
                      :style="{ width: `${Math.min(value, 100)}%` }"
                    />
                  </div>
                  <span class="text-sm font-mono w-16 text-right">
                    {{ formatPorcentaje(value) }}
                  </span>
                </div>
              </template>

              <!-- Participación percentage -->
              <template #cell-participacionPorcentaje="{ value }">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                    <div
                      class="bg-blue-500 h-2 rounded-full transition-all"
                      :style="{ width: `${Math.min(value, 100)}%` }"
                    />
                  </div>
                  <span class="text-sm font-mono w-16 text-right">
                    {{ formatPorcentaje(value) }}
                  </span>
                </div>
              </template>
            </AppTable>
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
import AppTable from '@/components/common/AppTable.vue'
import GraficoRanking from '@/components/charts/GraficoRanking.vue'
import GraficoTorta from '@/components/charts/GraficoTorta.vue'

// Stores
import { useResultadoStore } from '@/stores/resultadoStore'

// Utils
import { formatNumero, formatPorcentaje } from '@/utils/formatters'
import { CARGOS } from '@/utils/constants'

// Services
import importExportService from '@/services/importExportService'

// Router
const router = useRouter()

// Store
const resultadoStore = useResultadoStore()
const { resultadoNacional, loading, error } = storeToRefs(resultadoStore)

// Local state
const selectedCargo = ref(CARGOS.DIPUTADOS)
const exporting = ref(false)

// Sort state for ranking table
const rankingSortBy = ref('votos')
const rankingSortOrder = ref('desc')

// Sort state for participation table
const participacionSortBy = ref('provincia')
const participacionSortOrder = ref('asc')

// Computed: Cargo options for select
const cargoOptions = computed(() => {
  return Object.entries(CARGOS).map(([key, value]) => ({
    value: value,
    label: key.charAt(0) + key.slice(1).toLowerCase()
  }))
})

// Computed: Has data
const hasData = computed(() => {
  return resultadoNacional.value && (
    resultadoNacional.value.listas?.length > 0 ||
    resultadoNacional.value.provincias?.length > 0
  )
})

// Ranking table columns
const rankingColumns = [
  { key: 'posicion', label: 'Posición', align: 'center' },
  { key: 'lista', label: 'Lista', align: 'left' },
  { key: 'votos', label: 'Votos Totales', align: 'right', sortable: true },
  { key: 'porcentaje', label: 'Porcentaje', align: 'right', sortable: true },
  { key: 'provinciasGanadas', label: 'Provincias Ganadas', align: 'center', sortable: true }
]

// Participation table columns
const participacionColumns = [
  { key: 'provincia', label: 'Provincia', align: 'left', sortable: true },
  { key: 'mesasTotales', label: 'Mesas Totales', align: 'right', sortable: true },
  { key: 'escrutadasPorcentaje', label: 'Escrutadas (%)', align: 'right', sortable: true },
  { key: 'participacionPorcentaje', label: 'Participación (%)', align: 'right', sortable: true }
]

// Computed: Ranking data
const rankingData = computed(() => {
  const listas = resultadoNacional.value?.listas || []

  // Sort by votos descending by default
  const sorted = [...listas].sort((a, b) => {
    const aValue = a[rankingSortBy.value] || 0
    const bValue = b[rankingSortBy.value] || 0

    if (rankingSortOrder.value === 'desc') {
      return bValue - aValue
    }
    return aValue - bValue
  })

  return sorted.map((lista, index) => ({
    posicion: index + 1,
    lista_id: lista.id,
    nombre: lista.nombre,
    alianza: lista.alianza,
    votos: lista.votos || 0,
    porcentaje: lista.porcentaje || 0,
    provinciasGanadas: lista.provincias_ganadas || 0
  }))
})

// Computed: Participation data
const participacionData = computed(() => {
  const provincias = resultadoNacional.value?.provincias || []

  const data = provincias.map(p => ({
    id: p.id,
    provincia: p.nombre,
    mesasTotales: p.mesas_totales || 0,
    mesasEscrutadas: p.mesas_escrutadas || 0,
    escrutadasPorcentaje: p.mesas_totales > 0
      ? (p.mesas_escrutadas / p.mesas_totales) * 100
      : 0,
    participacionPorcentaje: p.electores > 0
      ? (p.votos_emitidos / p.electores) * 100
      : 0
  }))

  // Sort
  return [...data].sort((a, b) => {
    const key = participacionSortBy.value
    const aValue = a[key]
    const bValue = b[key]

    if (typeof aValue === 'string') {
      if (participacionSortOrder.value === 'desc') {
        return bValue.localeCompare(aValue)
      }
      return aValue.localeCompare(bValue)
    }

    if (participacionSortOrder.value === 'desc') {
      return bValue - aValue
    }
    return aValue - bValue
  })
})

// Computed para gráfico de torta
const labelsTorta = computed(() => {
  return rankingData.value.map(r => r.nombre)
})

const dataTorta = computed(() => {
  return rankingData.value.map(r => r.votos)
})

// Methods
const navigateToDashboard = () => {
  router.push('/')
}

const loadData = async () => {
  try {
    await resultadoStore.fetchResultadoNacional()
  } catch (e) {
    console.error('Error loading national results:', e)
  }
}

const getPositionEmoji = (posicion) => {
  const emojiMap = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  }
  return emojiMap[posicion] || posicion.toString()
}

const handleRankingSort = ({ key, order }) => {
  rankingSortBy.value = key
  rankingSortOrder.value = order
}

const handleParticipacionSort = ({ key, order }) => {
  participacionSortBy.value = key
  participacionSortOrder.value = order
}

const handleExport = async () => {
  if (!hasData.value) return

  exporting.value = true
  try {
    const filename = `resultados-nacional-${selectedCargo.value.toLowerCase()}.csv`

    await importExportService.exportNacionalAndDownload(
      filename,
      { cargo: selectedCargo.value }
    )
  } catch (e) {
    console.error('Error exporting results:', e)
  } finally {
    exporting.value = false
  }
}

// Watch cargo changes
watch(selectedCargo, async (newValue) => {
  if (newValue) {
    await resultadoStore.setCargo(newValue)
  }
})

// Lifecycle
onMounted(async () => {
  await loadData()
})
</script>
