<template>
<Banner
  title="會員專區"
  subtitle="減輕您多餘的體重，降低身體負擔，打造完美動人曲線"
/>
<div class="stepper">
  <!-- STEP 01 -->
  <div class="step done">
    <div class="step-circle">✓</div>
    <div class="step-label">建立帳號</div>
  </div>

  <div class="step-line"></div>

  <!-- STEP 02 -->
  <div class="step active">
    <div class="step-circle">2</div>
    <div class="step-label">個人資訊</div>
  </div>
</div>


    <div class="profile-page d-flex align-items-center justify-content-center">
        <div class="main-card shadow-lg">

            <div class="top-accent"></div>


            <div class="content-padding">
                <div class="text-center mb-5">
                    <h2 class="fw-bold indigo-text mb-2">會員中心</h2>
                    <span class="badge-step">STEP 02 完善基本資料</span>
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="row g-5">
                        <div class="col-lg-4 text-center">
                            <div class="avatar-section">
                                <div class="avatar-container" @click="triggerUpload">
                                    <img :src="defaultAvatar" alt="預設頭像" />
                                    <div class="upload-hint">
                                        <i class="fa fa-camera"></i>
                                    </div>
                                </div>
                                <input type="file" ref="fileInput" class="d-none" @change="onFileChange">
                                <h6 class="mt-3 fw-bold text-secondary">設定大頭貼</h6>
                            </div>

                            <div class="gender-selector mt-5">
                                <p class="small-title">性別</p>
                                <div class="gender-options">
                                    <input type="radio" id="male" value="male" v-model="form.gender" class="d-none">
                                    <label for="male" class="gender-btn">男</label>

                                    <input type="radio" id="female" value="female" v-model="form.gender" class="d-none">
                                    <label for="female" class="gender-btn">女</label>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-8">
                            <div class="info-grid">
                                <div class="input-wrapper mb-4">
                                    <input type="email" v-model="form.email" class="minimal-input" placeholder=" "
                                        required>
                                    <label class="floating-label">電子郵件地址</label>

                                </div>

                                <div class="input-wrapper mb-4">
                                    <input type="text" v-model="form.address" class="minimal-input" placeholder=" "
                                        required>
                                    <label class="floating-label">聯絡地址</label>
                                </div>

                                <div class="input-wrapper mb-4">
                                    <input type="tel" v-model="form.phone" class="minimal-input" placeholder=" "
                                        required inputmode="numeric" pattern="09\d{8}">

                                    <label class="floating-label">行動電話</label>
                                </div>

                                <div class="input-wrapper">
                                    <input type="date" v-model="form.birthday" class="minimal-input"
                                        :max="new Date().toISOString().split('T')[0]">

                                    <label class="floating-label">出生日期</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="action-footer mt-5 pt-4 border-top">
                        <button type="submit" class="btn-primary-indigo">儲存並送出</button>
                        <button type="button" class="btn-ghost" @click="handleCancel">稍後填寫</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/預設頭像.png'
import Banner from '@/components/banner.vue'
const router = useRouter()
const user = ref({
  email: '' // 一開始沒有 email
})
const fileInput = ref(null)
const avatarPreview = ref(null)
let avatarObjectUrl = null

const form = reactive({
    gender: '',
    email: '', // 之後可改成從 API 帶入
    address: '',
    phone: '',
    birthday: ''
})

/* 點擊頭像上傳 */
const triggerUpload = () => {
    fileInput.value?.click()
}

/* 預覽圖片 + 釋放舊 URL */
const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        alert('請上傳圖片檔案')
        return
    }

    if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl)
    }

    avatarObjectUrl = URL.createObjectURL(file)
    avatarPreview.value = avatarObjectUrl
}

/* 表單送出 */
const handleSubmit = () => {
    if (!form.gender) {
        alert('請選擇性別')
        return
    }

    if (!form.address.trim()) {
        alert('請填寫聯絡地址')
        return
    }

    if (!/^09\d{8}$/.test(form.phone)) {
        alert('請輸入正確的手機號碼')
        return
    }

    // 👉 這裡之後可以接 API
    console.log('送出的資料', {
        ...form,
        avatar: avatarPreview.value
    })

    alert('資料已儲存完成 🎉')
    router.push('/users/verifyEmail') // 回會員首頁
}

/* 稍後填寫 */
const handleCancel = () => {
    if (confirm('確定稍後再填寫嗎？')) {
        router.push('/users/profile')
    }
}

/* 離開頁面釋放圖片 URL */
onBeforeUnmount(() => {
    if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl)
    }
})
</script>


<style scoped>

.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 90px;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  background: #e5e7eb;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  white-space: nowrap;
}

/* 中間連線 */
.step-line {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 6px;
}

/* 已完成 */
.step.done .step-circle {
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  box-shadow: 0 6px 16px rgba(63, 81, 181, 0.35);
}

.step.done .step-label {
  color: #3f51b5;
  font-weight: 600;
}

/* 目前進行中（發光） */
.step.active .step-circle {
  background: #ffffff;
  color: #3f51b5;
  border: 2px solid #3f51b5;
  box-shadow:
    0 0 0 6px rgba(63, 81, 181, 0.12),
    0 10px 30px rgba(63, 81, 181, 0.35);
}

.step.active .step-label {
  color: #1f2937;
  font-weight: 700;
}


/* 背景營造質感 */
.profile-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 40px 20px;
}

/* 漂浮卡片設計 */
.main-card {
    width: 100%;
    max-width: 850px;
    background: #ffffff;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease;
}

.top-accent {
    height: 6px;
    background: linear-gradient(90deg, #3f51b5, #7986cb);
}

.content-padding {
    padding: 50px;
}

.indigo-text {
    color: #3f51b5;
    letter-spacing: 1px;
}

.badge-step {
    background: #e8eaf6;
    color: #3f51b5;
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 700;
}

/* 頭像上傳美化 */
.avatar-container {
    width: 140px;
    height: 140px;
    margin: 0 auto;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    /* 趣味不規則圓 */
    overflow: hidden;
    background: #f1f3f9;
    border: 4px solid #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    position: relative;
}

.avatar-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-hint {
    position: absolute;
    inset: 0;
    background: rgba(63, 81, 181, 0.4);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: 0.3s;
}

.avatar-container:hover .upload-hint {
    opacity: 1;
}

/* 性別按鈕美化 */
.gender-options {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.gender-btn {
    padding: 8px 25px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.3s;
    color: #888;
}

input:checked+.gender-btn {
    background: #3f51b5;
    color: #fff;
    border-color: #3f51b5;
    box-shadow: 0 4px 10px rgba(63, 81, 181, 0.2);
}

/* 底線輸入框 */
.minimal-input {
    width: 100%;
    border: none;
    border-bottom: 1.5px solid #eee;
    padding: 12px 0;
    font-size: 15px;
    background: transparent;
    transition: 0.3s;
}

.input-wrapper {
    position: relative;
}


.minimal-input:focus {
    border-bottom-color: #3f51b5;
}

.minimal-input.readonly {
    color: #999;
    cursor: not-allowed;
}


.floating-label {
    position: absolute;
    top: 12px;
    left: 0;
    color: #bbb;
    transition: 0.3s;
    pointer-events: none;
}

.minimal-input:focus~.floating-label,
.minimal-input:not(:placeholder-shown)~.floating-label {
    top: -15px;
    font-size: 11px;
    color: #3f51b5;
    font-weight: 700;
}

/* 按鈕系統 */
.btn-primary-indigo {
    background: #3f51b5;
    color: #fff;
    border: none;
    padding: 14px 40px;
    border-radius: 14px;
    font-weight: 600;
    transition: 0.3s;
}

.btn-primary-indigo:hover {
    background: #303f9f;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.3);
}

.btn-ghost {
    background: transparent;
    color: #aaa;
    border: none;
    padding: 14px 30px;
}

.action-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

</style>