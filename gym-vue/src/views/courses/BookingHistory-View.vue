<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const orders = ref([
  {
    id: 'BK20260203001',
    course: '燃脂體能課程',
    coach: '張老師',
    date: '2026-02-03',
    time: '10:00',
    price: 300,
    status: '已完成',
  },
  {
    id: 'BK20260205002',
    course: '瑜珈基礎課程',
    coach: 'Linda',
    date: '2026-02-05',
    time: '14:00',
    price: 400,
    status: '即將到來',
  },
  {
    id: 'BK20260120003',
    course: '進階重訓',
    coach: 'Mike',
    date: '2026-01-20',
    time: '18:00',
    price: 600,
    status: '已取消',
  }
])

function goDetail(order) {
  router.push({
    name: 'courses-booking-success',
    query: {
      orderId: order.id,
      course: order.course,
      date: order.date,
      time: order.time,
      price: order.price
    }
  })
}

function goReview(order) {
  router.push({
    name: 'courses-review',
    query: {
      orderId: order.id,
      course: order.course,
      coach: order.coach,
      date: `${order.date} ${order.time}`,
    }
  })
}
</script>

<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <h2 class="fw-bold text-center mb-2">我的課程訂單</h2>
      <p class="text-center text-muted mb-4">
        查看你的預約紀錄與狀態
      </p>

      <div class="order-list">
        <div class="order-card" v-for="o in orders" :key="o.id">
          <div class="order-left">
            <h5>{{ o.course }}</h5>
            <p>教練：{{ o.coach }}</p>
            <p>時間：{{ o.date }} {{ o.time }}</p>
            <p>訂單編號：{{ o.id }}</p>
          </div>

          <div class="order-right">
            <span
              class="status"
              :class="{
                done: o.status === '已完成',
                upcoming: o.status === '即將到來',
                cancel: o.status === '已取消'
              }"
            >
              {{ o.status }}
            </span>

            <div class="price">NT$ {{ o.price }}</div>

            <div class="btn-group">
            <button class="detail-btn" @click="goDetail(o)">
  查看詳情
</button>
              <button
                v-if="o.status === '已完成'"
                class="review-btn" @click="goReview(o)"
              >
                去評論
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="orders.length === 0" class="empty">
        尚無任何預約紀錄
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.order-left h5 {
  margin-bottom: 6px;
  font-weight: 600;
}

.order-left p {
  font-size: 14px;
  margin: 2px 0;
  color: #555;
}

.order-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
}

.status.done {
  background: #e0f2fe;
  color: #0369a1;
}

.status.upcoming {
  background: #dcfce7;
  color: #166534;
}

.status.cancel {
  background: #fee2e2;
  color: #991b1b;
}

.price {
  font-weight: bold;
  color: #2563eb;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.detail-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.review-btn {
  background: #ff8a00;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 60px;
}
</style>
