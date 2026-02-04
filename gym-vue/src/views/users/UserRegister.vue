<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="title">會員註冊</h2>
      <p class="subtitle">建立你的專屬帳號</p>

      <form @submit.prevent="handleRegister">
        <!-- 帳號 -->
        <div class="form-group">
          <label>帳號</label>
          <input
            v-model="form.account"
            type="text"
            placeholder="請輸入帳號"
          />
          <p v-if="errors.account" class="error-text">
            {{ errors.account }}
          </p>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="請輸入 Email"
          />
          <p v-if="errors.email" class="error-text">
            {{ errors.email }}
          </p>
        </div>

        <!-- 密碼 -->
        <div class="form-group">
          <label>密碼</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
          />
          <p v-if="errors.password" class="error-text">
            {{ errors.password }}
          </p>
        </div>

        <!-- 確認密碼 -->
        <div class="form-group">
          <label>確認密碼</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="請再次輸入密碼"
          />
          <p v-if="errors.confirmPassword" class="error-text">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- 註冊按鈕 -->
        <button class="btn-primary" type="submit">
          註冊
        </button>
      </form>

      <!-- 底部連結 -->
      <div class="footer">
        <span>已經有帳號？</span>
        <RouterLink to="/users/login">前往登入</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validate = () => {
  let isValid = true

  // 清空錯誤
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!form.account) {
    errors.account = '請輸入帳號'
    isValid = false
  }

  if (!form.email) {
    errors.email = '請輸入 Email'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.email = 'Email 格式不正確'
    isValid = false
  }

  if (!form.password) {
    errors.password = '請輸入密碼'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密碼至少需 6 碼'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = '請再次輸入密碼'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '兩次密碼輸入不一致'
    isValid = false
  }

  return isValid
}

const handleRegister = () => {
  if (!validate()) return

  // 🚧 之後接 API
  console.log('Register data:', form)

  // 模擬成功後導回登入
  router.push('/user/login')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7f6;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  color: #777;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
}

input:focus {
  border-color: #7a9d96;
}

/* ⭐ 錯誤提示樣式（跟登入一致） */
.error-text {
  margin-top: 4px;
  font-size: 12px;
  color: #d9534f;
}

.btn-primary {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #7a9d96;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #6b8f88;
}

.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.footer a {
  margin-left: 6px;
  color: #7a9d96;
  text-decoration: none;
  font-weight: 500;
}
</style>


