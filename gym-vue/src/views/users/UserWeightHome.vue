<template>
  <Banner title="體重專區"></Banner>
  <div class="container py-5 metrics-page">
    <div class="card metric-card mb-4 border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex align-items-center mb-4">
          <div class="icon-box-orange me-3">
            <i class="fa fa-pencil-square-o"></i>
          </div>
          <div>
            <h6 class="mb-1 fw-bold text-dark-blue">快速紀錄</h6>
            <small class="text-muted-custom">輸入今日量測數據以更新您的圖表</small>
          </div>
        </div>

        <div class="row g-4 align-items-end">
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">體重 (kg)</label>
            <input type="number" step="0.1" class="form-control custom-input" placeholder="例如：75.4" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">體脂率 (%)</label>
            <input type="number" step="0.1" class="form-control custom-input" placeholder="例如：15.2" />
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold small text-dark-blue">肌肉量 (kg)</label>
            <input type="number" step="0.1" class="form-control custom-input" placeholder="例如：34.1" />
          </div>
          <div class="col-md-3">
            <button class="btn btn-save w-100 shadow-sm">
              <i class="fa fa-floppy-o me-2"></i>儲存紀錄
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-5">
      <div class="col-lg-8">
        <div class="card metric-card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h6 class="fw-bold text-dark-blue mb-0">體重變化趨勢</h6>
              <div class="chart-filter-group p-1">
                <button class="btn btn-filter active">30天</button>
                <button class="btn btn-filter">3個月</button>
                <button class="btn btn-filter">1年</button>
              </div>
            </div>
            <div class="chart-area-mockup">
              <div class="mockup-line"></div>
            </div>
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

      <div class="col-lg-4 d-flex flex-column gap-3">
        <div class="stat-card p-4 border-0 shadow-sm">
          <div class="d-flex justify-content-between align-items-start">
            <small class="text-label fw-bold">目前體重</small>
            <span class="badge badge-trend-up">每週 -0.4kg</span>
          </div>
          <h2 class="fw-bold mt-2 mb-0">75.4 <span class="unit-text">kg</span></h2>
        </div>

        <div class="stat-card p-4 border-0 shadow-sm">
          <div class="d-flex justify-content-between align-items-start">
            <small class="text-label fw-bold">累積減重</small>
            <i class="fa fa-line-chart text-orange fs-5"></i>
          </div>
          <h2 class="fw-bold mt-2 mb-0 text-orange">4.2 <span class="unit-text text-orange">kg</span></h2>
        </div>

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

    <div class="card metric-card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="d-flex justify-content-between align-items-center p-4">
          <h6 class="fw-bold text-dark-blue mb-0">最近量測紀錄</h6>
<RouterLink
              to="/users/weight-records"
              class="text-orange-link fw-bold small text-decoration-none"
              title="查看完整歷史"
            >
              +
            </RouterLink>
        </div>

        <div class="table-responsive">
          <table class="table mb-0 align-middle">
            <thead class="table-header-custom">
              <tr>
                <th class="ps-4">日期</th>
                <th>體重 (KG)</th>
                <th>體脂率 (%)</th>
                <th>肌肉量 (KG)</th>
                <th class="text-end pe-4">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item.date" class="table-row-hover">
                <td class="py-3 ps-4 text-dark-blue">{{ item.date }}</td>
                <td class="py-3 fw-bold text-dark-blue">{{ item.weight }} kg</td>
                <td class="py-3 text-muted-custom">{{ item.fat }}</td>
                <td class="py-3 text-muted-custom">{{ item.muscle }} kg</td>
                <td class="py-3 text-end pe-4">
                  <button class="btn btn-icon-edit">
                    <i class="fa fa-ellipsis-h"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import banner from '@/components/banner.vue';
import Banner from '@/components/banner.vue';
const history = ref([
  { date: '2023年10月24日', weight: '75.4', fat: '15.2%', muscle: '34.1' },
  { date: '2023年10月21日', weight: '75.8', fat: '15.4%', muscle: '34.0' },
  { date: '2023年10月17日', weight: '76.2', fat: '15.7%', muscle: '33.8' },
  { date: '2023年10月14日', weight: '76.5', fat: '15.9%', muscle: '33.8' },
  { date: '2023年10月10日', weight: '77.0', fat: '16.2%', muscle: '33.6' }
])
</script>

<style scoped>
/* 樣式保持不變，與上個版本一致以維持圖片質感 */
.metrics-page {
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Noto Sans TC', sans-serif;
}

.metric-card, .stat-card {
  background: #ffffff;
  border-radius: 16px;
}

.text-dark-blue { color: #1e293b; }
.text-orange { color: #f59e0b; }
.bg-orange { background-color: #f59e0b; }
.text-muted-custom { color: #64748b; }
.text-label { color: #94a3b8; font-size: 0.75rem; letter-spacing: 1px; }
.unit-text { font-size: 0.9rem; color: #94a3b8; font-weight: normal; margin-left: 2px; }

.icon-box-orange {
  width: 40px;
  height: 40px;
  background-color: #fffbeb;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.2rem;
}

.custom-input {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background-color: #fcfcfc;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}
.custom-input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
  outline: none;
}

.btn-save {
  background-color: #f59e0b;
  color: white;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  border: none;
}

.chart-filter-group { background-color: #f1f5f9; border-radius: 10px; }
.btn-filter {
  border: none;
  background: transparent;
  padding: 5px 15px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #64748b;
}
.btn-filter.active {
  background-color: white;
  color: #f59e0b;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.badge-trend-up {
  background-color: #f0fdf4;
  color: #166534;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 6px;
}

.custom-progress-bar { height: 8px; background-color: #f1f5f9; border-radius: 10px; }

.chart-area-mockup {
  height: 200px;
  width: 100%;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
  position: relative;
  border-bottom: 2px solid #f1f5f9;
}
.mockup-line {
  position: absolute;
  bottom: 60px;
  width: 100%;
  height: 3px;
  background-color: #f59e0b;
  clip-path: polygon(0 50%, 20% 40%, 40% 60%, 60% 30%, 80% 45%, 100% 20%);
}

.table-header-custom th {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  border-bottom: 1px solid #f1f5f9;
  padding: 15px 12px;
}
.btn-icon-edit { border: none; background: transparent; color: #cbd5e1; }
.text-orange-link { color: #f59e0b; }
</style>