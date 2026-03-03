<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'

const router = useRouter()
const route = useRoute()

const courseSlug = computed(() => route.params.slug || '')
const courseId = ref(null)
const courseInfo = ref(null)

const VISIBLE_COUNT = 7
const visibleStart = ref(0)

const rawDates = computed(() => {
  const today = new Date()
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      date: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: String(d.getDate()).padStart(2, '0'),
    }
  })
})

const visibleDates = computed(() =>
  rawDates.value.slice(visibleStart.value, visibleStart.value + VISIBLE_COUNT)
)

const currentMonth = computed(() => {
  const first = visibleDates.value[0]
  return first
    ? new Date(first.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : ''
})

function prevDates() {
  visibleStart.value = Math.max(0, visibleStart.value - VISIBLE_COUNT)
}

function nextDates() {
  if (visibleStart.value + VISIBLE_COUNT < rawDates.value.length) {
    visibleStart.value += VISIBLE_COUNT
  }
}

/* 課程時段 */
const allSchedules = ref([])
const selectedDate = ref('')
const todaySlots = ref([])
const selectedSlotId = ref(null)

async function fetchSchedules() {
  if (!courseId.value) return
  const res = await axios.get(
    `https://localhost:7218/api/CCourses/${courseId.value}/schedules`
  )
  allSchedules.value = res.data
}

function selectDate(date) {
  selectedDate.value = date
  const day = allSchedules.value.find(d => d.date === date)
  todaySlots.value = day ? day.slots : []
  selectedSlotId.value = null
}

function selectSlot(slot) {
  if (slot.full || !slot.canEnroll) return
  selectedSlotId.value = slot.scheduleId
}

/* 課程資料 */
async function fetchCourseDetail() {
  
  if (!courseSlug.value) return

  const res = await axios.get(
    `https://localhost:7218/api/CCourses/by-name/${courseSlug.value}`
  )

  const d = res.data
  courseId.value = d.Id

  courseInfo.value = {
    name: d.Title ?? d.CourseName,
    level: (d.courseLevel ?? d.CourseLevel ?? '').trim() || '未提供',
    duration: d.Duration,
    price: d.Price,
    description: d.Description,
    imageUrl: d.ImageUrl,
  }
  console.log('detail raw =', d)
console.log('detail keys =', Object.keys(d || {}))
}

function goNext() {
  if (!selectedSlotId.value) return

  const slot = todaySlots.value.find(s => s.scheduleId === selectedSlotId.value)
  if (!slot) return

  router.push({
    name: 'courses-booking-confirm',
    params: {
      slug: courseSlug.value,
      scheduleId: slot.scheduleId,
    },
  })
}

function goBack() {
  const { city, venue } = route.query
  if (city && venue) {
    router.push({ name: 'courses-list', params: { city, venue } })
  } else {
    router.push('/courses')
  }
}

watch(
  visibleDates,
  (list) => {
    if (list.length) selectDate(list[0].date)
  },
  { immediate: true }
)

onMounted(async () => {
  await fetchCourseDetail()
  await fetchSchedules()
})
</script>

<template>
  <div class="booking-wrapper">
    <div class="container">

      <!-- 標題 -->
      <header class="booking-title">
        <h2>課程預約</h2>
        <p>選擇日期與時段</p>
      </header>

      <!-- 步驟條 -->
      <BookingStepper :current-step="1">
        <template #step-1>選日期<br />及時段</template>
        <template #step-2>確認資訊</template>
        <template #step-3>付款</template>
        <template #step-4>完成預約</template>
      </BookingStepper>

      <!-- 課程資訊卡 -->
      <section v-if="courseInfo" class="course-card">
        <img
          :src="courseInfo.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200'"
          alt="course"
        />

        <div class="course-info">
          <h3>{{ courseInfo.name }}</h3>

          <p class="meta">
            <i class="bi bi-star"></i>
            {{ courseInfo.level}}
          </p>

          <p class="meta">
            <i class="bi bi-clock"></i>
            {{ courseInfo.duration }} 分鐘
          </p>

          <p class="price"> <i class="bi bi-cash-stack"></i> NT$ {{ courseInfo.price }}</p>

        <p class="course-desc subtle">
  {{ courseInfo.description }}
</p>

        </div>
      </section>

      <section v-else class="course-card loading">
        載入課程資料中…
      </section>

      <!-- 日期選擇 -->
      <section class="date-section">
        <div class="month-title">{{ currentMonth }}</div>

        <div class="date-header">
          <button class="nav-btn" @click="prevDates">‹</button>

          <div class="date-row">
            <button
              v-for="d in visibleDates"
              :key="d.date"
              class="date-card"
              :class="{ active: d.date === selectedDate }"
              @click="selectDate(d.date)"
            >
              <div class="date-day">{{ d.day }}</div>
              <div class="date-num">{{ d.num }}</div>
            </button>
          </div>

          <button class="nav-btn" @click="nextDates">›</button>
        </div>
      </section>

      <!-- 時段 -->
      <section class="slot-section">
        <h4 class="slot-title">可預約時段</h4>

        <div v-if="todaySlots.length" class="slot-grid">
          <button
            v-for="slot in todaySlots"
            :key="slot.scheduleId"
            class="slot-card"
            :class="{
              active: selectedSlotId === slot.scheduleId,
              full: slot.full || !slot.canEnroll
            }"
            :disabled="slot.full || !slot.canEnroll"
            @click="selectSlot(slot)"
          >
            <span class="slot-time">{{ slot.time }}</span>

            <span v-if="slot.full" class="slot-status">已額滿</span>
            <span v-else-if="!slot.canEnroll" class="slot-status">已截止</span>
          </button>
        </div>

        <p v-else class="slot-empty">此日期尚無可預約時段</p>
      </section>

      <!-- 底部操作 -->
      <div class="booking-actions">
        <button class="back-btn" @click="goBack">回到課程列表</button>

        <button
          class="next-btn"
          :disabled="!selectedSlotId"
          @click="goNext"
        >
          下一步
        </button>
      </div>

    </div>
  </div>
</template>


<style scoped>
.booking-wrapper {
  background: #f8fafc;
  min-height: 100vh;
  padding: 48px 0 120px;
}

.container {
  max-width: 1100px;
  margin: auto;
}

/* ===== 標題 ===== */
.booking-title {
  text-align: center;
  margin-bottom: 32px;
}

.booking-title h2 {
  font-size: 28px;
  font-weight: 900;
}

.booking-title p {
  color: #64748b;
}

/* ===== 課程卡 ===== */
.course-card {
  display: flex;
  gap: 20px;
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 32px;
}

.course-card.loading {
  justify-content: center;
  color: #64748b;
}

.course-card img {
  width: 250px;
  border-radius: 12px;
  object-fit: cover;
}

.course-info h3 {
  font-size: 22px;
  font-weight: 800;
}

.meta {
  margin: 6px 0;
  color: #374151;
}

.price {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 900;
  color: #ff8a00;
}

.course-desc.subtle {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 3px solid #e5e7eb;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
}

/* ===== 日期 ===== */
.date-section {
  text-align: center;
  margin-top: 40px;
}

.month-title {
  font-weight: 800;
  margin-bottom: 16px;
}

.date-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.date-row {
  display: flex;
  gap: 12px;
}

.date-card {
  width: 72px;
  height: 86px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: .2s;
}

.date-card.active {
  background: #ffedd5;
  border-color: #ff8a00;
}

.date-day {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
}

.date-num {
  font-size: 22px;
  font-weight: 900;
}

/* ===== 時段 ===== */
.slot-section {
  margin-top: 40px;
  text-align: center;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 110px);  
  gap: 14px;
  justify-content: center;  /* 讓整排置中 */
  max-width: 500px;
  margin: auto;
}

.slot-card {
  width: 110px;          /* 固定寬 */
  height: 60px;          /* 固定高 */
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.slot-card.active {
  background: #ffedd5;
  border-color: #ff8a00;
}

.slot-card.full {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.slot-time {
  position: relative;
}

.slot-card.full .slot-time::after {
  content: '';
  position: absolute;
  left: -6px;
  right: -6px;
  top: 50%;
  height: 2px;
  background: #d1d5db;
  transform: translateY(-50%);
}

.slot-status {
  display: block;
  font-size: 12px;
  margin-top: 6px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50px;        
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s ease;
}

/* hover 狀態 */
.nav-btn:hover {
  border-color: #ff8a00;
  color: #ff8a00;
  background: #fff7ed;
}

/* disabled（如果之後有用） */
.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== 底部 ===== */
.booking-actions {
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
}

.back-btn {
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}

.next-btn {
  padding: 14px 48px;
  border-radius: 999px;
  border: none;
  background: #ff8a00;
  color: white;
  font-weight: 800;
}

.next-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
}

</style>
