<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="layout">
    <Header />
    <main class="content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>


<style>
/*  全域 / 版型 / layout 專用 */
html {
  --vueuse-safe-area-top: 0px;
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding-top: 0;
  overflow: auto;
}

.content > :first-child {
  margin-top: 0;
}

</style>
