import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {

  // 🔥 模擬登入會員
  const member = ref({
    UserId: 1,
    Name: '王小明',
    Email: 'ming01@test.com',
    Phone:'0912345678'
  })

  const isLogin = computed(() => !!member.value)

  // 模擬切換會員
  const mockLogin = (id) => {
    member.value = {
      memberId: id,
      name: `測試會員${id}`,
      email: `test${id}@gmail.com`
    }
  }

  const logout = () => {
    member.value = null
  }

  return {
    member,
    isLogin,
    mockLogin,
    logout
  }
})
