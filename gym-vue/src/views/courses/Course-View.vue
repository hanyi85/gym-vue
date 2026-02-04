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
  if (!city.value || !venue.value) {
    alert('請先選擇區域與場館')
    return
  }
  router.push(`/courses/list?city=${city.value}&venue=${venue.value}`)
}
</script>

<template>

  <section class="course-hero">
    <div class="course-hero__inner">
      <h1 class="course-hero__title">課程專區</h1>
      <p class="course-hero__subtitle">
        減輕您多餘的體重，降低您身體的負擔，讓你的全身進行雕塑，打造完美動人曲線
      </p>
    </div>
  </section>


  <section class="course-search">
    <div class="course-search__inner">
      <h2 class="course-search__title">選擇區域及場館</h2>
      <p class="course-search__subtitle">請先選擇您要尋找的課程場館</p>

      <div class="course-search__box">
        <select v-model="city" class="course-select">
          <option value="">選擇區域</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="venue" class="course-select">
          <option value="">請先選擇區域</option>
          <option v-for="v in venues[city] || []" :key="v" :value="v">{{ v }}</option>
        </select>

        <button class="course-search__btn" @click="goSearch" type="button">
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>

.course-hero {
  padding: 100px 20px;
  display: flex;
  justify-content: center;
  background: linear-gradient(135deg, #e0ecff, #f8fbff);
  position: relative;
  overflow: hidden;
}


.course-hero::before,
.course-hero::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(59,130,246,0.15);
  filter: blur(40px);
}

.course-hero::before {
  top: -60px;
  left: -60px;
}

.course-hero::after {
  bottom: -60px;
  right: -60px;
}


.course-hero__inner {
  width: 100%;
  max-width: 960px;
  text-align: center;
}

.course-hero__title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px;
  text-align: center !important;
}

.course-hero__subtitle {
  color: #666;
  font-size: 16px;
  line-height: 1.9;
  margin: 0 auto;
  max-width: 720px;
  text-align: center !important; 
}


.course-search {
  background: #f5f7fa;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}

.course-search__inner {
  width: 100%;
  max-width: 960px;
  text-align: center;
}

.course-search__title {
  font-weight: 800;
  margin: 0 0 8px;
  text-align: center !important;
}

.course-search__subtitle {
  color: #6c757d;
  margin: 0 0 28px;
  text-align: center !important;
}

.course-search__box {
  background: #fff;
  padding: 32px 28px;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}


.course-select {
  width: 260px;
  height: 56px;
  font-size: 18px;
  border-radius: 30px;
  padding: 0 18px;
  border: 1px solid #cfd6df;
  background: #fff;
}

.course-search__btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 20px;
  background: #3b82f6;
  border: none;
  color: #fff;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.course-search__btn:hover {
  background: #2563eb;
}
</style>
