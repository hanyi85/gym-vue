<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // 確保匯入 watch
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 模擬商品資料庫，建議與 Shop-product.vue 的 ID 對應
const allProducts = ref([
  { 
    id: 1, 
    name: '水解乳清蛋白【可可歐蕾】500克-GOpower果果能量', 
    category: '乳清蛋白',
    price: 729, 
    originalPrice: 1100,
    image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href,
    rating: 5.0,
    reviewCount: 313,
    description: '濃郁可可香氣搭配歐蕾的絲滑口感，每一口都彷彿沉浸在濃郁香醇的巧克力海洋中。',
    features: ['水解技術，將蛋白質轉換為更小形式', '獨家水解技術，適合腸胃吸收較不佳者', '採用國際知名大廠乳清蛋白'],
    additions: [
      { id: 101, name: '脆米蛋白棒【雙癒可可】', price: 64, checked: false },
      { id: 102, name: '濃縮乳清蛋白【臻醇可可】隨身包', price: 50, checked: false }
    ]
  },
  { 
    id: 2, 
    name: '【果果能量】分離乳清蛋白 - 經典原味', 
    category: '乳清蛋白',
    price: 650, 
    originalPrice: 800,
    image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href,
    rating: 4.8,
    reviewCount: 156,
    description: '極低脂肪與碳水化合物，適合追求純淨蛋白質補充的健身者。',
    features: ['極低乳糖', '迅速吸收', '無添加人工香料'],
    additions: [
      { id: 101, name: '搖搖杯 - 霧黑款', price: 199, checked: false }
    ]
  }
]);

const product = ref(null);
const quantity = ref(1);
const activeImageIndex = ref(0);

// 載入商品邏輯
const loadProduct = () => {
  const productId = parseInt(route.params.id);
  const found = allProducts.value.find(p => p.id === productId);
  if (found) {
    product.value = found;
  } else {
    // 若找不到則預設顯示第一筆，或導回列表
    product.value = allProducts.value[0];
  }
};

onMounted(loadProduct);

// 監聽 ID 變化，避免切換商品時頁面不更新
watch(() => route.params.id, loadProduct);

// 數量控制
const decreaseQty = () => { if (quantity.value > 1) quantity.value--; };
const increaseQty = () => { quantity.value++; };

// 加入購物車模擬
const addToCart = () => {
  // 1. 從本地儲存取得現有購物車資料，若無則為空陣列
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // 2. 檢查購物車是否已有相同商品
  const existingItem = cart.find(item => item.id === product.value.id);

  if (existingItem) {
    // 若有，增加數量
    existingItem.quantity += quantity.value;
  } else {
    // 若無，新增商品資訊
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      category: product.value.category,
      quantity: quantity.value
    });
  }

  // 3. 存回 localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // 4. 提示使用者並詢問是否前往購物車
  if (confirm(`已將 ${quantity.value} 件商品加入購物車！是否立即前往結帳？`)) {
    router.push('/shop/cart');
  }
};

const relatedProducts = computed(() => {
  return allProducts.value
    .filter(p => p.id !== product.value?.id)
    .slice(0, 4);
});

// 跳轉至指定產品明細頁
const goToProduct = (id) => {
  router.push(`/shop/products/${id}`);
  // 跳轉後自動捲動回頂部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(
  () => route.params.id, 
  (newId) => {
    if (newId) {
      loadProduct(); // 當 ID 改變時，重新執行抓取資料的邏輯
    }
  }
);
</script>

<template>
  <div v-if="product" class="product-detail-container container py-4">
    <nav class="breadcrumb-nav mb-4 small text-muted">
      全部商品 / {{ product.category }}
    </nav>

    <div class="row g-5">
      <div class="col-lg-6">
        <div class="image-gallery">
          <div class="main-image-box border rounded bg-white position-relative mb-3">
            <img :src="product.image" class="img-fluid main-img" :alt="product.name">
            
          </div>

          <div class="thumbnail-row d-flex gap-2">
            <div 
              class="thumb-item border rounded overflow-hidden" 
              :class="{ 'active-thumb': activeImageIndex === 0 }"
              @click="activeImageIndex = 0"
            >
              <img :src="product.image" class="img-fluid">
            </div>
            <div 
              v-for="i in 2" :key="i"
              class="thumb-item border rounded overflow-hidden opacity-50"
              @click="activeImageIndex = i"
            >
              <img :src="product.image" class="img-fluid" style="filter: grayscale(1);">
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <h1 class="product-title fs-3 fw-bold mb-2">{{ product.name }}</h1>
        <p class="text-muted small mb-4 line-height-base">{{ product.description }}</p>
        
        <ul class="list-unstyled mb-4">
          <li v-for="feat in product.features" :key="feat" class="small text-secondary mb-1">
            ◦ {{ feat }}
          </li>
        </ul>

        <div class="promo-banner border-start border-warning border-4 ps-3 py-2 mb-4 bg-light small">
          <div class="text-dark mb-1">至 02/11 00:00 截止 全店，馬上紅包袋</div>
          <div class="text-dark">至 02/11 00:00 截止 全店，滿 $1,288 送品牌春聯</div>
        </div>

        <div class="price-rating-area mb-4">
          <div class="d-flex align-items-baseline mb-1">
            <span class="text-danger fs-2 fw-bold me-2">NT${{ product.price }}</span>
            <span class="text-muted text-decoration-line-through small">NT${{ product.originalPrice }}</span>
          </div>
          <div class="rating text-warning small">
            ★★★★★ <span class="text-muted ms-2">{{ product.rating }} | {{ product.reviewCount }} 個評價</span>
          </div>
        </div>

        <div class="quantity-control mb-4">
          <label class="small text-muted d-block mb-2">數量</label>
          <div class="input-group" style="width: 130px;">
            <button class="btn btn-outline-secondary py-1" @click="decreaseQty">-</button>
            <input type="text" class="form-control text-center border-secondary py-1" v-model="quantity" readonly>
            <button class="btn btn-outline-secondary py-1" @click="increaseQty">+</button>
          </div>
        </div>

        <!-- <div class="addon-box border rounded p-3 mb-4 bg-light">
          <div class="addon-title small fw-bold mb-3 text-muted">+ 以優惠價加購商品 (最多 1 件)</div>
          <div v-for="addon in product.additions" :key="addon.id" class="addon-item d-flex align-items-center mb-2">
            <input type="checkbox" class="form-check-input me-3" v-model="addon.checked">
            <div class="addon-img-placeholder border rounded bg-white me-2"></div>
            <div class="addon-info small">
              <div class="text-dark">{{ addon.name }}</div>
              <div class="text-danger">優惠價 NT${{ addon.price }}</div>
            </div>
          </div>
        </div> -->

        <div class="row g-2">
          <div class="col-6">
            <button class="btn w-100 py-2 fw-bold text-white btn-add-cart" @click="addToCart">加入購物車</button>
          </div>
          <div class="col-6">
            <button class="btn w-100 py-2 fw-bold text-white btn-buy-now">立即購買</button>
          </div>
        </div>
        
        <!-- <div class="text-center mt-3">
          <a href="#" class="text-muted small text-decoration-none">♡ 加入追蹤清單</a>
        </div> -->
      </div>
    </div>
    <div class="product-info-tabs mt-5">
      <ul class="nav nav-tabs justify-content-center border-bottom-0" id="productTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active fw-bold px-4" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">商品描述</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link fw-bold px-4" id="shipping-tab" data-bs-toggle="tab" data-bs-target="#shipping" type="button" role="tab">送貨及付款方式</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link fw-bold px-4" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">顧客評價</button>
        </li>
      </ul>

      <div class="tab-content border-top pt-5" id="productTabContent">
        <div class="tab-pane fade show active text-center" id="description" role="tabpanel">
          <h5 class="fw-bold mb-4">商品描述</h5>
          <div class="cert-image mb-5">
             <div class="bg-dark text-white py-5 px-3 rounded d-inline-block w-100 max-width-800">
                <h2 class="fw-bold">採用 <span class="text-warning">ISO</span> 及 <span class="text-warning">HACCP</span> 認證廠商</h2>
                <p class="fs-4">進行生產及包裝，安全有保障</p>
             </div>
          </div>
          <div class="description-text text-start mx-auto max-width-800">
            <p class="fw-bold fs-5 border-bottom pb-2 mb-3">{{ product.name }}</p>
            <ul class="list-unstyled lh-lg text-secondary">
              <li>【內容物】：500克</li>
              <li>【保存方式】：避免放置陽光直射、高溫潮濕處，產品拆封後請儘快食用完畢</li>
              <li>【建議食用方式】：以 1:10 比例的常溫水或喜愛飲品沖泡食用</li>
              <li>【其他細項事項】：本產品含有牛奶及其製品，不適合對其過敏體質者食用</li>
            </ul>
            <p class="mt-4 small text-muted">
              依據衛福部公告，每日蛋白質建議攝取量為體重之 1.1 倍公克的蛋白質，但是國人普遍攝取不足，因此乳清蛋白是能快速攝取補充蛋白值得好方法，從新鮮牛奶中萃取出來的乳清蛋白含有極高比例的蛋白質，是優質的蛋白質攝取來源，還能同時補充人體必需胺基酸和維生素礦物質等營養。<br><br>


大分子水解成小分子
採用國際知名大廠進口之優質乳清蛋白，高達80%以上的蛋白質含量，粉末即溶好吸收，口感滑順淡淡奶香(因口味不同，蛋白質%數略有不同，一個口味包裝上營養標示為主)。<br><br>

沖泡方式
以40度以下常溫水，以1:10的水量比例搖勻飲用。可依個人喜好調整水量或加入冰塊，不影響蛋白質攝取量和效果。沖泡乳清時建議水溫不要超過60度，溫度過高會使蛋白質變性而影響口感，想要溫熱喝可以先以一半的常溫水泡開乳清後再酌量加入溫熱水，整體溫度不要超過60度。<br><br>

使用蔗糖素取代蔗糖，甜度相當卻0熱量
果果能量乳清蛋白全系列產品皆不使用阿斯巴甜，而是使用蔗糖素作為甜味劑，取代蔗糖卻幾乎不含熱量，敬請安心食用。
            </p>
          </div>
        </div>

        <div class="tab-pane fade" id="shipping" role="tabpanel">
          <div class="mx-auto max-width-800 py-4">
            <h6 class="fw-bold">送貨方式</h6>
            <ul class="text-secondary small mb-4">
              <li>超商取貨 (7-11 / 全家)</li>
              <li>宅配到府 (新竹物流)</li>
            </ul>
            <h6 class="fw-bold">付款方式</h6>
            <ul class="text-secondary small">
              <li>信用卡 (Visa, Master, JCB)</li>
              <li>LINE Pay / 街口支付</li>
              <li>超商代碼繳費</li>
            </ul>
          </div>
        </div>

        <div class="tab-pane fade" id="reviews" role="tabpanel">
          <div class="mx-auto max-width-800 py-4 text-center">
             <div class="fs-2 text-warning mb-2">★★★★★</div>
             <p class="fw-bold">{{ product.rating }} / 5.0</p>
             <p class="text-muted">共有 {{ product.reviewCount }} 位顧客留下評價</p>
             <hr>
             <p class="text-muted italic small py-5">目前尚無詳細文字評論內容</p>
          </div>
        </div>
      </div>
    </div>
    <div class="related-products-section mt-5 pt-5 border-top">
      <div class="text-center mb-5">
        <h4 class="fw-bold d-inline-block border-bottom border-warning border-3 pb-2">相關產品</h4>
      </div>

      <div class="row g-4 justify-content-center">
        <div 
          v-for="item in relatedProducts" 
          :key="item.id" 
          class="col-6 col-md-3"
          @click="goToProduct(item.id)" 
          style="cursor: pointer;"
        >
          <div class="product-card text-center h-100">
            <div class="image-wrapper bg-light rounded p-3 mb-3 position-relative">
              <img :src="item.image" class="img-fluid" :alt="item.name">
              <span class="badge bg-warning position-absolute top-0 end-0 m-2 opacity-75 small">
                {{ item.tag || '500g' }}
              </span>
            </div>
            <p class="product-name small mb-2 text-dark text-truncate-2">{{ item.name }}</p>
            <div class="product-price">
              <span class="text-warning fw-bold me-1">NT${{ item.price }}</span>
              <span class="text-muted text-decoration-line-through x-small">NT${{ item.originalPrice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 相關產品樣式 */
.x-small { font-size: 0.75rem; }
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  height: 2.8rem; /* 確保對齊 */
}

.product-card:hover .image-wrapper {
  background-color: #f0f0f0 !important;
  transition: background-color 0.3s;
}

.product-card .image-wrapper {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-name {
  line-height: 1.4;
  height: 38px;
}

.nav-tabs .nav-link {
  color: #666;
  border: none;
  border-bottom: 2px solid transparent;
  padding-bottom: 10px;
  background: none;
}

.nav-tabs .nav-link.active {
  color: #f3722c; /* 橘色主題色 */
  border-bottom: 2px solid #f3722c;
  background: none;
}

.max-width-800 {
  max-width: 800px;
}

.tab-content {
  min-height: 400px;
}

/* 模擬認證圖片比例 */
.cert-image h2 {
  letter-spacing: 2px;
}

.description-text li {
  font-size: 0.95rem;
}

.product-detail-container { max-width: 1100px; }
.line-height-base { line-height: 1.6; }

/* 圖片樣式 */
.main-image-box {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-img { max-height: 90%; object-fit: contain; }

.thumbnail-row .thumb-item {
  width: 60px;
  height: 60px;
  cursor: pointer;
}
.active-thumb { border-color: #f3722c !important; border-width: 2px !important; opacity: 1 !important; }

/* 促銷框樣式 */
.promo-banner { border-left-color: #f3722c !important; }

/* 加價購樣式 */
.addon-img-placeholder { width: 45px; height: 45px; }

/* 按鈕配色 */
.btn-add-cart { background-color: #ff9f1c; border: none; }
.btn-add-cart:hover { background-color: #f38d00; }
.btn-buy-now { background-color: #f3722c; border: none; }
.btn-buy-now:hover { background-color: #d65a1a; }

.form-check-input:checked { background-color: #f3722c; border-color: #f3722c; }
</style>