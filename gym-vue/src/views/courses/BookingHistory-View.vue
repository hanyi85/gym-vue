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

function minutesToStart(o) {
  const start = new Date(o.StartTime)
  const now = new Date()
  return Math.floor((start - now) / 60000) 
}

function canCancel(o) {
  if (uiStatus(o) === '已報到' || uiStatus(o) === '已取消') return false
  // 開課前 5小時不可取消
  return minutesToStart(o) > 3000
}
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
 * UI 狀態：即將到來 / 已完成 / 已取消 / 已報到
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

// ===== ✅ 新增：取消 Modal 狀態與行為 =====
const showCancelModal = ref(false)
const cancelTarget = ref(null)
const canceling = ref(false)

function openCancel(o) {
  // 只擋已報到
  if (uiStatus(o) === '已報到') {
    alert('已報到不可取消')
    return
  }
  cancelTarget.value = o
  showCancelModal.value = true
}
function closeCancel() {
  showCancelModal.value = false
  cancelTarget.value = null
}

async function confirmCancel() {
  if (!cancelTarget.value || canceling.value) return
  canceling.value = true

  try {
    const id = cancelTarget.value.CourseBookingId ?? cancelTarget.value.courseBookingId
    if (!id) {
      alert('找不到 CourseBookingId')
      return
    }

    await api.delete(`/coursebookings/${id}`)
    closeCancel()
    await fetchOrders()
  } catch (err) {
    console.error(err)
    alert(err?.response?.data || '取消失敗')
  } finally {
    canceling.value = false
  }
}

// ===== 導頁 =====
function goDetail(o) {
  router.push({
    name: 'courses-booking-success',
    query: {
      orderId: `BK${o.CourseBookingId}`,
      course: o.CourseName,
      date: formatDate(o.StartTime),
      time: formatTime(o.StartTime),
      price: o.FinalPrice,
    },
  })
}

async function goPay(o) {
  const slug = o.CourseSlug ?? o.courseSlug ?? o.CourseName
  const sid = Number(o.ScheduleId ?? o.scheduleId ?? 0)

  if (!sid) {
    alert('history 沒有 scheduleId，請讓後端 history 回傳 ScheduleId')
    return
  }

  router.push({
    name: 'courses-booking-payment',
    params: { slug, scheduleId: sid },
    query: { bookingId: o.CourseBookingId },
  })
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
<button
  class="cancel-btn"
  :disabled="!canCancel(o)"
  @click="canCancel(o) ? openCancel(o) : alert('開課前 1 小時內不可取消')"
>
  取消預約
</button>
              </div>
              <small
  v-if="!canCancel(o) && uiStatus(o) !== '已報到' && uiStatus(o) !== '已取消'"
  class="hint"
>
  距離上課不足 5 小時，無法取消
</small>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <!-- ✅ Cancel Modal -->
<div v-if="showCancelModal" class="modal-mask" @click.self="closeCancel">
  <div class="modal-card" role="dialog" aria-modal="true">
    <div class="modal-header">
      <h3>取消預約</h3>
      <button class="modal-x" @click="closeCancel">×</button>
    </div>

    <div class="modal-body" v-if="cancelTarget">
      <p class="modal-tip">確定要取消這筆預約嗎？取消後將無法復原。</p>

      <div class="modal-info">
        <div class="row">
          <span class="k">課程</span>
          <span class="v">{{ cancelTarget.CourseName }}</span>
        </div>
        <div class="row">
          <span class="k">時間</span>
          <span class="v">{{ formatDate(cancelTarget.StartTime) }} {{ formatTime(cancelTarget.StartTime) }}</span>
        </div>
        <div class="row">
          <span class="k">訂單</span>
          <span class="v">BK{{ cancelTarget.CourseBookingId }}</span>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <button class="btn-base btn-gray" @click="closeCancel" :disabled="canceling">先不要</button>
      <button class="btn-base btn-danger" @click="confirmCancel" :disabled="canceling">
        {{ canceling ? '取消中…' : '確定取消' }}
      </button>
    </div>
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
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fdba74;
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
   Buttons (統一高度/字級)
========================= */
.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}

/* ✅ 統一所有按鈕外觀 */
.detail-btn,
.review-btn,
.pay-btn,
.cancel-btn {
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  min-width: 84px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  transition: 0.15s;
}

/* 次要按鈕 */
.detail-btn {
  background: #f3f4f6;
  color: #374151;
  border-color: #eef2f7;
}

/* 主行動按鈕 */
.review-btn {
  background: #f3722a;
  color: #fff;
}

.pay-btn {
  background: #ff9f1c;
  color: #fff;
}

/* ✅ 取消預約：非幽靈（淡紅底，字小一點不搶主 CTA） */
.cancel-btn {
  background: #fef2f2;
  color: #b91c1c;
  border-color: #fecaca;
  font-size: 12.5px;
}

.detail-btn:hover,
.review-btn:hover,
.pay-btn:hover,
.cancel-btn:hover {
  opacity: 0.92;
}

.cancel-btn:active,
.detail-btn:active,
.review-btn:active,
.pay-btn:active {
  transform: translateY(1px);
}

.review-btn.disabled {
  background: #e5e7eb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

/* =========================
   Modal（如果你有加漂亮取消確認視窗）
========================= */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.modal-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.modal-x {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.modal-body {
  padding: 16px 18px;
}

.modal-tip {
  margin: 0 0 12px;
  color: #6b7280;
  font-size: 14px;
}

.modal-info {
  background: #f9fafb;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 12px;
}

.modal-info .row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.modal-info .k {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.modal-info .v {
  color: #111827;
  font-weight: 700;
  text-align: right;
}

.modal-actions {
  padding: 14px 18px 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-base {
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-gray {
  background: #f3f4f6;
  border-color: #eef2f7;
  color: #111827;
}

.btn-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}

.btn-base:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.hint{
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}

.cancel-btn:disabled{
  opacity: .55;
  cursor: not-allowed;
  transform: none;
}
</style>
