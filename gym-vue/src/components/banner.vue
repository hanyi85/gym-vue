<template>
  <section class="banner">
    <div class="banner__content">
      <h1 class="banner__title">{{ title }}</h1>
      <p class="banner__subtitle">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>
.banner {
  padding: 48px 20px; /*  縮小高度 */
  text-align: center;
  background: linear-gradient(135deg, #e0ecff, #f8fbff);
}

.banner__content {
  max-width: 900px;
  margin: auto;
}

.banner__title {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 12px;
}

.banner__subtitle {
  font-size: 16px;
  color: #5f6f86;
}



</style>
