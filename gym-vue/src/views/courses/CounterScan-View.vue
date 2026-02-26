<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const msg = ref('請對準學員 QR Code 進行掃描')
const result = ref('')
let qr = null
let locked = false

function showResult(text) {
  result.value = text
  try {
    const data = JSON.parse(text)
    msg.value = `掃描成功：bookingId = ${data.bookingId ?? '（無）'}`
  } catch {
    msg.value = '掃描成功（內容非 JSON）'
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
      (decodedText) => {
        if (locked) return
        locked = true
        showResult(decodedText)

        // 掃到就停止（掃描框會消失是正常的）
        qr.stop().catch(() => {})
      },
      () => {}
    )
  } catch (e) {
    console.error('camera start error:', e)
    msg.value = `相機啟動失敗：${e?.name || ''} ${e?.message || ''}`
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