<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Btn from '@/components/btn.vue'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const currentImg = ref(0)
const activeTab = ref('content')


const displayImages = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200'
]

const displayContent = [
  '基礎伸展與呼吸練習',
  '簡易體位法（貓牛式、下犬式）',
  '核心穩定訓練',
  '課後放鬆冥想'
]

const displayNotice = [
  '請穿著運動服裝',
  '建議自備毛巾與水',
  '課前 1 小時避免進食'
]

onMounted(async () => {
  const res = await axios.get(
    `https://localhost:7218/api/CCourses/${route.params.id}/detail`
  )
  course.value = res.data
})

function goBooking() {
  router.push({
    path: '/courses/booking',
    query: { id: course.value.Id }
  })
}

function goBack() {
  router.push({
    path: '/courses/list',
    query: {
      city: route.query.city,
      venue: route.query.venue
    }
  })
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="page-wrapper">

    <!-- ✅ Breadcrumb 一定要擋 -->
    <nav class="breadcrumb" v-if="course">
      <span class="link" @click="goHome">首頁</span>
      <span class="sep">/</span>
      <span class="link" @click="goBack">課程專區</span>
      <span class="sep">/</span>
      <span class="current">{{ course.Title }}</span>
    </nav>

    <!-- 主卡片 -->
    <div class="detail-card" v-if="course">

      <!-- 圖片 -->
      <div class="image-area">
        <img :src="displayImages[currentImg]" class="main-img" />

        <div class="thumbs">
          <img
            v-for="(img, idx) in displayImages"
            :key="idx"
            :src="img"
            :class="{ active: idx === currentImg }"
            @click="currentImg = idx"
          />
        </div>
      </div>

      <!-- 資訊 -->
      <div class="info-area">
        <h2 class="title">{{ course.Title }}</h2>

        <div class="tags">
          <span class="tag">{{ course.Category }}</span>
          <span class="tag">{{ course.Duration }} 分鐘</span>
        </div>

        <div class="coach">教練：{{ course.CoachName }}</div>
        <div class="price">NT$ {{ course.Price }}</div>

        <p class="desc">{{ course.Description }}</p>

        <div class="action-group">
          <Btn
            addText="回到課程列表"
            buyText="立即預約"
            @add="goBack"
            @buy="goBooking"
          />
        </div>
      </div>
    </div>

    <!-- Tabs -->
<!-- Tabs -->
<div class="tabs" v-if="course">
  <div
    class="tab"
    :class="{ active: activeTab === 'content' }"
    @click="activeTab = 'content'"
  >
    課程內容
  </div>
  <div
    class="tab"
    :class="{ active: activeTab === 'notice' }"
    @click="activeTab = 'notice'"
  >
    注意事項
  </div>
  <div
    class="tab"
    :class="{ active: activeTab === 'payment' }"
    @click="activeTab = 'payment'"
  >
    付款方式
  </div>
</div>

<!-- 課程內容 -->
<div class="tab-content center" v-if="activeTab === 'content' && course">
  <h4>課程內容</h4>
  <ul>
    <li v-for="item in displayContent" :key="item">
      {{ item }}
    </li>
  </ul>
</div>

<!-- 注意事項 -->
<div class="tab-content center" v-if="activeTab === 'notice' && course">
  <h4>注意事項</h4>
  <ul>
    <li v-for="item in displayNotice" :key="item">
      {{ item }}
    </li>
  </ul>
</div>

<!-- 付款方式 -->
<div class="tab-content center" v-if="activeTab === 'payment' && course">
  <h4>付款方式</h4>
  <ul>
    <li>信用卡（VISA / Master）</li>
    <li>ATM轉帳</li>
  </ul>

  <p class="hint">
    完成預約後，請於上課時間提前至場館報到。
  </p>
</div>

  </div>
</template>


<style scoped>
/* ===== Breadcrumb ===== */
.breadcrumb {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

.breadcrumb .link {
  cursor: pointer;
  color: #6b7280;
}

.breadcrumb .link:hover {
  color: #ff7a00;
}

.breadcrumb .sep {
  margin: 0 6px;
}

.breadcrumb .current {
  color: #f3722c;
  font-weight: 600;
}

/* ===== Page ===== */
.page-wrapper {
  margin-top: 100px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 100px;
}

/* ===== Detail Card ===== */
.detail-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

/* ===== Images ===== */
.image-area {
  display: flex;
  flex-direction: column;
}

.main-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 16px;
}

.thumbs {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.thumbs img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.6;
  cursor: pointer;
}

.thumbs img.active {
  opacity: 1;
  border: 2px solid #f3722c;
}

/* ===== Info ===== */
.info-area h2 {
  font-size: 30px;
  font-weight: 700;
}

.tags {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}

.tag {
  background: #fff4ea;
  color: #9a3412;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.coach {
  margin-top: 8px;
  color: #555;
}

.price {
  font-size: 26px;
  color: #f3722c;
  font-weight: bold;
  margin: 14px 0;
}

.desc {
  margin-top: 12px;
  color: #444;
  line-height: 1.7;
}

/* ===== Tabs ===== */
.tabs {
  display: flex;
   justify-content: center;
  gap: 32px;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 48px;
}

.tab {
  padding: 14px 0;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  position: relative;
}

.tab.active {
  color: #f3722c;
}

.tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: #f3722c;
}


.tab-content {
   
  padding: 32px 0;
  font-size: 15px;
  line-height: 1.7;
}

.tab-content.center {
  max-width: 720px;
  margin: 0 auto;
  padding-top: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;   }

.tab-content.center h4 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 18px;
}


.tab-content.center ul {
  width: 100%;
  max-width: 520px;
  padding-left: 20px;
  text-align: left;
}

.tab-content.center li {
  margin-bottom: 10px;
  line-height: 1.8;
  color: #444;
}


.hint {
  margin-top: 18px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}


</style>
