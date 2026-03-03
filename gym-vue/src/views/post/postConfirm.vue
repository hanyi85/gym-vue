<template>
  <div class="confirm-container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-orange mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
      <h4 class="fw-bold">正在確認付款結果，請勿關閉視窗...</h4>
    </div>

    <div v-else class="card border-0 shadow-lg rounded-4 p-5 text-center animate-up" style="max-width: 500px;">
      <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
      <h2 class="fw-bold mt-3">付款成功！</h2>
      <p class="text-muted mt-2">我們已將確認信寄至您的電子信箱：<br><span class="text-dark fw-bold">{{ userEmail }}</span></p>
      <hr>
      <p class="small text-secondary">頁面將在 5 秒後自動導向活動列表</p>
      <button @click="router.push('/post/card')" class="btn btn-orange rounded-pill px-5 py-2 fw-bold text-white mt-3">
        立即返回列表
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const userEmail = ref('');

onMounted(async () => {
  // 從 URL 取得 LINE Pay 帶回來的參數
  const transactionId = route.query.transactionId;
  const joinId = route.query.joinId;

  if (!transactionId || !joinId) {
    Swal.fire('錯誤', '非法訪問，請從正常流程進入', 'error');
    router.push('/post/card');
    return;
  }

  try {
    // 呼叫後端進行確認並寄信
    const response = await axios.get(`https://localhost:7218/api/YLINEPAY/ConfirmPayment`, {
      params: { transactionId, joinId }
    });

    if (response.data.returnCode === '0000') {
      loading.value = false;
      // 5 秒後自動導回
      setTimeout(() => {
        router.push('/post/card');
      }, 5000);
    }
  } catch (error) {
    console.error('確認失敗', error);
    Swal.fire('系統錯誤', '付款狀態確認失敗，請聯繫客服', 'error');
    router.push('/post/card');
  }
});
</script>

<style scoped>
.text-orange {
  color: #f3722c;
}

.btn-orange {
  background-color: #f3722c;
}

.animate-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>