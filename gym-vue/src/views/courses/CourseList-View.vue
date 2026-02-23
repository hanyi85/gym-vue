<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'


const router = useRouter()
const route = useRoute()


const api = axios.create({
  baseURL: 'https://localhost:7218/api'
})


const city = decodeURIComponent(route.params.city || route.query.city || '')
const venue = decodeURIComponent(route.params.venue || route.query.venue || '')



const tab = ref('course')


const cityName = ref('')
const venueName = ref('')

const courses = ref([])
const categories = ref([])


const keyword = ref('')
const selectedCategoryId = ref('')   
const level = ref('')
const duration = ref('')
const price = ref('')
const coaches = ref([])


onMounted(async () => {
  try {
    if (!city || !venue) return

    // 課程
    const courseRes = await api.get('/CCourses/search', {
      params: { city, venue }
    })

    courses.value = courseRes.data.courses
    cityName.value = courseRes.data.city.name
    venueName.value = courseRes.data.venue.name

    // 類別
    const catRes = await api.get('/CCourseCategories')
    categories.value = catRes.data
  } catch (err) {
    console.error('初始化失敗', err)
  }
})

/* ================= 篩選後課程 ================= */
const filteredCourses = computed(() => {
  return courses.value.filter(c => {
    
const k =
  !keyword.value ||
  c.name?.includes(keyword.value)

    const cat =
      !selectedCategoryId.value ||
      c.categoryId === Number(selectedCategoryId.value)

    const lvl =
      !level.value ||
      c.courseLevel === level.value

    const d =
      !duration.value ||
      c.duration == duration.value

    const p =
      !price.value ||
      c.price <= price.value

    return k && cat && lvl && d && p
  })
})


function resetAll() {
  keyword.value = ''
  selectedCategoryId.value = ''
  level.value = ''
  duration.value = ''
  price.value = ''
}

function goDetail(course) {
  router.push({
    name: 'courses-detail',
    params: {
      slug: course.name
    }
  })
}

function goBooking(id) {
  router.push({
    path: '/courses/booking',
    query: {
      id,
      city,
      venue
    }
  })
}

</script>


<template>

  <div class="page-wrapper">
<div class="page-header">
  <div class="header-bg"></div>

  <div class="content-wrapper header-inner">
    <h2 class="page-title">課程與教練一站式搜尋</h2>

<div class="header-center">
    <p class="page-subtitle">
      <i class="bi bi-geo-alt"></i>
      目前場館：{{ cityName }} · {{ venueName }}
    </p>

    <!-- 統計泡泡
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
    </div> -->

    <!-- 找課程 / 找教練 -->
    <div class="pill-tabs">
      <button
        class="pill"
        :class="{ active: tab === 'course' }"
        @click="tab = 'course'"
      >
        找課程
      </button>
      <button
        class="pill"
        :class="{ active: tab === 'coach' }"
        @click="tab = 'coach'"
      >
        找教練
      </button>
    </div>
  </div>
</div>
</div>
    <!-- ================= Content ================= -->
    <div class="content-wrapper">

      <!-- ===== 類別快速標籤 ===== -->
      <div class="quick-tags" v-if="tab === 'course'">
        <div class="tags-left">
          <span
            :class="{ active: !selectedCategoryId }"
            @click="selectedCategoryId = ''"
          >
            全部
          </span>

          <span
            v-for="c in categories"
            :key="c.id"
            :class="{ active: selectedCategoryId === c.id }"
            @click="selectedCategoryId = c.id"
          >
            {{ c.name }}
          </span>
        </div>

        <button class="view-all-btn" @click="resetAll">
          清空全部
        </button>
      </div>

      <!-- ===== 篩選區 ===== -->
      <div class="filter-panel" v-if="tab === 'course'">
        <div class="filter-keyword">
          <i class="bi bi-search"></i>
          <input
            v-model="keyword"
            class="form-control"
            placeholder="輸入課程關鍵字（例如：重訓、瑜珈）"
          />
        </div>

        <div class="filter-row">
          <select v-model="selectedCategoryId" class="form-select" :class="{ 'has-value': selectedCategoryId }" >
            <option value="">類別</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>

          <select v-model="duration" class="form-select" :class="{ 'has-value': duration }">
            <option value="">時長</option>
            <option value="60">60 分鐘</option>
            <option value="90">90 分鐘</option>
            <option value="120">120 分鐘</option>
          </select>

          <select v-model="level" class="form-select"  :class="{ 'has-value': level }">
            <option value="">難度</option>
            <option value="初級">初級</option>
            <option value="中級">中級</option>
            <option value="進階">進階</option>
          </select>

          <select v-model="price" class="form-select"  :class="{ 'has-value': price }"
>
            <option value="">價格</option>
            <option value="500">500 以下</option>
            <option value="1000">1000 以下</option>
            <option value="2000">2000 以下</option>
          </select>
        </div>
      </div>

   
     <div v-if="tab === 'course'" class="row g-4 mt-3">
  <div
    class="col-lg-4 col-md-6"
    v-for="c in filteredCourses"
    :key="c.id"
  >
    <div class="course-card">
      <!-- 圖片區 -->
      <div class="card-img">
        <img
          :src="`https://localhost:7218${c.imageUrl}`"
          alt="課程圖片"
        />
    
      </div>

      <!-- 內容區 -->
       <div class="card-body">
     <div class="card-header">
  <h5 class="course-title">
    {{ c.name }}
  </h5>

  <span class="level-tag">
    {{ c.courseLevel }}
  </span>
</div>
        <div class="course-meta">
          <div class="meta-row">
            <i class="bi bi-clock"></i>
            {{ c.duration }} 分鐘
          </div>

          <div class="meta-row">
            <i class="bi bi-cash-stack"></i>
            NT$ {{ c.price }}
          </div>
        </div>

        <div class="course-actions">
          <button class="btn-outline" @click="goDetail(c)">
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
<!-- ================= 教練 ================= -->
<div v-if="tab === 'coach'" class="row g-4 mt-3">
  <div class="col-lg-4 col-md-6" v-for="c in coaches" :key="c.id">
    <div class="coach-card">
      <div class="coach-img">
        <img :src="c.imageUrl" />
        <div class="coach-name">
          <h4>{{ c.name }}</h4>
          <span>{{ c.specialty }}</span>
        </div>
      </div>

      <div class="coach-body">
        <div class="coach-meta">
          <span class="rating">⭐ {{ c.rating }}</span>
          <span>{{ c.experience }} 年經驗</span>
        </div>

        <p class="desc">{{ c.description }}</p>

        <div class="actions">
          <button class="btn-primary">
            查看教練
          </button>
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
  position: relative;
  padding: 46px 20px 28px;  
  background: linear-gradient(
    180deg,
    #fff7ed 0%,
    #ffedd5 40%,
    #ffffff 100%
  );
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 22px;      
  padding: 28px 20px 22px;  
  text-align: center;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.10); 
}

.page-title {
  font-size: 38px;
  font-weight: 900;
  letter-spacing: 0.04em;
  margin-bottom: 14px;

  background: linear-gradient(135deg, #ea580c, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  
  width: fit-content;
  margin: 0 auto 16px;  

  padding: 6px 14px;
  border-radius: 999px;
  background: #f3f4f6;

  font-size: 13px;
  color: #475569;
}

/* ===== 統計泡泡 
.stats-bubbles {
  display: flex;
  justify-content: center;
  gap: 22px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}

.bubble {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 18px 40px rgba(0,0,0,.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bubble-num {
  font-size: 15px;
  font-weight: 900;
  color: #f97316;
}

.bubble-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}===== */

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
/* ===== Pill Tabs ===== */
.pill-tabs {
  display: inline-flex;            
  justify-content: center;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 14px 34px rgba(0,0,0,.14);

  width: fit-content;              
  margin: 0 auto;                 
}

.pill {
  border: none;
  background: transparent;
  padding: 12px 34px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  color: #6b7280;
  cursor: pointer;
  transition: all .25s ease;
}

.pill.active {
  background: linear-gradient(135deg, #ff8a00, #ff6a00);
  color: #fff;
  box-shadow: 0 6px 18px rgba(255,122,0,.45);
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
.course-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.card-img {
  height: 220px;
 
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
