<script setup>
import { onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "@/api"

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state
  const savedState = sessionStorage.getItem("line_state")

  if (!code || state !== savedState) {
    router.push("/users/login")
    return
  }

  try {
    const res = await api.post("/Auth/line-login", { code })

    const data = res.data

    localStorage.setItem("token", data.token)
    localStorage.setItem("userId", data.userId)
    localStorage.setItem("name", data.name)

    router.push("/users/profile")
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