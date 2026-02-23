<template>
  <div class="post-detail-wrapper bg-light min-vh-100 pb-5">
    <div class="scroll-to-top" :class="{ 'show': scrollY > 300 }" @click="scrollToTop">
      <svg class="progress-ring" width="50" height="50">
        <circle class="progress-ring__circle" stroke="#f3722c" stroke-width="3" fill="transparent" r="20" cx="25"
          cy="25" :style="{ strokeDasharray: '125.6', strokeDashoffset: 125.6 - (125.6 * scrollPercent / 100) }" />
      </svg>
      <i class="bi bi-arrow-up-short"></i>
    </div>

    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <router-link to="/post/list" class="breadcrumb-link text-decoration-none text-muted">最新消息</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange fw-bold">文章內容</span>
        </p>
      </nav>

      <div class="row g-4">
        <div class="col-lg-9">
          <div v-if="loading" class="main-content-card bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div class="skeleton-line title mb-4 mx-auto w-50"></div>
            <div class="skeleton-detail-img rounded-4 mb-5"></div>
            <div class="skeleton-line content mb-3"></div>
          </div>

          <div v-else class="main-content-card bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div class="mb-4 text-center">
              <span class="badge bg-orange-light text-orange mb-3 px-3 py-2 rounded-pill fw-bold">
                # {{ post.CategoryName }}
              </span>
              <h1 class="fw-bold text-dark display-6 mb-3">{{ post.Title }}</h1>

              <div class="d-flex justify-content-center align-items-center text-muted small gap-4 flex-wrap">
                <span><i class="bi bi-calendar3 me-1"></i>發佈日期：{{ formatDate(post.CreatedAt) }}</span>
                <span v-if="post.CoachName"><i class="bi bi-person-badge me-1"></i>負責教練：{{ post.CoachName }}</span>
                <span><i class="bi bi-eye me-1"></i>瀏覽次數：{{ post.ViewCount ?? 0 }} 次</span>
              </div>
            </div>

            <div
              class="detail-image-box rounded-4 bg-light mb-5 d-flex align-items-center justify-content-center overflow-hidden shadow-inner">
              <img v-if="post.ImageUrl" :src="post.ImageUrl" class="img-fluid w-100 h-100 object-fit-cover" />
              <div v-else class="placeholder-gradient w-100 h-100 d-flex align-items-center justify-content-center">
                <span class="text-white opacity-25 fw-bold display-4">FitnessBar News</span>
              </div>
            </div>

            <div class="article-body text-secondary line-height-lg mb-5">
              <div v-text="post.Detail" class="detail-text fs-5"></div>
            </div>

            <div class="d-flex flex-column align-items-center gap-4 border-top pt-5">
              <button @click="goToJoinForm(post.Id)"
                class="btn btn-orange text-white rounded-pill px-5 py-3 fw-bold shadow-orange-hover transition-scale">
                立即報名活動
              </button>
              <div class="d-flex gap-3">
                <button @click="isLiked = !isLiked" class="btn rounded-pill px-4 btn-sm fw-bold transition-all"
                  :class="isLiked ? 'btn-orange text-white' : 'btn-outline-orange'">
                  <i class="bi" :class="isLiked ? 'bi-heart-fill' : 'bi-heart'"></i> {{ isLiked ? '已收藏' : '按愛心' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <h5 class="fw-bold text-dark mb-3 ps-2 border-start border-orange border-4">相關公告</h5>
          <div class="row g-3">
            <div v-for="related in relatedPosts" :key="related.Id" class="col-12">
              <div @click="goToOtherDetail(related.Id)"
                class="related-card bg-white rounded-4 shadow-sm overflow-hidden p-2 transition hover-up pointer">
                <div class="related-img-sm rounded-3 mb-2 overflow-hidden">
                  <img v-if="related.ImageUrl" :src="related.ImageUrl" class="w-100 h-100 object-fit-cover" />
                  <div v-else class="placeholder-gradient w-100 h-100"></div>
                </div>
                <div class="px-2 pb-2">
                  <div class="text-orange x-small fw-bold mb-1"># {{ related.TagName }}</div>
                  <h6 class="fw-bold text-dark mb-1 text-truncate-2 small">{{ related.Title }}</h6>
                  <div class="text-muted x-small">{{ related.Date }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const post = ref({});
const allNews = ref([]);
const loading = ref(true);
const isLiked = ref(false);
const scrollY = ref(0);
const scrollPercent = ref(0);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// 抓取詳情
const fetchPostDetail = async (id) => {
  loading.value = true;
  try {
    const response = await axios.get(`https://localhost:7218/api/YPosts/${id}`);
    post.value = response.data;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('抓取詳情失敗:', error);
    router.push('/post/list');
  } finally {
    loading.value = false;
  }
};

// 抓取所有列表（側邊欄用）
const fetchAllPosts = async () => {
  try {
    const response = await axios.get('https://localhost:7218/api/YPosts');
    allNews.value = response.data;
  } catch (error) {
    console.error('抓取列表失敗:', error);
  }
};

const relatedPosts = computed(() => {
  return allNews.value
    .filter(item => item.Id !== parseInt(route.params.id))
    .slice(0, 4);
});

const goToOtherDetail = (id) => {
  router.push(`/post/postDetail/${id}`);
  fetchPostDetail(id);
};

const goToJoinForm = (id) => router.push(`/post/join/${id}`);

const handleScroll = () => {
  scrollY.value = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollPercent.value = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

onMounted(() => {
  fetchPostDetail(route.params.id);
  fetchAllPosts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 樣式保持原本美化版不變 */
.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
  color: white;
}

.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.1);
}

.border-orange {
  border-color: #f3722c !important;
}

.main-content-card {
  min-height: 700px;
  border: none;
}

.detail-image-box {
  width: 100%;
  aspect-ratio: 16 / 8;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.placeholder-gradient {
  background: linear-gradient(135deg, #f3722c 0%, #f9c74f 100%);
}

.detail-text {
  color: #4a4a4a;
  white-space: pre-line;
  word-break: break-all;
}

.line-height-lg {
  line-height: 2;
  letter-spacing: 0.8px;
}

.related-img-sm {
  width: 100%;
  height: 90px;
  background-color: #f8f9fa;
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

.pointer {
  cursor: pointer;
}

.x-small {
  font-size: 0.7rem;
}

.hover-up:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

/* 骨架屏 */
.skeleton-line {
  height: 15px;
  background: #eee;
  border-radius: 8px;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-line.title {
  height: 40px;
}

.skeleton-detail-img {
  height: 300px;
  background: #eee;
}

@keyframes shimmer {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}
</style>