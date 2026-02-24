<template>
  <div class="verify-page">
    <div class="verify-card">

      <h2 class="title">認證你的電子郵件</h2>

      <div class="state">

        <!-- Loading -->
        <div v-if="status === 'loading'">
          <div class="icon loading">⏳</div>
          <p class="message">{{ message }}</p>
        </div>

        <!-- Success -->
        <div v-else-if="status === 'success'">
          <div class="icon success">✓</div>
          <p class="message">{{ message }}</p>

          <div class="actions">
            <router-link
              to="/users/profile-health"
              class="btn primary"
            >
              下一步
            </router-link>
          </div>
        </div>

        <!-- Error -->
        <div v-else>
          <div class="icon error">✕</div>
          <p class="message">{{ message }}</p>

          <div class="actions">
            <router-link
              to="/users/login"
              class="btn outline"
            >
              返回登入
            </router-link>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const status = ref('loading') 
const message = ref('正在驗證中...')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    status.value = 'error'
    message.value = '驗證連結無效'
    return
  }

  try {
    const res = await axios.get(
  "http://localhost:5265/api/Auth/verify-email",
  {
    params: { token }
  }
)

    if (res.data.success) {
      status.value = 'success'
      message.value = '你的電子郵件已完成驗證'
    } else {
      status.value = 'error'
      message.value = res.data.message || '驗證失敗'
    }

  } catch (err) {
    status.value = 'error'
    message.value = err.response?.data?.message || '驗證失敗或連結已過期'
  }
})
</script>

<style scoped>

/* ===== 整頁置中 ===== */
.verify-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f4f1;
  padding: 40px;
}

/* ===== 卡片 ===== */
.verify-card {
  width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 48px 36px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
}

/* ===== 標題 ===== */
.title {
  font-size: 22px;
  margin-bottom: 36px;
  color: #333;
  font-weight: 600;
}

/* ===== 狀態區塊 ===== */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.message {
  color: #555;
  font-size: 15px;
  line-height: 1.6;
}

/* ===== 圖示 ===== */
.icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon.loading {
  background: #f0f0f0;
}

.icon.success {
  background-color: #e8f5e9;
  color: #4caf50;
}

.icon.error {
  background-color: #fdecea;
  color: #e53935;
}

/* ===== 按鈕 ===== */
.actions {
  margin-top: 16px;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn.primary {
  background-color: #f38d00;
  color: #fff;
  border: none;
}

.btn.primary:hover {
  background-color: #d97706;
}

.btn.outline {
  border: 1px solid #ccc;
  color: #555;
  background: white;
}

.btn.outline:hover {
  background: #f2f2f2;
}

</style>