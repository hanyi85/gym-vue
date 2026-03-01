import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userName: localStorage.getItem('userName') || ''
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    login(token, userName) {
      this.token = token
      this.userName = userName

      localStorage.setItem('token', token)
      localStorage.setItem('userName', userName)
    },

    logout() {
      this.token = ''
      this.userName = ''

      localStorage.removeItem('token')
      localStorage.removeItem('userName')
    }
  }
})