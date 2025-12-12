<template>
  <footer class="bg-gray-50 border-t mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Copyright and Version -->
      <div class="text-center text-sm text-gray-600">
        <p>
          © 2025 Sistema de Comicios Argentina - ESET UNQ
          <span v-if="appVersion" class="ml-2">| v{{ appVersion }}</span>
        </p>
      </div>

      <!-- Team Credits -->
      <div class="mt-3 text-center">
        <p class="text-xs text-gray-500">
          Equipo de desarrollo: Ignacio González, Candela Ybañez Barrios, Silvina Torales, Samuel Angarita
        </p>
      </div>

      <!-- Optional Links -->
      <div v-if="documentationLink" class="mt-3 text-center">
        <a
          :href="documentationLink"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-primary hover:underline transition-colors"
        >
          Documentación
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Get app version from environment variables
const appVersion = import.meta.env.VITE_APP_VERSION

// Optional: documentation link (can be configured via env var)
const documentationLink = computed(() => {
  return import.meta.env.VITE_DOCUMENTATION_URL || null
})
</script>
