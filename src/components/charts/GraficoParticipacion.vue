<template>
  <div class="w-full">
    <Bar
      :data="chartData"
      :options="chartOptions"
      :height="height"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  provincias: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Participación por Provincia'
  },
  height: {
    type: Number,
    default: 300
  },
  mostrarMesas: {
    type: Boolean,
    default: true
  }
})

const chartData = computed(() => ({
  labels: props.provincias.map(p => p.nombre),
  datasets: [
    {
      label: 'Participación (%)',
      data: props.provincias.map(p => p.participacion || 0),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1,
      yAxisID: 'y'
    },
    ...(props.mostrarMesas ? [{
      label: 'Mesas Escrutadas',
      data: props.provincias.map(p => p.mesas_escrutadas || 0),
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 1,
      yAxisID: 'y1'
    }] : [])
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            if (context.dataset.label.includes('Participación')) {
              label += context.parsed.y.toFixed(1) + '%'
            } else {
              label += new Intl.NumberFormat('es-AR').format(context.parsed.y)
            }
          }
          return label
        }
      }
    }
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function(value) {
          return value + '%'
        }
      },
      title: {
        display: true,
        text: 'Participación (%)'
      }
    },
    ...(props.mostrarMesas ? {
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('es-AR', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value)
          }
        },
        title: {
          display: true,
          text: 'Mesas Escrutadas'
        }
      }
    } : {})
  }
}))
</script>
