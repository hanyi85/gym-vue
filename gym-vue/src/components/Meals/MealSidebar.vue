<script setup>
defineProps({
  categories: Array,
  currentCategoryId: Number
});
defineEmits(['select-category']);
</script>

<template>
  <aside class="sidebar-container p-3 shadow-sm">
    <div class="sidebar-header mb-4 ps-2">
      <h5 class="fw-bold text-dark mb-0">餐點分類</h5>
      <div class="header-line"></div>
    </div>

    <ul class="nav flex-column gap-2">
      <li 
        v-for="cat in categories" 
        :key="cat.id" 
        class="nav-item"
      >
        <button
          class="nav-link w-100 text-start border-0 transition-all"
          :class="{ 'active': currentCategoryId === cat.id }"
          @click="$emit('select-category', cat)"
        >
          <span class="dot"></span>
          {{ cat.name }}
        </button>
      </li>
    </ul>
  </aside>
</template>


<style scoped>
.sidebar-container {
  background-color: #fffaf4; /* 你的主色調 */
  border-radius: 16px;
  border: 1px solid #ffe0c3;
  position: sticky;
  top: 20px;
}

.header-line {
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #f3722c, #ff9f1c);
  border-radius: 2px;
  margin-top: 8px;
}

.nav-link {
  background: transparent;
  color: #666;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link:hover {
  background-color: #fff0e0;
  color: #f3722c;
}

/* 啟動狀態：使用你的橘色漸層 */
.nav-link.active {
  background: linear-gradient(90deg, #f3722c, #ff9f1c);
  color: white !important;
  box-shadow: 0 4px 12px rgba(243, 114, 44, 0.3);
}

.dot {
  width: 6px;
  height: 6px;
  background-color: #f3722c;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-link.active .dot {
  background-color: white;
  transform: scale(1.2);
}

.transition-all {
  transition: all 0.3s ease;
}
</style>
