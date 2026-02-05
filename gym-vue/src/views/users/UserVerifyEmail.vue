<template>
  <div class="verify-wrapper">
    <div class="verify-card">
      <h2 class="title">認證你的電子郵件</h2>

      <!-- 驗證中 -->
      <div v-if="status === 'loading'" class="state">
        <div class="spinner"></div>
        <p class="message">我們正在驗證你的電子郵件，請稍候…</p>
      </div>

      <!-- 驗證成功 -->
      <div v-else-if="status === 'success'" class="state success">
        <div class="icon success">✓</div>
        <p class="message">你的電子郵件已完成驗證</p>
        <router-link to="/user/profile" class="btn primary">
          前往會員中心
        </router-link>
      </div>

      <!-- 驗證失敗 -->
      <div v-else class="state error">
        <div class="icon error">!</div>
        <p class="message">
          驗證連結已失效或不正確
        </p>
        <button class="btn outline" @click="resend">
          重新寄送驗證信
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = ref('loading')

// 模擬驗證流程（之後接 API）
onMounted(() => {
  const token = route.query.token

  setTimeout(() => {
    if (token) {
      status.value = 'success' // 模擬成功
      // status.value = 'error' // 需要時切換測試
    } else {
      status.value = 'error'
    }
  }, 1500)
})

const resend = () => {
  alert('已重新寄送驗證信（前端模擬）')
}
</script>

<style scoped>
.verify-wrapper {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
}

.verify-card {
  width: 420px;
  background: #fff;
  border-radius: 8px;
  padding: 40px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

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

/* spinner */
.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e0e0e0;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* icon */
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

.icon.error {
  background-color: #fdecea;
  color: #f44336;
}

/* button */
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

.btn.outline {
  background-color: transparent;
  border: 1px solid #ccc;
  color: #555;
}
</style>
