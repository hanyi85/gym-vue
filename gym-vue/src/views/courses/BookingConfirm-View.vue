<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'

const route = useRoute()
const router = useRouter()

const scheduleId = Number(route.query.scheduleId)

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
const note = ref('')
const agree = ref(false)


const discountCode = ref('')
const discountAmount = ref(0)

const finalPrice = computed(() => {
  const p = Number(booking.value.price || 0)
  const d = Number(discountAmount.value || 0)
  return Math.max(0, p - d)
})

onMounted(async () => {
  if (!scheduleId) {
    alert('缺少 scheduleId，請重新選擇時段')
    router.back()
    return
  }

  try {
    const res = await api.get(`/CCourses/schedule-detail/${scheduleId}`)
    booking.value = res.data
  } catch (err) {
    alert(err.response?.data || err.message)
    router.back()
  }
})

function goNext() {
  if (!name.value || !phone.value) {
    alert('請填寫聯絡資料')
    return
  }
  if (!agree.value) {
    alert('請勾選同意條款')
    return
  }

  
  router.push({
    name: 'courses-booking-payment',
    query: {
      scheduleId: booking.value.scheduleId,
      name: name.value,
      phone: phone.value,
      note: note.value,
      price: finalPrice.value
    },
  })
}
</script>

<template>
  <div class="page-wrapper">
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
     <div class="info-row discount">
  <span>折扣碼</span>
  <span v-if="discountCode">
    {{ discountCode }} (-NT$ {{ discountAmount }})
  </span>
  <span v-else>未使用</span>
</div>
      <div class="info-row total">
        <span>應付金額</span>
        <span>NT$ {{ finalPrice }}</span>
      </div>

      <hr />

      <h5>聯絡資訊</h5>

      <div class="form-row">
        <label>姓名 *</label>
        <input v-model="name" class="form-control" placeholder="請輸入姓名" />
      </div>

      <div class="form-row">
        <label>手機 *</label>
        <input v-model="phone" class="form-control" placeholder="09xx-xxx-xxx" />
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
        <button class="back-btn" @click="$router.back()">上一步</button>
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
  color: #2563eb;
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
</style>

