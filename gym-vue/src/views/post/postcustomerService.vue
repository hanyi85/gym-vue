<template>
  <div class="service-wrapper bg-light min-vh-100 pb-5">
    <Banner title="客服回報" subtitle="您的意見是我們前進的動力，請填寫下方資訊與我們聯絡" />

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
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden animate-fade-in">
            <div class="bg-orange p-4 text-white text-center">
              <h4 class="fw-bold mb-0">需要更多的協助？</h4>
              <p class="small mb-0 opacity-75">請填寫正確資訊，我們將盡快與您聯絡</p>
            </div>

            <div class="card-body p-4 p-md-5 bg-white">
              <form @submit.prevent="handleSubmit">
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">姓名 *</label>
                    <input v-model="form.name" type="text" class="form-control rounded-3 py-2" placeholder="如何稱呼您"
                      required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">聯絡電話 *</label>
                    <input v-model="form.phone" type="tel" class="form-control rounded-3 py-2"
                      placeholder="0912-345-678" required>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">電子信箱 *</label>
                  <input v-model="form.email" type="email" class="form-control rounded-3 py-2"
                    placeholder="example@mail.com" required>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">選擇問題類別 *</label>
                  <select v-model="form.category" class="form-select rounded-3 py-2" required>
                    <option value="" disabled>請選擇問題類型</option>
                    <option value="membership">會籍/合約相關</option>
                    <option value="course">課程/預約問題</option>
                    <option value="venue">場館設施回報</option>
                    <option value="trainer">教練服務意見</option>
                    <option value="other">其他建議</option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">內容描述 *</label>
                  <textarea v-model="form.content" class="form-control rounded-4 py-3" rows="5"
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

                <div class="captcha-box p-4 bg-light rounded-4 mb-4 text-center">
                  <label class="form-label small fw-bold text-muted d-block mb-3">安全驗證：請輸入計算結果</label>
                  <div class="d-flex align-items-center justify-content-center gap-3">
                    <span class="fw-bold fs-4 text-dark">{{ captcha.num1 }} + {{ captcha.num2 }} =</span>
                    <input v-model="captcha.userAnswer" type="number" class="form-control text-center shadow-sm"
                      style="width: 100px;" required>
                  </div>
                </div>

                <div class="mb-4 text-center">
                  <div class="form-check d-inline-block">
                    <input v-model="form.agree" class="form-check-input" type="checkbox" id="agreeCheck" required>
                    <label class="form-check-label small text-muted" for="agreeCheck">
                      我已閱讀並同意 <a href="#" class="text-orange">個人資料保護法</a> 告知事項
                    </label>
                  </div>
                </div>

                <div class="text-center">
                  <button type="submit" :disabled="isSubmitting"
                    class="btn btn-orange text-white w-100 py-3 rounded-pill fw-bold shadow-sm transition-scale">
                    <span v-if="!isSubmitting">確認並送出回報</span>
                    <span v-else><span class="spinner-border spinner-border-sm me-2"></span>處理中...</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-4 p-4 bg-white rounded-4 shadow-sm border text-center">
            <div class="row g-3">
              <div class="col-md-4">
                <div class="small fw-bold text-muted">客服電話</div>
                <div class="text-dark fw-bold">05-1234-567</div>
              </div>
              <div class="col-md-4">
                <div class="small fw-bold text-muted">服務時間</div>
                <div class="text-dark fw-bold">平日 07:00 ~ 20:00</div>
              </div>
              <div class="col-md-4">
                <div class="small fw-bold text-muted">聯絡信箱</div>
                <div class="text-dark fw-bold">FitnessBar123@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Banner from '@/components/banner.vue';

const isSubmitting = ref(false);
const imagePreview = ref(null);

const form = reactive({
  name: '',
  phone: '',
  email: '',
  category: '',
  content: '',
  agree: false
});

const captcha = reactive({
  num1: Math.floor(Math.random() * 10),
  num2: Math.floor(Math.random() * 10),
  userAnswer: null
});

// 圖片上傳預覽邏輯
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('圖片大小不能超過 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = null;
  document.getElementById('fileUpload').value = '';
};

const handleSubmit = () => {
  // 驗證碼檢查
  if (captcha.userAnswer !== (captcha.num1 + captcha.num2)) {
    alert('驗證碼計算錯誤，請重新確認！');
    return;
  }

  isSubmitting.value = true;

  // 模擬 API 傳送
  setTimeout(() => {
    alert('感謝您的回報！我們已收到您的資訊，將盡快指派專人與您聯絡。');
    isSubmitting.value = false;
    // 重設表單...
  }, 2000);
};
</script>

<style scoped>
.bg-orange {
  background-color: #f3722c;
}

.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
}

.btn-orange:hover {
  background-color: #d65a1a;
}

.border-orange {
  border-color: #f3722c !important;
}

/* 圖片上傳區樣式 */
.border-dashed {
  border: 2px dashed #dee2e6;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #f3722c;
  background-color: rgba(243, 114, 44, 0.02);
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

/* 其他優化 */
.animate-fade-in {
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.transition-scale {
  transition: all 0.2s;
}

.transition-scale:active {
  transform: scale(0.98);
}

.x-small {
  font-size: 0.75rem;
}
</style>