<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full border-collapse text-sm">
      <!-- Table Header -->
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-left font-semibold text-gray-700"
            :class="[
              column.sortable && 'cursor-pointer hover:bg-gray-100 select-none',
              column.align === 'center' && 'text-center',
              column.align === 'right' && 'text-right'
            ]"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center gap-1" :class="[
              column.align === 'center' && 'justify-center',
              column.align === 'right' && 'justify-end'
            ]">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable" class="inline-flex flex-col">
                <ChevronUpIcon
                  class="h-3 w-3 -mb-1"
                  :class="[
                    sortBy === column.key && sortOrder === 'asc'
                      ? 'text-primary'
                      : 'text-gray-400'
                  ]"
                />
                <ChevronDownIcon
                  class="h-3 w-3 -mt-1"
                  :class="[
                    sortBy === column.key && sortOrder === 'desc'
                      ? 'text-primary'
                      : 'text-gray-400'
                  ]"
                />
              </span>
            </div>
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <!-- Loading State: Skeleton Rows -->
        <template v-if="loading">
          <tr
            v-for="row in skeletonRows"
            :key="row"
            class="border-b border-gray-100"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
            >
              <div class="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          </tr>
        </template>

        <!-- Empty State -->
        <tr v-else-if="!data || data.length === 0">
          <td
            :colspan="columns.length"
            class="px-4 py-8 text-center text-gray-500"
          >
            <slot name="empty">
              {{ emptyMessage }}
            </slot>
          </td>
        </tr>

        <!-- Data Rows -->
        <template v-else>
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowKey ? row[rowKey] : rowIndex"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
              :class="[
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              ]"
            >
              <!-- Dynamic slot for custom cell rendering -->
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="row[column.key]"
                :index="rowIndex"
              >
                {{ row[column.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <!-- Pagination Slot -->
    <div v-if="$slots.pagination" class="mt-4">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

// Type definitions
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export type SortOrder = 'asc' | 'desc'

export interface SortEvent {
  key: string
  order: SortOrder
}

// Props
const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    data: Record<string, unknown>[]
    sortBy?: string
    sortOrder?: SortOrder
    loading?: boolean
    emptyMessage?: string
    rowKey?: string
    skeletonRowCount?: number
  }>(),
  {
    sortOrder: 'asc',
    loading: false,
    emptyMessage: 'No hay datos para mostrar',
    skeletonRowCount: 5
  }
)

// Emits
const emit = defineEmits<{
  sort: [event: SortEvent]
}>()

// Computed: skeleton rows array
const skeletonRows = computed(() => {
  return Array.from({ length: props.skeletonRowCount }, (_, i) => i)
})

// Handle sort click
const handleSort = (key: string) => {
  let newOrder: SortOrder = 'asc'

  if (props.sortBy === key) {
    newOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
  }

  emit('sort', { key, order: newOrder })
}
</script>

<style scoped>
/* Smooth skeleton animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
