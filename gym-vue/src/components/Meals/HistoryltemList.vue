<script setup>
import {ref,computed} from 'vue'

import OrderItemCard from './OrderItemCard.vue'
// 假設你的 items 是從 props 或 API 取得的
const isOpen = ref(false); // 控制手風琴開關

// 計算是否全部領取
const allPickedUp = computed(() => {
  if (props.items.length === 0) return false;
  return props.items.every(item => item.FPickupStatus);
});
// defineProps({
//   items: Array
// })

const props = defineProps({
  items: Array
})

</script>

<template>
  <div class="card border-0 shadow-sm mb-3">
  <div 
    class="card-header header-orange text-white d-flex justify-content-between align-items-center" 
    style="cursor: pointer;"
    @click="isOpen = !isOpen"
  >
    <div>
      <i class="bi" :class="isOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
      訂單明細
    </div>
    
    <span class="badge" :class="allPickedUp ? 'bg-light text-success' : 'bg-danger text-light'">
      {{ allPickedUp ? '已全部領取' : ' 尚未全部領取' }}
    </span>
  </div>

  <Transition name="fade">
    <div class="card-body" v-show="isOpen">
      <div class="row g-3">
        <div 
          class="col-12 col-md-6" 
          v-for="item in items" 
          :key="item.FOrderItemId"
        >
          <OrderItemCard :item="item" />
        </div>
      </div>
    </div>
  </Transition>
</div>
</template>

<style scoped>
.header-orange {
  background: linear-gradient(90deg, #f3722c, #ff9f1c);
}
.card-body {
  background-color: #fffaf4;
  border-radius: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header-orange {
  background-color: #fd7e14; /* 你的橘色主題 */
}
</style>