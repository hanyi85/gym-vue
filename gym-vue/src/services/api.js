import axios from "axios"
import router from "@/router"

const api = axios.create({
  baseURL: "https://localhost:7218/api"
})

// 自動帶 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 統一處理 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      router.push("/users/login")
    }
    return Promise.reject(error)
  }
)

export default api