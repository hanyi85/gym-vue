<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'
import { useBookingFlowStore } from '@/stores/Course/bookingFlowStore'
import { usePaymentStore } from '@/stores/Course/paymentStore'

const route = useRoute()
const router = useRouter()

const flow = useBookingFlowStore()
const paymentStore = usePaymentStore()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// ===== UI state =====
const paymentMethod = ref('credit')
const loading = ref(true)
const paying = ref(false)

const toast = ref({ show: false, text: '', type: 'error' })
let toastTimer = null
function showToast(text, type = 'error') {
  toast.value = { show: true, text, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value.show = false), 2400)
}

const payBtnText = computed(() => {
  if (paymentMethod.value === 'credit') return '前往藍新付款'
  if (paymentMethod.value === 'cash') return '現金付款'
  return '產生 ATM 轉帳資訊'
})

// ===== data =====
const summary = ref({
  scheduleId: 0,
  courseId: 0,
  courseName: '',
  date: '',
  time: '',
  coachName: '',
  originPrice: 0,
  discountCode: '',
  discountAmount: 0,
  finalPrice: 0,
})

// 後端回來如果是 PascalCase / camelCase 都吃
function normalizeSummary(data) {
  return {
    scheduleId: data.scheduleId ?? data.ScheduleId ?? 0,
    courseId: data.courseId ?? data.CourseId ?? 0,
    courseName: data.courseName ?? data.CourseName ?? '',
    date: data.date ?? data.Date ?? '',
    time: data.time ?? data.Time ?? '',
    coachName: data.coachName ?? data.CoachName ?? '',
    originPrice: Number(data.originPrice ?? data.OriginPrice ?? 0),
    discountCode: data.discountCode ?? data.DiscountCode ?? '',
    discountAmount: Number(data.discountAmount ?? data.DiscountAmount ?? 0),
    finalPrice: Number(data.finalPrice ?? data.FinalPrice ?? 0),
  }
}

// ===== load summary by bookingId (from store) =====
async function loadPaymentSummaryByBookingId(bookingId) {
  const res = await api.get(`/coursebookings/${bookingId}/payment-summary`, {
    params: { userId: 1 }, //  先寫死
  })
  summary.value = normalizeSummary(res.data || {})
}

// 建立表單並自動送到藍新
function postToNewebPay(payload) {
  const url = payload.GatewayUrl || payload.gatewayUrl
  const merchantId = payload.MerchantID || payload.merchantID
  const tradeInfo = payload.TradeInfo || payload.tradeInfo
  const tradeSha = payload.TradeSha || payload.tradeSha
  const version = payload.Version || payload.version

  if (!url || !merchantId || !tradeInfo || !tradeSha || !version) {
    console.error('NewebPay payload missing fields:', payload)
    showToast('藍新參數缺少（欄位大小寫不一致），請看 Console')
    return
  }

  const form = document.createElement('form')
  form.method = 'POST'
  form.action = url

  const add = (name, value) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  add('MerchantID', merchantId)
  add('TradeInfo', tradeInfo)
  add('TradeSha', tradeSha)
  add('Version', version)

  document.body.appendChild(form)
  form.submit()
}

// ===== mount =====
onMounted(async () => {
  loading.value = true
  try {
    //  從 session 還原（避免重整遺失）
    paymentStore.loadFromSession()

    const bookingId = Number(paymentStore.bookingId || 0)
    if (!bookingId) {
      alert('付款資訊遺失')
      router.back()
      return
    }

    await loadPaymentSummaryByBookingId(bookingId)
  } catch (err) {
    console.error(err)
    showToast(err?.response?.data || err?.message || '載入付款資訊失敗')
  } finally {
    loading.value = false
  }
})

// ===== pay action =====
async function goPay() {
  if (paying.value) return

  const finalPrice = Number(summary.value.finalPrice || 0)
  if (!finalPrice || finalPrice <= 0) {
    showToast('金額不正確，請重新選擇')
    return
  }

  // 非信用卡：直接到 success（你可自行調整）
  if (paymentMethod.value !== 'credit') {
    router.push({ name: 'courses-booking-success' })
    return
  }

  paying.value = true
  try {
    const sid = Number(summary.value.scheduleId || 0)
    if (!sid) {
      showToast('找不到 scheduleId，請回上一頁重新選擇')
      return
    }

    // 只用 store bookingId（不讀網址）
    let bookingId = Number(paymentStore.bookingId || 0)

    // 若你有「從選課/預約流程」進來但還沒建單的情境，就建立 pending
    //    （如果你確定永遠從訂單頁進來 already has bookingId，也可以把這段刪掉）
    if (!bookingId) {
      const pendingRes = await api.post('/CourseBookings/pending', {
        ScheduleId: sid,
        UserId: 1,
        FinalPrice: finalPrice,
        DiscountAmount: Number(summary.value.discountAmount || 0),
        DiscountId: null,
      })

      bookingId =
        pendingRes.data?.CourseBookingId ??
        pendingRes.data?.courseBookingId ??
        0

      if (bookingId) paymentStore.setBooking(bookingId)
    }

    if (!bookingId) {
      showToast('建立/取得訂單失敗，bookingId 為空')
      return
    }

    const merchantOrderNo = `BK${String(bookingId).padStart(9, '0')}`

    const res = await api.post('/Payment/newebpay/create', {
      OrderId: merchantOrderNo,
      Amount: finalPrice,
      ItemDesc: summary.value.courseName || '課程訂單',
    })

    //  success 頁顯示用 & 產 QR 用（不要放 URL）
    localStorage.setItem(
      'pending_booking',
      JSON.stringify({
        bookingId,
        scheduleId: sid,
        courseId: summary.value.courseId,
        course: summary.value.courseName,
        date: summary.value.date,
        time: summary.value.time,
        price: finalPrice,
        coach: summary.value.coachName,
        name: flow.name,
        phone: flow.phone,
        note: flow.note,
      })
    )

    postToNewebPay(res.data)
  } catch (err) {
    console.error(err)
    showToast(err?.response?.data || err?.message || '付款失敗')
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Toast -->
    <div v-if="toast.show" class="toast-center" :class="toast.type">
      {{ toast.text }}
    </div>

    <div class="booking-title">
      <h2>課程預約系統</h2>
      <p>請選擇付款方式</p>
    </div>

    <BookingStepper :current-step="3">
      <template #step-1>選日期<br />及時段</template>
      <template #step-2>確認資訊</template>
      <template #step-3>付款</template>
      <template #step-4>完成預約</template>
    </BookingStepper>

    <div class="payment-layout">
      <!-- 左：訂單摘要 -->
      <div class="confirm-card">
        <h4>訂單摘要</h4>

        <div v-if="loading" class="loading-text">載入中...</div>

        <template v-else>
          <div class="info-row"><span>課程</span><span>{{ summary.courseName }}</span></div>
          <div class="info-row"><span>日期</span><span>{{ summary.date }}</span></div>
          <div class="info-row"><span>時間</span><span>{{ summary.time }}</span></div>
          <div class="info-row"><span>教練</span><span>{{ summary.coachName }}</span></div>

          <div class="info-row">
            <span>原價</span>
            <span>NT$ {{ summary.originPrice }}</span>
          </div>

          <div class="info-row discount">
            <span>折扣碼</span>
            <span v-if="summary.discountCode">
              {{ summary.discountCode }}（-NT$ {{ summary.discountAmount }}）
            </span>
            <span v-else class="muted">未使用</span>
          </div>

          <div class="info-row total">
            <span>應付金額</span>
            <span>NT$ {{ summary.finalPrice }}</span>
          </div>
        </template>
      </div>

      <!-- 右：付款方式 -->
      <div class="confirm-card">
        <h4>付款方式</h4>

        <label class="pay-option">
          <input type="radio" value="credit" v-model="paymentMethod" />
          信用卡（藍新）
        </label>

        <label class="pay-option">
          <input type="radio" value="cash" v-model="paymentMethod" />
          現金付款
        </label>

        <label class="pay-option">
          <input type="radio" value="atm" v-model="paymentMethod" />
          ATM 轉帳
        </label>

       <div class="btn-row">
  <button class="back-btn" @click="$router.back()">上一步</button>
  <button
    class="pay-btn"
    :disabled="loading || paying"
    @click="goPay"
  >
    {{ payBtnText }}
  </button>
</div>
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
  margin-bottom: 24px;
}

.booking-title h2 {
  font-size: 28px;
  font-weight: 700;
}

.booking-title p {
  color: #6b7280;
  font-size: 14px;
}


.payment-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.confirm-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 24px;
  background: white;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}


.info-row.discount span:last-child {
  color: #ef4444; 
  font-weight: 600;
}


.total {
  font-weight: bold;
  color: #d97706;
}

.pay-option {
  display: block;
  margin: 12px 0;
  font-size: 14px;
}

.btn-row {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.back-btn {
  flex: 1;
  background: #f3f4f6;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.pay-btn {
  flex: 2;
  background: #ff9f1c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
}
</style>
