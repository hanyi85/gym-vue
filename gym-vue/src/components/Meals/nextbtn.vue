<template>
  <div class="row g-2">
      <button
        class="btn w-100 py-2 fw-bold text-white btn-buy-now"
        :disabled="disabled || loading"
        @click="$emit('buy')"
      >
        <span v-if="loading">
        <span class="spinner-border spinner-border-sm me-2"></span>
        處理中...
      </span>
      <span v-else>
        {{ buyText }}
      </span>
      </button>
    </div>
  
</template>

<script setup>
defineProps({
  buyText: {
    type: String,
    default: '立即購買'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.btn-add-cart {
  background-color: #ff9f1c;
  border: none;
}

.btn-add-cart:hover {
  background-color: #f38d00;
}

.btn-buy-now {
  background-color: #f3722c;
  border: none;
}

.btn-buy-now:hover {
  background-color: #d65a1a;
}
</style>
