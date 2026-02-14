<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Banner from '@/components/banner.vue'
import axios from 'axios'

const router = useRouter()

const city = ref('')
const venue = ref('')

const cities = ref([])   // CityDto[]
const venues = ref([])   // VenueDto[]

const api = axios.create({
  baseURL: 'https://localhost:7218/api' 
})



onMounted(async () => {
  const res = await api.get('/CCities')
  cities.value = res.data
})

watch(city, async (newCityId) => {
  venue.value = ''
  venues.value = []

  if (!newCityId) return

  const res = await api.get('/CVenues', {
    params: { cityId: newCityId }
  })
  venues.value = res.data
})


function goSearch() {
  const selectedCity = cities.value.find(c => c.CityId === city.value)
  const selectedVenue = venues.value.find(v => v.VenueId === venue.value)

  if (!selectedCity || !selectedVenue) return

  router.push({
    name: 'courses-list',
    params: {
      city: selectedCity.CityName,
      venue: selectedVenue.VenueName
    }
  })
}

</script>


<template>
  <Banner
    title="課程專區"
    subtitle="找出最適合您的健身課程，開啟進化之旅"
  />

 
<section class="search-section">
  <div class="search-card">
    <div class="search-title">
      <i class="bi bi-geo-alt-fill"></i>
      搜尋場館
    </div>

   
    <div class="search-row">
      <div class="search-group">
        <label>選擇城市</label>
       <select v-model="city" class="search-select">
  <option value="">所有城市</option>
  <option
    v-for="c in cities"
    :key="c.CityId"
    :value="c.CityId"
  >
    {{ c.CityName }}
  </option>
</select>

      </div>

      <div class="search-group">
        <label>選擇場館</label>
        <select
  v-model="venue"
  class="search-select"
  :disabled="!city"
>
  <option value="">所有場館</option>
  <option
    v-for="v in venues"
    :key="v.VenueId"
    :value="v.VenueId"
  >
    {{ v.VenueName }}
  </option>
</select>

      </div>

      <button
        class="search-btn"
        @click="goSearch"
        :disabled="!city || !venue"
      >
        <i class="bi bi-search"></i>
        立即搜尋
      </button>
    </div>
  </div>
</section>

<section class="stats">
    <div class="stat">
      <i class="bi bi-people"></i>
      <div class="num">10,000+</div>
      <div class="label">活躍會員</div>
    </div>
    <div class="stat">
      <i class="bi bi-award"></i>
      <div class="num">50+</div>
      <div class="label">專業教練</div>
    </div>
    <div class="stat">
      <i class="bi bi-bullseye"></i>
      <div class="num">200+</div>
      <div class="label">精選課程</div>
    </div>
    <div class="stat">
      <i class="bi bi-graph-up"></i>
      <div class="num">95%</div>
      <div class="label">滿意度</div>
    </div>
  </section>

  <section class="why-section">
    <div class="why-header">
      <h3>為什麼選擇我們？</h3>
     
    </div>

    <div class="why-grid">
      <div class="why-card purple">
        <div class="icon"><i class="bi bi-calendar"></i></div>
        <h4>彈性預約</h4>
        <p>24 小時線上預約，隨時安排您的運動計畫</p>
      </div>

      <div class="why-card lavender">
        <div class="icon"><i class="bi bi-mortarboard"></i></div>
        <h4>專業師資</h4>
        <p>國際認證教練，提供最專業的指導</p>
      </div>

      <div class="why-card orange">
        <div class="icon"><i class="bi bi-people"></i></div>
        <h4>多元課程</h4>
        <p>瑜珈、重訓、HIIT 滿足不同需求</p>
      </div>

      <div class="why-card green">
        <div class="icon"><i class="bi bi-star"></i></div>
        <h4>頂級設備</h4>
        <p>舒適空間與高品質健身器材</p>
      </div>
    </div>
  </section>


  <section class="hot-section">
    <div class="hot-header">
      <h3>精選熱門課程</h3>
   
    </div>

    <div class="hot-list">
      <div class="hot-card">
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800" />
        <div class="hot-body">
          <span class="tag blue">瑜珈身心</span>
          <h4>基礎哈達瑜珈</h4>
        </div>
      </div>

      <div class="hot-card">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" />
        <div class="hot-body">
          <span class="tag orange">高強度</span>
          <h4>核心燃脂 HIIT</h4>
        </div>
      </div>
      <div class="hot-card">
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800" />
        <div class="hot-body">
          <span class="tag blue">瑜珈身心</span>
          <h4>基礎哈達瑜珈</h4>
        </div>
    </div>
    </div>
  </section>
</template>


<style scoped>

.search-card {
  background: #fff;
  border-radius: 28px;
  padding: 32px 36px;
  max-width: 720px;
  margin: 0 auto;
  box-shadow: 0 30px 60px rgba(0,0,0,.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.search-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.search-row .search-select {
  width: 100%;
}

.search-row .search-btn {
  margin-top: 22px; 
  padding: 0 32px;
  white-space: nowrap;
}
.search-title {
  display: flex;
  align-items: center;
  gap: 10px;
   font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1f2937;
}

.search-title i {
  color: #ff9f1c;
 font-size: 22px;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-group label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
}

.search-select {
  height: 56px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 0 20px;
  font-size: 15px;
  background: #f9fafb;
  transition: .2s;
}

.search-select:focus {
  outline: none;
  border-color: #ff9f1c;
  box-shadow: 0 0 0 4px rgba(60,60,246,.15);
}

.search-select:disabled {
  background: #f1f5f9;
  color: #9ca3af;
}

.search-btn {
  margin-top: 10px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #ff9f1c;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: .2s;
}

.search-btn:hover {
  background: #f38d00;

}

.search-btn:disabled {
  background: #ffd8a8;
  cursor: not-allowed;
  box-shadow: none;
}
.stats {
  display: flex;
  justify-content: space-around;
  padding: 80px 20px;
  text-align: center;
}

.stat i {
  font-size: 28px;
  color: #ff9f1c;
}

.num {
  font-size: 28px;
  font-weight: 800;
}

.why-section {
  padding: 80px 0;
  background: #f8fafc;
}

.why-header {
  max-width: 1100px;
  margin: 0 auto 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.why-header h3 {
  font-size: 20px;
  font-weight: 800;
}

.more-link {
  font-size: 13px;
  font-weight: 700;
  color: #ff9f1c;
  cursor: pointer;
}

.why-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.why-card {
  padding: 32px;
  border-radius: 28px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.why-card .icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}


.why-card.purple {
  background: #eef0ff;
}
.why-card.purple .icon {
  background: #d6dbff;
  color: #3c3cf6;
}

.why-card.lavender {
  background: #f3efff;
}
.why-card.lavender .icon {
  background: #e3d9ff;
  color: #8b5cf6;
}

.why-card.orange {
  background: #fff3ea;
}
.why-card.orange .icon {
  background: #ffe1cc;
  color: #f97316;
}

.why-card.green {
  background: #ecfdf3;
}
.why-card.green .icon {
  background: #d1fae5;
  color: #22c55e;
}

.why-card h4 {
  font-size: 15px;
  font-weight: 800;
}

.why-card p {
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}


.hot-section {
  max-width:1080px;              
  margin: 70px auto;
  padding: 0 20px;
}

.hot-header h3 {
  font-size: 24px;               
  font-weight: 800;
  margin-bottom: 24px;
}


.hot-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 300px)); 
  justify-content: center;      
  gap: 28px;
}

.hot-card {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  display: flex;
  flex-direction: column;
}

.hot-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.15);
}


.hot-card img {
  width: 100%;
  height: 165px;                
  object-fit: cover;
  flex-shrink: 0;
}

.hot-body {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}


.tag {
  align-self: flex-start;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
}

.tag.blue {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.tag.orange {
  background: rgba(249, 115, 22, 0.14);
  color: #ea580c;
}


.hot-body h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
  min-height: 2.6em;            
}

</style>
