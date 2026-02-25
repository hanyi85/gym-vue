<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()
const router = useRouter()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// 顯示用
const bookingNo = ref('') // BKxx
const tradeNo = ref('')   // NP...

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
  return res.data?.CourseBookingId
}

async function confirmPaid(courseBookingId) {
  // demo：後端會直接改成已付款（你之後要換成真的查藍新可再改）
  return api.get('/Payment/newebpay/status', {
    params: { courseBookingId },
  })
}

async function getBookingIdBySchedule(scheduleId) {
  const r = await api.get('/Payment/booking-id-by-schedule', {
    params: { scheduleId, userId: 1 },
  })
  return r.data?.courseBookingId
}

// ===== UI / url helpers =====
function applyQueryBasics() {
  course.value = (route.query.course || '').toString()
  date.value = (route.query.date || '').toString()
  time.value = (route.query.time || '').toString()
  price.value = Number(route.query.price || 0)

  const qOrderId = (route.query.orderId || '').toString()
  if (qOrderId.startsWith('BK')) bookingNo.value = qOrderId
  else tradeNo.value = qOrderId
}

function syncBookingIdToUrl(id) {
  // 避免無限 replace：只有當 url 上的 bookingId 不同才 replace
  const current = Number(route.query.bookingId || 0)
  if (current === id) return

  router.replace({
    path: route.path,
    query: { ...route.query, bookingId: id, paid: 'true' },
  })
}

async function markPaidAndSyncUrl(id) {
  if (!id) return
  try {
    await confirmPaid(id)
  } catch (err) {
    console.error('confirmPaid failed', err)
  } finally {
    bookingNo.value = 'BK' + id
    syncBookingIdToUrl(id)
  }
}

// ===== main flow =====
onMounted(async () => {
  console.log('booking-success mounted', route.fullPath)

  applyQueryBasics()

  const paid = (route.query.paid || '').toString() === 'true'
  const scheduleId = Number(route.query.scheduleId || 0)
  const qBookingId = Number(route.query.bookingId || 0)

  // 1) 如果網址已經有 bookingId：直接更新付款 & 同步顯示
  if (qBookingId) {
    await markPaidAndSyncUrl(qBookingId)
    // 不 return，讓下面也能補資料（如果 query 缺 course/date/time/price）
  }

  // 2) 若沒有 bookingId 但 paid=true 且有 scheduleId：用 scheduleId 找最新那筆 bookingId
  if (!qBookingId && paid && scheduleId) {
    try {
      const id = await getBookingIdBySchedule(scheduleId)
      if (id) await markPaidAndSyncUrl(id)
    } catch (err) {
      console.error('getBookingIdBySchedule failed', err)
    }
  }

  // 3) 如果有 pending_booking：建立訂單（避免重複建立）
  const raw = localStorage.getItem('pending_booking')
  if (!raw) return

  const p = JSON.parse(raw)

  // query 沒帶到就用 pending 補上
  if (!course.value) course.value = p.course || ''
  if (!date.value) date.value = p.date || ''
  if (!time.value) time.value = p.time || ''
  if (!price.value) price.value = Number(p.price || 0)

  const lockKey = `booking_created_${p.scheduleId}_${p.price}`
  const cachedBk = sessionStorage.getItem(lockKey)

  if (cachedBk) {
    bookingNo.value = cachedBk
    localStorage.removeItem('pending_booking')

    const cachedId = Number(cachedBk.replace('BK', ''))
    if (cachedId) await markPaidAndSyncUrl(cachedId)
    return
  }

  saving.value = true
  try {
    const id = await createBookingFromPending(p)
    if (id) {
      sessionStorage.setItem(lockKey, 'BK' + id)
      localStorage.removeItem('pending_booking')
      await markPaidAndSyncUrl(id)
    }
  } catch (err) {
    console.error(err)
    alert(err.response?.data || err.message)
  } finally {
    saving.value = false
  }
})

// QR Code：主放 BK + tradeNo
const qrValue = computed(() =>
  JSON.stringify({
    bookingNo: bookingNo.value,
    tradeNo: tradeNo.value,
    course: course.value,
    date: date.value,
    time: time.value,
    price: price.value,
  })
)
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
        <QrcodeVue :value="qrValue" :size="160" />
        <p class="hint">現場掃描即可完成報到</p>
      </div>

      <div class="btn-row">
        <button class="outline-btn" @click="router.push('/')">
          回首頁
        </button>
        <button class="primary-btn" @click="router.push('/courses/booking-history')">
          查看我的預約
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
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
