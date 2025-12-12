<template>
  <div class="w-full">
    <!-- Drop Zone -->
    <div
      ref="dropZone"
      :class="[
        'relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
        {
          'border-gray-300 bg-gray-50 hover:bg-gray-100': state === 'idle',
          'border-primary bg-blue-50': state === 'dragover',
          'border-green-500 bg-green-50': state === 'success',
          'border-red-500 bg-red-50': state === 'error',
          'border-gray-300 bg-gray-50': state === 'uploading'
        }
      ]"
      @click="triggerFileInput"
      @drop.prevent="handleDrop"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
    >
      <!-- Upload Icon -->
      <div class="flex flex-col items-center">
        <svg
          v-if="state !== 'uploading'"
          class="w-12 h-12 mb-3"
          :class="{
            'text-gray-400': state === 'idle',
            'text-primary': state === 'dragover',
            'text-green-600': state === 'success',
            'text-red-600': state === 'error'
          }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <!-- Loading Spinner -->
        <div v-else class="mb-3">
          <AppSpinner size="lg" color="blue-600" />
        </div>

        <!-- Upload Text -->
        <p class="text-sm font-medium mb-1" :class="textColorClass">
          <span v-if="state === 'idle'">Arrastra un archivo aquí o haz clic para seleccionar</span>
          <span v-else-if="state === 'dragover'">Suelta el archivo aquí</span>
          <span v-else-if="state === 'uploading'">Subiendo archivo...</span>
          <span v-else-if="state === 'success'">¡Archivo subido exitosamente!</span>
          <span v-else-if="state === 'error'">Error al subir archivo</span>
        </p>

        <!-- Accepted file types -->
        <p class="text-xs text-gray-500">
          Tipos aceptados: {{ accept }}
          <span v-if="multiple"> (múltiples archivos)</span>
        </p>

        <!-- File Names Display -->
        <div v-if="fileNames.length > 0" class="mt-4 w-full">
          <div
            v-for="(fileName, index) in fileNames"
            :key="index"
            class="flex items-center justify-between bg-white rounded-md p-2 mb-2 border"
          >
            <div class="flex items-center flex-1 min-w-0">
              <svg class="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm text-gray-700 truncate">{{ fileName }}</span>
            </div>
            <button
              v-if="state !== 'uploading'"
              type="button"
              class="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
              @click.stop="removeFile(index)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

// Props
const props = defineProps({
  accept: {
    type: String,
    default: '.csv'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['upload'])

// Refs
const fileInput = ref(null)
const dropZone = ref(null)

// Reactive State
const state = ref('idle') // 'idle', 'dragover', 'uploading', 'success', 'error'
const files = ref([])

// Computed
const fileNames = computed(() => files.value.map(file => file.name))

const textColorClass = computed(() => {
  switch (state.value) {
    case 'dragover':
      return 'text-primary'
    case 'success':
      return 'text-green-700'
    case 'error':
      return 'text-red-700'
    case 'uploading':
      return 'text-blue-700'
    default:
      return 'text-gray-700'
  }
})

// Methods
const triggerFileInput = () => {
  if (state.value === 'uploading') return
  fileInput.value?.click()
}

const handleDragOver = (e) => {
  e.preventDefault()
  if (state.value !== 'uploading') {
    state.value = 'dragover'
  }
}

const handleDragLeave = (e) => {
  e.preventDefault()
  // Only change state if we're actually leaving the drop zone
  if (!dropZone.value?.contains(e.relatedTarget)) {
    if (files.value.length > 0) {
      state.value = files.value.length > 0 ? 'success' : 'idle'
    } else {
      state.value = 'idle'
    }
  }
}

const handleDrop = (e) => {
  e.preventDefault()
  const droppedFiles = Array.from(e.dataTransfer.files)

  processFiles(droppedFiles)
}

const handleFileSelect = (e) => {
  const selectedFiles = Array.from(e.target.files || [])
  processFiles(selectedFiles)
}

const processFiles = (newFiles) => {
  // Reset state
  state.value = 'uploading'
  files.value = []

  // Validate file types
  const validFiles = newFiles.filter(file => {
    const fileName = file.name.toLowerCase()
    const fileType = fileName.substring(fileName.lastIndexOf('.'))
    return props.accept.split(',').some(accepted => {
      const normalizedAccept = accepted.trim().toLowerCase()
      return fileType === normalizedAccept || normalizedAccept === '*/*'
    })
  })

  if (validFiles.length === 0) {
    state.value = 'error'
    return
  }

  // Set files based on multiple prop
  files.value = props.multiple ? validFiles : validFiles.slice(0, 1)

  // Emit upload event with file(s)
  const fileToEmit = props.multiple ? files.value : files.value[0]
  emit('upload', fileToEmit)

  // Set success state
  state.value = 'success'
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  if (files.value.length === 0) {
    state.value = 'idle'
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>