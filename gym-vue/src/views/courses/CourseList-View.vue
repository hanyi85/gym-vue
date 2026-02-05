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


const coaches  = [
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
    image: 'https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
    image: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
    image: 'https://images.unsplash.com/photo-1619361728853-2542f3864532?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
  
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

const fakeCourseImages = [
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
  "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
  "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
]


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
<div class="search-stats">
  <div>
    <strong>10,000+</strong>
    <span>活躍會員</span>
  </div>
  <div>
    <strong>50+</strong>
    <span>專業教練</span>
  </div>
  <div>
    <strong>200+</strong>
    <span>精選課程</span>
  </div>
  <div>
    <strong>95%</strong>
    <span>滿意度</span>
  </div>
</div>

      
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

     <div class="quick-tags">
  <div class="tags-left">
    <span @click="category='瑜珈'">瑜珈</span>
    <span @click="category='重訓'">重訓</span>
    <span @click="category='有氧'">燃脂</span>
    <span @click="level='初級'">新手友善</span>
  </div>

  <button class="view-all-btn"
    @click="keyword='';category='';level='';duration='';price=''">
    查看全部
  </button>
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
  <div
    class="col-md-4"
    v-for="(c, i) in filteredCourses()"
    :key="c.id"
  >
    <div class="course-card">
      <div class="card-img">
        <img :src="fakeCourseImages[i % fakeCourseImages.length]" />
      
      </div>

      <div class="card-body">
        <div class="card-header">
          <h5>{{ c.title }}</h5>
          <span class="level-tag">{{ c.level }}</span>
        </div>

        <p>教練：{{ c.coach }}</p>
        <p>時長：{{ c.duration }} 分鐘</p>
        <p>價格：NT$ {{ c.price }}</p>

        <div class="btn-group">
          <button class="detail-btn" @click="goDetail(c.id)">
            查看課程
          </button>
          <button class="book-btn" @click="goBooking(c.id)">
            立即預約
          </button>
        </div>
      </div>
    </div>
  </div>
</div>


   <div v-if="tab === 'coach'" class="row g-4 mt-3">
  <div class="col-md-4" v-for="c in coaches" :key="c.id">
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
          ⭐ {{ c.rating }} ({{ c.reviews }})
          <span>👤 {{ c.years }} 年經驗</span>
        </div>

        <p class="desc">{{ c.desc }}</p>

        <div class="certs">
          <span v-for="cert in c.certs" :key="cert">{{ cert }}</span>
        </div>

        <div class="time">
          🗓 {{ c.time }}
        </div>

        <div class="actions">
          <button class="btn-outline">查看詳情</button>
          <button class="btn-primary">預約 ></button>
        </div>
      </div>
    </div>
  </div>
</div>


    </div>
  </div>
</template>

<style scoped>
.course-hero {
  padding: 100px 20px;
  text-align: center;
  background: linear-gradient(135deg, #e0ecff, #f8fbff);
}

.course-hero__title {
  font-size: 48px;
  font-weight: 800;
}

.page-wrapper {
  margin-top: 100px;
  padding-bottom: 80px;
}


.page-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #3b82f6, #a855f7);
}


.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.quick-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.quick-tags span {
  background: #eef2ff;
  color: #2563eb;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: .2s;
}

.quick-tags span:hover {
  background: #2563eb;
  color: #fff;
}

.tab-bar {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}
.tags-left {
  display: flex;
  gap: 12px;
}

.view-all-btn {
  background: linear-gradient(135deg,#3b82f6,#1d0dfa);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: .2s;
}

.view-all-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,.25);
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
  height: 180px;
  overflow: hidden;
  position: relative;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #3b82f6;
  color: white;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
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

.search-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0 30px;
}

.search-stats div {
  text-align: center;
}

.search-stats strong {
  font-size: 20px;
  font-weight: 800;
  color: #2563eb;
}

.search-stats span {
  display: block;
  font-size: 13px;
  color: #6b7280;
}
.coach-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transition: .3s;
  display: flex;
  flex-direction: column;
  
}


.coach-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 45px rgba(0,0,0,.2);
}

.coach-img {
  position: relative;
    flex: 0 0 55%;
  height: auto;
  overflow: hidden;
}

.coach-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.coach-name {
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,.6);
}

.coach-name h4 {
  margin: 0;
  font-weight: 700;
}

.coach-body {
  padding: 16px;
  font-size: 14px;
}

.coach-meta {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.desc {
  margin: 10px 0;
  color: #555;
}

.certs span {
  display: inline-block;
  background: #eef2ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  margin-right: 6px;
}

.time {
  margin: 10px 0;
  color: #444;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-outline {
  flex: 1;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}

.btn-primary {
  flex: 1;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
}
.coach-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transition: .3s;
}

.coach-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 45px rgba(0,0,0,.2);
}

.coach-img {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.coach-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.coach-name {
  position: absolute;
  bottom: 12px;
  left: 12px;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,.6);
}

.coach-name h4 {
  margin: 0;
  font-weight: 700;
}

.coach-body {
  padding: 16px;
  font-size: 14px;
}

.coach-meta {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.desc {
  margin: 10px 0;
  color: #555;
}

.certs span {
  display: inline-block;
  background: #eef2ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  margin-right: 6px;
}

.time {
  margin: 10px 0;
  color: #444;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-outline {
  flex: 1;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}

.btn-primary {
  flex: 1;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
}
</style>
