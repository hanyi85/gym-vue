<template>
  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card shadow">
      <div v-if="!isSent">
        <div class="text-center mb-5">
          <h2 class="fw-bold tech-blue-text">找回密碼</h2>
          <p class="text-muted small">請輸入您的註冊信箱，我們將寄送重設連結給您</p>
        </div>

        <form @submit.prevent="handleResetRequest">
          <div class="input-wrapper mb-5">
            <input 
              type="email" 
              v-model="email" 
              class="minimal-input" 
              placeholder=" " 
              required
            >
            <label class="floating-label">電子信箱地址</label>
            <p v-if="error" class="error-msg">{{ error }}</p>
          </div>

          <button type="submit" class="btn-outline-tech w-100 mb-3" :disabled="isLoading">
            {{ isLoading ? '發送中...' : '發送重設郵件' }}
          </button>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <div class="success-icon mb-4">
          <i class="fa fa-paper-plane-o text-success" style="font-size: 3rem;"></i>
        </div>
        <h3 class="fw-bold mb-3">郵件已發送！</h3>
        <p class="text-muted small mb-5">
          請檢查您的信箱 <strong>{{ email }}</strong>，<br>
          並點擊郵件中的連結來重設密碼。
        </p>
        <button class="btn-outline-tech w-100" @click="isSent = false">重新輸入</button>
      </div>

      <div class="text-center mt-5">
        <router-link to="/users/login" class="back-link small">
          <i class="fa fa-arrow-left me-2"></i>返回登入
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const isSent = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleResetRequest = async () => {
  error.value = ''

  if (!email.value) {
    error.value = '請輸入電子郵件'
    return
  }

  try {
    isLoading.value = true

    await axios.post('https://localhost:7218/api/Auth/forgot-password', {
      email: email.value
    })

    isSent.value = true
  } catch (err) {
    error.value = err.response?.data || '發送失敗，請稍後再試'
  } finally {
    isLoading.value = false
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
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 45px;
}

.tech-blue-text { color: #f38d00; }

/* 底線輸入框 */
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

.minimal-input:focus ~ .floating-label,
.minimal-input:not(:placeholder-shown) ~ .floating-label {
  top: -18px;
  font-size: 12px;
  color: #f38d00;
}

/* 空心按鈕風格 */
.btn-outline-tech {
  background: transparent;
  border: 1.5px solid #f38d00;
  color: #f38d00;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn-outline-tech:hover {
  background: #f38d00;
  color: #ffffff;
}

.btn-outline-tech:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.back-link {
  color: #888;
  text-decoration: none;
  transition: 0.3s;
}

.back-link:hover {
  color: #4e73df;
}

.error-msg {
  color: #e74a3b;
  font-size: 11px;
  margin-top: 5px;
  position: absolute;
}
</style>