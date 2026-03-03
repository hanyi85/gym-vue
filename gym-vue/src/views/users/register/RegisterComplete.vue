<template>
  <div class="setup-page">

    <!-- 左側流程欄 -->
    <aside class="sidebar">
      <h2 class="brand">加入練吧</h2>

      <div class="steps">
        <div
          v-for="(step, i) in steps"
          :key="i"
          :class="['step', { active: currentStep === i }]"
        >
          <span class="dot">{{ i + 1 }}</span>
          <div class="step-text">
            <strong>{{ step.title }}</strong>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右側內容 -->
    <main class="content">
      <div class="verify-card">
        <h2 class="title">設定完成 </h2>

        <div class="state success">
          <div class="icon success">✓</div>
          <p class="message">
            你的帳號與健康資料已完成設定，<br />
            現在可以開始使用所有功能
          </p>

          <div class="actions">
            <router-link
              to="/users/home"
              class="next"
            >
              前往會員中心
            </router-link>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>



<script setup>
import { ref } from 'vue'

const currentStep = ref(3) // 最後一步完成

const steps = [
  { title: '基本資料', desc: '填寫個人資訊' },
  { title: '驗證電子信箱', desc: '' },
  { title: '健康數據', desc: '身體狀態' },
  { title: '完成', desc: '確認送出' }
]
</script>



<style scoped>
/* ===== 整頁版型 ===== */
.setup-page {
  display: flex;
  min-height: 100vh;
  background: #f6f4f1;
}

/* ===== 左側流程欄 ===== */
.sidebar {
  width: 260px;
  background: #121212;
  color: white;
  padding: 65px 28px;
}

.brand {
  color: #f38d00;
  margin-bottom: 40px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 100px;
}

.step {
  position: relative;
  display: flex;
  gap: 16px;
  opacity: 0.35;
}

.step.active {
  opacity: 1;
}

.dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2a2a2a;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.step.active .dot {
  background: #f38d00;
  color: white;
}

/* 連接線 */
.step::after {
  content: '';
  position: absolute;
  left: 14px;
  top: 34px;
  width: 2px;
  height: 130px;
  background: rgba(255, 255, 255, 0.15);
}

.step:last-child::after {
  display: none;
}

/* ===== 右側內容 ===== */
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}

/* ===== 卡片 ===== */
.verify-card {
  width: 420px;
  background: #fff;
  border-radius: 8px;
  padding: 40px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.title {
  font-size: 20px;
  margin-bottom: 32px;
  color: #333;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.message {
  color: #555;
  font-size: 15px;
  line-height: 1.6;
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

/* ===== 操作 ===== */
.actions {
  margin-top: 12px;
}

.next {
  background: #f38d00;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
</style>
