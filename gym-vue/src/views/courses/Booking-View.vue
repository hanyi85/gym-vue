<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BookingStepper from '@/components/Course/BookingStepper.vue'

const router = useRouter()
const route = useRoute()

const courseInfo = {
 name: '燃脂體能課程',
  coach: '張老師',
  level: '初級',
  duration: 60,
  price: 400,
}

/* 日期處理*/
const VISIBLE_COUNT = 7
const visibleStart = ref(0)

const rawDates = computed(() => {
  const result = []
  const today = new Date()

  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)

    result.push({
      date: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: String(d.getDate()).padStart(2, '0'),
    })
  }
  return result
})

const visibleDates = computed(() =>
  rawDates.value.slice(
    visibleStart.value,
    visibleStart.value + VISIBLE_COUNT
  )
)

const currentMonth = computed(() => {
  const d = visibleDates.value[0]
  return d
    ? new Date(d.date).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : ''
})

function prevDates() {
  if (visibleStart.value > 0) {
    visibleStart.value -= VISIBLE_COUNT
  }
}

function nextDates() {
  if (visibleStart.value + VISIBLE_COUNT < rawDates.value.length) {
    visibleStart.value += VISIBLE_COUNT
  }
}

const allSchedules = ref([])

async function fetchSchedules() {
  try {
    const res = await axios.get(
      'https://localhost:7218/api/CCourses/1/schedules'
    )
    allSchedules.value = res.data
  } catch (err) {
    console.error('取得課程時段失敗', err)
  }
}


const selectedDate = ref('')
const todaySlots = ref([])
const selectedSlot = ref(null)

function selectDate(date) {
  selectedDate.value = date

 const result = allSchedules.value.find(d => d.date === date)
todaySlots.value = result ? result.slots : []

  selectedSlot.value = null
}

function selectSlot(slot) {
  if (slot.full || !slot.canEnroll) return
  selectedSlot.value = slot.scheduleId
}
function goNext() {
  if (!selectedSlot.value) return

  const slot = todaySlots.value.find(
    s => s.scheduleId === selectedSlot.value
  )

  router.push({
    name: 'courses-booking-confirm',
    query: {
      date: selectedDate.value,
      time: slot.time,
      scheduleId: slot.scheduleId,
    },
  })
}

function goBack() {
  const { city, venue } = route.query

  if (city && venue) {
    router.push({
      name: 'courses-list',
      params: { city, venue }
    })
  } else {
    router.push('/courses')
  }
}

watch(
  visibleDates,
  (list) => {
    if (list.length) {
      selectDate(list[0].date)
    }
  },
  { immediate: true }
)
onMounted(() => {
  fetchSchedules()
})

</script>

<template>
  <div class="booking-wrapper">
    <div class="container">
      <header class="booking-title">
        <h2>課程預約</h2>
        <p>選擇日期與時段</p>
      </header>

    <BookingStepper :current-step="1">
        <template #step-1>選日期<br />及時段</template>
        <template #step-2>確認資訊</template>
        <template #step-3>付款</template>
        <template #step-4>完成預約</template>
      </BookingStepper>
      <!-- 課程卡 -->
      <section class="course-card">
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"
          alt="course"
        />
        <div>
          <h3>{{ courseInfo.name }}</h3>
          <p><i class="bi bi-person"></i> {{ courseInfo.coach }}</p>
          <p><i class="bi bi-star"></i> {{ courseInfo.level }}</p>
           <p><i class="bi bi-clock"></i> {{ courseInfo.duration }}分鐘</p>
              <span class="price">NT$ {{ courseInfo.price }}</span>
        </div>
      </section>

      <!-- 日期 -->
    <section class="date-section">
  
  <div class="month-title">
    {{ currentMonth }}
  </div>


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
    active: selectedSlot === slot.scheduleId,
    full: slot.full || !slot.canEnroll
  }"
  :disabled="slot.full || !slot.canEnroll"
  @click="selectSlot(slot)"
>
  <span class="slot-time">{{ slot.time }}</span>

  <span v-if="slot.full" class="slot-status">
    已額滿
  </span>

  <span v-else-if="!slot.canEnroll" class="slot-status">
    已截止
  </span>
</button>


        </div>

        <p v-else class="slot-empty">此日期尚無可預約時段</p>
      </section>
     <div class="booking-actions">
  <!-- 回到課程列表 -->
  <button class="back-btn" @click="goBack">
    回到課程列表
  </button>

  
  <button
    class="next-btn"
    :disabled="!selectedSlot"
    @click="goNext"
  >
    下一步
  </button>
</div>


    </div>
  </div>
</template>

<style scoped>
.booking-steps {
  max-width: 700px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step {
  text-align: center;
  width: 80px;
}

.label {
  font-size: 13px;
  color: #666;
}

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 6px;
  font-weight: bold;
}

.step.done .circle {
  background: #000000;
  color: #fff;
}

.step.active .circle {
  background: #ff9f1c;
  color: #fff;
  transform: scale(1.15);
}

.line {
  flex: 1;
  height: 2px;
  background: #e5e7eb;
  margin: 0 6px;
}

.line.done {
  background: #ff9f1c;
}

.booking-wrapper {
  background: #f8fafc;
  min-height: 100vh;
  padding: 48px 0 120px;
}

.container {
  max-width: 1100px;
  margin: auto;
}

.booking-title {
  text-align: center;
  margin-bottom: 32px;
}

.course-card {
  display: flex;
  gap: 20px;
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 32px;
}

.course-card img {
 
  width: 250px;
  border-radius: 12px;
  object-fit: cover;
}

.price {
  color: #ff8a00;
  font-weight: 800;
}

.date-section {
  margin-top: 32px;
  text-align: center;
}


.month-title {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #111827;
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


.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 20px;
  cursor: pointer;
}


.nav-btn:hover {
  border-color: #ff8a00;
  color: #ff8a00;
}

.date-card {
  min-width: 72px;
  height: 86px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: .25s;
}

.date-day {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
}

.date-num {
  font-size: 22px;
  font-weight: 900;
  color: #111827;
}

.date-card:hover {
  border-color: #ff8a00;
}

.date-card.active {
  background: #ffedd5;
  border-color: #ff8a00;
}

.date-card.active .date-day {
  color: #7c2d12;
}

.slot-section {
  margin-top: 40px;
  text-align: center;
}

.slot-title {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 14px;
  max-width: 500px;
  margin: auto;
}

.slot-card {
  padding: 14px 0;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: .25s;
  position: relative;
}

.slot-card:hover {
  border-color: #ff8a00;
  color: #ff8a00;
}

.slot-card.active {
  background: #ffedd5;
  border-color: #ff8a00;
  color: #7c2d12;
}

.slot-card.full {
  position: relative;
  color: #9ca3af;
  background: #f9fafb;
  cursor: not-allowed;
}
.slot-time {
  font-size: 15px;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.slot-card.full .slot-time::after {
  content: '';
  position: absolute;
  left: -6px;
  right: -6px;
  top: 50%;
  height: 2px;
  background-color: #d1d5db;
  transform: translateY(-50%);
}


.slot-status {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.slot-card.full:hover {
  border-color: #e5e7eb;
  color: #94a3b8;
}
.slot-empty {
  color: #64748b;
}
.next-btn {
  margin-top: 32px;
  padding: 14px 48px;
  border-radius: 999px;
  border: none;
  background: #ff8a00;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: .25s;
}

.next-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

/* 底部操作列 */
.booking-actions {
  margin-top: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 回到列表 */
.back-btn {
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: .2s;
}

.back-btn:hover {
  border-color: #ff8a00;
  color: #ff8a00;
}

/* 下一步（主行動） */
.next-btn {
  padding: 14px 48px;
  border-radius: 999px;
  border: none;
  background: #ff8a00;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: .25s;
}

.next-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

</style>
