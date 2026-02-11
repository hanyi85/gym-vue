<template>
  <div class="join-form-wrapper bg-light min-vh-100 pb-5">
    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <router-link to="/post/card" class="breadcrumb-link text-decoration-none text-muted">最新消息</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange">活動報名</span>
        </p>
      </nav>

      <div class="row justify-content-center">
        <div class="col-lg-8">

          <div v-if="!isMember"
            class="alert bg-white border-0 shadow-sm rounded-4 p-3 d-flex align-items-center justify-content-between mb-4 animate-fade-in">
            <div class="d-flex align-items-center ms-2">
              <i class="bi bi-person-circle text-orange fs-4 me-3"></i>
              <span class="text-secondary fw-bold">已經是 FitnessBar 會員？</span>
            </div>
            <button @click="goToLogin" class="btn btn-outline-orange rounded-pill px-4 btn-sm fw-bold">
              立即登入
            </button>
          </div>

          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="bg-orange p-4 text-white text-center">
              <h3 class="fw-bold mb-0">活動報名表單</h3>
              <p class="small mb-0 opacity-75">請填寫或確認您的報名資訊</p>
            </div>

            <div class="card-body p-4 p-md-5 bg-white">
              <form @submit.prevent="handleFormSubmit">

                <div class="section-title mb-4">
                  <h5 class="fw-bold text-dark border-start border-orange border-4 ps-2">基本資料</h5>
                  <p class="text-muted x-small ms-2" v-if="isMember">* 已為您自動帶入資料，您仍可手動修改。</p>
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">姓名 Name</label>
                    <input v-model="form.Name" type="text" class="form-control rounded-3" placeholder="請輸入姓名" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">性別 Sex</label>
                    <select v-model="form.Sex" class="form-select rounded-3" required>
                      <option :value="1">男性</option>
                      <option :value="2">女性</option>
                      <option :value="0">其他</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">電話 Phone</label>
                    <input v-model="form.Phone" type="tel" class="form-control rounded-3" placeholder="0912-345-678"
                      required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">電子信箱 Email</label>
                    <input v-model="form.Email" type="email" class="form-control rounded-3"
                      placeholder="example@mail.com" required>
                  </div>
                </div>

                <div class="section-title mb-4">
                  <div class="section-title mb-4">
                    <h5 class="fw-bold text-dark border-start border-orange border-4 ps-2">報名資訊</h5>
                  </div>

                  <div class="activity-summary-card bg-orange-light rounded-4 p-4 mb-4 border-0">
                    <div class="row align-items-center">
                      <div class="col-md-8">
                        <h6 class="fw-bold text-orange mb-3"><i class="bi bi-info-circle-fill me-2"></i>課程詳情</h6>
                        <ul class="list-unstyled small text-secondary mb-0">
                          <li class="mb-2"><i class="bi bi-check2-circle text-orange me-2"></i><strong>課程名稱：</strong>
                            夏季增肌特訓班 (基礎進階班)</li>
                          <li class="mb-2"><i class="bi bi-calendar-event text-orange me-2"></i><strong>開課日期：</strong>
                            2026/07/01 - 2026/08/31</li>
                          <li class="mb-2"><i class="bi bi-clock text-orange me-2"></i><strong>上課時間：</strong> 每週二、四
                            19:30 - 21:00</li>
                          <li class="mb-0"><i class="bi bi-geo-alt text-orange me-2"></i><strong>上課地點：</strong>
                            FitnessBar 專業重訓區</li>
                        </ul>
                      </div>
                      <div class="col-md-4 text-center mt-3 mt-md-0 border-start-md border-orange-light">
                        <div class="text-muted small mb-1">課程費用</div>
                        <div class="h3 fw-bold text-dark mb-0">NT$ {{ form.Amount }}</div>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="row g-3 mb-4 ps-2">
                  <div class="col-12 ps-4">
                    <div class="form-check form-switch custom-switch">
                      <input v-model="form.IsFirstTime" class="form-check-input" type="checkbox"
                        id="flexSwitchCheckDefault">
                      <label class="form-check-label text-muted" for="flexSwitchCheckDefault">這是我的初體驗
                        (首次參加本場館活動)</label>
                    </div>
                  </div>
                </div>

                <div class="section-title mb-4">
                  <h5 class="fw-bold text-dark border-start border-orange border-4 ps-2">付款方式</h5>
                </div>
                <div class="mb-4">
                  <div
                    class="payment-option p-3 border rounded-4 d-flex align-items-center justify-content-between selected">
                    <div class="d-flex align-items-center">
                      <img src="./images/line.png" alt="Line Pay" height="30" class="me-3">
                      <span class="fw-bold text-dark">LINE Pay 快速支付</span>
                    </div>
                    <div class="text-orange fw-bold fs-5">NT$ {{ form.Amount }}</div>
                  </div>
                </div>

                <div class="captcha-box p-4 bg-light rounded-4 mb-4 text-center">
                  <label class="form-label small fw-bold text-muted d-block mb-3">安全驗證：請輸入計算結果</label>
                  <div class="d-flex align-items-center justify-content-center gap-3">
                    <span class="fw-bold fs-4 text-dark">{{ captcha.num1 }} + {{ captcha.num2 }} =</span>
                    <input v-model="captcha.userAnswer" type="number" class="form-control text-center shadow-sm"
                      style="width: 120px; font-size: 1.2rem;" required>
                  </div>
                </div>

                <div class="text-center pt-3">
                  <button type="submit"
                    class="btn btn-orange text-white w-100 py-3 rounded-pill fw-bold shadow-sm transition-scale">
                    確認報名並跳轉至 LINE Pay
                  </button>
                  <p class="text-muted x-small mt-3">點擊上方按鈕即代表您同意本場館之報名條約與個人資料保護政策。</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 模擬登入狀態：測試時可以手動切換 false/true
const isMember = ref(false);

const form = ref({
  PostId: route.params.id,
  UserId: null,
  Name: '',
  Sex: 1,
  Phone: '',
  Email: '',
  Status: 0,
  PayStatus: 0,
  PayMethod: 1,
  Amount: 500,
  IsFirstTime: false
});

const captcha = ref({
  num1: Math.floor(Math.random() * 10),
  num2: Math.floor(Math.random() * 10),
  userAnswer: null
});

// 添加這段：跳轉至指定登入路徑
const goToLogin = () => {
  router.push('/users/login');
};

const handleFormSubmit = () => {
  if (captcha.value.userAnswer !== (captcha.value.num1 + captcha.value.num2)) {
    alert('驗證碼錯誤，請重新計算！');
    return;
  }
  alert('驗證成功！即將前往 LINE Pay...');
};

onMounted(() => {
  window.scrollTo(0, 0);
  // 會員資料自動帶入邏輯...
});
</script>

<style scoped>
/* 樣式保持與 list/detail 相同 */
.bg-orange {
  background-color: #f3722c;
}

.text-orange {
  color: #f3722c !important;
}

.border-orange {
  border-color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
}

.btn-orange:hover {
  background-color: #d65a1a;
}

.btn-outline-orange {
  color: #f3722c;
  border-color: #f3722c;
  background: transparent;
}

.btn-outline-orange:hover {
  background-color: #f3722c;
  color: white;
}

.breadcrumb-link {
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #f3722c !important;
  text-decoration: underline !important;
}

/* 進場動畫 */
.animate-fade-in {
  animation: fadeInDown 0.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.payment-option {
  border: 2px solid #dee2e6;
  transition: 0.3s;
}

.payment-option.selected {
  border-color: #f3722c;
  background-color: rgba(243, 114, 44, 0.05);
}

.transition-scale {
  transition: all 0.3s;
}

.transition-scale:active {
  transform: scale(0.98);
}

.x-small {
  font-size: 0.75rem;
}

.fw-bold {
  font-weight: 700 !important;
}

/* 活動摘要卡片樣式 */
.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.08) !important;
}

.activity-summary-card {
  border: 1px dashed rgba(243, 114, 44, 0.3);
}

.border-orange-light {
  border-color: rgba(243, 114, 44, 0.2) !important;
}

/* 在中大型螢幕才顯示左側邊框線 */
@media (min-width: 768px) {
  .border-start-md {
    border-left: 1px solid !important;
  }
}

.list-unstyled li {
  display: flex;
  align-items: flex-start;
}
</style>