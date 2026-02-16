<script setup>
import Btn from '@/components/Meals/submitbtn.vue'
import StepIndicator from "@/components/Meals/StepIndicator.vue";
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const apiUrl="https://localhost:7193/api/"



const router = useRouter()
//訂單編號已在資料庫  要改

// 🔹 假「登入會員資料」
const fakeMember = {
  name: '王小明',
  phone: '0912345678',
  email: 'test@gmail.com'
}

// 🔹 假「取餐店家」
const stores = ref([
  { id: 1, name: '台北信義店' },
  { id: 2, name: '台中公益店' },
  { id: 3, name: '高雄巨蛋店' }
])

// 🔹 付款方式
const payments = [
  { value: 'cash', label: '現金付款' },
  { value: 'credit', label: '信用卡' },
  { value: 'transfer', label: '轉帳' }
]

// 🔹 訂單資料
const order = ref({
  name: '',
  phone: '',
  email: '',
  storeId: '',
  paymentMethod: 'cash'
})

// 下一步
// const goConfirm = () => {
//   router.push('/meals/result/:orderId')
// }

// 模擬「頁面載入時已登入」
onMounted(() => {
  order.value.name = fakeMember.name
  order.value.phone = fakeMember.phone
  order.value.email = fakeMember.email
})

// 送出訂單
const submitOrder = () => {


  // 🔹 假建立訂單
  const fakeOrderId = 1

  // 🔹 信用卡例外
  if (order.value.paymentMethod === 'credit') {
    alert('導向第三方信用卡付款（假）')
    return
  }

  // ✅ 成功後導頁
  router.push({
    name: 'meals-result',
    params: {
      orderId: fakeOrderId
    }
  })
}

</script>



<template>
  <div>
<StepIndicator :currentStep="2"/>

</div>
  <section class="form-wrapper">
    <form class="order-form" @submit.prevent="submitOrder">
      <!-- 姓名 -->
      <div class="mb-3">
        <label class="form-label">姓名</label>
        <input
          type="text"
          class="form-control"
          v-model="order.name"
          placeholder="請輸入姓名"
        />
      </div>

      <!-- 電話 -->
      <div class="mb-3">
        <label class="form-label">電話</label>
        <input
          type="text"
          class="form-control"
          v-model="order.phone"
          placeholder="請輸入電話"
        />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          v-model="order.email"
          placeholder="example@mail.com"
        />
      </div>

      <!-- 取餐店家 -->
      <div class="mb-3">
        <label class="form-label">取餐店家</label>
        <select class="form-select" v-model="order.storeId">
          <option disabled value="">請選擇</option>
          <option
            v-for="store in stores"
            :key="store.id"
            :value="store.id"
          >
            {{ store.name }}
          </option>
        </select>
      </div>

      <!-- 付款方式 -->
      <div class="mb-3">
        <label class="form-label">付款方式</label>
        <div
          class="form-check"
          v-for="p in payments"
          :key="p.value"
        >
          <input
            class="form-check-input"
            type="radio"
            v-model="order.paymentMethod"
            :value="p.value"
          />
          <label class="form-check-label">
            {{ p.label }}
          </label>
        </div>
      </div>

      <!-- 按鈕 -->
      <!-- <button type="submit" class="btn-submit">
        送出訂單
      </button> -->
      <Btn buyText="下一步" type="submit" />
    </form>
  </section>


</template>




<style scoped>
.form-wrapper {
  max-width: 600px;
  margin: 40px auto;
  padding: 25px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.order-form .form-label {
  font-weight: 600;
  color: #333;
}

.order-form .form-control,
.order-form .form-select {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.order-form .form-control:focus,
.order-form .form-select:focus {
  border-color: #ff9f1c;
  box-shadow: 0 0 6px rgba(255,159,28,0.4);
}

.form-check-input:checked {
  background-color: #f3722c;
  border-color: #f3722c;
}

.btn-submit {
  display: block;
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #ff9f1c, #f3722c);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  background: linear-gradient(90deg, #d65a1a, #f3722c);
}
</style>

