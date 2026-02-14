<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Btn from '@/components/btn.vue'

const route = useRoute()
const router = useRouter()


const course = ref(null)

const currentImg = ref(0)

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

/* ================= API ================= */
onMounted(async () => {
  const res = await axios.get(
    `https://localhost:7218/api/CCourses/${route.params.id}/detail`
  )
  course.value = res.data
})

/* ================= Actions ================= */
function goBooking() {
  router.push({
    path: '/courses/booking',
    query: { id: course.value.id }
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
</script>

<template>
  
  <div class="page-wrapper">

    <div class="detail-card" v-if="course">

      <!-- 圖片區 -->
      <div class="image-area">
        <img
          :src="displayImages[currentImg]"
          class="main-img"
        />

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

      <!-- 資訊區 -->
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

    <!-- 課程內容 -->
    <div class="section" v-if="course">
      <h4>課程內容</h4>
      <ul>
        <li v-for="item in displayContent" :key="item">
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- 注意事項 -->
    <div class="section" v-if="course">
      <h4>注意事項</h4>
      <ul>
        <li v-for="item in displayNotice" :key="item">
          {{ item }}
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 100px;
}

.detail-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

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

.book-btn {
  margin-top: 24px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.section {
  margin-top: 48px;
}

.section h4 {
  font-size: 22px;
  margin-bottom: 12px;
}

.section li {
  margin-bottom: 8px;
  color: #444;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}



</style>
