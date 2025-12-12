<template>
  <div class="min-h-screen flex flex-col">
    <!-- AppHeader -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Breadcrumb/Back Button and Page Title -->
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

          <h1 class="text-3xl font-bold text-gray-900">Carga de Telegrama</h1>
        </div>

        <!-- Step Flow with Transitions -->
        <Transition name="step" mode="out-in">
          <!-- Step 1: MesaSelector -->
          <div v-if="!mesaSeleccionada" key="step1">
            <MesaSelector
              :initial-provincia-id="ultimaProvincia"
              @update:modelValue="onMesaSelected"
            />
          </div>

          <!-- Step 2: TelegramaForm + Gráficos -->
          <div v-else key="step2">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Formulario -->
              <div class="lg:col-span-2">
                <TelegramaForm
                  :mesa="mesaSeleccionada"
                  @submit="onTelegramaGuardado"
                  @cancel="cancelar"
                />
              </div>

              <!-- Panel de Gráficos en Tiempo Real -->
              <div class="lg:col-span-1">
                <AppCard title="Vista Previa en Tiempo Real">
                  <div class="space-y-6">
                    <!-- Gráfico de Barras: Votos por Lista -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-3">Votos por Lista</h4>
                      <div class="h-64">
                        <GraficoBarras
                          :labels="labelsGrafico"
                          :datasets="datasetsGrafico"
                          :height="240"
                          :horizontal="true"
                        />
                      </div>
                    </div>

                    <!-- Gráfico Circular: Participación -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-3">Participación Electoral</h4>
                      <div class="h-48">
                        <GraficoTorta
                          :labels="labelsTorta"
                          :data="dataTorta"
                          :height="180"
                        />
                      </div>
                    </div>

                    <!-- Resumen Numérico -->
                    <div class="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Total Votos:</span>
                        <span class="font-semibold">{{ formatNumero(totalVotosPreview) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Electores:</span>
                        <span class="font-semibold">{{ formatNumero(mesaSeleccionada.electores) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Participación:</span>
                        <span class="font-semibold">{{ participacionPreview }}%</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Abstenciones:</span>
                        <span class="font-semibold">{{ formatNumero(abstencionesPreview) }}</span>
                      </div>
                    </div>
                  </div>
                </AppCard>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </main>

    <!-- AppFooter -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MesaSelector from '@/components/forms/MesaSelector.vue'
import TelegramaForm from '@/components/forms/TelegramaForm.vue'
import AppCard from '@/components/common/AppCard.vue'
import GraficoBarras from '@/components/charts/GraficoBarras.vue'
import GraficoTorta from '@/components/charts/GraficoTorta.vue'
import { formatNumero } from '@/utils/formatters'

// Router
const router = useRouter()

// State
const mesaSeleccionada = ref(null)
const ultimaProvincia = ref(null)

// Datos para gráficos en tiempo real
const datosGrafico = ref({
  votosPorLista: {},
  blancos: 0,
  nulos: 0,
  recurridos: 0
})

onMounted(() => {
  const provinciaGuardada = sessionStorage.getItem('ultimaProvincia')
  if (provinciaGuardada) {
    ultimaProvincia.value = parseInt(provinciaGuardada, 10)
  }
})

// Navegación
const navigateToDashboard = () => {
  router.push('/')
}

// Manejar selección de mesa
const onMesaSelected = (mesa) => {
  mesaSeleccionada.value = mesa

  // Persistir provincia seleccionada
  if (mesa?.provincia_id) {
    sessionStorage.setItem('ultimaProvincia', mesa.provincia_id.toString())
  }
}

// Exponer función para el formulario
defineExpose({
  actualizarGrafico
})

// Cancelar y volver al paso 1
const cancelar = () => {
  mesaSeleccionada.value = null
}

// Computed para gráficos
const labelsGrafico = computed(() => {
  return Object.keys(datosGrafico.value.votosPorLista)
})

const datasetsGrafico = computed(() => {
  const votos = Object.values(datosGrafico.value.votosPorLista)
  return [{
    label: 'Votos',
    data: votos,
    backgroundColor: '#3B82F6'
  }]
})

const labelsTorta = computed(() => {
  return ['Votos por Lista', 'Blancos', 'Nulos', 'Recurridos']
})

const dataTorta = computed(() => {
  const totalVotosLista = Object.values(datosGrafico.value.votosPorLista)
    .reduce((sum, val) => sum + val, 0)

  return [
    totalVotosLista,
    datosGrafico.value.blancos,
    datosGrafico.value.nulos,
    datosGrafico.value.recurridos
  ]
})

const totalVotosPreview = computed(() => {
  const totalVotosLista = Object.values(datosGrafico.value.votosPorLista)
    .reduce((sum, val) => sum + val, 0)

  return totalVotosLista +
    datosGrafico.value.blancos +
    datosGrafico.value.nulos +
    datosGrafico.value.recurridos
})

const participacionPreview = computed(() => {
  if (!mesaSeleccionada.value || !mesaSeleccionada.value.electores) {
    return 0
  }
  return ((totalVotosPreview.value / mesaSeleccionada.value.electores) * 100).toFixed(1)
})

const abstencionesPreview = computed(() => {
  if (!mesaSeleccionada.value) return 0
  return mesaSeleccionada.value.electores - totalVotosPreview.value
})

// Escuchar eventos del formulario para actualizar gráficos
const onTelegramaGuardado = (data) => {
  // Resetear para cargar siguiente telegrama
  mesaSeleccionada.value = null

  // Limpiar datos del gráfico
  datosGrafico.value = {
    votosPorLista: {},
    blancos: 0,
    nulos: 0,
    recurridos: 0
  }
}

// Función para actualizar datos del gráfico (llamada desde el formulario)
const actualizarGrafico = (votosPorLista, blancos, nulos, recurridos) => {
  datosGrafico.value = {
    votosPorLista: { ...votosPorLista },
    blancos,
    nulos,
    recurridos
  }
}
</script>

<style scoped>
/* Transiciones entre pasos */
.step-enter-active,
.step-leave-active {
  transition: all 0.3s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.step-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
