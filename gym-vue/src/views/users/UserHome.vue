<template>
  <div class="flex min-h-screen bg-background-light dark:bg-background-dark text-[#181510] dark:text-white">
    <!-- Sidebar -->
    <aside class="w-72 bg-white dark:bg-[#1a140b] border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-10">
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span class="material-symbols-outlined">會員專區</span>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-primary">練吧 Fitness Bar</h2>
      </div>

      <nav class="flex-1 px-4 py-4 flex flex-col gap-2">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white">
          <span class="material-symbols-outlined">dashboard</span>
          <p class="text-sm font-medium">會員首頁</p>
        </div>

        <NavItem icon="exercise" label="我的課程" />
        <NavItem icon="receipt_long" label="購買紀錄" />
        <NavItem icon="person" label="個人資料" />
      </nav>

      <div class="p-4 mt-auto">
        <div class="bg-primary/10 p-4 rounded-xl">
          <p class="text-xs font-semibold text-primary uppercase mb-1">Help Center</p>
          <p class="text-sm text-[#8d795e] mb-3">需要協助你的訓練計畫嗎？</p>
          <button class="w-full py-2 bg-primary text-white rounded-lg text-sm font-bold">
            聯絡客服
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 ml-72 p-8 max-w-[1400px] mx-auto w-full">
      <!-- Header -->
      <header class="bg-white dark:bg-[#2c2316] p-6 rounded-xl shadow-sm border mb-8 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <img
            class="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            :src="user.avatar"
          />
          <div>
            <h1 class="text-2xl font-bold">{{ user.name }}</h1>
            <div class="flex gap-2 mt-1">
              <span class="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                {{ user.level }}
              </span>
              <span class="text-sm text-[#8d795e]">
                加入於 {{ user.joinDate }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button class="px-4 py-2 border rounded-xl text-sm font-semibold">
            編輯資料
          </button>
          <button class="px-4 py-2 bg-primary text-white rounded-xl font-bold">
            預約課程
          </button>
        </div>
      </header>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="local_fire_department"
          title="本月消耗熱量"
          value="2,450 kcal"
          color="text-primary"
        />
        <StatCard
          icon="calendar_today"
          title="本月上課次數"
          value="8 次"
          color="text-blue-500"
        />
        <StatCard
          icon="monitoring"
          title="目前體重"
          value="72.5 kg"
          color="text-green-500"
        />
      </div>

      <!-- Placeholder -->
      <section class="bg-white dark:bg-[#2c2316] p-8 rounded-xl border text-center text-gray-400">
        這裡之後可以放：飲食紀錄 / 體重圖表 / 課程列表（已保留結構）
      </section>
    </main>
  </div>
</template>

<script setup>
const user = {
  name: '王小明',
  level: 'Gold Member',
  joinDate: '2023 / 01',
  avatar: 'https://i.pravatar.cc/150?img=12',
}
</script>

<!-- Sidebar Item -->
<script>
export default {
  components: {
    NavItem: {
      props: ['icon', 'label'],
      template: `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-gray-600 dark:text-gray-400">
          <span class="material-symbols-outlined">{{ icon }}</span>
          <p class="text-sm font-medium">{{ label }}</p>
        </div>
      `,
    },
    StatCard: {
      props: ['icon', 'title', 'value', 'color'],
      template: `
        <div class="bg-white dark:bg-[#2c2316] p-6 rounded-xl border shadow-sm flex items-center gap-4">
          <span class="material-symbols-outlined text-3xl" :class="color">{{ icon }}</span>
          <div>
            <p class="text-sm text-[#8d795e]">{{ title }}</p>
            <p class="text-xl font-bold">{{ value }}</p>
          </div>
        </div>
      `,
    },
  },
}
</script>
