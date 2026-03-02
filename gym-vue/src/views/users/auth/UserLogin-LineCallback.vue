<script setup>
import { onMounted,nextTick  } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "@/services/api"
import { useAuthStore } from "@/stores/auth"
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
onMounted(async () => {
  const code = route.query.code
  const state = route.query.state
  const savedState = sessionStorage.getItem("line_state")

  if (!code || state !== savedState) {
    router.push("/users/login")
    return
  }

  sessionStorage.removeItem("line_state")

  try {
    const res = await api.post("/Auth/line-login", { code })
    const data = res.data

    // 如果需要補 Email
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

    //  正常登入
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
  <div style="padding:40px;text-align:center">
    <h3>LINE 登入中...</h3>
  </div>
</template>