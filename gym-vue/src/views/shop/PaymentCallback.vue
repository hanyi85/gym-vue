<template>
  <div class="payment-callback-container d-flex flex-column align-items-center justify-content-center" style="min-height: 60vh;">
    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h3 class="mt-4">付款確認中，請勿關閉或重新整理視窗...</h3>
    <p class="text-muted">正在與 PayPal 進行最後交易核對</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js'; // 確保路徑正確
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const API_URL = 'https://localhost:7218/api/'; // 例如 'https://localhost:7001/api/'

onMounted(async () => {
  // 1. 從網址取得 PayPal 傳回的 token (這就是 PayPal 的 Order ID)
  // PayPal 跳轉回來的網址範例：.../payment-callback?token=5O172095G9290674L&PayerID=XXXX
  const paypalOrderId = route.query.token;

  if (!paypalOrderId) {
    alert('找不到有效的付款憑證，將返回購物車');
    router.replace({ name: 'shop-cart' });
    return;
  }

  try {
    // 2. 呼叫後端 Capture API 進行正式扣款
    // 對應你的 C# [HttpPost("Capture/{payPalOrderId}")]
    const res = await axios.post(`${API_URL}SOrder/${paypalOrderId}`);

    if (res.data.status === 'COMPLETED') {
        cartStore.clearCart();

        // ✅ 從後端回傳的 JSON 取得正確的訂單編號
        const finalOrderNumber = res.data.orderNo; 
        
        // 跳轉到成功頁，並帶上單號
        router.push({ 
            path: '/shop/booking-success', 
            query: { orderNumber: finalOrderNumber } 
        });

    } else {
      throw new Error('付款未完成');
    }
  } catch (err) {
    console.error('❌ PayPal Capture 失敗:', err);
    alert('付款核對失敗，請聯繫客服人員確認您的訂單狀態。');
    // 失敗時跳回購物車，讓使用者可以重新嘗試或更換付款方式
    router.replace({ name: 'shop-cart' });
  }
});
</script>

<style scoped>
.payment-callback-container {
  /* 這裡可以自訂一些美化樣式 */
  background-color: #f8f9fa;
  border-radius: 8px;
}
</style>