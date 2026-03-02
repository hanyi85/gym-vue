<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js';
import axios from 'axios';

const router = useRouter();
const cartStore = useCartStore();

const isCartExpanded = ref(false); // 控制手風琴展開
const syncInfo = ref(false);       // 收件人資料同步
const cityOptions = ref([]);       // 縣市
const districtOptions = ref([]);   // 地區
const selectedCity = ref('');
const selectedDistrict = ref('');

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

const getFullImageUrl = (path) => {
  if (!path) return `${BASE_URL}/images/default.png`;
  const str = String(path).trim();
  if (/^https?:\/\//i.test(str)) return str;
  return `${BASE_URL}/${str.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

// 手風琴切換
const toggleCart = () => {
  isCartExpanded.value = !isCartExpanded.value;
};

// 同步收件人資訊
const handleSyncInfo = () => {
  if (syncInfo.value) {
    cartStore.orderForm.receiverName = cartStore.orderForm.customerName;
    cartStore.orderForm.receiverPhone = cartStore.orderForm.customerPhone;
  }
};

// 🔹 下單送出
const goToBookingSuccess = async () => {
  const method = cartStore.paymentMethod || localStorage.getItem('paymentMethod');
  const payMap = { '信用卡': 1, '貨到付款': 2, 'PayPal': 3 };
  const payId = payMap[method];

  if (!payId) {
    alert('付款方式遺失，請重新選擇');
    router.replace({ name: 'shop-cart' });
    return;
  }

  const payload = {
    mName: cartStore.orderForm.customerName,
    mPhone: cartStore.orderForm.customerPhone,
    email: cartStore.orderForm.receiverEmail,
    mAddress: `${selectedCity.value}${selectedDistrict.value}${cartStore.orderForm.receiverAddressDetail || ''}`.substring(0, 30),
    shipFee: Number(cartStore.shippingFee),
    total: Number(cartStore.totalAmount),
    note: cartStore.orderForm.note || '',
    payId,
    shipId: 1,
    items: cartStore.cartItems.map(item => ({
      specId: Number(item.SpecId),
      pName: item.PName || item.pName || item.Name || '',
      price: Number(item.Price),
      quantity: Number(item.Quantity)
    }))
  };

  try {
    const res = await axios.post(API_URL + 'SOrder', payload);
    
    // ✅ 假設後端回傳格式為 { success: true, orderNo: "...", approvalUrl: "..." }
    const { orderNo, approvalUrl } = res.data;

    // ⚡ 判斷支付方式：如果是 PayPal (payId 為 3)
    if (payId === 3 && approvalUrl) {
      // 這裡暫時不要清空購物車，等支付成功跳回來再清空（比較保險）
      // 直接全頁跳轉到 PayPal 支付頁面
      console.log('網址是:', approvalUrl)
      window.location.href = approvalUrl;
      return; 
    }

    // ⚡ 如果是其他支付方式 (如貨到付款)
    cartStore.clearCart();
    router.push({ path: '/shop/booking-success', query: { orderNumber: orderNo } });

  } catch (err) {
    console.error('❌ 訂單送出失敗:', err.response?.data || err);
    alert('訂單提交失敗，請檢查資料或重新整理');
  }
};

// --- 初始化頁面 ---
onMounted(() => {
  cartStore.loadCart();
  fetchCities();

  if (!cartStore.paymentMethod) {
    cartStore.paymentMethod = localStorage.getItem('paymentMethod') || '';
  }
  if (!cartStore.deliveryMethod) {
    cartStore.deliveryMethod = localStorage.getItem('deliveryMethod') || '';
  }

  const mockMember = {
    name: '王小明',
    email: 'ming@example.com',
    phone: '0912345678'
  };

  if (!cartStore.orderForm.customerName) cartStore.orderForm.customerName = mockMember.name;
  if (!cartStore.orderForm.receiverEmail) cartStore.orderForm.receiverEmail = mockMember.email;
  if (!cartStore.orderForm.customerPhone) cartStore.orderForm.customerPhone = mockMember.phone;
});

// 取得縣市
const fetchCities = async () => {
  try {
    const res = await axios.get(API_URL + 'SAddress/cities');
    if (Array.isArray(res.data)) cityOptions.value = res.data;
  } catch (err) {
    console.error('縣市 API 尚未就緒');
  }
};

// 監控縣市選擇，更新地區
watch(selectedCity, async (newCity) => {
  selectedDistrict.value = '';
  districtOptions.value = [];
  if (!newCity) return;

  try {
    const res = await axios.get(API_URL + `SAddress/districts?cityName=${newCity}`);
    districtOptions.value = res.data;
  } catch (err) {
    console.error('地區 API 尚未就緒');
  }
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
              <div class="mb-3 small text-secondary">已選擇的送貨方式：{{ cartStore.deliveryMethod  }}</div>
              <div class="mb-3 small text-secondary">已選擇的付款方式：{{ cartStore.paymentMethod  }}</div>
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
    <select v-model="selectedCity" class="form-select bg-light border-0 py-2">
      <option value="" disabled>城市 / 縣</option>
      <option v-for="city in cityOptions" :key="city" :value="city">
        {{ city }}
      </option>
    </select>
  </div>
  
  <div class="col-6">
    <select v-model="selectedDistrict" class="form-select bg-light border-0 py-2" :disabled="!selectedCity">
      <option value="" disabled>地區</option>
      <option v-for="dist in districtOptions" :key="dist" :value="dist">
        {{ dist }}
      </option>
    </select>
  </div>

  <div class="col-12 mt-2">
    <input 
      v-model="cartStore.orderForm.receiverAddressDetail" 
      type="text" 
      class="form-control bg-light border-0 py-2" 
      placeholder="完整地址 (路名、門牌、樓層)"
    >
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