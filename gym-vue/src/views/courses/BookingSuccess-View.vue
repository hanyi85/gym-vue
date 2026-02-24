<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()
const router = useRouter()

// 先讀 query
let orderId = route.query.orderId
let course = route.query.course
let date = route.query.date
let time = route.query.time
let price = route.query.price

// 如果 query 沒有 → 讀 localStorage
if (!course) {
  const raw = localStorage.getItem('pending_booking')
  if (raw) {
    const b = JSON.parse(raw)

    orderId = orderId || 'NP' + Date.now()
    course = b.course
    date = b.date
    time = b.time
    price = b.price

    // 成功頁顯示完可以選擇刪掉
    localStorage.removeItem('pending_booking')
  }
}

//  組 QR Code 內容（可以放真實資料）
const qrValue = computed(() =>
  JSON.stringify({
    orderId,
    course,
    date,
    time,
    price,
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
        <span>{{ orderId }}</span>
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
