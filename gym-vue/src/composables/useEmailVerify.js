import { ref } from "vue"

export function useEmailVerify(verifyFn) {
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

      if (res.data.success) {
        status.value = "success"
        message.value = "你的電子郵件已完成驗證"
      } else {
        status.value = "error"
        message.value = res.data.message || "驗證失敗"
      }

    } catch (err) {
      status.value = "error"
      message.value =
        err.response?.data?.message || "驗證失敗或連結已過期"
    }
  }

  return {
    status,
    message,
    execute
  }
}