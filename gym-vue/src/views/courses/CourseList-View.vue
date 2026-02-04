<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tab = ref('course')
const city = route.query.city || '台北市'
const venue = route.query.venue || '信義館'
const category = ref('')

const keyword = ref('')
const duration = ref('')
const level = ref('')
const price = ref('')

const fakeCourses = [
  { id: 1, title: '瑜珈基礎課程', category: '瑜珈', coach: '張老師', level: '初級', duration: 60, price: 400 },
  { id: 2, title: '重量訓練入門', category: '重訓', coach: '李教練', level: '中級', duration: 60, price: 500 },
  { id: 3, title: '燃脂 HIIT', category: '有氧', coach: 'Amy', level: '中級', duration: 45, price: 450 },
  { id: 4, title: '核心訓練', category: '核心', coach: 'John', level: '初級', duration: 45, price: 450 },
  { id: 5, title: '瑜珈伸展', category: '瑜珈', coach: 'Linda', level: '初級', duration: 60, price: 400 },
  { id: 6, title: '進階重訓', category: '重訓', coach: 'Mike', level: '高級', duration: 90, price: 600 }
]


const fakeCoaches = [
  { id: 1, name: '張老師', specialty: '瑜珈 / 伸展' },
  { id: 2, name: '李教練', specialty: '重訓 / 增肌' },
  { id: 3, name: 'Amy', specialty: 'HIIT / 燃脂' }
]

const filteredCourses = () => {
  return fakeCourses.filter(c => {
    const k = !keyword.value || c.title.includes(keyword.value)
    const cat = !category.value || c.category === category.value
    const l = !level.value || c.level === level.value
    const d = !duration.value || c.duration == duration.value
    const p = !price.value || c.price <= price.value
    return k && cat && l && d && p
  })
}

 function goDetail(id) {
  router.push(`/courses/detail/${id}`)
}

function goBooking(id) {
  router.push({
    path: '/courses/booking',
    query: { id }
  })
}
</script>


<template>
  <div class="page-wrapper">
    <div class="content-wrapper">
      <h2 class="fw-bold text-center mb-1">課程 / 教練搜尋</h2>
      <p class="text-center text-muted mb-4">
         目前場館：{{ city }} · {{ venue }}
      </p>

      
      <div class="tab-bar">
        <div
          class="tab-item"
          :class="{ active: tab === 'course' }"
          @click="tab = 'course'"
        >
          找課程
        </div>
        <div
          class="tab-item"
          :class="{ active: tab === 'coach' }"
          @click="tab = 'coach'"
        >
          找教練
        </div>
      </div>

      
   <div class="filter-panel">
  <div class="filter-keyword">
    <input
      v-model="keyword"
      class="form-control"
      placeholder="輸入課程關鍵字（例如：瑜珈、重訓）"
    />
  </div>

 
  <div class="filter-row">
    <select v-model="category" class="form-select">
      <option value="">類別</option>
      <option value="瑜珈">瑜珈</option>
      <option value="重訓">重訓</option>
      <option value="有氧">有氧</option>
      <option value="核心">核心</option>
    </select>

    <select v-model="duration" class="form-select">
      <option value="">時長</option>
      <option value="45">45 分鐘</option>
      <option value="60">60 分鐘</option>
      <option value="90">90 分鐘</option>
    </select>

    <select v-model="level" class="form-select">
      <option value="">難度</option>
      <option value="初級">初級</option>
      <option value="中級">中級</option>
      <option value="高級">高級</option>
    </select>

    <select v-model="price" class="form-select">
      <option value="">價格</option>
      <option value="400">400 以下</option>
      <option value="500">500 以下</option>
      <option value="600">600 以下</option>
    </select>
  </div>
</div>


   
      <div v-if="tab === 'course'" class="row g-4 mt-3">
        <div class="col-md-4" v-for="c in filteredCourses()" :key="c.id">
          <div class="course-card">
            <div class="card-img">課程圖片</div>

            <div class="card-body">
              <div class="card-header">
                <h5>{{ c.title }}</h5>
                <span class="level-tag">{{ c.level }}</span>
              </div>

              <p>教練：{{ c.coach }}</p>
              <p>時長：{{ c.duration }} 分鐘</p>
              <p>價格：NT$ {{ c.price }}</p>

              <div class="btn-group">
                <button class="detail-btn" @click="goDetail(c.id)">查看課程</button>
                <button class="book-btn" @click="goBooking(c.id)">
                  立即預約
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <div v-if="tab === 'coach'" class="row g-4 mt-3">
        <div class="col-md-4" v-for="c in fakeCoaches" :key="c.id">
          <div class="course-card">
            <div class="card-img">教練圖片</div>
            <div class="card-body text-center">
              <h5>{{ c.name }}</h5>
              <p>{{ c.specialty }}</p>
              <button class="book-btn" @click="goBooking(c.id)">
                查看課程
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.tab-bar {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.tab-item {
  padding: 8px 4px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #2563eb;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -13px;
  width: 100%;
  height: 3px;
  background: #2563eb;
}

.filter-panel {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
}
.filter-keyword {
  margin-bottom: 10px;
}

.filter-keyword input {
  height: 44px;
  font-size: 15px;
}

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr;
  gap: 10px;
}

.course-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-img {
  height: 100px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.card-body {
  padding: 12px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.level-tag {
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 6px;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.detail-btn {
  background: #f3f4f6;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.book-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
</style>
