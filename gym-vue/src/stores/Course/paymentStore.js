import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore('payment', () => {
  const bookingId = ref(null)

  function setBooking(id) {
    bookingId.value = id
    sessionStorage.setItem('payBookingId', id)
  }

  function loadFromSession() {
    const id = sessionStorage.getItem('payBookingId')
    if (id) bookingId.value = Number(id)
  }

  function clear() {
    bookingId.value = null
    sessionStorage.removeItem('payBookingId')
  }

  return { bookingId, setBooking, loadFromSession, clear }
})