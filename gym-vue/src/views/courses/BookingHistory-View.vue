<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { usePaymentStore } from '@/stores/Course/paymentStore'
import { useReviewStore } from '@/stores/Course/reviewStore'

const router = useRouter()
const paymentStore = usePaymentStore()
const reviewStore = useReviewStore()
const orders = ref([])
const loading = ref(true)

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// ===== helpers：欄位大小寫兼容 =====
const getBookingId = (o) => Number(o.CourseBookingId ?? o.courseBookingId ?? 0)
const getStartTime = (o) => o.StartTime ?? o.startTime
const getFinalPrice = (o) => Number(o.FinalPrice ?? o.finalPrice ?? 0)
const getPayment = (o) => (o.PaymentStatus ?? o.paymentStatus ?? '').toString()
const isPaid = (o) => getPayment(o).includes('已付款')


function minutesToStart(o) {
  const start = new Date(getStartTime(o))
  const now = new Date()
  return Math.floor((start - now) / 60000)
}

function isPast(o) {
  const start = new Date(getStartTime(o))
  return start.getTime() <= Date.now() // 已開始(含) 就算過去
}

function canPay(o) {
  // 1) 已付款不顯示付款
  if ((o.PaymentStatus ?? o.paymentStatus ?? '').toString().includes('已付款')) return false
  // 2) 已開始/已結束不給付
  if (isPast(o)) return false
  // 3) 已取消也不給付
  if (uiStatus(o) === '已取消') return false
  // 4) 已報到當然也不會去付
  if (uiStatus(o) === '已報到') return false
  return true
}

function canCancel(o) {
  // 已報到/已取消/已完成 不可取消
  const s = uiStatus(o)
  if (s === '已報到' || s === '已取消' || s === '已完成') return false
  // 開課前 5 小時不可取消
  return minutesToStart(o) > 300
}

// ===== 取訂單 =====
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

// ===== 格式化顯示 =====
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

function displayBkNo(o) {
  const id = getBookingId(o)
  return id > 0 ? `BK${String(id).padStart(9, '0')}` : ''
}

/**
 * UI 狀態：即將到來 / 已完成 / 已取消 / 已報到
 */
function uiStatus(o) {
  const st = (o.Status ?? o.status ?? '').toString()

  if (st.includes('取消')) return '已取消'
  if (st.includes('已報到')) return '已報到'

  const start = new Date(getStartTime(o))
  const now = new Date()

  // 過了時間但沒有報到
  if (start < now) return '已報到'   //  統一視覺為已報到

  return '即將到來'
}

// ===== 取消 Modal =====
const showCancelModal = ref(false)
const cancelTarget = ref(null)
const canceling = ref(false)

function openCancel(o) {
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
function canReview(o) {
  // 1) 必須已付款
  if (!isPaid(o)) return false

  // 2) 必須已完成或已報到（依你 UI 規則）
  const s = uiStatus(o)
  if (s !== '已完成' && s !== '已報到') return false

  // 3) 已評論就不能再評論
  if ((o.IsReviewed ?? o.isReviewed) === true) return false

  return true
}
async function confirmCancel() {
  if (!cancelTarget.value || canceling.value) return
  canceling.value = true

  try {
    const id = getBookingId(cancelTarget.value)
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
  const id = getBookingId(o)

  router.push({
    name: 'courses-booking-success',
    query: {
      bookingId: id,                 //  這個是關鍵（給 QR 用）
      orderId: displayBkNo(o),       // 顯示用（可留）
      course: (o.CourseName ?? o.courseName ?? '').toString(),
      date: formatDate(getStartTime(o)),
      time: formatTime(getStartTime(o)),
      price: getFinalPrice(o),
    },
  })
}

function goPay(o) {
  const id = Number(o.CourseBookingId ?? o.courseBookingId ?? 0)
  if (!id) return alert('找不到 bookingId')

  localStorage.removeItem('pending_booking')
  paymentStore.setBooking(id)

  router.push({ name: 'courses-booking-payment' })
}
function goReview(o) {
  const id = Number(o.CourseBookingId ?? o.courseBookingId ?? 0)
  if (!id) return alert('找不到 bookingId')

  reviewStore.setBooking(id)
  router.push({ name: 'courses-review' })
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
          <div class="order-card" v-for="o in orders" :key="getBookingId(o)">
            <div class="order-left">
              <h5 class="course-title">{{ o.CourseName ?? o.courseName }}</h5>
              <p>教練：{{ o.CoachName ?? o.coachName }}</p>
              <p>
                時間：{{ formatDate(getStartTime(o)) }} {{ formatTime(getStartTime(o)) }}
              </p>
              <p>訂單編號：{{ displayBkNo(o) }}</p>
            </div>

            <div class="order-right">
              <div class="meta-row">
                <span class="badge" :class="isPaid(o) ? 'paid' : 'unpaid'">
                  {{ getPayment(o) || '（未提供付款狀態）' }}
                </span>

                <span
  class="status"
  :class="{
    upcoming: uiStatus(o) === '即將到來',
    cancel: uiStatus(o) === '已取消',
    checkin: uiStatus(o) === '已報到' || uiStatus(o) === '已完成',
  }"
>
  {{ uiStatus(o) }}
</span>
              </div>

              <div class="price">NT$ {{ getFinalPrice(o) }}</div>

              <div class="btn-group">
                <button class="detail-btn" @click="goDetail(o)">查看詳情</button>

              <button v-if="canPay(o)" class="pay-btn" @click="goPay(o)">
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
  v-else-if="canReview(o) && (o.IsReviewed ?? o.isReviewed)"
  class="review-btn disabled"
  disabled
>
  已評論
</button>
                <!-- 已報到 或 已完成 + 未評論 -->
               <button
  v-else-if="canReview(o) && !(o.IsReviewed ?? o.isReviewed)"
  class="review-btn"
  @click="goReview(o)"
>
  去評論
</button>

                <button
                  class="cancel-btn"
                  :disabled="!canCancel(o)"
                  @click="canCancel(o) ? openCancel(o) : alert(uiStatus(o)==='已完成' ? '課程已結束，無法取消' : '開課前 5 小時內不可取消')"
                >
                  取消預約
                </button>
              </div>

             <small v-if="uiStatus(o) === '即將到來' && !canCancel(o)" class="hint">
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
            <span class="v">{{ cancelTarget.CourseName ?? cancelTarget.courseName }}</span>
          </div>
          <div class="row">
            <span class="k">時間</span>
            <span class="v">
              {{ formatDate(getStartTime(cancelTarget)) }}
              {{ formatTime(getStartTime(cancelTarget)) }}
            </span>
          </div>
          <div class="row">
            <span class="k">訂單</span>
            <span class="v">{{ displayBkNo(cancelTarget) }}</span>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-base btn-gray" @click="closeCancel" :disabled="canceling">
          先不要
        </button>
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
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.order-left h5 {
  margin-bottom: 6px;
  font-weight: 800;
  color: #111827;
}

.order-left p {
  font-size: 14px;
  margin: 2px 0;
  color: #6b7280;
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
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  line-height: 1.2;
  white-space: nowrap;
  border: 1px solid transparent;
}

/*  付款狀態：改成中性灰，不搶主色 */
.badge.paid {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

.badge.unpaid {
  background: #fff;
  color: #6b7280;
  border-color: #e5e7eb;
}

/*  狀態：橘色只留給「上課相關主狀態」 */
.status.upcoming {
  background: #fff7ed;
  color: #c2410c;
  border-color: #fdba74;
}

/*  你要的：已完成 -> 和已報到同系列（橘系），但可用深淺區分 */
.status.checkin {
  background: #fff7ed;
  color: #ea580c;
  border-color: #fdba74;
}

.status.done {
  background: #ffedd5;      /* 比已報到再深一點點 */
  color: #9a3412;           /* 橘棕 */
  border-color: #fb923c;
}

.status.cancel {
  background: #f3f4f6;
  color: #6b7280;
  border-color: #e5e7eb;
}

/* =========================
   Price
========================= */
.price {
  font-weight: 900;
  color: #111827;
}

/* =========================
   Buttons (統一風格：橘色只留一顆主按鈕)
========================= */
.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.detail-btn,
.review-btn,
.pay-btn,
.cancel-btn {
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  min-width: 88px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;
}

/* ✅ 次要：查看詳情（中性灰） */
.detail-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

/* ✅ 主按鈕：統一用你的主橘（去付款 / 去評論 都用同一顆） */
.pay-btn
 {
  background:  #ff9f1c;;
  color: #fff;
  border: 1px solid #ff9f1c;
}
.pay-btn:hover {
  background-color: #f38d00;
}
.review-btn {
  background: #f3722c;
  color: #fff;
  border: 1px solid #f3722c;
}

.review-btn:hover  {
 background-color: #d65a1a;
  
}

/* ✅ 取消：改成「淡紅外框」不搶戲 */
.cancel-btn {
  background: #fff;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.detail-btn:hover,
.pay-btn:hover,
.review-btn:hover {
  filter: brightness(0.98);
}

.cancel-btn:hover {
  background: #fef2f2;
}

.detail-btn:active,
.pay-btn:active,
.review-btn:active,
.cancel-btn:active {
  transform: translateY(1px);
}

.review-btn.disabled {
  background: #f3f4f6;
  color: #9ca3af;
  border: 1px solid #e5e7eb;
  cursor: not-allowed;
}

/* =========================
   Hint
========================= */
.hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  text-align: right;
}

.cancel-btn:disabled,
.detail-btn:disabled,
.pay-btn:disabled,
.review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* =========================
   Modal
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
  font-weight: 900;
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
  font-weight: 800;
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
  font-weight: 900;
  font-size: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-gray {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #111827;
}

.btn-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}
</style>
