<template>
    <div class="setup-page">

        <!-- 左側流程欄 -->
        <aside class="sidebar">
            <h2 class="brand">加入練吧</h2>

            <div class="steps">
                <div v-for="(step, i) in steps" :key="i" :class="['step', { active: currentStep === i }]">
                    <span class="dot">{{ i + 1 }}</span>
                    <div class="step-text">
                        <strong>{{ step.title }}</strong>
                        <p>{{ step.desc }}</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- 右側內容 -->
        <main class="content">
            <div class="card">

                <!-- 基本資料區塊 -->
                <div class="form-section">
                    <h4 class="form-title">會員基本資料</h4>


                    <!-- 頭像上傳 -->
                    <div class="avatar-section">
                        <div class="avatar-wrapper">
                            <img v-if="avatar" :src="avatar" class="avatar-img" />
                            <div v-else class="avatar-placeholder">+</div>

                            <label class="avatar-edit">
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                <input type="file" accept="image/*" hidden @change="onUpload" />
                            </label>
                        </div>

                        <h4 class="avatar-title">個人頭像</h4>
                        <p class="avatar-desc">
                            支援 JPG 或 PNG 格式，檔案大小上限為 800KB
                        </p>

                        <div class="avatar-actions">
                            <button class="btn-text" v-if="avatar" @click="removeAvatar">
                                移除頭像
                            </button>
                        </div>
                    </div>

                    <!-- 姓名 + 性別 -->
                    <div class="grid grid-basic">
                        <div class="field">
                            <label class="field-label">姓名</label>
                            <input placeholder="請輸入姓名" />
                        </div>

                        <div class="field">
                            <label class="field-label">性別</label>
                            <div class="gender compact">
                                <button v-for="g in ['男', '女', '其他']" :key="g" :class="{ active: gender === g }"
                                    @click="gender = g">
                                    {{ g }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 生日 -->
                    <div class="field">
                        <label class="field-label">生日</label>
                        <input type="date" />
                    </div>
                </div>

                <!-- 聯絡方式 -->
                <div class="form-section">

                    <div class="grid">
                        <div class="field">
                            <label class="field-label">手機號碼</label>
                            <input placeholder="09xxxxxxxx" />
                        </div>

                        <div class="field">
                            <label class="field-label">電子信箱</label>
                            <input placeholder="example@email.com" />
                        </div>
                    </div>
                </div>

                <!-- 聯絡地址 -->
                <div class="form-section">

                    <div class="grid">
                        <div class="field">
                            <label class="field-label">縣市</label>
                            <select v-model="city">
                                <option value="">選擇縣市</option>
                                <option>台北市</option>
                                <option>新北市</option>
                            </select>
                        </div>

                        <div class="field">
                            <label class="field-label">區域</label>
                            <select v-model="area">
                                <option value="">選擇區域</option>
                                <option>中山區</option>
                                <option>板橋區</option>
                            </select>
                        </div>
                    </div>

                    <div class="field">
                        <label class="field-label">路名與門牌號碼</label>
                        <input placeholder="例：中山路一段 100 號" />
                    </div>
                </div>

                <!-- 操作按鈕 -->
                <div class="actions">
                    <router-link to="/users/verify-email" class="next btn-next">
                        下一步
                    </router-link>
                </div>

            </div>
        </main>

    </div>
</template>


<script setup>
import { ref } from 'vue'

const currentStep = ref(0)
const gender = ref('男')

const city = ref('')
const area = ref('')

const steps = [
    { title: '基本資料', desc: '填寫個人資訊' },
    { title: '驗證電子信箱', desc: '' },
    { title: '健康數據', desc: '身體狀態' },
    // { title: '方案選擇', desc: '會員方案' },
    { title: '完成', desc: '確認送出' }
]

const avatar = ref(null)

const onUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    avatar.value = URL.createObjectURL(file)
}

const removeAvatar = () => {
    avatar.value = null
}

const triggerUpload = () => {
    document.querySelector('.avatar-edit input').click()
}
</script>

<style scoped>
.setup-page {
    display: flex;
    min-height: 100vh;
    background: #f6f4f1;
}

/* ===== 左側欄 ===== */
.sidebar {
    width: 260px;
    background: #121212;
    color: white;
    padding: 65px 28px;
}

.brand {
    color: #f38d00;
    margin-bottom: 40px;
    margin-top: 8px;
}

.steps {
    display: flex;
    flex-direction: column;
    gap: 100px;
}

.step {
    position: relative;
    display: flex;
    gap: 16px;
    opacity: .35;
}

.step.active {
    opacity: 1;
}

.dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #2a2a2a;
    color: #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    z-index: 1;
}

.step.active .dot {
    background: #f38d00;
    color: white;
}

/* 連接線 */
.step::after {
    content: '';
    position: absolute;
    left: 14px;
    /* 對齊圓點中心 */
    top: 34px;
    /* 圓點下方 */
    width: 2px;
    height: 130px;
    /* 連線長度 */
    background: rgba(255, 255, 255, .15);
}

/* 最後一個不要線 */
.step:last-child::after {
    display: none;
}

.avatar-section {
    text-align: center;
    margin-bottom: 48px;
}

.avatar-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    margin: 0 auto 16px;
}

.avatar-img,
.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: #aaa;
}

.avatar-edit {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 36px;
    height: 36px;
    background: #f38d00;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .2);
}

.avatar-title {
    font-size: 20px;
    margin-bottom: 6px;
}

.avatar-desc {
    font-size: 14px;
    color: #9a7b4f;
    margin-bottom: 16px;
}

.avatar-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
}

.btn-light {
    background: #f5efe6;
    border: none;
    padding: 10px 18px;
    border-radius: 20px;
    cursor: pointer;
}

.btn-text {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
}


/* ===== 右側內容 ===== */

.form-title {
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 32px;
    color: #1f1f1f;
}


.content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px;
}

.card {
    background: white;
    width: 100%;
    max-width: 880px;
    border-radius: 22px;
    padding: 48px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, .08);
}

/* .page-title {
    margin-bottom: auto;
} */

.form-section {
    margin-bottom: 28px;
}

.form-section-title {
    font-weight: 600;
    margin-bottom: 14px;
    color: #7a6a55;
}


h3 {
    margin-bottom: 16px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #8a7a65;
}



.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 14px;
}

.grid-basic {
    grid-template-columns: 1fr auto;
    align-items: center;
}

.gender.compact {
    display: flex;
    gap: 10px;
    padding: 6px;
    border: 1px solid #ddd;
    border-radius: 12px;
    width: fit-content;
}


input,
select {
    padding: 13px 14px;
    border-radius: 12px;
    border: 1px solid #ddd;
    font-size: 15px;
    transition: border-color .2s, box-shadow .2s;
}

input:focus,
select:focus {
    outline: none;
    border-color: #f38d00;
    box-shadow: 0 0 0 3px rgba(243, 141, 0, 0.15);
}


.gender {
    display: flex;
    gap: 12px;

}

.gender button {
    padding: 10px 22px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
}

.gender button.active {
    background: #f38d00;
    color: white;
    border: none;
}

.gender.inline {
    display: flex;
    gap: 10px;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 6px;
}


.actions {
    text-align: right;
}

.next {
    background: #f38d00;
    color: white;
    border: none;
    padding: 14px 36px;
    border-radius: 16px;
    font-size: 16px;
    cursor: pointer;
     text-decoration: none;
}
</style>
