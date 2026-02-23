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

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-orange" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">資料載入中...</p>
      </div>

      <div v-else class="row g-4">
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
              <router-link to="/post/customer-service"
                class="btn btn-orange btn-sm rounded-pill px-4 text-white fw-bold text-decoration-none">
                聯繫我們
              </router-link>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Banner from '@/components/banner.vue';

// --- 狀態管理 ---
const faqData = ref([]);      // 存放經過分組處理後的 FAQ 資料
const activeCategory = ref(''); // 當前選中的分類 ID
const loading = ref(true);     // 讀取狀態控制

/**
 * 抓取 API 資料並重新分組
 * 後端回傳格式預期為: [{ Question: "...", Answer: "...", CategoryName: "..." }]
 */
const fetchFaqs = async () => {
  try {
    const apiUrl = 'https://localhost:7218/api/YFaqs';
    const response = await axios.get(apiUrl);
    const rawData = response.data;

    // 將後端扁平化資料轉換為前端分類結構 (Group By CategoryName)
    const grouped = rawData.reduce((acc, item) => {
      const catName = item.CategoryName || '一般問題';

      // 尋找是否已經建立了該分類的容器
      let category = acc.find(c => c.title === catName);

      if (!category) {
        category = {
          id: catName, // 直接拿分類名稱當作 DOM 的 ID 進行跳轉
          title: catName,
          icon: getIconByCategory(catName),
          questions: []
        };
        acc.push(category);
      }

      // 將問題與答案放入該分類中 (注意屬性首字母大寫)
      category.questions.push({
        q: item.Question,
        a: item.Answer
      });

      return acc;
    }, []);

    faqData.value = grouped;

    // 初始化選中的分類為第一個
    if (grouped.length > 0) {
      activeCategory.value = grouped[0].id;
    }
  } catch (error) {
    console.error('API 串接錯誤:', error);
    alert('無法載入常見問題，請檢查後端伺服器或連線設定。');
  } finally {
    loading.value = false;
  }
};

/**
 * 根據分類名稱自動匹配圖示 (Bootstrap Icons)
 */
const getIconByCategory = (name) => {
  if (name.includes('會籍')) return 'bi-person-badge';
  if (name.includes('課程')) return 'bi-calendar3';
  if (name.includes('據點') || name.includes('門市')) return 'bi-geo-alt';
  if (name.includes('教練')) return 'bi-award';
  return 'bi-question-circle'; // 預設圖示
};

/**
 * 捲動至特定分類區域
 */
const scrollToSection = (id) => {
  activeCategory.value = id;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 組件掛載後立即執行抓取資料
onMounted(() => {
  fetchFaqs();
});
</script>

<style scoped>
/* 品牌主題色 */
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

/* 捲動邊距設定：防止標題被 Header 遮住 */
.faq-section {
  scroll-margin-top: 130px;
}

.faq-section:last-child {
  padding-bottom: 40vh;
}

/* 側邊欄固定效果 */
.sticky-menu {
  position: sticky;
  top: 120px;
  z-index: 100;
}

/* 選單啟動狀態樣式 */
.active-category {
  background-color: #f3722c !important;
  color: white !important;
  border-left: 5px solid #d65a1a !important;
}

.list-group-item:hover:not(.active-category) {
  background-color: rgba(243, 114, 44, 0.05);
  color: #f3722c;
}

/* 裝飾性樣式 */
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