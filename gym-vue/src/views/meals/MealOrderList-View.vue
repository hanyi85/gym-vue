<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Btn from '@/components/Meals/nextbtn.vue'
import StepIndicator from "@/components/Meals/StepIndicator.vue";
import CartItemCard from '@/components/Meals/CartItemCard.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/mealAuthStore'

const authStore = useAuthStore()
const UserId = authStore.member.UserId

const apiUrl="https://localhost:7218/api"

const router = useRouter()

const orderId = ref(null)
const cartItems = ref([])

// 假資料
// const mockCartData = {
//   orderId: 999,
//   items: [
//     {
//       orderItemId: 1,
//       mealId: 101,
//       mealName: '高蛋白雞胸餐',
//       pickDate: '2026-02-10',
//       selectedTimeSlotId: 2,
//       pickTime: '12:00 - 13:00',
//       qty: 2,
//       unitPrice: 120,
//       subtotal: 240,
//       imageUrl: '/assets/img/meals/1.jpg'
//     },
//     {
//       orderItemId: 2,
//       mealId: 102,
//       mealName: '低脂鮭魚餐',
//       pickDate: '2026-02-11',
//       selectedTimeSlotId: 1,
//       pickTime: '18:00 - 19:00',
//       qty: 1,
//       unitPrice: 320,
//       subtotal: 320,
//       imageUrl: '/assets/img/meals/1.jpg',
//     }
//   ]
// }

/* 取餐時段 */
const timeSlots = ref([])

/* 後台抓取餐時間 */
async function fetchTimeSlots() {
  const res = await axios.get(`${apiUrl}/TMealPickUpTimes/active`)
  timeSlots.value = res.data.map(t => ({
    id: t.FPickUpTimeId,
    label: `${t.FStartTime.substring(0,5)} - ${t.FEndTime.substring(0,5)}`
  }))
}

// 總金額
const totalAmount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.subtotal, 0)
)

// 模擬取得購物車
// const getCart = () => {
//   orderId.value = mockCartData.orderId
//   cartItems.value = mockCartData.items
// }
async function getCart() {
  const res = await axios.get(`${apiUrl}/TMealCarts/Cart/${UserId}`)
  orderId.value = res.data.orderId
  cartItems.value = res.data.items
}

// 模擬刪除
const deleteItem = (orderItemId) => {
  if (!confirm('確定要刪除這份餐點嗎？')) return
  cartItems.value = cartItems.value.filter(i => i.orderItemId !== orderItemId)
}

// 下一步
const goConfirm = () => {
  router.push('/meals/confirm')
}

const goshopping = () => {
  router.push('/meals')
}

onMounted(() => {
  getCart(),
  fetchTimeSlots()
})


</script>





<template>
<div>
<StepIndicator :currentStep="1"/>

</div>

  <div class="container py-3">
  <div class="d-flex align-items-center mb-4 cartheader">
      <i class="bi bi-cart-fill text-orange fs-4 me-3"></i>
    <h3 class="fw-bold mb-0">購物車內容</h3>
  </div>

  <div
    class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4"
    v-if="cartItems && cartItems.length > 0"
  >
    <CartItemCard
      v-for="item in cartItems"
      :key="item.orderItemId"
      :item="item"
      :timeSlots="timeSlots"
      @update="handleUpdate"
      @delete="deleteItem"
    />
  </div>

  <div v-else class="text-center py-5">
        <i class="bi bi-cart-x display-1 text-muted"></i>
        <p class="mt-3 text-muted">購物車目前沒有餐點</p>
        <div class=" d-flex justify-content-center mt-5 ">
          <btn
        buyText="去選餐"
        @buy="goshopping"
      >
      </btn>
          
        </div>
        
      </div>
  <div
    class="mt-5 p-4 amountblock rounded-4 shadow-sm d-flex justify-content-between align-items-center border-start border-orange border-5"
  >
    <div>
      <span class="text-muted ">共  {{ cartItems?.length || 0 }} 項餐點明細</span>
      <h4 class="mb-0 fw-bold  ">總金額</h4>
    </div>
    <div class="text-end">
      <h2 class="price-text fw-bold mb-2">${{ totalAmount }}</h2>
      
    </div>
  </div>
</div>

<div class="container d-flex justify-content-end mb-3">
  <btn
        buyText="下一步"
        :disabled="cartItems.length === 0"
        @buy="goConfirm"
      >
      </btn>

</div>
      
    
 
</template>





<style>
.bg-orange {
  background-color: #ff9f1c;
}
.price-text {
  color: #f3722c;
}
.btn-orange-filled {
  background-color: #ff9f1c;
  color: white;
  border: none;
  transition: 0.3s;
}
.btn-orange-filled:hover {
  background-color: #f3722c;
  box-shadow: 0 4px 15px rgba(243, 114, 44, 0.3);
  color: white;
}
.border-orange {
  border-color: #ff9f1c !important;
}

.cartheader {
  color:  #ff9f1c;
}

.amountblock {
  background-color: #ffe0cc;
}


</style>