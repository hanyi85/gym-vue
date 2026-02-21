<script setup>
import { ref, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MealActionButton from '@/components/Meals/MealdetailButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/mealAuthStore'

const authStore = useAuthStore()


const apiUrl="https://localhost:7218/api"

/* 路由 */
const route = useRoute()
const router = useRouter()
const mealId = route.params.mealId

/* 餐點資料 */
const meal = ref(null)

/* 取餐時段 */
const timeSlots = ref([])

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

/* 後台抓取餐時間 */
async function fetchTimeSlots() {
  const res = await axios.get(`${apiUrl}/TMealPickUpTimes/active`)
  timeSlots.value = res.data.map(t => ({
    id: t.FPickUpTimeId,
    label: `${t.FStartTime.substring(0,5)} - ${t.FEndTime.substring(0,5)}`
  }))
}

/* 後台抓取餐點 */
async function fetchMeal() {
  try {
    const res = await axios.get(`${apiUrl}/TMeals/${mealId}`)
    // 後端回傳的欄位是 FMealId, Name, Price, ...
    meal.value = {
      id: res.data.FMealId,
      name: res.data.FMealName,
      imageUrl: res.data.FImageUrl,   // 假設後端有這個欄位
      calories: res.data.FCalories,
      protein: res.data.FProtein,
      carbs: res.data.FCarbs,
      fat: res.data.FFat,
      price: res.data.FPrice
    }
  } catch (err) {
    console.error("載入餐點失敗", err)
  }
}



/* 加入購物車 */
async function addToCart() {

  if (!authStore.member?.UserId) {
    alert('請先登入')
    router.push({ name: 'User-login' })
    return false
  }

  const payload = {
    FUserId: authStore.member.UserId,
    FMealId: meal.value.id,
    FPickDate: selectedDate.value,
    FPickTimeId: selectedTimeSlotId.value,
    FQty: quantity.value
  }

  try {
    await axios.post(`${apiUrl}/TMealCarts/MealAddToCart`, payload)
    alert('加入成功')
    return true
  } catch (err) {
    console.error(err)
    alert('加入失敗')
    return false
  }
}

/* 立即購買 */

async function buyNow() {
  const success = await addToCart()

  if (success) {
    await router.push('/meals/cart')
  }
}

onMounted(() => {
  fetchTimeSlots()
  fetchMeal()
})

</script>




<template>
  <div class=" min-vh-100 py-2 container">
    <nav aria-label="breadcrumb" class="mb-3">
            <ol class="breadcrumb">
              <li v-if="meal" class="breadcrumb-item"><router-link to="/meals" class="text-orange">餐點列表</router-link></li>
              <li v-if="meal" class="breadcrumb-item active">{{ meal.name }}</li>
            </ol>
          </nav>
    <div class="container meal-detail rounded-4 shadow-sm p-4 p-md-5">
      <div class="row justify-content-center g-5">
        
        <div class="col-12 col-md-6 col-lg-5">
          <div class="image-wrapper shadow-sm rounded-4 overflow-hidden">
            <img :src="'https://localhost:7218' + meal.imageUrl" class="img-fluid w-100 h-100 object-fit-cover" :alt="meal.name" v-if="meal"/>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-5">
          <h1 class="fw-bold text-dark mb-3" v-if="meal">{{ meal.name }}</h1>
          <div class="price-wrapper mb-2">
      <span class="currency">NT$</span>
      <span class="price-amount" v-if="meal">{{ meal.price }}</span>
    </div>

          <div class="nutrition-grid mb-4">
            <div class="nutrition-card">
              <span class="label">熱量</span>
              <span class="value" v-if="meal">{{ meal.calories }} <small>kcal</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">蛋白質</span>
              <span class="value" v-if="meal">{{ meal.protein }} <small>g</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">碳水</span>
              <span class="value" v-if="meal">{{ meal.carbs }} <small>g</small></span>
            </div>
            <div class="nutrition-card">
              <span class="label">脂質</span>
              <span class="value" v-if="meal">{{ meal.fat }} <small>g</small></span>
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
