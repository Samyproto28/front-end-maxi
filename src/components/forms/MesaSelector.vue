<template>
  <div class="w-full space-y-4">
    <!-- Filtros -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Selector de Provincia -->
      <div class="flex-1">
        <AppSelect
          v-model="provinciaSeleccionada"
          :options="provinciaOptions"
          label="Provincia"
          placeholder="Seleccionar provincia..."
          @update:modelValue="onProvinciaChange"
        />
      </div>

      <!-- Búsqueda por ID -->
      <div class="flex-1">
        <AppInput
          v-model="terminoBusqueda"
          type="text"
          label="Buscar por ID"
          placeholder="Ingrese ID de mesa..."
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <AppSpinner size="md" color="primary" />
      <span class="ml-2 text-gray-600">Cargando mesas...</span>
    </div>

    <!-- Lista de Resultados -->
    <div v-else-if="filteredMesas.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-700">
        Mesas encontradas ({{ filteredMesas.length }}{{ filteredMesas.length >= 10 ? '+' : '' }})
      </h4>

      <TransitionGroup
        name="mesa-list"
        tag="ul"
        class="space-y-2"
      >
        <li
          v-for="mesa in filteredMesas"
          :key="mesa.id"
          @click="seleccionarMesa(mesa)"
          class="p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="[
            isMesaSeleccionada(mesa)
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h5 class="text-lg font-semibold text-gray-900">
                  Mesa #{{ mesa.numero }}
                </h5>
                <AppBadge
                  :variant="mesa.telegramaCargado ? 'success' : 'warning'"
                  :text="mesa.telegramaCargado ? 'Cargada' : 'Pendiente'"
                />
              </div>

              <div class="text-sm text-gray-600 space-y-1">
                <p v-if="mesa.escuela" class="flex items-center">
                  <span class="font-medium">Escuela:</span>
                  <span class="ml-1">{{ mesa.escuela }}</span>
                </p>
                <p v-if="mesa.direccion" class="flex items-center">
                  <span class="font-medium">Dirección:</span>
                  <span class="ml-1">{{ mesa.direccion }}</span>
                </p>
                <p v-if="mesa.circuito" class="flex items-center">
                  <span class="font-medium">Circuito:</span>
                  <span class="ml-1">{{ mesa.circuito }}</span>
                </p>
                <p class="flex items-center">
                  <span class="font-medium">Electores habilitados:</span>
                  <span class="ml-1 font-mono">{{ mesa.electores || 0 }}</span>
                </p>
              </div>
            </div>

            <div v-if="isMesaSeleccionada(mesa)" class="ml-4 text-primary">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-else-if="provinciaSeleccionada && !isLoading" class="text-center py-8">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p class="text-gray-600">No se encontraron mesas</p>
      <p class="text-sm text-gray-500 mt-1">
        Intente con otros filtros o seleccione una provincia diferente
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMesaStore } from '@/stores/mesaStore'
import { useProvinciaStore } from '@/stores/provinciaStore'
import AppSelect from '@/components/common/AppSelect.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

/**
 * Props
 */
const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  initialProvinciaId: {
    type: Number,
    default: null
  }
})

/**
 * Emits
 */
const emit = defineEmits(['update:modelValue'])

// Stores
const mesaStore = useMesaStore()
const provinciaStore = useProvinciaStore()

// Estado reactivo
const provinciaSeleccionada = ref(null)
const terminoBusqueda = ref('')
const debounceTimeout = ref(null)

// Loading state from store
const isLoading = computed(() => mesaStore.loading)

// Opciones de provincias para el select
const provinciaOptions = computed(() => {
  return provinciaStore.provinciasOrdenadas.map(provincia => ({
    value: provincia.id,
    label: provincia.nombre
  }))
})

// Mesas filtradas
const mesasDisponibles = computed(() => {
  if (!provinciaSeleccionada.value) return []

  const mesas = mesaStore.mesasPorProvincia(provinciaSeleccionada.value)

  // Filtrar por término de búsqueda si existe
  const termino = terminoBusqueda.value.trim().toLowerCase()

  if (!termino) return mesas.slice(0, 10)

  return mesas
    .filter(mesa => {
      const numeroMesa = mesa.numero?.toString() || ''
      return numeroMesa.includes(termino)
    })
    .slice(0, 10)
})

/**
 * Aplicar debounce a la búsqueda
 */
const aplicarDebounce = () => {
  // Limpiar timeout anterior
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  // Aplicar nuevo timeout
  debounceTimeout.value = setTimeout(() => {
    // El computed se recalculará automáticamente
  }, 400)
}

/**
 * Filtrar mesas combinando provincia y búsqueda
 */
const filteredMesas = computed(() => {
  // Si no hay provincia seleccionada, no mostrar nada
  if (!provinciaSeleccionada.value) return []

  // Filtrar mesas por provincia
  let mesas = mesaStore.mesasPorProvincia(provinciaSeleccionada.value)

  // Aplicar filtro de búsqueda
  const termino = terminoBusqueda.value.trim().toLowerCase()

  if (termino) {
    mesas = mesas.filter(mesa => {
      const numeroMesa = mesa.numero?.toString() || ''
      return numeroMesa.includes(termino)
    })
  }

  // Limitar a 10 resultados
  return mesas.slice(0, 10)
})

/**
 * Manejar cambio de provincia
 */
const onProvinciaChange = async (provinciaId) => {
  if (!provinciaId) {
    provinciaSeleccionada.value = null
    terminoBusqueda.value = ''
    return
  }

  provinciaSeleccionada.value = provinciaId
  terminoBusqueda.value = ''

  try {
    await mesaStore.fetchMesasPorProvincia(provinciaId)
  } catch (error) {
    console.error('Error al cargar mesas:', error)
  }
}

/**
 * Seleccionar una mesa
 */
const seleccionarMesa = (mesa) => {
  emit('update:modelValue', mesa)
}

/**
 * Verificar si una mesa está seleccionada
 */
const isMesaSeleccionada = (mesa) => {
  return props.modelValue && props.modelValue.id === mesa.id
}

/**
 * Watchers
 */

// Aplicar debounce al término de búsqueda
watch(terminoBusqueda, () => {
  aplicarDebounce()
})

// Cargar provincias al montar el componente
onMounted(async () => {
  if (provinciaStore.provincias.length === 0) {
    await provinciaStore.fetchProvincias().catch(error => {
      console.error('Error al cargar provincias:', error)
    })
  }

  // Establecer provincia inicial si se proporciona
  if (props.initialProvinciaId) {
    provinciaSeleccionada.value = props.initialProvinciaId
    // Cargar mesas de la provincia inicial
    try {
      await mesaStore.fetchMesasPorProvincia(props.initialProvinciaId)
    } catch (error) {
      console.error('Error al cargar mesas:', error)
    }
  }
})
</script>

<style scoped>
.mesa-list-enter-active,
.mesa-list-leave-active {
  transition: all 0.3s ease;
}

.mesa-list-enter-from,
.mesa-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mesa-list-move {
  transition: transform 0.3s ease;
}
</style>
