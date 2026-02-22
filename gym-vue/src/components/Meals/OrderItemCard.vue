<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

defineProps({
  item: Object
})

const showQr = ref(false)
</script>

<template>
  <div class="order-item mb-3 p-3 rounded">
    <div class="d-flex gap-3">
      <img
        :src="'https://localhost:7218' + item.FMeal?.FImageUrl"
        class="meal-img"
      />

      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-center w-100">
  <h6 class="fw-bold mb-0">{{ item.FMealName }}</h6>

  <span
    class="badge"
    :class="item.fPickupStatus ? 'bg-success' : 'bg-secondary'"
  >
    {{ item.FPickupStatus ? '已領取' : '未領取' }}
  </span>
</div>
        <div class="text-muted small mt-2">
          取餐日期：{{ item.FPickDate }} 
        </div>
        <div class="text-muted small">
          取餐時間：{{ item.FPickTime ? item.FPickTime.FStartTime.substring(0,5) + '-' + item.FPickTime.FEndTime.substring(0,5) : '' }}

        </div>
        <div class="fw-bold mt-1">
          {{ item.FQty }} 份 × {{ item.FUnitPrice }}　
          <span class="price">NT$ {{ item.FSubtotal }}</span>
        </div>
      </div>
    </div>

    <button
      class="btn btn-sm btn-outline-orange mt-3"
      @click="showQr = !showQr"
    >
      {{ showQr ? '隱藏 QRCode' : '顯示 QRCode' }}
    </button>

    <div v-show="showQr" class="qr-box mt-3 text-center">
      <QrcodeVue
        :value="item.FQrContent"
        :size="160"
      />
      <div class="small text-muted mt-2">
        出示此 QRCode 取餐
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-item {
  border: 1px solid #ffe0c3;
  background: #fff5eb;
  border-radius: 12px
}

.meal-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.price {
  color: #f3722c;
}

.btn-outline-orange {
  color: #f3722c;
  border-color: #f3722c;
}

.btn-outline-orange:hover {
  background: #f3722c;
  color: #fff;
}

.qr-box {
  background: #fffaf4;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed #ff9f1c;
}
</style>
