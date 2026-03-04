<template>
  <div class="join-page bg-light min-vh-100 py-5">

    <Transition name="fade">
      <div v-if="isLoginModalShow" class="login-overlay d-flex align-items-center justify-content-center"
        @click.self="isLoginModalShow = false">
        <div class="auth-card shadow animate-pop">
          <button class="close-modal-btn" @click="isLoginModalShow = false">&times;</button>

          <div class="text-center mb-5">
            <h2 class="fw-bold tech-blue-text">歡迎回來 (Demo)</h2>
            <p class="text-muted small">登入後將自動帶入您的報名資料</p>
          </div>

          <form @submit.prevent="handleFakeLogin">
            <div class="input-wrapper mb-4">
              <input type="text" v-model="loginEmail" class="minimal-input" placeholder=" " required>
              <label class="floating-label">信箱(Email)</label>
            </div>

            <div class="input-wrapper mb-5">
              <input type="password" v-model="loginPassword" class="minimal-input" placeholder=" " required>
              <label class="floating-label">密碼</label>
            </div>

            <button type="submit" class="btn-primary-tech-login w-100 mb-3">登入</button>
          </form>

          <div class="social-section">
            <div class="divider-login"><span>或使用其他方式</span></div>
            <div class="d-flex justify-content-center gap-4">
              <button class="social-circle-login" @click="handleFakeLogin">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
              </button>
              <button class="social-circle-login" @click="handleFakeLogin">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE">
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">

          <div class="process-steps mb-5 px-md-5">
            <div class="d-flex justify-content-between position-relative">
              <div class="step-line"></div>
              <div v-for="n in 2" :key="n" class="step-item d-flex flex-column align-items-center z-1">
                <div class="step-circle mb-2" :class="{ 'active': currentStep === n, 'completed': currentStep > n }">
                  <i v-if="currentStep > n" class="bi bi-check-lg"></i>
                  <span v-else>{{ n }}</span>
                </div>
                <span class="step-label fw-bold" :class="currentStep >= n ? 'text-dark' : 'text-muted'">
                  {{ n === 1 ? '填寫資料' : '完成報名' }}
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
                    <span class="fw-bold text-dark small">
                      {{ formatDateTime(postData.EventInfo.StartDate) }} ~ {{ formatDateTime(postData.EventInfo.EndDate)
                      }}
                    </span>
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
                    <div class="text-muted extra-small">立即註冊登入享有更多優惠資訊!</div>
                  </div>
                </div>
                <button @click="isLoginModalShow = true" type="button"
                  class="btn btn-orange btn-sm rounded-pill px-3 fw-bold shadow-sm">立即登入</button>
              </div>
              <div v-else class="mt-3 d-flex align-items-center justify-content-center">
                <span class="badge bg-success-light text-success rounded-pill px-3 py-2">
                  <i class="bi bi-check-circle-fill me-1"></i> 會員資料已自動帶入
                </span>
              </div>
            </div>

            <form @submit.prevent="handleFormSubmit">
              <div class="row g-4 mb-4">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-secondary">姓名<span class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-person"></i></span>
                    <input v-model="form.Name" type="text" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="陸小美" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold small text-secondary">性別<span class="text-danger">*</span></label>
                  <div class="d-flex gap-3 mt-2">
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="1"
                        id="sexMale">
                      <label class="form-check-label fw-bold text-dark" for="sexMale">男性</label>
                    </div>
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="0"
                        id="sexFemale">
                      <label class="form-check-label fw-bold text-dark" for="sexFemale">女性</label>
                    </div>
                    <div class="form-check custom-radio">
                      <input v-model="form.Sex" class="form-check-input shadow-none" type="radio" value="2"
                        id="sexOther">
                      <label class="form-check-label fw-bold text-dark" for="sexOther">其他</label>
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold small text-secondary">電子信箱(Email) <span
                      class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i
                        class="bi bi-envelope"></i></span>
                    <input v-model="form.Email" type="email" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="example@fitness.com" required>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-bold small text-secondary">聯絡電話<span class="text-danger">*</span></label>
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

              <div class="mb-4 d-flex justify-content-center">
                <div id="recaptcha-element"></div>
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

const route = useRoute();
const router = useRouter();
const postData = ref(null);
const isSubmitting = ref(false);
const currentStep = ref(1);
const isLoggedIn = ref(false);

// 彈窗控制與假登入資料
const isLoginModalShow = ref(false);
const loginEmail = ref('ming01@test.com');
const loginPassword = ref('pwd123');

const form = reactive({
  PostId: route.params.id,
  Name: '',
  Sex: '1',
  Email: '',
  Phone: '',
  PaymentMethod: 'LINEPAY'
});

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

// 檢查並帶入資料
const checkUserStatus = () => {
  const savedData = localStorage.getItem('userInfo');
  if (savedData) {
    try {
      const userData = JSON.parse(savedData);
      isLoggedIn.value = true;
      form.Name = userData.name || '';
      form.Email = userData.email || '';
      form.Phone = userData.phone || '';
      // 性別判定
      if (userData.sex === '男' || userData.sex === 1 || userData.sex === '1') form.Sex = '1';
      else if (userData.sex === '女' || userData.sex === 0 || userData.sex === '0') form.Sex = '0';
      else form.Sex = '2';
    } catch (e) {
      console.error('會員資料解析失敗', e);
    }
  } else {
    isLoggedIn.value = false;
  }
};

// ================= 核心：假登入邏輯 (原地更新) =================
const handleFakeLogin = () => {
  const mockUser = {
    userId:1,
    name: '王小明',
    sex: '1',
    email: loginEmail.value || 'ming01@test.com',
    phone: '0912345678'
  };

  localStorage.setItem('userInfo', JSON.stringify(mockUser));

  isLoginModalShow.value = false; // 關閉彈窗
  checkUserStatus(); // 原地更新表單

  Swal.fire({
    icon: 'success',
    title: '登入成功',
    text: '已為您自動帶入會員資料',
    timer: 1500,
    showConfirmButton: false
  });
};

const handleLogout = () => {
  localStorage.removeItem('userInfo');
  form.Name = ''; form.Email = ''; form.Phone = '';
  isLoggedIn.value = false;
  Swal.fire('已登出', '資料已清除', 'info');
};

// reCAPTCHA 處理
let recaptchaWidgetId = null;
const renderRecaptcha = () => {
  if (window.grecaptcha && window.grecaptcha.render) {
    try {
      recaptchaWidgetId = window.grecaptcha.render('recaptcha-element', {
        'sitekey': '6LcNAHcsAAAAAFgudKK9KwtxBbWF7yrTTDZODESg'
      });
    } catch (e) { }
  } else {
    setTimeout(renderRecaptcha, 500);
  }
};

// 表單提交
const handleFormSubmit = async () => {
  const token = window.grecaptcha.getResponse(recaptchaWidgetId);
  if (!token) {
    Swal.fire({ icon: 'warning', title: '驗證提醒', text: '請先勾選「我不是機器人」' });
    return;
  }

  isSubmitting.value = true;
  try {
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const payload = {
      PostId: Number(route.params.id),
      EventId: Number(postData.value.EventInfo.EventId),
      UserId: userData.userId ? Number(userData.userId) : null,
      Name: form.Name,
      Sex: String(form.Sex),
      Email: form.Email,
      Phone: form.Phone,
      Fee: Number(postData.value.EventInfo.Fee),
      PaymentMethod: form.PaymentMethod,
      CaptchaToken: token
    };

    if (postData.value?.EventInfo?.Fee > 0 && form.PaymentMethod === 'LINEPAY') {
      const response = await axios.post('https://localhost:7218/api/YLINEPAY/RequestPayment', payload);
      if (response.data.returnCode === '0000') {
        window.location.href = response.data.info.paymentUrl.web;
      }
    } else {
      const response = await axios.post('https://localhost:7218/api/YPosts/Register', payload);
      await Swal.fire({ icon: 'success', title: '報名完成！', text: response.data.message });
      router.push('/post/card');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('錯誤', '提交失敗', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  window.scrollTo(0, 0);
  checkUserStatus();
  fetchAllInfo();
  renderRecaptcha();
});
</script>

<style scoped>
/* ================= 彈窗專屬 CSS (完全復刻您的登入 UI) ================= */
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 10000;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  color: #ccc;
  cursor: pointer;
}

.tech-blue-text {
  color: #f38d00;
}

.input-wrapper {
  position: relative;
}

.minimal-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 0;
  font-size: 16px;
  background: transparent;
  outline: none;
  transition: all 0.3s;
}

.minimal-input:focus {
  border-bottom: 2px solid #f38d00;
}

.floating-label {
  position: absolute;
  top: 12px;
  left: 0;
  color: #999;
  pointer-events: none;
  transition: all 0.3s ease;
}

.minimal-input:focus~.floating-label,
.minimal-input:not(:placeholder-shown)~.floating-label {
  top: -18px;
  font-size: 12px;
  color: #f38d00;
}

.btn-primary-tech-login {
  background: #f38d00;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.3s;
}

.btn-primary-tech-login:hover {
  background: #d67d00;
  transform: translateY(-2px);
}

.divider-login {
  display: flex;
  align-items: center;
  margin: 30px 0 20px;
}

.divider-login::before,
.divider-login::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider-login span {
  padding: 0 15px;
  font-size: 12px;
  color: #999;
}

.social-circle-login {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-circle-login img {
  width: 24px;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* ================= 原本的 CSS ================= */
.process-steps {
  position: relative;
}

.step-line {
  position: absolute;
  top: 20px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e0e0e0;
  z-index: 0;
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

.btn-orange {
  background-color: #f3722c;
  border: none;
  color: white;
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

.border-orange-dashed {
  border: 2px dashed #f3722c !important;
}
</style>