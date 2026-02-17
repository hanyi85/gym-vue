<script setup>
import { ref, computed, onMounted} from 'vue'
import axios from 'axios'
import MealCard from '@/components/Meals/MealCardList.vue'
import MealBbanner from '@/components/banner.vue'
import MealSidebar from '@/components/Meals/MealSidebar.vue'

const apiUrl="https://localhost:7218/api"

// ====== 狀態 ======
const categories = ref([])
const meals = ref([])
const currentCategory = ref({})

// ====== 取得分類 ======
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${apiUrl}/TMealCategories`)

    // 把後端欄位轉成前端格式
    categories.value = res.data
      .filter(c => c.FIsActive)
      .map(c => ({
        id: c.FCategoryId,
        name: c.FCategoryName,
        description: c.FDescription
      }))

    // 預設選第一個分類
    if (categories.value.length > 0) {
      currentCategory.value = categories.value[0]
    }

  } catch (err) {
    console.error('分類取得失敗', err)
  }
}

// ====== 取得餐點 ======
const fetchMeals = async () => {
  try {
    const res = await axios.get(`${apiUrl}/TMeals`)

    meals.value = res.data
      .filter(m => m.FIsActive)
      .map(m => ({
        id: m.FMealId,
        categoryId: m.FCategoryId,
        name: m.FMealName,
        description: m.FDescription,
        imageUrl: m.FImageUrl,
        calories: m.FCalories,
        protein: m.FProtein,
        price: m.FPrice
      }))

  } catch (err) {
    console.error('餐點取得失敗', err)
  }
}

// ====== 切分類 ======
const selectCategory = (cat) => {
  currentCategory.value = cat
}

// ====== 依分類過濾 ======
const filteredMeals = computed(() => {
  if (!currentCategory.value.id) return []
  return meals.value.filter(
    m => m.categoryId === currentCategory.value.id
  )
})

// ====== 進頁面載入 ======
onMounted(async () => {
  await fetchCategories()
  await fetchMeals()
})



</script>

<template>
  <!-- Banner -->
   <div class="pb-5">
      <MealBbanner title="餐點列表" subtitle="選擇你的餐點類型，享受美味又健康的飲食！"/>
   </div>

  <div class="container">
    <div class="row">

      <div class="col-md-3 col-lg-2 mb-4">
        <MealSidebar 
          :categories="categories" 
          :currentCategoryId="currentCategory.id"
          @select-category="selectCategory"
        />
      </div>

      <main class="col-md-9 col-lg-10">
        <div class="mb-2 ps-md-3">
          <h3 class="fw-bold" style="color: #f3722c;">{{ currentCategory.name }}</h3>
          <h6 class="text-muted">{{ currentCategory.description }}</h6>
        </div>
        <!-- 餐點卡片 -->
        <div class="row p-3">
          <div
            v-for="meal in filteredMeals"
            :key="meal.id"
            class="col-12 col-sm-6 col-md-3 py-2"
          >
            <MealCard :meal="meal" />
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
}

.sidebar .nav-link {
  color: #333;
  border-radius: 6px;
  margin-bottom: 4px;
}

.sidebar .nav-link.active,
.sidebar .nav-link:hover {
  background-color: #198754;
  color: #fff;
}

</style>