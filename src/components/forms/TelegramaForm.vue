<script setup>
/**
 * TelegramaForm Component
 *
 * Formulario completo de carga de telegrama electoral con validación en tiempo real.
 * Según wireframe 5.3.2
 *
 * @props mesa - Objeto de mesa seleccionada con número, electores, provincia_id
 */
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useTelegramaStore } from '@/stores/telegramaStore'
import { useListaStore } from '@/stores/listaStore'
import VotosInput from './VotosInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppCard from '@/components/common/AppCard.vue'
import { formatNumero } from '@/utils/formatters'

// Props
const props = defineProps({
  mesa: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
        typeof value.numero !== 'undefined' &&
        typeof value.electores !== 'undefined'
    }
  }
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Stores & Router
const telegramaStore = useTelegramaStore()
const listaStore = useListaStore()
const router = useRouter()

// State
const isSubmitting = ref(false)
const submitError = ref(null)
const submitSuccess = ref(false)

// Listas de la provincia
const listasProvinciales = ref([])

// Form data - votos por lista, organizados por lista_id
// Estructura: { [lista_id]: { diputados: 0, senadores: 0 } }
const votosPorLista = ref({})

// Otros votos
const blancos = ref(0)
const nulos = ref(0)
const recurridos = ref(0)

// Campo usuario (requerido)
const usuario = ref('')

// Cargar listas al montar
onMounted(async () => {
  if (props.mesa?.provincia_id) {
    listasProvinciales.value = await listaStore.cargarListasPorProvincia(props.mesa.provincia_id)

    // Inicializar estructura de votos para cada lista
    listasProvinciales.value.forEach(lista => {
      votosPorLista.value[lista.id] = {
        diputados: 0,
        senadores: 0
      }
    })
  }
})

// Computed: Total de votos
const totalVotos = computed(() => {
  let total = 0

  // Sumar votos por lista (diputados + senadores)
  Object.values(votosPorLista.value).forEach(votos => {
    total += parseInt(votos.diputados || 0, 10)
    total += parseInt(votos.senadores || 0, 10)
  })

  // Sumar otros votos
  total += parseInt(blancos.value || 0, 10)
  total += parseInt(nulos.value || 0, 10)
  total += parseInt(recurridos.value || 0, 10)

  return total
})

// Computed: Abstenciones (electores - votos)
const abstenciones = computed(() => {
  return props.mesa.electores - totalVotos.value
})

// Computed: Es válido (total <= electores y usuario no vacío)
const esValido = computed(() => {
  return totalVotos.value <= props.mesa.electores && usuario.value.trim().length > 0
})

// Computed: Exceso de votos (cuando no es válido)
const excesoVotos = computed(() => {
  if (esValido.value) return 0
  return totalVotos.value - props.mesa.electores
})

// Computed: Porcentaje de participación
const participacion = computed(() => {
  if (!props.mesa.electores || props.mesa.electores === 0) return 0
  return ((totalVotos.value / props.mesa.electores) * 100).toFixed(1)
})

// Métodos
const handleCancelar = () => {
  emit('cancel')
  router.back()
}

const handleSubmit = async () => {
  if (!esValido.value || isSubmitting.value) return

  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  try {
    // Construir objeto de datos del telegrama
    const telegramaData = {
      mesa_id: props.mesa.id,
      usuario: usuario.value.trim(),
      votos: Object.entries(votosPorLista.value).map(([listaId, votos]) => ({
        lista_id: parseInt(listaId, 10),
        votos_diputados: parseInt(votos.diputados || 0, 10),
        votos_senadores: parseInt(votos.senadores || 0, 10)
      })),
      blancos: parseInt(blancos.value || 0, 10),
      nulos: parseInt(nulos.value || 0, 10),
      recurridos: parseInt(recurridos.value || 0, 10)
    }

    // Llamar al store para guardar
    const resultado = await telegramaStore.guardarTelegrama(telegramaData)

    if (resultado.success) {
      submitSuccess.value = true
      emit('submit', resultado.data)

      // Limpiar formulario después de éxito
      resetForm()
    } else {
      submitError.value = resultado.error?.message || 'Error al guardar el telegrama'
    }
  } catch (error) {
    submitError.value = error.message || 'Error inesperado al guardar'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // Resetear votos por lista
  Object.keys(votosPorLista.value).forEach(listaId => {
    votosPorLista.value[listaId] = { diputados: 0, senadores: 0 }
  })

  // Resetear otros votos
  blancos.value = 0
  nulos.value = 0
  recurridos.value = 0
  usuario.value = ''

  // Resetear estados
  submitError.value = null
  submitSuccess.value = false
}

// Watch para limpiar mensaje de éxito después de 3 segundos
watch(submitSuccess, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      submitSuccess.value = false
    }, 3000)
  }
})

// Watch para actualizar gráficos en tiempo real
watch([votosPorLista, blancos, nulos, recurridos], () => {
  // Obtener referencia al componente padre
  const instance = getCurrentInstance()
  const parent = instance?.parent

  if (parent && parent.exposed && parent.exposed.actualizarGrafico) {
    // Preparar datos para el gráfico
    const datosGrafico = {}

    Object.entries(votosPorLista.value).forEach(([listaId, votos]) => {
      datosGrafico[listaId] = (parseInt(votos.diputados || 0, 10) + parseInt(votos.senadores || 0, 10))
    })

    parent.exposed.actualizarGrafico(
      datosGrafico,
      parseInt(blancos.value || 0, 10),
      parseInt(nulos.value || 0, 10),
      parseInt(recurridos.value || 0, 10)
    )
  }
}, { deep: true })
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Información de la Mesa -->
    <AppCard title="Información de la Mesa">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-500">Número de Mesa:</span>
          <span class="ml-2 font-semibold text-gray-900">{{ mesa.numero }}</span>
        </div>
        <div>
          <span class="text-gray-500">Electores Habilitados:</span>
          <span class="ml-2 font-semibold text-gray-900">{{ formatNumero(mesa.electores) }}</span>
        </div>
      </div>

      <!-- Campo Usuario -->
      <div class="mt-4">
        <label for="usuario" class="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Fiscal/Operador <span class="text-red-500">*</span>
        </label>
        <input
          id="usuario"
          v-model="usuario"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingrese su nombre"
          required
        />
        <p v-if="usuario.trim().length === 0" class="mt-1 text-sm text-red-500">
          Este campo es requerido
        </p>
      </div>
    </AppCard>

    <!-- Votos por Lista -->
    <AppCard title="Votos por Lista">
      <div v-if="listasProvinciales.length === 0" class="text-center py-4 text-gray-500">
        Cargando listas...
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="lista in listasProvinciales"
          :key="lista.id"
          class="border rounded-lg p-4 bg-gray-50"
        >
          <h4 class="font-medium text-gray-900 mb-3">
            {{ lista.nombre }}
            <span v-if="lista.numero" class="text-gray-500 text-sm ml-2">
              (Lista {{ lista.numero }})
            </span>
          </h4>

          <div class="grid grid-cols-2 gap-4">
            <VotosInput
              v-model="votosPorLista[lista.id].diputados"
              label="Diputados"
              :max="mesa.electores"
              placeholder="0"
            />
            <VotosInput
              v-model="votosPorLista[lista.id].senadores"
              label="Senadores"
              :max="mesa.electores"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </AppCard>

    <!-- Otros Votos -->
    <AppCard title="Otros Votos">
      <div class="grid grid-cols-3 gap-4">
        <VotosInput
          v-model="blancos"
          label="Votos en Blanco"
          :max="mesa.electores"
          placeholder="0"
        />
        <VotosInput
          v-model="nulos"
          label="Votos Nulos"
          :max="mesa.electores"
          placeholder="0"
        />
        <VotosInput
          v-model="recurridos"
          label="Votos Recurridos"
          :max="mesa.electores"
          placeholder="0"
        />
      </div>
    </AppCard>

    <!-- Totales y Validación -->
    <AppCard title="Resumen de Votos">
      <div class="space-y-4">
        <!-- Totales -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="bg-gray-100 rounded-lg p-3">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumero(totalVotos) }}</div>
            <div class="text-xs text-gray-500">Total Votos</div>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <div class="text-2xl font-bold text-gray-900">{{ formatNumero(mesa.electores) }}</div>
            <div class="text-xs text-gray-500">Electores</div>
          </div>
          <div class="bg-gray-100 rounded-lg p-3">
            <div class="text-2xl font-bold" :class="esValido ? 'text-green-600' : 'text-red-600'">
              {{ participacion }}%
            </div>
            <div class="text-xs text-gray-500">Participación</div>
          </div>
        </div>

        <!-- Alert de Validación -->
        <div
          v-if="esValido && totalVotos > 0"
          class="flex items-center p-4 rounded-lg bg-green-50 border border-green-200"
        >
          <svg class="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium text-green-800">Datos válidos</p>
            <p class="text-sm text-green-700">
              Abstenciones: {{ formatNumero(abstenciones) }} electores
            </p>
          </div>
        </div>

        <div
          v-else-if="!esValido"
          class="flex items-center p-4 rounded-lg bg-red-50 border border-red-200"
        >
          <svg class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <p class="text-sm font-medium text-red-800">Error de validación</p>
            <p class="text-sm text-red-700">
              El total de votos excede el número de electores por {{ formatNumero(excesoVotos) }} votos
            </p>
          </div>
        </div>

        <!-- Mensaje de éxito -->
        <Transition name="fade">
          <div
            v-if="submitSuccess"
            class="flex items-center p-4 rounded-lg bg-blue-50 border border-blue-200"
          >
            <svg class="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm font-medium text-blue-800">Telegrama guardado correctamente</p>
          </div>
        </Transition>

        <!-- Mensaje de error -->
        <Transition name="fade">
          <div
            v-if="submitError"
            class="flex items-center p-4 rounded-lg bg-red-50 border border-red-200"
          >
            <svg class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm font-medium text-red-800">{{ submitError }}</p>
          </div>
        </Transition>
      </div>
    </AppCard>

    <!-- Botones de Acción -->
    <div class="flex justify-end gap-4 pt-4">
      <AppButton
        variant="secondary"
        type="button"
        @click="handleCancelar"
      >
        Cancelar
      </AppButton>

      <AppButton
        variant="primary"
        type="submit"
        :disabled="!esValido || isSubmitting"
        :loading="isSubmitting"
      >
        Guardar Telegrama
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
