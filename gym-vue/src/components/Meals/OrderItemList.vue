<script setup>
import OrderItemCard from './OrderItemCard.vue'

defineProps({
  items: Array
})
</script>

<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header header-orange text-white">
      訂單明細
    </div>
    <div class="card-body">
  <div class="row g-3"> <div 
      class="col-12 col-md-6" 
      v-for="item in items" 
      :key="item.fOrderItemId"
    >
      <OrderItemCard :item="item" />
    </div>
  </div>
</div>
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
</style>
