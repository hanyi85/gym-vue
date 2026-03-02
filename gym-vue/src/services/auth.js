import api from "@/services/api"
// 驗證信箱（新舊共用）
export function verifyEmail(token) {
  return api.get("/Auth/verify-email", {
    params: { token }
  })
}
// 重發驗證信
export function resendVerifyEmail(email) {
  return api.post("/Auth/resend-verify-email", {
    email
  })
}