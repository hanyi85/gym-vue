<template>
  <div class="d-flex min-vh-100 bg-light">
    <main class="flex-fill ms-5 px-4 py-4">
      <Banner title="會員首頁" class="mb-4" />
      <div class="container-fluid">
        <!-- 會員 Header -->
        <div class="row mb-4">
          <UserHeader class="mb-4" />
        </div>
      </div>
      <!-- Dashboard -->
      <div class="container-fluid">
        <div class="row g-4">
          <!-- 飲食卡 -->
          <!-- <div class="col-lg-8 col-12">
            <DietRecordCard />
          </div> -->

          <!-- 體重卡 -->
          <div class="col-lg-4 col-12">
            <span class="card"></span>
          </div>
<div class="col-lg-8 col-12">
            <BodyProgressCard />
          </div>
          <!-- 每日激勵語 + 資源 -->
<div class="col-12">
  <div class="row g-4">

    <!-- 每日激勵語 -->
    <div class="col-lg-6 col-12">
      <div class="motivation-card">
        <div class="quote-mark">“</div>
        <p class="motivation-text">
          每一次撐下去的瞬間，都是你變強的證據！
        </p>
        <div class="motivation-footer">每日激勵語</div>
      </div>
    </div>

    <!-- 資源捷徑 -->
    <div class="col-lg-6 col-12">
      <div class="dashboard-card h-100">
        <h5 class="title mb-3">連結</h5>

        <div class="resource-item">
          <div class="resource-left">
            <i class="fa-solid fa-utensils"></i>
            <span>課程安排</span>
          </div>
        </div>

        <div class="resource-item">
          <div class="resource-left">
            <span>健康餐點</span>
          </div>

        </div>
      </div>
    </div>

  </div>
</div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// // Layout / 共用元件

import UserHeader from '@/components/Users/UserHeader.vue'
import Banner from '@/components/banner.vue'

// // Dashboard 區塊

// // 卡片元件
import DietRecordCard from '@/components/Users/DietRecordCard.vue'
import BodyProgressCard from '@/components/Users/BodyProgressCard.vue'

// import CourseSection from '@/components/member/CourseSection.vue'



import { computed } from 'vue'

const quotes = [
  { text: '今天流的汗，都是明天的底氣', author: 'GYM+' },
  { text: '慢慢來，也是一種前進', author: 'GYM+' },
  { text: '不是每天都有狀態，但每天都能來一下', author: 'GYM+' },
  { text: '你已經比昨天更靠近目標了', author: 'GYM+' },
]

const random = quotes[Math.floor(Math.random() * quotes.length)]

const quote = computed(() => random.text)
const author = computed(() => random.author)
</script>


<style scoped>
.dashboard-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .06);
}
.card {
  background: #fff;
  border-radius: 20px;
  height: 100%;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}
.title {
  font-weight: 600;
  margin-bottom: 12px;
}

.motivation {
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  color: #7c2d12;
}

.quote {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.author {
  font-size: 13px;
  opacity: 0.9;
}

/* 每日激勵語卡 */
.motivation-card {
  height: 100%;
  border-radius: 20px;
  padding: 28px;
  background: linear-gradient(135deg, #111827, #1f2933);
  color: #fff;
  position: relative;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.quote-mark {
  font-size: 48px;
  font-weight: 800;
  color: #f97316;
  line-height: 1;
  margin-bottom: 12px;
}

.motivation-text {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 24px;
}

.motivation-footer {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #f97316;
}

/* 資源捷徑 */
.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff7ed;
  color: #9a3412;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.resource-item + .resource-item {
  margin-top: 12px;
}

.resource-item:hover {
  background: #ffedd5;
  transform: translateX(4px);
}

.resource-left {
  display: flex;
  align-items: center;

}

.resource-left i {
  color: #f97316;
}

</style>
