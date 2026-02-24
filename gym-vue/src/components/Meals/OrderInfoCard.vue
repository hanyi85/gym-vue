<script setup>
import dayjs from 'dayjs'

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
        <div class="col-md-6">訂單編號：{{ order?.FOrderId }}</div>
        <div class="col-md-6">訂單成立時間：{{ order?.FOrderAt ? dayjs(order.FOrderAt).format('YYYY年MM月DD日 HH:mm:ss') : '' }}</div>
        <div class="col-md-6">訂購人：{{ order?.FOrderName }}</div>
        <div class="col-md-6">電話：{{ order?.FOrderPhone }}</div>
        <div class="col-md-6">Email：{{ order?.FOrderEmail }}</div>
        <div class="col-md-6">取餐場館：{{ order?.FVenue?.VenueName }}</div>
        <div class="col-md-6">付款方式：{{ order?.FPayMethod }}</div>
        <div class="col-md-6">訂單狀態：{{ order?.FOrderStatus }}</div>
        <div class="col-md-6 fw-bold price">
          總金額 NT$ {{ order?.FTotalAmount }}
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