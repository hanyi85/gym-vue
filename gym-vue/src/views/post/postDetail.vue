<template>
  <div class="post-detail-wrapper bg-light min-vh-100 pb-5">
    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <router-link to="/post/list" class="breadcrumb-link text-decoration-none text-muted">最新消息</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange">文章內容</span>
        </p>
      </nav>

      <div class="row g-4">
        <div class="col-lg-9">
          <div class="main-content-card bg-white rounded-4 shadow-sm p-4 p-md-5">
            <div class="mb-4 text-center">
              <span class="badge bg-orange-light text-orange mb-3 px-3 py-2 rounded-pill fw-bold">
                # {{ currentPost.tag }}
              </span>
              <h1 class="fw-bold text-dark display-6 mb-3">{{ currentPost.title }}</h1>
              <div class="d-flex justify-content-center align-items-center text-muted small gap-3">
                <span><i class="bi bi-calendar3 me-1"></i>發佈日期：{{ currentPost.date }}</span>
                <span><i class="bi bi-eye me-1"></i>瀏覽次數：1,245</span>
              </div>
            </div>

            <div class="detail-image-box rounded-4 bg-light mb-5 d-flex align-items-center justify-content-center overflow-hidden">
              <span class="text-secondary opacity-25 fw-bold display-4">FitnessBar PHOTO</span>
            </div>

            <div class="article-body text-secondary line-height-lg mb-5">
              <p class="fs-5">這是在此顯示的公告內容範例。果果能量提供專業的健身與營養諮詢，本篇公告詳細說明了關於「{{ currentPost.title }}」的相關資訊。</p>
              <p>內容將會根據後端抓取的資料進行呈現，目前為前端樣板展示。您可以點擊下方的按鈕進行報名，系統將會帶入此活動編號。</p>
            </div>

            <div class="d-flex flex-column align-items-center gap-4 border-top pt-5">
              <button 
                @click="goToJoinForm(currentPost.id)"
                class="btn btn-orange text-white rounded-pill px-5 py-3 fw-bold shadow-sm transition-scale"
              >
                立即報名活動
              </button>
              
              <div class="d-flex gap-3">
                <button class="btn btn-outline-orange rounded-pill px-4 btn-sm fw-bold">
                  <i class="bi bi-heart me-2"></i>按愛心
                </button>
                <button class="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-bold">
                  <i class="bi bi-share me-2"></i>分享
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3">
          <h5 class="fw-bold text-dark mb-3 ps-2 border-start border-orange border-4">相關公告</h5>
          <div class="row g-3">
            <div v-for="related in relatedPosts" :key="related.id" class="col-12">
              <div 
                @click="goToOtherDetail(related.id)"
                class="related-card bg-white rounded-4 shadow-sm overflow-hidden p-2 transition hover-up pointer"
              >
                <div class="related-img-sm bg-light rounded-3 mb-2 d-flex align-items-center justify-content-center">
                  <span class="text-muted opacity-25 x-small fw-bold">IMG</span>
                </div>
                <div class="px-2 pb-2">
                  <div class="text-orange x-small fw-bold mb-1"># {{ related.tag }}</div>
                  <h6 class="fw-bold text-dark mb-1 text-truncate">{{ related.title }}</h6>
                  <div class="text-muted x-small">{{ related.date }}</div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 模擬資料庫
const allNews = [
  { id: 1, tag: '課程', date: '2026/02/06', title: '夏季增肌特訓班報名開始' },
  { id: 2, tag: '活動', date: '2026/02/01', title: '會員週年慶：入會費 0 元' },
  { id: 3, tag: '公告', date: '2026/01/25', title: '春節期間營業時間調整' },
  { id: 4, tag: '課程', date: '2026/01/20', title: '新進教練：專業舉重教練凱文' },
  { id: 5, tag: '其他', date: '2026/01/15', title: '飲水機維護公告' },
];

const currentPost = computed(() => {
  const id = parseInt(route.params.id);
  return allNews.find(item => item.id === id) || allNews[0];
});

const relatedPosts = computed(() => {
  return allNews.filter(item => item.id !== currentPost.value.id).slice(0, 4);
});

// 跳轉到報名表單
const goToJoinForm = (id) => {
  router.push(`/post/join/${id}`);
};

const goToOtherDetail = (id) => {
  router.push(`/post/postDetail/${id}`);
};

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
/* 樣式部分保持不變，維持與 postList 一致的橘色系 */
.text-orange { color: #f3722c !important; }
.btn-orange { background-color: #f3722c; border-color: #f3722c; }
.btn-orange:hover { background-color: #d65a1a; transform: translateY(-2px); }
.btn-outline-orange { color: #f3722c; border: 1px solid #f3722c; background: transparent; }
.btn-outline-orange:hover { background-color: #f3722c; color: white; }
.bg-orange-light { background-color: rgba(243, 114, 44, 0.1); }
.border-orange { border-color: #f3722c !important; }

.breadcrumb-link { transition: color 0.2s; }
.breadcrumb-link:hover { color: #f3722c !important; text-decoration: underline !important; }

.main-content-card { min-height: 600px; }
.detail-image-box { width: 100%; aspect-ratio: 16 / 7; }
.line-height-lg { line-height: 2; letter-spacing: 0.5px; }

.transition-scale {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.transition-scale:active { transform: scale(0.95); }

.related-card { transition: all 0.3s; }
.related-img-sm { width: 100%; height: 100px; }
.hover-up:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
}
.pointer { cursor: pointer; }
.x-small { font-size: 0.75rem; }
.fw-bold { font-weight: 700 !important; }
</style>