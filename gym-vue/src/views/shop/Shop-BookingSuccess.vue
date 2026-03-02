<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;

const orderInfo = ref(null);  // 訂單主資訊
const cartItems = ref([]);    // 訂單明細
const subtotal = ref(0);
const shippingFee = ref(0);
const isCartExpanded = ref(false);
const toggleCart = () => isCartExpanded.value = !isCartExpanded.value;

onMounted(async () => {
  const orderNumber = route.query.orderNumber;
  
  if (!orderNumber) {
    alert('找不到訂單號碼');
    router.replace('/shop/products');
    return;
  }

  try {
    const res = await axios.get(`${API_URL}SOrder/byOrderNumber/${orderNumber}`);
    const data = res.data;
    console.log("1. 後端回傳原始資料:", data);

    // 訂單主資訊
    orderInfo.value = {
      orderNumber: data.OrderNumber,
      orderDate: new Date(data.Date).toLocaleString(),
      orderStatus: data.oStatus,
      totalAmount: data.Total,
      customer: { 
        name: data.MName,
        phone: data.MPhone,
        email: data.Email
      },
      delivery: {
        receiver: data.MName,
        phone: data.MPhone,
        method: data.ship?.Shipping || '',
        status: '備貨中',
        address: data.MAddress,
        fee: data.ShipFee
      },
      payment: {
        method: data.pay?.Payment || '',
        status: data.PayStatus
      },
      note: data.Note || ''
    };

    // --- 訂單明細圖片路徑優化處理 ---
    cartItems.value = data.sOrderDetails.map(item => {
      let finalImage = item.spec?.ImagePath;

      // 1. 處理路徑：確保 API_URL 結尾沒斜線，ImagePath 開頭有斜線
      // 這樣拼起來才會是標準的 https://localhost:7218/images/...
      if (finalImage && !finalImage.startsWith('http')) {
        const baseUrl = API_URL.replace(/\/$/, ''); // 去除結尾斜線
        const purePath = finalImage.startsWith('/') ? finalImage : `/${finalImage}`; // 確保開頭有斜線
        finalImage = `${baseUrl}${purePath}`;
      }

      // 2. 強制將 http 轉為 https (防止本地開發環境埠號衝突)
      if (finalImage && finalImage.startsWith('http://localhost:7218')) {
        finalImage = finalImage.replace('http://', 'https://');
      }

      return {
        id: item.OdId,
        name: item.PName,
        price: item.SPrice,
        originalPrice: item.SPrice,
        quantity: item.Quantity,
        // 如果沒有圖片路徑，則指向預設圖
        image: finalImage || `${API_URL.replace(/\/$/, '')}/images/products/default.jpg`
      };
    });

    subtotal.value = cartItems.value.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
    shippingFee.value = orderInfo.value.delivery.fee || (orderInfo.value.totalAmount - subtotal.value);
    
    console.log("2. 處理後的 cartItems:", cartItems.value);
    
  } catch (err) {
    console.error("API 請求出錯:", err);
    alert('取得訂單資料失敗');
    router.replace('/shop/products');
  }
});
</script>

<template>
  <div v-if="orderInfo" class="booking-success-page bg-light min-vh-100 py-5">
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

      <div class="text-center mb-4">
        <div class="success-check-icon bg-gym-orange text-white mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm">
          <i class="bi bi-check-lg" style="font-size: 2.5rem;"></i>
        </div>
        <h3 class="fw-bold mb-3">謝謝您！您的訂單已經成立！</h3>
        <div class="order-simple-info mb-4">
          <p class="mb-1 text-secondary">訂單號碼 {{ orderInfo.orderNumber }}</p>
          <p class="small text-secondary">訂單確認郵件已經發送到您的電子郵箱：<br>
            <strong class="text-dark">{{ orderInfo.customer.email }}</strong>
          </p>
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
            <span class="text-end" style="max-width: 60%;">{{ orderInfo.delivery.address }}</span>
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

.btn-gym-orange {
  background-color: #f3722c;
  color: white;
  border: none;
  transition: opacity 0.2s;
}

.btn-gym-orange:hover {
  opacity: 0.9;
  color: white;
}

/* 📍 橘色打勾圖示樣式 */
.success-check-icon {
  width: 75px;
  height: 75px;
  border-radius: 50%;
}

.bg-gym-orange {
  background-color: #f3722c !important; /* 換成橘色 */
}
.btn-gym-green {
  background-color: #f3722c;
  color: white;
  border: none;
}



/* 📍 訂單詳細資訊樣式優化 */
.card h5 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.text-secondary {
  color: #6c757d !important;
}

.small { font-size: 0.9rem; }
.order-simple-info p { line-height: 1.6; }

.btn-secondary { background-color: #d1d5db; color: #374151; border: none; border-radius: 8px; }
.btn-secondary:hover { background-color: #9ca3af; color: white; }

.step-item { position: relative; width: 80px; }
.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  background: #fff; border: 2px solid #dee2e6;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; color: #dee2e6; z-index: 2;
}
.step-label { font-size: 0.85rem; margin-top: 8px; color: #adb5bd; }
.step-item.active .step-circle { border-color: #f3722c; color: #f3722c; }
.step-item.active .step-label { color: #333; font-weight: bold; }
.step-item.completed .step-circle { background-color: #8fa1b3; border-color: #8fa1b3; color: white; font-size: 0; }
.step-item.completed .step-circle::after { content: '✓'; font-size: 16px; }
.step-line { height: 2px; width: 100px; background: #dee2e6; margin-bottom: 25px; }
.step-line.filled { background: #8fa1b3; }
.cursor-pointer { cursor: pointer; }
</style>