<template>
  <div class="food-page">
    <!-- 標題 -->
    <h2 class="page-title">食物紀錄 · 新增食物</h2>

    <!-- 搜尋 -->
    <div class="search-box">
      <input type="text" placeholder="搜尋食物名稱" />
    </div>

    <!-- Tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: currentTab === tab }"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 食物列表 -->
    <div class="food-list">
      <div
        class="food-card"
        v-for="item in foodList"
        :key="item.id"
      >
        <div class="food-left">
          <div class="food-image">圖片</div>

          <div class="food-meta">
            <div class="food-name">
              {{ item.name }}
              <button class="add-btn">＋</button>
            </div>
            <div class="food-cal">0 大卡</div>
          </div>
        </div>

        <div class="food-nutrition">
          <span>蛋白質 xx 克</span>
          <span>醣類 xx 克</span>
          <span>脂肪 xx 克</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ['歷程', '我的食物', '所有食物']
const currentTab = ref('歷程')

const foodList = ref([
  { id: 1, name: '食物名' },
  { id: 2, name: '食物名' }
])
</script>

<style scoped>
/* 整體 */
.food-page {
  max-width: 900px;
  margin: auto;
  padding: 32px 20px;
  background: #fafafa;
}

/* 標題 */
.page-title {
  color: #666;
  font-weight: 600;
  margin-bottom: 24px;
}

/* 搜尋 */
.search-box input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 14px;
  margin-bottom: 28px;
}

/* Tabs */
.tab-bar {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.tab-bar button {
  background: none;
  border: none;
  font-size: 15px;
  color: #999;
  padding-bottom: 6px;
  cursor: pointer;
}

.tab-bar button.active {
  color: #333;
  border-bottom: 2px solid #7a9d96;
  font-weight: 600;
}

/* 列表 */
.food-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 卡片 */
.food-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
}

/* 左側 */
.food-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.food-image {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  background: #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 13px;
}

.food-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.food-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
}

.food-cal {
  font-size: 14px;
  color: #888;
}

/* + 按鈕 */
.add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #7a9d96;
  color: #fff;
  cursor: pointer;
}

/* 營養資訊 */
.food-nutrition {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #666;
}
</style>
