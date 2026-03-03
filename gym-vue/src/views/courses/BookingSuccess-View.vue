<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'
import { usePaymentStore } from '@/stores/Course/paymentStore'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// ===== 顯示用 =====
const bookingNo = ref('') // BK000000123（顯示）
const tradeNo = ref('') // NP...
const bookingId = ref(0) // 真實 bookingId（給 QR / 報到驗證用）

const course = ref('')
const date = ref('')
const time = ref('')
const price = ref(0)

const saving = ref(false)

// ✅ 付款狀態（關鍵）
const paidFlag = ref(false)        // 前端判斷是否顯示 QR
const checkingPaid = ref(false)    // 查詢中（顯示 loading）

// ===== API helpers =====
async function createBookingFromPending(p) {
  const payload = {
    ScheduleId: p.scheduleId,
    UserId: 1, // 先假登入
    PaymentMethod: '信用卡',
    FinalPrice: p.price,
    DiscountAmount: 0,
    DiscountId: null,
  }
  const res = await api.post('/CourseBookings', payload)
  return res.data?.CourseBookingId ?? res.data?.courseBookingId ?? 0
}

// ✅ 用 bookingId 去後端確認是否已付款（防止 query 被改）
async function refreshPaidByBookingId(id) {
  if (!id) return false
  checkingPaid.value = true
  try {
    // 你後端路由可能是 /CourseBookings/{id} 或 /coursebookings/{id}
    // 先試第一個，失敗再試第二個
    let data = null
    try {
      const r1 = await api.get(`/CourseBookings/${id}`)
      data = r1.data
    } catch {
      const r2 = await api.get(`/coursebookings/${id}`)
      data = r2.data
    }

    const pay = (data?.PaymentStatus ?? data?.paymentStatus ?? '').toString()
    paidFlag.value = pay.includes('已付款')
    return paidFlag.value
  } catch (e) {
    // 查不到就保持目前 paidFlag（但後端 checkin 已擋未付款，安全性仍OK）
    console.warn('refreshPaidByBookingId failed', e)
    return paidFlag.value
  } finally {
    checkingPaid.value = false
  }
}

async function getBookingIdBySchedule(scheduleId) {
  const r = await api.get('/Payment/booking-id-by-schedule', {
    params: { scheduleId, userId: 1 },
  })
  return r.data?.courseBookingId ?? r.data?.CourseBookingId ?? 0
}

// ===== utils =====
function toBkNo(id) {
  const n = Number(id)
  return n > 0 ? 'BK' + String(n).padStart(9, '0') : ''
}

function applyQueryBasics() {
  course.value = (route.query.course || '').toString()
  date.value = (route.query.date || '').toString()
  time.value = (route.query.time || '').toString()
  price.value = Number(route.query.price || 0)

  const qOrderId = (route.query.orderId || '').toString()
  if (qOrderId) {
    if (qOrderId.startsWith('BK')) bookingNo.value = qOrderId
    else tradeNo.value = qOrderId
  }

  // ✅ bookingId
  const qBookingId = Number(route.query.bookingId || 0)
  if (qBookingId > 0) {
    bookingId.value = qBookingId
    bookingNo.value = toBkNo(qBookingId)
  }

  // ✅ paid 兼容：history 帶 '1'/'0'，舊流程可能帶 'true'
  const qPaid = (route.query.paid || '').toString()
  if (qPaid === '1' || qPaid.toLowerCase() === 'true') paidFlag.value = true
  if (qPaid === '0' || qPaid.toLowerCase() === 'false') paidFlag.value = false
}

// ===== 去付款（未付款用）=====
function goPayFromHere() {
  if (!bookingId.value) return alert('找不到 bookingId，請回訂單頁重新操作')
  paymentStore.setBooking(bookingId.value)
  router.push({ name: 'courses-booking-payment' })
}

// ===== main flow =====
onMounted(async () => {
  console.log('booking-success mounted', route.fullPath)

  applyQueryBasics()

  try {
    // ✅ 1) pending_booking（通常是付款流程完成後來這頁）
    const raw = localStorage.getItem('pending_booking')
    if (raw) {
      const p = JSON.parse(raw)

      // 顯示資訊不夠就用 pending 補
      if (!course.value) course.value = p.course || ''
      if (!date.value) date.value = p.date || ''
      if (!time.value) time.value = p.time || ''
      if (!price.value) price.value = Number(p.price || 0)

      // ✅ 付款成功流程：基本上視為已付款（但仍用 API 再確認一次更穩）
      paidFlag.value = true

      if (p.bookingId) {
        const id = Number(p.bookingId || 0)
        if (id) {
          bookingId.value = id
          bookingNo.value = toBkNo(id)
          await refreshPaidByBookingId(id)
        }
        localStorage.removeItem('pending_booking')
      } else {
        // ⚠️ 尚未建單才需要 create
        const lockKey = `booking_created_${p.scheduleId}_${p.price}`
        const cached = sessionStorage.getItem(lockKey)

        if (cached) {
          const cachedId = Number(cached.replace('BK', '').trim())
          if (cachedId > 0) {
            bookingId.value = cachedId
            bookingNo.value = toBkNo(cachedId)
            await refreshPaidByBookingId(cachedId)
          }
          localStorage.removeItem('pending_booking')
        } else {
          saving.value = true
          try {
            const id = await createBookingFromPending(p)
            if (id) {
              sessionStorage.setItem(lockKey, toBkNo(id))
              bookingId.value = id
              bookingNo.value = toBkNo(id)
              await refreshPaidByBookingId(id)
              localStorage.removeItem('pending_booking')
            }
          } finally {
            saving.value = false
          }
        }
      }

      return
    }

    // ✅ 2) 相容：舊 return 可能用 scheduleId 查 bookingId
    const paid = (route.query.paid || '').toString().toLowerCase() === 'true'
    const scheduleId = Number(route.query.scheduleId || 0)

    if (paid && scheduleId) {
      paidFlag.value = true
      const id = await getBookingIdBySchedule(scheduleId)
      if (id) {
        bookingId.value = id
        bookingNo.value = toBkNo(id)
        await refreshPaidByBookingId(id)
      }
      return
    }

    // ✅ 3) 從訂單列表點進來：一定會有 bookingId（你已經帶了）
    // 這邊做雙保險：用 bookingId 反查付款狀態，避免 paid query 被亂改
    if (bookingId.value > 0) {
      await refreshPaidByBookingId(bookingId.value)
    }
  } catch (err) {
    console.error(err)
  } finally {
    paymentStore.clear()
  }
})

// ===== QR Code =====
const qrValue = computed(() =>
  JSON.stringify({
    bookingId: bookingId.value,
  })
)

// ✅ 只有「有bookingId + 已付款」才顯示 QR
const canShowQr = computed(() => bookingId.value > 0 && paidFlag.value)
</script>

<template>
  <div class="page-wrapper">
    <div class="booking-title">
      <div class="success-icon">✓</div>
      <h2>預約成功</h2>
      <p v-if="paidFlag">請於上課時出示 QR Code 報到</p>
      <p v-else>此訂單尚未付款，付款完成後才可出示 QR Code 報到</p>
    </div>

    <div class="success-card">
      <h4>預約資訊</h4>

      <div class="info-row">
        <span>訂單編號</span>
        <span>{{ bookingNo ? bookingNo : (saving ? '建立中...' : '（請至訂單紀錄查看）') }}</span>
      </div>

      <div class="info-row" v-if="tradeNo">
        <span>交易編號</span>
        <span>{{ tradeNo }}</span>
      </div>

      <div class="info-row">
        <span>課程名稱</span>
        <span>{{ course }}</span>
      </div>
      <div class="info-row">
        <span>日期</span>
        <span>{{ date }}</span>
      </div>
      <div class="info-row">
        <span>時間</span>
        <span>{{ time }}</span>
      </div>
      <div class="info-row">
        <span>費用</span>
        <span>NT$ {{ price }}</span>
      </div>

      <hr />

      <div class="qr-section">
        <h5>報到 QR Code</h5>

        <!-- ✅ 已付款才顯示 QR -->
        <div v-if="checkingPaid" class="qr-loading">確認付款狀態中...</div>

        <div v-else-if="canShowQr" class="qr-box">
          <QrcodeVue :value="qrValue" :size="240" level="M" />
          <p class="hint">現場掃描即可完成報到</p>
        </div>

        <!-- ❌ 未付款 -->
        <div v-else class="qr-loading">
          <p class="hint">尚未付款，無法產生報到 QR Code</p>
          <button class="primary-btn" style="margin-top: 10px" @click="goPayFromHere">
            去付款
          </button>
        </div>
      </div>

      <div class="btn-row">
        <button class="outline-btn" @click="router.push('/')">回首頁</button>
        <button class="primary-btn" @click="router.push('/courses/booking-history')">
          查看我的預約
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.qr-box {
  background: #fff;
  padding: 14px;
  display: inline-block;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}
.qr-loading {
  color: #888;
  padding: 18px 0;
}
.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}

.booking-title {
  text-align: center;
  margin-bottom: 32px;
}

.success-icon {
  width: 56px;
  height: 56px;
  background: #ff8a00;
  color: white;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.booking-title h2 {
  font-size: 28px;
  font-weight: 700;
}

.booking-title p {
  color: #6b7280;
  font-size: 14px;
}

.success-card {
  max-width: 520px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.qr-section {
  text-align: center;
  margin-top: 20px;
}

.qr-section h5 {
  margin-bottom: 12px;
}

.hint {
  margin-top: 8px;
  font-size: 13px;
  color: #666;
}

.btn-row {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.outline-btn {
  flex: 1;
  background: #f3f4f6;
  border: none;
  padding: 10px;
  border-radius: 6px;
}

.primary-btn {
  flex: 1;
  background: #ff8a00;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
}
</style>
