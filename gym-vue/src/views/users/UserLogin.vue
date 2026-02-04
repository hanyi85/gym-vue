<template>
  <div class="login-page d-flex align-items-center justify-content-center">
    <div class="login-card shadow">

      <!-- 標題 -->
      <div class="login-header text-center">
        <h2 class="fw-bold">歡迎回來</h2>
        <p class="text-muted">請輸入您的帳號密碼</p>
      </div>

      <!-- 表單 -->
      <form @submit.prevent="handleLogin" class="mt-4">

        <!-- 帳號 -->
        <div class="form-group mb-3">
          <label class="form-label">電子郵件 / 帳號</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fa fa-envelope-o"></i>
            </span>
            <input
              type="email"
              v-model="email"
              class="form-control"
              placeholder="example@mail.com"
              required
            />
          </div>
        </div>

        <!-- 密碼 -->
        <div class="form-group mb-3">
          <label class="form-label">密碼</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="fa fa-lock"></i>
            </span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control"
              placeholder="請輸入密碼"
              required
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- 記住我 / 忘記密碼 -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="rememberMe"
              v-model="rememberMe"
            />
            <label class="form-check-label small" for="rememberMe">
              記住我
            </label>
          </div>

          <router-link
            to="/user/forgot-password"
            class="small text-tech-blue"
          >
            忘記密碼？
          </router-link>
        </div>

        <!-- 登入按鈕 -->
        <button
          type="submit"
          class="btn btn-login w-100 py-2 fw-bold text-white"
        >
          登入系統
        </button>

        <!-- 註冊 -->
        <div class="text-center mt-4">
          <p class="small text-muted">
            還沒有帳號嗎？
            <router-link
              to="/users/register"
              class="text-tech-blue fw-bold"
            >
              立即註冊
            </router-link>
          </p>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

const handleLogin = () => {
  // 模擬登入成功
  console.log('登入資料', {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  })

  // 之後可改成 API 驗證
  sessionStorage.setItem('isLogin', 'true')

  // 假設第一次登入
  const isFirstLogin = true

  if (isFirstLogin) {
    router.push('/user/welcome')
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
/* 整個頁面背景 */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fc 0%, #e2e6ea 100%);
  padding: 20px;
}

/* 登入卡片 */
.login-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 0.15rem 1.75rem rgba(58, 59, 69, 0.15);
}

/* 藍色連結 */
.text-tech-blue {
  color: #4e73df;
  text-decoration: none;
  font-weight: 500;
}
.text-tech-blue:hover {
  color: #2e59d9;
  text-decoration: underline;
}

/* input 群組 */
.input-group-text {
  background-color: #f8f9fc;
  border-right: none;
  color: #4e73df;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.form-control {
  border-left: none;
  padding: 12px;
  font-size: 0.9rem;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.form-control:focus {
  border-color: #bac8f3;
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

/* 登入按鈕 */
.btn-login {
  background-color: #4e73df;
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  padding: 12px;
  letter-spacing: 1px;
}

.btn-login:hover {
  background-color: #2e59d9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 115, 223, 0.3);
}

/* checkbox */
.form-check-input:checked {
  background-color: #4e73df;
  border-color: #4e73df;
}
</style>
