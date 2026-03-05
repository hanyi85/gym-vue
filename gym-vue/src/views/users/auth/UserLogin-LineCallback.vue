<script setup>
import { onMounted, nextTick } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "@/services/api"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  const code = route.query.code
  const returnedState = route.query.state
  const originalState = sessionStorage.getItem("line_state")

  // 驗證 code 與 state
  if (!code || !returnedState || returnedState !== originalState) {
    alert("State 驗證失敗或授權無效")
    router.push("/users/login")
    return
  }

  // 驗證完就刪除
  sessionStorage.removeItem("line_state")

  try {
    const res = await api.post("/Auth/line-login", { code })
    const data = res.data

    if (data.needEmail) {
      router.push({
        path: "/users/line-register",
        query: {
          lineUserId: data.lineUserId,
          name: data.name,
          picture: data.picture
        }
      })
      return
    }

    auth.login(data.token, data.name)
    await nextTick()
    router.push("/users/home")

  } catch (err) {
    alert("LINE 登入失敗")
    router.push("/users/login")
  }
})
</script>

<template>
  <div class="loading-wrapper">
    <div class="card">
      <div class="spinner"></div>
      <h3>LINE 登入中</h3>
      <p>請稍候，正在為您驗證身分...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f7ff, #f5faff);
  animation: fadeIn 0.6s ease-in-out;
}

.card {
  background: white;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e5e5e5;
  border-top: 5px solid #00c300; /* LINE 綠 */
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

h3 {
  margin: 10px 0;
  font-weight: 600;
}

p {
  font-size: 14px;
  color: #666;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>