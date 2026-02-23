<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'

const route = useRoute()
const router = useRouter()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

const scheduleId = Number(route.query.scheduleId || 0)
const discountCodeQuery = (route.query.discountCode || '').toString().trim()


const name = (route.query.name || '').toString()
const phone = (route.query.phone || '').toString()
const note = (route.query.note || '').toString()

const paymentMethod = ref('credit')


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

const loading = ref(false)

const toast = ref({ show: false, text: '', type: 'error' })
let toastTimer = null
function showToast(text, type = 'error') {
  toast.value = { show: true, text, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 2400)
}

const payBtnText = computed(() => {
  if (paymentMethod.value === 'credit') return '前往藍新付款'
  if (paymentMethod.value === 'cash') return '現金付款'
  return '產生 ATM 轉帳資訊'
})

onMounted(async () => {

  if (!scheduleId) {
    showToast('缺少 scheduleId，請重新選擇時段')
    setTimeout(() => router.back(), 600)
    return
  }

  loading.value = true
  try {
    const qs = discountCodeQuery
      ? `?code=${encodeURIComponent(discountCodeQuery)}`
      : ''

    const res = await api.get(`/CCourses/payment-summary/${scheduleId}${qs}`)
    summary.value = res.data
  } catch (err) {
    showToast(err.response?.data || err.message)
  //  setTimeout(() => router.back(), 800)
  } finally {
    loading.value = false
  }
})

function goPay() {
  router.push({
    name: 'courses-booking-success',
    query: {
      scheduleId: summary.value.scheduleId,
      course: summary.value.courseName,
      date: summary.value.date,
      time: summary.value.time,
      coach: summary.value.coachName,
      originPrice: summary.value.originPrice,
      discountCode: summary.value.discountCode,
      discountAmount: summary.value.discountAmount,
      price: summary.value.finalPrice,

      
      name,
      phone,
      note,

      // 暫時的 orderId（之後改後端回傳）
      orderId: 'BK' + Date.now(),
      paymentMethod: paymentMethod.value,
    },
  })
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
          <button class="pay-btn" :disabled="loading" @click="goPay">
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
  color: #2563eb;
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
