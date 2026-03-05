import { ref } from "vue"
import { useAuthStore } from "@/stores/auth"
export function useEmailVerify(verifyFn) {
  const auth = useAuthStore()
  const status = ref("idle")
  const message = ref("")

async function execute(token) {
  if (!token) {
    status.value = "error"
    message.value = "驗證連結無效"
    return
  }

  status.value = "loading"
  message.value = "正在驗證中..."

  try {
    const res = await verifyFn(token)
     const jwt = res.data.token
if (jwt) {
        auth.setToken(jwt)   // 存 Pinia
      }
    // 只要成功回來就算驗證成功
    status.value = "success"
    message.value = res.data.message || "你的電子郵件已完成驗證"

  } catch (err) {

    status.value = "error"

    if (
      err &&
      err.response &&
      err.response.data &&
      err.response.data.message
    ) {
      message.value = err.response.data.message
    } else {
      message.value = "驗證失敗或連結已過期"
    }

  }
}

  return {
    status,
    message,
    execute
  }
}