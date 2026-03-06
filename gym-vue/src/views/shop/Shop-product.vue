<script setup>

import { ref , onMounted, computed} from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Banner from '@/components/banner.vue'

const products = ref([]);
const categories = ref([]);
const router = useRouter();

const API_URL=import.meta.env.VITE_API_URL

function getProducts() {
  axios
    .get(API_URL + 'SProducts')
    .then(resp => {
      products.value = resp.data;
    })
    .catch(error => {
      console.error('發生錯誤', error);
    });
}


const activeCategory = ref('全部商品'); 

const searchQuery = ref('');

const showSort = ref(false);

const showLimit = ref(false);

const currentLimit = ref(24);

const sortOptions = [ '價格: 由高至低', '價格: 由低至高'];

const currentSort = ref('上架時間: 由新到舊');

const selectSort = (option) => {
  currentSort.value = option; 
  showSort.value = false;     
};


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



const getCategories = () => {
  axios
    .get(API_URL + 'SCategories')
    .then(resp => {
      categories.value = resp.data.map(cat => ({
        name: cat.Name,           
        subCategories: cat.SubCategories, 
        isOpen: false             
      }));
      console.log('類別與商品名稱載入成功！');
    })
    .catch(error => {
      console.error('類別選單載入失敗:', error);
    });
};

const selectedSubCategory = ref('');

const filteredProducts = computed(() => {
  if (!products.value || products.value.length === 0) return [];
  
  let result = products.value;

  if (selectedSubCategory.value) {
    result = result.filter(p => {
      const nameToCheck = p.pName || p.PName || '';
      return nameToCheck.includes(selectedSubCategory.value);
    });
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => {
      const fullName = (p.fullName || p.FullName || '').toLowerCase();
      return fullName.includes(query);
    });
  }

  if (currentSort.value === '價格: 由低至高') {
    result.sort((a, b) => (a.price || a.Price) - (b.price || b.Price));
  } 
  else if (currentSort.value === '價格: 由高至低') {
    result.sort((a, b) => (b.price || b.Price) - (a.price || a.Price));
  }

  return result;
});

const updateFilteredCategory = (name) => {
  selectedSubCategory.value = name;
  
  activeCategory.value = name; 
};

const handleCategoryClick = (cat) => {
  cat.isOpen = !cat.isOpen;
  activeCategory.value = cat.name;
  selectedSubCategory.value = ''; 
};


const updateTitle = (name) => { 
  activeCategory.value = name; 
  if (name === '全部商品') {
    selectedSubCategory.value = ''; // 清空子類別過濾條件
    searchQuery.value = '';        // (選做) 是否連搜尋文字也清空
  }
};

// const goToDetail = (id) => {
//   router.push({ name: 'ProductDetail', params: { id: id } });
// };

onMounted(() => {
  getProducts();
  getCategories();
});

const goToDetail = (id) => {
  if (!id) {
    console.warn("產品 ID 不存在，無法跳轉");
    return;
  }
  router.push({ name: 'ProductDetail', params: { id: id } });
};
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
   :class="activeCategory === '全部商品' ? 'active-orange' : 'text-dark'"
   @click="updateTitle('全部商品')">全部商品</a>

            </li>

            <li v-for="(cat, index) in categories" :key="index" class="menu-item mb-3">

              <div class="category-header d-flex justify-content-between align-items-center cursor-pointer py-1" @click="handleCategoryClick(cat)">

                <span class="fw-bold transition-color" 
      :class="{ 'active-orange': activeCategory === cat.name || cat.isOpen }">
      {{ cat.name }}
</span>

                <span class="v-icon" :class="{ 'rotated': cat.isOpen }"></span>

              </div>

              <transition name="expand">

                <ul v-show="cat.isOpen" class="list-unstyled ms-3 mt-1">

                  <li v-for="sub in cat.subCategories" :key="sub" class="py-1">

                    <a href="javascript:void(0)" @click="updateFilteredCategory(sub)" class="small text-decoration-none d-block transition-color hover-orange"
   :class="activeCategory === sub ? 'active-orange fw-bold' : 'text-muted'" 
   @click.stop="updateTitle(sub)">
   {{ sub }}
</a>

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
  <div v-for="product in filteredProducts" :key="product.PId" class="col-md-4 col-sm-6 text-start" @click="goToDetail(product.PId)">
  <div class="product-card">
    <router-link :to="`/shop/products/${product.PId}`" class="text-decoration-none">
      <div class="img-wrapper mb-3 rounded bg-light shadow-sm d-flex align-items-center justify-content-center">
        <img
          v-if="product.ImagePath"
          :src="`https://localhost:7218${product.ImagePath.startsWith('/') ? '' : '/'}${product.ImagePath}`"
          :alt="product.FullName"
          class="product-img"
        >
        <span v-else class="text-muted small">無圖片</span>
      </div>
    </router-link>

    <router-link :to="`/shop/products/${product.PId}`" class="text-decoration-none">
      <p class="mb-1 small text-dark product-name hover-red-text">{{ product.FullName }}</p>
    </router-link>

    <div class="price-info">
      <span class="active-orange fw-bold me-2">
    NT${{ (product.DiscountPrice && product.DiscountPrice > 0) ? product.DiscountPrice : product.Price }}
  </span>

  <span v-if="product.DiscountPrice && product.DiscountPrice > 0" class="text-muted text-decoration-line-through x-small">
    NT${{ product.Price }}
  </span>
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
.active-orange {
  color: #f3722c !important;
}

/* 側邊欄與連結 Hover 效果 */
.hover-orange:hover {
  color: #f3722c !important;
}

/* 商品名稱 Hover 效果 */
.hover-red-text:hover {
  color: #f3722c !important;
}

/* 下拉選單滑入顏色 */
.custom-dropdown li:hover {
  color: #f3722c;
  background: #f8f9fa;
}

/* 側邊欄箭頭旋轉時的顏色 */
.v-icon.rotated {
  transform: rotate(-135deg);
  border-color: #f3722c; /* 這裡原本就是 #f3722c */
}

/* 分頁 active 顏色 */
.page-item.active {
  color: #f3722c;
  font-weight: bold;
  border-bottom: 1px solid #f3722c;
}

.page-item:hover {
  color: #f3722c;
}

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

.custom-dropdown li:hover { color: #f3722c; background: #f8f9fa; }



/* 側邊欄指標 (維持原樣) */

.v-icon { width: 7px; height: 7px; border-right: 1px solid #888; border-bottom: 1px solid #888; transform: rotate(45deg); transition: 0.3s; margin-right: 5px; }

.v-icon.rotated { transform: rotate(-135deg); border-color: #f3722c; }



.hover-red:hover { color: #f3722c !important; }

.cursor-pointer { cursor: pointer; }



/* 商品名稱限制兩行 */

.product-name {

  display: -webkit-box;

  line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

  height: 2.4rem;

}



.x-small { font-size: 0.75rem; }



/* 分頁按鈕樣式 */

.pagination-list { color: #333; font-size: 0.9rem; }

.page-item { cursor: pointer; padding: 2px 5px; transition: color 0.2s; }

.page-item:hover { color: #f3722c; }

.page-item.active { color: #f3722c; font-weight: bold; border-bottom: 1px solid #f3722c; }

.next-btn { font-size: 0.8rem; color: #888; }



/* 其他動畫 */

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }

.fade-enter-from, .fade-leave-to { opacity: 0; }

.img-wrapper { aspect-ratio: 1/1; cursor: pointer; }

.img-wrapper:hover { opacity: 0.85; }

</style>