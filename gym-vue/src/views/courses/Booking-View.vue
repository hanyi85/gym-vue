<script setup>
import { ref, watch } from 'vue'
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useRouter } from 'vue-router'

const router = useRouter()


const courseInfo = {
  name: '燃脂體能課程',
  coach: '張老師',
  duration: 60,
  level: '初級',
  price: 400,
}


const selectedDate = ref(null)


const allSchedules = [
  {
    date: '2026-02-04',
    slots: [
      { id: 1, time: '09:00', remain: 3 },
      { id: 2, time: '11:00', remain: 0 },
      { id: 3, time: '15:00', remain: 2 },
      { id: 4, time: '17:00', remain: 5 },
    ],
  },
  {
    date: '2026-02-05',
    slots: [
      { id: 5, time: '10:00', remain: 1 },
      { id: 6, time: '14:00', remain: 0 },
      { id: 7, time: '18:00', remain: 2 },
    ],
  },
]

const todaySlots = ref([])
const selectedSlot = ref(null)


watch(selectedDate, (newDate) => {
  if (!newDate) return
  const result = allSchedules.find((d) => d.date === newDate)
  todaySlots.value = result ? result.slots : []
  selectedSlot.value = null
})

function goNext() {
  router.push({
    name: 'courses-booking-confirm',
    query: {
      date: selectedDate.value,
      time: selectedSlot.value.time,
    },
  })
}
</script>

<template>
  <div class="booking-wrapper">
    <div class="container py-5">

<div class="booking-title">
  <h2>課程預約系統</h2>
  <p>選擇日期與時段完成預約</p>
</div>

<div class="booking-steps mb-5">
  <div class="step active">
    <div class="circle">1</div>
    <div class="label">選日期  <br>及時段</div>
  </div>
  <div class="line"></div>
  <div class="step">
    <div class="circle">2</div>
    <div class="label">確認資訊</div>
  </div>
  <div class="line"></div>
  <div class="step">
    <div class="circle">3</div>
    <div class="label">付款</div>
  </div>
  <div class="line"></div>
  <div class="step">
    <div class="circle">4</div>
    <div class="label">完成預約</div>
  </div>
  </div>



      <div class="card mb-4">
        <div class="card-body d-flex gap-4">
          <div class="bg-secondary text-white d-flex align-items-center justify-content-center"
               style="width:120px;height:120px;">
            課程圖
          </div>
          <div>
            <h5 class="fw-bold">{{ courseInfo.name }}</h5>
            <p class="mb-1">教練：{{ courseInfo.coach }}</p>
            <p class="mb-1">時長：{{ courseInfo.duration }} 分鐘</p>
            <p class="mb-1">難度：{{ courseInfo.level }}</p>
            <p class="mb-0 fw-bold">費用：NT$ {{ courseInfo.price }}</p>
          </div>
        </div>
      </div>

      <h3 class="fw-bold mb-4">選擇預約日期與時段</h3>

      <div class="row">
      
        <div class="col-md-6 mb-4">
          <label class="form-label fw-bold">選擇日期</label>
          <Flatpickr
            v-model="selectedDate"
            :config="{
              minDate: 'today',
              dateFormat: 'Y-m-d'
            }"
            class="form-control form-control-lg"
            placeholder="請選擇日期"
          />
        </div>

      
<div class="col-md-6">
  <div v-if="!selectedDate" class="text-muted mt-4">
    請先選擇左側日期
  </div>

  <template v-else>
    <h5 class="mb-3">{{ selectedDate }} 可預約時段</h5>


    <div v-if="todaySlots.length === 0" class="alert alert-secondary">
      此日期尚無課程，請選擇其他日期
    </div>

   
    <div v-else class="time-grid">
      <button
        v-for="slot in todaySlots"
        :key="slot.id"
        class="time-btn"
        :class="{
          active: selectedSlot?.id === slot.id,
          disabled: slot.remain === 0
        }"
        @click="slot.remain > 0 && (selectedSlot = slot)"
      >
        {{ slot.time }}
      </button>
    </div>

    
    <button
      v-if="selectedSlot"
      class="btn btn-primary w-100 mt-4"
      @click="goNext"
    >
      下一步確認
    </button>
  </template>
</div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-wrapper {
  min-height: 100vh;
   
  padding-bottom: 160px;
}
.booking-steps {
  display: flex;
  align-items: center;
  justify-content: center;
}

.step {
  text-align: center;
  width: 80px;
}

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 6px;
  font-weight: bold;
}

.step.active .circle {
  background: #3b82f6;
  color: #fff;
}

.label {
  font-size: 14px;
  color: #666;
}

.line {
  flex: 1;
  height: 2px;
  background: #ddd;
  margin: 0 8px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.time-btn {
  padding: 12px 0;
  border: 1px solid #3b82f6;
  background: #fff;
  color: #3b82f6;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.time-btn:hover {
  background: #eef4ff;
}

.time-btn.active {
  background: #3b82f6;
  color: #fff;
}

.time-btn.disabled {
  border-color: #ccc;
  color: #aaa;
  background: #f5f5f5;
  cursor: not-allowed;
}
.booking-title {
  text-align: center;
  margin-bottom: 32px;
}

.booking-title h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.booking-title p {
  color: #6b7280;
  font-size: 14px;
}

</style>