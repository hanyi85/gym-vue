<script setup>
defineProps({ current: String })
const emit = defineEmits(['change'])
</script>

<template>
  <aside class="sidebar">
    <ul class="nav flex-column">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: current === 'high' }"
          @click="emit('change', 'high')"
        >
          🏋️ 高蛋白增肌餐
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: current === 'low' }"
          @click="emit('change', 'low')"
        >
          🥗 低脂減脂餐
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: current === 'balanced' }"
          @click="emit('change', 'balanced')"
        >
          🍽️ 均衡健康餐
        </a>
      </li>
    </ul>
  </aside>
</template>
