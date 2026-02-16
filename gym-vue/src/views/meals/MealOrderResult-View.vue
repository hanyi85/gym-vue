<script setup>
import StepIndicator from "@/components/Meals/StepIndicator.vue";
import Btn from '@/components/btn.vue'

import { ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
// import { useOrderStore } from '@/stores/useOrderStore'

import OrderInfoCard from '@/components/Meals/OrderInfoCard.vue'
import OrderItemList from '@/components/Meals/OrderItemList.vue'

const apiUrl="https://localhost:7193/api/"

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
    <div class="order-complete-container text-center">
  <div class="success-checkmark">
    <div class="check-icon">
      <span class="icon-line line-tip"></span>
      <span class="icon-line line-long"></span>
      <div class="icon-circle"><i class="bi bi-check-lg"></i></div>
      <div class="icon-fix"></div>
    </div>
  </div>

  <h2 class="order-title mb-2">訂單已完成！</h2>
  <p class="order-subtitle mb-4">感謝您的支持，我們將會準備好美味的餐點。</p>
  
</div>

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

/* 標題美化 */
.order-title {
  color: #f3722c;
  font-weight: 800;
  font-size: 2rem;
  letter-spacing: 1px;
  /* 增加一點進場動畫 */
  animation: slideUp 0.5s ease-out;
}

.order-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}



/* 進場動畫 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --- 勾選動畫實作 (精簡版) --- */
.success-checkmark {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #f3722c;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  /* 這裡可以用真正的 SVG 或 Icon */
  box-shadow: 0 4px 15px rgba(243, 114, 44, 0.3);
}

/* 給勾選框一個縮放動畫 */
.success-checkmark {
  animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
</style>