<template>
  <div class="d-flex min-vh-100 bg-light">
    <main class="flex-fill ms-5 px-4 py-4">
      <Banner title="會員首頁" class="mb-4"  />
      <UserHeader class="mb-4" />

      <!-- Dashboard -->
      <div class="container-fluid">
        <div class="row g-4">
          <!-- 飲食卡 -->
          <div class="col-lg-8 col-12">
            <DietRecordCard />
          </div>

          <!-- 體重卡 -->
          <div class="col-lg-4 col-12">
            <BodyProgressCard />
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
// import DashboardSummary from '@/components/Users/DashboardSummary.vue'

// // 卡片元件
import DietRecordCard from '@/components/Users/DietRecordCard.vue'
import BodyProgressCard from '@/components/Users/BodyProgressCard.vue'

// import CourseSection from '@/components/member/CourseSection.vue'
// import MembershipStatusCard from '@/components/member/MembershipStatusCard.vue'



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
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
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
</style>
