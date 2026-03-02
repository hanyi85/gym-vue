<script setup>
import { defineProps,  computed, defineEmits, ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const apiUrl="https://localhost:7218/api"


/*會員資料*/
const member = ref({
    UserId: 1,
    Name: '王小明',
    Email: 'ming01@test.com',
    Phone:'0912345678'
  })

  const isLogin = computed(() => !!member.value)


  const logout = () => {
    member.value = null
  }
const router = useRouter()
const emit = defineEmits(['refreshFavorites'])



// 父層傳進來的餐點資料
const props = defineProps({
  meal: {
    type: Object,
    required: true
  },
  favoriteIds: {
    type: Array,
    default: () => []
  }
})

// 之後可以從 API 判斷是否已收藏
const isFavorite = computed(() => {
  return props.favoriteIds.includes(props.meal.id)
})




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
const toggleFavorite = async () => {

   if (!isLogin.value) {
    alert('請先登入')
    return
  }

  try {
    const userId = member.value.UserId

    await axios.post(
      `${apiUrl}/TMealFavoriteMeals/toggle`,
      {
        FUserId: userId,
        FMealId: props.meal.id
      }
    )

    // 🔥 通知父層重新抓收藏ID
    emit('refreshFavorites')

  } catch (err) {
    console.error('收藏失敗', err)
  }
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

    <div class="img-container">
      <img
        :src="'https://localhost:7218' + meal.imageUrl"
        class="card-img-top"
        alt="meal image"
      />
    </div>

    <div class="card-body d-flex flex-column p-3">
  <div class="d-flex justify-content-between align-items-start mb-2">
    <h5 class="card-title fw-bold text-dark mb-0">{{ meal.name }}</h5>
    <div class="price-wrapper ms-2">
      <span class="currency">NT$</span>
      <span class="price-amount">{{ meal.price }}</span>
    </div>
  </div>
  
  <div class="nutrition-info d-flex align-items-center text-muted">
    <span class="info-item">
      <i class="bi bi-fire me-1"></i>熱量:{{ meal.calories }} kcal
    </span>
    <span class="mx-2 separator">|</span>
    <span class="info-item">
      <i class="bi bi-egg-fried me-1"></i>蛋白質:{{ meal.protein }}g 
    </span>
  </div>
</div>
  </div>
</template>

<style scoped>
.meal-card {
  width: 100%; 
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #fffaf4; /* 卡片色 */
}

.meal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

/* 圖片縮放效果 */
.img-container {
  overflow: hidden;
  aspect-ratio: 10 / 9.5; /* 固定比例，避免圖片高矮不一導致卡片不齊 */
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
  color: #ccc;
  transition: all 0.2s ease;
  /* 核心：為「圖示形狀」添加淡灰色陰影 */
  /* 參數：水平 垂直 模糊半徑 顏色 */
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2));
}

/* 未收藏：淡灰色愛心 */
.bi-heart {
  color: snow; /* 非常淡的灰色，在深色圖上很清楚 */
  transition: color 0.3s ease;
}

/* 已收藏：你的主色調橘色，並加強陰影感 */
.bi-heart-fill {
  color: #f3722c; 
  filter: drop-shadow(0px 2px 6px rgba(243, 114, 44, 0.4));
}

/* 滑過時的效果 */
.favorite-btn:hover {
  transform: scale(1.2); /* 縮放效果 */
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3));
}
/* 品名樣式：限制寬度避免擠壓價格 */
.card-title {
  font-size: 1.1rem;
  line-height: 1.3;
  /* 如果名字太長會自動斷行，但不會蓋到價格 */
  flex: 1; 
}

/* 價格樣式：強調橘色與粗體 */
.price-wrapper {
  white-space: nowrap; /* 確保價格不會斷行 */
  color: #f3722c;
  font-weight: 800;
  font-size: 1rem;
}

.currency {
  font-size: 1rem;
  margin-right: 1px;
}

.price-amount {
  font-size: 1.2rem;
}

/* 營養資訊：低調的灰色，與品名區隔 */
.nutrition-info {
  font-size: 0.85rem;
}

.separator {
  color: #ffe0c3; /* 使用你的淡橘色做分隔線 */
  font-weight: 300;
}

.info-item i {
  color: #ff9f1c; /* 圖示用稍淺的橘色點綴 */
}

/* 移除 Bootstrap card 預設邊框，增加圓角 */
.card-body {
  background-color: #fff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

</style>
