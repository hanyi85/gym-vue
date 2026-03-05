<script setup>
import { ref,onMounted,computed } from 'vue'
import OrderQrcode from '@/components/Meals/OrderQrcode.vue'
import axios from 'axios'

const apiUrl="https://localhost:7218/api"

/*會員資料*/
const member = ref({
    UserId: 1,
    Name: '王小明',
    Email: 'ming01@test.com',
    Phone:'0912345678'
  })

  const isLogin = computed(() => !!member.value)


  const logout = () => {
    member.value = null
  }

const orders = ref([])
const qrItems = ref([])

async function fetchQrCodes() {
  try {
  const res = await axios.get(
    `${apiUrl}/TMealOrderItems/Qrcode/${member.value.UserId}`
  )

  qrItems.value = res.data
  } catch (err) {
    console.error("載入QR Code失敗", err)
  }
}


onMounted(() => {
  if (isLogin.value) {
    fetchQrCodes()
  }
})

console.log("QR API 回傳：", qrItems)

</script>



<template>

<div class="card border-0  container py-3">
  <h2 class="text-center mb-4 order-title"><i class="bi bi-qr-code order-title"></i> 取餐QR Code</h2>
    <div class="card-header header-orange text-white">
      
    </div>
    <div class="card-body">
      <div class="row g-3">
        
          <div 
            class="col-12  col-lg-4" 
            v-for="item in qrItems"
    :key="item.FOrderItemId"
  >
    <OrderQrcode :item="item" />
          </div>
        
      </div>
    </div>
  </div>
</template>


<style scoped>
.header-orange {
  background: linear-gradient(90deg, #f3722c, #ff9f1c);
  border-radius: 12px 12px 0 0;
  height: 40px;
}
.card-body {
  background-color: #fffaf4;
  border-radius: 12px;
}

.order-title {
  color: #f3722c;
  font-weight: bold;
}
</style>