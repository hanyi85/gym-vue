<template>
  <div class="auth-page">
    <div class="auth-card shadow">

      <div class="header">
        <div class="avatar-wrapper">
          <img :src="picture" class="avatar" />
        </div>
        <h3 class="title">歡迎加入練吧</h3>
        <p class="subtitle">{{ name }}，請完成最後一步</p>
      </div>

      <form @submit.prevent="handleComplete">

        <div class="input-wrapper">
          <input
            type="email"
            v-model="email"
            class="minimal-input"
            placeholder=" "
            required
          />
          <label class="floating-label">電子信箱</label>
          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          <span v-if="!loading">完成註冊</span>
          <span v-else>處理中...</span>
        </button>

      </form>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { ref } from "vue"
import api from "@/services/api"
import { useAuthStore } from "@/stores/auth"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const lineUserId = route.query.lineUserId
const name = route.query.name
const picture = route.query.picture

const email = ref("")
const loading = ref(false)
const error = ref("")

const handleComplete = async () => {
  error.value = ""

  try {
    loading.value = true

    const res = await api.post("/Auth/complete-line-register", {
      lineUserId,
      email: email.value
    })

    auth.login(res.data.token, res.data.name)

    router.push("/users/profile-edit")

  } catch (err) {
    error.value = "註冊失敗，請確認 Email 是否正確"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

/* 整頁背景 */
.auth-page {
  min-height: 100vh;
  background: #f6f4f1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

/* 卡片 */
.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 50px 40px;
  text-align: center;
}

/* 頭部 */
.header {
  margin-bottom: 35px;
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.title {
  font-weight: 600;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 14px;
  color: #777;
}

/* 輸入框 */
.input-wrapper {
  position: relative;
  margin-bottom: 35px;
}

.minimal-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 12px 0;
  font-size: 15px;
  background: transparent;
  outline: none;
  transition: all 0.3s;
}

.minimal-input:focus {
  border-bottom: 2px solid #f38d00;
}

.floating-label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #aaa;
  pointer-events: none;
  transition: all 0.3s ease;
}

.minimal-input:focus ~ .floating-label,
.minimal-input:not(:placeholder-shown) ~ .floating-label {
  top: -15px;
  font-size: 12px;
  color: #f38d00;
  font-weight: 500;
}

/* 按鈕 */
.btn-primary {
  width: 100%;
  background: #f38d00;
  color: #fff;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn-primary:hover {
  background: #d97706;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 錯誤 */
.error-msg {
  color: #e53935;
  font-size: 12px;
  margin-top: 6px;
  text-align: left;
}

</style>