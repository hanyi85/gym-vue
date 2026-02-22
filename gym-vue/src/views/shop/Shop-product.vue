<script setup>

import { ref , onMounted} from 'vue';
import Banner from '@/components/banner.vue'

const products = ref([]);

const API_URL = 'https://localhost:7218/api/SProducts';

const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API 連線失敗');
    
    const data = await response.json();
    console.log('DTO 實際回傳內容:', data);

    products.value = data.map(item => {
      const id = item.PId ?? item.pId;
      const pName = item.PName ?? item.pName;
      const price = item.Price ?? item.price ?? 0;
      const specName = item.SpecName ?? item.specName;

      return {
        id: id,
        name: specName ? `${pName} (${specName})` : pName,
        price: price,
        originalPrice: (price * 1.2).toFixed(0),
        // 確保圖片路徑正確，如果是本地開發建議先檢查此 URL 是否有效
        image: new URL('./images/乳清蛋白 可可.png', import.meta.url).href 
      };
    });
  } catch (error) {
    console.error('抓取失敗:', error);
  }
};

onMounted(() => {
  fetchProducts();
});





const activeCategory = ref('乳清蛋白'); // 預設改為乳清蛋白

const searchQuery = ref('');

const showSort = ref(false);

const showLimit = ref(false);

const currentLimit = ref(24);

const sortOptions = ['上架時間: 由新到舊', '上架時間: 由舊到新', '價格: 由高至低', '價格: 由低至高', '銷量: 由高至低'];



const selectSort = (option) => { showSort.value = false; };

const selectLimit = (num) => { currentLimit.value = num; showLimit.value = false; };



const vClickOutside = {

  mounted(el, binding) {

    el.clickOutsideEvent = (event) => {

      if (!(el === event.target || el.contains(event.target))) binding.value();

    };

    document.addEventListener('click', el.clickOutsideEvent);

  },

  unmounted(el) { document.removeEventListener('click', el.clickOutsideEvent); },

};



const categories = ref([

  { name: '精選商品', isOpen: false, subCategories: ['本月熱銷', '新品上市'] },

  { name: '推薦清單', isOpen: false, subCategories: ['增肌推薦', '減脂推薦'] },

  { name: '乳清蛋白', isOpen: true, subCategories: ['濃縮乳清蛋白', '分離乳清蛋白', '水解乳清蛋白', '緩釋酪蛋白'] },

  { name: '健康零食', isOpen: false, subCategories: ['蛋白棒', '威化餅'] }

]);



const handleCategoryClick = (cat) => {

  cat.isOpen = !cat.isOpen;

  activeCategory.value = cat.name;

};

const updateTitle = (name) => { activeCategory.value = name; };

</script>



<template>
  <banner title="線上商城" subtitle="專業健身補給，助力你的每一個突破" />

  <div class="shop-page container py-4">

    <div class="row">

      <aside class="col-lg-2">

        <div class="category-menu">

          <ul class="list-unstyled">

            <li class="menu-item mb-3">

              <a href="javascript:void(0)" class="fw-bold text-decoration-none d-block py-1 transition-color"

                 :class="activeCategory === '全部商品' ? 'text-danger' : 'text-dark'"

                 @click="updateTitle('全部商品')">全部商品</a>

            </li>

            <li v-for="(cat, index) in categories" :key="index" class="menu-item mb-3">

              <div class="category-header d-flex justify-content-between align-items-center cursor-pointer py-1" @click="handleCategoryClick(cat)">

                <span class="fw-bold transition-color" :class="{ 'text-danger': activeCategory === cat.name || cat.isOpen }">{{ cat.name }}</span>

                <span class="v-icon" :class="{ 'rotated': cat.isOpen }"></span>

              </div>

              <transition name="expand">

                <ul v-show="cat.isOpen" class="list-unstyled ms-3 mt-1">

                  <li v-for="sub in cat.subCategories" :key="sub" class="py-1">

                    <a href="javascript:void(0)" class="small text-decoration-none d-block transition-color hover-red"

                       :class="activeCategory === sub ? 'text-danger fw-bold' : 'text-muted'" @click.stop="updateTitle(sub)">{{ sub }}</a>

                  </li>

                </ul>

              </transition>

            </li>

          </ul>

        </div>

      </aside>



      <main class="col-lg-10 ps-lg-5">

        <div class="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">

          <h4 class="fw-bold mb-0 text-dark">{{ activeCategory }}</h4>

         

          <div class="d-flex gap-4 align-items-center text-muted small">

            <div class="search-box">

              <input type="text" v-model="searchQuery" placeholder="搜尋" class="pure-input">

            </div>



            <div class="dropdown-wrapper" v-click-outside="() => showSort = false">

              <div class="cursor-pointer" @click="showSort = !showSort"><span class="icon me-1">⇅</span>商品排序 </div>

              <transition name="fade">

                <ul v-show="showSort" class="custom-dropdown shadow-sm border">

                  <li v-for="item in sortOptions" :key="item" @click="selectSort(item)">{{ item }}</li>

                </ul>

              </transition>

            </div>



            <div class="dropdown-wrapper" v-click-outside="() => showLimit = false">

              <div class="cursor-pointer" @click="showLimit = !showLimit"><span class="icon me-1">≡</span>每頁顯示 {{ currentLimit }} 個 </div>

              <transition name="fade">

                <ul v-show="showLimit" class="custom-dropdown shadow-sm border">

                  <li v-for="num in [24, 48, 72]" :key="num" @click="selectLimit(num)">每頁顯示 {{ num }} 個</li>

                </ul>

              </transition>

            </div>

          </div>

        </div>



        <div class="row g-4 mb-5">
  <div v-for="product in products" :key="product.id" class="col-md-4 col-sm-6 text-start">
    <div class="product-card">
      
      <router-link :to="`/shop/products/${product.id}`" class="text-decoration-none">
        <div class="img-wrapper mb-3 rounded bg-light shadow-sm d-flex align-items-center justify-content-center">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.name"
            class="product-img"
          >
          <span v-else class="text-muted small">無圖片</span>
        </div>
      </router-link>

      <router-link :to="`/shop/products/${product.id}`" class="text-decoration-none">
        <p class="mb-1 small text-dark product-name hover-red-text">{{ product.name }}</p>
      </router-link>

      <div class="price-info">
        <span class="text-danger fw-bold me-2">NT${{ product.price }}</span>
        <span class="text-muted text-decoration-line-through x-small">NT${{ product.originalPrice }}</span>
      </div>
    </div>
  </div>
</div>



        <nav class="pagination-nav d-flex justify-content-end">

          <ul class="pagination-list d-flex list-unstyled align-items-center gap-3">

            <li class="page-item active">1</li>

            <li class="page-item">2</li>

            <li class="page-item">3</li>

            <li class="page-item">4</li>

            <li class="page-item">5</li>

            <li class="page-item ms-2">

              <span class="next-btn cursor-pointer">〉</span>

            </li>

          </ul>

        </nav>

      </main>

    </div>

  </div>

</template>



<style scoped>
/* 圖片縮放效果 */
.img-wrapper {
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover .img-wrapper {
  transform: translateY(-5px); /* 輕微上浮感 */
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* 移除 router-link 預設底線 */
.text-decoration-none {
  text-decoration: none;
}

.product-img {

  width: 100%;

  height: 100%;

  object-fit: cover; /* 關鍵：這會讓圖片填滿容器且不變形 */

  display: block;

}



.img-wrapper {

  aspect-ratio: 1 / 1;

  overflow: hidden; /* 確保超出容器的圖片被裁切 */

  background-color: #f5f5f5;

}

/* 搜尋框樣式 (維持原樣) */

.search-box { border-bottom: 1px solid #ccc; }

.pure-input { border: none; outline: none; font-size: 0.9rem; width: 150px; padding: 2px 0; background: transparent; }



/* 下拉選單 (維持原樣) */

.dropdown-wrapper { position: relative; user-select: none; }

.custom-dropdown { position: absolute; top: 130%; right: 0; background: white; min-width: 160px; z-index: 1000; list-style: none; padding: 5px 0; }

.custom-dropdown li { padding: 8px 15px; cursor: pointer; }

.custom-dropdown li:hover { color: #fe4c50; background: #f8f9fa; }



/* 側邊欄指標 (維持原樣) */

.v-icon { width: 7px; height: 7px; border-right: 1px solid #888; border-bottom: 1px solid #888; transform: rotate(45deg); transition: 0.3s; margin-right: 5px; }

.v-icon.rotated { transform: rotate(-135deg); border-color: #fe4c50; }



.hover-red:hover { color: #fe4c50 !important; }

.cursor-pointer { cursor: pointer; }



/* 商品名稱限制兩行 */

.product-name {

  display: -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  height: 2.4rem;

}



.x-small { font-size: 0.75rem; }



/* 分頁按鈕樣式 */

.pagination-list { color: #333; font-size: 0.9rem; }

.page-item { cursor: pointer; padding: 2px 5px; transition: color 0.2s; }

.page-item:hover { color: #fe4c50; }

.page-item.active { color: #fe4c50; font-weight: bold; border-bottom: 1px solid #fe4c50; }

.next-btn { font-size: 0.8rem; color: #888; }



/* 其他動畫 */

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }

.fade-enter-from, .fade-leave-to { opacity: 0; }

.img-wrapper { aspect-ratio: 1/1; cursor: pointer; }

.img-wrapper:hover { opacity: 0.85; }

</style>