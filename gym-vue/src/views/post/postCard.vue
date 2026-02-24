<template>
  <div class="news-wrapper bg-light min-vh-100 pb-5">
    <div class="scroll-to-top" :class="{ 'show': scrollY > 300 }" @click="scrollToTop">
      <svg class="progress-ring" width="50" height="50">
        <circle class="progress-ring__circle" stroke="#f3722c" stroke-width="3" fill="transparent" r="20" cx="25"
          cy="25" :style="{ strokeDasharray: '125.6', strokeDashoffset: 125.6 - (125.6 * scrollPercent / 100) }" />
      </svg>
      <i class="bi bi-arrow-up-short"></i>
    </div>

    <div class="container py-4">
      <Banner title="資訊公告" subtitle="立即取得我們的最新資訊活動" />

      <nav aria-label="breadcrumb" class="custom-breadcrumb-wrapper mb-4">
        <ol class="breadcrumb mb-0 p-2 px-3 bg-white rounded-pill shadow-sm border border-white">
          <li class="breadcrumb-item">
            <router-link to="/" class="breadcrumb-link">
              <i class="bi bi-house-door-fill me-1"></i>首頁
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <span class="text-orange fw-bold">資訊公告</span>
          </li>
          <li v-if="currentCategory !== 'ALL'" class="breadcrumb-item active" aria-current="page">
            <span class="text-muted">{{ currentCategory }}</span>
          </li>
        </ol>
      </nav>

      <div class="row g-4 mb-5">
        <div class="col-md-6" v-for="(p, index) in pinnedPosts.slice(0, 2)" :key="'pinned-' + p.Id">
          <div
            :class="['banner-box d-flex rounded-4 bg-white shadow-sm border-top border-4 overflow-hidden h-100', index === 0 ? 'border-orange' : 'border-warning']">
            <div class="pinned-img-side flex-shrink-0 d-none d-sm-block">
              <img v-if="p.ImageUrl" :src="p.ImageUrl" class="side-img" />
              <div v-else :class="['side-img-placeholder', index === 0 ? 'bg-orange-grad' : 'bg-warning-grad']"></div>
            </div>
            <div class="p-4 flex-grow-1 d-flex flex-column justify-content-center">
              <div :class="['fw-bold mb-2', index === 0 ? 'text-orange' : 'text-warning']">
                {{ index === 0 ? '📌 置頂公告' : '⭐ 精選活動' }}
              </div>
              <div @click="goToDetail(p.Id)" class="cursor-pointer">
                <h5 class="text-dark fw-bold mb-2">{{ p.Title }}</h5>
                <span class="small text-muted"><i class="bi bi-calendar3 me-1"></i>{{ p.Date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <transition name="slide-down">
        <div v-if="showGuideBanner"
          class="alert-guide shadow-sm border-0 rounded-pill px-4 py-2 d-flex align-items-center justify-content-between mb-4">
          <span><i class="bi bi-info-circle-fill text-warning me-2"></i>💡 <b>提示：</b>點擊右側按鈕可切換「卡片」或「列表」！</span>
          <button @click="showGuideBanner = false" class="btn-close btn-close-white ms-3"
            style="font-size: 0.6rem;"></button>
        </div>
      </transition>

      <div class="sticky-top filter-toolbar mb-4 bg-white-90 p-3 rounded-4 shadow-sm border border-white">
        <div class="d-flex flex-column gap-3">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="d-flex gap-2 flex-wrap">
              <button v-for="cat in categories" :key="cat" @click="changeCategory(cat)"
                class="btn rounded-pill px-3 btn-sm fw-bold transition-all tag-chip"
                :class="currentCategory === cat ? 'btn-orange shadow-orange' : 'btn-light text-muted border-0'">
                {{ cat }}
                <span class="ms-1 opacity-50 small" v-if="catCount[cat] > 0">({{ catCount[cat] }})</span>
              </button>
            </div>
            <div class="btn-group rounded-3 overflow-hidden border shadow-sm bg-white">
              <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'btn-orange text-white' : 'btn-white'"
                class="btn btn-sm px-3">列表</button>
              <button @click="viewMode = 'card'" :class="viewMode === 'card' ? 'btn-orange text-white' : 'btn-white'"
                class="btn btn-sm px-3">卡片</button>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2 border-top pt-3">
            <span class="small text-muted fw-bold text-nowrap me-2"><i class="bi bi-search me-1"></i>日期搜尋：</span>
            <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 420px;">
              <div class="date-input-container flex-grow-1">
                <input type="date" v-model="startDate" class="custom-date-input">
              </div>
              <span class="text-muted small">~</span>
              <div class="date-input-container flex-grow-1">
                <input type="date" v-model="endDate" class="custom-date-input">
              </div>
              <button v-if="startDate || endDate" @click="clearDateFilter"
                class="btn btn-sm btn-link text-orange p-0 ms-1"><i class="bi bi-x-circle-fill"></i></button>
            </div>
          </div>
        </div>
      </div>

      <div class="post-display-area">
        <transition name="view-fade" mode="out-in">
          <div v-if="loading" key="loading" :class="viewMode === 'card' ? 'row g-4' : 'list-layout'">
            <div v-for="i in 6" :key="i" :class="viewMode === 'card' ? 'col-12 col-md-6 col-lg-4' : 'mb-3'">
              <div class="skeleton-card rounded-4 bg-white shadow-sm overflow-hidden"
                :class="viewMode === 'list' ? 'd-flex' : ''">
                <div class="skeleton-img" :class="viewMode === 'list' ? 'skeleton-list-img' : ''"></div>
                <div class="p-4 flex-grow-1">
                  <div class="skeleton-line title mb-3"></div>
                  <div class="skeleton-line content mb-2"></div>
                  <div class="skeleton-line content w-75"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else :key="viewMode" class="position-relative">
            <transition-group name="list-stagger" tag="div" :class="viewMode === 'card' ? 'row g-4' : 'list-layout'">
              <div v-for="(news, index) in paginatedNews" :key="news.Id" :style="{ transitionDelay: `${index * 30}ms` }"
                :class="viewMode === 'card' ? 'col-12 col-md-6 col-lg-4' : ''">

                <div v-if="viewMode === 'card'" @click="goToDetail(news.Id)"
                  class="card h-100 border-0 shadow-sm rounded-4 news-card bg-white overflow-hidden cursor-pointer">
                  <div class="card-img-wrapper">
                    <img v-if="news.ImageUrl" :src="news.ImageUrl" class="post-img w-100 h-100 object-fit-cover" />
                    <div v-else class="post-img-placeholder d-flex align-items-center justify-content-center">
                      <span class="text-white opacity-50 fw-bold">FitnessBar News</span>
                    </div>
                  </div>
                  <div class="px-3 py-2 small d-flex justify-content-between border-bottom">
                    <span class="text-orange fw-bold"># {{ news.TagName }}</span>
                    <span class="text-muted">{{ news.Date }}</span>
                  </div>
                  <div class="p-4">
                    <h5 class="fw-bold text-dark mb-2 text-truncate">{{ news.Title }}</h5>
                    <p class="text-muted small line-clamp-2">{{ news.Detail }}</p>
                  </div>
                </div>

                <div v-else @click="goToDetail(news.Id)"
                  class="list-item d-flex mb-3 shadow-sm rounded-4 bg-white border-start border-orange border-4 overflow-hidden cursor-pointer">
                  <div class="list-img-side flex-shrink-0">
                    <img v-if="news.ImageUrl" :src="news.ImageUrl" class="side-img w-100 h-100 object-fit-cover" />
                    <div v-else class="list-img-placeholder d-flex align-items-center justify-content-center">
                      <i class="bi bi-image text-white opacity-25"></i>
                    </div>
                  </div>
                  <div class="p-3 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <span class="badge bg-orange-light text-orange mb-2">#{{ news.TagName }}</span>
                        <h5 class="fw-bold text-dark mb-1">{{ news.Title }}</h5>
                        <p class="text-muted small mb-0 d-none d-md-block">{{ news.Detail }}</p>
                      </div>
                      <div class="text-end ms-3"><span class="small text-muted">{{ news.Date }}</span></div>
                    </div>
                  </div>
                </div>

              </div>
            </transition-group>
          </div>
        </transition>
      </div>

      <nav v-if="totalPages > 1 && !loading" class="mt-5 d-flex justify-content-center">
        <ul class="pagination pagination-sm gap-2">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link rounded-pill border-orange-subtle px-3 shadow-none"
              @click="handlePageChange(currentPage - 1)">
              <i class="bi bi-chevron-left small me-1"></i>上一頁
            </button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item">
            <button class="page-link rounded-pill shadow-none"
              :class="currentPage === page ? 'btn-orange text-white active-page' : 'text-orange-link'"
              @click="handlePageChange(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link rounded-pill border-orange-subtle px-3 shadow-none"
              @click="handlePageChange(currentPage + 1)">
              下一頁<i class="bi bi-chevron-right small ms-1"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Banner from '@/components/banner.vue';

const router = useRouter();
const newsList = ref([]);
const loading = ref(true);
const viewMode = ref('card');
const currentCategory = ref('ALL');
const startDate = ref('');
const endDate = ref('');
const currentPage = ref(1);
const pageSize = 9;
const showGuideBanner = ref(false);
const scrollY = ref(0);
const scrollPercent = ref(0);

const categories = ['ALL', '公告', '促銷活動', '教練/團隊動態', '課表更新', '健康知識', '場館活動', '其他'];

const catCount = computed(() => {
  const counts = { 'ALL': newsList.value.length };
  newsList.value.forEach(item => { counts[item.TagName] = (counts[item.TagName] || 0) + 1; });
  return counts;
});

const fetchPosts = async () => {
  loading.value = true;
  try {
    const response = await axios.get('https://localhost:7218/api/YPosts');
    newsList.value = response.data;
    setTimeout(() => { loading.value = false; }, 800);
    triggerGuide();
  } catch (error) {
    console.error('抓取失敗:', error);
    loading.value = false;
  }
};

const triggerGuide = () => {
  setTimeout(() => {
    showGuideBanner.value = true;
    setTimeout(() => { showGuideBanner.value = false; }, 10000);
  }, 1000);
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollPercent.value = (window.scrollY / docHeight) * 100;
};

const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 400, behavior: 'smooth' });
};

const pinnedPosts = computed(() => newsList.value.filter(item => item.IsPinned));

const filteredNews = computed(() => {
  let result = newsList.value;
  if (currentCategory.value !== 'ALL') { result = result.filter(item => item.TagName === currentCategory.value); }
  if (startDate.value) { result = result.filter(item => new Date(item.Date) >= new Date(startDate.value)); }
  if (endDate.value) { result = result.filter(item => new Date(item.Date) <= new Date(endDate.value)); }
  return result;
});

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredNews.value.slice(start, start + pageSize);
});

const totalPages = computed(() => Math.ceil(filteredNews.value.length / pageSize));

const changeCategory = (cat) => {
  currentCategory.value = cat;
  currentPage.value = 1;
};

const clearDateFilter = () => { startDate.value = ''; endDate.value = ''; };
const goToDetail = (id) => router.push(`/post/postDetail/${id}`);

onMounted(() => {
  fetchPosts();
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* --- 麵包屑樣式 --- */
.custom-breadcrumb-wrapper .breadcrumb {
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  margin-top: 15px;
}

.breadcrumb-item+.breadcrumb-item::before {
  content: "›";
  /* 使用更高級的間隔符號 */
  font-size: 1.2rem;
  line-height: 1;
  vertical-align: sub;
  color: #ddd;
}

.breadcrumb-link {
  color: #888;
  text-decoration: none;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  color: #f3722c;
  transform: translateX(2px);
  display: inline-block;
}

/* --- 分頁按鈕樣式 --- */
.pagination .page-link {
  background-color: #fff;
  border: 1px solid #ffdecb !important;
  color: #f3722c;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination .page-link:hover:not(.disabled) {
  background-color: rgba(243, 114, 44, 0.08);
  border-color: #f3722c !important;
  color: #d15a1a;
}

.active-page {
  background-color: #f3722c !important;
  border-color: #f3722c !important;
  color: white !important;
  box-shadow: 0 3px 8px rgba(243, 114, 44, 0.3);
}

.page-item.disabled .page-link {
  background-color: #f8f9fa;
  border-color: #eee !important;
  color: #ccc !important;
  cursor: not-allowed;
}

/* --- 動畫樣式 --- */
.list-stagger-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.list-stagger-leave-active {
  transition: opacity 0.2s ease-in;
  position: absolute;
  width: 100%;
  z-index: 0;
}

.list-stagger-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.list-stagger-leave-to {
  opacity: 0;
}

.list-stagger-move {
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.3s ease;
}

.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* --- 基礎結構 --- */
.cursor-pointer {
  cursor: pointer;
}

.pinned-img-side {
  width: 240px;
  min-height: 160px;
}

.card-img-wrapper {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  overflow: hidden;
}

.list-img-side {
  width: 150px;
  height: 120px;
  background-color: #f0f0f0;
}

.post-img-placeholder,
.list-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f3722c 0%, #f9c74f 100%);
}

.side-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.skeleton-img {
  height: 200px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite linear;
}

.skeleton-list-img {
  width: 150px;
  height: 120px;
}

.skeleton-line {
  height: 12px;
  background: #f2f2f2;
  border-radius: 6px;
  animation: skeleton-shimmer 1.5s infinite linear;
}

.skeleton-line.title {
  height: 20px;
  width: 60%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.bg-white-90 {
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
}

.filter-toolbar.sticky-top {
  top: 190px;
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}

.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1100;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
}

.scroll-to-top.show {
  opacity: 1;
  transform: translateY(0);
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring__circle {
  transition: stroke-dashoffset 0.1s;
}

.custom-date-input {
  width: 100%;
  padding: 6px 15px;
  font-size: 0.85rem;
  border: 1px solid #eee;
  background-color: #f8f9fa;
  border-radius: 50px;
  color: #666;
  cursor: pointer;
}

.alert-guide {
  background-color: #2b2b2b;
  color: white;
  font-size: 0.85rem;
}

.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  color: white;
  border: none;
}

.shadow-orange {
  box-shadow: 0 4px 12px rgba(243, 114, 44, 0.2);
}

.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.1);
}

.bg-orange-grad {
  background: linear-gradient(135deg, #f3722c 0%, #ff9a7b 100%);
}

.bg-warning-grad {
  background: linear-gradient(135deg, #ffc107 0%, #ffe082 100%);
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  transition: 0.3s;
}

.list-item:hover {
  transform: translateX(5px);
  background-color: #fffcfb;
  transition: 0.3s;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>