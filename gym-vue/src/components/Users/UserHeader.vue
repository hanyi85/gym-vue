<template>
  <header class="member-header">
    <div>
      <h2>嗨，{{ user.name }} 👋</h2>
      <p class="sub">今天也一起加油訓練吧</p>
    </div>

    <div class="right">
      <img
        class="avatar"
        :src="user.avatar"
        alt="avatar"
      />
    </div>
  </header>
</template>

<script setup>
const user = {
  name: '王小明',
  avatar: 'https://i.pravatar.cc/80'
}
</script>

<style scoped>
.member-header {
  background: #fff;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0,0,0,.06);
}

.sub {
  color: #777;
  font-size: 14px;
  margin-top: 4px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
