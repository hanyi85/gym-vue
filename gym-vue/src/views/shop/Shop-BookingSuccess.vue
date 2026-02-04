<script setup>
import { ref } from 'vue';

// 模擬訂單資料
const orderInfo = ref({
  orderNumber: '202405200001',
  orderDate: '2024-05-20 14:30',
  orderStatus: '已確認',
  totalAmount: 864, // 總金額
  customer: { 
    name: '王小明', 
    phone: '0912 345 678',
    email: 'aaa****@gmail.com' 
  },
  delivery: {
    receiver: '王小明',
    phone: '0912 345 678',
    method: '宅配',
    status: '備貨中',
    address: '台南市安平區建平十一街24巷30號'
  },
  payment: { method: '信用卡', status: '已付款' },
  note: '無'
});

// 手風琴所需的計算數值
const subtotal = ref(784);
const shippingFee = ref(80);

// 模擬購物車商品清單
const cartItems = ref([
  { 
    id: 1, 
    name: '濃縮乳清蛋白【純粹那堤】隨身包35克-GOpower果果能量', 
    price: 55, 
    originalPrice: 80,
    quantity: 1, 
    image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href 
  },
  { 
    id: 2, 
    name: '水解乳清蛋白【可可歐蕾】500克-GOpower果果能量', 
    price: 729, 
    originalPrice: 1100,
    quantity: 1, 
    image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href 
  }
]);

const isCartExpanded = ref(false);
const toggleCart = () => isCartExpanded.value = !isCartExpanded.value;
</script>

<template>
  <div class="booking-success-page bg-light min-vh-100 py-5">
    <div class="container" style="max-width: 900px;">
      
      <div class="checkout-stepper mb-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="step-item d-flex flex-column align-items-center completed">
            <div class="step-circle">1</div>
            <span class="step-label">購物車</span>
          </div>
          <div class="step-line filled"></div>
          <div class="step-item d-flex flex-column align-items-center completed">
            <div class="step-circle">2</div>
            <span class="step-label">填寫資料</span>
          </div>
          <div class="step-line filled"></div>
          <div class="step-item d-flex flex-column align-items-center active">
            <div class="step-circle">3</div>
            <span class="step-label">訂單確認</span>
          </div>
        </div>
      </div>

       <div class="row justify-content-center mb-4">
        <div class="col-12 px-0">
          <div class="card border-0 shadow-sm rounded overflow-hidden">
            <div 
              class="cart-summary-header bg-white py-4 text-center cursor-pointer position-relative"
              @click="toggleCart"
            >
              <h4 class="fw-bold mb-1">合計：NT${{ orderInfo.totalAmount }}</h4>
              <div class="text-secondary small d-flex align-items-center justify-content-center gap-1">
                購物車 ({{ cartItems.length }} 件) 
                <i class="bi" :class="isCartExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>

            <div v-show="isCartExpanded" class="cart-details bg-white border-top">
              <div class="table-responsive p-4">
                <table class="table align-middle mb-0">
                  <thead class="text-secondary small">
                    <tr>
                      <th class="border-0 font-weight-normal">商品資料</th>
                      <th class="border-0 font-weight-normal text-center">優惠</th>
                      <th class="border-0 font-weight-normal text-center">單件價格</th>
                      <th class="border-0 font-weight-normal text-center">數量</th>
                      <th class="border-0 font-weight-normal text-end">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in cartItems" :key="item.id">
                      <td class="py-3" style="min-width: 300px;">
                        <div class="d-flex align-items-center gap-3">
                          <img :src="item.image" class="rounded border" width="60" height="60">
                          <span class="small fw-bold text-dark">{{ item.name }}</span>
                        </div>
                      </td>
                      <td class="text-center"></td>
                      <td class="text-center">
                        <div class="small fw-bold">NT${{ item.price }}</div>
                        <div class="x-small text-muted text-decoration-line-through">NT${{ item.originalPrice }}</div>
                      </td>
                      <td class="text-center small">{{ item.quantity }}</td>
                      <td class="text-end fw-bold small">NT${{ item.price * item.quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bg-gray-50 p-4 border-top">
                <div class="row justify-content-end">
                  <div class="col-md-4">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-secondary small">小計:</span>
                      <span class="small fw-bold">NT${{ subtotal }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-secondary small">運費:</span>
                      <span class="small fw-bold">NT${{ shippingFee }}</span>
                    </div>
                    <div class="d-flex justify-content-between border-top pt-2 mt-2">
                      <span class="fw-bold">合計:</span>
                      <span class="fw-bold text-dark">NT${{ orderInfo.totalAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-center py-2 bg-light cursor-pointer" @click="toggleCart">
                <i class="bi bi-chevron-up text-secondary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mb-4">
  <div class="success-check-icon bg-success text-white mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm">
    <i class="bi bi-check-lg" style="font-size: 2.5rem;"></i>
  </div>
  <h3 class="fw-bold mb-3">謝謝您！您的訂單已經成立！</h3>
  <div class="order-simple-info mb-4">
    <p class="mb-1 text-secondary">訂單號碼 {{ orderInfo.orderNumber }}</p>
    <p class="small text-secondary">訂單確認電郵已經發送到您的電子郵箱：<br>
      <strong class="text-dark">{{ orderInfo.customer.email || 'strg85****@gmail.com' }}</strong>
    </p>
  </div>
</div>

<div class="card border-0 shadow-sm bg-white mb-4 overflow-hidden rounded-3">
  
  <div class="p-4 border-bottom">
    <h5 class="fw-bold mb-3 text-dark">訂單資訊</h5>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">訂單日期:</span>
      <span>{{ orderInfo.orderDate }}</span>
    </div>
    <div class="d-flex justify-content-between small">
      <span class="text-secondary">訂單狀態:</span>
      <span class="fw-bold">{{ orderInfo.orderStatus }}</span>
    </div>
  </div>

  <div class="p-4 border-bottom">
    <h5 class="fw-bold mb-3 text-dark">顧客資訊</h5>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">名稱:</span>
      <span>{{ orderInfo.customer.name }}</span>
    </div>
    <div class="d-flex justify-content-between small">
      <span class="text-secondary">電話號碼:</span>
      <span>{{ orderInfo.customer.phone }}</span>
    </div>
  </div>

  <div class="p-4 border-bottom">
    <h5 class="fw-bold mb-3 text-dark">送貨資訊</h5>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">收件人名稱:</span>
      <span>{{ orderInfo.delivery.receiver }}</span>
    </div>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">收件人電話號碼:</span>
      <span>{{ orderInfo.delivery.phone }}</span>
    </div>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">送貨方式:</span>
      <span>{{ orderInfo.delivery.method }}</span>
    </div>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">送貨狀態:</span>
      <span class="fw-bold">{{ orderInfo.delivery.status }}</span>
    </div>
    <div class="d-flex justify-content-between small">
      <span class="text-secondary">送貨方式簡述:</span>
      <span class="text-end" style="max-width: 60%;">{{ orderInfo.delivery.address || '台南市安平區建平十＿街24巷30號' }}</span>
    </div>
  </div>

  <div class="p-4">
    <h5 class="fw-bold mb-3 text-dark">付款資訊</h5>
    <div class="d-flex justify-content-between mb-2 small">
      <span class="text-secondary">付款方式:</span>
      <span>{{ orderInfo.payment.method }}</span>
    </div>
    <div class="d-flex justify-content-between small">
      <span class="text-secondary">付款狀態:</span>
      <span class="fw-bold">{{ orderInfo.payment.status }}</span>
    </div>
  </div>
</div>

      <div class="d-flex justify-content-end">
        <router-link to="/shop/products" class="btn btn-gym-green px-5 py-2 fw-bold rounded shadow-sm">
          繼續購物
        </router-link>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.btn-gym-green {
  background-color: #62b562;
  color: white;
  border: none;
}

/* 📍 成功打勾圖示 (綠底白勾) */
.success-check-icon {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: #28a745 !important; /* 綠色背景 */
}

/* 📍 訂單詳細資訊樣式優化 */
.card h5 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.text-secondary {
  color: #6c757d !important;
}

/* 調整字體大小與對齊細節 */
.small {
  font-size: 0.9rem;
}

.order-simple-info p {
  line-height: 1.6;
}

/* 按鈕樣式 (配合圖中視覺，維持您原本的設定或微調) */
.btn-secondary {
  background-color: #d1d5db;
  color: #374151;
  border: none;
  border-radius: 8px;
}

.btn-secondary:hover {
  background-color: #9ca3af;
  color: white;
}

/* 📍 進度條樣式與填寫頁面保持一致 */
.step-item { position: relative; width: 80px; }
.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  background: #fff; border: 2px solid #dee2e6;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; color: #dee2e6; z-index: 2;
}
.step-label { font-size: 0.85rem; margin-top: 8px; color: #adb5bd; }
.step-item.active .step-circle { border-color: #62b562; color: #62b562; }
.step-item.active .step-label { color: #333; font-weight: bold; }
.step-item.completed .step-circle { background-color: #8fa1b3; border-color: #8fa1b3; color: white; font-size: 0; }
.step-item.completed .step-circle::after { content: '✓'; font-size: 16px; }
.step-line { height: 2px; width: 100px; background: #dee2e6; margin-bottom: 25px; }
.step-line.filled { background: #8fa1b3; }

/* 📍 成功打勾圖示樣式 */
.success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background-color: #e9ecef; border: 1px solid #dee2e6;
}

/* 📍 訂單資訊列表樣式 */
.order-section h5 { font-size: 1.1rem; }
.text-gym-green { color: #62b562; }
.cursor-pointer { cursor: pointer; }

/* 按鈕樣式 */
.btn-secondary { background-color: #8fa1b3; border: none; }
.btn-secondary:hover { background-color: #7a8c9e; }
</style>