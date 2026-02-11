<template>
  <aside class="sidebar">
    <div class="logo">
      <h3>GYM<span>+</span></h3>
    </div>

    <nav class="menu">
      <RouterLink
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
const menu = [
  { label: '會員首頁', path: '/users/home', icon: 'fa fa-home' },
  { label: '體重紀錄', path: '/users/weight', icon: 'fa fa-line-chart' },
  { label: '飲食紀錄', path: '/users/food', icon: 'fa fa-cutlery' },
  { label: '我的課程', path: '/users/courses', icon: 'fa fa-calendar' },
  { label: '個人資料', path: '/users/profile', icon: 'fa fa-user' },
]
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #111;
  color: #fff;
  padding: 24px 16px;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 32px;
}

.logo span {
  color: #f38d00;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  color: #ccc;
  text-decoration: none;
  transition: 0.2s;
}

.menu-item:hover {
  background: #222;
  color: #fff;
}

.menu-item.active {
  background: #f38d00;
  color: #fff;
}
</style>
