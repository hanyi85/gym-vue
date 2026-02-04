<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 父層傳進來的餐點資料
const props = defineProps({
  meal: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// 之後可以從 API 判斷是否已收藏
const isFavorite = ref(props.meal.isFavorite ?? false)

// 點整張卡片
const goDetail = () => {
  router.push({
    name: 'meals-detail',
    params: {
      mealId: props.meal.id
    }
  })
}

// 點愛心
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value

  // 👉 之後你在這裡接 API
  // axios.post('/api/favorite', { mealId: props.meal.id })
}
</script>


<template>
  <!-- 整張卡片可點 -->
  <div class="card meal-card" @click="goDetail">
    
    <!-- 愛心（要阻止冒泡） -->
    <button
      class="favorite-btn"
      @click.stop="toggleFavorite"
    >
      <i
        class="bi"
        :class="isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'"
      ></i>
    </button>

    <img
      :src="meal.imageUrl"
      class="card-img-top"
      alt="meal image"
    />

    <div class="card-body">
      <h5 class="card-title">{{ meal.name }}</h5>
      <p class="card-text">
        熱量：{{ meal.calories }} kcal / 蛋白質：{{ meal.protein }} g
      </p>
    </div>
  </div>
</template>

<style scoped>
.meal-card {
  width: 18rem;
  cursor: pointer;
  position: relative;
}

/* 愛心位置 */
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  z-index: 2;
}
</style>
