<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Btn from '@/components/Meals/nextbtn.vue'
import StepIndicator from "@/components/Meals/StepIndicator.vue";


const router = useRouter()

const orderId = ref(null)
const cartItems = ref([])

// 假資料
const mockCartData = {
  orderId: 999,
  items: [
    {
      orderItemId: 1,
      mealId: 101,
      mealName: '高蛋白雞胸餐',
      pickDate: '2026-02-10',
      pickTime: '12:00 - 13:00',
      qty: 2,
      unitPrice: 120,
      subtotal: 240
    },
    {
      orderItemId: 2,
      mealId: 102,
      mealName: '低脂鮭魚餐',
      pickDate: '2026-02-11',
      pickTime: '18:00 - 19:00',
      qty: 1,
      unitPrice: 320,
      subtotal: 320
    }
  ]
}

// 總金額
const totalAmount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.subtotal, 0)
)

// 模擬取得購物車
const getCart = () => {
  orderId.value = mockCartData.orderId
  cartItems.value = mockCartData.items
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


onMounted(() => {
  getCart()
})


</script>





<template>
<section>
<StepIndicator :currentStep="2"/>

</section>

  <section class="container my-4">
    <h3 class="mb-3"> 我的購物車</h3>

    <table class="table table-bordered align-middle">
      <thead class="table-light">
        <tr>
          <th>餐點名稱</th>
          <th>取餐日期</th>
          <th>取餐時間</th>
          <th>份數</th>
          <th>單價</th>
          <th>小計</th>
          <th>操作</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in cartItems" :key="item.orderItemId">
          <td>{{ item.mealName }}</td>
          <td>{{ item.pickDate }}</td>
          <td>{{ item.pickTime }}</td>
          <td>{{ item.qty }}</td>
          <td>${{ item.unitPrice }}</td>
          <td class="text-danger fw-bold">${{ item.subtotal }}</td>
          <td>
            <button
              class="btn btn-sm btn-outline-danger"
              @click="deleteItem(item.orderItemId)"
            >
              刪除
            </button>
          </td>
        </tr>

        <tr v-if="cartItems.length === 0">
          <td colspan="7" class="text-center text-muted">
            購物車目前沒有餐點
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between align-items-center">
      <h5>
        總金額：
        <span class="text-danger fw-bold">${{ totalAmount }}</span>
      </h5>

      <btn
        buyText="下一步"
        :disabled="cartItems.length === 0"
        @buy="goConfirm"
      >
      </btn>
    </div>
  </section>
</template>





<style scoped>

</style>