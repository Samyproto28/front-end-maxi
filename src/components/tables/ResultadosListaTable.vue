<template>
  <div class="w-full">
    <AppTable
      :columns="columns"
      :data="tableData"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      @sort="handleSort"
    >
      <!-- Posición con emojis para top 3 -->
      <template #cell-posicion="slotProps">
        <span class="text-2xl">
          {{ getPositionEmoji(slotProps.value) }}
        </span>
      </template>

      <!-- Lista: nombre + alianza -->
      <template #cell-lista="slotProps">
        <div>
          <div class="font-medium">{{ slotProps.row.nombre }}</div>
          <div v-if="slotProps.row.alianza" class="text-xs text-gray-500">
            {{ slotProps.row.alianza }}
          </div>
        </div>
      </template>

      <!-- Votos formateados -->
      <template #cell-votos="slotProps">
        <span class="font-mono">{{ formatNumero(slotProps.value) }}</span>
      </template>

      <!-- Porcentaje con barra visual -->
      <template #cell-porcentaje="slotProps">
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all"
              :style="{ width: `${slotProps.value}%` }"
            />
          </div>
          <span class="text-sm font-mono w-16 text-right">
            {{ formatPorcentaje(slotProps.value) }}
          </span>
        </div>
      </template>

      <!-- Estado con badge -->
      <template #cell-estado="slotProps">
        <AppBadge
          :variant="slotProps.row.estado.variant"
          :text="slotProps.row.estado.text"
        />
      </template>

      <!-- Footer con totales -->
      <template #footer>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-3 gap-4">
            <!-- Votos Blancos -->
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-500 uppercase tracking-wide">Blancos</div>
              <div class="text-lg font-bold mt-1">
                {{ formatNumero(totales.blancos?.votos || 0) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatPorcentaje(totales.blancos?.porcentaje || 0) }}
              </div>
            </div>

            <!-- Votos Nulos -->
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-500 uppercase tracking-wide">Nulos</div>
              <div class="text-lg font-bold mt-1">
                {{ formatNumero(totales.nulos?.votos || 0) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatPorcentaje(totales.nulos?.porcentaje || 0) }}
              </div>
            </div>

            <!-- Votos Recurridos -->
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-500 uppercase tracking-wide">Recurridos</div>
              <div class="text-lg font-bold mt-1">
                {{ formatNumero(totales.recurridos?.votos || 0) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatPorcentaje(totales.recurridos?.porcentaje || 0) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppTable from '@/components/common/AppTable.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import { formatNumero, formatPorcentaje } from '@/utils/formatters'

// Types
interface ListaResultado {
  id: number
  nombre: string
  sigla?: string
  votos: number
  porcentaje: number
  alianza?: string
  cargo?: string
}

interface TotalesVotos {
  blancos?: {
    votos: number
    porcentaje: number
  }
  nulos?: {
    votos: number
    porcentaje: number
  }
  recurridos?: {
    votos: number
    porcentaje: number
  }
}

// Props
const props = defineProps<{
  listas: ListaResultado[]
  cargo: string
  totales?: TotalesVotos
}>()

// Emits
const emit = defineEmits<{
  sort: [key: string, order: 'asc' | 'desc']
}>()

// Estado de ordenamiento
const sortBy = ref('votos')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Columnas de la tabla
const columns = [
  { key: 'posicion', label: 'Posición', align: 'center' as const },
  { key: 'lista', label: 'Lista', align: 'left' as const },
  { key: 'votos', label: 'Votos', align: 'right' as const, sortable: true },
  { key: 'porcentaje', label: 'Porcentaje', align: 'right' as const, sortable: true },
  { key: 'estado', label: 'Estado', align: 'center' as const }
]

// Función para obtener emoji según posición
const getPositionEmoji = (posicion: number): string => {
  const emojiMap: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  }
  return emojiMap[posicion] || posicion.toString()
}

// Función para calcular estado y badge
const calculateEstado = (posicion: number, porcentaje: number) => {
  if (posicion === 1) {
    return {
      variant: 'success' as const,
      text: '1° Lugar'
    }
  } else if (posicion === 2) {
    return {
      variant: 'info' as const,
      text: '2° Lugar'
    }
  } else if (posicion === 3) {
    return {
      variant: 'warning' as const,
      text: '3° Lugar'
    }
  } else {
    return {
      variant: 'neutral' as const,
      text: `${posicion}° Lugar`
    }
  }
}

// Datos procesados para la tabla
const tableData = computed(() => {
  // Ordenar listas por votos (descendente por defecto)
  const sortedListas = [...props.listas].sort((a, b) => {
    if (sortOrder.value === 'desc') {
      return b.votos - a.votos
    }
    return a.votos - b.votos
  })

  return sortedListas.map((lista, index) => {
    const posicion = index + 1
    return {
      posicion,
      lista_id: lista.id,
      nombre: lista.nombre,
      sigla: lista.sigla,
      alianza: lista.alianza,
      votos: lista.votos,
      porcentaje: lista.porcentaje,
      estado: calculateEstado(posicion, lista.porcentaje)
    }
  })
})

// Totales con valores por defecto
const totales = computed(() => {
  return props.totales || {
    blancos: { votos: 0, porcentaje: 0 },
    nulos: { votos: 0, porcentaje: 0 },
    recurridos: { votos: 0, porcentaje: 0 }
  }
})

// Manejar ordenamiento
const handleSort = (key: string, order: 'asc' | 'desc') => {
  sortBy.value = key
  sortOrder.value = order
  emit('sort', key, order)
}
</script>

<style scoped>
/* Transiciones suaves para las barras de progreso */
.bg-primary {
  transition: width 0.3s ease;
}

/* Hover effects para las filas */
:deep(tbody tr:hover) {
  background-color: rgb(249 250 251);
}
</style>
