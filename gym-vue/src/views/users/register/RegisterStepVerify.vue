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
    <main class="setup-content">
      <div class="verify-card">
        <h2 class="title">認證你的電子郵件</h2>

<div class="state">

  <!-- 查收信件狀態 -->
  <div v-if="status === 'notice'">
    <div class="icon">📧</div>
    <p class="message">{{ message }}</p>
  </div>

  <!-- Loading -->
  <div v-else-if="status === 'loading'">
    <div class="icon">⏳</div>
    <p class="message">{{ message }}</p>
  </div>

  <!-- Success -->
  <div v-else-if="status === 'success'">
    <div class="icon success">✓</div>
    <p class="message">{{ message }}</p>

    <div class="actions">
      <router-link
        to="/users/profile-health"
        class="next"
      >
        下一步
      </router-link>
    </div>
  </div>

  <!-- Error -->
  <div v-else>
    <div class="icon error">✕</div>
    <p class="message">{{ message }}</p>
  </div>

</div>
      </div>
    </main>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmailVerify } from '@/composables/useEmailVerify'
import { verifyEmail } from '@/services/auth'

const route = useRoute()

const currentStep = ref(1)

const steps = [
  { title: '基本資料', desc: '填寫個人資訊' },
  { title: '驗證電子信箱', desc: '' },
  { title: '健康數據', desc: '身體狀態' },
  { title: '完成', desc: '確認送出' }
]

const { status, message, execute } =
  useEmailVerify(verifyEmail)

onMounted(() => {
  const token = route.query.token
console.log('token =', token)
  if (token) {
    console.log('準備執行驗證')
    execute(token)
  } else {
    status.value = 'notice'
    message.value =
      '我們已寄送驗證信至您的信箱，請前往收信並點擊驗證連結完成註冊。'
  }
})
</script>

<style scoped>
/* ===== 整頁版型 ===== */
.setup-page {
    display: flex;
  min-height: calc(100vh - 80px);
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
.setup-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

/* ===== 驗證卡片 ===== */

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
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

.btn {
  margin-top: 8px;
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}

.btn.primary {
  background-color: #f38d00;
  color: #fff;
  border: none;
}


.verify-card {
  width: 420px;
  background: #fff;
  border-radius: 8px;
  padding: 40px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.title {
    font-size: 22px;
  margin-bottom: 28px;
  font-weight: 600;
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

.btn {
  margin-top: 8px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.btn.primary {
  background-color: #409eff;
  color: #fff;
  border: none;
}
.actions {
  margin-top: 8px;
  display: flex;
  justify-content: center;
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
}
.icon.error {
  background-color: #fdecea;
  color: #e53935;
}
</style>
