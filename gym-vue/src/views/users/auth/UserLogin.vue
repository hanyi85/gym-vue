<template>
  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card shadow">
      <div class="text-center mb-5">
        <h2 class="fw-bold tech-blue-text">歡迎回來</h2>
        <p class="text-muted small">請輸入您的帳號密碼以繼續</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="input-wrapper mb-4">
          <input type="text" v-model="email" class="minimal-input" placeholder=" " required>
          <label class="floating-label">電郵</label>
        </div>

        <div class="input-wrapper mb-2">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" class="minimal-input" placeholder=" "
            required>
          <label class="floating-label">密碼</label>
          <span class="eye-icon" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>

          </span>
        </div>
        <p v-if="errorMessage" class="error-text">
          {{ errorMessage }}
        </p>
        <div class="text-start mb-5">
          <router-link to="/users/forgot-password" class="forgot-link">忘記密碼？</router-link>
        </div>

        <Btn add-text="登入" :single="true" :disabled="loading" @add="handleLogin" />

      </form>

      <div class="social-section">
        <div class="divider"><span>或使用其他方式</span></div>
        <div class="d-flex justify-content-center gap-4"> <!-- Google 登入按鈕 -->
<GoogleLogin
  ref="googleBtn"
  :callback="handleGoogleCallback"
  style="display: none"
/>
<button class="social-circle google" @click="triggerGoogle">
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
    alt="Google"
  />
</button>
          <!-- <GoogleLogin
  :callback="handleGoogleCallback"

>
  <button class="social-circle google" @click="login">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      alt="Google"
    />
  </button>
</GoogleLogin>         -->
          
          <button class="social-circle line" @click="socialLogin('LINE')">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE">
          </button>
        </div>
      </div>

      <div class="text-center mt-5">
        <h3 class="fw-bold mb-3" style="font-size: 1.5rem;">還沒有帳號？</h3>
        <p class="text-muted small mb-4">立即註冊享有更多優惠！</p>
        <router-link to="/users/register" class="btn-outline-tech w-100 d-block text-decoration-none">註冊</router-link>
      </div>
    </div>
  </div>

  <!-- Email 驗證視窗 -->
  <div v-if="showVerifyModal" class="verify-modal">
    <div class="verify-card">
      <h4>請先完成電子郵件驗證</h4>
      <p>我們已寄送驗證信到您的信箱</p>

      <div class="d-flex gap-3 mt-3">
        <button class="btn-outline-tech" @click="resendEmail">
          重新寄送
        </button>

        <button class="btn-outline-tech" @click="showVerifyModal = false">
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import Btn from '@/components/btn.vue'
const googleBtn = ref(null)

function triggerGoogle() {
  // 觸發隱藏的官方按鈕
  googleBtn.value?.$el.querySelector('div[role=button]')?.click()
}
const router = useRouter()
const auth = useAuthStore()

/* =====================
   狀態
===================== */
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const showVerifyModal = ref(false)

/* =====================
   一般登入
===================== */
async function handleLogin() {
  if (loading.value) return

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await api.post('/Auth/login', {
      email: email.value,
      password: password.value
    })

    const { data } = res

    if (data.needVerify) {
      showVerifyModal.value = true
      return
    }

    // 使用 Pinia 存登入資訊
    auth.login(data.token, data.name, data.userId)

    router.push('/')

  } catch (err) {
    errorMessage.value =
      err.response?.data || '登入失敗，請檢查帳號密碼'
  } finally {
    loading.value = false
  }
}

/* =====================
   重寄驗證信
===================== */
async function resendEmail() {
  try {
    await api.post('/Auth/resend-verify-email', {
      email: email.value
    })

    alert('驗證信已重新寄出')

  } catch {
    alert('寄送失敗，請稍後再試')
  }
}

/* =====================
   Google 登入
===================== */
const handleGoogleCallback = async ({ credential }) => {
  if (!credential) return

  try {
    const { data } = await api.post('/Auth/google-login', {
      IdToken: credential
    })

    // 假設後端回傳 { token, name }
    auth.login(data.token, data.name)

    router.push('/')
  } catch (error) {
    errorMessage.value = 'Google 登入失敗'
  }
}

/* =====================
   LINE 登入
===================== */
function socialLogin(provider) {
  if (provider === "LINE") {
    const clientId = "2009268953"
    const redirectUri = "http://localhost:5173/line-callback"
    const state = Math.random().toString(36).substring(2)
    const scope = "profile openid"

    sessionStorage.setItem("line_state", state)

    const url =
      `https://access.line.me/oauth2/v2.1/authorize?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent(scope)}`

    window.location.href = url
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
}

.tech-blue-text {
  color: #f38d00;
}

/* 極簡底線設計 */
.input-wrapper {
  position: relative;
}

.minimal-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0;
  font-size: 16px;
  background: transparent;
  outline: none;
  transition: all 0.3s;
}

.minimal-input:focus {
  border-bottom: 2px solid #f38d00
}

/* 浮動標籤 */
.floating-label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #999;
  pointer-events: none;
  transition: all 0.3s ease;
}

.minimal-input:focus~.floating-label,
.minimal-input:not(:placeholder-shown)~.floating-label {
  top: -18px;
  font-size: 12px;
  color: #f38d00;
}

.eye-icon {
  position: absolute;
  right: 0;
  top: 12px;
  cursor: pointer;
  color: #666;
}

.forgot-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

/* 圖片中的按鈕風格 */
.btn-outline-tech {
  background: transparent;
  border: 1.5px solid #f38d00;
  color: #f38d00;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  transition: 0.3s;
  cursor: pointer;
}

.btn-outline-tech:hover {
  background: #f38d00;
  color: #ffffff;
}

/* 第三方登入區 */
.divider {
  display: flex;
  align-items: center;
  margin: 35px 0 25px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider span {
  padding: 0 15px;
  font-size: 12px;
  color: #999;
}

.social-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.social-circle img {
  width: 24px;
}

.social-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.verify-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.verify-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 320px;
  text-align: center;
}
</style>