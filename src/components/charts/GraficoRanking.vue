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
  listas: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Ranking de Listas'
  },
  height: {
    type: Number,
    default: 400
  },
  mostrarBancas: {
    type: Boolean,
    default: false
  }
})

const chartData = computed(() => {
  const topListas = props.listas.slice(0, 10) // Top 10

  return {
    labels: topListas.map(l => l.nombre),
    datasets: [
      {
        label: 'Votos',
        data: topListas.map(l => l.votos),
        backgroundColor: topListas.map((_, index) => {
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
          return colors[index % colors.length]
        }),
        borderColor: '#ffffff',
        borderWidth: 2
      },
      ...(props.mostrarBancas ? [{
        label: 'Bancas',
        data: topListas.map(l => l.bancas || 0),
        backgroundColor: '#94A3B8',
        borderColor: '#64748B',
        borderWidth: 1,
        yAxisID: 'y1'
      }] : [])
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
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
          if (context.parsed.x !== null) {
            label += new Intl.NumberFormat('es-AR').format(context.parsed.x)
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('es-AR', {
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(value)
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 12
        }
      }
    },
    ...(props.mostrarBancas ? {
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          stepSize: 1
        }
      }
    } : {})
  }
}))
</script>
