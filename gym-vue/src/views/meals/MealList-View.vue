<script setup>
import { ref, computed } from 'vue'
import MealCard from '@/components/Meals/MealCardList.vue'
import MealBbanner from '@/components/banner.vue'
import MealSidebar from '@/components/Meals/MealSidebar.vue'

const apiUrl="https://localhost:7193/api/"

// 分類
const categories = [
  { id: 1, name: '高蛋白增肌餐', description: '適合健身與增肌族群，高蛋白、低精製澱粉' },
  { id: 2, name: '低脂減脂餐', description: '低熱量、低脂肪，幫助體脂控制' },
  { id: 3, name: '均衡健康餐', description: '營養均衡，適合日常健康飲食' }
]

// 預設分類
const currentCategory = ref(categories[0])

// 餐點（之後改成 API 回傳）
const meals = ref([
  { id: 1, name: '雞胸餐', categoryId: 1, calories: 520, protein: 45, imageUrl: '/assets/img/meals/1.jpg', price:160},
  { id: 2, name: '牛肉增肌餐', categoryId: 1, calories: 650, protein: 50, imageUrl: '/assets/img/meals/1.jpg' , price:160},
  { id: 3, name: '舒肥鯛魚餐', categoryId: 2, calories: 420, protein: 38, imageUrl: '/assets/img/meals/1.jpg', price:160 },
  { id: 4, name: '均衡雞腿餐', categoryId: 3, calories: 580, protein: 40, imageUrl: '/assets/img/meals/1.jpg', price:160}
])

// 切分類
const selectCategory = (cat) => {
  currentCategory.value = cat
}

// 🔥 關鍵：依分類過濾餐點
const filteredMeals = computed(() => {
  return meals.value.filter(
    m => m.categoryId === currentCategory.value.id
  )
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