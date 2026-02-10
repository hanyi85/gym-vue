<template>
  <div class="weight-card">
    <!-- Header -->
    <div class="header">
      <div class="title-wrap">
        <i class="fa fa-line-chart icon"></i>
        <div>
          <h5>體重紀錄 <span class="en">Body Progress</span></h5>
          <p class="sub">WEIGHT & BODY FAT TRENDS</p>
        </div>
      </div>

      <div class="actions">
        <i class="fa fa-calendar action-icon"></i>
        <button class="add-btn">＋</button>
      </div>
    </div>

    <!-- Current weight -->
    <div class="current">
      <div>
        <p class="label">Current Weight</p>
        <p class="weight">72.5 <span>kg</span></p>
      </div>
      <div class="diff down">
        ↓ -1.2kg
        <small>VS LAST MONTH</small>
      </div>
    </div>

    <!-- Fake bar chart -->
    <div class="chart">
     <div class="d-flex align-items-end gap-2 mb-4" style="height:80px">
      <div
        v-for="n in 10"
        :key="n"
        class="bg-warning rounded"
        style="width: 12px; opacity: .3;"
        :style="{ height: `${30 + n * 4}px` }"
      />
    </div>
    </div>


    <!-- Bottom stats -->
    <div class="stats">
      <div class="stat">
        <p class="stat-title">BODY FAT</p>
        <p class="stat-value">18.2%</p>
        <div class="progress">
          <span class="green" style="width: 40%"></span>
        </div>
        <small class="green-text">-0.4%</small>
      </div>

      <div class="stat">
        <p class="stat-title">MUSCLE MASS</p>
        <p class="stat-value">56.4 <span>kg</span></p>
        <div class="progress">
          <span class="blue" style="width: 60%"></span>
        </div>
        <small class="blue-text">+0.2kg</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const bars = [80, 78, 75, 73, 70, 68]
</script>

<style scoped>
.weight-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

/* header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrap {
  display: flex;
  gap: 12px;
}

.icon {
  color: #f38d00;
  font-size: 20px;
}

.en {
  font-size: 13px;
  color: #999;
  margin-left: 6px;
}

.sub {
  font-size: 12px;
  color: #bbb;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  color: #999;
}

.add-btn {
  background: #f38d00;
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-size: 20px;
}

/* current */
.current {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 13px;
  color: #999;
}

.weight {
  font-size: 32px;
  font-weight: bold;
}

.weight span {
  font-size: 18px;
  color: #999;
}

.diff {
  text-align: right;
  font-size: 14px;
}

.diff.down {
  color: #2ecc71;
}

.diff small {
  display: block;
  font-size: 11px;
  color: #999;
}

/* chart */
.chart {
    overflow: hidden;
  margin-top: 20px;
  padding: 16px;
  background: #fff7ec;
  border-radius: 16px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}

.bar {
  flex: 1;
  background: #fde3c0;
  border-radius: 8px;
}

.bar.active {
  background: #f38d00;
}

/* stats */
.stats {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat {
  background: #fafafa;
  border-radius: 16px;
  padding: 14px;
}

.stat-title {
  font-size: 12px;
  color: #999;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  margin: 6px 0;
}

.progress {
  height: 6px;
  background: #eaeaea;
  border-radius: 6px;
  overflow: hidden;
}

.progress span {
  display: block;
  height: 100%;
}

.green {
  background: #2ecc71;
}

.blue {
  background: #3b82f6;
}

.green-text {
  color: #2ecc71;
  font-size: 12px;
}

.blue-text {
  color: #3b82f6;
  font-size: 12px;
}
</style>
