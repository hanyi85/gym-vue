<template>
  <Banner title="會員首頁" subtitle="歡迎回來，查看您的今日狀態" />
  <div class="container py-4 home-page">

    <!-- 會員 Header -->
    <MemberHeader class="mb-4" />

    <!--  今日健康摘要 -->
    <div class="card home-card mb-4">
      <div class="card-body">

        <div class="section-header d-flex justify-content-between align-items-center">
          <h6 class="section-title">體重概況</h6>
          <router-link to="/users/weight-records" class="link-orange">
            查看詳細 →
          </router-link>
        </div>

        <div class="row mt-4">

          <!-- 今日體重 -->
          <div class="col-md-4">
            <div class="kpi-card">
              <div class="kpi-label">今日體重</div>
              <div class="kpi-value">
                {{ todayWeight ?? '--' }}
                <span class="unit">kg</span>
              </div>

              <div v-if="weightDiff !== null" class="kpi-sub" :class="Number(weightDiff) > 0 ? 'up' : 'down'">
                <span v-if="Number(weightDiff) > 0">▲</span>
                <span v-else>▼</span>
                {{ Math.abs(weightDiff) }} kg
              </div>
            </div>
          </div>

          <!-- 距離目標 -->
          <div class="col-md-4">
            <div class="kpi-card">
              <div class="kpi-label">距離目標</div>
              <div class="kpi-value">
                {{ goalDiff ?? '--' }}
                <span class="unit">kg</span>
              </div>
              <div class="kpi-sub muted">
                目標 {{ goalWeight }} kg
              </div>
            </div>
          </div>

          <!-- 本月進度（可改成其他數據） -->
          <div class="col-md-4">
            <div class="kpi-card">
              <div class="kpi-label">體重紀錄筆數</div>
              <div class="kpi-value">
                {{ history.length }}
                <span class="unit">筆</span>
              </div>
              <div class="kpi-sub muted">
                持續追蹤中
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>


    <!-- 功能區塊 -->
<div class="card home-card mb-4">
  <div class="card-body">

    <div class="section-header">
      <h6 class="section-title">快捷功能</h6>
    </div>

    <div class="quick-links mt-4">

      <router-link to="/courses" class="quick-card">
        <div class="quick-icon">
          <i class="fa fa-calendar"></i>
        </div>
        <p>課程專區</p>
      </router-link>

      <router-link to="/users/weight-records" class="quick-card">
        <div class="quick-icon">
          <i class="fa fa-balance-scale"></i>
        </div>
        <p>體重紀錄</p>
      </router-link>

      <router-link to="/shop/products" class="quick-card">
        <div class="quick-icon">
          <i class="fa fa-shopping-bag"></i>
        </div>
        <p>線上商城</p>
      </router-link>

      <router-link to="/meals" class="quick-card">
        <div class="quick-icon">
          <i class="fa fa-bar-chart"></i>
        </div>
        <p>健康餐點</p>
      </router-link>

    </div>

  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MemberHeader from '@/components/Users/UserHeader.vue'
import api from '@/services/api'

const history = ref([])

const fetchWeight = async () => {
  const res = await api.get('/weightrecords')
  history.value = res.data.map(x => ({
    date: x.RecordDate,
    weight: x.Weight
  }))
}

onMounted(() => {
  fetchWeight()
})

const todayWeight = computed(() => {
  if (!history.value.length) return null

  const sorted = [...history.value].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  return sorted[sorted.length - 1].weight
})

const weightDiff = computed(() => {
  if (history.value.length < 2) return null
  const last = history.value[history.value.length - 1].weight
  const prev = history.value[history.value.length - 2].weight
  return (last - prev).toFixed(1)
})

const goalWeight = 60

const goalDiff = computed(() => {
  if (!todayWeight.value) return null
  return (todayWeight.value - goalWeight).toFixed(1)
})
</script>


<style scoped>
.home-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.home-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.section-header {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.section-title {
  font-weight: 700;
  color: #1e293b;
}


.link-orange {
  color: #f59e0b;
  font-weight: 600;
  text-decoration: none;
}

.link-orange:hover {
  text-decoration: underline;
}

.quick-card {
  display: block;
  text-align: center;
  padding: 18px;
  border-radius: 12px;
  background: #f8fafc;
  font-weight: 600;
  text-decoration: none;
  color: #1e293b;
  transition: 0.2s;
}

.quick-card:hover {
  background: #fffbeb;
  color: #f59e0b;
}

.quick-card.disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.kpi-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
}

.kpi-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
}

.unit {
  font-size: 16px;
  margin-left: 4px;
  color: #94a3b8;
}

.kpi-sub {
  margin-top: 8px;
  font-size: 14px;
}

.kpi-sub.up {
  color: #ef4444;
}

.kpi-sub.down {
  color: #22c55e;
}

.kpi-sub.muted {
  color: #94a3b8;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.quick-icon {
  font-size: 28px;
  margin-bottom: 8px;
  color: #f59e0b;
}

.quick-card p {
  margin: 0;
  font-size: 14px;
}
</style>
