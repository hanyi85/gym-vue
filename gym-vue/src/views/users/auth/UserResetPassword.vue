<template>
  <div class="auth-page d-flex align-items-center justify-content-center">
    <div class="auth-card shadow">

      <div v-if="!isSuccess">
        <div class="text-center mb-5">
          <h2 class="fw-bold tech-blue-text">重設密碼</h2>
          <p class="text-muted small">
            請輸入您的新密碼
          </p>
        </div>

        <form @submit.prevent="handleReset">
          <div class="input-wrapper mb-4">
            <input
              type="password"
              v-model="newPassword"
              class="minimal-input"
              placeholder=" "
              required
            >
            <label class="floating-label">新密碼</label>
          </div>

          <div class="input-wrapper mb-4">
            <input
              type="password"
              v-model="confirmPassword"
              class="minimal-input"
              placeholder=" "
              required
            >
            <label class="floating-label">確認密碼</label>
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button type="submit"
                  class="btn-outline-tech w-100"
                  :disabled="isLoading">
            {{ isLoading ? '處理中...' : '確認重設' }}
          </button>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <div class="success-icon mb-4">
          <i class="fa fa-check-circle text-success" style="font-size: 3rem;"></i>
        </div>
        <h3 class="fw-bold mb-3">密碼重設成功！</h3>
        <p class="text-muted small mb-4">
          您現在可以使用新密碼登入。
        </p>

        <router-link to="/users/auth/login" class="btn-outline-tech w-100 d-block">
          前往登入
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  token.value = route.query.token

  if (!token.value) {
    error.value = '無效的重設連結'
  }
})

const handleReset = async () => {
  error.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = '請填寫所有欄位'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = '兩次密碼不一致'
    return
  }

  try {
    isLoading.value = true

    await axios.post('https://localhost:7218/api/Auth/reset-password', {
      token: token.value,
      newPassword: newPassword.value
    })

    isSuccess.value = true
  } catch (err) {
    error.value = err.response?.data || '重設失敗或連結已過期'
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

.error-msg {
  color: #e74a3b;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>