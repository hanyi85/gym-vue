<template>
  <header class="member-header">
    <!-- 左側：頭像 + 資訊 -->
    <div class="left">
      <div class="avatar-wrapper">
        <img :src="user.avatar" class="avatar" />
        <span class="status-dot"></span>
      </div>

      <div class="info">
        <h2 class="name">{{ user.name }}</h2>
        <div class="meta">
          <span class="badge">黃金會員</span>
          <span class="joined">加入於 {{ user.joined }}</span>
        </div>
      </div>
    </div>

    <!-- 右側：操作 -->
    <div class="actions">
      <button class="btn outline">
        ✏️ 編輯資料
      </button>
    </div>
  </header>
</template>

<script setup>
const user = {
  name: '王小明',
  joined: '2023 年 1 月',
  avatar: 'https://i.pravatar.cc/100'
}
</script>

<style scoped>
.member-header {
  background: #fff;
  border-radius: 18px;
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

/* 左側 */
.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
}

/* 文字 */

.name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #777;
}

.badge {
  background: #fff7ed;
  color: #f38d00;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 12px;
}

/* 右側按鈕 */
.actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn.outline {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #333;
}

.btn.primary {
  background: #f38d00;
  color: #fff;
}
</style>
