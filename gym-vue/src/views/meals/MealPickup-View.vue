<script setup>
import { ref } from "vue"
import axios from "axios"
import { QrcodeStream } from "vue-qrcode-reader"
const apiUrl="https://localhost:7218/api"

const qrInput = ref("")
const item = ref(null)
const message = ref("")
const loading = ref(false)

// 🔎 查詢
async function fetchItem(qrContent) {
  try {
    loading.value = true
    const res = await axios.get(`${apiUrl}/TMealPickUpQrcode/confirm/${qrContent}`)
    item.value = res.data
    console.log(item.value)
    message.value = ""
  } catch (err) {
    item.value = null
    message.value = err.response?.data?.message || "查詢失敗"
  } finally {
    loading.value = false
  }
}

// 📷 掃描成功
function onDecode(result) {
  qrInput.value = result
  fetchItem(result)
}

// ✅ 確認取餐
async function confirmPickup() {
  if (!item.value) return

  if (!confirm("確定完成取餐？")) return

  try {
    const res = await axios.post(
      `${apiUrl}/TMealPickUpQrcode/pickup/${item.value.FOrderItemId}`
    )

    message.value = res.data.message
    item.value.fPickupStatus = true
  } catch (err) {
    message.value = err.response?.data?.message
  }
}

</script>



<template>

<div class="container m-5">
  <div class="row justify-content-center">
    <div class=" col-md-6">
      <h2 class="text-center"> 取餐系統</h2>
    <!-- 鏡頭掃描 -->
    <div class="mb-4">
      <qrcode-stream @decode="onDecode" />
    </div>

    <!-- 手動輸入 -->
    <div class="mb-3">
      <input
        v-model="qrInput"
        class="form-control"
        placeholder="請輸入 QRCode 內容"
      />
      <button class="btn  py-2 fw-bold text-white btn-qrcode mt-2" @click="fetchItem(qrInput)">
        查詢
      </button>
    </div>

    <!-- 訊息 -->
    <div v-if="message" class="alert alert-info">
      {{ message }}
    </div>

    <!-- 訂單資訊 -->
    <div v-if="item" class="card">
      <div class="card-body">
        <p><strong>訂單明細編號：</strong>{{ item.FOrderItemId }}</p>
        <p><strong>餐點名稱：</strong>{{ item.MealName }}</p>
        <p><strong>數量：</strong>{{ item.FQty }}</p>
        <p><strong>取餐分店：</strong>{{ item.VenueName }}</p>
        <p><strong>取餐日期：</strong>{{ item.PickDate }}</p>
        <p><strong>取餐時段：</strong>{{ item.PickTime }}</p>
        <p><strong>取餐人姓名：</strong>{{ item.UserName }}</p>
        <p><strong>電話：</strong>{{ item.Phone }}</p>

        <p>
          <strong>狀態：</strong>
          <span
            class="badge"
            :class="item.fPickupStatus ? 'bg-secondary' : 'bg-success'"
          >
            {{ item.fPickupStatus ? "已領取" : "未領取" }}
          </span>
        </p>

        <button
          v-if="!item.fPickupStatus"
          class="btn w-100 py-2 fw-bold text-white btn-qrcode"
          @click="confirmPickup"
        >
          確認取餐
        </button>
      </div>
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


</style>