<template>
  <div class="verify-card">

    <h2 class="title">認證你的電子郵件</h2>

    <div class="state">

      <!-- Loading -->
<div v-if="status === 'loading'">
  <div class="spinner"></div>
  <p class="message">{{ message }}</p>
</div>

      <!-- Success -->
      <div v-else-if="status === 'success'">
        <div class="icon success">✓</div>
        <p class="message">{{ message }}</p>

        <div class="actions">
          <slot name="success-actions" />
        </div>
      </div>

      <!-- Error -->
      <div v-else>
        <div class="icon error">✕</div>
        <p class="message">{{ message }}</p>

        <div class="actions">
          <button
            class="btn primary"
            :disabled="cooldown > 0"
            @click="handleResend"
          >
            {{ cooldown > 0
              ? `請 ${cooldown}s 後再試`
              : '重新發送驗證信' }}
          </button>

          <slot name="error-actions" />
        </div>
      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  verifyApi: { type: Function, required: true },
  resendApi: { type: Function, required: true },
  token: { type: String, default: '' },
  successText: { type: String, default: '您的電子郵件已成功驗證。' }
})

const emit = defineEmits(['success'])

const status = ref('loading')
const message = ref('驗證中...')
const cooldown = ref(0)

const startCooldown = () => {
  cooldown.value = 60
  const timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

const verify = async () => {
  if (!props.token) {
    status.value = 'error'
    message.value = '驗證連結無效或已過期。'
    return
  }

  try {
    await props.verifyApi(props.token)
    status.value = 'success'
    message.value = props.successText
    emit('success')
  } catch (e) {
    status.value = 'error'
    message.value = '驗證失敗或連結已過期。'
  }
}

const handleResend = async () => {
  try {
    status.value = 'loading'
    message.value = '驗證信發送中...'

    await props.resendApi()

    status.value = 'error'
    message.value = '驗證信已重新發送，請前往信箱查收。'
    startCooldown()
  } catch (e) {
    status.value = 'error'
    message.value = '發送失敗，請稍後再試。'
  }
}

onMounted(verify)
</script>

<style scoped>
.spinner {
  width: 42px;
  height: 42px;
  border: 3px solid #eee;
  border-top: 3px solid #f38d00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>