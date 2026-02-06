<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true, // 1, 2, 3
  },
})

const steps = [
  { id: 1, label: '購物車' },
  { id: 2, label: '填寫資料'},
  { id: 3, label: '訂單完成'},
]
</script>

<template>
  <div class="checkout-progress">
    <div
      v-for="(step, index) in steps"
      :key="step.id"
      class="step-wrapper"
    >
      <!-- 圓點 -->
      <div
        class="step-circle"
        :class="{
          active: currentStep === step.id,
          completed: currentStep > step.id,
        }"
      >
        <span class="icon">{{ step.id }}</span>
      </div>

      <!-- 文字 -->
      <div class="step-label">
        {{ step.label }}
      </div>

      <!-- 連接線 -->
      <div
        v-if="index < steps.length - 1"
        class="step-line"
        :class="{ filled: currentStep > step.id }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
/* 整體容器 */
.checkout-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

/* 每一個步驟 */
.step-wrapper {
  flex: 1;
  text-align: center;
  position: relative;
}

/* 圓點 */
.step-circle {
    position: relative;   /* 讓 z-index 生效 */

   width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid #f3722c;
  background: #fff;
  color: #f3722c;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  z-index: 2; /* 圓圈永遠在最上層 */


}

/* 目前步驟 */
.step-circle.active {
  background: #f38d00;
  color: #fff;
  
}

/* 已完成 */
.step-circle.completed {
  background: #f3722c;
  color: #fff;
 
}

/* 文字 */
.step-label {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #555;
}

/* 連接線 */
.step-line {
  position: absolute;
  top: 24px;
  right: -50%;
  width: 100%;
  height: 4px;
  background: #eee;
  z-index: 0; /* 壓在線上面 */
  
}

/* 已完成的線 */
.step-line.filled {
  background: #f3722c;
z-index: 0; /* 壓在線上面 */
}

/* ===== RWD 手機版 ===== */
@media (max-width: 576px) {
  .checkout-progress {
    flex-direction: column;
    align-items: flex-start;
  }

  .step-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .step-circle {
    margin: 0;
  }

  .step-label {
    margin-left: 1rem;
    font-size: 0.9rem;
  }

  .step-line {
    display: none;
  }
}
</style>

