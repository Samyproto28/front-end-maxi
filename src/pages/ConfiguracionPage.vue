<template>
  <div class="min-h-screen flex flex-col">
    <!-- AppHeader -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Page Title -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Configuración</h1>
          <p class="mt-2 text-sm text-gray-600">Importación y gestión de datos del sistema</p>
        </div>

        <!-- Section 1: Importación de Datos -->
        <section class="mb-8">
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Importación de Datos</h2>
              <p class="mt-1 text-sm text-gray-500">
                Importa datos desde archivos CSV para diferentes tipos de información
              </p>
            </div>

            <div class="p-6 space-y-6">
              <!-- Tipo de Datos Selector -->
              <div>
                <AppSelect
                  v-model="tipoDatos"
                  :options="opcionesTipoDatos"
                  label="Tipo de Datos"
                  placeholder="Selecciona el tipo de datos a importar"
                  @update:modelValue="resetFile"
                />
              </div>

              <!-- File Uploader -->
              <div>
                <FileUploader
                  accept=".csv"
                  :multiple="false"
                  @upload="handleFileUpload"
                />
              </div>

              <!-- Import Button -->
              <div class="flex justify-end">
                <AppButton
                  variant="primary"
                  size="lg"
                  :disabled="!archivoSeleccionado || isImporting"
                  :loading="isImporting"
                  @click="importarDatos"
                >
                  {{ isImporting ? 'Importando...' : 'Importar Datos' }}
                </AppButton>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Gestión de Catálogos -->
        <section>
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Gestión de Catálogos</h2>
              <p class="mt-1 text-sm text-gray-500">
                Administra y edita los catálogos del sistema
              </p>
            </div>

            <div class="p-6">
              <!-- Tabs -->
              <div class="border-b border-gray-200 mb-6">
                <nav class="-mb-px flex space-x-8">
                  <button
                    v-for="tab in tabsCatalogo"
                    :key="tab.id"
                    type="button"
                    :class="[
                      'py-2 px-1 border-b-2 font-medium text-sm',
                      {
                        'border-primary text-primary': activeTab === tab.id,
                        'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== tab.id
                      }
                    ]"
                    @click="activeTab = tab.id"
                  >
                    {{ tab.label }}
                  </button>
                </nav>
              </div>

              <!-- Tab Content -->
              <div class="text-center py-12">
                <svg
                  class="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">
                  Vista de {{ tabsCatalogo.find(t => t.id === activeTab)?.label }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Esta funcionalidad estará disponible próximamente
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Result Modal -->
    <AppModal
      :is-open="showModal"
      :title="modalTitle"
      size="lg"
      @close="cerrarModal"
    >
      <!-- Success Messages -->
      <div v-if="resultadoImportacion && resultadoImportacion.success > 0" class="mb-4">
        <AppAlert
          type="success"
          :message="`Se importaron ${resultadoImportacion.success} registros correctamente`"
        />
      </div>

      <!-- Error Messages -->
      <div v-if="resultadoImportacion && resultadoImportacion.errors > 0" class="mb-4">
        <AppAlert
          type="error"
          :message="`Se encontraron ${resultadoImportacion.errors} errores al procesar el archivo`"
        />
      </div>

      <!-- Success Count -->
      <div v-if="resultadoImportacion" class="mb-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Resumen de Importación</h4>
          <dl class="grid grid-cols-3 gap-4">
            <div>
              <dt class="text-xs text-gray-500">Total Procesados</dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ resultadoImportacion.total }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Exitosos</dt>
              <dd class="text-lg font-semibold text-green-600">
                {{ resultadoImportacion.success }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-gray-500">Errores</dt>
              <dd class="text-lg font-semibold text-red-600">
                {{ resultadoImportacion.errors }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Error Details -->
      <div v-if="erroresDetalle.length > 0" class="mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Detalles de Errores</h4>
        <div class="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
          <ul class="space-y-2">
            <li
              v-for="(error, index) in erroresDetalle"
              :key="index"
              class="text-sm text-gray-700"
            >
              <span class="font-medium">Fila {{ error.row }}:</span>
              <span class="ml-2">{{ error.message }}</span>
            </li>
          </ul>
        </div>
      </div>

      <template #footer>
        <AppButton variant="primary" @click="cerrarModal">
          Cerrar
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppAlert from '@/components/common/AppAlert.vue'
import FileUploader from '@/components/forms/FileUploader.vue'

// Services
import importExportService from '@/services/importExportService'

// Router
const router = useRouter()

// Refs for state
const tipoDatos = ref(null)
const archivoSeleccionado = ref(null)
const isImporting = ref(false)
const showModal = ref(false)
const resultadoImportacion = ref(null)
const activeTab = ref('provincias')

// Tipo de datos options
const opcionesTipoDatos = [
  { value: 'provincias', label: 'Provincias' },
  { value: 'listas', label: 'Listas Electorales' },
  { value: 'mesas', label: 'Mesas Electorales' },
  { value: 'telegramas', label: 'Telegramas' }
]

// Tabs for catalog management
const tabsCatalogo = [
  { id: 'provincias', label: 'Provincias' },
  { id: 'listas', label: 'Listas' },
  { id: 'mesas', label: 'Mesas' },
  { id: 'telegramas', label: 'Telegramas' }
]

// Computed
const modalTitle = computed(() => {
  if (!resultadoImportacion.value) return 'Resultado de Importación'
  if (resultadoImportacion.value.errors === 0) {
    return '¡Importación Exitosa!'
  }
  return 'Importación Completada con Errores'
})

const erroresDetalle = computed(() => {
  if (!resultadoImportacion.value) return []
  return resultadoImportacion.value.errorDetails || []
})

// Methods
const handleFileUpload = (file) => {
  archivoSeleccionado.value = file
}

const resetFile = () => {
  archivoSeleccionado.value = null
}

const importarDatos = async () => {
  if (!archivoSeleccionado.value || !tipoDatos.value) {
    return
  }

  isImporting.value = true

  try {
    let resultado

    // Call appropriate import method based on tipoDatos
    switch (tipoDatos.value) {
      case 'provincias':
        resultado = await importExportService.importProvincias(archivoSeleccionado.value)
        break
      case 'listas':
        resultado = await importExportService.importListas(archivoSeleccionado.value)
        break
      case 'mesas':
        resultado = await importExportService.importMesas(archivoSeleccionado.value)
        break
      case 'telegramas':
        resultado = await importExportService.importTelegramas(archivoSeleccionado.value)
        break
      default:
        throw new Error('Tipo de datos no válido')
    }

    // Transformar errores de strings a objetos
    const erroresFormateados = Array.isArray(resultado.errores)
      ? resultado.errores.map(err => {
          // Intentar extraer el número de línea del mensaje
          const match = err.match(/Línea (\d+):/)
          const row = match ? match[1] : '-'
          return { row, message: err }
        })
      : []

    resultadoImportacion.value = {
      total: resultado.importados || 0,
      success: resultado.importados || 0,
      errors: Array.isArray(resultado.errores) ? resultado.errores.length : (resultado.errores || 0),
      errorDetails: erroresFormateados
    }

    showModal.value = true
  } catch (error) {
    console.error('Error importing data:', error)

    resultadoImportacion.value = {
      total: 0,
      success: 0,
      errors: 1,
      errorDetails: [{ row: '-', message: error.message || 'Error desconocido durante la importación' }]
    }

    showModal.value = true
  } finally {
    isImporting.value = false
  }
}

const cerrarModal = () => {
  showModal.value = false
  resultadoImportacion.value = null
  archivoSeleccionado.value = null
  tipoDatos.value = null
}
</script>

<style scoped>
/* Component-specific styles if needed */
</style>