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

          <!-- Step 2: TelegramaForm -->
          <div v-else key="step2">
            <TelegramaForm
              :mesa="mesaSeleccionada"
              @submit="onTelegramaGuardado"
              @cancel="cancelar"
            />
          </div>
        </Transition>
      </div>
    </main>

    <!-- AppFooter -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MesaSelector from '@/components/forms/MesaSelector.vue'
import TelegramaForm from '@/components/forms/TelegramaForm.vue'

// Router
const router = useRouter()

// State
const mesaSeleccionada = ref(null)

// Cargar última provincia del sessionStorage
const ultimaProvincia = ref(null)

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

// Manejar guardado exitoso del telegrama
const onTelegramaGuardado = (data) => {
  // Resetear para cargar siguiente telegrama
  mesaSeleccionada.value = null
}

// Cancelar y volver al paso 1
const cancelar = () => {
  mesaSeleccionada.value = null
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
