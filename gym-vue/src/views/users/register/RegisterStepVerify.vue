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
    請重新輸入您的電子信箱取得新的驗證連結。
  </p>

  <!--  新增輸入框 -->
  <div class="input-wrapper">
    <input
      type="email"
      v-model="resendEmail"
      class="resend-input"
      placeholder="請輸入電子信箱"
    />
  </div>

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

  <!-- Loading -->
<div v-if="status === 'loading'" class="loading-overlay">
  <div class="loading-box">
    <div class="line-spinner"></div>
    <p>{{ message }}</p>
  </div>
</div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmailVerify } from '@/composables/useEmailVerify'
import { verifyEmail, resendVerifyEmail } from '@/services/auth'
const resendEmail = ref('')
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

  if (!resendEmail.value || !resendEmail.value.includes('@')) {
    message.value = '請輸入正確的電子信箱'
    return
  }

  if (cooldown.value > 0) return

  try {
    isResending.value = true

    await resendVerifyEmail(resendEmail.value)

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

  // 如果 localStorage 有，就帶入
  const storedEmail = localStorage.getItem('pendingVerifyEmail')
  if (storedEmail) {
    resendEmail.value = storedEmail
  }

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


/* Loading 遮罩 */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Loading 盒子 */
.loading-box {
  text-align: center;
}

/* LINE 風轉圈 */
.line-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid #e5e5e5;
  border-top: 4px solid #06C755; /* LINE 綠 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-wrapper {
  width: 100%;
  margin-top: 12px;
}

.resend-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.3s;
}

.resend-input:focus {
  border-color: #f38d00;
}
</style>
