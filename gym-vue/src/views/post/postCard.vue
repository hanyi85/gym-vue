<template>
  <div class="news-wrapper bg-light min-vh-100 pb-5">
    <div class="container py-4">
      
      <div class="row g-3 mb-5">
        <div class="col-md-6">
          <div class="banner-box d-flex align-items-center justify-content-center rounded-4 bg-white shadow-sm text-secondary fw-bold border-top border-orange border-4">
            置頂公告
          </div>
        </div>
        <div class="col-md-6">
          <div class="banner-box d-flex align-items-center justify-content-center rounded-4 bg-white shadow-sm text-secondary fw-bold border-top border-warning border-4">
            精選活動
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link> 
          <span class="mx-2">/</span>
          <span class="text-orange">最新消息</span>
        </p>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex gap-2 flex-wrap">
            <button 
              v-for="cat in categories" :key="cat"
              @click="currentCategory = cat"
              class="btn rounded-pill px-4 btn-sm fw-bold transition"
              :class="currentCategory === cat ? 'btn-orange text-white' : 'btn-outline-orange'"
            >
              {{ cat }}
            </button>
          </div>
          
          <div class="btn-group rounded-3 overflow-hidden shadow-sm" role="group">
            <button 
              type="button" 
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'btn-orange text-white' : 'btn-white text-muted'"
              class="btn btn-sm px-3 border-end"
            >
              列表
            </button>
            <button 
              type="button" 
              @click="viewMode = 'card'"
              :class="viewMode === 'card' ? 'btn-orange text-white' : 'btn-white text-muted'"
              class="btn btn-sm px-3"
            >
              卡片
            </button>
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        
        <div v-if="viewMode === 'card'" key="card-view" class="row g-4">
          <div v-for="news in filteredNews" :key="news.id" class="col-12 col-md-6 col-lg-4">
            <div 
              @click="goToDetail(news.id)" 
              class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden news-card bg-white"
            >
              <div class="px-3 py-2 small d-flex justify-content-between border-bottom bg-light bg-opacity-50">
                <span class="text-orange fw-bold"># {{ news.tag }}</span>
                <span class="text-muted">{{ news.date }}</span>
              </div>
              <div class="p-4">
                <div class="image-placeholder d-flex align-items-center justify-content-center rounded-4 bg-light mb-3">
                  <span class="text-secondary opacity-25 fw-bold">FitnessBar NEWS</span>
                </div>
                <div class="text-center">
                  <h5 class="card-title fw-bold text-dark mb-0">{{ news.title }}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else key="list-view" class="list-layout">
          <div 
            v-for="news in filteredNews" 
            :key="news.id" 
            @click="goToDetail(news.id)" 
            class="list-item d-flex align-items-stretch mb-3 shadow-sm rounded-4 bg-white overflow-hidden border-start border-orange border-4"
          >
            <div class="list-image-wrapper flex-shrink-0 d-flex align-items-center justify-content-center bg-light">
              <span class="text-muted opacity-50 small">NEWS</span>
            </div>
            <div class="list-content flex-grow-1 p-3 d-flex flex-column justify-content-center">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <span class="badge bg-orange-light text-orange mb-2">#{{ news.tag }}</span>
                  <h5 class="fw-bold text-dark mb-1">{{ news.title }}</h5>
                  <p class="text-muted small mb-0 d-none d-md-block line-height-base">
                    {{ news.title }} --點擊查看--
                  </p>
                </div>
                <div class="text-end ms-3">
                  <span class="small text-muted">{{ news.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <nav class="mt-5 d-flex justify-content-center">
        <ul class="pagination pagination-sm gap-2 border-0">
          <li class="page-item active">
            <a class="page-link border-0 text-orange bg-transparent fw-bold border-bottom border-orange border-2 rounded-0" href="#">1</a>
          </li>
          <li v-for="p in [2,3,4]" :key="p" class="page-item">
            <a class="page-link border-0 text-muted bg-transparent" href="#">{{ p }}</a>
          </li>
          <li class="page-item"><a class="page-link border-0 text-orange bg-transparent" href="#">&gt;&gt;</a></li>
        </ul>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 模式與篩選狀態
const viewMode = ref('card'); // 初始設定為卡片模式
const currentCategory = ref('ALL');
const categories = ['ALL', '最新消息', '公告', '活動', '其他'];

// 公告資料清單
const newsList = ref([
  { id: 1, tag: '課程', date: '2026/02/06', title: '夏季增肌特訓班報名開始' },
  { id: 2, tag: '活動', date: '2026/02/01', title: '會員週年慶：入會費 0 元' },
  { id: 3, tag: '公告', date: '2026/01/25', title: '春節期間營業時間調整' },
  { id: 4, tag: '課程', date: '2026/01/20', title: '新進教練：專業舉重教練凱文' },
  { id: 5, tag: '其他', date: '2026/01/15', title: '飲水機維護公告' },
]);

// 根據分類篩選資料
const filteredNews = computed(() => {
  if (currentCategory.value === 'ALL') return newsList.value;
  return newsList.value.filter(item => item.tag === currentCategory.value);
});

// 跳轉詳情頁函式
const goToDetail = (id) => {
  router.push(`/post/postDetail/${id}`);
};
</script>

<style scoped>
/* --- 品牌主題配色 --- */
.text-orange { color: #f3722c !important; }
.btn-orange { background-color: #f3722c; border-color: #f3722c; }
.btn-orange:hover { background-color: #d65a1a; }
.btn-outline-orange { color: #f3722c; border: 1px solid #f3722c; background: transparent; }
.btn-outline-orange:hover { background-color: #f3722c; color: white; }
.btn-white { background-color: #ffffff; border: 1px solid #dee2e6; }
.bg-orange-light { background-color: rgba(243, 114, 44, 0.1); }
.border-orange { border-color: #f3722c !important; }

/* --- 麵包屑連結 --- */
.breadcrumb-link { transition: color 0.2s; }
.breadcrumb-link:hover { color: #f3722c !important; text-decoration: underline !important; }

/* --- 通用元件樣式 --- */
.banner-box { height: 160px; font-size: 1.1rem; transition: all 0.3s; }
.banner-box:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important; }

/* --- 卡片樣式 --- */
.image-placeholder { aspect-ratio: 16/9; transition: background 0.3s; }
.news-card { transition: all 0.3s; cursor: pointer; border: 1px solid transparent !important; }
.news-card:hover { 
  transform: translateY(-8px); 
  box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important; 
  border-color: rgba(243, 114, 44, 0.2) !important; 
}

/* --- 列表樣式 --- */
.list-item { transition: all 0.3s; cursor: pointer; min-height: 120px; }
.list-item:hover { 
  transform: translateX(8px); 
  box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; 
  background-color: #fafafa;
}
.list-image-wrapper { width: 160px; border-right: 1px solid #eee; }
.line-height-base { line-height: 1.6; }

/* --- 動畫與分頁 --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.page-link { padding: 0.5rem; transition: all 0.2s; }
.page-link:hover { color: #f3722c !important; }
</style>