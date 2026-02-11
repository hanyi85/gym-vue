<template>
  <div class="health-page">
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

    <main class="content">
      <div class="card">
        <!-- 標題 -->
        <h4 class="form-title">建立你的基礎數據</h4>
        <p class="page-desc">
          輸入身高與體重，系統將自動計算 BMI，並幫助你安全追蹤進度。
        </p>

        <!-- 身高 / 體重 -->
        <div class="card-grid">
          <div class="data-card">
            <div class="card-label">身高 (cm)</div>
            <div class="value-row">
              <button @click="changeHeight(-1)">−</button>
              <span>{{ height }}</span>
              <button @click="changeHeight(1)">＋</button>

            </div>
            <input type="range" min="140" max="200" v-model="height" />
          </div>

          <div class="data-card">
            <div class="card-label">體重 (kg)</div>
            <div class="value-row">
              <button @click="changeWeight(-0.5)">−</button>
              <span>{{ weight.toFixed(1) }}</span>
              <button @click="changeWeight(0.5)">＋</button>

            </div>
            <input type="range" min="40" max="150" step="0.5" v-model="weight" />
          </div>
        </div>

        <!-- BMI 提示 -->
        <div class="bmi-card">
          <div class="bmi-left">
            <span class="bmi-label">BMI</span>
            <div class="bmi-value">{{ bmi }}</div>
          </div>

          <div class="bmi-right">
            <strong>{{ bmiStatus.label }}</strong>
            <p>{{ bmiStatus.desc }}</p>
          </div>
        </div>

        <!-- 目標體重 -->
        <h3 class="target-title">設定你的目標體重</h3>

        <div class="target-card">
          <div class="target-value-row">
            <button @click="changeTargetWeight(-0.5)">−</button>

            <div class="target-value">
              {{ targetWeightDisplay }} <span>kg</span>
            </div>

            <button @click="changeTargetWeight(0.5)">＋</button>
          </div>

          <input type="range" min="40" max="120" step="0.5" v-model="targetWeight" />

          <div class="target-hint">
            <span>快速減脂</span>
            <span>維持</span>
            <span>增肌</span>
          </div>
        </div>



        <!-- CTA -->
        <div class="footer-action">
          <router-link to="/users/profile-finished" class="btn-primary">
            儲存並繼續 →
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>




<script setup>
import { ref, computed } from 'vue'
const currentStep = ref(2) // 0-based：1 = 驗證電子信箱

const steps = [
  { title: '基本資料', desc: '填寫個人資訊' },
  { title: '驗證電子信箱', desc: '' },
  { title: '健康數據', desc: '身體狀態' },
  { title: '完成', desc: '確認送出' }
]

const height = ref(170)
const weight = ref(70)
const targetWeight = ref(65)
const targetWeightDisplay = computed(() => {
  return Number(targetWeight.value).toFixed(1)
})

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const changeHeight = (delta) => {
  height.value = clamp(height.value + delta, 140, 200)
}

const changeWeight = (delta) => {
  weight.value = clamp(weight.value + delta, 40, 150)
}

const changeTargetWeight = (delta) => {
  targetWeight.value = clamp(targetWeight.value + delta, 40, 120)
}

const bmi = computed(() => {
  return (weight.value / ((height.value / 100) ** 2)).toFixed(1)
})
const bmiDisplay = computed(() => bmi.value.toFixed(1))

const bmiStatus = computed(() => {
  const value = bmi.value
  if (value < 18.5) {
    return {
      label: '過輕',
      desc: '你的體重低於健康範圍，可以考慮增加營養攝取。'
    }
  }
  if (value < 24) {
    return {
      label: '健康範圍',
      desc: '你的 BMI 在健康區間，保持目前的生活習慣吧！'
    }
  }
  return {
    label: '偏高',
    desc: '你的 BMI 略高，設定一個合理的目標體重會很有幫助。'
  }
})
</script>




<style scoped>
input[type="range"] {
  display: block;
  width: 80%;
  margin: 0 auto;
}

.form-title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #1f1f1f;
}

/* ===== 左側流程欄 ===== */
.sidebar {
  width: 260px;
  background: #121212;
  color: white;
  padding: 65px 28px;
}

.brand {
  color: #f38d00;
  margin-bottom: 40px;
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
  opacity: 0.35;
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
  top: 34px;
  width: 2px;
  height: 130px;
  background: rgba(255, 255, 255, 0.15);
}

.step:last-child::after {
  display: none;
}



.health-page {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 64px 72px;
  background: #f9fafb;
}

.content-inner {
  max-width: 920px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.page-desc {
  color: #6b7280;
  margin-bottom: 36px;
}

/* 身高 / 體重卡片 */
.card {
  background: white;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  border-radius: 22px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, .08);
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.data-card input[type="range"],
.target-card input[type="range"] {
  margin-top: 12px;
}

.data-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .06);
}

.card-label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 16px;
}

.value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
}

.value-row button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 20px;
  cursor: pointer;
}

/* BMI 卡 */
.bmi-card {
  margin-top: 28px;
  background: #ecfdf5;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.bmi-left {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  min-width: 80px;
}

.bmi-label {
  font-size: 12px;
  color: #6b7280;
}

.bmi-value {
  font-size: 24px;
  font-weight: 800;
  color: #16a34a;
}

.bmi-right p {
  font-size: 14px;
  color: #065f46;
}

/* 目標體重 */
.target-title {
  margin: 48px 0 16px;
  font-size: 20px;
  font-weight: 700;
}

.target-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .06);
}

.target-value {
  font-size: 40px;
  font-weight: 800;
  color: #f38d00;
  text-align: center;
  margin-bottom: 16px;
}

.target-value span {
  font-size: 18px;
  color: #9ca3af;
}

.target-hint {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}

.target-value-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.target-value-row button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.target-value-row button:hover {
  background: #f9fafb;
}

/* CTA */
.footer-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.btn-primary {
  background: #f38d00;
  color: #fff;
  border: none;
  padding: 14px 36px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}
</style>
