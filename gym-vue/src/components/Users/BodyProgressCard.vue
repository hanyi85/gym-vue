<template>
  <div class="row g-4 weight-card">
    <!-- 左側：體重趨勢 -->
    <div class="col-lg-8">
      <div class="card metric-card h-100 border-0 shadow-sm">
        <div class="card-body p-4">
          <!-- 標題列 -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold text-dark-blue mb-0">體重變化趨勢</h6>

            <RouterLink
              to="/users/weight"
              class="btn btn-go-weight"
              title="前往體重專區"
            >
              +
            </RouterLink>
          </div>

          <!-- 篩選 -->
          <div class="chart-filter-group p-1 mb-3">
            <button class="btn btn-filter active">30天</button>
            <button class="btn btn-filter">3個月</button>
            <button class="btn btn-filter">1年</button>
          </div>

          <!-- 圖表 -->
          <div class="chart-area-mockup">
            <div class="mockup-line"></div>
          </div>

          <!-- 底部日期 -->
          <div class="d-flex justify-content-between mt-3 text-muted-custom small px-2">
            <span>10月01日</span>
            <span>10月08日</span>
            <span>10月15日</span>
            <span>10月22日</span>
            <span>今日</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右側：數據卡 -->
    <div class="col-lg-4 d-flex flex-column gap-3">
      <!-- 目前體重 -->
      <div class="stat-card p-4 border-0 shadow-sm">
        <div class="d-flex justify-content-between align-items-start">
          <small class="text-label fw-bold">目前體重</small>
          <span class="badge badge-trend-up">每週 -0.4kg</span>
        </div>
        <h2 class="fw-bold mt-2 mb-0">
          75.4 <span class="unit-text">kg</span>
        </h2>
      </div>

      <!-- 累積減重 -->
      <div class="stat-card p-4 border-0 shadow-sm">
        <div class="d-flex justify-content-between align-items-start">
          <small class="text-label fw-bold">累積減重</small>
          <i class="fa fa-line-chart text-orange fs-5"></i>
        </div>
        <h2 class="fw-bold mt-2 mb-0 text-orange">
          4.2 <span class="unit-text text-orange">kg</span>
        </h2>
      </div>

      <!-- 目標體重 -->
      <div class="stat-card p-4 border-0 shadow-sm">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <small class="text-label fw-bold">目標體重</small>
          <span class="fw-bold text-dark-blue">70.0 kg</span>
        </div>

        <div class="d-flex justify-content-between mb-2">
          <small class="text-orange fw-bold">已達成 65%</small>
          <small class="text-muted-custom">尚差 5.4 kg</small>
        </div>

        <div class="progress custom-progress-bar">
          <div class="progress-bar bg-orange" style="width: 65%"></div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
const bars = [80, 78, 75, 73, 70, 68]
</script>

<style scoped>

.btn-go-weight {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #fffbeb;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-decoration: none;
  line-height: 1;
  transition: all 0.2s ease;
}

.btn-go-weight:hover {
  background-color: #f59e0b;
  color: #ffffff;
}

.weight-card {
  margin-bottom: 2rem;
}

.metric-card,
.stat-card {
  background: #ffffff;
  border-radius: 16px;
}

/* 色彩系統 */
.text-dark-blue {
  color: #1e293b;
}

.text-orange {
  color: #f59e0b;
}

.bg-orange {
  background-color: #f59e0b;
}

.text-muted-custom {
  color: #64748b;
}

.text-label {
  color: #94a3b8;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.unit-text {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: normal;
  margin-left: 2px;
}

/* 篩選按鈕 */
.chart-filter-group {
  background-color: #f1f5f9;
  border-radius: 10px;
}

.btn-filter {
  border: none;
  background: transparent;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #64748b;
}

.btn-filter.active {
  background-color: white;
  color: #f59e0b;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* 圖表假樣式 */
.chart-area-mockup {
  height: 200px;
  width: 100%;
  background: linear-gradient(180deg,
      rgba(245, 158, 11, 0.08) 0%,
      rgba(255, 255, 255, 0) 100%);
  position: relative;
  border-bottom: 2px solid #f1f5f9;
}

.mockup-line {
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 3px;
  background-color: #f59e0b;
  clip-path: polygon(0 50%,
      20% 40%,
      40% 60%,
      60% 30%,
      80% 45%,
      100% 20%);
}

/* Badge */
.badge-trend-up {
  background-color: #f0fdf4;
  color: #166534;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 6px;
}

/* Progress */
.custom-progress-bar {
  height: 8px;
  background-color: #f1f5f9;
  border-radius: 10px;
}
</style>
