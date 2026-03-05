<template>
  <div class="service-wrapper bg-light min-vh-100 pb-5">
    <Banner title="客服回報" subtitle="您的意見是我們前進的動力，請填寫下方資訊與我們聯絡" />

    <Transition name="fade">
      <div v-if="isLoginModalShow" class="login-overlay d-flex align-items-center justify-content-center"
        @click.self="isLoginModalShow = false">
        <div class="auth-card shadow animate-pop">
          <button class="close-modal-btn" @click="isLoginModalShow = false">&times;</button>

          <div class="text-center mb-5">
            <h2 class="fw-bold tech-blue-text">歡迎回來 (Demo)</h2>
            <p class="text-muted small">登入後將自動帶入您的聯絡資料</p>
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

    <div class="container py-4">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange">客服回報</span>
        </p>
      </nav>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div v-if="!isLoggedIn"
            class="mb-4 p-3 rounded-4 bg-orange-light border-orange-dashed d-flex align-items-center justify-content-between animate-up">
            <div class="text-start d-flex align-items-center">
              <i class="bi bi-person-circle fs-3 text-orange me-3"></i>
              <div>
                <div class="fw-bold text-dark small">您目前以訪客身份回報</div>
                <div class="text-muted extra-small">立即登入可自動帶入基本資料</div>
              </div>
            </div>
            <button @click="isLoginModalShow = true" type="button"
              class="btn btn-orange btn-sm rounded-pill px-3 fw-bold shadow-sm">立即登入</button>
          </div>
          <div v-else class="mb-4 text-center animate-up">
            <span class="badge bg-success-light text-success rounded-pill px-3 py-2">
              <i class="bi bi-check-circle-fill me-1"></i> 會員資料已自動帶入
            </span>
            <button @click="handleLogout" class="btn btn-link btn-sm text-secondary ms-2">登出</button>
          </div>

          <div class="card border-0 shadow-sm rounded-4 overflow-hidden animate-up shadow-hover">
            <div class="card-body p-4 p-md-5 bg-white">
              <form @submit.prevent="handleSubmit">
                <div class="row g-4 mb-4">
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">姓名<span class="text-danger">*</span></label>
                    <div class="input-group custom-input-group">
                      <span class="input-group-text bg-white border-end-0 text-muted"><i
                          class="bi bi-person"></i></span>
                      <input v-model="form.name" type="text" class="form-control border-start-0 ps-0 shadow-none"
                        placeholder="如何稱呼您" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-secondary">聯絡電話<span
                        class="text-danger">*</span></label>
                    <div class="input-group custom-input-group">
                      <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-phone"></i></span>
                      <input v-model="form.phone" type="tel" class="form-control border-start-0 ps-0 shadow-none"
                        placeholder="0912345678" required>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold small text-secondary">電子信箱(Email)<span
                      class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i
                        class="bi bi-envelope"></i></span>
                    <input v-model="form.email" type="email" class="form-control border-start-0 ps-0 shadow-none"
                      placeholder="example@email.com" required>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold small text-secondary">問題類別<span class="text-danger">*</span></label>
                  <div class="input-group custom-input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-list-ul"></i></span>
                    <select v-model="form.questionCategoryId" class="form-select border-start-0 ps-0 shadow-none"
                      required>
                      <option value="" disabled>請選擇問題類型</option>
                      <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-bold small text-secondary">內容描述<span class="text-danger">*</span></label>
                  <textarea v-model="form.detail" class="form-control rounded-4 py-3 custom-textarea" rows="5"
                    placeholder="請詳細描述您的問題或建議..." required></textarea>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted d-block">相關圖片附件 (選填)</label>
                  <div class="upload-area rounded-4 p-4 text-center border-dashed position-relative">
                    <input type="file" @change="handleFileUpload" class="file-input" accept="image/*" id="fileUpload">
                    <div v-if="!imagePreview">
                      <i class="bi bi-cloud-arrow-up fs-2 text-orange"></i>
                      <p class="small text-muted mb-0 mt-2">點擊或拖入圖片 (不超過 2MB)</p>
                    </div>
                    <div v-else class="preview-box">
                      <img :src="imagePreview" class="img-fluid rounded-3 shadow-sm mb-2" style="max-height: 150px;">
                      <button type="button" @click="removeImage"
                        class="btn btn-sm btn-danger rounded-pill position-absolute top-0 end-0 m-2">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mb-4 d-flex justify-content-center">
                  <div id="recaptcha-element"></div>
                </div>

                <div class="mb-4 text-center">
                  <div class="form-check d-inline-block">
                    <input v-model="form.agree" class="form-check-input" type="checkbox" id="agreeCheck" required>
                    <label class="form-check-label small text-muted" for="agreeCheck">
                      我已閱讀並同意 <a href="#" class="text-orange text-decoration-none">個人資料保護法</a> 告知事項
                    </label>
                  </div>
                </div>

                <button type="submit" :disabled="isSubmitting"
                  class="btn btn-orange w-100 py-3 rounded-pill fw-bold text-white shadow-orange-hover mt-2 d-flex align-items-center justify-content-center gap-2">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-send-check-fill"></i>
                  {{ isSubmitting ? '處理中...' : '確認並送出回報' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Banner from '@/components/banner.vue';
import Swal from 'sweetalert2';

const isSubmitting = ref(false);
const imagePreview = ref(null);
const categoryList = ref([]);
const isLoggedIn = ref(false);
const isLoginModalShow = ref(false);
const loginEmail = ref('ming01@test.com');
const loginPassword = ref('pwd123');

const form = reactive({
  name: '',
  phone: '',
  email: '',
  questionCategoryId: '',
  detail: '',
  agree: false
});

// 檢查登入狀態
const checkUserStatus = () => {
  const savedData = localStorage.getItem('userInfo');
  if (savedData) {
    const userData = JSON.parse(savedData);
    isLoggedIn.value = true;
    form.name = userData.name || '';
    form.email = userData.email || '';
    form.phone = userData.phone || '';
  }
};

const handleFakeLogin = () => {
  const mockUser = {
    userId: 1,
    name: '王小明',
    email: loginEmail.value,
    phone: '0912345678'
  };
  localStorage.setItem('userInfo', JSON.stringify(mockUser));
  isLoginModalShow.value = false;
  checkUserStatus();
  Swal.fire({ icon: 'success', title: '登入成功', timer: 1500, showConfirmButton: false });
};

const handleLogout = () => {
  localStorage.removeItem('userInfo');
  isLoggedIn.value = false;
  form.name = ''; form.email = ''; form.phone = '';
  Swal.fire('已登出', '聯絡資料已清除', 'info');
};

// reCAPTCHA 渲染
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

onMounted(async () => {
  checkUserStatus();
  renderRecaptcha();
  try {
    const response = await fetch('https://localhost:7218/api/YCustomerService/Categories');
    if (response.ok) categoryList.value = await response.json();
  } catch (error) {
    console.error("分類載入失敗", error);
  }
});

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('錯誤', '圖片大小不能超過 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => imagePreview.value = event.target.result;
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  const fileInput = document.getElementById('fileUpload');
  if (fileInput) fileInput.value = '';
};

const handleSubmit = async () => {
  const token = window.grecaptcha.getResponse(recaptchaWidgetId);
  if (!token) {
    Swal.fire('驗證提醒', '請先勾選「我不是機器人」', 'warning');
    return;
  }

  isSubmitting.value = true;
  const formData = new FormData();
  formData.append('Name', form.name);
  formData.append('Phone', form.phone);
  formData.append('Email', form.email);
  formData.append('QuestionCategoryId', form.questionCategoryId);
  formData.append('Detail', form.detail);
  formData.append('CaptchaToken', token);

  const fileInput = document.getElementById('fileUpload');
  if (fileInput && fileInput.files[0]) {
    formData.append('ImageFile', fileInput.files[0]);
  }

  try {
    const response = await fetch('https://localhost:7218/api/YCustomerService', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      await Swal.fire({
        title: '回報成功',
        text: '我們已收到您的資訊，系統將自動發送確認信至您的電子信箱。',
        icon: 'success',
        confirmButtonColor: '#f3722c'
      });

      // 重置表單狀態 (不重新整理頁面，對寄信流程更友善)
      Object.assign(form, {
        questionCategoryId: '',
        detail: '',
        agree: false
      });
      imagePreview.value = null;
      if (fileInput) fileInput.value = '';
      window.grecaptcha.reset(recaptchaWidgetId);

    } else {
      const err = await response.json();
      Swal.fire('送出失敗', err.message || '請檢查輸入內容', 'error');
    }
  } catch (error) {
    Swal.fire('錯誤', '網路連線失敗', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* 樣式保持與之前一致，確保 UI 美觀 */
.tech-blue-text {
  color: #f3722c;
}

.text-orange {
  color: #f3722c !important;
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
  border-bottom: 2px solid #f3722c;
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
  color: #f3722c;
}

.btn-primary-tech-login {
  background: #f3722c;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  transition: 0.3s;
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

.custom-input-group .form-control,
.custom-input-group .form-select {
  border: none;
  padding: 0.8rem 0.5rem;
}

.custom-textarea {
  border: 2px solid #f1f1f1;
  border-radius: 16px;
  transition: 0.3s;
}

.custom-textarea:focus {
  border-color: #f3722c;
  box-shadow: 0 0 0 4px rgba(243, 114, 44, 0.1);
  outline: none;
}

.border-dashed {
  border: 2px dashed #dee2e6;
}

.upload-area:hover {
  border-color: #f3722c;
  background: rgba(243, 114, 44, 0.02);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.border-orange-dashed {
  border: 2px dashed #f3722c !important;
}

.animate-up {
  animation: fadeInUp 0.6s ease-out both;
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

.shadow-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, .1) !important;
  transition: 0.3s;
}

.extra-small {
  font-size: 0.75rem;
}
</style>