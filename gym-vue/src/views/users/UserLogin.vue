<template>
  <div class="login-page d-flex align-items-center justify-content-center">
    <div class="login-card shadow">
      <div class="login-header text-center">
        <h2 class="fw-bold">歡迎回來</h2>
        <p class="text-muted">請輸入您的帳號密碼</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="form-group mb-3">
          <label class="form-label">電子郵件 / 帳號</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa fa-envelope-o"></i></span>
            <input type="email" v-model="email" class="form-control" placeholder="example@mail.com" required>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="form-label">密碼</label>
          <div class="input-group">
            <span class="input-group-text"><i class="fa fa-lock"></i></span>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" class="form-control" placeholder="請輸入密碼" required>
            <button class="btn btn-outline-secondary" type="button" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="rememberMe">
            <label class="form-check-label small" for="rememberMe">記住我</label>
          </div>
          <router-link to="/forgot-password" class="small text-forest-green">忘記密碼？</router-link>
        </div>

        <button type="submit" class="btn btn-login w-100 py-2 fw-bold text-white">
          登入系統
        </button>

        <div class="text-center mt-4">
          <p class="small text-muted">
            還沒有帳號嗎？ 
            <router-link to="/register" class="text-forest-green fw-bold">立即註冊</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = () => {
  console.log('正在登入...', { email: email.value, password: password.value });
  // 在這裡加入你的 API 請求邏輯
};
</script>


<style scoped>
/* 頁面背景 */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f3f2 0%, #e8e8ea 100%);
  padding: 20px;
}

/* 登入卡片 */
.login-card {
  background: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 20px; /* 延續之前的圓潤感 */
}

/* 文字顏色 */
.text-forest-green {
  color: #7a9d96;
  text-decoration: none;
}
.text-forest-green:hover {
  text-decoration: underline;
}

/* Input 群組美化 */
.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #7a9d96;
}

.form-control {
  border-left: none;
  padding: 12px;
}

.form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}

/* 登入按鈕 */
.btn-login {
  background-color: #7a9d96; /* 你的品牌森林綠 */
  border: none;
  border-radius: 50px; /* 膠囊狀按鈕 */
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.btn-login:hover {
  background-color: #688882;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(122, 157, 150, 0.3);
}

/* Font Awesome 圖示微調 */
.fa {
  width: 16px;
}
</style>