<template>
  <div class="faq-wrapper bg-light min-vh-100 pb-5">
    <Banner title="常見問題" subtitle="快速了解大家常遇到的大小問題" />

    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange">常見問題</span>
        </p>
      </nav>

      <div class="row g-4">
        <div class="col-lg-3">
          <div class="sticky-menu">
            <div class="list-group shadow-sm border-0 rounded-4 overflow-hidden">
              <button v-for="category in faqData" :key="category.id" @click="scrollToSection(category.id)"
                :class="['list-group-item list-group-item-action border-0 py-3 fw-bold transition-all', activeCategory === category.id ? 'active-category' : '']">
                <i :class="['bi me-2', category.icon]"></i> {{ category.title }}
              </button>
            </div>

            <div class="bg-orange-light rounded-4 p-4 mt-4 text-center border-orange-subtle">
              <h6 class="fw-bold text-dark mb-2">還有其他疑問嗎？</h6>
              <p class="x-small text-muted mb-3">我們的客服團隊很樂意為您服務</p>
              <button class="btn btn-orange btn-sm rounded-pill px-4 text-white fw-bold">聯繫我們</button>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div v-for="category in faqData" :key="category.id" :id="category.id" class="faq-section mb-5">
            <h4 class="fw-bold text-dark mb-4 border-start border-orange border-4 ps-2">{{ category.title }}</h4>

            <div class="accordion shadow-sm rounded-4 overflow-hidden border-0" :id="'accordion-' + category.id">
              <div v-for="(item, index) in category.questions" :key="index"
                class="accordion-item border-0 border-bottom">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed fw-bold text-dark bg-white shadow-none" type="button"
                    data-bs-toggle="collapse" :data-bs-target="'#collapse-' + category.id + '-' + index">
                    Q{{ index + 1 }}. {{ item.q }}
                  </button>
                </h2>
                <div :id="'collapse-' + category.id + '-' + index" class="accordion-collapse collapse"
                  :data-bs-parent="'#accordion-' + category.id">
                  <div class="accordion-body bg-light-orange text-secondary">
                    {{ item.a }}
                  </div>
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
import { ref } from 'vue';
import Banner from '@/components/banner.vue';

// 當前啟動的分類
const activeCategory = ref('membership');

// FAQ 資料
const faqData = ref([
  {
    id: 'membership',
    title: '會籍相關',
    icon: 'bi-person-badge',
    questions: [
      { q: '如何申請加入 FitnessBar 會員？', a: '您可以親臨各門市櫃台辦理，或透過官網線上加入頁面進行初步預約。' },
      { q: '會籍是否可以請假 (暫停)？', a: '可以，會員因出國、懷孕、受傷等原因可申請暫停，需攜帶證明文件至門市辦理。' },
      { q: '會籍跨館使用規定？', a: '視合約類型而定，全台會員可使用所有據點。' }
    ]
  },
  {
    id: 'course',
    title: '課程相關',
    icon: 'bi-calendar3',
    questions: [
      { q: '團體課程需要額外付費嗎？', a: '大部分團體課均包含在月費中，部分特殊課程需額外付費。' },
      { q: '私人教練課如何預約？', a: '可透過 APP 線上預約，或與您的專屬教練協調時間。' }
    ]
  },
  {
    id: 'venue',
    title: '門市據點',
    icon: 'bi-geo-alt',
    questions: [
      { q: '場館內有提供毛巾嗎？', a: '建議自行攜帶，館內亦有販售。' },
      { q: '營業時間是什麼時候？', a: '多數為 24H 營業，百貨店型依百貨營業時間為準。' }
    ]
  },
  {
    id: 'trainer',
    title: '教練介紹',
    icon: 'bi-award',
    questions: [
      { q: '我可以更換教練嗎？', a: '可以，若風格不合可向客服中心申請更換。' }
    ]
  }
]);

/**
 * 修正後的跳轉邏輯
 * 使用原生 scrollIntoView 配合 CSS scroll-margin-top
 */
const scrollToSection = (id) => {
  activeCategory.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};
</script>

<style scoped>
/* 品牌色系 */
.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
}

.btn-orange:hover {
  background-color: #d65a1a;
}

.border-orange {
  border-color: #f3722c !important;
}

/* 精準跳轉核心：當元素被捲動到頂部時，自動留出 Header 的空間 */
.faq-section {
  scroll-margin-top: 130px;
  /* 根據你的 Header 高度調整，130px 通常很安全 */
}

/* 解決頁面底部空間不足導致無法跳轉到頂部的問題 */
.faq-section:last-child {
  padding-bottom: 40vh;
}

/* 左側 Sticky 選單優化 */
.sticky-menu {
  position: sticky;
  top: 120px;
  /* 選單停下的位置，需避開 Header */
  z-index: 100;
}

/* 選單 Active 狀態 */
.active-category {
  background-color: #f3722c !important;
  color: white !important;
  border-left: 5px solid #d65a1a !important;
}

.list-group-item:hover:not(.active-category) {
  background-color: rgba(243, 114, 44, 0.05);
  color: #f3722c;
}

/* 裝飾樣式 */
.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.05);
  border: 1px solid rgba(243, 114, 44, 0.1);
}

.accordion-button:not(.collapsed) {
  background-color: rgba(243, 114, 44, 0.05);
  color: #f3722c;
}

.bg-light-orange {
  background-color: #fafafa;
  padding: 1.5rem;
  line-height: 1.8;
}

.transition-all {
  transition: all 0.3s ease;
}

.x-small {
  font-size: 0.75rem;
}

.breadcrumb-link:hover {
  color: #f3722c !important;
}
</style>