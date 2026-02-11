<script setup>
import { useRouter } from 'vue-router'
import Btn from '@/components/btn.vue'

const router = useRouter()

function goCourses() {
  router.push('/courses')
}

function goHistory() {
  router.push('/courses/booking-history')
}
</script>

<template>
  <section class="success-wrapper">
    <div class="success-card">

      <div class="success-line"></div>

      <h2 class="title">評論送出成功</h2>
      <p class="desc">
        感謝你的回饋，這將幫助我們持續優化課程體驗，
        也能協助其他學員做出更好的選擇。
      </p>

      <!-- 共用 btn.vue -->
      <Btn
        add-text="回到課程列表"
        buy-text="查看我的預約"
        @add="goCourses"
        @buy="goHistory"
      />

    </div>
  </section>
</template>

<style scoped>
.success-wrapper {
  min-height: calc(100vh - 120px);
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
}

.success-card {
  background: #fff;
  border-radius: 18px;
  padding: 44px 36px;
  max-width: 520px;
  width: 100%;
  text-align: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.success-line {
  background: #e5e7eb;
}

.title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 12px;
}

.desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 32px;
}
</style>
