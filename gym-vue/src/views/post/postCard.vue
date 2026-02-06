<template>
  <div class="news-wrapper bg-light min-vh-100 pb-5">
    <div class="container py-4">
      
      <div class="row g-3 mb-5">
        <div class="col-md-6">
          <div class="banner-box d-flex align-items-center justify-content-center rounded bg-secondary-subtle text-secondary fw-bold">
            置頂公告
          </div>
        </div>
        <div class="col-md-6">
          <div class="banner-box d-flex align-items-center justify-content-center rounded border border-primary border-3 bg-secondary-subtle text-secondary fw-bold">
            精選活動
          </div>
        </div>
      </div>

      <div class="mb-4">
        <p class="text-muted small">首頁 > 最新消息</p>
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex gap-2">
            <button 
              v-for="cat in categories" :key="cat"
              @click="currentCategory = cat"
              class="btn rounded-pill px-4 btn-sm transition"
              :class="currentCategory === cat ? 'btn-dark' : 'btn-gray-light'"
            >
              {{ cat }}
            </button>
          </div>
          
          <div class="btn-group border rounded overflow-hidden shadow-sm" role="group">
            <button type="button" class="btn btn-light btn-sm border-end px-3">範圍</button>
            <button type="button" class="btn btn-secondary-subtle btn-sm px-3">卡片</button>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="news in filteredNews" :key="news.id" class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden news-card">
            <div class="card-header bg-secondary-subtle border-0 d-flex justify-content-between px-3 py-2 small text-muted fw-medium">
              <span>種類標籤 #{{ news.tag }}</span>
              <span>{{ news.date }}</span>
            </div>
            
            <div class="p-3">
              <div class="image-placeholder d-flex align-items-center justify-content-center rounded-3">
                <span class="text-secondary opacity-50">圖片內容</span>
              </div>
            </div>
            
            <div class="card-body pt-0 pb-4 text-center">
              <h5 class="card-title fw-bold mb-0">{{ news.title }}</h5>
            </div>
          </div>
        </div>
      </div>

      <nav class="mt-5 d-flex justify-content-center">
        <ul class="pagination pagination-sm gap-3 border-0">
          <li class="page-item active"><a class="page-link border-0 fw-bold text-dark bg-transparent border-bottom border-dark border-2 rounded-0" href="#">1</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">2</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">3</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">4</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">5</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">6</a></li>
          <li class="page-item"><a class="page-link border-0 text-muted bg-transparent" href="#">&gt;&gt;</a></li>
        </ul>
      </nav>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const categories = ['ALL', '最新消息', '公告', '活動', '其他'];
const currentCategory = ref('ALL');

// 健身房假資料
const newsList = ref([
  { id: 1, tag: '課程', date: '2026/02/06', title: '夏季增肌特訓班報名開始' },
  { id: 2, tag: '活動', date: '2026/02/01', title: '會員週年慶：入會費 0 元' },
  { id: 3, tag: '公告', date: '2026/01/25', title: '春節期間營業時間調整' },
  { id: 4, tag: '課程', date: '2026/01/20', title: '新進教練：專業舉重教練凱文' },
  { id: 5, tag: '其他', date: '2026/01/15', title: '飲水機維護公告' },
  { id: 6, tag: '活動', date: '2026/01/10', title: '深蹲挑戰賽，贏得半年會籍' },
  { id: 7, tag: '公告', date: '2026/01/05', title: '淋浴間整修完成通知' },
  { id: 8, tag: '課程', date: '2026/01/02', title: '拳擊有氧全新時段上線' },
  { id: 9, tag: '活動', date: '2025/12/28', title: '年末跨年團體課大集結' },
]);

const filteredNews = computed(() => {
  if (currentCategory.value === 'ALL') return newsList.value;
  return newsList.value.filter(item => item.tag === currentCategory.value);
});
</script>

<style scoped>
/* 補齊 Bootstrap 以外的自定義樣式 */

.banner-box {
  height: 200px;
  font-size: 1.25rem;
}

.btn-gray-light {
  background-color: #e9ecef;
  color: #495057;
  border: none;
}

.btn-gray-light:hover {
  background-color: #dee2e6;
}

.image-placeholder {
  background-color: #fceef0; /* 淡淡的粉色，呼應截圖 */
  aspect-ratio: 1 / 1;
  border: 1px solid #f9d6da;
}

.news-card {
  transition: transform 0.2s;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-5px);
}

.pagination .page-link:focus {
  box-shadow: none;
}

/* 移除預設分頁按鈕樣式以符合設計圖 */
.page-link {
  padding: 0.5rem;
}
</style>