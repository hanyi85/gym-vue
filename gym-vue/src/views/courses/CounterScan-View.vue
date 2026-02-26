<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import axios from 'axios'
import { Html5Qrcode } from 'html5-qrcode'

const api = axios.create({
  baseURL: 'https://localhost:7218/api',
})

const msg = ref('請對準學員 QR Code 進行掃描')
const result = ref('')
let qr = null
let locked = false

async function handleCheckin(text) {
  try {
    const data = JSON.parse(text)
    const bookingId = Number(data.bookingId || 0)

    if (!bookingId) {
      msg.value = 'QR 內容錯誤（缺少 bookingId）'
      locked = false
      return
    }

    msg.value = '驗證中...'

    await api.post(`/CourseBookings/checkin/${bookingId}`)

    msg.value = `✅ 報到成功（BK${bookingId}）`
  } catch (err) {
    msg.value =
      err.response?.data ||
      err.message ||
      '報到失敗'
    locked = false
  }
}

onMounted(async () => {
  try {
    const cameras = await Html5Qrcode.getCameras()
    if (!cameras || cameras.length === 0) {
      msg.value = '找不到相機裝置'
      return
    }

    qr = new Html5Qrcode('qr-reader')

    await qr.start(
      { deviceId: { exact: cameras[0].id } },
      { fps: 10, qrbox: { width: 260, height: 260 } },
      async (decodedText) => {
        if (locked) return
        locked = true

        result.value = decodedText
        await handleCheckin(decodedText)

        // 掃描完停止（避免重複掃描）
        qr.stop().catch(() => {})
      },
      () => {}
    )
  } catch (e) {
    console.error(e)
    msg.value = '相機啟動失敗'
  }
})

onBeforeUnmount(() => {
  if (qr) qr.stop().catch(() => {})
})
</script>

<template>
  <section style="max-width:720px;margin:0 auto;padding:24px;">
    <h2 style="font-weight:800;margin-bottom:8px;">櫃台報到</h2>
    <p style="color:#666;margin-bottom:12px;">
      使用 HTML5 相機掃描 QR Code，並展示解析結果
    </p>

    <div id="qr-reader" style="width:360px;max-width:100%;min-height:320px;border:1px dashed #ccc;border-radius:12px;"></div>

    <div style="margin-top:16px;padding:12px;border:1px solid #eee;border-radius:12px;">
      <div style="font-weight:700;">狀態：{{ msg }}</div>
      <div style="margin-top:10px;">
        <div style="font-size:12px;color:#888;">掃描到的原始內容</div>
        <div style="word-break:break-all;">{{ result || '（尚未掃描）' }}</div>
      </div>
    </div>
  </section>
</template>