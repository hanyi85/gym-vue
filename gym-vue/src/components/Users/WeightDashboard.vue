<template>
  <div class="row g-4 mb-5 align-items-stretch">

    <!-- 左側圖表 -->
    <div class="col-lg-8 d-flex">
      <div class="card metric-card w-100 border-0 shadow-sm">
        <div class="card-body p-4 d-flex flex-column">

          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold text-dark-blue mb-0">體重變化趨勢</h6>

            <div class="chart-filter-group p-1">
              <button
                class="btn btn-filter"
                :class="{ active: period === '30d'}"
                @click="period  = '30d'"
              >
                30天
              </button>

              <button
                class="btn btn-filter"
                :class="{ active: period === '3m'}"
                @click="period  = '3m'"
              >
                3個月
              </button>

              <button
                class="btn btn-filter"
                :class="{ active: period === '1y' }"
                @click="period  = '1y'"
              >
                1年
              </button>
            </div>
          </div>

          <div class="flex-grow-1" style="height:300px">
            <canvas ref="chartRef"></canvas>
          </div>

        </div>
      </div>
    </div>

    <!-- 右側統計 -->
    <div class="col-lg-4 d-flex">
      <div class="d-flex flex-column gap-3 w-100">

        <div class="stat-card p-4 border-0 shadow-sm flex-fill d-flex flex-column justify-content-center">
          <small class="text-label fw-bold">目前體重</small>
          <h2 class="fw-bold mt-2 mb-0">
            {{ currentWeight }}
            <span class="unit-text">kg</span>
          </h2>
        </div>

        <div class="stat-card p-4 border-0 shadow-sm flex-fill d-flex flex-column justify-content-center">
          <small class="text-label fw-bold">累積減重</small>
          <h2 class="fw-bold mt-2 mb-0 text-orange">
            {{ totalLoss }}
            <span class="unit-text text-orange">kg</span>
          </h2>
        </div>

        <div class="stat-card p-4 border-0 shadow-sm flex-fill d-flex flex-column justify-content-center">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <small class="text-label fw-bold">目標體重</small>
            <span class="fw-bold text-dark-blue">{{ goalWeight }} kg</span>
          </div>
          <div class="d-flex justify-content-between">
            <small class="text-orange fw-bold">
              已達成 {{ goalPercent }}%
            </small>
            <small class="text-muted-custom">
              尚差 {{ remainingWeight }} kg
            </small>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  history: {
    type: Array,
    required: true
  }
})
const period = ref('30d')

const chartRef = ref(null)
let chartInstance = null


const goalWeight = 70

// ============================
// 篩選資料
// ============================

const filteredHistory = computed(() => {
    if (!props.history.length) return []
    
    const sorted = [...props.history].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )
    
    const latestDate = new Date(sorted[sorted.length - 1].date + "T00:00:00")
    
    let cutoff = new Date(latestDate)
    
    if (period.value === '30d') {
        cutoff.setDate(latestDate.getDate() - 30)
    } else if (period.value === '3m') {
        cutoff.setMonth(latestDate.getMonth() - 3)
    } else if (period.value === '1y') {
        cutoff.setFullYear(latestDate.getFullYear() - 1)
    }
    
    console.log('period:', period.value)
    console.log('filtered length:', sorted.filter(item =>
    new Date(item.date + "T00:00:00") >= cutoff
    ).length)
    return sorted.filter(item =>
    new Date(item.date + "T00:00:00") >= cutoff
)
})

// ============================
// 統計
// ============================

const currentWeight = computed(() => {
  if (!filteredHistory.value.length) return '--'
  return filteredHistory.value[filteredHistory.value.length - 1].weight
})

const firstWeight = computed(() => {
  if (!filteredHistory.value.length) return 0
  return filteredHistory.value[0].weight
})

const totalLoss = computed(() => {
  if (filteredHistory.value.length < 2) return 0
  const loss = firstWeight.value - currentWeight.value
  return Number(loss).toFixed(1)
})

const goalPercent = computed(() => {
  if (!firstWeight.value) return 0
  const totalNeed = firstWeight.value - goalWeight
  if (totalNeed === 0) return 100

  const percent =
    ((firstWeight.value - currentWeight.value) / totalNeed) * 100

  return Math.max(0, Math.min(100, percent.toFixed(0)))
})

const remainingWeight = computed(() => {
  const diff = currentWeight.value - goalWeight
  return diff > 0 ? diff.toFixed(1) : 0
})

// ============================
// 圖表
// ============================

const renderChart = async () => {
  await nextTick()
  if (!chartRef.value) return

  const data = filteredHistory.value

  if (!data.length) {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
    return
  }

  const labels = data.map(item =>
    new Date(item.date + "T00:00:00").toLocaleDateString()
  )

  const weights = data.map(item =>
    Number(item.weight) || 0
  )

  // 每次都銷毀重建（最穩定）
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '體重',
        data: weights,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.15)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  })
}
onMounted(renderChart)
watch(filteredHistory, renderChart, { immediate: true })
watch(period, renderChart)
onUnmounted(() => {
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.metric-card,
.stat-card {
  background: #ffffff;
  border-radius: 16px;
}

.text-dark-blue {
  color: #1e293b;
}

.text-orange {
  color: #f59e0b;
}

.text-muted-custom {
  color: #64748b;
}

.text-label {
  color: #94a3b8;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.unit-text {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: normal;
  margin-left: 2px;
}

.chart-filter-group {
  background-color: #f1f5f9;
  border-radius: 10px;
}

.btn-filter {
  border: none;
  background: transparent;
  padding: 5px 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-filter.active {
  background-color: white;
  color: #f59e0b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
</style>