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
    <div class="icon notice"><i class="fa fa-envelope-o" aria-hidden="true"></i></div>
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

  <p class="message">
    驗證失敗或連結已過期。<br />
    我們可以重新發送一封新的驗證信給您。
  </p>
  
  <div class="actions">
    <router-link to="/users/login" class="btn outline">
      返回登入
    </router-link>
    <button
      class="btn primary"
      :disabled="cooldown > 0 || isResending"
      @click="handleResend"
    >
      <span v-if="cooldown > 0">
        請 {{ cooldown }} 秒後再試
      </span>
      <span v-else-if="isResending">
        發送中...
      </span>
      <span v-else>
        重新發送驗證信
      </span>
    </button>

  </div>
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
import { verifyEmail, resendVerifyEmail } from '@/services/auth'

const route = useRoute()

const cooldown = ref(0)
const isResending = ref(false)
let timer = null

const startCooldown = () => {
  cooldown.value = 60

  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleResend = async () => {
  if (cooldown.value > 0) return

  try {
    isResending.value = true

    const email = localStorage.getItem('pendingVerifyEmail')

    await resendVerifyEmail(email)

    message.value = '驗證信已重新發送，請前往信箱查收。'
    startCooldown()

  } catch (error) {
    message.value = '發送失敗，請稍後再試。'
  } finally {
    isResending.value = false
  }
}

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
  const verified = route.query.verified

  if (token) {
    execute(token)
  } else if (verified === 'true') {
    status.value = 'success'
    message.value = '您的電子郵件已由第三方平台完成驗證。'
  } else {
    status.value = 'notice'
    message.value =
      '我們已寄送驗證信至您的信箱，\n請前往收信並點擊驗證連結完成註冊。'
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

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.message {
  color: #555;
  font-size: 15px;
    white-space: pre-line;
}

.icon {
   line-height: 1;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon.notice i {
  color: #f38d00;
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

   display: flex;
  flex-direction: column;
}

.title {
  font-size: 22px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #333;
}

.state {
  display: flex;
  flex-direction: column;
   justify-content: center; 
  align-items: center;
  gap: 16px;
}
.state > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.message {
  color: #555;
  font-size: 15px;
 line-height: 1.8;
}

.icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
   background: #fff4e5;
}



.btn {
  margin-top: 8px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
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
