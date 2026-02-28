<template>
  <div class="d-flex min-vh-100 bg-light">
    <main class="flex-fill ms-5 px-4 py-4">
      <Banner title="會員首頁" class="mb-4" />

      <div class="container-fluid">
        <div class="row mb-4">
          <div class="col-12">
            <UserHeader />
          </div>
        </div>
        <!-- 功能區塊 -->
        <div class="row mb-5">
          <div class="col-12 mt-4">
            <div class="quick-links">
              <router-link to="/courses" class="quick-card">

                <div class="quick-icon">
                  <i class="fa fa-calendar"></i>
                </div>
                <p>課程專區</p>

              </router-link>
              <div class="quick-card">
                <div class="quick-icon">
                  <i class="fa fa-weight"></i>
                </div>
                <p>體重紀錄</p>
              </div>

              <div class="quick-card">
                <div class="quick-icon">
                  <i class="fa fa-shopping-bag"></i>
                </div>
                <p>商城專區</p>
              </div>

              <div class="quick-card">
                <div class="quick-icon">
                  <i class="fa fa-chart-bar"></i>
                </div>
                <p>健康餐點</p>
              </div>
            </div>

          </div>
        </div>
        <div class="row g-4">

          <div class="col-lg-4 col-12">
            <div class="card ambition-card h-100">
              <div class="card-header-custom mb-4">
                <div class="icon-box">
                  <i class="fa fa-bullseye" aria-hidden="true"></i>
                </div>
                <h5 class="ambition-title">設定你的目摽體重</h5>
              </div>

              <div class="weight-display-container d-flex justify-content-between align-items-end mb-4">
                <div class="target-weight-info">
                  <span class="label">TARGET WEIGHT</span>
                  <div class="weight-value">
                    <span class="number">{{ targetWeight }}</span>
                    <span class="unit">kg</span>
                  </div>
                </div>
                <div class="input-display">{{ targetWeight }}</div>
              </div>

              <div class="range-slider-wrapper">
                <input type="range" class="custom-range" v-model="targetWeight" min="45" max="150" step="0.1">
                <div class="range-labels d-flex justify-content-between">
                  <span>45 KG</span>
                  <span class="current-label">目前體重: 84 KG</span>
                  <span>150 KG</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8 col-12">
            <BodyProgressCard class="h-100" />
          </div>

          <div class="col-12">
            <div class="row g-4">
              <div class="col-lg-6 col-12">
                <div class="motivation-card h-100">
                  <div class="quote-mark"><i class="fa fa-quote-right" aria-hidden="true"></i></div>
                  <p class="motivation-text">每一次撐下去的瞬間，都是你變強的證據！</p>
                  <div class="motivation-footer">每日激勵語</div>
                </div>
              </div>

              <div class="col-lg-6 col-12">
                <div class="dashboard-card h-100">
                  <h5 class="title mb-3">連結</h5>
                  <div class="resource-item">
                    <div class="resource-left">
                      <span>課程安排</span>
                    </div>
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
                  </div>
                  <div class="resource-item mt-2">
                    <div class="resource-left">
                      <span>健康餐點</span>
                    </div>
                    <i class="fa fa-chevron-right" aria-hidden="true"></i>
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

import BodyProgressCard from '@/components/Users/BodyProgressCard.vue'

// import CourseSection from '@/components/member/CourseSection.vue'



import { ref, computed } from 'vue'
const targetWeight = ref(72.5) // 預設值
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

.resource-item+.resource-item {
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

/* 目標卡片專屬樣式 */
.ambition-card {
  border: none;
  background: #ffffff;
  padding: 32px !important;
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-box {
  background: #fff7ed;
  color: #f97316;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 20px;
}

.ambition-title {
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  font-size: 1.25rem;
}

.label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
}

.weight-value .number {
  font-size: 48px;
  font-weight: 900;
  color: #f97316;
  font-style: italic;
}

.weight-value .unit {
  font-size: 20px;
  font-weight: 700;
  color: #64748b;
  margin-left: 4px;
}

.input-display {
  background: #f8fafc;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  color: #1e293b;
  min-width: 80px;
  text-align: center;
}

/* 自定義滑桿樣式 */
.range-slider-wrapper {
  margin-top: 20px;
}

.custom-range {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 5px;
  outline: none;
  margin-bottom: 15px;
}

/* 滑桿按鈕 (Thumb) */
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #f97316;
  border: 4px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.3);
}

.range-labels {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.current-label {
  color: #94a3b8;
}

/* 功能捷徑區塊 */
.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.quick-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.quick-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: #fff7ed;
  color: #f97316;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
}

.quick-card:hover .quick-icon {
  transform: scale(1.1);
  background: #ffedd5;

}

.quick-card p {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}
</style>
