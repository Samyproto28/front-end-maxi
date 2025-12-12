<template>
  <div class="min-h-screen flex flex-col">
    <!-- AppHeader -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Page Title -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <!-- Section 1: Stats Cards -->
        <section class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              :icon="ClipboardDocumentCheckIcon"
              label="Mesas Cargadas"
              :value="mesasCargadas"
              variant="primary"
            />
            <StatsCard
              :icon="DocumentTextIcon"
              label="Telegramas Pendientes"
              :value="telegramasPendientes"
              variant="warning"
            />
            <StatsCard
              :icon="ChartBarIcon"
              label="Participación Nacional"
              :value="participacionNacional"
              subvalue="%"
              variant="success"
            />
          </div>
        </section>

        <!-- Section 2: Gráficos -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Visualización de Resultados</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top 5 Listas -->
            <AppCard title="Top 5 Listas - Ranking Nacional">
              <div class="h-80">
                <GraficoRanking
                  v-if="topListas.length > 0"
                  :listas="topListas"
                  :height="320"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  No hay datos disponibles
                </div>
              </div>
            </AppCard>

            <!-- Participación por Provincia -->
            <AppCard title="Participación por Provincia">
              <div class="h-80">
                <GraficoParticipacion
                  v-if="provinciasData.length > 0"
                  :provincias="provinciasData"
                  :height="320"
                />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  No hay datos disponibles
                </div>
              </div>
            </AppCard>
          </div>
        </section>

        <!-- Section 3: Quick Actions -->
        <section class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div class="flex flex-wrap gap-4">
            <AppButton
              variant="primary"
              size="lg"
              @click="navigateToCargarTelegrama"
            >
              Cargar Telegrama
            </AppButton>
            <AppButton
              variant="secondary"
              size="lg"
              @click="navigateToResultadosProvincial"
            >
              Resultados Provincial
            </AppButton>
            <AppButton
              variant="secondary"
              size="lg"
              @click="exportarReportes"
            >
              Exportar Reportes
            </AppButton>
          </div>
        </section>

        <!-- Section 3: Latest Telegramas Table -->
        <section>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Últimos Telegramas</h2>

          <!-- Loading State -->
          <div v-if="loading" class="mb-4">
            <AppSpinner />
          </div>

          <!-- Error State -->
          <AppAlert
            v-if="error"
            type="error"
            :message="error"
            class="mb-4"
          />

          <!-- Table -->
          <AppTable
            :columns="tableColumns"
            :data="ultimosTelegramas"
            :loading="loading"
            empty-message="No hay telegramas cargados aún"
          >
            <!-- Custom cell rendering for Mesa -->
            <template #cell-mesa="{ row }">
              <span class="font-medium">{{ row.mesa?.numero || '-' }}</span>
            </template>

            <!-- Custom cell rendering for Provincia -->
            <template #cell-provincia="{ row }">
              <span>{{ row.mesa?.provincia?.nombre || '-' }}</span>
            </template>

            <!-- Custom cell rendering for Cargo -->
            <template #cell-cargo="{ row }">
              <span>{{ row.cargo?.nombre || '-' }}</span>
            </template>

            <!-- Custom cell rendering for Usuario -->
            <template #cell-usuario="{ row }">
              <span>{{ row.usuario?.nombre || '-' }}</span>
            </template>

            <!-- Custom cell rendering for Hora -->
            <template #cell-hora="{ row }">
              <span>{{ formatearFecha(row.created_at) }}</span>
            </template>
          </AppTable>
        </section>
      </div>
    </main>

    <!-- AppFooter -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import StatsCard from '@/components/layout/StatsCard.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppTable from '@/components/common/AppTable.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppAlert from '@/components/common/AppAlert.vue'
import AppCard from '@/components/common/AppCard.vue'
import GraficoRanking from '@/components/charts/GraficoRanking.vue'
import GraficoParticipacion from '@/components/charts/GraficoParticipacion.vue'

// Stores
import { useResultadoStore } from '@/stores/resultadoStore'
import { useTelegramaStore } from '@/stores/telegramaStore'

// Icons (Heroicons v2)
import {
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

// Router
const router = useRouter()

// Stores
const resultadoStore = useResultadoStore()
const telegramaStore = useTelegramaStore()

// Refs for state
const loading = ref(false)
const error = ref(null)
const autoRefreshTimer = ref(null)

// Table columns configuration
const tableColumns = [
  { key: 'mesa', label: 'Mesa', sortable: true },
  { key: 'provincia', label: 'Provincia', sortable: true },
  { key: 'cargo', label: 'Cargo', sortable: true },
  { key: 'usuario', label: 'Usuario', sortable: true },
  { key: 'hora', label: 'Hora', sortable: true }
]

// Computed properties for stats
const mesasCargadas = computed(() => {
  // Count unique mesas from telegramas
  if (!telegramaStore.telegramas || telegramaStore.telegramas.length === 0) {
    return 0
  }
  const mesasUnicas = new Set(telegramaStore.telegramas.map(t => t.mesa_id))
  return mesasUnicas.size
})

const telegramasPendientes = computed(() => {
  // This could be enhanced to count actual pending telegramas
  // For now, we'll show total telegramas that need review
  return telegramaStore.telegramas ? telegramaStore.telegramas.length : 0
})

const participacionNacional = computed(() => {
  // Get from resultadoStore
  return resultadoStore.participacionPorcentaje || 0
})

// Top 5 listas para gráfico
const topListas = computed(() => {
  const listas = resultadoStore.listasMasVotadas || []
  return listas.slice(0, 5).map(lista => ({
    id: lista.id,
    nombre: lista.nombre,
    votos: lista.votos || 0,
    porcentaje: lista.porcentaje || 0,
    bancas: lista.bancas || 0
  }))
})

// Datos de provincias para gráfico
const provinciasData = computed(() => {
  // Placeholder data - en un caso real vendría del backend
  const resultadoNacional = resultadoStore.resultadoNacional
  if (resultadoNacional && resultadoNacional.provincias) {
    return resultadoNacional.provincias.map(p => ({
      nombre: p.nombre,
      participacion: p.participacion || 0,
      mesas_escrutadas: p.mesas_escrutadas || 0,
      mesas_totales: p.mesas_totales || 0
    }))
  }

  // Datos por defecto si no hay resultados
  return [
    { nombre: 'Buenos Aires', participacion: 75.5, mesas_escrutadas: 150, mesas_totales: 200 },
    { nombre: 'CABA', participacion: 78.2, mesas_escrutadas: 45, mesas_totales: 50 },
    { nombre: 'Córdoba', participacion: 76.8, mesas_escrutadas: 60, mesas_totales: 75 }
  ]
})

// Computed for latest telegramas (last 10, ordered by date desc)
const ultimosTelegramas = computed(() => {
  if (!telegramaStore.telegramas || telegramaStore.telegramas.length === 0) {
    return []
  }

  // Sort by created_at desc and limit to 10
  return [...telegramaStore.telegramas]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
})

// Methods
const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    // Fetch from both stores in parallel
    await Promise.allSettled([
      telegramaStore.fetchTelegramas?.(),
      resultadoStore.fetchResultadoNacional()
    ])
  } catch (e) {
    console.error('Error fetching data:', e)
    error.value = 'Error al cargar los datos del dashboard'
  } finally {
    loading.value = false
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'

  try {
    const date = new Date(fecha)
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return fecha
  }
}

// Navigation methods
const navigateToCargarTelegrama = () => {
  router.push('/cargar-telegrama')
}

const navigateToResultadosProvincial = () => {
  router.push('/resultados/provincial')
}

const exportarReportes = () => {
  // Placeholder functionality - could open a modal or navigate to export page
  alert('Funcionalidad de exportar reportes próximamente disponible')
}

// Auto-refresh functionality
const startAutoRefresh = () => {
  // Stop any existing timer
  stopAutoRefresh()

  // Start new timer for 30 seconds
  autoRefreshTimer.value = setInterval(() => {
    fetchData()
  }, 30000)
}

const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchData()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})

// Note: The fetchTelegramas method needs to be added to telegramaStore
// For now, we'll use the existing telegramas array
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
