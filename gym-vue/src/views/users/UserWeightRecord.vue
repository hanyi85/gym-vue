<template>
  <div class="page-wrapper">
    <nav class="breadcrumb-wrapper" aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <RouterLink to="/users/profile-health">個人健康資訊</RouterLink>
    </li>
    <li class="breadcrumb-item active" aria-current="page">
      體重紀錄
    </li>
  </ol>
</nav>


    <!-- 折線圖 -->
    <div class="chart-card">
      <h4 class="section-title">📈 體重趨勢</h4>
      <p class="section-desc">追蹤最近的體重變化</p>
      <canvas ref="chartEl"></canvas>
    </div>

    <!-- 表單卡片 -->
    <div class="card wide">
      <h2 class="card-title">體重紀錄</h2>

      <div class="record-layout">
        <!-- 左：輸入 -->
        <div class="form-area">
          <div class="form-item">
            <label>紀錄日期</label>
            <input type="date" />
          </div>

          <div class="form-item">
            <label>體重（kg）</label>
            <input type="number" placeholder="例如：65.4" />
          </div>
        </div>

        <!-- 右：BMI 提示 -->
        <div class="info-box">
          <h4>目前 BMI</h4>
          <p class="bmi-value good">22.5</p>
          <p class="bmi-label">正常範圍</p>
          <p class="hint">
            維持在健康 BMI 區間，有助於降低慢性疾病風險。
          </p>
        </div>
      </div>

      <!-- 行動按鈕 -->
      <div class="actions">
        <button class="btn-primary-indigo">儲存紀錄</button>
        <button class="btn-outline">取消</button>
      </div>
    </div>

  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'

const chartEl = ref(null)

onMounted(() => {
  new Chart(chartEl.value, {
    type: 'line',
    data: {
      labels: ['01/01', '01/05', '01/10', '01/15', '01/20'],
      datasets: [
        {
          label: '體重 (kg)',
          data: [66, 65.8, 65.5, 65.4, 65.2],
          tension: 0.4,
          fill: true,
          borderColor: '#3f51b5',
          backgroundColor: 'rgba(63,81,181,0.15)',
          pointRadius: 5,
          pointBackgroundColor: '#3f51b5'
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            color: '#666'
          }
        },
        x: {
          ticks: {
            color: '#666'
          }
        }
      }
    }
  })
})
</script>

<style scoped>
.page-wrapper {
  background: linear-gradient(135deg, #f5f7fa, #e3e8f0);
  min-height: 100vh;
  padding: 50px 16px;
}

.breadcrumb-wrapper {
  margin-bottom: 24px;
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.breadcrumb-item a {
  color: #6b7280; /* 灰藍 */
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item a:hover {
  color: #4f46e5; /* 主色系藍紫 */
}

.breadcrumb-item.active {
  color: #111827; /* 深色，表示目前頁 */
  font-weight: 500;
}

.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  color: #9ca3af;
  padding: 0 8px;
}


/* 折線圖卡片 */
.chart-card {
  max-width: 720px;
  margin: 0 auto 40px;
  background: #fff;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.section-title {
  font-weight: 700;
  color: #3f51b5;
}

.section-desc {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

/* 表單卡 */
.card {
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  padding: 36px;
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.card-title {
  margin-bottom: 24px;
  font-weight: 700;
}

/* 表單區 */
.record-layout {
  display: flex;
  gap: 32px;
}

.form-area {
  flex: 1;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
  display: block;
}

.form-item input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

/* BMI 卡 */
.info-box {
  width: 220px;
  background: #f5f7ff;
  border-radius: 20px;
  padding: 20px;
}

.bmi-value {
  font-size: 36px;
  font-weight: 800;
  color: #3f51b5;
}

.bmi-label {
  font-size: 14px;
  color: #3f51b5;
  font-weight: 600;
}

.hint {
  font-size: 13px;
  color: #666;
  margin-top: 12px;
}

/* 按鈕 */
.actions {
  margin-top: 36px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-primary-indigo {
  background: linear-gradient(135deg, #3f51b5, #5c6bc0);
  color: #fff;
  border: none;
  padding: 14px 42px;
  border-radius: 16px;
  font-weight: 700;
  box-shadow: 0 10px 25px rgba(63, 81, 181, 0.35);
}

.btn-outline {
  background: transparent;
  border: 1.5px solid #d6dbf5;
  color: #3f51b5;
  padding: 14px 36px;
  border-radius: 16px;
}



</style>