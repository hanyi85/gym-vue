<script setup>
defineProps({
  order: Object
})
</script>

<template>
  <div class="card shadow-sm mb-4 border-0">
    <div class="card-header text-white header-orange">
      訂單資訊
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-6">訂單編號：{{ order.fOrderId }}</div>
        <div class="col-md-6">訂單成立時間：{{ order.fOrderAt }}</div>
        <div class="col-md-6">訂購人：{{ order.fOrderName }}</div>
        <div class="col-md-6">電話：{{ order.fOrderPhone }}</div>
        <div class="col-md-6">Email：{{ order.fOrderEmail }}</div>
        <div class="col-md-6">取餐場館：{{ order.fVenueName }}</div>
        <div class="col-md-6">付款方式：{{ order.fPayMethod }}</div>
        <div class="col-md-6">訂單狀態：{{ order.fOrderStatus }}</div>
        <div class="col-md-6 fw-bold price">
          總金額 NT$ {{ order.fTotalAmount }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-orange {
  background: linear-gradient(90deg, #f3722c, #ff9f1c);
}
.price {
  color: #f3722c;
}

.card-body {

  background-color: #fffaf4;
  border-radius: 12px;
}
  
</style>