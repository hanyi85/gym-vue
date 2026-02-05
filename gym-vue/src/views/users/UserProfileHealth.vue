<template>

<div class="stepper">
  <!-- STEP 01 -->
  <div class="step done">
    <div class="step-circle">✓</div>
    <div class="step-label">建立帳號</div>
  </div>

  <div class="step-line"></div>

  <!-- STEP 02 -->
  <div class="step done">
    <div class="step-circle">✓</div>
    <div class="step-label">基本資料</div>
  </div>

  <div class="step-line"></div>

  <!-- STEP 03 -->
  <div class="step active">
    <div class="step-circle">3</div>
    <div class="step-label">完善健康資訊</div>
  </div>
</div>


<div class="health-card">
    <div class="step-header">
  <div class="step-badge">STEP 03</div>
  <div class="step-text">
    <h4>完善健康資訊</h4>
    <p>最後一步，讓我們更了解你的身體狀況</p>
  </div>
</div>

  <h3 class="section-title">會員健康資訊</h3>
  <p class="section-desc">填寫後可幫助系統分析你的健康狀況</p>

  <div class="row g-4">
    <div class="col-md-6">
      <label>身高（cm）</label>
      <input type="number" v-model="height" class="soft-input" />
    </div>

    <div class="col-md-6">
      <label>體重（kg）</label>
      <input type="number" v-model="weight" class="soft-input" />
    </div>
  </div>

  <div class="bmi-box mt-4">
    <div class="bmi-value">BMI {{ bmi }}</div>
    <div class="bmi-status">正常範圍</div>
  </div>

  <div class="mt-4">
    <label>身體活動程度</label>
    <select class="soft-input">
      <option>久坐</option>
      <option>輕度活動</option>
      <option>中度活動</option>
      <option>高度活動</option>
    </select>
  </div>

  <div class="action-center">
    <button class="btn-primary-indigo">儲存</button>
    <button class="btn-ghost">取消</button>
  </div>
</div>

</template>

<script setup>
import { computed, ref } from 'vue'

const height = ref('')
const weight = ref('')
const activity = ref('')

const bmi = computed(() => {
  if (!height.value || !weight.value) return ''
  return (weight.value / ((height.value / 100) ** 2)).toFixed(1)
})

const bmiStatus = computed(() => {
  if (!bmi.value) return ''
  if (bmi.value < 18.5) return '過輕'
  if (bmi.value < 24) return '正常'
  return '偏高'
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


.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.step-badge {
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  font-weight: 800;
  padding: 10px 16px;
  border-radius: 14px;
  font-size: 14px;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(63, 81, 181, 0.35);
}

.step-text h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.step-text p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #6b7280;
}


.health-card {
  max-width: 620px;
  margin: auto;
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,.08);
}

.section-title {
  font-weight: 800;
  color: #3f51b5;
}

.section-desc {
  color: #888;
  font-size: 14px;
}

.soft-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid #e0e0e0;
}

.bmi-box {
  background: #f5f7ff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
}

.bmi-value {
  font-size: 28px;
  font-weight: 800;
  color: #3f51b5;
}

.action-center {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.btn-primary-indigo {
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  border: none;
  padding: 14px 42px;
  border-radius: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  box-shadow: 0 10px 25px rgba(63, 81, 181, 0.35);
  transition: all 0.25s ease;
}

.btn-primary-indigo:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(63, 81, 181, 0.45);
}

.btn-primary-indigo:active {
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  color: #3f51b5;
  border: 1.5px solid #d6dbf5;
  padding: 14px 36px;
  border-radius: 16px;
  font-weight: 600;
  transition: 0.25s;
}

.btn-ghost:hover {
  background: #f5f7ff;
}

</style>