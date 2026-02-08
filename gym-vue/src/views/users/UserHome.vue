<template>
  <div class="flex min-h-screen bg-background-light dark:bg-background-dark">
    <!-- 側邊欄 -->
    <UserSidebar />

    <!-- 主內容區 -->
    <main class="flex-1 ml-72 p-8 max-w-[1400px] mx-auto w-full space-y-8">
      <!-- 會員資訊 Header -->
      <UserHeader />

      <!-- 上方摘要數據（可之後接 API） -->
      <DashboardSummary />

      <!-- 飲食 / 體重卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DietRecordCard />
        <BodyProgressCard />
      </div>

      <!-- 課程 + 會員方案區 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <CourseSection />
        </div>
        <div class="space-y-8">
          <MembershipStatusCard />
          <div class="dashboard-card motivation">
            <h5 class="title">今日動力 💪</h5>

            <p class="quote">
              「{{ quote }}」
            </p>

            <span class="author">
              {{ author }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// // Layout / 共用元件
import UserSidebar from '@/components/Users/UserSidebar.vue'
import UserHeaderHeader from '@/components/Users/UserHeader.vue'

// // Dashboard 區塊
// import DashboardSummary from '@/components/Users/DashboardSummary.vue'

// // 卡片元件
import DietRecordCard from '@/components/Users/DietRecordCard.vue'
import BodyProgressCard from '@/components/Users/BodyProgressCard.vue'
import UserHeader from '@/components/Users/UserHeader.vue';
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
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

.title {
  font-weight: 600;
  margin-bottom: 12px;
}

.motivation {
  background: linear-gradient(135deg, #f38d00, #ffb347);
  color: #fff;
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
