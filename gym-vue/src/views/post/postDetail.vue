<template>
  <div class="post-detail-wrapper bg-light min-vh-100 pb-5">
    <div class="reading-progress-bar" :style="{ width: scrollPercent + '%' }"></div>

    <div class="scroll-to-top" :class="{ 'show': scrollY > 300 }" @click="scrollToTop">
      <svg class="progress-ring" width="50" height="50">
        <circle class="progress-ring__circle" stroke="#f3722c" stroke-width="3" fill="transparent" r="20" cx="25"
          cy="25" :style="{ strokeDasharray: '125.6', strokeDashoffset: 125.6 - (125.6 * scrollPercent / 100) }" />
      </svg>
      <i class="bi bi-arrow-up-short"></i>
    </div>

    <div class="container py-4">
      <nav aria-label="breadcrumb" class="custom-breadcrumb-wrapper mb-4 d-inline-block">
        <ol class="breadcrumb mb-0 p-2 px-4 bg-white rounded-pill shadow-sm border border-white">
          <li class="breadcrumb-item">
            <router-link to="/" class="breadcrumb-link text-decoration-none">首頁</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/post/card" class="breadcrumb-link text-decoration-none">資訊公告</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <span class="text-orange fw-bold">文章內容</span>
          </li>
        </ol>
      </nav>

      <div class="row g-4">
        <div class="col-lg-9">
          <div v-if="loading" class="main-content-card bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div class="skeleton-line title mb-4 mx-auto w-50"></div>
            <div class="skeleton-detail-img rounded-4 mb-5"></div>
            <div class="skeleton-line content mb-3"></div>
            <div class="skeleton-line content mb-3 w-75"></div>
          </div>

          <div v-else class="main-content-card bg-white rounded-4 shadow-sm p-4 p-md-5 animate-up">
            <div class="mb-4 text-center">
              <span class="badge bg-orange-light text-orange mb-3 px-3 py-2 rounded-pill fw-bold">
                # {{ post.CategoryName || '未分類' }}
              </span>
              <h1 class="fw-bold text-dark display-6 mb-4">{{ post.Title }}</h1>

              <div
                class="d-inline-flex justify-content-center align-items-center bg-light px-4 py-2 rounded-pill text-muted small gap-3 flex-wrap border border-white shadow-sm">
                <span><i class="bi bi-calendar3 text-orange me-1"></i>{{ formatDate(post.CreatedAt) }}</span>
                <span class="vr d-none d-md-block opacity-25" style="height: 15px;"></span>
                <span v-if="post.CoachName"><i class="bi bi-person-badge text-orange me-1"></i>發文者：{{ post.CoachName
                  }}</span>
                <span class="vr d-none d-md-block opacity-25" style="height: 15px;"></span>
                <span><i class="bi bi-eye text-orange me-1"></i>{{ post.ViewCount ?? 0 }} 次瀏覽</span>
              </div>
            </div>

            <div
              class="detail-image-box rounded-4 bg-light mb-5 d-flex align-items-center justify-content-center overflow-hidden shadow-sm">
              <img v-if="post.ImageUrls && post.ImageUrls.length > 0" :src="post.ImageUrls[0]"
                class="img-fluid w-100 h-100 object-fit-cover" :alt="post.Title" />
              <div v-else class="placeholder-gradient w-100 h-100 d-flex align-items-center justify-content-center">
                <span class="text-white opacity-25 fw-bold display-4">FitnessBar</span>
              </div>
            </div>

            <div class="article-body mb-5">
              <div class="detail-text fs-5" style="white-space: pre-line;">{{ post.Detail }}</div>
            </div>

            <div class="d-flex flex-column align-items-center gap-4 border-top pt-5 mt-5">
              <button v-if="post.PostCategoryId === 6" @click="goToJoinForm(post.Id)"
                class="btn btn-orange text-white rounded-pill px-5 py-3 fw-bold shadow-orange-hover btn-pulse transition-scale">
                立即報名活動
              </button>

              <button @click="isLiked = !isLiked" class="btn rounded-pill px-4 btn-sm fw-bold transition-all"
                :class="isLiked ? 'btn-orange text-white' : 'btn-outline-orange'">
                <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i> {{ isLiked ? '已收藏' : '按愛心' }}
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <div class="sticky-sidebar">
            <h5 class="fw-bold text-dark mb-3 ps-2 border-start border-orange border-4">其他貼文</h5>
            <div class="row g-3">
              <div v-for="related in relatedPosts" :key="related.Id" class="col-12">
                <div @click="goToOtherDetail(related.Id)"
                  class="related-card bg-white rounded-4 shadow-sm overflow-hidden p-2 transition hover-up pointer">
                  <div class="related-img-sm rounded-3 mb-2 overflow-hidden">
                    <img v-if="related.ImageUrls && related.ImageUrls.length > 0" :src="related.ImageUrls[0]"
                      class="w-100 h-100 object-fit-cover" :alt="related.Title" />
                    <div v-else
                      class="placeholder-gradient w-100 h-100 d-flex align-items-center justify-content-center">
                      <i class="bi bi-image text-white opacity-25"></i>
                    </div>
                  </div>
                  <div class="px-2 pb-2">
                    <div class="text-orange x-small fw-bold mb-1">
                      # {{ related.TagName || '精選內容' }}
                    </div>
                    <h6 class="fw-bold text-dark mb-1 text-truncate-2 small">{{ related.Title }}</h6>
                    <div class="text-muted x-small">{{ formatDate(related.CreatedAt) }}</div>
                  </div>
                </div>
              </div>
              <div v-if="relatedPosts.length === 0 && !loading" class="text-center text-muted py-4">
                暫無相關推薦
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// API 基礎網址
const apiBaseUrl = 'https://localhost:7218';

// 資料狀態
const post = ref({});
const allNews = ref([]);
const loading = ref(true);
const isLiked = ref(false);
const scrollY = ref(0);
const scrollPercent = ref(0);

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 處理圖片路徑的輔助函式
const processImageUrls = (data) => {
  if (Array.isArray(data)) {
    // 處理陣列 (allNews)
    return data.map(item => ({
      ...item,
      ImageUrls: (item.ImageUrls || []).map(url => url.startsWith('/') ? `${apiBaseUrl}${url}` : url)
    }));
  } else {
    // 處理單一物件 (post detail)
    return {
      ...data,
      ImageUrls: (data.ImageUrls || []).map(url => url.startsWith('/') ? `${apiBaseUrl}${url}` : url)
    };
  }
};

// 抓取單篇文章詳情
const fetchPostDetail = async (id) => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiBaseUrl}/api/YPosts/${id}`);
    // 處理圖片路徑
    post.value = processImageUrls(response.data);
    scrollToTop();
  } catch (error) {
    console.error('抓取詳情失敗:', error);
    router.push('/post/card');
  } finally {
    setTimeout(() => { loading.value = false; }, 400);
  }
};

// 抓取所有文章列表（用於側邊欄推薦）
const fetchAllPosts = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/YPosts`);
    // 處理圖片路徑
    allNews.value = processImageUrls(response.data || []);
  } catch (error) {
    console.error('抓取列表失敗:', error);
  }
};

// 相關貼文邏輯
const relatedPosts = computed(() => {
  if (!allNews.value.length) return [];
  const currentId = Number(route.params.id);
  return allNews.value
    .filter(item => Number(item.Id) !== currentId)
    .slice(0, 4);
});

// 跳轉與滾動
const goToOtherDetail = (id) => router.push(`/post/postDetail/${id}`);
const goToJoinForm = (id) => router.push(`/post/join/${id}`);
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// 監聽路由 ID 變化
watch(() => route.params.id, (newId) => {
  if (newId) fetchPostDetail(newId);
}, { immediate: true });

// 滾動監聽
const handleScroll = () => {
  scrollY.value = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollPercent.value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
};

onMounted(() => {
  fetchAllPosts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 樣式保持不變，已優化圖片顯示容器 */
.reading-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(to right, #f3722c, #f9c74f);
  z-index: 2000;
  transition: width 0.1s ease;
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
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 1000;
}

.scroll-to-top.show {
  opacity: 1;
  visibility: visible;
}

.scroll-to-top i {
  font-size: 2rem;
  color: #f3722c;
  position: absolute;
}

@media (min-width: 992px) {
  .sticky-sidebar {
    position: sticky;
    top: 20px;
    height: fit-content;
  }
}

.article-body {
  border-left: 3px solid rgba(243, 114, 44, 0.1);
  padding-left: 1.5rem;
}

.detail-text {
  color: #333;
  line-height: 1.8;
  letter-spacing: 0.05rem;
}

.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
  color: white;
}

.btn-outline-orange {
  color: #f3722c;
  border-color: #f3722c;
}

.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.1);
}

.detail-image-box,
.related-img-sm {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.placeholder-gradient {
  background: linear-gradient(135deg, #f3722c 0%, #f9c74f 100%);
}

.hover-up {
  transition: 0.3s;
}

.hover-up:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pointer {
  cursor: pointer;
}

.x-small {
  font-size: 0.75rem;
}

/* 骨架屏動畫 */
.skeleton-line {
  background: #eee;
  border-radius: 8px;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-line.title {
  height: 40px;
}

.skeleton-line.content {
  height: 20px;
}

.skeleton-detail-img {
  height: 350px;
  background: #eee;
}

@keyframes shimmer {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}

.animate-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>