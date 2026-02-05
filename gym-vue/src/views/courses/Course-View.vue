<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const city = ref('')
const venue = ref('')

const cities = ['台北', '新北', '台中', '高雄']
const venues = {
  台北: ['信義館', '板橋館'],
  新北: ['新莊館'],
  台中: ['公益館'],
  高雄: ['巨蛋館']
}

function goSearch() {
  if (!city.value || !venue.value) return
  router.push(`/courses/list?city=${city.value}&venue=${venue.value}`)
}
</script>

<template>
  
  <section class="course-hero">
    <div class="course-hero__inner">
      <h1 class="course-hero__title">課程專區</h1>
      <p class="course-hero__subtitle">
        減輕您多餘的體重，降低您身體的負擔，打造完美動人曲線
      </p>
    </div>
  </section>

 
  <section class="course-search">
    <div class="course-search__inner">
      <h2 >選擇區域及場館</h2>
      <p >請先選擇您要尋找的課程場館</p>

      <div class="course-search__box">
        <select v-model="city" class="course-select">
          <option value="">請選擇區域</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <select 
          v-model="venue" 
          class="course-select"
          :disabled="!city"
        >
          <option value="">請先選擇區域</option>
          <option v-for="v in venues[city] || []" :key="v" :value="v">
            {{ v }}
          </option>
        </select>

        <button 
          class="course-search__btn" 
          @click="goSearch" 
          :disabled="!city || !venue"
        >
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>
  </section>

  <!-- Stats -->
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

  <!-- Why Us -->
  <section class="why-us">
    <h2>為什麼選擇我們</h2>
    <p class="why-sub">提供最專業的健身環境與服務</p>

    <div class="why-grid">
      <div class="why-card blue">
        <i class="bi bi-calendar"></i>
        <h4>彈性預約</h4>
        <p>24小時線上預約系統，隨時安排訓練時間</p>
      </div>

      <div class="why-card purple">
        <i class="bi bi-person-check"></i>
        <h4>專業教練</h4>
        <p>國際認證教練團隊，量身打造課程</p>
      </div>

      <div class="why-card orange">
        <i class="bi bi-patch-check"></i>
        <h4>優質課程</h4>
        <p>多元課程選擇，滿足不同需求</p>
      </div>

      <div class="why-card green">
        <i class="bi bi-clock"></i>
        <h4>彈性時段</h4>
        <p>從早到晚提供多種時段</p>
      </div>
    </div>
    
  </section>
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


.course-search {
  background: #f5f7fa;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}

.course-search__box {
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,.08);
  display: flex;
  gap: 16px;
   margin: 0 auto;          
  justify-content: center; 
}
.course-search__inner {
  width: 100%;
  max-width: 960px;
  text-align: center;  
}

.course-select {
  width: 240px;
  height: 56px;
  border-radius: 30px;
  
  padding: 0 18px;
}

.course-select:disabled {
  background: #f1f3f5;
  color: #adb5bd;
}

.course-search__btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  border: none;
  font-size: 20px;
}

.course-search__btn:disabled {
  background: #ced4da;
}


.stats {
  display: flex;
  justify-content: space-around;
  padding: 80px 20px;
  text-align: center;
}

.stat i {
  font-size: 28px;
  color: #3b82f6;
}

.num {
  font-size: 28px;
  font-weight: 800;
}


.why-us {
  padding: 100px 20px;
  text-align: center;
}

.why-grid {
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 32px;
}

.why-card {
  padding: 40px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 15px 30px rgba(0,0,0,.08);
  transition: .3s;
}

.why-card i {
  font-size: 28px;
  color: #fff;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.blue i { background: #0d6efd; }
.purple i { background: #9b59b6; }
.orange i { background: #fd7e14; }
.green i { background: #20c997; }

.why-card:hover {
  transform: translateY(-10px);
}
</style>
