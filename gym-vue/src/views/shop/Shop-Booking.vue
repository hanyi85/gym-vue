<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/dist/cart.js'; // 確保路徑與你的專案一致

const router = useRouter();
const cartStore = useCartStore();

// --- 保留你原本的狀態控制 ---
const isCartExpanded = ref(false); // 控制手風琴展開狀態
const syncInfo = ref(false);      // 收件人資料同步勾選

// 取得完整圖片路徑 (與購物車邏輯一致)
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
const getFullImageUrl = (path) => {
  if (!path) return `${BASE_URL}/images/default.png`;
  const str = String(path).trim();
  if (/^https?:\/\//i.test(str)) return str;
  return `${BASE_URL}/${str.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

const toggleCart = () => {
  isCartExpanded.value = !isCartExpanded.value;
};

// 同步收件人邏輯
const handleSyncInfo = () => {
  if (syncInfo.value) {
    cartStore.orderForm.receiverName = cartStore.orderForm.customerName;
    cartStore.orderForm.receiverPhone = cartStore.orderForm.customerPhone;
  }
};

const goToBookingSuccess = () => {
  router.push({ name: 'shop-booking-success' });
};

// --- 一進入頁面就代入假資料 ---
onMounted(() => {
  // 1. 確保購物車有資料
  if (cartStore.cartItems.length === 0) {
    cartStore.loadCart();
  }

  // 2. 代入會員假資料 (模擬 API 未完成)
  const mockMember = {
    name: '王小明',
    email: 'ming@example.com',
    phone: '0912345678'
  };

  // 填入顧客資料欄位 (如果目前是空的才填入)
  if (!cartStore.orderForm.customerName) cartStore.orderForm.customerName = mockMember.name;
  if (!cartStore.orderForm.receiverEmail) cartStore.orderForm.receiverEmail = mockMember.email;
  if (!cartStore.orderForm.customerPhone) cartStore.orderForm.customerPhone = mockMember.phone;
});
</script>

<template>
  <div class="booking-page bg-light min-vh-100 py-5">
    <div class="container" style="max-width: 1140px;">
      
      <div class="checkout-stepper mb-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="step-item d-flex flex-column align-items-center completed">
            <div class="step-circle">1</div>
            <span class="step-label">購物車</span>
          </div>
          <div class="step-line filled"></div>
          <div class="step-item d-flex flex-column align-items-center active">
            <div class="step-circle">2</div>
            <span class="step-label">填寫資料</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item d-flex flex-column align-items-center">
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
              <h4 class="fw-bold mb-1">合計：NT${{ cartStore.totalAmount }}</h4>
              <div class="text-secondary small d-flex align-items-center justify-content-center gap-1">
                購物車 ({{ cartStore.cartItems.length }} 件) 
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
                    <tr v-for="item in cartStore.cartItems" :key="item.CartId">
                      <td class="py-3" style="min-width: 300px;">
                        <div class="d-flex align-items-center gap-3">
                          <img :src="getFullImageUrl(item.Image || item.image)" class="rounded border" width="60" height="60">
                          <span class="small fw-bold text-dark">{{ item.Name }}</span>
                        </div>
                      </td>
                      <td class="text-center"></td>
                      <td class="text-center">
                        <div class="small fw-bold">NT${{ item.Price }}</div>
                        <div v-if="item.OriginPrice" class="x-small text-muted text-decoration-line-through">NT${{ item.OriginPrice }}</div>
                      </td>
                      <td class="text-center small">{{ item.Quantity }}</td>
                      <td class="text-end fw-bold small">NT${{ item.Price * item.Quantity }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bg-gray-50 p-4 border-top">
                <div class="row justify-content-end">
                  <div class="col-md-4">
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-secondary small">小計:</span>
                      <span class="small fw-bold">NT${{ cartStore.subtotal }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="text-secondary small">運費:</span>
                      <span class="small fw-bold">NT${{ cartStore.shippingFee }}</span>
                    </div>
                    <div class="d-flex justify-content-between border-top pt-2 mt-2">
                      <span class="fw-bold">合計:</span>
                      <span class="fw-bold text-dark">NT${{ cartStore.totalAmount }}</span>
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

      <div class="row g-4">
        
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">顧客資料</h5>
            </div>
            <div class="card-body p-4">
              <div class="form-group mb-3">
                <label class="form-label small fw-bold">顧客名稱</label>
                <input v-model="cartStore.orderForm.customerName" type="text" class="form-control bg-light border-0 py-2" placeholder="請輸入姓名">
              </div>
              <div class="form-group mb-3">
                <label class="form-label small fw-bold">電子信箱</label>
                <input v-model="cartStore.orderForm.receiverEmail" type="email" class="form-control bg-light border-0 py-2" placeholder="請輸入 Email">
                <div class="form-text x-small mt-1 text-secondary">請填入訂單通知 Email (訂單資訊將以此 Email 通知您)</div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label small fw-bold">電話號碼</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary dropdown-toggle bg-white border-light-subtle" type="button">TW +886</button>
                  <input v-model="cartStore.orderForm.customerPhone" type="tel" class="form-control bg-light border-0" placeholder="0912 345 678">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label small fw-bold">性別 (選填)</label>
                <select class="form-select bg-light border-0 py-2">
                  <option selected>男</option>
                  <option>女</option>
                </select>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">訂單備註</h5>
            </div>
            <div class="card-body p-4">
              <textarea v-model="cartStore.orderForm.note" class="form-control bg-light border-0" rows="4" placeholder="有什麼想告訴賣家嗎？"></textarea>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">送貨資料</h5>
              <span class="small text-secondary fw-bold">運費: NT${{ cartStore.shippingFee }}</span>
            </div>
            <div class="card-body p-4">
              <div class="mb-3 small text-secondary">已選擇的送貨方式：{{ cartStore.deliveryMethod || '宅配' }}</div>
              <div class="form-check mb-4">
                <input class="form-check-input" type="checkbox" id="syncInfo" v-model="syncInfo" @change="handleSyncInfo">
                <label class="form-check-label small fw-bold" for="syncInfo">收件人資料與顧客資料相同</label>
              </div>
              
              <div class="form-group mb-3">
                <label class="form-label small fw-bold">收件人名稱</label>
                <input v-model="cartStore.orderForm.receiverName" type="text" class="form-control bg-light border-0 py-2" placeholder="請填入收件人真實姓名">
                <div class="form-text x-small mt-1 text-secondary">請填入收件人真實姓名，以確保順利收件</div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label small fw-bold">收件人電話號碼</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary dropdown-toggle bg-white border-light-subtle" type="button">TW +886</button>
                  <input v-model="cartStore.orderForm.receiverPhone" type="tel" class="form-control bg-light border-0" placeholder="0912 345 678">
                </div>
              </div>
              <div class="row g-2 mb-3">
                <div class="col-12"><label class="form-label small fw-bold">地址</label></div>
                <div class="col-6">
                  <select class="form-select bg-light border-0 py-2"><option>城市 / 縣</option></select>
                </div>
                <div class="col-6">
                  <select class="form-select bg-light border-0 py-2"><option>地區</option></select>
                </div>
                <div class="col-12 mt-2">
                  <input v-model="cartStore.orderForm.receiverAddress" type="text" class="form-control bg-light border-0 py-2" placeholder="完整地址">
                </div>
              </div>
            </div>
          </div>

          <button class="btn btn-gym-green w-100 py-3 fw-bold shadow-sm rounded" style="font-size: 1.1rem;" @click="goToBookingSuccess()">
            提交訂單
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 📍 核心佈局樣式 (完全保留原始設計) */
.btn-gym-green {
  background-color: #f3722c;
  color: white;
  border: none;
}
.btn-gym-green:hover {
  background-color: #f3722c;
  color: white;
}
.text-gym-green { color: #f3722c; }
.x-small { font-size: 0.75rem; }

/* 📍 自定義進度條 */
.step-item { position: relative; width: 80px; }
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #dee2e6;
  z-index: 2;
}
.step-label { font-size: 0.85rem; margin-top: 8px; color: #adb5bd; }

.step-item.active .step-circle { border-color: #f3722c; color: #f3722c; }
.step-item.active .step-label { color: #333; font-weight: bold; }

.step-item.completed .step-circle { 
  background-color: #8fa1b3; 
  border-color: #8fa1b3; 
  color: white; 
}
.step-item.completed .step-circle { font-size: 0; }
.step-item.completed .step-circle::after { content: '✓'; font-size: 16px; }

.step-line {
  height: 2px;
  width: 100px;
  background: #dee2e6;
  margin: 0 -10px 25px -10px;
}
.step-line.filled { background: #8fa1b3; }

/* 📍 修正輸入框 focus 效果 */
.form-control:focus {
  box-shadow: none;
  background-color: #fff !important;
  border: 1px solid #f3722c !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>