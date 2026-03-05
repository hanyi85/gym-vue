import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userName: localStorage.getItem('userName') || '', email: localStorage.getItem('email') || '',
    showWelcomeMessage: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
      setToken(token) {
    this.token = token
    localStorage.setItem("token", token)
  },
    login(token, userName,email) {
      this.token = token
      this.userName = userName
      this.email = email
      this.showWelcomeMessage = true

      localStorage.setItem('token', token)
      localStorage.setItem('userName', userName)
       localStorage.setItem('email', email)
    },

    logout() {
      this.token = ''
      this.userName = ''
      this.email = ''
      this.showWelcomeMessage = false

      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      localStorage.removeItem('email')
    },
      clearWelcomeMessage() {
      this.showWelcomeMessage = false
    }
  }
})