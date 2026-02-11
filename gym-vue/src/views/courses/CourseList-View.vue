<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tab = ref('course')
const city = route.query.city || '台北市'
const venue = route.query.venue || '信義館'

const keyword = ref('')
const category = ref('')
const duration = ref('')
const level = ref('')
const price = ref('')

const fakeCourses = [
  { id: 1, title: '瑜珈基礎課程', category: '瑜珈', coach: '張老師', level: '初級', duration: 60, price: 400,maxPeople: 12 ,remain: 4},
  { id: 2, title: '重量訓練入門', category: '重訓', coach: '李教練', level: '中級', duration: 60, price: 500, maxPeople: 8 },
  { id: 3, title: '燃脂 HIIT', category: '有氧', coach: 'Amy', level: '中級', duration: 45, price: 450 , maxPeople: 20},
  { id: 4, title: '核心訓練', category: '核心', coach: 'John', level: '初級', duration: 45, price: 450, maxPeople: 10},
  { id: 5, title: '瑜珈伸展', category: '瑜珈', coach: 'Linda', level: '初級', duration: 60, price: 400 , maxPeople: 12},
  { id: 6, title: '進階重訓', category: '重訓', coach: 'Mike', level: '高級', duration: 90, price: 600, maxPeople: 15}
]

const coaches = [
  {
    id: 1,
    name: 'Alex',
    title: '重量訓練專家',
    rating: 4.9,
    reviews: 127,
    years: 8,
    desc: '專注於重量訓練與肌肉增長，曾指導多位健美選手獲得佳績。',
    certs: ['NASM-CPT', 'CSCS'],
    time: '週一至週五 14:00-21:00',
    image:
      'https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: 'Annie',
    title: '瑜珈導師',
    rating: 4.8,
    reviews: 98,
    years: 6,
    desc: '擁有國際瑜珈聯盟認證，專精哈達瑜珈與流動瑜珈。',
    certs: ['RYT-500', 'E-RYT'],
    time: '週二、週四、週六 09:00-18:00',
    image:
      'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'John',
    title: '有氧運動教練',
    rating: 4.7,
    reviews: 85,
    years: 5,
    desc: '高能量教學風格深受學員喜愛，擅長燃脂 HIIT。',
    certs: ['ACE-CPT', 'Spinning'],
    time: '週二至週五 06:00-12:00、18:00-21:00',
    image:
      'https://images.unsplash.com/photo-1619361728853-2542f3864532?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
]

const fakeCourseImages = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
  'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
]

const filteredCourses = computed(() => {
  return fakeCourses.filter((c) => {
    const k = !keyword.value || c.title.includes(keyword.value)
    const cat = !category.value || c.category === category.value
    const l = !level.value || c.level === level.value
    const d = !duration.value || c.duration == duration.value
    const p = !price.value || c.price <= price.value
    return k && cat && l && d && p
  })
})

function resetAll() {
  keyword.value = ''
  category.value = ''
  level.value = ''
  duration.value = ''
  price.value = ''
}

function goDetail(id) {
  router.push(`/courses/detail/${id}`)
}

function goCoachDetail(id) {
  router.push(`/courses/coach-detail/${id}`)
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
   
    <div class="page-header">
      <div class="content-wrapper header-inner">
        <h2 class="page-title">課程 / 教練搜尋</h2>

        <p class="page-subtitle">
          <i class="bi bi-geo-alt"></i>
          目前場館：{{ city }} · {{ venue }}
        </p>

        <div class="stats-bubbles">
          <div class="bubble">
            <div class="bubble-num">10k+</div>
            <div class="bubble-label">活躍會員</div>
          </div>
          <div class="bubble">
            <div class="bubble-num">50+</div>
            <div class="bubble-label">專業教練</div>
          </div>
          <div class="bubble">
            <div class="bubble-num">200+</div>
            <div class="bubble-label">精選課程</div>
          </div>
          <div class="bubble">
            <div class="bubble-num">95%</div>
            <div class="bubble-label">滿意度</div>
          </div>
        </div>

        <div class="pill-tabs">
          <button class="pill" :class="{ active: tab === 'course' }" @click="tab = 'course'">
            找課程
          </button>
          <button class="pill" :class="{ active: tab === 'coach' }" @click="tab = 'coach'">
            找教練
          </button>
        </div>
      </div>
    </div>

    
    <div class="content-wrapper">
    
      <div class="quick-tags" v-if="tab === 'course'">
        <div class="tags-left">
          <span :class="{ active: !category && !level }" @click="(category = ''), (level = '')">全部</span>
          <span :class="{ active: category === '瑜珈' }" @click="category = '瑜珈'">瑜珈</span>
          <span :class="{ active: category === '重訓' }" @click="category = '重訓'">重訓</span>
          <span :class="{ active: category === '有氧' }" @click="category = '有氧'">燃脂</span>
          <span :class="{ active: level === '初級' }" @click="level = '初級'">新手友善</span>
        </div>

        <button class="view-all-btn" @click="resetAll">清空全部</button>
      </div>


      <div class="filter-panel" v-if="tab === 'course'">
        <div class="filter-keyword">
          <i class="bi bi-search"></i>
          <input v-model="keyword" class="form-control" placeholder="輸入課程關鍵字（例如：瑜珈、重訓）" />
        </div>

        <div class="filter-row">
          <select v-model="category" class="form-select"  :class="{ 'has-value': category }">
            <option value="">類別</option>
            <option value="瑜珈">瑜珈</option>
            <option value="重訓">重訓</option>
            <option value="有氧">有氧</option>
            <option value="核心">核心</option>
          </select>

          <select v-model="duration" class="form-select"  :class="{ 'has-value': duration }">
            <option value="">時長</option>
            <option value="45">45 分鐘</option>
            <option value="60">60 分鐘</option>
            <option value="90">90 分鐘</option>
          </select>

          <select v-model="level" class="form-select" :class="{ 'has-value': level }">
            <option value="">難度</option>
            <option value="初級">初級</option>
            <option value="中級">中級</option>
            <option value="高級">高級</option>
          </select>

          <select v-model="price" class="form-select" :class="{ 'has-value': price }">
            <option value="">價格</option>
            <option value="400">400 以下</option>
            <option value="500">500 以下</option>
            <option value="600">600 以下</option>
          </select>
        </div>
      </div>

      <div v-if="tab === 'course'" class="row g-4 mt-3">
        <div class="col-md-4" v-for="(c, i) in filteredCourses" :key="c.id">
          <div class="course-card">
            <div class="card-img">
              <img :src="fakeCourseImages[i % fakeCourseImages.length]" />
            </div>

            <div class="card-body">
              <div class="card-header">
                <h5 class="mb-0">{{ c.title }}</h5>
                <span class="level-tag">{{ c.level }}</span>
              </div>

             <div class="course-meta">
                <div class="meta-row">
                  <span><i class="bi bi-person"></i> {{ c.coach }}</span>
                  
                </div>
  <div class="meta-row">
    <span><i class="bi bi-clock"></i> {{ c.duration }} 分鐘</span>
    
  </div>
  <div class="meta-row">
    <span>
      <i class="bi bi-people"></i>
      最多 {{ c.maxPeople }} 人
    </span>

  </div>
  <div class="meta-row">
 <span><i class="bi bi-cash-stack"></i> NT$ {{ c.price }}</span> 
</div>
</div>





<div class="course-actions">
  <button class="btn-outline" @click="goDetail(c.id)">
    查看課程
  </button>

  <button class="btn-primary" @click="goBooking(c.id)">
    立即預約
  </button>
</div>

            </div>
          </div>
        </div>
      </div>

    
      <div v-if="tab === 'coach'" class="row g-4 mt-3">
        <div class="col-lg-4 col-md-6"  v-for="c in coaches" :key="c.id">
          <div class="coach-card">
            <div class="coach-img">
              <img :src="c.image" />
              <div class="coach-name">
                <h4>{{ c.name }}</h4>
                <span>{{ c.title }}</span>
              </div>
            </div>

            <div class="coach-body">
             <div class="coach-meta">
  <span class="rating">⭐ {{ c.rating }}（{{ c.reviews }} 則評價）</span>
  <span class="exp">{{ c.years }} 年經驗</span>
</div>

              <p class="desc">{{ c.desc }}</p>

              <div class="certs">
                <span v-for="cert in c.certs" :key="cert">{{ cert }}</span>
              </div>

              <div class="time"><i class="bi bi-clock"></i> {{ c.time }}</div>
             <div class="course-actions">
  <button class="btn-outline" @click="goCoachDetail(c.id)">
    查看課程
  </button>

  <button class="btn-primary" @click="goBooking(c.id)">
    立即預約
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
 
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  
}

.page-header {
  padding: 40px 0 28px;
 
}


.header-inner {
  text-align: center;
}
.page-title {
   font-size: 32px;        
  font-weight: 900;       
  color: #000000;         
  letter-spacing: 0.02em; 
  margin: 0 0 10px;
  text-shadow: 0 1px 0 rgba(0,0,0,.04);
}

.page-subtitle {
  margin: 0 0 22px;
  font-size: 13px;
  color: #6b7280;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}


.stats-bubbles {
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.bubble {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bubble-num {
  font-size: 13px;
  font-weight: 800;
  color: #f97316;
  line-height: 1.1;
}

.bubble-label {
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
}


.pill-tabs {
  display: inline-flex;
  background: #fff;
  border-radius: 999px;
  padding: 6px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.08);
}

.pill {
  border: none;
  background: transparent;
  padding: 10px 26px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  transition: 0.2s;
}

.pill.active {
 background: linear-gradient(135deg, #ff8a00, #ff6a00);
  color: #fff;
  
}


.quick-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 18px 0 14px;
}

.tags-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.quick-tags span {
  background: #f1f5f9; 
 color: #475569;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.quick-tags span:hover {
  background: #e2e8f0;
}


.quick-tags span.active {
  background: linear-gradient(135deg, #ff8a00, #ff6a00);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255, 122, 0, .35);
}

.view-all-btn {
  background-color: #e5e7eb;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.view-all-btn:hover {
background: #d1d5db;
 
}


.filter-panel {
  border-radius: 16px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.filter-keyword {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border-radius: 999px;
  padding: 10px 14px;
  margin-bottom: 12px;
}

.filter-keyword input {
  border: none;
  background: transparent;
  outline: none;
  height: 36px;
  font-size: 14px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.filter-row .form-select {
   color: #9ca3af;   
  height: 44px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.filter-row .form-select.has-value {
  color: #111827;
}

.course-card {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eef2f7;
  height: 100%;
  display: flex;
  flex-direction: column;
 box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;

  transition: transform .25s ease, box-shadow .25s ease;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.18);
}

.card-img {
  height: 180px;
  overflow: hidden;
  border-radius: 14px 14px 0 0;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 12px;
  font-size: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.card-header h5 {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.level-tag {
  border: 1px solid #2563eb;
  color: #2563eb;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 8px;
  white-space: nowrap;
}
.course-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 10px;
  font-size: 13px;
  color: #475569;
}

.meta-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}

.meta-row i {
  margin-right: 4px;
  color: #64748b;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.course-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.btn-outline {
  flex: 1;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  cursor: pointer;
  transition: all .2s ease;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}


.btn-primary {
  flex: 1;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff8a00, #ff6a00);
  border: none;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: all .2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);

}


.coach-card {
 background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,.12);
  transition: .3s;
}

.coach-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 70px rgba(0,0,0,.18);
}

.coach-img {
  position: relative;
height: 340px;  
  overflow: hidden;
}

.coach-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top; 
}

.coach-name {
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

.coach-name h4 {
 font-size: 22px;
  font-weight: 900;
  margin-bottom: 2px;
}


.coach-name span {
  font-size: 14px;
  opacity: .9;
}

.coach-body {
  padding: 16px;
  font-size: 14px;
}
.coach-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  margin: 12px 0;
  color: #374151;
}

.coach-meta .rating {
  color: #f59e0b;
}

.desc {
  margin: 10px 0;
  color: #555;
}

.certs span {
  display: inline-block;
  background: #eef2ff;
  color: #334155;
  border-radius: 999px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 6px;
}

.time {
  margin: 10px 0;
  color: #444;
}

.actions {
  margin-top: 10px;
}

:deep(main),
:deep(.main),
:deep(#app) {
  background: #f8fafc !important;
}
</style>
