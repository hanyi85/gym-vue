<template>
  <div class="flex min-h-screen bg-background-light">
    <main
      class="flex-1 ml-72 px-10 py-8 max-w-[1440px] mx-auto w-full space-y-10"
    >
      <!-- Header -->
      <UserHeader />

      <!-- 主 Dashboard：飲食 + 體重（永遠並排） -->
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-2  min-w-0">
          <DietRecordCard />
        </div>

        <BodyProgressCard />
      </div>

      <!-- 動力卡（你現在只有一張，也照樣用 grid） -->
      <div class="grid grid-cols-3 gap-8">
        <MotivationCard class="col-span-1" />
      </div>
    </main>
  </div>
</template>




<script setup>
// // Layout / 共用元件

import UserHeader from '@/components/Users/UserHeader.vue'

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
.member-layout {
  display: flex;
  min-height: 100vh;
  background: #f6f7f9;
}

.member-main {
  flex: 1;
  padding: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

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
