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

//  兩種編號分開存：
// bookingNo = 你系統的訂單編號（BK9）=> 要跟歷史頁一致
// tradeNo   = 藍新交易/訂單編號（NPxxxx）=> 可選顯示
const bookingNo = ref('') // BK9
const tradeNo = ref('')   // NP...

const course = ref('')
const date = ref('')
const time = ref('')
const price = ref(0)

const saving = ref(false)

// 建立 booking 寫入資料庫
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

onMounted(async () => {
  // ✅ 先吃 query：讓畫面永遠有基本資料（不依賴 pending）
  course.value = (route.query.course || '').toString()
  date.value = (route.query.date || '').toString()
  time.value = (route.query.time || '').toString()
  price.value = Number(route.query.price || 0)

  // ✅ orderId 先當成「交易編號」放 tradeNo
  // （如果你哪天把 BK 帶在 query 也可自動辨識）
  const qOrderId = (route.query.orderId || '').toString()
  if (qOrderId.startsWith('BK')) bookingNo.value = qOrderId
  else tradeNo.value = qOrderId

  // ✅ 如果 query 有 bookingId（你未來可以加），直接顯示 BK
  const qBookingId = Number(route.query.bookingId || 0)
  if (!bookingNo.value && qBookingId) bookingNo.value = 'BK' + qBookingId

  // ✅ 再讀 pending：有才建立訂單、拿到 BK
  const raw = localStorage.getItem('pending_booking')
  if (!raw) return

  const p = JSON.parse(raw)

  // 如果 query 沒帶到，就用 pending 補上
  if (!course.value) course.value = p.course || ''
  if (!date.value) date.value = p.date || ''
  if (!time.value) time.value = p.time || ''
  if (!price.value) price.value = Number(p.price || 0)

  // 避免刷新重複建立
  const lockKey = `booking_created_${p.scheduleId}_${p.price}`
  const cachedBk = sessionStorage.getItem(lockKey)
  if (cachedBk) {
    bookingNo.value = cachedBk
    localStorage.removeItem('pending_booking')
    return
  }

  saving.value = true
  try {
    const id = await createBookingFromPending(p)
    bookingNo.value = 'BK' + id
    sessionStorage.setItem(lockKey, bookingNo.value)
    localStorage.removeItem('pending_booking')
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
