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
const bookingId = ref(0) // ✅ 真實 bookingId（給 QR / 報到驗證用）

const course = ref('')
const date = ref('')
const time = ref('')
const price = ref(0)

const saving = ref(false)

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

// 你現在 confirmPaid() 先不做也 OK（真正應該由 notify 更新 DB）
async function confirmPaid() {
  return true
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

  //  把 bookingId 吃進來（不再靠 BK 反推）
  const qBookingId = Number(route.query.bookingId || 0)
  if (qBookingId > 0) {
    bookingId.value = qBookingId
    bookingNo.value = toBkNo(qBookingId) // 保險：確保顯示一致
  }
}
// ===== main flow =====
onMounted(async () => {
  console.log('booking-success mounted', route.fullPath)

  applyQueryBasics()

  try {
    // ✅ 1) 最優先：從 pending_booking 拿 bookingId（不靠 URL）
    const raw = localStorage.getItem('pending_booking')
    if (raw) {
      const p = JSON.parse(raw)

      // 顯示資訊不夠就用 pending 補
      if (!course.value) course.value = p.course || ''
      if (!date.value) date.value = p.date || ''
      if (!time.value) time.value = p.time || ''
      if (!price.value) price.value = Number(p.price || 0)

      // ✅ 如果 Payment 頁已經有 bookingId（從 history 來一定會有），就直接用
      if (p.bookingId) {
        const id = Number(p.bookingId || 0)
        if (id) {
          bookingId.value = id
          bookingNo.value = toBkNo(id)
          await confirmPaid(id)
        }
        localStorage.removeItem('pending_booking')
      } else {
        // ⚠️ 只有「尚未建單」的流程才需要 create（你現在從 history 付款通常不會走到）
        // 用 lock 避免重複建立
        const lockKey = `booking_created_${p.scheduleId}_${p.price}`
        const cached = sessionStorage.getItem(lockKey)

        if (cached) {
          const cachedId = Number(cached.replace('BK', '').trim())
          if (cachedId > 0) {
            bookingId.value = cachedId
            bookingNo.value = toBkNo(cachedId)
            await confirmPaid(cachedId)
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
              await confirmPaid(id)
              localStorage.removeItem('pending_booking')
            }
          } finally {
            saving.value = false
          }
        }
      }

      // ✅ 重要：pending_booking 已處理完就 return（避免下面相容流程又亂改）
      return
    }

    // ✅ 2) 相容：paid=true + scheduleId（舊 return 可能會帶）
    // 但：我們只拿來查 bookingId，不會寫回 URL
    const paid = (route.query.paid || '').toString() === 'true'
    const scheduleId = Number(route.query.scheduleId || 0)

    if (paid && scheduleId) {
      const id = await getBookingIdBySchedule(scheduleId)
      if (id) {
        bookingId.value = id
        bookingNo.value = toBkNo(id)
        await confirmPaid(id)
      }
    }
  } catch (err) {
    console.error(err)
    // 不要整頁掛掉，頂多 QR 顯示「產生中...」
  } finally {
    // ✅ 最後才清 store（確保上面已吃完 pending / bookingId）
    paymentStore.clear()
  }
})

// ===== QR Code =====
const qrValue = computed(() =>
  JSON.stringify({
    bookingId: bookingId.value,
  })
)
const canShowQr = computed(() => bookingId.value > 0)
</script>

<template>
  <div class="page-wrapper">
    <div class="booking-title">
      <div class="success-icon">✓</div>
      <h2>預約成功</h2>
      <p>請於上課時出示 QR Code 報到</p>
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

        <div v-if="canShowQr" class="qr-box">
          <QrcodeVue :value="qrValue" :size="240" level="M" />
        </div>

        <div v-else class="qr-loading">
          QR 產生中...
        </div>

        <p class="hint">現場掃描即可完成報到</p>
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
