import { defineStore } from 'pinia'

const KEY = 'review_context'

export const useReviewStore = defineStore('review', {
  state: () => ({
    bookingId: 0,
  }),
  actions: {
    setBooking(id) {
      this.bookingId = Number(id || 0)
      sessionStorage.setItem(KEY, JSON.stringify({ bookingId: this.bookingId }))
    },
    loadFromSession() {
      try {
        const raw = sessionStorage.getItem(KEY)
        if (!raw) return
        const obj = JSON.parse(raw)
        this.bookingId = Number(obj?.bookingId || 0)
      } catch {}
    },
    clear() {
      this.bookingId = 0
      sessionStorage.removeItem(KEY)
    },
  },
})