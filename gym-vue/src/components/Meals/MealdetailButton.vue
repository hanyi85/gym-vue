<template>
  <button 
    class="btn w-100 py-2 fw-bold text-white shadow-sm transition-all"
    :class="type === 'add' ? 'btn-add-cart' : 'btn-buy-now'"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'add' // 'add' 或 'buy'
  }
})
defineEmits(['click'])
</script>

<style scoped>
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-all:active {
  transform: scale(0.97);
}

.btn-add-cart {
  background-color: #ff9f1c;
  border: none;
}

.btn-add-cart:hover {
  background-color: #f38d00;
  box-shadow: 0 4px 12px rgba(255, 159, 28, 0.3);
}

.btn-buy-now {
  background-color: #f3722c;
  border: none;
}

.btn-buy-now:hover {
  background-color: #d65a1a;
  box-shadow: 0 4px 12px rgba(243, 114, 44, 0.3);
}
</style>