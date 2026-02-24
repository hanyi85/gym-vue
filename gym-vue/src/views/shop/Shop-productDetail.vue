<script setup>
import { ref, onMounted, computed, watch } from 'vue'; 
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const quantity = ref(1);
const activeImageIndex = ref(0);
const allProducts = ref([]);

const API_URL=import.meta.env.VITE_API_URL

const maskName = (name) => {
  if (!name) return "匿名用戶";
  const str = String(name);
  if (str.length <= 2) return str.substring(0, 1) + "*";
  return str.substring(0, 1) + "*".repeat(str.length - 2) + str.substring(str.length - 1);
};

const loadProduct = () => {
  const specId = route.params.id;
  
  axios.get(API_URL+'SProducts/'+specId)
    .then(resp => {
      const data = resp.data;
      console.log("單一商品 API 回傳內容：", data);

      product.value = {
        id: data.PId,
        name: data.PName,
        specName: data.SpecName,     
        price: data.Price,                 
        discountPrice: data.DiscountPrice,
        category: data.CategoryName,
        images: data.ImageList || [],
        description: data.Description || '暫無商品描述',
        rating: data.AverageStar || 0,
        reviewCount: data.TotalComments || 0,
        // 修正後的 map 邏輯
comments: (data.Comments || []).map(c => {
    console.log("正在處理的評論原始物件:", c);
    
    return {
        userName: maskName(c.UserName || `User${c.UserId}`),
        star: c.CommentStar || 0, 
        content: c.productComment|| c.ProductComment || c.productcomment || "（讀取內容失敗）", 
        date: c.CommentTime ? c.CommentTime.replace(/-/g, '/').substring(0, 10) : ''
    };
})
      };
    })
    .catch(error => {
      console.error('抓取商品詳情失敗:', error);
    });
};



const loadRelatedProducts = () => {
  // 這裡路徑要確認，如果是複用列表頁，通常是 SProducts
  axios.get(API_URL + 'SProducts') 
    .then(resp => {
      allProducts.value = resp.data.map(p => ({
        id: p.PId,
        name: p.PName,
        specName: p.SpecName,
        price: (p.DiscountPrice && p.DiscountPrice > 0) ? p.DiscountPrice : p.Price,
  originalPrice: p.Price,
  hasDiscount: !!(p.DiscountPrice && p.DiscountPrice > 0),
        image: API_URL.replace('/api/', '').replace(/\/$/, '') + p.ImagePath,
      }));
    })
    .catch(err => {
      console.error("抓取列表失敗:", err);
    });
};

const relatedProducts = computed(() => {
  if (allProducts.value.length === 0) return [];
  
  return allProducts.value
    .filter(p => p.id !== product.value?.id) 
    .slice(0, 4); 
});

onMounted(() => {
  loadProduct();
  loadRelatedProducts();
});


const decreaseQty = () => { if (quantity.value > 1) quantity.value--; };
const increaseQty = () => { quantity.value++; };

const addToCart = () => {
  // 從 localStorage 取得登入會員資訊
  // const user = JSON.parse(localStorage.getItem('user'));
  
  // if (!user) {
  //   alert("請先登入會員");
  //   return;
  // }
const tempUserId = 1;
const cartData = {
    
    UserId: tempUserId, 
    SpecId: parseInt(route.params.id), 
    Quantity: quantity.value, 
    Price: product.value.price
  };
  console.log("嘗試送出的購物車資料：", cartData);

  axios.post(`${API_URL}SCarts/AddToCart`, cartData)
    .then(res => {
      if (confirm("商品已加入購物車！是否要立即前往購物車結帳？")) {
      router.push('/shop/cart'); 
    } else {
      console.log("使用者選擇繼續購物");}
    })
    .catch(err => {
      console.error("加入購物車失敗", err);
      alert("系統忙碌中，請稍後再試");
    });
};
  
  // 4. 提示使用者並詢問是否前往購物車
  // if (confirm(`已將 ${quantity.value} 件商品加入購物車！是否立即前往結帳？`)) {
  //   router.push('/shop/cart');
  // }


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
  <div class="col-lg-6" v-if="product.images && product.images.length > 0">
    <div id="productCarousel" class="carousel slide border rounded shadow-sm overflow-hidden mb-3" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div 
          v-for="(img, index) in product.images" 
          :key="'main-' + index"
          class="carousel-item" 
          :class="{ active: index === 0 }"
          data-bs-interval="3000"
        >
          <img 
  :src="API_URL.replace('/api/', '') + img" 
  class="d-block w-100" 
  style="object-fit: cover; aspect-ratio: 1/1;"
>
        </div>
      </div>
      
      <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
      </button>
    </div>

    <div class="d-flex gap-2 overflow-auto pb-2 custom-scrollbar">
      <div 
        v-for="(img, index) in product.images" 
        :key="'thumb-' + index"
        class="thumb-box border rounded cursor-pointer"
        data-bs-target="#productCarousel" 
        :data-bs-slide-to="index"
        style="width: 80px; height: 80px; flex-shrink: 0; overflow: hidden; cursor: pointer;"
      >
        <img 
  :src="API_URL.replace('/api/', '') + img" 
  class="w-100 h-100" 
  style="object-fit: cover;"
>
      </div>
    </div>
  </div>
  
  <div class="col-lg-6">
    <h1 class="product-title fs-3 fw-bold mb-2">{{ product.name }}({{ product.specName }})</h1>
    <p class="text-muted small mb-4 line-height-base">{{ product.description }}</p>
    
    <div class="promo-banner border-start border-warning border-4 ps-3 py-2 mb-4 bg-light small">
      <div class="text-dark mb-1">至 03/14 00:00 截止 全店，馬上紅包袋</div>
      <div class="text-dark">至 03/14 00:00 截止 全店，滿 $1,288 送品牌春聯</div>
    </div>

    <div class="price-rating-area mb-4">
      <div class="d-flex align-items-baseline mb-1">
        <span class="text-danger fs-2 fw-bold me-2">
          NT${{ (product.discountPrice && product.discountPrice > 0) ? product.discountPrice : product.price }}
        </span>
        <span v-if="product.discountPrice && product.discountPrice > 0" class="text-muted text-decoration-line-through small">
          NT${{ product.price }}
        </span>
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

    <div class="row g-2">
      <div class="col-6">
        <button class="btn w-100 py-2 fw-bold text-white btn-add-cart" @click="addToCart" style="background-color: #ff8c00; border: none;">加入購物車</button>
      </div>
      <div class="col-6">
        <button class="btn w-100 py-2 fw-bold text-white" @click="buyNow" style="background-color: #f4511e; border: none;">立即購買</button>
      </div>
    </div>
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
  <div class="mx-auto max-width-800 py-4">
    <div class="row align-items-center mb-5">
      <div class="col-md-4 text-center border-end">
        <h4 class="fw-bold mb-1">{{ product.reviewCount }} 個評價</h4>
        <div class="text-warning fs-5 mb-1">
          <span v-for="i in 5" :key="i">{{ i <= Math.round(product.rating) ? '★' : '☆' }}</span>
          <span class="ms-2 text-dark fs-6">{{ product.rating }} 分</span>
        </div>
      </div>
      <div class="col-md-8 ps-md-4">
        <div v-for="i in [5,4,3,2,1]" :key="i" class="d-flex align-items-center mb-1 small text-muted">
          <span class="me-2" style="width: 30px;">{{ i }} 分</span>
          <div class="progress flex-grow-1" style="height: 4px;">
            <div class="progress-bar bg-warning" :style="{ width: (i === 5 ? '98%' : (i === 4 ? '2%' : '0%')) }"></div>
          </div>
          <span class="ms-2" style="width: 30px;">{{ i === 5 ? '98%' : (i === 4 ? '2%' : '0%') }}</span>
        </div>
      </div>
    </div>

    <hr class="my-5">

    <div v-if="product.comments && product.comments.length > 0">
      <div v-for="(comment, index) in product.comments" :key="index" class="row mb-5">
        <div class="col-md-4 d-flex align-items-start mb-2 mb-md-0">
          <div class="avatar-circle bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
            <i class="bi bi-person text-secondary fs-4"></i>
          </div>
          <div>
            <div class="fw-bold">{{ comment.userName }}</div>
            <div class="text-muted small">{{ comment.date }}</div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="text-warning mb-2">
            <span v-for="star in 5" :key="star">{{ star <= comment.star ? '★' : '☆' }}</span>
          </div>
          <p class="text-secondary small">{{ comment.content }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-5">
      <p class="text-muted italic">目前尚無詳細評價內容</p>
    </div>
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
                
              </span>
            </div>
            <p class="product-name small mb-2 text-dark text-truncate-2">{{ item.name }}({{ item.specName }})</p>
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
.avatar-circle {
  border: 1px solid #eee;
}

.progress {
  background-color: #f5f5f5;
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

/* 確保評價內容的文字顏色與圖片一致 */
.text-secondary {
  color: #666 !important;
}

.max-width-800 {
  max-width: 800px;
}

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