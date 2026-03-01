import { defineStore } from 'pinia'

export const useBookingFlowStore = defineStore('bookingFlow', {
  state: () => ({
    slug: '',
    scheduleId: 0,

    // step2 填的資料
    name: '',
    phone: '',
    note: '',

    // 折扣
    discountCode: '',
    discountAmount: 0,

    // 金額
    price: 0,       // 原價
    finalPrice: 0,  // 折後價

    // step4 結果（可選）
    bookingId: 0,
  }),

  actions: {
    setStep2Payload(payload) {
      this.slug = payload.slug
      this.scheduleId = payload.scheduleId
      this.name = payload.name
      this.phone = payload.phone
      this.note = payload.note || ''
      this.discountCode = payload.discountCode || ''
      this.discountAmount = Number(payload.discountAmount || 0)
      this.price = Number(payload.price || 0)
      this.finalPrice = Number(payload.finalPrice || 0)
    },
    setBookingResult({ bookingId }) {
      this.bookingId = Number(bookingId || 0)
    },
    reset() {
      this.slug = ''
      this.scheduleId = 0
      this.name = ''
      this.phone = ''
      this.note = ''
      this.discountCode = ''
      this.discountAmount = 0
      this.price = 0
      this.finalPrice = 0
      this.bookingId = 0
    },
  },
})