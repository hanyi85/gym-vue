import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userName: localStorage.getItem('userName') || '',
    showWelcomeMessage: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    login(token, userName) {
      this.token = token
      this.userName = userName
      this.showWelcomeMessage = this.showWelcomeMessage

      localStorage.setItem('token', token)
      localStorage.setItem('userName', userName)
    },

    logout() {
      this.token = ''
      this.userName = ''
      this.showWelcomeMessage = false


      localStorage.removeItem('token')
      localStorage.removeItem('userName')
    },
      clearWelcomeMessage() {
      this.showWelcomeMessage = false
    }
  }
})