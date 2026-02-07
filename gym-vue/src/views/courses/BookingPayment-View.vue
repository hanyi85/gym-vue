<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import BookingStepper from '@/components/Course/BookingStepper.vue'

const route = useRoute()
const router = useRouter()

const course = route.query.course || '燃脂體能課程'
const date = route.query.date || '2026-02-03'
const time = route.query.time || '10:00'
const coach = route.query.coach || 'Amy'

const originPrice = 400
const discount = 100
const finalPrice = originPrice - discount

const paymentMethod = ref('credit')

function goPay() {
  router.push({
    name: 'courses-booking-success',
    query: {
      orderId: 'BK20260203001',
      course,
      date,
      time,
      coach,
      price: finalPrice,
    },
  })
}
</script>

<template>
  <div class="page-wrapper">

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

      <div class="confirm-card">
        <h4>訂單摘要</h4>
        <div class="info-row"><span>課程</span><span>{{ course }}</span></div>
        <div class="info-row"><span>日期</span><span>{{ date }}</span></div>
        <div class="info-row"><span>時間</span><span>{{ time }}</span></div>
        <div class="info-row"><span>教練</span><span>{{ coach }}</span></div>
        <div class="info-row"><span>原價</span><span>NT$ {{ originPrice }}</span></div>
        <div class="info-row discount">
  <span>折扣碼</span>
  <span>{{ discountCode }} (-NT$100)</span>
</div>

        <div class="info-row total">
          <span>應付金額</span>
          <span>NT$ {{ finalPrice }}</span>
        </div>
      </div>

      <div class="confirm-card">
        <h4>付款方式</h4>

        <label class="pay-option">
          <input type="radio" value="credit" v-model="paymentMethod" />
          信用卡（藍新）
        </label>

        <label class="pay-option">
          <input type="radio" value="linepay" v-model="paymentMethod" />
          LINE Pay
        </label>

        <label class="pay-option">
          <input type="radio" value="atm" v-model="paymentMethod" />
          ATM 轉帳
        </label>

        <div class="btn-row">
          <button class="back-btn" @click="$router.back()">上一步</button>
          <button class="pay-btn" @click="goPay">
            前往藍新付款
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
