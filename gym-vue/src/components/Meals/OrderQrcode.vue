<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'


// 必須定義 props 接收父層傳來的資料
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});


</script>
<template>
  <div class="order-card p-3 h-100">
    <div class="d-flex align-items-start gap-3">
      <div class="qr-section text-center">
        <QrcodeVue v-if="item.FQrContent" :value="item.FQrContent" :size="100" level="H" />
<span v-else>尚未產生 QR Code</span>
        <div class="qr-label mt-1"></div>
      </div>

      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="fw-bold meal-title mb-1">{{ item.FMealName }}</h6>
          <span
    class="badge"
    :class="item.FPickupStatus ? 'bg-success' : 'bg-secondary'"
  >
    {{ item.FPickupStatus ? '已領取' : '未領取' }}
  </span>
          
        </div>

        <div class="info-grid mt-2">
          <div class="info-item">
            <span class="label">取餐地點：</span>{{ item.VenueName }}
          </div>
          <div class="info-item">
            <span class="label">取餐日期：</span>{{ item.FPickDate }}
          </div>
          <div class="info-item">
            <span class="label">取餐時間：</span>{{ item.PickStart }} - {{ item.PickEnd}}
          </div>
        </div>

        <hr class="my-2 dashed-line">

        <div class="d-flex justify-content-between align-items-center">
          <div class="qty-price">
            {{ item.FQty }} 份 × NT$ {{ item.FUnitPrice }}
          </div>
          <div class="subtotal fw-bold">
            小計 NT$ {{ item.FSubtotal }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  border: 1px solid #ffe0c3;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(243, 114, 44, 0.08);
  transition: transform 0.2s;
}

/* QRCode 區塊樣式 */
.qr-section {
  background: #fffaf4;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #ffe0c3;
  min-width: 120px;
}

.qr-label {
  font-size: 0.7rem;
  color: #a0a0a0;
}

/* 文字資訊樣式 */
.meal-title {
  color: #333;
  font-size: 1.1rem;
}

.info-grid {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
}

.label {
  color: #999;
  margin-right: 4px;
}

.dashed-line {
  border-top: 1px dashed #eee;
  opacity: 1;
}

/* 價格樣式 */
.qty-price {
  font-size: 0.9rem;
  color: #888;
}

.subtotal {
  color: #f3722c;
  font-size: 1.05rem;
}

/* 狀態標籤樣式 */
.status-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 20px;
  background: #eee;
  color: #666;
}

.status-paid {
  background: #e8f5e9;
  color: #2e7d32;
}

.orders-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>