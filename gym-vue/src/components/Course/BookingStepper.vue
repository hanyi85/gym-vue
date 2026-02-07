<script setup>
defineProps({
  currentStep: Number,
})
</script>

<template>
  <div class="stepper">
    <div
      v-for="step in 4"
      :key="step"
      class="step"
      :class="{
        done: step < currentStep,
        active: step === currentStep
      }"
    >
      <div class="circle">
        <span v-if="step < currentStep">✓</span>
        <span v-else>{{ step }}</span>
      </div>

      <div class="label">
        <slot :name="`step-${step}`" />
      </div>

      <div v-if="step < 4" class="line"></div>
    </div>
  </div>
</template>


<style scoped>
.stepper {
  max-width: 720px;
  margin: 0 auto 72px;
  display: flex;
  justify-content: space-between;
}

/* 每個 step */
.step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 圓圈 */
.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* 已完成 / 目前 */
.step.done .circle,
.step.active .circle {
  background: #ff8a00;
  color: #fff;
}

.step.active .circle {
  transform: scale(1.15);
}

/* 文字 */
.label {
  margin-top: 6px;
  font-size: 13px;
  text-align: center;
  color: #6b7280;
  white-space: nowrap;
}

/* 連線（關鍵） */
.line {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(18px);
  width: 80px;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

/* 已完成線 */
.step.done .line {
  background: #ff8a00;
}

</style>
