<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const orders = ref([])
const loading = ref(true)

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// 依你的後端：GET /api/coursebookings/history?userId=1
async function fetchOrders() {
  loading.value = true
  try {
    const userId = 1 // 先假登入
    const res = await api.get(`/coursebookings/history?userId=${userId}`)
    orders.value = res.data || []
  } catch (err) {
    console.error(err)
    alert('載入訂單失敗')
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

// 把 StartTime 轉成你畫面要的 YYYY-MM-DD / HH:mm
function formatDate(dt) {
  const d = new Date(dt)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
function formatTime(dt) {
  const d = new Date(dt)
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mi}`
}

/**
 * 狀態顯示：
 * 你的後端 Status 目前回「已報名」等字串，
 * 但你 UI 想要「即將到來 / 已完成 / 已取消」
 * 所以我們用 StartTime + Status 推出 UI 狀態。
 */
function uiStatus(o) {
  // 若後端明確是取消類
  if ((o.Status || '').includes('取消')) return '已取消'

  const start = new Date(o.StartTime)
  const now = new Date()

  // 過去時間 -> 已完成（前提不是取消）
  if (start < now) return '已完成'

  // 未來時間 -> 即將到來
  return '即將到來'
}

function goDetail(o) {
  router.push({
    name: 'courses-booking-success',
    query: {
      // 原本用 order.id，現在用 CourseBookingId
      orderId: `BK${o.CourseBookingId}`,
      course: o.CourseName,
      date: formatDate(o.StartTime),
      time: formatTime(o.StartTime),
      price: o.FinalPrice,
    },
  })
}

function goReview(o) {
  router.push({
    name: 'courses-review',
    query: {
      orderId: `BK${o.CourseBookingId}`,
      course: o.CourseName,
      coach: o.CoachName,
      date: `${formatDate(o.StartTime)} ${formatTime(o.StartTime)}`,
    },
  })
}
</script>

<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <h2 class="fw-bold text-center mb-2">我的課程訂單</h2>
      <p class="text-center text-muted mb-4">查看你的預約紀錄與狀態</p>

      <div v-if="loading" class="text-center text-muted">載入中...</div>

      <div v-else class="order-list">
        <div class="order-card" v-for="o in orders" :key="o.CourseBookingId">
          <div class="order-left">
            <h5>{{ o.CourseName }}</h5>
            <p>教練：{{ o.CoachName }}</p>
            <p>時間：{{ formatDate(o.StartTime) }} {{ formatTime(o.StartTime) }}</p>
            <p>訂單編號：BK{{ o.CourseBookingId }}</p>
          </div>

          <div class="order-right">
            <span
              class="status"
              :class="{
                done: uiStatus(o) === '已完成',
                upcoming: uiStatus(o) === '即將到來',
                cancel: uiStatus(o) === '已取消'
              }"
            >
              {{ uiStatus(o) }}
            </span>

            <div class="price">NT$ {{ o.FinalPrice }}</div>

            <div class="btn-group">
              <button class="detail-btn" @click="goDetail(o)">查看詳情</button>

              <button
                v-if="uiStatus(o) === '已完成'"
                class="review-btn"
                @click="goReview(o)"
              >
                去評論
              </button>
            </div>
          </div>
        </div>

        <div v-if="orders.length === 0" class="empty">尚無任何預約紀錄</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.order-left h5 {
  margin-bottom: 6px;
  font-weight: 600;
}

.order-left p {
  font-size: 14px;
  margin: 2px 0;
  color: #555;
}

.order-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
}

.status.done {
  background: #e0f2fe;
  color: #0369a1;
}

.status.upcoming {
  background: #dcfce7;
  color: #166534;
}

.status.cancel {
  background: #fee2e2;
  color: #991b1b;
}

.price {
  font-weight: bold;
  color: #2563eb;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.detail-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.review-btn {
  background: #ff8a00;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 60px;
}
</style>
