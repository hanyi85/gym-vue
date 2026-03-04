<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js'; 

const cartStore = useCartStore();
const router = useRouter();
const currentAddonPage = ref(0);
const addonContainer = ref(null);

// 取得完整圖片路徑
const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
const getFullImageUrl = (path) => {
  if (!path) return `${BASE_URL}/images/default.png`;
  const str = String(path).trim();
  if (/^https?:\/\//i.test(str)) return str;
  return `${BASE_URL}/${str.replace(/\\/g, '/').replace(/^\/+/, '')}`;
};

// 加價購滾動
const scrollToPage = (pageIndex) => {
  currentAddonPage.value = pageIndex;
  if (addonContainer.value) {
    const width = addonContainer.value.offsetWidth;
    addonContainer.value.scrollTo({ left: pageIndex * width, behavior: 'smooth' });
  }
};

// 前往結帳
const goToCheckout = () => {
  if (cartStore.cartItems.length === 0) return alert('購物車是空的！');
  if (!cartStore.deliveryMethod) return alert('請選擇送貨方式');
  if (!cartStore.paymentMethod) return alert('請選擇付款方式');
  router.push({ name: 'shop-booking' });
};

// 載入購物車與加價購
onMounted(() => {
  cartStore.loadCart();
});
</script>

<template>
<div class="cart-page bg-light min-vh-100 py-5">
  <div class="container" style="max-width: 1140px;">

    <div v-if="!cartStore.loadingCart && cartStore.cartItems.length > 0" class="checkout-stepper mb-5">
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

    <div v-if="cartStore.loadingCart" class="text-center py-5">
      <p>載入中...</p>
    </div>

    <div v-else-if="cartStore.cartItems.length > 0" class="row g-4">

      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-1 mb-4">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">購物車 ({{ cartStore.cartItems.length }} 件)</h5>
          </div>
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead class="bg-gray-50 small text-secondary">
                <tr>
                  <th class="ps-4 border-0" style="width: 35%;">商品資料</th>
                  <th class="border-0 text-start" style="width: 15%;">優惠</th>
                  <th class="border-0 text-start">單件價格</th>
                  <th class="border-0 text-center" style="width: 150px;">數量</th>
                  <th class="border-0 text-end" style="padding-right: 40px;">小計</th>
                  <th class="border-0"></th>
                </tr>
              </thead>
              <tbody class="border-top-0">
                <tr v-for="(item, index) in cartStore.cartItems" :key="item.CartId">
                  <td class="ps-4 py-4">
                    <div class="d-flex align-items-center">
                      <img :src="getFullImageUrl(item.Image||item.image)" class="rounded border bg-white" width="70" height="70" style="object-fit: cover;">
                      <div class="ms-3">
                        <div class="small fw-bold text-dark mb-1">{{ item.Name }}</div>
                        <div class="text-danger x-small">免運優惠中</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-start">
                    <span class="text-secondary small">{{ item.PromotionName || '' }}</span>
                  </td>
                  <td class="small">
                    <div class="text-dark">NT${{ item.Price }}</div>
                    <div v-if="item.OriginPrice" class="text-muted x-small text-decoration-line-through">NT${{ item.OriginPrice }}</div>
                  </td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <div class="input-group input-group-sm qty-selector">
                        <button class="btn btn-outline-secondary border-light-subtle"
                                @click="cartStore.updateQty(index, -1)"
                                :disabled="item.Quantity <= 1">
                          -
                        </button>
                        <input type="text" class="form-control text-center bg-light border-0" :value="item.Quantity" readonly>
      
      <button class="btn btn-outline-secondary border-light-subtle"
        @click="cartStore.updateQty(index, 1)"
        :disabled="item.IsAddon || cartStore.addonProducts.some(a => String(a.SpecId) === String(item.SpecId))">
  +
</button>
                      </div>
                    </div>
                    <div v-if="item.IsAddon" class="text-center text-danger x-small mt-1">加價購限 1 件</div>
                  </td>
                  <td class="fw-bold text-dark text-end" style="padding-right: 40px;">
                    NT${{ item.Price * item.Quantity }}
                  </td>
                  <td class="pe-4 text-end">
                    <button class="btn btn-link text-muted p-0 text-decoration-none" @click="cartStore.removeItem(index)">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card-footer bg-white border-top-0 py-3 px-4">
            <div class="promo-hint mb-2 d-flex align-items-center gap-2">
              <span class="badge bg-light text-dark border fw-normal">優惠促銷</span>
              <span v-if="cartStore.subtotal < 899" class="small text-secondary">
                常溫商品滿 $899 免運，
                <span class="text-gym-green fw-bold">再買 NT${{ 899 - cartStore.subtotal }} 即享有免運</span>
              </span>
              <span v-else class="small text-gym-green fw-bold"> 已達成免運門檻！</span>
            </div>
            <div class="text-end">
              <a @click="router.push('/shop/products')" class="text-decoration-underline small text-dark cursor-pointer">繼續購物</a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mb-4" v-if="cartStore.addonProducts.length > 0">
        <div class="card border-0 shadow-sm rounded-1">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">購物車加價購</h5>
          </div>
          <div class="card-body p-4 position-relative">
            <div ref="addonContainer" class="d-flex gap-4 overflow-hidden pb-3 hide-scrollbar" style="scroll-snap-type: x mandatory;">
              <div 
                v-for="addon in cartStore.addonProducts" 
                :key="addon.SpecId" 
                class="addon-item flex-shrink-0" 
                style="width: calc(33.333% - 1.5rem); scroll-snap-align: start;"
              >
                <div class="d-flex align-items-start">
                  <img 
                    :src="getFullImageUrl(addon.Image||addon.image)" 
                    class="rounded border" 
                    width="100" height="100" 
                    style="object-fit: cover;"
                  >
                  <div class="ms-3 flex-grow-1">
                    <div class="small fw-bold text-dark mb-1 lh-sm text-truncate-2" style="height: 2.4em;">
                      {{ addon.Name }}
                    </div>
                    <div class="text-secondary x-small mb-2">限購 1 件</div>
                    <div class="mb-2">
                      <span class="text-gym-orange fw-bold">NT${{ addon.AddonPrice }}</span>
                      <small v-if="addon.AddonPrice < addon.Price" class="text-muted text-decoration-line-through ms-2 x-small">
                        NT${{ addon.Price }}
                      </small>
                    </div>
                    <button 
                      class="btn btn-dark btn-sm w-100 py-1 fw-bold" 
                      style="font-size: 12px;"
                      @click="cartStore.addAddonToCart(addon)"
                      :disabled="cartStore.cartItems.some(i => i.SpecId === addon.SpecId)"
                    >
                      {{ cartStore.cartItems.some(i => i.SpecId === addon.SpecId) ? '已加入購物車' : '加入購物車' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-center gap-2 mt-3">
              <span 
                v-for="n in Math.ceil(cartStore.addonProducts.length / 3)" 
                :key="n" 
                class="dot cursor-pointer" 
                :class="{ active: currentAddonPage === n - 1 }" 
                @click="scrollToPage(n - 1)"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-7">
        <div class="card border-0 shadow-sm rounded-1 h-100">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">選擇送貨及付款方式</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label small fw-bold">送貨地點</label>
                <select class="form-select bg-light border-0 py-2">
                  <option>台灣</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">送貨方式</label>
                <select class="form-select bg-light border-0 py-2" v-model="cartStore.deliveryMethod">
                  <option value="">請選擇送貨方式</option>
                  <option value="宅配">宅配 (黑貓宅急便/新竹物流)</option>
                  <option value="超商 取貨不付款">超商 取貨不付款</option>
                  <option value="超商 取貨付款">超商 取貨付款</option>
                </select>
                <div class="p-3 mt-2 rounded x-small text-secondary" style="background-color: #f8f9fa;">
                  採用黑貓宅急便、新竹物流等配送。本島未達門檻運費 NT$80。
                </div>
              </div>
              <div class="col-12">
                <label class="form-label small fw-bold">付款方式</label>
                <select class="form-select bg-light border-0 py-2" v-model="cartStore.paymentMethod">
                  <option value="">請選擇付款方式</option>
                  <option value="貨到付款">貨到付款</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card border-0 shadow-sm rounded-1 h-100">
          <div class="card-header bg-white border-bottom-0 pt-4 px-4">
            <h5 class="fw-bold mb-0">訂單資訊</h5>
          </div>
          <div class="card-body p-4">
            <div class="d-flex justify-content-between mb-3">
              <span class="text-secondary small">小計:</span>
              <span class="fw-bold">NT${{ cartStore.subtotal }}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <span class="text-secondary small">運費:</span>
              <span class="fw-bold">NT${{ cartStore.shippingFee }}</span>
            </div>
            <button class="btn btn-link p-0 text-primary small text-decoration-none">使用優惠代碼</button>
            <hr class="my-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <span class="fw-bold fs-5">合計:</span>
              <span class="fw-bold fs-4 text-dark">NT${{ cartStore.totalAmount }}</span>
            </div>
            <button class="btn btn-gym-green w-100 py-3 fw-bold shadow-sm" @click="goToCheckout">
              前往結帳
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="text-center py-5">
      <h3 class="fw-bold mb-3 text-dark">購物車目前是空的喔！</h3>
      <button class="btn btn-gym-green px-5 py-3 rounded-pill fw-bold" @click="router.push('/shop/products')">前往選購商品</button>
    </div>

  </div>
</div>
</template>

<style scoped>
/* 樣式保持不變 */
.checkout-stepper { max-width: 600px; margin: 0 auto; }
.step-item { position: relative; width: 80px; }
.step-circle { width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 2px solid #dee2e6; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #dee2e6; z-index: 2; }
.step-label { font-size: 0.85rem; margin-top: 8px; color: #adb5bd; }
.step-item.active .step-circle { border-color: #f3722c; color: #f3722c; }
.step-item.active .step-label { color: #333; font-weight: bold; }
.step-line { height: 2px; width: 100px; background: #dee2e6; margin-bottom: 25px; margin-left: -10px; margin-right: -10px; }

.qty-selector { width: 110px; }
.text-gym-green { color: #28a745; font-weight: bold; }
.text-gym-orange { color: #f3722c; }
.btn-gym-green { background-color: #f3722c; color: white; border: none; }
.btn-gym-green:hover { background-color: #e6601c; color: white; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.x-small { font-size: 0.75rem; }
.cursor-pointer { cursor: pointer; }

.dot { width: 8px; height: 8px; background: #dee2e6; border-radius: 50%; display: inline-block; }
.dot.active { background: #f3722c; width: 20px; border-radius: 4px; }

.text-truncate-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>