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
                  <select v-model="form.questionCategoryId" class="form-select rounded-3 py-2" required>
                    <option value="" disabled>請選擇問題類型</option>
                    <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>

                <div class="mb-4">
                  <label class="form-label small fw-bold text-muted">內容描述 *</label>
                  <textarea v-model="form.detail" class="form-control rounded-4 py-3" rows="5"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Banner from '@/components/banner.vue';

const isSubmitting = ref(false);
const imagePreview = ref(null);
const categoryList = ref([]); // 儲存從後端抓取的分類清單

const form = reactive({
  name: '',
  phone: '',
  email: '',
  questionCategoryId: '', // 改為對應後端 ID
  detail: '',
  agree: false
});

const captcha = reactive({
  num1: Math.floor(Math.random() * 10),
  num2: Math.floor(Math.random() * 10),
  userAnswer: null
});

// 初始化：抓取問題類別清單
onMounted(async () => {
  try {
    const response = await fetch('https://localhost:7218/api/YCustomerService/Categories');
    if (response.ok) {
      categoryList.value = await response.json();
    }
  } catch (error) {
    console.error("無法載入分類資料", error);
  }
});

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
  const fileInput = document.getElementById('fileUpload');
  if (fileInput) fileInput.value = '';
};

const handleSubmit = async () => {
  if (captcha.userAnswer !== (captcha.num1 + captcha.num2)) {
    alert('驗證碼計算錯誤，請重新確認！');
    return;
  }

  isSubmitting.value = true;

  // 使用 FormData 封裝資料以支援檔案上傳
  const formData = new FormData();
  formData.append('Name', form.name);
  formData.append('Phone', form.phone);
  formData.append('Email', form.email);
  formData.append('QuestionCategoryId', form.questionCategoryId);
  formData.append('Detail', form.detail);

  const fileInput = document.getElementById('fileUpload');
  if (fileInput && fileInput.files[0]) {
    formData.append('ImageFile', fileInput.files[0]);
  }

  try {
    const response = await fetch('http://localhost:7218/api/YCustomerService', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('感謝您的回報！我們已收到您的資訊，將盡快指派專人與您聯絡。');
      // 重設表單
      Object.assign(form, { name: '', phone: '', email: '', questionCategoryId: '', detail: '', agree: false });
      removeImage();
      captcha.num1 = Math.floor(Math.random() * 10);
      captcha.num2 = Math.floor(Math.random() * 10);
      captcha.userAnswer = null;
    } else {
      const errorText = await response.text();
      alert('送出失敗：' + errorText);
    }
  } catch (error) {
    alert('網路通訊錯誤，請稍後再試。');
  } finally {
    isSubmitting.value = false;
  }
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
</style>