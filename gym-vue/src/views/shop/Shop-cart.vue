<script setup>
import { ref, onMounted, computed, watch } from 'vue'; 
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const cartItems = ref([]);
const shippingFee = ref(80);

const API_URL=import.meta.env.VITE_API_URL

const addonProducts = ref([
  { id: 101, name: '濃縮乳清蛋白【鴨屎香檸檬茶】隨身包', price: 50, image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href},
  { id: 102, name: '蛋白香酥脆【愛情海瓜子】', price: 42, image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href},
  { id: 103, name: '蛋白香酥脆【朱雀咖喱聯名】', price: 42, image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href},
  { id: 104, name: '堅果能量棒【黑巧瑪卡】', price: 49, image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href}
]);

const loadCart = async () => {
  // 這裡之後要改為從 API 抓取
  try {
    const userId = 1; // 暫時寫死
    const res = await axios.get(`${API_URL}SCarts/User/${userId}`);
    const serverBaseUrl = API_URL.replace(/\/api\/?$/, '');

    cartItems.value = res.data.map(item => {
      let finalImageUrl = "";
      if (item.ImagePath) {
        // 確保路徑開頭有斜線，並與根網址拼接
        const path = item.ImagePath.startsWith('/') ? item.ImagePath : `/${item.ImagePath}`;
        finalImageUrl = `${serverBaseUrl}${path}`;
      } else {
        finalImageUrl = new URL('./images/乳清蛋白 可可.png', import.meta.url).href;
      }

      return {
        id: item.CartId,       // 對應圖17的 CartId
        specId: item.SpecId,   // 對應圖17的 SpecId
        name: item.Name,       // 對應圖17的 Name
        price: item.Price,
        quantity: item.Quantity,
        image: finalImageUrl
      };
    });
    console.log("購物車已載入，第一項圖片網址：", cartItems.value[0]?.image);
  } catch (err) {
    console.error("載入購物車失敗", err);
  }
};

onMounted(loadCart);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const totalAmount = computed(() => subtotal.value + shippingFee.value);

const updateQty = async (index, delta) => {
  const item = cartItems.value[index];
  const nextQty = item.quantity + delta;
  
  if (nextQty >= 1) {
    try {
      await axios.put(`${API_URL}SCarts/${item.id}`, nextQty, {
        headers: { 'Content-Type': 'application/json' }
      });
      item.quantity = nextQty;
    } catch (err) {
      console.error("更新數量失敗", err);
    }
  }
};

const removeItem = async (index) => {
  const item = cartItems.value[index];
  
  if (!item || !item.id) {
    console.error("找不到該項目的 ID");
    return;
  }

  if (!confirm(`確定要刪除「${item.name}」嗎？`)) return;

  try {
    const res = await axios.delete(`${API_URL}SCarts/${item.id}`);
    
    if (res.status === 200) {
      cartItems.value.splice(index, 1);
      if (cartItems.value.length === 0) {
        console.log("購物車已清空");
      }
    }
  } catch (err) {
    console.error("刪除失敗:", err);
    alert("刪除失敗，請檢查網路或後端服務");
  }
};

const goToShop = () => {
  // 📍 請確認你的路由名稱是否為 'Shop' 或 'shop-list'
  router.push({ name: 'shop-products' }); 
};

const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};

// 📍 修正 3: 加入監聽確保資料同步更新
watch(cartItems, saveCart, { deep: true });

const addonContainer = ref(null);
const currentAddonPage = ref(0);

const scrollToPage = (pageIndex) => {
  currentAddonPage.value = pageIndex;
  if (addonContainer.value) {
    const container = addonContainer.value;
    // 假設一組顯示 3 個產品，計算該頁面對應的滾動距離
    // 這裡使用容器寬度作為位移基準
    const scrollAmount = container.clientWidth * pageIndex;
    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
};

const goToCheckout = () => {
  if (cartItems.value.length === 0) {
    alert('您的購物車是空的喔！');
    return;
  }
  
  // 📍 執行跳轉至填寫資料頁面
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

      <div v-if="cartItems.length > 0" class="row g-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm rounded-1 mb-4">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">購物車 ({{ cartItems.length }} 件)</h5>
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
                  <tr v-for="(item, index) in cartItems" :key="item.id">
                    <td class="ps-4 py-4">
                      <div class="d-flex align-items-center">
                        <img :src="item.image" class="rounded border bg-white" width="70" height="70" style="object-fit: cover;">
                        <div class="ms-3">
                          <div class="small fw-bold text-dark mb-1">{{ item.name }}</div>
                          <div class="text-danger x-small">免運優惠中</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-start">
                      <span class="text-secondary small"></span>
                    </td>
                    <td class="small">
                      <div class="text-dark">NT${{ item.price }}</div>
                      <div class="text-muted x-small text-decoration-line-through">NT${{ item.price + 200 }}</div>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center">
                        <div class="input-group input-group-sm qty-selector" style="width: 100px;">
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
                <span class="small text-secondary">常溫商品滿 $899 免運，<span class="text-gym-green">再買 NT$115 即享有免運</span></span>
              </div>
              <div class="text-end">
                <a @click="router.push('/shop')" class="text-decoration-underline small text-dark cursor-pointer" style="cursor: pointer;">繼續購物</a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm rounded-1">
            <div class="card-header bg-white border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0">購物車加價購</h5>
            </div>
            <div class="card-body p-4 position-relative">
              <div ref="addonContainer" class="d-flex gap-4 overflow-hidden pb-3 hide-scrollbar">
                <div v-for="addon in addonProducts" :key="addon.id" class="addon-item flex-shrink-0" style="width: calc(33.333% - 1.5rem);">
                  <div class="d-flex align-items-start">
                    <img :src="addon.image" class="rounded border" width="100" height="100" style="object-fit: cover;">
                    <div class="ms-3 flex-grow-1">
                      <div class="small fw-bold text-dark mb-1 lh-sm">{{ addon.name }}</div>
                      <div class="text-gym-orange fw-bold mb-2">NT${{ addon.price }}</div>
                      <button class="btn btn-dark btn-sm w-100 py-1 fw-bold">加入購物車</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-1 h-100">
            </div>
        </div>

        <div class="col-lg-5">
          <div class="card border-0 shadow-sm rounded-1 h-100">
            </div>
        </div>
      </div>

      <div v-else class="row justify-content-center">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm rounded-1 py-5">
            <div class="card-body text-center">
              <div class="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#dee2e6" class="bi bi-cart-dash" viewBox="0 0 16 16">
                  <path d="M6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </div>
              <h3 class="fw-bold mb-3 text-dark">購物車目前是空的喔！</h3>
              <p class="text-secondary mb-5">您的購物車目前沒有任何商品，快去選購一些優質補給吧。</p>
              <button @click="router.push('/shop/products')" class="btn btn-gym-green px-5 py-3 fw-bold shadow-sm rounded-pill">
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
/* 📍 統一進度條樣式 */
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

.step-line { height: 2px; width: 100px; background: #dee2e6; margin-bottom: 25px; margin-left: -10px; margin-right: -10px; }

/* 📍 統一標題與輸入框風格 */
h5 { font-size: 1.15rem; }
.form-select, .form-control { font-size: 0.9rem; }
.form-select:focus { border: 1px solid #f3722c !important; box-shadow: none; background-color: #fff !important; }

/* 📍 數量選擇器優化 */
.qty-selector { width: 120px; }
.qty-selector .form-control { height: 34px; }
.qty-selector button { background: #fff; border-color: #dee2e6; }

/* 其他既有樣式... */
.text-gym-green { color: #f3722c; }
.btn-gym-green { background-color: #f3722c; color: white; border: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.dot { width: 10px; height: 10px; background-color: #dee2e6; border-radius: 50%; cursor: pointer; }
.dot.active { background-color: #ff8c00; }
</style>