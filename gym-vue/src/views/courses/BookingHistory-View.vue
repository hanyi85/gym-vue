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
  const st = o.Status ?? ''

  if (st.includes('取消')) return '已取消'
  if (st.includes('已報到')) return '已報到'

  const start = new Date(o.StartTime)
  const now = new Date()

  if (start < now) return '已完成'
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
async function goPay(o) {
  try {
    // 1) 先拿 scheduleId（兼容大小寫）
    let scheduleId = o.ScheduleId ?? o.scheduleId

    // 2) 如果 history 沒給 scheduleId，才用 bookingId 查
    if (!scheduleId) {
      const res = await api.get(`/coursebookings/${o.CourseBookingId}`)
      const d = res.data || {}
      scheduleId = d.ScheduleId ?? d.scheduleId
    }

    if (!scheduleId) {
      alert('找不到 scheduleId，無法前往付款')
      return
    }

    // 3) slug（你目前沒有 slug 欄位就用課名頂著，至少路由能跑）
    const slug = o.CourseSlug ?? o.courseSlug ?? o.CourseName

    // 直接去第 3 步：payment
    router.push({
      name: 'courses-booking-payment',
      params: { slug, scheduleId },
    })
  } catch (err) {
    console.error(err)
    alert('取得付款資訊失敗，請稍後再試')
  }
}
 
function goReview(o) {
  router.push({
    name: 'courses-review',
    query: {
      courseBookingId: o.CourseBookingId,
      orderId: `BK${o.CourseBookingId}`,
      course: o.CourseName,
      coach: o.CoachName,
      startTime: o.StartTime,
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

      <template v-else>
        <div v-if="orders.length === 0" class="empty">尚無任何預約紀錄</div>

        <div v-else class="order-list">
          <div class="order-card" v-for="o in orders" :key="o.CourseBookingId">
            <div class="order-left">
              <h5 class="course-title">{{ o.CourseName }}</h5>
              <p>教練：{{ o.CoachName }}</p>
              <p>時間：{{ formatDate(o.StartTime) }} {{ formatTime(o.StartTime) }}</p>
              <p>訂單編號：BK{{ o.CourseBookingId }}</p>
            </div>

            <div class="order-right">
             <div class="meta-row">
  <span class="badge" :class="o.PaymentStatus === '已付款' ? 'paid' : 'unpaid'">
    {{ o.PaymentStatus }}
  </span>

  <span
    class="status"
    :class="{
      done: uiStatus(o) === '已完成',
      upcoming: uiStatus(o) === '即將到來',
      cancel: uiStatus(o) === '已取消',
    checkin: uiStatus(o) === '已報到'
    }"
  >
    {{ uiStatus(o) }}
  </span>
</div>

              <div class="price">NT$ {{ o.FinalPrice }}</div>

              <div class="btn-group">
                <button class="detail-btn" @click="goDetail(o)">查看詳情</button>
            <button
  v-if="o.PaymentStatus !== '已付款'"
  class="pay-btn"
  @click="goPay(o)"
>
  去付款
</button>
                <!-- 已取消 -->
                <button
                  v-if="uiStatus(o) === '已取消'"
                  class="review-btn disabled"
                  disabled
                >
                  已取消
                </button>

                <!-- 已報到 或 已完成 + 已評論 -->
<button
  v-else-if="(uiStatus(o) === '已完成' || uiStatus(o) === '已報到') && o.IsReviewed"
  class="review-btn disabled"
  disabled
>
  已評論
</button>

<!-- 已報到 或 已完成 + 未評論 -->
<button
  v-else-if="(uiStatus(o) === '已完成' || uiStatus(o) === '已報到') && !o.IsReviewed"
  class="review-btn"
  @click="goReview(o)"
>
  去評論
</button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* =========================
   Layout
========================= */
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

/* =========================
   Card
========================= */
.order-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.order-left h5 {
  margin-bottom: 6px;
  font-weight: 700;
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
  gap: 8px;
}

/* =========================
   Meta row (付款 + 狀態)
========================= */
.meta-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 6px;
}

/* badge/status 共用膠囊樣式 */
.badge,
.status {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  line-height: 1.2;
  white-space: nowrap;
}

/* 付款狀態 */
.paid {
  background: #ecfdf5;
  color: #047857;
}

.unpaid {
  background: #fef2f2;
  color: #b91c1c;
}

/* 課程狀態 */
.status.done {
  background: #e0f2fe;
  color: #0369a1;
}

.status.upcoming {
  background: #fef3c7;
  color: #92400e;
}

.status.checkin {
  background: #fff7ed;   /* 淡橘底 */
  color: #ea580c;        /* 主橘色文字 */
  border: 1px solid #fdba74; /* 細橘邊框（質感↑） */
}

.status.cancel {
  background: #f3f4f6;
  color: #6b7280;
}

/* =========================
   Price
========================= */
.price {
  font-weight: 800;
  color: #111827;
}

/* =========================
   Buttons
========================= */
.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* 次要按鈕 */
.detail-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-width: 80px;
}

/* 主行動按鈕 */
.review-btn,
.pay-btn {
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-width: 80px;
  color: #fff;
}

.review-btn {
  background: #f3722a;
}

.pay-btn {
  background: #ff9f1c;
}

.detail-btn:hover,
.review-btn:hover,
.pay-btn:hover {
  opacity: 0.92;
}

.review-btn.disabled {
  background: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
}
</style>
