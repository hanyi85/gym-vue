<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import BookingStepper from '@/components/Course/BookingStepper.vue'
const route = useRoute()
const router = useRouter()

const courseName = '燃脂體能課程'
const coach = route.query.coach
const date = route.query.date
const time = route.query.time
const price = 400
const discountCode = 'FIT2026'
const discountAmount = 100
const finalPrice = price - discountAmount

const name = ref('')
const phone = ref('')
const note = ref('')
const agree = ref(false)

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
      date,
      time,
      coach,
      name: name.value,
      phone: phone.value,
      price: finalPrice,
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
        <span>{{ courseName }}</span>
      </div>
      <div class="info-row">
        <span>預約日期</span>
        <span>{{ date }}</span>
      </div>
      <div class="info-row">
        <span>預約時間</span>
        <span>{{ time }}</span>
      </div>
      <div class="info-row">
        <span>授課教練</span>
        <span>{{ coach }}</span>
      </div>
      <div class="info-row">
        <span>原價</span>
        <span>NT$ {{ price }}</span>
      </div>
      <div class="info-row discount">
  <span>折扣碼</span>
  <span>{{ discountCode }} (-NT$ {{ discountAmount }})</span>
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

      <div class="btn-row">
        <button class="back-btn" @click="$router.back()">上一步</button>
        <button class="next-btn" @click="goNext()">前往付款</button>
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

