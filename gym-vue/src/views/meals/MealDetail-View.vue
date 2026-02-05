<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* 路由 */
const route = useRoute()
const router = useRouter()
const mealId = route.params.mealId

/* 餐點資料（之後 API 取代） */
const meal = ref({
  id: mealId,
  name: '雞胸肉健康餐',
  imageUrl: '/assets/img/meals/1.jpg',
  calories: 520,
  protein: 42,
  carbs: 45,
  fat: 10
})

/* 取餐時段（之後 API 取代） */
const timeSlots = ref([
  { id: 1, label: '11:00 - 12:00' },
  { id: 2, label: '12:00 - 13:00' },
  { id: 3, label: '18:00 - 19:00' }
])

/* 使用者選擇 */
const selectedDate = ref('')
const selectedTimeSlotId = ref(null)
const quantity = ref(1)

/* 日期限制 */
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)

const threeMonthsLater = new Date(today)
threeMonthsLater.setMonth(today.getMonth() + 3)

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

const minDate = formatDate(tomorrow)
const maxDate = formatDate(threeMonthsLater)

/* 動作（之後接 API） */
function addToCart() {
  const payload = {
    mealId: meal.value.id,
    pickupDate: selectedDate.value,
    timeSlotId: selectedTimeSlotId.value,
    quantity: quantity.value
  }
  console.log('加入購物車資料', payload)
}

function buyNow() {
  addToCart()
  router.push('/meals/cart')
}
</script>




<template>
  <div class="container py-5">
    <div class="row justify-content-center align-items-start g-4">

      <!-- 圖片 -->
      <div class="col-12 col-md-5 text-center">
        <img
          :src="meal.imageUrl"
          class="img-fluid rounded shadow-sm"
          :alt="meal.name"
        />
      </div>

      <!-- 餐點資訊 -->
      <div class="col-12 col-md-5">
        <h2 class="fw-bold mb-2">{{ meal.name }}</h2>

        <h5 class="text-muted mb-1">
          熱量：{{ meal.calories }} kcal
        </h5>

        <p class="mb-3">
          蛋白質：{{ meal.protein }} g /
          醣類：{{ meal.carbs }} g /
          脂質：{{ meal.fat }} g
        </p>

        <!-- 取餐日期 -->
        <div class="mb-3">
          <label class="form-label">取餐日期</label>
          <input
            type="date"
            v-model="selectedDate"
            class="form-control"
            :min="minDate"
            :max="maxDate"
          />
        </div>

        <!-- 取餐時段 + 份數 -->
        <div class="row mb-4">
          <div class="col-7">
            <label class="form-label">取餐時段</label>
            <select
              class="form-select"
              v-model="selectedTimeSlotId"
            >
              <option disabled value="">請選擇</option>
              <option
                v-for="slot in timeSlots"
                :key="slot.id"
                :value="slot.id"
              >
                {{ slot.label }}
              </option>
            </select>
          </div>

          <div class="col-5">
            <label class="form-label">份數</label>
            <input
              type="number"
              class="form-control"
              min="1"
              v-model="quantity"
            />
          </div>
        </div>

        <!-- 按鈕 -->
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-primary w-50"
            @click="addToCart"
          >
            加入購物車
          </button>

          <button
            class="btn btn-primary w-50"
            @click="buyNow"
          >
            直接購買
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
