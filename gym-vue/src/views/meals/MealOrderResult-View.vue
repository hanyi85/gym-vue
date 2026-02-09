<script setup>
import StepIndicator from "@/components/Meals/StepIndicator.vue";
import Btn from '@/components/btn.vue'

import { ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
// import { useOrderStore } from '@/stores/useOrderStore'

import OrderInfoCard from '@/components/Meals/OrderInfoCard.vue'
import OrderItemList from '@/components/Meals/OrderItemList.vue'

const route = useRoute()
// const orderStore = useOrderStore()
const router = useRouter()

const orderId = route.params.orderId || orderStore.orderId

/* ======================
   假資料：訂單主檔
====================== */
const order = ref({
  fOrderId: orderId,
  fOrderName: '王小明',
  fOrderPhone: '0912-345-678',
  fOrderEmail: 'test@mail.com',
  fCartCreateAt: '2026-02-06 10:30',
  fOrderAt: '2026-02-06 10:45',
  fVenueId: 1,
  fTotalAmount: 980,
  fOrderStatus: '已付款',
  fPayMethod: '信用卡',
  fVenueName:'大安館'
})

/* ======================
   假資料：訂單明細（多筆）
====================== */
const orderItems = ref([
  {
    fOrderItemId: 1,
    fOrderId: orderId,
    fMealId: 101,
    fMealName: '高蛋白舒肥雞胸',
    fQty: 2,
    fUnitPrice: 180,
    fSubtotal: 360,
    fPickDate: '2026-02-07',
    fPickTimeID: '12:00-13:00',
    fQrContent: 'ORDERITEM-001',
    fPickupStatus: false,
    showQr: false,
    fMealImage: '/assets/img/meals/1.jpg',
   
  },
  {
    fOrderItemId: 2,
    fOrderId: orderId,
    fMealId: 205,
    fMealName: '低脂香煎鱸魚',
    fQty: 2,
    fUnitPrice: 310,
    fSubtotal: 620,
    fPickDate: '2026-02-07',
    fPickTimeID: '18:00-19:00',
    fQrContent: 'ORDERITEM-002',
    fPickupStatus: false,
    showQr: false,
    fMealImage: '/assets/img/meals/1.jpg',
    
  }
])

const goshopping = () => {
  router.push('/meals')
}
const allorder = () => {
  router.push('/users/order-history')
}



</script>



<template>
  <div>
<StepIndicator :currentStep="3"/>

</div>
  <div class="container py-4">
    <h2 class="text-center mb-4 order-title">訂單完成</h2>

    <OrderInfoCard :order="order" />

    <OrderItemList :items="orderItems" />
    <div class=" d-flex justify-content-center mt-5 ">
  <btn
        addText="全部訂單"
        @add="allorder"

        buyText="再次訂餐"
        @buy="goshopping"
      >
      </btn>
  </div>
    
  </div>
   

</template>

<style scoped>
.order-title {
  color: #f3722c;
  font-weight: bold;
}
</style>