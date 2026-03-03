<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
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
// ===== pagination (每頁 6 筆) =====
const PAGE_SIZE = 6
const courseListRef = ref(null)
// 課程分頁
const coursePage = ref(1)
const courseTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredCourses.value.length / PAGE_SIZE))
)
const pagedCourses = computed(() => {
  const start = (coursePage.value - 1) * PAGE_SIZE
  return filteredCourses.value.slice(start, start + PAGE_SIZE)
})

async function changeCoursePage(p) {
  if (p < 1 || p > courseTotalPages.value) return

  coursePage.value = p

  // 等 DOM 更新
  await nextTick()

  const el = courseListRef.value
  if (!el) return

  // 抓 header 高度（假設你的 header class 是 .page-header）
  const header = document.querySelector('.page-header')
  const headerHeight = header ? header.offsetHeight : 0

  const top =
    el.getBoundingClientRect().top +
    window.pageYOffset -
    headerHeight -
    20   // 額外留一點空間

  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

// ===== coaches =====
const coaches = ref([])
const coachesLoading = ref(false)
const coachesLoaded = ref(false)
const coachPlaceholders = [
  
  'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  'https://images.unsplash.com/photo-1619361728853-2542f3864532?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',


  'https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',


 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',


  'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]
const coachImageResolved = (c) => {
  const real = coachImage(c)
  if (real) return real
  const id = coachId(c) || 0
  return coachPlaceholders[id % coachPlaceholders.length]
}

const courseName = (c) => c?.name ?? c?.CourseName ?? ''
const courseId = (c) => c?.id ?? c?.courseId ?? c?.CourseId ?? c?.courseId ?? 0
const courseCategoryId = (c) => c?.categoryId ?? c?.CategoryId ?? 0
const courseLevel = (c) => c?.courseLevel ?? c?.CourseLevel ?? ''
const courseDuration = (c) => c?.duration ?? c?.Duration ?? 0
const coursePrice = (c) => c?.price ?? c?.Price ?? 0
const courseImageUrl = (c) => c?.imageUrl ?? c?.ImageUrl ?? ''

const catId = (x) => x?.id ?? x?.categoryId ?? x?.CategoryId ?? 0
const catName = (x) => x?.name ?? x?.categoryName ?? x?.CategoryName ?? ''

const coachId = (c) => c?.coachId ?? c?.CoachId ?? c?.id ?? 0
const coachName = (c) => c?.name ?? c?.Name ?? ''
const coachDesc = (c) => c?.description ?? c?.Description ?? c?.descrition ?? c?.Descrition ?? ''
const coachRate = (c) => c?.hourlyRate ?? c?.HourlyRate ?? null
const coachSkills = (c) => c?.skills ?? c?.Skills ?? []
const coachImage = (c) => c?.imageUrl ?? c?.ImageUrl ?? ''
// ===== coach filters =====
const coachKeyword = ref('')
const coachMaxPrice = ref('')    // 例如 800/1000/1200
const coachSkill = ref('')      

const coachSkillOptions = computed(() => {
  const set = new Set()
  coaches.value.forEach(c => {
    ;(coachSkills(c) || []).forEach(s => set.add(s))
  })
  return Array.from(set)
})

// 篩選後教練
const filteredCoaches = computed(() => {
  const kw = coachKeyword.value.trim()
  const maxP = coachMaxPrice.value ? Number(coachMaxPrice.value) : null
  const skill = coachSkill.value

  return coaches.value.filter(c => {
    const name = coachName(c)
    const desc = coachDesc(c)
    const rate = Number(coachRate(c) ?? 0)
    const skills = coachSkills(c) || []

    const okKw = !kw || name.includes(kw) || desc.includes(kw) || skills.some(s => s.includes(kw))
    const okPrice = !maxP || rate <= maxP
    const okSkill = !skill || skills.includes(skill)

    return okKw && okPrice && okSkill
  })
})

function resetCoachFilters() {
  coachKeyword.value = ''
  coachMaxPrice.value = ''
  coachSkill.value = ''
}

watch([keyword, selectedCategoryId, level, duration, price], () => {
  coursePage.value = 1
})

watch(tab, () => {
  coursePage.value = 1
})
// ===== init (courses + categories) =====
onMounted(async () => {
  try {
    if (!city || !venue) return

    const courseRes = await api.get('/CCourses/search', { params: { city, venue } })
    courses.value = courseRes.data?.courses || []
    cityName.value = courseRes.data?.city?.name || city
    venueName.value = courseRes.data?.venue?.name || venue

    const catRes = await api.get('/CCourseCategories')
    categories.value = catRes.data || []
  } catch (err) {
    console.error('初始化失敗', err)
  }
})

// ===== courses filter =====
const filteredCourses = computed(() => {
  return courses.value.filter((c) => {
    const name = courseName(c)
    const k = !keyword.value || name.includes(keyword.value)

    const cat =
      !selectedCategoryId.value || courseCategoryId(c) === Number(selectedCategoryId.value)

    const lvl = !level.value || courseLevel(c) === level.value

    const d = !duration.value || String(courseDuration(c)) === String(duration.value)

    const p = !price.value || Number(coursePrice(c)) <= Number(price.value)

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
    params: { slug: courseName(course) },
  })
}

function goBooking(course) {
  router.push({
    name: 'courses-booking',
    params: { slug: courseName(course) },
  })
}

// ===== fetch coaches (切到 coach 才抓) =====
async function fetchCoaches() {
  coachesLoading.value = true
  try {
    // 如果你後端目前只有 GET /api/coaches（可選 venueId），先不帶參數也能看到資料
    const res = await api.get('/coaches')
    coaches.value = res.data || []
    coachesLoaded.value = true
  } catch (err) {
    console.error('載入教練失敗', err)
    coaches.value = []
    coachesLoaded.value = true
  } finally {
    coachesLoading.value = false
  }
}

watch(
  tab,
  (v) => {
    if (v === 'coach' && !coachesLoaded.value) fetchCoaches()
  },
  { immediate: true }
)
</script>

<template>
  <div class="page-wrapper">
    <!-- ================= Header ================= -->
    <div class="page-header">
      <div class="header-bg"></div>

      <div class="content-wrapper header-inner">
        <h2 class="page-title">課程與教練一站式搜尋</h2>

        <div class="header-center">
          <p class="page-subtitle">
            <i class="bi bi-geo-alt"></i>
            目前場館：{{ cityName }} · {{ venueName }}
          </p>

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
      <!-- ================= 課程 ================= -->
      <template v-if="tab === 'course'">
        <!-- 類別快速標籤 -->
        <div class="quick-tags">
          <div class="tags-left">
            <span
              :class="{ active: !selectedCategoryId }"
              @click="selectedCategoryId = ''"
            >
              全部
            </span>

            <span
              v-for="c in categories"
              :key="catId(c)"
              :class="{ active: String(selectedCategoryId) === String(catId(c)) }"
              @click="selectedCategoryId = String(catId(c))"
            >
              {{ catName(c) }}
            </span>
          </div>

          <button class="view-all-btn" @click="resetAll">清空全部</button>
        </div>

        <!-- 篩選 -->
        <div class="filter-panel">
          <div class="filter-keyword">
            <i class="bi bi-search"></i>
            <input
              v-model="keyword"
              class="form-control"
              placeholder="輸入課程關鍵字（例如：重訓、瑜珈）"
            />
          </div>

          <div class="filter-row">
            <select
              v-model="selectedCategoryId"
              class="form-select"
              :class="{ 'has-value': selectedCategoryId }"
            >
              <option value="">類別</option>
              <option
                v-for="c in categories"
                :key="catId(c)"
                :value="String(catId(c))"
              >
                {{ catName(c) }}
              </option>
            </select>

            <select
              v-model="duration"
              class="form-select"
              :class="{ 'has-value': duration }"
            >
              <option value="">時長</option>
              <option value="60">60 分鐘</option>
              <option value="90">90 分鐘</option>
              <option value="120">120 分鐘</option>
            </select>

            <select
              v-model="level"
              class="form-select"
              :class="{ 'has-value': level }"
            >
              <option value="">難度</option>
              <option value="初級">初級</option>
              <option value="中級">中級</option>
              <option value="進階">進階</option>
            </select>

            <select
              v-model="price"
              class="form-select"
              :class="{ 'has-value': price }"
            >
              <option value="">價格</option>
              <option value="500">500 以下</option>
              <option value="1000">1000 以下</option>
              <option value="2000">2000 以下</option>
            </select>
          </div>
        </div>

        <!-- 課程列表 -->
      <div class="row g-4 mt-3" ref="courseListRef">
          <div
            class="col-lg-4 col-md-6"
            v-for="c in pagedCourses"
            :key="courseId(c)"
          >
            <div class="course-card">
              <div class="card-img">
                <img
                  :src="
                    courseImageUrl(c)
                      ? `https://localhost:7218${courseImageUrl(c)}`
                      : 'https://via.placeholder.com/640x360?text=Course'
                  "
                  alt="課程圖片"
                />
              </div>

             

              <div class="card-body">
                <div class="card-header">
                  <h5 class="course-title">{{ courseName(c) }}</h5>
                  <span class="level-tag">{{ courseLevel(c) }}</span>
                </div>

                <div class="course-meta">
                  <div class="meta-row">
                    <i class="bi bi-clock"></i>
                    {{ courseDuration(c) }} 分鐘
                  </div>

                  <div class="meta-row">
                    <i class="bi bi-cash-stack"></i>
                    NT$ {{ coursePrice(c) }}
                  </div>
                </div>

                <div class="course-actions">
                  <button class="btn-outline" @click="goDetail(c)">查看課程</button>
                  <button class="btn-primary" @click="goBooking(c)">
                    立即預約
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

         <!-- 課程分頁 -->
<div v-if="courseTotalPages > 1" class="pagination-wrapper">
  <button
    class="page-btn"
    @click="changeCoursePage(coursePage - 1)"
    :disabled="coursePage === 1"
  >
    上一頁
  </button>

  <button
    v-for="p in courseTotalPages"
    :key="'c' + p"
    @click="changeCoursePage(p)"
    :class="['page-btn', { active: coursePage === p }]"
  >
    {{ p }}
  </button>

  <button
    class="page-btn"
    @click="changeCoursePage(coursePage + 1)"
    :disabled="coursePage === courseTotalPages"
  >
    下一頁
  </button>
</div>
      </template>

      <!-- ================= 教練 ================= -->
      <template v-else-if="tab === 'coach'">
        <!-- 教練篩選區 -->
        <div class="filter-panel">
          <div class="filter-keyword">
            <i class="bi bi-search"></i>
            <input
              v-model="coachKeyword"
              class="form-control"
              placeholder="搜尋教練（姓名 / 描述 / 技能）"
            />
          </div>

          <div class="filter-row">
            <select
              v-model="coachMaxPrice"
              class="form-select"
              :class="{ 'has-value': coachMaxPrice }"
            >
              <option value="">價格（每小時）</option>
              <option value="800">800 以下</option>
              <option value="1000">1000 以下</option>
              <option value="1200">1200 以下</option>
              <option value="1500">1500 以下</option>
            </select>

            <select
              v-model="coachSkill"
              class="form-select"
              :class="{ 'has-value': coachSkill }"
            >
              <option value="">技能</option>
              <option v-for="s in coachSkillOptions" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <button class="view-all-btn" @click="resetCoachFilters">
              清空全部
            </button>
          </div>
        </div>

        <div v-if="coachesLoading" class="text-center text-muted mt-4">
          載入教練中...
        </div>

        <div v-else-if="filteredCoaches.length === 0" class="text-center text-muted mt-4">
          找不到符合條件的教練
        </div>

        <div v-else class="row g-4 mt-3">
          <div
            class="col-lg-4 col-md-6"
            v-for="c in filteredCoaches"
            :key="coachId(c)"
          >
            <div class="coach-card">
              <div class="coach-img">
                <img :src="coachImageResolved(c)" alt="教練圖片" />
                <div class="coach-name">
                  <h4>{{ coachName(c) }}</h4>
                  <span v-if="coachRate(c) !== null">NT$ {{ coachRate(c) }}/hr</span>
                </div>
              </div>

              <div class="coach-body">
                <p class="desc">{{ coachDesc(c) }}</p>

                <div v-if="coachSkills(c)?.length" class="coach-skills">
                  <span class="skill" v-for="s in coachSkills(c)" :key="s">
                    {{ s }}
                  </span>
                </div>

                <div class="actions">
                  <button class="btn-primary">查看教練</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
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

/* ===== Pagination ===== */

.pagination-wrapper {
  display: flex;
  justify-content: center;   /* 置中 */
  align-items: center;
  gap: 8px;
  margin-top: 30px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  color: #555;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #fff3e6;
  border-color: #ff8c2a;
  color: #ff8c2a;
}

.page-btn.active {
  background: #ff8c2a;      /* 橘色 */
  border-color: #ff8c2a;
  color: #fff;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
