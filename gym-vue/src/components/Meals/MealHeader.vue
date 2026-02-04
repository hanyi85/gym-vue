<script setup>
defineProps({
  title: String,
  desc: String
})
</script>

<template>
  <div class="mb-4">
    <h3 class="fw-bold">{{ title }}</h3>
    <h6 class="text-muted">{{ desc }}</h6>
  </div>
</template>
