<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MealActionButton from '@/components/Meals/MealdetailButton.vue'

const apiUrl="https://localhost:7193/api/"

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
  fat: 10,
  price: 160
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
  <div class=" min-vh-100 py-2 container">
    <nav aria-label="breadcrumb" class="mb-3">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><router-link to="/meals" class="text-orange">餐點列表</router-link></li>
              <li class="breadcrumb-item active">{{ meal.name }}</li>
            </ol>
          </nav>
    <div class="container meal-detail rounded-4 shadow-sm p-4 p-md-5">
      <div class="row justify-content-center g-5">
        
        <div class="col-12 col-md-6 col-lg-5">
          <div class="image-wrapper shadow-sm rounded-4 overflow-hidden">
            <img :src="meal.imageUrl" class="img-fluid w-100 h-100 object-fit-cover" :alt="meal.name" />
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-5">
          <h1 class="fw-bold text-dark mb-3">{{ meal.name }}</h1>
          <div class="price-wrapper mb-2">
      <span class="currency">NT$</span>
      <span class="price-amount">{{ meal.price }}</span>
    </div>

          <div class="nutrition-grid mb-4">
            <div class="nutrition-card">
              <span class="label">熱量</span>
              <span class="value">{{ meal.calories }} <small>kcal</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">蛋白質</span>
              <span class="value">{{ meal.protein }} <small>g</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">碳水</span>
              <span class="value">{{ meal.carbs }} <small>g</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">脂質</span>
              <span class="value">{{ meal.fat }} <small>g</small></span>
            </div>
          </div>

          <hr class="opacity-10 my-4" />

          <div class="order-options">
            <div class="mb-4">
              <label class="form-label fw-bold"><i class="bi bi-calendar-event me-2"></i>取餐日期</label>
              <input type="date" v-model="selectedDate" class="form-control custom-input" :min="minDate" :max="maxDate" />
            </div>

            <div class="row mb-4">
              <div class="col-7">
                <label class="form-label fw-bold"><i class="bi bi-clock me-2"></i>取餐時段</label>
                <select class="form-select custom-input" v-model="selectedTimeSlotId">
                  <option disabled value="null">請選擇</option>
                  <option v-for="slot in timeSlots" :key="slot.id" :value="slot.id">{{ slot.label }}</option>
                </select>
              </div>
              <div class="col-5">
                <label class="form-label fw-bold"><i class="bi bi-basket me-2"></i>份數</label>
                <div class="input-group">
                  <button class="btn btn-outline-secondary" @click="quantity > 1 ? quantity-- : null">-</button>
                  <input type="number" class="form-control text-center custom-input border-x-0" v-model="quantity" min="1" />
                  <button class="btn btn-outline-secondary" @click="quantity++">+</button>
                </div>
              </div>
            </div>

            <div class="row g-3 mt-2">
              <div class="col-6">
                <MealActionButton type="add" @click="addToCart">
                  加入購物車
                </MealActionButton>
              </div>
              <div class="col-6">
                <MealActionButton type="buy" @click="buyNow">
                  直接購買
                </MealActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meal-detail {
  background-color: #fffaf4; /* 你的背景色 */
}

.text-orange {
  color: #f3722c;
  text-decoration: none;
}

.image-wrapper {
  aspect-ratio: 1 / 1;
}

/* 營養資訊卡片化佈局 */
.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.nutrition-card {
  background-color: #F9F1E7;
  padding: 10px 5px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.nutrition-card:hover {
  background-color: #F2E8DF;
  border-color: #ffe0c3;
}

.nutrition-card .label {
  display: block;
  font-size: 0.75rem;
  color: #777;
  margin-bottom: 4px;
}

.nutrition-card .value {
  display: block;
  font-weight: 700;
  color: #333;
}

/* 表單優化 */
.custom-input {
  border-radius: 10px;
  padding: 10px 15px;
  border: 1px solid #dee2e6;
  background-color: #fdfdfd;
}

.custom-input:focus {
  border-color: #ff9f1c;
  box-shadow: 0 0 0 0.25rem rgba(255, 159, 28, 0.15);
}

.input-group .btn {
  border-color: #dee2e6;
}

@media (max-width: 768px) {
  .nutrition-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 價格樣式：強調橘色與粗體 */
.price-wrapper {
  white-space: nowrap; /* 確保價格不會斷行 */
  color: #f3722c;
  font-weight: 800;
  font-size: 1rem;
}

.currency {
  font-size: 2rem;
  margin-right: 1px;
}

.price-amount {
  font-size: 2rem;
}
</style>
