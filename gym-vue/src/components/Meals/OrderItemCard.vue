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
        :src="item.fMealImage"
        class="meal-img"
      />

      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-center w-100">
  <h6 class="fw-bold mb-0">{{ item.fMealName }}</h6>

  <span
    class="badge"
    :class="item.isPickedUp ? 'bg-success' : 'bg-secondary'"
  >
    {{ item.isPickedUp ? '已領取' : '未領取' }}
  </span>
</div>
        <div class="text-muted small mt-2">
          取餐日期：{{ item.fPickDate }} 
        </div>
        <div class="text-muted small">
          取餐時間：{{ item.fPickTimeID }}
        </div>
        <div class="fw-bold mt-1">
          {{ item.fQty }} 份 × {{ item.fUnitPrice }}　
          <span class="price">NT$ {{ item.fSubtotal }}</span>
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
        :value="item.fQrContent"
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
