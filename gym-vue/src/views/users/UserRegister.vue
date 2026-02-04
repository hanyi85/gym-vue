<template>

 <div class="stepper">
  <!-- STEP 01 -->
  <div class="step active">
    <div class="step-circle">1</div>
    <div class="step-label">建立帳號</div>
  </div>

  <div class="step-line"></div>

  <!-- STEP 02 -->
  <div class="step ">
    <div class="step-circle">2</div>
    <div class="step-label">個人資訊</div>
  </div>
</div>


  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card shadow">
      <div class="text-center mb-5">
        <h2 class="fw-bold indigo-text">建立帳號</h2>
        <p class="text-muted small">只需幾秒鐘，開啟你的健康生活</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="input-wrapper mb-4">
          <input type="text" v-model="form.account" class="minimal-input" placeholder=" " required>
          <label class="floating-label">使用者帳號</label>
          <p v-if="errors.account" class="error-msg">{{ errors.account }}</p>
        </div>

        <div class="input-wrapper mb-4">
          <input :type="showPwd ? 'text' : 'password'" v-model="form.password" class="minimal-input" placeholder=" " required>
          <label class="floating-label">設定密碼</label>
          <span class="eye-icon" @click="showPwd = !showPwd">
            <i :class="showPwd ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </span>
          <p v-if="errors.password" class="error-msg">{{ errors.password }}</p>
        </div>

        <div class="input-wrapper mb-5">
          <input type="password" v-model="form.confirmPassword" class="minimal-input" placeholder=" " required>
          <label class="floating-label">再次輸入密碼</label>
          <p v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="btn-outline-indigo w-100">註冊新帳號</button>
      </form>

      <div class="social-section">
        <div class="divider"><span>或使用快速註冊</span></div>
        <div class="d-flex justify-content-center gap-4">
          <button class="social-circle google" @click="socialAuth('Google')">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
          </button>
          <button class="social-circle line" @click="socialAuth('LINE')">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE">
          </button>
        </div>
      </div>

      <div class="text-center mt-5">
        <span class="text-muted small">已經有帳號了？</span>
        <router-link to="/users/login" class="login-link fw-bold">立即登入</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showPwd = ref(false);

const form = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = () => {
  // 簡單驗證邏輯
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '密碼不一致';
    return;
  }
  console.log('提交註冊:', form);
  router.push('/user/login');
};

const socialAuth = (platform) => {
  alert(`即將跳轉至 ${platform} 授權頁面`);
};
</script>

<style scoped>

.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 90px;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  background: #e5e7eb;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  white-space: nowrap;
}

/* 中間連線 */
.step-line {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 6px;
}

/* 已完成 */
.step.done .step-circle {
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  box-shadow: 0 6px 16px rgba(63, 81, 181, 0.35);
}

.step.done .step-label {
  color: #3f51b5;
  font-weight: 600;
}

/* 目前進行中（發光） */
.step.active .step-circle {
  background: #ffffff;
  color: #3f51b5;
  border: 2px solid #3f51b5;
  box-shadow:
    0 0 0 6px rgba(63, 81, 181, 0.12),
    0 10px 30px rgba(63, 81, 181, 0.35);
}

.step.active .step-label {
  color: #1f2937;
  font-weight: 700;
}

/* 頁面背景 */
.auth-page {
  min-height: 100vh;
  background: #fdfdfd;
  padding: 40px 20px;
}

/* 卡片主體 */
.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  padding: 45px;
}

.indigo-text { color: #3f51b5; }

/* 極簡底線輸入框 */
.input-wrapper {
  position: relative;
}

.minimal-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #dbdbdb;
  padding: 12px 0;
  font-size: 15px;
  background: transparent;
  outline: none;
  transition: all 0.3s;
}

.minimal-input:focus {
  border-bottom: 2px solid #3f51b5;
}

/* 浮動標籤 */
.floating-label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #a0a0a0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.minimal-input:focus ~ .floating-label,
.minimal-input:not(:placeholder-shown) ~ .floating-label {
  top: -15px;
  font-size: 12px;
  color: #3f51b5;
  font-weight: 500;
}

/* 眼睛圖示 */
.eye-icon {
  position: absolute;
  right: 0;
  top: 12px;
  cursor: pointer;
  color: #ccc;
}

/* 按鈕樣式 */
.btn-outline-indigo {
  background: transparent;
  border: 1.5px solid #3f51b5;
  color: #3f51b5;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.3s;
}

.btn-outline-indigo:hover {
  background: #3f51b5;
  color: #fff;
}

/* 分隔線與第三方登入 */
.divider {
  display: flex;
  align-items: center;
  margin: 30px 0 20px;
}
.divider::before, .divider::after {
  content: ""; flex: 1; border-bottom: 1px solid #f0f0f0;
}
.divider span { padding: 0 15px; font-size: 12px; color: #bbb; }

.social-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.social-circle img { width: 24px; }
.social-circle:hover { transform: scale(1.1); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

/* 錯誤訊息 */
.error-msg { color: #f44336; font-size: 11px; margin-top: 5px; position: absolute; }

.login-link { color: #3f51b5; text-decoration: none; margin-left: 5px; }
</style>