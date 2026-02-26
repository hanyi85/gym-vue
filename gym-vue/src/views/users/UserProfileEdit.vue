<template>
    <div class="setup-page">

        <!-- 右側內容 -->
        <main class="content">
            <div class="card">
                <!-- 基本資料區塊 -->
                <div class="form-section">
                    <h4 class="fw-bold form-title">修改基本資料</h4>


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
                            <input v-model="form.name" placeholder="請輸入姓名" />
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
                        <input type="date" v-model="form.birthday" />
                    </div>
                </div>

                <!-- 聯絡方式 -->
                <div class="form-section">

                    <div class="grid">
                        <div class="field">
                            <label class="field-label">手機號碼</label>
                            <input v-model="form.phone" placeholder="0912345678" />
                        </div>

                        <div class="field">
                            <label class="field-label email-group">電子信箱</label>
                            <input type="email" disabled v-model="form.email" />
                            <!-- 驗證完成 -->
                            <span class="email-verified">
                                <i class="fa fa-icon fa-check"></i> 驗證完成
                            </span>
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
                        <input placeholder="例：中山路一段 100 號" v-model="form.address" />
                    </div>
                </div>

                <!-- 修改密碼 -->
                <div class="form-section">
                    <h4 class="form-title">修改密碼</h4>

                    <div class="grid">
                        <div class="field">
                            <label class="field-label">目前密碼</label>
                            <input type="password" v-model="password.current" placeholder="請輸入目前密碼" />
                        </div>

                        <div class="field">
                            <label class="field-label">新密碼</label>
                            <input type="password" v-model="password.new" placeholder="請輸入新密碼" />
                        </div>
                    </div>

                    <div class="field">
                        <label class="field-label">確認新密碼</label>
                        <input type="password" v-model="password.confirm" placeholder="再次輸入新密碼" />
                    </div>

                    <!-- 密碼錯誤提示 -->
                    <p v-if="passwordError" class="error-text">
                        {{ passwordError }}
                    </p>
                </div>


                <!-- 操作按鈕 -->
                <div class="actions">


                    <button class="next btn-next" :disabled="saving" @click="saveProfile">
                        {{ saving ? "儲存中..." : "儲存並返回會員首頁⭢" }}
                    </button>
                </div>

            </div>
        </main>

    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/services/api"

const router = useRouter()

const form = ref({
    email: '',
    name: '',
    phone: '',
    birthday: '',
    address: ''
})

const gender = ref('')
const city = ref('')
const area = ref('')
const avatar = ref(null)

const password = ref({
    current: '',
    new: '',
    confirm: ''
})

const passwordError = ref('')

const onUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
        await api.post("/UUsers/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        avatar.value = URL.createObjectURL(file)

        alert("頭像上傳成功")

    } catch (err) {
        alert("上傳失敗")
    }
}

const removeAvatar = () => {
    avatar.value = null
}

onMounted(async () => {
    try {
        const res = await api.get("/UUsers/profile")

        console.log(res.data)
        form.value = {
            email: res.data.Email,
            name: res.data.Name,
            phone: res.data.Phone,
            birthday: res.data.BirthDate
                ? res.data.BirthDate.split("T")[0]
                : '',
            address: res.data.Address
        }

        gender.value = res.data.Sex
        if (res.data.Image) {
            avatar.value = `data:image/jpeg;base64,${res.data.Image}`
        }

    } catch (err) {
        console.error(err)
    }
})
const saving = ref(false)

const saveProfile = async () => {
    if (saving.value) return

    saving.value = true

    try {
        await api.put("/UUsers/profile", {
            name: form.value.name,
            phone: form.value.phone,
            sex: gender.value,
            birthDate: form.value.birthday,
            address: form.value.address
        })

        alert("更新成功")

        router.push("/users/home")

    } catch (err) {
        console.error(err)

        const message =
            err.response?.data?.message ||
            "更新失敗，請稍後再試"

        alert(message)

    } finally {
        saving.value = false
    }
}

//修改密碼
const changePassword = async () => {
    passwordError.value = ""

    if (!password.value.current ||
        !password.value.new ||
        !password.value.confirm) {
        passwordError.value = "請填寫所有密碼欄位"
        return
    }

    if (password.value.new !== password.value.confirm) {
        passwordError.value = "新密碼與確認密碼不一致"
        return
    }

    try {
        await api.put("/UUsers/change-password", {
            oldPassword: password.value.current,
            newPassword: password.value.new
        })

        alert("密碼修改成功")

        password.value = {
            current: '',
            new: '',
            confirm: ''
        }

    } catch (err) {
        passwordError.value =
            err.response?.data || "修改失敗"
    }
}
</script>

<style scoped>
.setup-page {
    display: flex;
    min-height: 100vh;
    background: #f6f4f1;
}

/* ===== 左側欄 ===== */

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
    /* font-size: 22px;
    font-weight: 600; */
    margin-bottom: 32px;
    color: #f38d00;
    ;
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

/* Email 驗證完成 */
.email-group {
    position: relative;
}

.email-verified {

    right: 12px;
    bottom: -20px;
    font-size: 13px;
    color: #4caf50;
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

.error-text {
    margin-top: 10px;
    font-size: 14px;
    color: #e74c3c;
}
</style>
