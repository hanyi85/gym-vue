<template>
  <div class="confirm-container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">

    <div class="process-steps mb-5 px-md-5 w-100" style="max-width: 600px;">
      <div class="d-flex justify-content-between position-relative">
        <div class="step-line"></div>

        <div class="step-item d-flex flex-column align-items-center z-1">
          <div class="step-circle mb-2 completed">
            <i class="bi bi-check-lg"></i>
          </div>
          <span class="step-label fw-bold text-dark">基本資料</span>
        </div>

        <div class="step-item d-flex flex-column align-items-center z-1">
          <div class="step-circle mb-2" :class="{ 'active': loading, 'completed': !loading }">
            <i v-if="!loading" class="bi bi-check-lg"></i>
            <span v-else>2</span>
          </div>
          <span class="step-label fw-bold text-dark">完成報名</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center animate-up">
      <div class="spinner-border text-orange mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
      <h4 class="fw-bold">正在確認付款結果，請勿關閉視窗...</h4>
    </div>

    <div v-else class="card border-0 shadow-lg rounded-4 p-5 text-center animate-up" style="max-width: 500px;">
      <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
      <h2 class="fw-bold mt-3">付款成功！</h2>
      <p class="text-muted mt-2">
        您的名額已保留，我們已將確認信寄至：<br>
        <span class="text-dark fw-bold">{{ userEmail || '您的電子信箱' }}</span>
      </p>

      <div class="bg-light rounded-3 p-3 mb-4 text-start">
        <p class="small mb-1 text-secondary">報名編號：#{{ route.query.joinId }}</p>
        <p class="small mb-0 text-secondary">付款方式：LINE Pay</p>
      </div>

      <hr>
      <p class="small text-secondary">頁面將在 {{ countdown }} 秒後自動導向活動列表</p>
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
const countdown = ref(5); // 倒數計時顯示

onMounted(async () => {
  const transactionId = route.query.transactionId;
  const joinId = route.query.joinId;

  if (!transactionId || !joinId) {
    Swal.fire('錯誤', '非法訪問，請從正常流程進入', 'error');
    router.push('/post/card');
    return;
  }

  try {
    // 呼叫後端 API
    const response = await axios.get(`https://localhost:7218/api/YLINEPAY/ConfirmPayment`, {
      params: { transactionId, joinId }
    });

    if (response.data.returnCode === '0000') {
      loading.value = false;

      // 啟動倒數計時器
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
          router.push('/post/card');
        }
      }, 1000);
    }
  } catch (error) {
    console.error('確認失敗', error);
    Swal.fire('系統錯誤', '付款狀態確認失敗，請聯繫客服', 'error');
    router.push('/post/card');
  }
});
</script>

<style scoped>
/* 流程圖表樣式 */
.process-steps {
  position: relative;
}

.step-line {
  position: absolute;
  top: 20px;
  /* 圓圈中心高度 */
  left: 50px;
  right: 50px;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 0;
}

.step-item {
  position: relative;
  width: 100px;
  background-color: transparent;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #adb5bd;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.step-circle.active {
  border-color: #f3722c;
  color: #f3722c;
  box-shadow: 0 0 0 4px rgba(243, 114, 44, 0.1);
}

.step-circle.completed {
  background-color: #f3722c;
  border-color: #f3722c;
  color: white;
}

.step-label {
  font-size: 0.85rem;
}

/* 原有配色與動畫 */
.text-orange {
  color: #f3722c;
}

.btn-orange {
  background-color: #f3722c;
  border: none;
  transition: transform 0.2s;
}

.btn-orange:hover {
  background-color: #e6601a;
  transform: scale(1.05);
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

.z-1 {
  z-index: 1;
}
</style>