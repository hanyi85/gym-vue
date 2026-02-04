<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const orderId = route.query.orderId || 'BK20260203001'
const course = route.query.course || '燃脂體能課程'
const coach = route.query.coach || '張老師'
const date = route.query.date || '2026-02-03 10:00'

const overallRating = ref(5)
const coachRating = ref(5)
const environmentRating = ref(5)
const contentRating = ref(5)
const atmosphereRating = ref(5)

const comment = ref('')
const selectedTags = ref([])

const tags = [
  '教練專業',
  '氣氛很好',
  '場地乾淨',
  '課程充實',
  '會再回訪',
  '節奏剛好',
  '設備新穎'
]

function toggleTag(tag) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

function submitReview() {
  console.log({
    orderId,
    overallRating: overallRating.value,
    coachRating: coachRating.value,
    environmentRating: environmentRating.value,
    contentRating: contentRating.value,
    atmosphereRating: atmosphereRating.value,
    comment: comment.value,
    tags: selectedTags.value
  })

  router.push('/courses/review-success')
}
</script>

<template>
  <div class="page-wrapper">

    <div class="review-title">
      <h2>評論系統</h2>
    </div>

    <div class="review-card">

      <div class="course-info">
        <div class="img">課程圖片</div>
        <div class="info">
          <h4>{{ course }}</h4>
          <p>教練：{{ coach }}</p>
          <p>時間：{{ date }}</p>
          <p>訂單編號：{{ orderId }}</p>
        </div>
      </div>

      
      <div class="rating-group">
        <div class="rating-item">
          <span>整體評分</span>
          <div class="stars">
            <span v-for="n in 5" :key="n"
              :class="{ active: n <= overallRating }"
              @click="overallRating = n">★</span>
          </div>
        </div>

        <div class="rating-item">
          <span>教練表現</span>
          <div class="stars">
            <span v-for="n in 5" :key="n"
              :class="{ active: n <= coachRating }"
              @click="coachRating = n">★</span>
          </div>
        </div>

        <div class="rating-item">
          <span>環境整潔</span>
          <div class="stars">
            <span v-for="n in 5" :key="n"
              :class="{ active: n <= environmentRating }"
              @click="environmentRating = n">★</span>
          </div>
        </div>

        <div class="rating-item">
          <span>課程內容</span>
          <div class="stars">
            <span v-for="n in 5" :key="n"
              :class="{ active: n <= contentRating }"
              @click="contentRating = n">★</span>
          </div>
        </div>

        <div class="rating-item">
          <span>氣氛體驗</span>
          <div class="stars">
            <span v-for="n in 5" :key="n"
              :class="{ active: n <= atmosphereRating }"
              @click="atmosphereRating = n">★</span>
          </div>
        </div>
      </div>

      
      <div class="textarea">
        <label>心得分享</label>
        <textarea v-model="comment" rows="4" placeholder="寫下你的真實體驗..." />
      </div>
 
      <div class="tags">
        <p>快速標籤</p>
        <span
          v-for="t in tags"
          :key="t"
          :class="{ active: selectedTags.includes(t) }"
          @click="toggleTag(t)"
        >
          {{ t }}
        </span>
      </div>

      <div class="btn-row">
        <button class="outline" @click="$router.back()">返回訂單</button>
        <button class="primary" @click="submitReview">送出評論</button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}

.review-title {
  text-align: center;
  margin-bottom: 24px;
}

.review-card {
  max-width: 720px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 28px;
  background: white;
}

.course-info {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.img {
  width: 140px;
  height: 90px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stars span {
  font-size: 26px;
  cursor: pointer;
  color: #d1d5db;
  transition: 0.2s;
}

.stars span.active {
  color: #f59e0b;
}

.stars span:hover {
  transform: scale(1.15);
}

.textarea textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px;
}

.tags span {
  display: inline-block;
  border: 1px solid #ddd;
  padding: 6px 14px;
  border-radius: 20px;
  margin: 6px;
  cursor: pointer;
  font-size: 13px;
}

.tags span.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.btn-row {
  margin-top: 28px;
  display: flex;
  justify-content: space-between;
}

.outline {
  background: #f3f4f6;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
}
</style>

