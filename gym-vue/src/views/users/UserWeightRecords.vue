<template>
  <Banner title="詳細體重紀錄" subtitle="管理您的身體數值與照片" />

  <div class="container py-5 metrics-page">
    <div class="card metric-card mb-5 border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-4">
          <div class="icon-box-orange me-3">
            <i :class="form.id ? 'fa fa-pencil-square-o' : 'fa fa-plus-circle'"></i>
          </div>
          <div>
            <h6 class="mb-1 fw-bold text-dark-blue">{{ form.id ? '編輯量測紀錄' : '新增量測紀錄' }}</h6>
            <small class="text-muted-custom">請輸入當日的各項數值</small>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">紀錄日期</label>
            <input type="date" v-model="form.date" class="form-control custom-input" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">體重 (kg)</label>
            <input type="number" step="0.1" v-model="form.weight" class="form-control custom-input" placeholder="例如: 75.4" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">體脂率 (%)</label>
            <input type="number" step="0.1" v-model="form.fat" class="form-control custom-input" placeholder="例如: 15.2" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">肌肉量 (kg)</label>
            <input type="number" step="0.1" v-model="form.muscle" class="form-control custom-input" placeholder="例如: 34.1" />
          </div>

          <div class="col-md-8">
            <label class="form-label fw-bold small text-dark-blue">體態照片 </label>
            <div class="input-group">
              <input type="file" accept="image/*" class="form-control custom-input" @change="onFileChange" />
            </div>
          </div>

          <div class="col-md-4 d-flex align-items-end gap-2">
            <button class="btn btn-save flex-grow-1" @click="saveRecord">
              <i class="fa fa-floppy-o me-2"></i>{{ form.id ? '更新紀錄' : '確認儲存' }}
            </button>
            <button v-if="form.id" class="btn btn-cancel" @click="resetForm">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card metric-card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="p-4 border-bottom border-light d-flex justify-content-between align-items-center">
          <h6 class="fw-bold text-dark-blue mb-0">歷史紀錄</h6>
          <span class="badge rounded-pill bg-light text-dark-blue px-3 border">共 {{ history.length }} 筆</span>
        </div>

        <div class="table-responsive">
          <table class="table mb-0 align-middle">
            <thead class="table-header-custom">
              <tr>
                <th class="ps-4">紀錄日期</th>
                <th>體重 (KG)</th>
                <th>體脂率 (%)</th>
                <th>肌肉量 (KG)</th>
                <th>體態照片</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item.id" class="table-row-hover">
                <td class="ps-4 text-dark-blue fw-medium">{{ item.date }}</td>
                <td class="fw-bold text-dark-blue">{{ item.weight }} <span class="unit-text">kg</span></td>
                <td class="text-muted-custom">{{ item.fat }} <span class="unit-text">%</span></td>
                <td class="text-muted-custom">{{ item.muscle }} <span class="unit-text">kg</span></td>
                <td>
                  <div v-if="item.photo" class="thumb-wrapper" @click="preview(item.photo)">
                    <img :src="item.photo" class="thumb-img" />
                    <div class="thumb-overlay"><i class="fa fa-search-plus"></i></div>
                  </div>
                  <span v-else class="text-light-grey small">—</span>
                </td>
                <td class="text-end pe-4">
                  <button class="btn btn-icon-action me-2" @click="edit(item)" title="編輯">
                    <i class="fa fa-pencil-square-o"></i>
                  </button>
                  <button class="btn btn-icon-action text-danger" @click="remove(item.id)" title="刪除">
                    <i class="fa fa-trash-o"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="history.length === 0">
                <td colspan="6" class="text-center py-5 text-muted-custom">目前尚無數據，請先新增量測紀錄。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="previewImg" class="img-preview-mask" @click="previewImg = null">
      <div class="preview-content" @click.stop>
        <img :src="previewImg" />
        <button class="close-btn" @click="previewImg = null"><i class="fa fa-times-circle"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Banner from '@/components/banner.vue'

// 定義歷史資料
const history = ref([
  { id: 1, date: '2023-10-24', weight: '75.4', fat: '15.2', muscle: '34.1', photo: null },
  { id: 2, date: '2023-10-21', weight: '75.8', fat: '15.4', muscle: '34.0', photo: null }
])

// 表單初始狀態
const initialForm = { id: null, date: '', weight: '', fat: '', muscle: '', photo: null }
const form = ref({ ...initialForm })
const previewImg = ref(null)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.photo = URL.createObjectURL(file)
}

const saveRecord = () => {
  if (!form.value.date || !form.value.weight) {
    alert('請填寫日期與體重')
    return
  }

  if (form.value.id) {
    const index = history.value.findIndex(i => i.id === form.value.id)
    if (index !== -1) history.value[index] = { ...form.value }
  } else {
    history.value.unshift({ ...form.value, id: Date.now() })
  }
  resetForm()
}

const edit = (item) => {
  form.value = { ...item }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const remove = (id) => {
  if (confirm('確定要刪除此筆紀錄嗎？')) {
    history.value = history.value.filter(i => i.id !== id)
  }
}

const resetForm = () => {
  form.value = { ...initialForm }
}

const preview = (src) => {
  previewImg.value = src
}
</script>

<style scoped>
/* 繼承 Dashboard 風格 */
.metrics-page { background-color: #f8fafc; min-height: 100vh; font-family: 'Noto Sans TC', sans-serif; }
.metric-card { border-radius: 16px; background: #ffffff; }

/* 顏色定義 */
.text-dark-blue { color: #1e293b; }
.text-orange { color: #f59e0b; }
.text-muted-custom { color: #64748b; }
.text-light-grey { color: #cbd5e1; }
.unit-text { font-size: 0.85rem; color: #94a3b8; font-weight: normal; margin-left: 2px; }

/* 圖示方塊 */
.icon-box-orange {
  width: 44px; height: 44px;
  background-color: #fffbeb; color: #f59e0b;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; font-size: 1.2rem;
}

/* 輸入框 */
.custom-input {
  border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px;
  background-color: #fcfcfc; transition: all 0.2s ease;
}
.custom-input:focus {
  border-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
  outline: none;
}

/* 按鈕 */
.btn-save {
  background-color: #f59e0b; color: white; border: none;
  border-radius: 12px; padding: 12px 24px; font-weight: 600;
  transition: all 0.2s;
}
.btn-save:hover { background-color: #d97706; transform: translateY(-1px); }

.btn-cancel {
  background-color: #f1f5f9; color: #64748b; border: none;
  border-radius: 12px; padding: 12px 20px; font-weight: 600;
}

/* 表格優化 */
.table-header-custom th {
  background-color: #f8fafc; color: #64748b; font-size: 0.75rem;
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
  padding: 16px 12px; border-bottom: 1px solid #f1f5f9;
}
.table-row-hover:hover { background-color: #fcfcfc; }

/* 縮圖設計 */
.thumb-wrapper {
  position: relative; width: 44px; height: 44px;
  border-radius: 8px; overflow: hidden; cursor: pointer;
  border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.3);
  color: white; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s;
}
.thumb-wrapper:hover .thumb-overlay { opacity: 1; }

/* 操作按鈕 */
.btn-icon-action {
  border: none; background: transparent; color: #94a3b8;
  font-size: 1.1rem; padding: 5px 8px; transition: color 0.2s;
}
.btn-icon-action:hover { color: #f59e0b; }

/* 燈箱燈效 */
.img-preview-mask {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000; backdrop-filter: blur(4px);
}
.preview-content { position: relative; max-width: 85%; max-height: 85%; }
.preview-content img { width: 100%; height: auto; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
.close-btn {
  position: absolute; top: -45px; right: -5px;
  background: transparent; border: none; color: white; font-size: 2.2rem;
}
</style>