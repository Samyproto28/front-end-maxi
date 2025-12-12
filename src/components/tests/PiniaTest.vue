<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-primary mb-4">Prueba de Pinia Stores</h2>

    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-lg mb-2">Provincia Store</h3>
        <p>Total provincias: {{ provinciaStore.totalProvincias }}</p>
        <p>Provincia seleccionada: {{ provinciaStore.provinciaSeleccionada?.nombre || 'Ninguna' }}</p>
        <button @click="seleccionarPrimeraProvincia" class="mt-2 px-3 py-1 bg-primary text-white rounded">
          Seleccionar Primera
        </button>
      </div>

      <div class="border-t pt-4">
        <h3 class="font-semibold text-lg mb-2">Mesa Store</h3>
        <p>Total mesas: {{ mesaStore.totalMesas }}</p>
        <p>Mesas abiertas: {{ mesaStore.mesasAbiertas.length }}</p>
        <p>Mesas cargadas: {{ mesaStore.mesasCargadas.length }}</p>
      </div>

      <div class="border-t pt-4">
        <h3 class="font-semibold text-lg mb-2">Telegrama Store</h3>
        <p>Total telegramas: {{ telegramaStore.totalTelegramas }}</p>
        <p>Validados: {{ telegramaStore.telegramasValidados.length }}</p>
        <p>Pendientes: {{ telegramaStore.telegramasPendientes.length }}</p>
        <p>Progreso: {{ telegramaStore.porcentajeCompletado }}%</p>
      </div>

      <div class="border-t pt-4">
        <h3 class="font-semibold text-lg mb-2">Resultado Store</h3>
        <p>Total votos: {{ resultadoStore.totalVotos }}</p>
        <p>Votos válidos: {{ resultadoStore.totalVotosValidos }}</p>
        <p>Votos blancos: {{ resultadoStore.totalVotosBlancos }}</p>
        <p>Votos nulos: {{ resultadoStore.totalVotosNulos }}</p>
      </div>
    </div>

    <div v-if="devtoolsVisible" class="mt-6 p-4 bg-gray-50 rounded">
      <h4 class="font-semibold mb-2">Estado de DevTools:</h4>
      <p class="text-sm text-green-600">✓ Pinia configurado correctamente</p>
      <p class="text-sm text-green-600">✓ Stores registrados</p>
      <p class="text-sm text-green-600">✓ Setup stores funcionando</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProvinciaStore } from '@/stores/provinciaStore'
import { useMesaStore } from '@/stores/mesaStore'
import { useTelegramaStore } from '@/stores/telegramaStore'
import { useListaStore } from '@/stores/listaStore'

const provinciaStore = useProvinciaStore()
const listaStore = useListaStore()
const mesaStore = useMesaStore()
const telegramaStore = useTelegramaStore()

const devtoolsVisible = ref(false)

function seleccionarPrimeraProvincia() {
  if (provinciaStore.provincias.length > 0) {
    provinciaStore.seleccionarProvincia(provinciaStore.provincias[0])
  }
}

async function cargarListasDePrimeraProvincia() {
  if (provinciaStore.provincias.length > 0) {
    const primeraProvincia = provinciaStore.provincias[0]
    await listaStore.cargarListasPorProvincia(primeraProvincia.id)
    console.log('✅ Listas cargadas:', listaStore.listas.length)
  }
}

onMounted(async () => {
  // Cargar datos de prueba
  try {
    await provinciaStore.cargarProvincias()
    await mesaStore.cargarMesas()
    await telegramaStore.cargarTelegramas()

    devtoolsVisible.value = true
    console.log('✅ Stores cargados correctamente')
  } catch (error) {
    console.error('❌ Error cargando stores:', error)
  }
})
</script>
