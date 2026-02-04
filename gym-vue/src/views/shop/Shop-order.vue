<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 模擬會員的所有訂單資料
const orders = ref([
  {
    orderNumber: '123456789',
    orderDate: '2026/01/01',
    totalAmount: 864,
    status: '訂單處理中'
  },
  {
    orderNumber: '202512191534',
    orderDate: '2025/12/19',
    totalAmount: 1300,
    status: '已完成'
  }
]);

// 查閱按鈕的點擊事件
const viewOrder = (orderId) => {
  router.push({
    name: 'shop-order-detail',
    params: { id: orderId }
  });
};
</script>

<template>
  <div class="member-orders-page bg-light min-vh-100 py-5">
    <div class="container" style="max-width: 1000px;">
      
      <h2 class="fw-bold mb-5">我的訂單</h2>

      <div class="orders-container bg-white shadow-sm rounded overflow-hidden">
        
        <div class="order-header d-none d-md-flex border-bottom bg-white py-3 px-4 fw-bold">
          <div style="flex: 2;">訂單號碼</div>
          <div style="flex: 2;">訂單日期</div>
          <div style="flex: 2;">合計</div>
          <div style="flex: 2;">訂單狀態</div>
          <div style="flex: 1;"></div> </div>

        <div 
          v-for="order in orders" 
          :key="order.orderNumber" 
          class="order-item d-flex flex-column flex-md-row align-items-md-center border-bottom py-4 px-4 bg-white"
        >
          <div class="mb-2 mb-md-0 text-secondary" style="flex: 2;">
            <span class="d-md-none fw-bold text-dark me-2">訂單號碼:</span>
            {{ order.orderNumber }}
          </div>

          <div class="mb-2 mb-md-0 text-secondary" style="flex: 2;">
            <span class="d-md-none fw-bold text-dark me-2">訂單日期:</span>
            {{ order.orderDate }}
          </div>

          <div class="mb-2 mb-md-0 text-secondary" style="flex: 2;">
            <span class="d-md-none fw-bold text-dark me-2">合計:</span>
            NT${{ order.totalAmount }}
          </div>

          <div class="mb-3 mb-md-0 text-secondary" style="flex: 2;">
            <span class="d-md-none fw-bold text-dark me-2">訂單狀態:</span>
            {{ order.status }}
          </div>

          <div class="text-md-end" style="flex: 1;">
            <button 
              @click="viewOrder(order.orderNumber)" 
              class="btn btn-view px-4 py-2 fw-bold"
            >
              查閱
            </button>
          </div>
        </div>

        <div v-if="orders.length === 0" class="py-5 text-center text-secondary">
          目前尚無訂單紀錄
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 標題間距 */
h2 {
  font-size: 1.5rem;
  letter-spacing: 1px;
}

/* 訂單容器 */
.orders-container {
  border: 1px solid #dee2e6;
}

/* 查閱按鈕樣式 */
.btn-view {
  background-color: #e0e0e0; /* 淺灰色背景 */
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #d0d0d0;
}

/* RWD 微調：手機版時隱藏標頭，改用標籤顯示 */
@media (max-width: 768px) {
  .order-item {
    text-align: left;
  }
}

.text-secondary {
  color: #6c757d !important;
}
</style>