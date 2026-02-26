<template>
  <div class="test-container p-4">
    <div class="card shadow-sm p-4" style="max-width: 500px; margin: auto;">
      <h3 class="text-center mb-4">LINE Pay 串接測試</h3>

      <div class="mb-4">
        <div class="p-3 bg-light rounded border">
          <p class="mb-1 fw-bold text-secondary">測試活動名稱</p>
          <h5 class="fw-bold">2026 專題發表會</h5>
          <hr>
          <div class="d-flex justify-content-between align-items-center">
            <span>報名費用：</span>
            <span class="fs-4 fw-bold text-success">$ 100 TWD</span>
          </div>
        </div>
      </div>

      <button @click="startTestPay" :disabled="loading" class="btn btn-success w-100 py-3 fw-bold shadow-sm">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="bi bi-wallet2 me-2"></i>
        {{ loading ? '通訊中...' : '使用 LINE Pay 付款' }}
      </button>

      <div v-if="debugMsg" class="mt-3 alert alert-secondary small border-0 shadow-sm">
        <i class="bi bi-info-circle me-1"></i>
        <strong>狀態：</strong> {{ debugMsg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const loading = ref(false);
const debugMsg = ref('');

const startTestPay = async () => {
  loading.value = true;
  debugMsg.value = '正在連線至後端伺服器...';

  try {
    // 呼叫你的 ASP.NET Core API
    // 確保你的後端正在 https://localhost:7218 執行
    const response = await axios.post('https://localhost:7218/api/YLINEPAY/RegisterWithLinePay', {
      Fee: 100, // 這裡要對應後端 Dto 的屬性名稱
      EventName: '2026 專題發表會'
    });

    // 判斷 LINE Pay 回傳結果
    if (response.data.returnCode === '0000') {
      debugMsg.value = '連線成功！正在跳轉至 LINE Pay...';

      // 取得付款網址並跳轉
      const paymentUrl = response.data.info.paymentUrl.web;
      window.location.href = paymentUrl;
    } else {
      debugMsg.value = '付款初始化失敗：' + response.data.returnMessage;
      Swal.fire('失敗', response.data.returnMessage, 'error');
    }
  } catch (error) {
    console.error('API Error:', error);
    debugMsg.value = '連線失敗，請檢查後端 API 是否啟動 (CORS?)';
    Swal.fire('系統錯誤', '無法連線至後端伺服器', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.test-container {
  background-color: #f0f2f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.card {
  border: none;
  border-radius: 15px;
}

.btn-success {
  background-color: #00b900;
  /* LINE Pay 綠色 */
  border: none;
}

.btn-success:hover {
  background-color: #009900;
}
</style>