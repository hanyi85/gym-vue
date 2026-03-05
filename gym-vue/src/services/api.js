import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

/* =====================
   Request 攔截器
===================== */
api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  const token = auth.token || localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* =====================
   Response 攔截器
===================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore()

    if (error.response && error.response.status === 401) {
      let isLoginApi = false

      if (error.config && error.config.url && error.config.url.includes('/Auth/')) {
        isLoginApi = true
      }

      if (auth.isLoggedIn && !isLoginApi) {
        console.log('Token 可能過期，自動登出')
        auth.logout()
        router.push('/users/login')
      }
    }
    return Promise.reject(error)
  }
)

export default api
