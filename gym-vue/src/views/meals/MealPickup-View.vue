<script setup>
import { ref, onMounted, defineProps, watch} from "vue"
import axios from "axios"
import { QrcodeStream,QrcodeCapture } from "vue-qrcode-reader"
const apiUrl="https://localhost:7218/api"
import Swal from 'sweetalert2'

const qrInput = ref("")
const item = ref(null)
const message = ref("")
const loading = ref(false)
const cameras = ref([])

const payments = [
  { value: 'cash', label: '現金付款' },
  { value: 'credit', label: '信用卡' },
  { value: 'transfer', label: '轉帳' }
]

// 建立一個 map，方便查找
const paymentMap = Object.fromEntries(payments.map(p => [p.value, p.label]))
defineProps({
  order: Object
})

// 查詢
async function fetchItem(qrContent) {
  try {
    loading.value = true
    const res = await axios.get(`${apiUrl}/TMealPickUpQrcode/confirm/${qrContent}`)
    item.value = res.data
    console.log(item.value)
    message.value = ""
    qrInput.value = ""   // 查詢後清空輸入框

  } catch (err) {
    item.value = null
    message.value = err.response?.data?.message || "查詢失敗"
    qrInput.value = ""   // 查詢後清空輸入框

  } finally {
    loading.value = false
  }
}

//多掃描
const mode = ref("camera") 
// camera = 相機掃描
// upload = 上傳圖片


const result = ref('')
//QRCode 掃描功能
function onDetect(detectedCodes) {
  if (!detectedCodes.length) return

  const qrContent = detectedCodes[0].rawValue

  result.value = qrContent
  qrInput.value = qrContent

  console.log("QRCode:", qrContent)

  // 自動查詢
  fetchItem(qrContent)
}

/*** error handling ***/

const error = ref('')

function onError(err) {
 if (err.name === 'NotAllowedError') {
    error.value = '請允許相機權限'

  } else if (err.name === 'NotReadableError') {
    error.value = '相機可能被其他程式使用'

  } else if (err.name === 'NotFoundError') {
    error.value = '找不到相機'

  } else {
    error.value = ''
  }
}

/*** track functonsQRCode 偵測框 ***/

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

//選擇鏡頭
const selectedCamera = ref(null)
const cameraKey = ref(0)

onMounted(async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()

  cameras.value = devices.filter(d => d.kind === "videoinput")

  if (cameras.value.length > 0) {
    selectedCamera.value = cameras.value[0].deviceId
  }
})

//初始化相機
const stream = ref(null)
async function initCamera(deviceId) {

  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }

  stream.value = await navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: deviceId } }
  })
}

// 監聽 camera 改變
watch(selectedCamera, async (newId) => {
  await initCamera(newId)
  cameraKey.value++   // 重新建立 qrcode-stream
})


//  確認取餐
async function confirmPickup() {
  if (!item.value) return

  const result = await Swal.fire({
    title: '確定取餐？',
    text: '請確認餐點資訊，取餐後將無法再使用此 QR Code 領取',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    confirmButtonColor: '#f3722c',
    cancelButtonColor: '#6c757d'
  })

  if (!result.isConfirmed) return


  try {
    const res = await axios.post(
      `${apiUrl}/TMealPickUpQrcode/Pickup/${item.value.FOrderItemId}`
    )

    message.value = res.data.message
    item.value.FPickupStatus = true
  } catch (err) {
    message.value = err.response?.data?.message
  }
}

</script>



<template>

<div class="container-fluid m-5">
  <div class="row justify-content-center d-flex align-items-start">
    <div class=" col-md-4 col-12 ">
      <h2 class="text-center  order-title"><i class="bi bi-qr-code order-title"></i> 取餐系統</h2>

      <!-- 選擇模式 -->
      <div class="mb-2">
  <label class="fw-bold">掃描方式：</label>

  <select v-model="mode" class="form-select">
    <option value="camera">相機掃描</option>
    <option value="upload">上傳QRCode圖片</option>
  </select>
</div>

      <select v-if="mode==='camera'" v-model="selectedCamera">
  <option
    v-for="camera in cameras"
    :key="camera.deviceId"
    :value="camera.deviceId"
  >
    {{ camera.label || "Camera" }}
  </option>
</select>
    <!-- 鏡頭掃描 -->
    <!-- <div class="mb-4 scanner">
      <qrcode-stream  @decode="onDecode" />
    </div> -->

    <p class="error">{{ error }}</p>


    <div>
      <qrcode-stream
        v-if="mode === 'camera'"
        :key="cameraKey"
        :constraints="{ deviceId: { exact: selectedCamera } }"
        @error="onError"
        @detect="onDetect"
        :track="paintOutline"
      />
      <!-- 上傳圖片 -->
      <qrcode-capture
        v-if="mode === 'upload'"
        @detect="onDetect"
      />
    </div>
    



    <!-- 手動輸入 -->
    <div class="my-3">
      <input
        v-model="qrInput"
        class="form-control pt-2"
        placeholder="請輸入 QRCode 內容"
      />
      <div class="d-flex justify-content-center ">
        <button class="btn w-100 py-2 fw-bold text-white btn-qrcode  mt-2" @click="fetchItem(qrInput)">
        查詢
      </button>
      </div>
    </div>

    
    </div>

    <div class="col-md-4 col-12">
      
      <!-- 訂單資訊 -->
       <h2 class="text-center  order-title"><i class="bi bi-receipt order-title"></i> 健康餐訂單資訊</h2>
    <div v-if="item" class="card mt-3">
      <div class="card-body">
        <p><strong>訂單明細編號：</strong>{{ item?.FOrderItemId }}</p>
        <p><strong>餐點名稱：</strong>{{ item?.MealName }}</p>
        <p><strong>數量：</strong>{{ item?.FQty }}</p>
        <p><strong>取餐分店：</strong>{{ item?.VenueName }}</p>
        <p><strong>取餐日期：</strong>{{ item?.PickDate }}</p>
        <p><strong>取餐時段：</strong>{{ item?.PickTime }}</p>
        <p><strong>取餐人姓名：</strong>{{ item?.UserName }}</p>
        <p><strong>電話：</strong>{{ item?.Phone }}</p>
        <p><strong>付費方式：</strong>{{ paymentMap[item?.PayMethod] || item?.PayMethod}}</p>

        <p>
          <strong>狀態：</strong>
          <span
            class="badge"
            :class="item.FPickupStatus ? 'bg-secondary' : 'bg-success'"
          >
            {{ item.FPickupStatus ? "已領取" : "未領取" }}
          </span>
        </p>

        <button
          v-if="!item.FPickupStatus"
          class="btn w-100 py-2 fw-bold text-white btn-qrcode"
          @click="confirmPickup"
        >
          確認取餐
        </button>
      </div>
    </div>
    <!-- 訊息 -->
    <div v-if="message" class="alert mt-3">
      {{ message }}
    </div>

    </div>
    
    </div>
    
  
</div>


</template>



<style scoped>

.btn-qrcode {
  background-color: #f3722c;
  border: none;
}

.btn-qrcode:hover {
  background-color: #d65a1a;
}


.error {
  font-weight: bold;
  color: red;
}

.order-title {
  color: #f3722c;
  font-weight: bold;
}

.alert {
  background-color: #ffe0c3;
  border-radius: 12px;
  padding: 16px;
}

</style>