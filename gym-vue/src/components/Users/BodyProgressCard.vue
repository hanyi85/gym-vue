<template>
  <div class="dashboard-card">
    <h5 class="title">體重紀錄</h5>
    <p class="value">68.4 kg</p>
    <span class="hint">最近更新：今天</span>
  </div>
</template>

<style scoped>
.dashboard-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

.title {
  font-weight: 600;
  margin-bottom: 12px;
}

.value {
  font-size: 28px;
  font-weight: bold;
  color: #f38d00;
}

.hint {
  font-size: 13px;
  color: #888;
}
</style>
