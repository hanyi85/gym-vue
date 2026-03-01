<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'
import { useBookingFlowStore } from '@/stores/Course/bookingFlowStore'

const route = useRoute()
const router = useRouter()
const flow = useBookingFlowStore()

const courseSlug = computed(() => route.params.slug || '')
const scheduleId = computed(() => Number(route.params.scheduleId || 0))

const api = axios.create({
  baseURL: 'https://localhost:7218/api'
})

const booking = ref({
  scheduleId: 0,
  courseId: 0,
  courseName: '',
  price: 0,
  date: '',
  time: '',
  full: false,
  canEnroll: false,
  coachName: ''
})


const name = ref('')
const phone = ref('')
const phoneError = ref('')

function validatePhone() {
  const raw = (phone.value || '').trim()
  const normalized = raw.replace(/\s|-/g, '') 
  const ok = /^09\d{8}$/.test(normalized)

  if (!raw) {
    phoneError.value = '請填寫手機號碼'
    return false
  }

  if (!ok) {
    phoneError.value = '手機格式錯誤（請輸入 09 開頭共 10 碼）'
    return false
  }

  phoneError.value = ''
  phone.value = normalized 
  return true
}
const nameError = ref('')

function validateName() {
  const raw = (name.value || '').trim()
  if (!raw) {
    nameError.value = '請填寫姓名'
    return false
  }
  nameError.value = ''
  name.value = raw
  return true
}
const toast = ref({ show: false, text: '', type: 'error', leaving: false })
let toastTimer = null

function showToast(text, type = 'error') {
  toast.value = { show: true, text, type, leaving: false }

  if (toastTimer) clearTimeout(toastTimer)

  toastTimer = setTimeout(() => {
    toast.value.leaving = true
    setTimeout(() => {
      toast.value.show = false
      toast.value.leaving = false
    }, 250) 
  }, 3500)
}
const note = ref('')
const agree = ref(false)


const discountCode = ref('')
const discountAmount = ref(0)

const finalPrice = computed(() => {
  const p = Number(booking.value.price || 0)
  const d = Number(discountAmount.value || 0)
  return Math.max(0, p - d)
})

//折扣
const discountInput = ref('')
const discountLoading = ref(false)

async function applyDiscount() {
  if (!discountInput.value) {
    showToast('請輸入折扣碼')
    return
  }

  try {
    discountLoading.value = true

    const res = await api.post('/CCourses/apply-discount', {
      scheduleId: booking.value.scheduleId,
      code: discountInput.value.trim()
    })

    if (res.data.ok) {
      discountCode.value = res.data.discountCode
      discountAmount.value = res.data.discountAmount
      showToast('折扣套用成功', 'success')
    }

  } catch (err) {
    discountCode.value = ''
    discountAmount.value = 0
    showToast(err.response?.data || '折扣碼錯誤')
  } finally {
    discountLoading.value = false
  }
}
//取消折扣
function clearDiscount() {
  discountCode.value = ''
  discountAmount.value = 0
  discountInput.value = ''
}

onMounted(async () => {
  if (!scheduleId.value) {
    showToast('缺少 scheduleId，請重新選擇時段')
    router.back()
    return
  }

  try {
    const res = await api.get(`/CCourses/schedule-detail/${scheduleId.value}`)
    booking.value = res.data
  } catch (err) {
    showToast(err.response?.data || err.message)
    router.back()
  }
})

function goNext() {
  const nameOk = validateName()
  const phoneOk = validatePhone()

  if (!nameOk) showToast(nameError.value)
  else if (!phoneOk) showToast(phoneError.value || '手機格式錯誤')
  else if (!agree.value) showToast('請勾選同意條款')

  if (!nameOk || !phoneOk || !agree.value) return

  // 把資料存進 Pinia
  flow.setStep2Payload({
    slug: courseSlug.value,
    scheduleId: booking.value.scheduleId,
    name: name.value,
    phone: phone.value,
    note: note.value,
    discountCode: discountCode.value,
    discountAmount: discountAmount.value,
    price: booking.value.price,
    finalPrice: finalPrice.value,
  })

  showToast('資料已確認，前往付款', 'success')

  setTimeout(() => {
    router.push({
      name: 'courses-booking-payment',
      params: {
        slug: courseSlug.value,
        scheduleId: booking.value.scheduleId,
      },
    })
  }, 350)
}
</script>

<template>
  
  <div class="page-wrapper">
     <div
  v-if="toast.show"
  class="toast-center"
  :class="[toast.type, { leaving: toast.leaving }]"
>
  {{ toast.text }}
</div>
    <div class="booking-title">
      <h2>課程預約系統</h2>
      <p>請確認預約資訊</p>
    </div>

     <BookingStepper :current-step="2">
      <template #step-1>選日期<br />及時段</template>
      <template #step-2>確認資訊</template>
      <template #step-3>付款</template>
      <template #step-4>完成預約</template>
    </BookingStepper>

    <div class="confirm-card">
      <h4>確認預約資訊</h4>
      
      <div class="info-row">
        <span>課程名稱</span>
        <span>{{ booking.courseName }}</span>
      </div>
      <div class="info-row">
        <span>預約日期</span>
        <span>{{ booking.date }}</span>
      </div>
      <div class="info-row">
        <span>預約時間</span>
        <span>{{ booking.time }}</span>
      </div>
      <div class="info-row">
        <span>授課教練</span>
        <span>{{ booking.coachName }}</span>
      </div>
      <div class="info-row">
        <span>原價</span>
       <span>NT$ {{ booking.price }}</span>
      </div>
  <div class="info-row discount-line">
  <span class="discount-label">折扣碼</span>

  <div class="discount-right">
    <div class="discount-input-wrap">
      <input
        v-model="discountInput"
        class="form-control discount-input"
        placeholder="請輸入折扣碼"
      />

      <button
        class="apply-btn orange"
        :disabled="discountLoading"
        @click="applyDiscount"
      >
        {{ discountLoading ? '套用中...' : '套用' }}
      </button>
    </div>

    <div v-if="discountCode" class="discount-success-wrap">
      <span>已套用 {{ discountCode }}（-NT$ {{ discountAmount }}）</span>
      <button class="clear-discount-btn" @click="clearDiscount">取消</button>
    </div>

    <div v-else class="discount-muted">未使用</div>
  </div>
</div>
      <div class="info-row total">
        <span>應付金額</span>
        <span>NT$ {{ finalPrice }}</span>
      </div>
      <hr />

      <h5>聯絡資訊</h5>

   <div class="form-row">
  <label :class="{ 'label-error': nameError }">姓名 *</label>
  <input
    v-model="name"
    class="form-control"
     :class="{ 'input-error': nameError }"
    placeholder="請輸入姓名"
    @blur="validateName"
    @input="nameError = ''"
  />
  <p v-if="nameError" class="field-error" >{{ nameError }}</p>
</div>

     <div class="form-row">
  <label :class="{ 'label-error': phoneError }">手機 *</label>
  <input
    v-model="phone"
    class="form-control"
     :class="{ 'input-error': phoneError }"
    placeholder="09xxxxxxxx"
    inputmode="numeric"
    maxlength="10"
    @blur="validatePhone"
  />
  <p v-if="phoneError" class="field-error">{{ phoneError }}</p>
</div>

      <div class="form-row">
        <label>備註</label>
        <textarea v-model="note" class="form-control" rows="3"></textarea>
      </div>

      <div class="agree-row">
        <input type="checkbox" v-model="agree" />
        <span>我已閱讀並同意相關預約條款</span>
      </div>
<p v-if="booking.full" style="color:red;">
  此時段已額滿
</p>

<p v-else-if="!booking.canEnroll" style="color:red;">
  已超過報名截止時間
</p>
      <div class="btn-row">
    <button class="back-btn" @click="router.push({ name:'courses-booking', params:{ slug: courseSlug } })">
  上一步
</button>
        <button
  class="next-btn"
  :disabled="booking.full || !booking.canEnroll"
  @click="goNext()"
>
  前往付款
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
  margin-bottom: 24px;
}

.confirm-card {
  max-width: 700px;
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

.info-row.discount span:last-child {
  color: #ef4444; 
  font-weight: 600;
}
.info-row.total {
  font-weight: bold;
  color: #d97706;
}

.form-row {
  margin-top: 12px;
}

.form-row label {
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.agree-row {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-row {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}

.back-btn {
  background: #f3f4f6;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
}

.next-btn {
  background: #ff9f1c;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 6px;
  font-weight: bold;
}
.toast-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 9999;

  min-width: 280px;
  max-width: 400px;
  padding: 18px 22px;

  border-radius: 16px;
  font-weight: 700;
  text-align: center;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  border: 1px solid transparent;

animation: fadeInScale 0.4s ease-in-out;
}

.toast-center.error {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #9f1239;
}

.toast-center.success {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #065f46;
}
.toast-center.leaving {
  animation: fadeOutScale 0.25s ease-in;
}
/* 小動畫 */
@keyframes fadeOutScale {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }
}
.input-error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.field-error {
  margin: 6px 0 0;
  font-size: 13px;
  color: #dc2626;
  font-weight: 600;
}
.label-error {
  color: #dc2626;
}
/* 折扣碼整行 */
.discount-line {
  align-items: flex-start; 
  gap: 14px;
}

/* 左邊 label 寬度固定，右邊才不會跑版 */
.discount-label {
  width: 80px;
  flex: 0 0 80px;
}

/* 右邊區塊撐滿 */
.discount-right {
  width: 260px; 
}

/* 輸入框 + 按鈕 同一排 */
.discount-input-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 輸入框吃滿剩餘寬度 */
.discount-input {
  flex: 1;
}

/* 套用按鈕（橘色） */
.apply-btn.orange {
  background: #ff9f1c;  /* 你 next-btn 的橘色 */
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.apply-btn.orange:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 已套用資訊 */
.discount-success-wrap {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #dc2626;
  font-weight: 700;
}

/* 取消按鈕 */
.clear-discount-btn {
  background: transparent;
  border: none;
  color: #666666;
  font-weight: 700;
  cursor: pointer;
}

.clear-discount-btn:hover {
  text-decoration: underline;
}

.discount-muted {
  margin-top: 8px;
  font-size: 14px;
  color: #9ca3af;
}
</style>

