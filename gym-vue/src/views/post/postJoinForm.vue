<template>
  <div class="join-page bg-light min-vh-100 py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">

          <div class="process-steps mb-5 px-md-5">
            <div class="d-flex justify-content-between position-relative">
              <div class="step-line"></div>
              <div v-for="n in 3" :key="n" class="step-item d-flex flex-column align-items-center z-1">
                <div class="step-circle mb-2" :class="{ 'active': currentStep === n, 'completed': currentStep > n }">
                  <i v-if="currentStep > n" class="bi bi-check-lg"></i>
                  <span v-else>{{ n }}</span>
                </div>
                <span class="step-label fw-bold" :class="currentStep >= n ? 'text-dark' : 'text-muted'">
                  {{ n === 1 ? '基本資料' : n === 2 ? '付款方式' : '完成報名' }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="postData?.EventInfo" class="card border-0 shadow-sm rounded-4 mb-4 animate-up">
            <div class="card-header bg-orange text-white py-3 rounded-top-4">
              <h5 class="mb-0 text-center fw-bold"><i class="bi bi-info-circle me-2"></i>活動詳細資訊</h5>
            </div>
            <div class="card-body p-4">
              <h3 class="fw-bold mb-4 text-dark border-bottom pb-3 text-center text-md-start">{{ postData.Title }}</h3>
              <div class="row g-4">
                <div class="col-md-6 d-flex align-items-center">
                  <div class="info-icon-box bg-orange-light text-orange me-3 shadow-sm">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div>
                    <small class="text-muted d-block">活動地點</small>
                    <span class="fw-bold text-dark">{{ postData.EventInfo.Venue }}</span>
                  </div>
                </div>
                <div class="col-md-6 d-flex align-items-center">
                  <div class="info-icon-box bg-orange-light text-orange me-3 shadow-sm">
                    <i class="bi bi-currency-dollar"></i>
                  </div>
                  <div>
                    <small class="text-muted d-block">報名費用</small>
                    <span class="fw-bold fs-5 text-danger">
                      {{ postData.EventInfo.Fee > 0 ? `$${postData.EventInfo.Fee}` : '免費' }}
                    </span>
                  </div>
                </div>
                <div class="col-md-6 d-flex align-items-center">
                  <div class="info-icon-box bg-orange-light text-orange me-3 shadow-sm">
                    <i class="bi bi-calendar-check-fill"></i>
                  </div>
                  <div>
                    <small class="text-muted d-block">活動時間</small>
                    <span class="fw-bold text-dark small">{{ formatDateTime(postData.EventInfo.StartDate) }} ~ {{
                      formatDateTime(postData.EventInfo.EndDate) }}</span>
                  </div>
                </div>
                <div class="col-md-6 d-flex align-items-center">
                  <div class="info-icon-box bg-danger-light text-danger me-3 shadow-sm">
                    <i class="bi bi-exclamation-circle-fill"></i>
                  </div>
                  <div>
                    <small class="text-muted d-block">報名截止日期</small>
                    <span class="fw-bold text-danger">{{ formatDateTime(postData.EventInfo.RegistrationDeadline)
                      }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 animate-up shadow-hover"
            style="animation-delay: 0.1s;">
            <div class="text-center mb-5">
              <div class="badge bg-orange-light text-orange px-3 py-2 rounded-pill mb-3 fw-bold">Registration Form</div>
              <h4 class="fw-bold text-dark mb-2">填寫報名資料</h4>

              <div v-if="!isLoggedIn"
                class="mt-4 p-3 rounded-4 bg-orange-light border-orange-dashed d-flex align-items-center justify-content-between">
                <div class="text-start d-flex align-items-center">
                  <i class="bi bi-person-circle fs-3 text-orange me-3"></i>
                  <div>
                    <div class="fw-bold text-dark small">您目前以訪客身份報名</div>
                    <div class="text-muted extra-small">登入會員可自動填寫資料</div>
                  </div>
                </div>
                <button @click="goToLogin" type="button"
                  class="btn btn-orange btn-sm rounded-pill px-3 fw-bold shadow-sm">立即登入</button>
              </div>
              <div v-else class="mt-3">
                <span class="badge bg-success-light text-success rounded-pill px-3 py-2">
                  <i class="bi bi-check-circle-fill me-1"></i> 會員資料已自動帶入
                </span>
              </div>
            </div>

            <form @submit.prevent="handleFormSubmit">
              <div class="row g-4 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-secondary">姓名 Name <span
                      class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-person"></i></span>
                    <input v-model="form.Name" type="text" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="王小明" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold small text-secondary">性別 Sex <span
                      class="text-danger">*</span></label>
                  <div class="d-flex gap-3 mt-2">
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="1"
                        id="sexMale">
                      <label class="form-check-label fw-bold text-dark" for="sexMale">男性</label>
                    </div>
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="2"
                        id="sexFemale">
                      <label class="form-check-label fw-bold text-dark" for="sexFemale">女性</label>
                    </div>
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="0"
                        id="sexOther">
                      <label class="form-check-label fw-bold text-dark" for="sexOther">其他</label>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold small text-secondary">電子信箱 Email <span
                      class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i
                        class="bi bi-envelope"></i></span>
                    <input v-model="form.Email" type="email" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="example@fitness.com" required>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold small text-secondary">聯絡電話 Phone <span
                      class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-phone"></i></span>
                    <input v-model="form.Phone" type="tel" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="0912345678" required>
                  </div>
                </div>
              </div>

              <div v-if="postData?.EventInfo?.Fee > 0"
                class="payment-box mb-5 p-4 rounded-4 bg-orange-light border-orange-light border">
                <label class="form-label fw-bold small text-dark d-block mb-3">
                  <i class="bi bi-credit-card-2-back me-2"></i>選擇付款方式 <span class="text-danger">*</span>
                </label>
                <div class="row g-3">
                  <div class="col-6">
                    <div class="payment-option p-3 rounded-3 text-center border bg-white"
                      :class="{ 'active': form.PaymentMethod === 'LINEPAY' }" @click="form.PaymentMethod = 'LINEPAY'">
                      <i class="bi bi-p-circle-fill text-success fs-4 d-block mb-1"></i>
                      <span class="fw-bold small">LINE PAY</span>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="payment-option p-3 rounded-3 text-center border bg-white"
                      :class="{ 'active': form.PaymentMethod === 'ATM' }" @click="form.PaymentMethod = 'ATM'">
                      <i class="bi bi-bank text-primary fs-4 d-block mb-1"></i>
                      <span class="fw-bold small">ATM 轉帳</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="captcha-wrapper p-4 rounded-4 bg-light mb-5 border border-dashed d-flex justify-content-center">
                <vue-recaptcha sitekey="6LcNAHcsAAAAAFgudKK9KwtxBbWF7yrTTDZODESg" @verify="onVerify"
                  @expired="onExpired" />
              </div>

              <button type="submit" :disabled="isSubmitting"
                class="btn btn-orange w-100 py-3 rounded-pill fw-bold text-white shadow-orange-hover mt-2 d-flex align-items-center justify-content-center gap-2">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
                <i v-else class="bi bi-send-check-fill"></i>
                {{ isSubmitting ? '處理中...' : (postData?.EventInfo?.Fee > 0 ? '前往付款' : '完成報名') }}
              </button>

              <p class="text-center text-muted extra-small mt-4 mb-0">
                ※ 點擊按鈕代表同意 FitnessBar 之活動條款。
              </p>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import  VueRecaptcha  from 'vue3-recaptcha-v2';

const route = useRoute();
const router = useRouter();
const postData = ref(null);
const isSubmitting = ref(false);
const currentStep = ref(1);
const isLoggedIn = ref(false);

// Google reCAPTCHA 相關
const recaptchaToken = ref('');
const onVerify = (response) => {
  recaptchaToken.value = response;
};
const onExpired = () => {
  recaptchaToken.value = '';
};

const form = reactive({
  PostId: route.params.id,
  Name: '',
  Sex: '1',
  Email: '',
  Phone: '',
  PaymentMethod: 'LINEPAY'
});

// --- 會員資料處理邏輯 ---

// 1. 模擬測試資料注入 (組員寫好前使用)
const injectTestData = () => {
  const testKey = 'userInfo';
  if (!localStorage.getItem(testKey)) {
    const mockUser = {
      name: "王大錘",
      sex: "1",
      email: "hammer.king@fitness.com",
      phone: "0900123456"
    };
    localStorage.setItem(testKey, JSON.stringify(mockUser));
    console.log("🛠️ 已注入模擬會員資料");
  }
};

// 2. 檢查並抓取 localStorage 資料
const checkUserStatus = () => {
  const savedData = localStorage.getItem('userInfo');
  if (savedData) {
    try {
      const userData = JSON.parse(savedData);
      isLoggedIn.value = true;
      // 自動填入
      form.Name = userData.name || '';
      form.Sex = userData.sex ? String(userData.sex) : '1';
      form.Email = userData.email || '';
      form.Phone = userData.phone || '';
    } catch (e) {
      console.error('會員資料解析失敗', e);
    }
  }
};

const goToLogin = () => {
  sessionStorage.setItem('redirectUrl', route.fullPath);
  router.push('/login');
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '未定';
  const date = new Date(dateStr);
  return date.toLocaleString('zh-TW', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
};

const fetchAllInfo = async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`https://localhost:7218/api/YPosts/${id}`);
    postData.value = response.data;
  } catch (error) {
    console.error('資料讀取失敗', error);
  }
};

const handleFormSubmit = async () => {
  // 驗證 Google reCAPTCHA
  if (!recaptchaToken.value) {
    Swal.fire({ icon: 'warning', title: '驗證提醒', text: '請先勾選「我不是機器人」', confirmButtonColor: '#f3722c' });
    return;
  }

  isSubmitting.value = true;

  try {
    // 流程步驟 2: 付款確認
    if (postData.value.EventInfo.Fee > 0) {
      currentStep.value = 2;
      const result = await Swal.fire({
        title: '確認報名資訊？',
        text: `費用：$${postData.value.EventInfo.Fee} / 付款方式：${form.PaymentMethod}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f3722c',
        confirmButtonText: '前往付款',
        cancelButtonText: '再檢查一下'
      });

      if (!result.isConfirmed) {
        currentStep.value = 1;
        isSubmitting.value = false;
        return;
      }
    }

    // 模擬 API 送出
    const finalData = { ...form, captcha: recaptchaToken.value };
    console.log('送出的資料：', finalData);

    await new Promise(resolve => setTimeout(resolve, 1500));
    currentStep.value = 3;

    await Swal.fire({ icon: 'success', title: '報名完成！', text: '已收到您的報名，請留意信箱通知', confirmButtonColor: '#f3722c' });
    router.push('/post/card');

  } catch (error) {
    Swal.fire('系統錯誤', '暫時無法報名，請稍後再試', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  injectTestData(); // 測試用，對接後可刪除
  checkUserStatus();
  fetchAllInfo();
});
</script>

<style scoped>
/* 流程進度條 */
.process-steps {
  position: relative;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
  width: 80%;
  margin: 0 auto;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #999;
  z-index: 1;
  transition: 0.3s;
}

.step-circle.active {
  border-color: #f3722c;
  color: #f3722c;
  box-shadow: 0 0 0 4px rgba(243, 114, 44, 0.1);
}

.step-circle.completed {
  background: #f3722c;
  border-color: #f3722c;
  color: #fff;
}

.step-label {
  font-size: 0.85rem;
  margin-top: 5px;
}

/* 付款選項 */
.payment-option {
  cursor: pointer;
  transition: 0.2s;
  border-color: #eee !important;
}

.payment-option:hover {
  border-color: #f3722c !important;
  background-color: #fff9f6 !important;
}

.payment-option.active {
  border-color: #f3722c !important;
  background-color: #fff9f6 !important;
  box-shadow: 0 4px 12px rgba(243, 114, 44, 0.1);
}

/* 基本樣式 */
.text-orange {
  color: #f3722c !important;
}

.bg-orange {
  background-color: #f3722c !important;
}

.bg-orange-light {
  background-color: rgba(243, 114, 44, 0.08);
}

.bg-success-light {
  background-color: rgba(25, 135, 84, 0.08);
}

.border-orange-light {
  border-color: rgba(243, 114, 44, 0.2) !important;
}

.border-orange-dashed {
  border: 2px dashed rgba(243, 114, 44, 0.2);
}

.btn-orange {
  background-color: #f3722c;
  border: none;
  transition: 0.3s;
}

.btn-orange:hover:not(:disabled) {
  background-color: #e6601b;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(243, 114, 44, 0.4);
}

.custom-input-group {
  border: 2px solid #f1f1f1;
  border-radius: 12px;
  transition: 0.3s;
  overflow: hidden;
}

.custom-input-group:focus-within {
  border-color: #f3722c;
  box-shadow: 0 0 0 4px rgba(243, 114, 44, 0.1);
}

.custom-input-group .form-control {
  border: none;
  padding: 0.8rem 0.5rem;
}

.custom-radio .form-check-input:checked {
  background-color: #f3722c;
  border-color: #f3722c;
}

.info-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.animate-up {
  animation: fadeInUp 0.6s ease-out both;
}

.extra-small {
  font-size: 0.75rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>