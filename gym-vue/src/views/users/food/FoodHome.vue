<template>
  <div class="food-page">
    <!-- 標題 -->
    <h2 class="page-title">食物紀錄 - 主頁</h2>

    <!-- 搜尋 -->
    <div class="search-box">
      <input type="text" placeholder="搜尋" />
    </div>

    <!-- 餐別切換 -->
    <div class="meal-tabs">
      <button
        v-for="meal in meals"
        :key="meal"
        :class="{ active: currentMeal === meal }"
        @click="currentMeal = meal"
      >
        {{ meal }}
      </button>
    </div>

    <!-- 食物卡片 -->
    <div class="food-card">
      <div class="food-info">
        <div class="food-name">食物名</div>

        <div class="food-image">
          圖片
        </div>
      </div>

      <div class="food-nutrition">
        <p>0 大卡</p>
        <p>蛋白質 xx 克</p>
        <p>醣類 xx 克</p>
        <p>脂肪 xx 克</p>
      </div>
    </div>

    <!-- 加入食物 -->
    <button class="add-btn">
      ＋ 加入食品
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const meals = ['早餐', '午餐', '晚餐', '點心']
const currentMeal = ref('早餐')
</script>

<style scoped>
.food-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

/* 標題 */
.page-title {
  color: #999;
  margin-bottom: 20px;
}

/* 搜尋 */
.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 餐別 tabs */
.meal-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.meal-tabs button {
  background: none;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.meal-tabs button.active {
  border-bottom: 2px solid #666;
  font-weight: bold;
}

/* 食物卡 */
.food-card {
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 30px;
}

.food-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.food-name {
  font-size: 16px;
}

.food-image {
  width: 120px;
  height: 120px;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.food-nutrition p {
  margin: 4px 0;
  font-size: 14px;
}

/* 加入按鈕 */
.add-btn {
  display: block;
  margin: auto;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #eee;
  cursor: pointer;
}
</style>
