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
  background: linear-gradient(135deg, #fff7ec);
}

.banner__content {
  max-width: 900px;
  margin: auto;
}

.banner__title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #f1861b;
}

.banner__subtitle {
  font-size: 16px;
  color: #a0783d;
}



</style>
