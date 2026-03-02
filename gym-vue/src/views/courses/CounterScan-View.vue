<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import axios from 'axios'
import { Html5Qrcode } from 'html5-qrcode'

const api = axios.create({ baseURL: 'https://localhost:7218/api' })

const msg = ref('請對準學員 QR Code 進行掃描')
let qr = null
let locked = false
let cameraId = null

// Modal 狀態
const showSuccessModal = ref(false)
const modalText = ref('')

const MODAL_MS = 2500

async function startScanner() {
  if (!cameraId) return

  // 保險：如果已經在跑就先停掉
  try { await qr?.stop() } catch {}

  qr = new Html5Qrcode('qr-reader')

  await qr.start(
    { deviceId: { exact: cameraId } },
    { fps: 10, qrbox: { width: 260, height: 260 } },
    async (decodedText) => {
      if (locked) return
      locked = true

      //  掃到就先停，避免連續觸發
      try { await qr.stop() } catch {}

      await handleCheckin(decodedText)
    },
    () => {}
  )
}

function showSuccess(bookingId) {
  modalText.value = `報到成功（BK${String(bookingId).padStart(9, '0')}）`
  msg.value = modalText.value

  showSuccessModal.value = true

  setTimeout(async () => {
    showSuccessModal.value = false
    msg.value = '請對準學員 QR Code 進行掃描'
    locked = false

    //  繼續掃描
    try {
      await startScanner()
    } catch {
      msg.value = '相機啟動失敗，請重新整理頁面'
    }
  }, MODAL_MS)
}

function showFail(text) {
  msg.value = text
  // 失敗不用停太久，0.8 秒後繼續掃
  setTimeout(async () => {
    msg.value = '請對準學員 QR Code 進行掃描'
    locked = false
    try {
      await startScanner()
    } catch {
      msg.value = '相機啟動失敗，請重新整理頁面'
    }
  }, 800)
}

async function handleCheckin(text) {
  try {
    const data = JSON.parse(text)
    const bookingId = Number(data.bookingId || 0)

    if (!bookingId) {
      showFail('QR 內容錯誤（缺少 bookingId）')
      return
    }

    msg.value = '驗證中...'
    await api.post(`/CourseBookings/checkin/${bookingId}`)

    //  成功：跳 Modal + 維持狀態久一點 + 續掃
    showSuccess(bookingId)
  } catch (err) {
    showFail(err.response?.data || err.message || '報到失敗')
  }
}

onMounted(async () => {
  try {
    const cameras = await Html5Qrcode.getCameras()
    if (!cameras || cameras.length === 0) {
      msg.value = '找不到相機裝置'
      return
    }

    cameraId = cameras[0].id
    await startScanner()
  } catch (e) {
    console.error(e)
    msg.value = '相機啟動失敗'
  }
})

onBeforeUnmount(async () => {
  try { await qr?.stop() } catch {}
})
</script>

<template>
  <section class="wrap">
    <h2 class="title">櫃台報到</h2>
    <p class="sub">請對準學員 QR Code 進行掃描</p>

    <div id="qr-reader" class="reader"></div>

    <!-- 只顯示狀態，不顯示 JSON -->
    <div class="status-card">
      <div class="status-label">狀態</div>
      <div class="status-text">{{ msg }}</div>
    </div>

    <!--  成功 Modal -->
    <div v-if="showSuccessModal" class="modal-mask" aria-modal="true" role="dialog">
      <div class="modal-card">
        <div class="icon">✓</div>
        <div class="modal-title">報到成功</div>
        <div class="modal-desc">{{ modalText }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap{
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
}
.title{
  font-weight: 900;
  margin-bottom: 6px;
}
.sub{
  color:#6b7280;
  margin-bottom: 12px;
}
.reader{
  width: 360px;
  max-width: 100%;
  min-height: 320px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  overflow: hidden;
}
.status-card{
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  background: #fff;
}
.status-label{
  font-size: 12px;
  color:#9ca3af;
  margin-bottom: 4px;
}
.status-text{
  font-weight: 800;
  color:#111827;
}

/* modal */
.modal-mask{
  position: fixed;
  inset: 0;
  background: rgba(17,24,39,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}
.modal-card{
  width: min(420px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 22px 18px;
  box-shadow: 0 22px 70px rgba(0,0,0,.25);
  text-align: center;
}
.icon{
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #ff8a00;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 28px;
  font-weight: 900;
  margin: 0 auto 10px;
}
.modal-title{
  font-size: 20px;
  font-weight: 900;
  margin-bottom: 6px;
}
.modal-desc{
  color:#374151;
  font-weight: 800;
}
</style>