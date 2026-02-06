<template>
  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card shadow">
      <div class="text-center mb-5">
        <h2 class="fw-bold tech-blue-text">歡迎回來</h2>
        <p class="text-muted small">請輸入您的帳號密碼以繼續</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="input-wrapper mb-4">
          <input 
            type="text" 
            v-model="email" 
            class="minimal-input" 
            placeholder=" " 
            required
          >
          <label class="floating-label">電郵或手機號碼</label>
        </div>

        <div class="input-wrapper mb-2">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            class="minimal-input" 
            placeholder=" " 
            required
          >
          <label class="floating-label">密碼</label>
          <span class="eye-icon" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
        </div>

        <div class="text-start mb-5">
          <router-link to="/users/forgot-password" class="forgot-link">忘記密碼？</router-link>
        </div>

        <button type="submit" class="btn-outline-tech w-100">登入</button>
      </form>

      <div class="social-section">
        <div class="divider"><span>或使用其他方式</span></div>
        <div class="d-flex justify-content-center gap-4">
          <button class="social-circle google" @click="socialLogin('Google')">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
          </button>
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
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = () => {
  console.log('執行登入:', { email: email.value, password: password.value });
  // 登入成功後跳轉
  router.push('/');
};

const socialLogin = (platform) => {
  console.log(`${platform} 登入啟動`);
};
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

.tech-blue-text { color: #4e73df; }

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
  border-bottom: 2px solid #4e73df;
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

.minimal-input:focus ~ .floating-label,
.minimal-input:not(:placeholder-shown) ~ .floating-label {
  top: -18px;
  font-size: 12px;
  color: #4e73df;
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
  background: #4e73df;
  color: #ffffff;
}

/* 第三方登入區 */
.divider {
  display: flex;
  align-items: center;
  margin: 35px 0 25px;
}
.divider::before, .divider::after {
  content: ""; flex: 1; border-bottom: 1px solid #eee;
}
.divider span { padding: 0 15px; font-size: 12px; color: #999; }

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
.social-circle img { width: 24px; }
.social-circle:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
</style>