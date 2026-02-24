<script setup>
import { ref, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import axios from 'axios';
console.log('API_URL:', API_URL);
const router = useRouter();
const cartItems = ref([]);
const addonProducts = ref([]); 

const subtotal = ref(0);
const shippingFee = ref(0);
const totalAmount = ref(0);

const API_URL = import.meta.env.VITE_API_URL;

const loadCart = async () => {
  const tempUserId = 1;
  try {
    const resp = await axios.get(`${API_URL}SCarts/User/${tempUserId}`);

    // 🔥 重點：從 items 取資料
    cartItems.value = resp.data.items;

    // 🔥 金額直接用後端算好的
    subtotal.value = resp.data.subtotal;
    shippingFee.value = resp.data.shippingFee;
    totalAmount.value = resp.data.totalAmount;

    console.log("購物車 items:", cartItems.value);
  } catch (err) {
    console.error("載入購物車失敗:", err);
  }
};

const loadRecommendations = async () => {
  try {
    const res = await axios.get(`${API_URL}SCarts/Recommendations`);
    addonProducts.value = res.data; 
  } catch (err) {
    console.error("載入推薦商品失敗", err);
  }
};

onMounted(() => {
  loadCart();
  loadRecommendations();
});

const updateQty = async (index, delta) => {
  const item = cartItems.value[index];
  const nextQty = item.quantity + delta;
  
  if (nextQty >= 1) {
    try {
      await axios.put(`${API_URL}SCarts/${item.cartId}`, nextQty, {
        headers: { 'Content-Type': 'application/json' }
      });
      await loadCart(); 
    } catch (err) {
      console.error("更新數量失敗", err);
    }
  }
};

const removeItem = async (index) => {
  const item = cartItems.value[index];
  if (!confirm(`確定要刪除「${item.name}」嗎？`)) return;

  try {
    await axios.delete(`${API_URL}SCarts/${item.cartId}`);
    await loadCart(); 
  } catch (err) {
    console.error("刪除失敗:", err);
  }
};

const addAddonToCart = async (addon) => {
  try {
    const payload = {
      UserId: 1,
      SpecId: addon.specId, 
      Quantity: 1
    };

    await axios.post(`${API_URL}SCarts/AddToCart`, payload);
    alert(`已將 ${addon.name} 加入購物車！`);
    
    await loadCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error("加價購失敗:", err);
  }
};

const goToShop = () => router.push({ name: 'shop-products' });
const goToCheckout = () => {
  if (cartItems.value.length === 0) {
    alert('您的購物車是空的喔！');
    return;
  }
  router.push({ name: 'shop-booking' });
};


</script>

<template>
  <div class="cart-page bg-light min-vh-100 py-5">
    <div class="container" style="max-width: 1140px;">
      
      <div class="checkout-stepper mb-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="step-item d-flex flex-column align-items-center active">
            <div class="step-circle">1</div>
            <span class="step-label">購物車</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item d-flex flex-column align-items-center">
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

      <div v-if="cartItems && cartItems.length > 0" class="row g-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-1 mb-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">購物車 ({{ cartItems.length }} 件)</h5>
            </div>
            
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="bg-gray-50 small text-secondary">
                  <tr>
                    <th class="ps-4 border-0" style="width: 35%;">商品資料</th>
                    <th class="border-0 text-start">單件價格</th>
                    <th class="border-0 text-center" style="width: 150px;">數量</th>
                    <th class="border-0 text-end" style="padding-right: 40px;">小計</th>
                    <th class="border-0"></th>
                  </tr>
                </thead>
                <tbody class="border-top-0">
                  <tr v-for="(item, index) in cartItems" :key="item.cartId">
                    <td class="ps-4 py-4">
                      <div class="d-flex align-items-center">
                        <img :src="item.image" class="rounded border bg-white" width="70" height="70" style="object-fit: cover;">
                        <div class="ms-3">
                          <div class="small fw-bold text-dark mb-1">{{ item.name }}</div>
                          <div class="text-danger x-small">免運優惠中</div>
                        </div>
                      </div>
                    </td>
                    <td class="small">
                      <div class="text-dark">NT${{ item.price }}</div>
                      <div class="text-muted x-small text-decoration-line-through">NT${{ item.originPrice }}</div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center">
                        <div class="input-group input-group-sm qty-selector">
                          <button class="btn btn-outline-secondary border-light-subtle" @click="updateQty(index, -1)">-</button>
                          <input type="text" class="form-control text-center bg-light border-0" :value="item.quantity" readonly>
                          <button class="btn btn-outline-secondary border-light-subtle" @click="updateQty(index, 1)">+</button>
                        </div>
                      </div>
                    </td>
                    <td class="fw-bold text-dark text-end" style="padding-right: 40px;">
                      NT${{ item.price * item.quantity }}
                    </td>
                    <td class="pe-4 text-end">
                      <button class="btn btn-link text-muted p-0 text-decoration-none" @click="removeItem(index)">✕</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="card-footer bg-white border-top-0 py-3 px-4">
              <div class="promo-hint mb-2 d-flex align-items-center gap-2">
                <span class="badge bg-light text-dark border fw-normal">優惠促銷</span>
                <span v-if="subtotal < 899" class="small text-secondary">
                  常溫商品滿 $899 免運，<span class="text-gym-green fw-bold">再買 NT${{ 899 - subtotal }} 即享有免運</span>
                </span>
                <span v-else class="small text-gym-green fw-bold">🎉 已達成免運門檻！</span>
              </div>
              <div class="text-end">
                <a @click="goToShop" class="text-decoration-underline small text-dark cursor-pointer">繼續購物</a>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-1 mb-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">購物車加價購</h5>
            </div>
            <div class="card-body p-4 position-relative">
              <div ref="addonContainer" class="d-flex gap-4 overflow-auto pb-3 hide-scrollbar custom-scrollbar">
                <div v-for="addon in addonProducts" :key="addon.specId" class="addon-item flex-shrink-0" style="width: 280px;">
                  <div class="d-flex align-items-start p-2 border rounded">
                    <img :src="addon.image" class="rounded border" width="80" height="80" style="object-fit: cover;">
                    <div class="ms-3 flex-grow-1">
                      <div class="small fw-bold text-dark mb-1 lh-sm text-truncate-2" style="height: 2.4em;">{{ addon.name }}</div>
                      <div class="text-gym-orange fw-bold mb-2">NT${{ addon.price }}</div>
                      <button class="btn btn-dark btn-sm w-100 py-1 fw-bold" @click="addAddonToCart(addon)">加入購物車</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-1 p-4 sticky-top" style="top: 2rem;">
            <h5 class="fw-bold mb-4">訂單摘要</h5>
            <div class="d-flex justify-content-between mb-2 text-secondary">
              <span>商品小計</span>
              <span>NT${{ subtotal }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3 text-secondary">
              <span>運費</span>
              <span v-if="shippingFee > 0">NT${{ shippingFee }}</span>
              <span v-else class="text-gym-green fw-bold">免運費</span>
            </div>
            <hr class="my-4">
            <div class="d-flex justify-content-between align-items-center mb-5">
              <span class="fw-bold fs-5 text-dark">總計</span>
              <span class="fs-3 fw-bold text-gym-orange">NT${{ totalAmount }}</span>
            </div>
            <button @click="goToCheckout" class="btn btn-gym-green w-100 py-3 fw-bold rounded-pill shadow-sm mb-3">
              前往結帳
            </button>
            <div class="text-center mt-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" width="30" class="me-2">
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" width="30" class="me-2">
              <img src="https://img.icons8.com/color/48/000000/line-me.png" width="30">
            </div>
          </div>
        </div>
      </div>

      <div v-else class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm rounded-1 py-5">
            <div class="card-body text-center">
              <div class="mb-4 text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#dee2e6" class="bi bi-cart-dash" viewBox="0 0 16 16">
                  <path d="M6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </div>
              <h3 class="fw-bold mb-3 text-dark">購物車目前是空的喔！</h3>
              <p class="text-secondary mb-5">您的購物車目前沒有任何商品，快去選購一些優質補給吧。</p>
              <button @click="goToShop" class="btn btn-gym-green px-5 py-3 fw-bold shadow-sm rounded-pill">
                前往選購商品
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 📍 Stepper 步驟指示器樣式 */
.checkout-stepper { max-width: 600px; margin: 0 auto; }
.step-item { position: relative; width: 80px; }
.step-circle {
  width: 32px; height: 32px; border-radius: 50%;
  background: #fff; border: 2px solid #dee2e6;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; color: #dee2e6; z-index: 2;
  transition: all 0.3s ease;
}
.step-label { font-size: 0.85rem; margin-top: 8px; color: #adb5bd; transition: all 0.3s ease; }
.step-item.active .step-circle { border-color: #f3722c; color: #f3722c; box-shadow: 0 0 0 4px rgba(243, 114, 44, 0.1); }
.step-item.active .step-label { color: #333; font-weight: bold; }

.step-line { height: 2px; width: 100px; background: #dee2e6; margin-bottom: 25px; margin-left: -10px; margin-right: -10px; }

/* 📍 數量選擇器樣式 */
.qty-selector { width: 110px; }
.qty-selector .form-control { height: 34px; font-size: 0.9rem; }
.qty-selector button { background: #fff; border-color: #dee2e6; color: #666; }
.qty-selector button:hover { background: #f8f9fa; border-color: #f3722c; color: #f3722c; }

/* 📍 顏色與按鈕 */
.text-gym-green { color: #28a745; }
.text-gym-orange { color: #f3722c; }
.btn-gym-green { background-color: #f3722c; color: white; border: none; transition: background-color 0.2s; }
.btn-gym-green:hover { background-color: #e6601c; color: white; transform: translateY(-1px); }

/* 📍 輔助類別 */
.cursor-pointer { cursor: pointer; }
.x-small { font-size: 0.75rem; }
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 📍 隱藏捲軸但保留捲動功能 */
.hide-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f3722c; }

@media (max-width: 991.98px) {
  .sticky-top { position: static !important; }
}
</style>