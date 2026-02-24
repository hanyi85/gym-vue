<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from './components/Footer.vue'

const router = useRouter()

onMounted(() => {
  const raw = localStorage.getItem('pending_booking')
  if (!raw) return

  const b = JSON.parse(raw)
  localStorage.removeItem('pending_booking')

  router.replace({
    name: 'courses-booking-success',
    query: {
      scheduleId: b.scheduleId,
      courseId: b.courseId,
      course: b.course,
      date: b.date,
      time: b.time,
      price: b.price,
      coach: b.coach,
      name: b.name,
      phone: b.phone,
      note: b.note,
      orderId: 'NP' + Date.now(),
      paid: 'true',
      paymentMethod: 'credit',
    },
  })
})
</script>

<template>
  <div class="layout">
    <Header />
    <main class="content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>


<style>
/*  全域 / 版型 / layout 專用 */
html {
  --vueuse-safe-area-top: 0px;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding-top: 0;
  overflow: auto;
}

.content > :first-child {
  margin-top: 0;
}

</style>
