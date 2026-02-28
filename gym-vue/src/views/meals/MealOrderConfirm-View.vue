<script setup>
import Btn from '@/components/Meals/submitbtn.vue'
import StepIndicator from "@/components/Meals/StepIndicator.vue";
import { ref, onMounted,watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { useAuthStore } from '@/stores/mealAuthStore'

const authStore = useAuthStore()
const UserId=authStore.member.UserId


const apiUrl="https://localhost:7218/api"



const router = useRouter()
//訂單編號已在資料庫  要改

// 假「登入會員資料」
// const fakeMember = {
//   name: '王小明',
//   phone: '0912345678',
//   email: 'test@gmail.com'
// }

// 取餐店家」
const stores = ref([])

// 付款方式
const payments = [
  { value: 'cash', label: '現金付款' },
  { value: 'credit', label: '信用卡' },
  { value: 'transfer', label: '轉帳' }
]

//  訂單資料
const order = ref({
  name: '',
  phone: '',
  email: '',
  storeId: '',
  paymentMethod: 'cash'
})

// 錯誤訊息
const errors = ref({})

/* 後台抓取餐分店 */
async function fetchVenues() {
  const res = await axios.get(`${apiUrl}/TMealOrders/MealVenues`)
  stores.value = res.data.map(t => ({
    id: t.VenueId,
    name: t.VenueName
  }))
}

/* 模擬有登入抓取會員資料 */
watch(
  () => authStore.member,
  (member) => {
    if (member) {
      order.value.name = member.Name
      order.value.phone = member.Phone
      order.value.email = member.Email
    }
  },
  { immediate: true }
)


// 模擬「頁面載入時已登入」
onMounted(() => fetchVenues()
)


//驗證規則
const validateForm = () => {
  errors.value = {}

  // 姓名
  if (!order.value.name?.trim()) {
    errors.value.name = '請輸入姓名'
  }

  // 手機
  if (!order.value.phone?.trim()) {
    errors.value.phone = '請輸入電話'
  } else if (!/^09\d{8}$/.test(order.value.phone)) {
    errors.value.phone = '請輸入正確的手機格式 (09開頭10碼)'
  }

  // Email
  if (!order.value.email?.trim()) {
    errors.value.email = '請輸入Email'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.value.email)) {
    errors.value.email = 'Email格式不正確'
  }

  // 店家
  if (!order.value.storeId) {
    errors.value.storeId = '請選擇取餐店家'
  }

  return Object.keys(errors.value).length === 0
}

//防止重複送訂單
const loading = ref(false)

// 送出訂單
async function submitOrder() {
  // 防止重複送出
  if (loading.value) return

  // 驗證失敗就停止
  if (!validateForm()) return

  try {
    loading.value = true

    const res = await axios.post(
      `${apiUrl}/TMealCarts/Checkout/${UserId}`,
      {
        name: order.value.name,
        phone: order.value.phone,
        email: order.value.email,
        venueId: order.value.storeId,
        payMethod: order.value.paymentMethod
      }
    )

    const orderId = res.data

    // 信用卡付款
    if (order.value.paymentMethod === 'credit') {
      const payRes = await axios.post(
        `${apiUrl}/ECPayPayment/Create`,
        { orderId }
      )

      const div = document.createElement('div')
      div.innerHTML = payRes.data
      const form = div.querySelector('form')

      document.body.appendChild(form)
      form.submit()

      return   //  重要：這裡直接結束

    } else {

      await axios.post(`${apiUrl}/TMealCarts/OrderFinish/${UserId}`)

      router.push({
        name: 'meals-result',
        params: { orderId }
      })
    }

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

//自動清除錯誤

watch(order, () => {
  errors.value = {}
}, { deep: true })

</script>



<template>
  <div>
<StepIndicator :currentStep="2"/>

</div>
  <section class="form-wrapper">
    <form class="order-form" @submit.prevent="submitOrder">
      <div class="text-end text-muted small">
  <span class="text-danger">*</span> 所有欄位皆為必填
</div>

      <!-- 姓名 -->
      <div class="mb-3">
        <label class="form-label">姓名</label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.name }"
          v-model="order.name"
          placeholder="請輸入姓名"
        />
        <div class="invalid-feedback">
          {{ errors.name }}
        </div>
      </div>

      <!-- 電話 -->
      <div class="mb-3">
        <label class="form-label">電話</label>
        <input
          type="text"
          class="form-control"
          v-model="order.phone"
          :class="{ 'is-invalid': errors.phone }"
          placeholder="請輸入電話"
        />
        <div class="invalid-feedback">
          {{ errors.phone }}
        </div>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors.email }"
          v-model="order.email"
          placeholder="example@mail.com"
        />
        <div class="invalid-feedback">
          {{ errors.email }}
        </div>
      </div>

      <!-- 取餐店家 -->
      <div class="mb-3">
        <label class="form-label">取餐店家</label>
        <select class="form-select"  :class="{ 'is-invalid': errors.storeId }" v-model="order.storeId">
          <option disabled value="">請選擇</option>
          <option
            v-for="store in stores"
            :key="store.id"
            :value="store.id"
          >
            {{ store.name }}
          </option>
        </select>
        <div class="invalid-feedback">
          {{ errors.storeId }}
        </div>
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
      <!-- <button type="submit" class="btn-submit :loading="loading"">
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

