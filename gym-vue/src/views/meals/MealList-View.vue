<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import MealCard from '@/components/Meals/MealCardList.vue'
import MealBbanner from '@/components/banner.vue'
import MealSidebar from '@/components/Meals/MealSidebar.vue'

const apiUrl="https://localhost:7218/api"

// ====== 狀態 ======
const categories = ref([])
const meals = ref([])
const currentCategory = ref({ id: 0, type: 'all', name: '全部餐點' })

// ====== 取得分類 ======
const fetchCategories = async () => {
    const res = await axios.get(`${apiUrl}/TMealCategories`)

const apiCategories = res.data
      .filter(c => c.FIsActive)
      .map(c => ({
        id: c.FCategoryId,
        name: c.FCategoryName,
        description: c.FDescription,
        type:'normal'
      }))

      // 🔥 加入自訂分類
  categories.value = [
    {
      id: 0,
      name: '全部餐點',
      description: '所有健康美味餐點',
      type: 'all'
    },
    ...apiCategories,
    {
      id: -1,
      name: '我喜愛的餐點',
      description: '你收藏的專屬餐點',
      type: 'favorite'
    }
  ]

   currentCategory.value = categories.value[0]
 

  }


// ====== 取得餐點 ======
const fetchMeals = async (category) => {
  // 1️⃣ 全部餐點
  if (category.type === 'all') {
    const res = await axios.get(`${apiUrl}/TMeals`)
    meals.value = mapMeals(res.data)
    return
  }

  // 2️⃣ 喜愛餐點（等下會做）
  if (category.type === 'favorite') {
    const res = await axios.get(`${apiUrl}/TMealFavoriteMeals/user?userId=1`)
    meals.value = mapMeals(res.data)
    return
  }

  // 3️⃣ 一般分類
  const res = await axios.get(
    `${apiUrl}/TMeals?categoryId=${category.id}`
  )

  meals.value = mapMeals(res.data)
}

// ====== 格式轉換 ======
const mapMeals = (data) => {
  return data.map(m => ({
    id: m.FMealId,
    categoryId: m.FCategoryId,
    name: m.FMealName,
    imageUrl: m.FImageUrl,
    calories: m.FCalories,
    fat: m.FFat,
    carbs: m.FCarbs,
    protein: m.FProtein,
    price: m.FPrice
  }))
}

// ====== 切分類 ======
const selectCategory = async (cat) => {
  currentCategory.value = cat
  await fetchMeals(cat)
}

// ====== 依分類過濾 ======
const filteredMeals = computed(() => {
  if (!currentCategory.value) return []   // 🔥 避免 null.id
  if (currentCategory.value.type === 'all') {
    return meals.value                    // 🔥 全部餐點直接回傳所有
  }
  if (currentCategory.value.type === 'favorite') {
    return meals.value.filter(m => m.isFavorite)
  }
  return meals.value.filter(
    m => m.categoryId === currentCategory.value.id
  )
})



// ====== 進頁面載入 ======
onMounted(async () => {
  await fetchCategories()
  await fetchMeals(currentCategory.value)
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
          :currentCategoryId="currentCategory?.id"
          @select-category="selectCategory"
        />
      </div>

      <main class="col-md-9 col-lg-10">
        <div class="mb-2 ps-md-3">
          <h3 class="fw-bold" style="color: #f3722c;">{{ currentCategory?.name }}</h3>
          <h6 class="text-muted">{{ currentCategory?.description }}</h6>
        </div>
        <!-- 餐點卡片 -->
        <div class="row p-3">
          <div
            v-for="meal in filteredMeals"
            :key="meal?.id"
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