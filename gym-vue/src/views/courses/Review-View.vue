<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useReviewStore } from '@/stores/Course/reviewStore'

const router = useRouter()
const reviewStore = useReviewStore()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

// 只保留 bookingId（不放網址）
const courseBookingId = ref(0)

// 顯示資訊：改成由後端 summary 回來
const orderId = ref('')
const course = ref('')
const coach = ref('')
const startTime = ref('')

function pad2(n) {
  return String(n).padStart(2, '0')
}

const displayDateTime = computed(() => {
  if (!startTime.value) return ''
  const d = new Date(startTime.value)
  if (isNaN(d.getTime())) return startTime.value
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
})

// ===== 評分 =====
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
  '設備新穎',
]

function toggleTag(tag) {
  if (isReviewed.value) return
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const submitting = ref(false)
const loading = ref(false)
const isReviewed = ref(false)

//  取 review summary（顯示用）
async function loadReviewSummary() {
  const id = Number(courseBookingId.value || 0)
  if (!id) return

  const res = await api.get(`/coursebookings/${id}/review-summary`, {
    params: { userId: 1 },
  })

  const d = res.data || {}
  orderId.value = (d.orderId ?? '').toString()
  course.value = (d.course ?? '').toString()
  coach.value = (d.coach ?? '').toString()
  startTime.value = (d.startTime ?? '').toString()
}

// 檢查是否已評論（你原本就有）
async function loadExistedReview() {
  const id = Number(courseBookingId.value || 0)
  if (!id) return

  try {
    const existed = await api.get(`/Reviews/booking/${id}`)
    if (existed.data) {
      isReviewed.value = true
      const r = existed.data

      overallRating.value = r.Rating ?? r.rating ?? overallRating.value
      coachRating.value = r.TeachingQuality ?? r.teachingQuality ?? coachRating.value
      environmentRating.value = r.EnvironmentScore ?? r.environmentScore ?? environmentRating.value
      atmosphereRating.value = r.DifficultyScore ?? r.difficultyScore ?? atmosphereRating.value
      contentRating.value = r.ValueScore ?? r.valueScore ?? contentRating.value
      comment.value = r.Comment ?? r.comment ?? ''
      selectedTags.value = []
    }
  } catch (err) {
    console.warn('check existed review failed:', err)
  }
}

onMounted(async () => {
  //  從 session 還原 bookingId（避免重整就死）
  reviewStore.loadFromSession()

  if (!reviewStore.bookingId) {
    router.push('/courses/booking-history')
    return
  }

  courseBookingId.value = Number(reviewStore.bookingId)

  loading.value = true
  try {
    await loadReviewSummary()
    await loadExistedReview()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function submitReview() {
  if (submitting.value) return
  if (!courseBookingId.value) return
  if (isReviewed.value) {
    router.push('/courses/booking-history')
    return
  }

  const payload = {
    CourseBookingId: courseBookingId.value,
    UserId: 1,

    Rating: overallRating.value,
    TeachingQuality: coachRating.value,
    EnvironmentScore: environmentRating.value,
    ValueScore: contentRating.value,
    DifficultyScore: atmosphereRating.value,

    Comment: comment.value || '',
    TagIds: [],
  }

  submitting.value = true
  try {
    await api.post('/Reviews/course', payload)

    //  送出後就把 reviewStore 清掉，避免回來重整還卡住
    reviewStore.clear()

    router.push({ name: 'courses-review-success' })
  } catch (err) {
    console.error(err)
    alert(err.response?.data || err.message)
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div class="page-wrapper">
    <div class="review-title">
      <h2>課程評論</h2>
      <p v-if="loading" class="muted">載入中...</p>
      <p v-else-if="isReviewed" class="muted">此訂單已評論（僅供查看）</p>
    </div>

    <div class="review-card">
     <div class="course-info">
  <h4 class="course-title">{{ course }}</h4>
  <p>教練：{{ coach }}</p>
  <p>時間：{{ displayDateTime }}</p>
  <p>訂單編號：{{ orderId }}</p>
</div>

<hr class="divider" />

      <div class="rating-group">
        <div class="rating-item">
          <span>整體評分</span>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              :class="{ active: n <= overallRating, disabled: isReviewed }"
              @click="isReviewed ? null : (overallRating = n)"
              >★</span
            >
          </div>
        </div>

        <div class="rating-item">
          <span>教練表現</span>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              :class="{ active: n <= coachRating, disabled: isReviewed }"
              @click="isReviewed ? null : (coachRating = n)"
              >★</span
            >
          </div>
        </div>

        <div class="rating-item">
          <span>環境整潔</span>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              :class="{ active: n <= environmentRating, disabled: isReviewed }"
              @click="isReviewed ? null : (environmentRating = n)"
              >★</span
            >
          </div>
        </div>

        <div class="rating-item">
          <span>課程內容</span>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              :class="{ active: n <= contentRating, disabled: isReviewed }"
              @click="isReviewed ? null : (contentRating = n)"
              >★</span
            >
          </div>
        </div>

        <div class="rating-item">
          <span>氣氛體驗</span>
          <div class="stars">
            <span
              v-for="n in 5"
              :key="n"
              :class="{ active: n <= atmosphereRating, disabled: isReviewed }"
              @click="isReviewed ? null : (atmosphereRating = n)"
              >★</span
            >
          </div>
        </div>
      </div>

      <div class="textarea">
        <label>心得分享</label>
        <textarea
          v-model="comment"
          rows="4"
          placeholder="寫下你的真實體驗..."
          :disabled="isReviewed"
        />
      </div>

      <div class="tags">
        <p>快速標籤</p>
        <span
          v-for="t in tags"
          :key="t"
          :class="{ active: selectedTags.includes(t), disabled: isReviewed }"
          @click="toggleTag(t)"
        >
          {{ t }}
        </span>
      </div>

      <div class="btn-row">
        <button class="outline" @click="router.push('/courses/booking-history')">
          返回訂單
        </button>

        <button
          v-if="!isReviewed"
          class="primary"
          :disabled="submitting"
          @click="submitReview"
        >
          {{ submitting ? '送出中...' : '送出評論' }}
        </button>

        <button v-else class="primary" disabled>
          已評論
        </button>
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
  text-align: center;
  margin-bottom: 24px;
}

.course-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.course-info p {
  margin: 4px 0;
  color: #374151;
}

.divider {
  border: none;
  border-top: 1px solid #434344;
  margin: 20px 0 30px 0;
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
  background: #ff8a00;
  color: white;
  border-color: #ff8a00;
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
  background: #ff8a00;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
}


</style>

