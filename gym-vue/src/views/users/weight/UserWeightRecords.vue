<template>
  <Banner title="體重專區" subtitle="管理您的身體數值與進展" />
  <div class="container mt-4">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb custom-breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/users/home">會員首頁</router-link>
        </li>

        <li class="breadcrumb-item active" aria-current="page">
          體重專區
        </li>
      </ol>
    </nav>
  </div>
  <div class="container py-5 metrics-page">
    <!--  目標體重設定 -->
    <div class="card metric-card mb-5 border-0 shadow-sm">
      <div class="card-body p-4 d-flex justify-content-between align-items-center">

        <div>
          <h6 class="fw-bold text-dark-blue mb-2">目前目標體重</h6>
          <div class="display-6 text-orange fw-bold">
            {{ Number(targetWeight).toFixed(1) }} 
          </div>
        </div>

        <button class="btn btn-save" @click="openTargetModal">
          設定目標
        </button>

      </div>
    </div>

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
            <input type="number" step="0.1" v-model="form.weight" class="form-control custom-input"
              placeholder="例如: 75.4" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">體脂率 (%)</label>
            <input type="number" step="0.1" v-model="form.fat" class="form-control custom-input"
              placeholder="例如: 15.2" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">肌肉量 (kg)</label>
            <input type="number" step="0.1" v-model="form.muscle" class="form-control custom-input"
              placeholder="例如: 34.1" />
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
    <WeightDashboard :history="history"  :goalWeight="targetWeight" />
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
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item.id" class="table-row-hover">
                <td class="ps-4 text-dark-blue fw-medium">{{ item.date }}</td>
                <td class="fw-bold text-dark-blue">{{ item.weight }} <span class="unit-text">kg</span></td>
                <td class="text-muted-custom">{{ item.fat }} <span class="unit-text">%</span></td>
                <td class="text-muted-custom">{{ item.muscle }} <span class="unit-text">kg</span></td>

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
                <td colspan="5" class="text-center py-5 text-muted-custom">目前尚無數據，請先新增量測紀錄。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showTargetModal" class="modal-overlay">
    <div class="modal-box">

      <h5 class="fw-bold mb-4">設定目標體重</h5>

      <div class="target-value-row">
        <button class="btn-circle" @click="changeTempWeight(-0.5)">−</button>

        <div class="target-value">
          {{ tempTargetWeight.toFixed(1) }}
          <span class="unit-text">kg</span>
        </div>

        <button class="btn-circle" @click="changeTempWeight(0.5)">＋</button>
      </div>

      <input type="range" min="40" max="120" step="0.5" v-model.number="tempTargetWeight" class="custom-range" />

      <div class="text-end mt-4">
        <button class="btn btn-cancel me-2" @click="showTargetModal = false">
          取消
        </button>
        <button class="btn btn-save" @click="confirmTargetWeight">
          確認儲存
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Banner from '@/components/banner.vue'
import api from '@/services/api'
import WeightDashboard from '@/components/Users/WeightDashboard.vue'
const showTargetModal = ref(false)
const tempTargetWeight = ref(60)
const targetWeight = ref(60)



const fetchProfile = async () => {
  try {
    const res = await api.get('/healthprofile/profile')

    targetWeight.value = Number(res.data.TargetWeight ?? 60)

  } catch (err) {
    console.error(err)
  }
}
onMounted(() => {
  fetchProfile()
  fetchRecords()
})
//記錄歷史資料
const history = ref([])
const fetchRecords = async () => {
  try {
    const res = await api.get('/weightrecords')

    console.log(res.data)

    history.value = res.data.map(x => ({
      id: x.RecordId,
      date: x.RecordDate.split('T')[0],
      weight: x.Weight,
      fat: x.BodyFat,
      muscle: x.MuscleMass ?? ''
    }))
  } catch (err) {
    console.error(err)
    alert('載入資料失敗')
  }
}


const changeTempWeight = (step) => {
  const newValue = tempTargetWeight.value + step
  if (newValue >= 40 && newValue <= 120) {
    tempTargetWeight.value = Number(newValue.toFixed(1))
  }
}
// 表單初始狀態
const initialForm = { id: null, date: '', weight: '', fat: '', muscle: '' }
const form = ref({ ...initialForm })

const saveRecord = async () => {
  console.log('送出的日期:', form.value.date)
  if (!form.value.date || !form.value.weight) {
    alert('請填寫日期與體重')
    return
  }

  const payload = {
    recordDate: form.value.date,
    weight: Number(form.value.weight),
    bodyFat: form.value.fat ? Number(form.value.fat) : null,
    muscleMass: form.value.muscle ? Number(form.value.muscle) : null
  }

  try {
    if (form.value.id) {
      await api.put(`/weightrecords/${form.value.id}`, payload)
      alert('更新成功')
    } else {
      await api.post('/weightrecords', payload)
      alert('新增成功')
    }

    resetForm()
    fetchRecords()
  } catch (err) {
    console.error(err)
    alert('儲存失敗')
  }
}

const edit = (item) => {
  form.value = { ...item }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const remove = async (id) => {
  if (!confirm('確定要刪除此筆紀錄嗎？')) return

  try {
    await api.delete(`/weightrecords/${id}`)
    alert('刪除成功')
    fetchRecords()
  } catch (err) {
    console.error(err)
    alert('刪除失敗')
  }
}

const resetForm = () => {
  form.value = { ...initialForm }
}
const openTargetModal = () => {
  tempTargetWeight.value = targetWeight.value
  showTargetModal.value = true
}

const confirmTargetWeight = async () => {
  try {
    await api.put('/healthprofile/target-weight', {
      targetWeight: tempTargetWeight.value
    })

    // 直接更新畫面，不用再 call API
    targetWeight.value = tempTargetWeight.value

    showTargetModal.value = false

  } catch (err) {
    console.error(err)
    alert('儲存失敗')
  }
}
</script>

<style scoped>
/* 麵包屑樣式 */
.custom-breadcrumb {
  background: transparent;
  font-size: 0.9rem;
}

.custom-breadcrumb .breadcrumb-item a {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s;
}

.custom-breadcrumb .breadcrumb-item a:hover {
  color: #f59e0b;
}

.custom-breadcrumb .breadcrumb-item.active {
  color: #1e293b;
  font-weight: 600;
}

/* 繼承 Dashboard 風格 */
.metrics-page {
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Noto Sans TC', sans-serif;
}

.metric-card {
  border-radius: 16px;
  background: #ffffff;
}

/* 顏色定義 */
.text-dark-blue {
  color: #1e293b;
}

.text-orange {
  color: #f59e0b;
}

.text-muted-custom {
  color: #64748b;
}

.text-light-grey {
  color: #cbd5e1;
}

.unit-text {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: normal;
  margin-left: 2px;
}

/* 圖示方塊 */
.icon-box-orange {
  width: 44px;
  height: 44px;
  background-color: #fffbeb;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.2rem;
}

/* 輸入框 */
.custom-input {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background-color: #fcfcfc;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
  outline: none;
}

/* 按鈕 */
.btn-save {
  background-color: #f59e0b;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-save:hover {
  background-color: #d97706;
  transform: translateY(-1px);
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
}

/* 表格優化 */
.table-header-custom th {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.table-row-hover:hover {
  background-color: #fcfcfc;
}


/* 操作按鈕 */
.btn-icon-action {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 1.1rem;
  padding: 5px 8px;
  transition: color 0.2s;
}

.btn-icon-action:hover {
  color: #f59e0b;
}

.target-card {
  text-align: center;
}

.target-value-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 20px;
}

.target-value {
  font-size: 3rem;
  font-weight: 700;
  color: #f59e0b;
}

.btn-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.btn-circle:hover {
  background-color: #f8fafc;
  transform: scale(1.05);
}

.custom-range {
  width: 80%;
  margin: 20px auto;
  display: block;
}

.target-hint {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
  font-size: 0.9rem;
  color: #94a3b8;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: white;
  width: 420px;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>