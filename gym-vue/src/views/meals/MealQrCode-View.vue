<script setup>
import { ref,onMounted } from 'vue'
import OrderQrcode from '@/components/Meals/OrderQrcode.vue'
import { useAuthStore } from '@/stores/mealAuthStore'
import axios from 'axios'

const apiUrl="https://localhost:7218/api"

const authStore = useAuthStore()
const orders = ref([])

async function fetchOrders() {
  try {
    // 1. 抓訂單基本資料
    const resOrders = await axios.get(`${apiUrl}/TMealOrders/user/${authStore.member.UserId}`)
    const orderList = resOrders.data

    // 2. 抓訂單明細
    const resItems = await axios.get(`${apiUrl}/TMealOrderItems/user/${authStore.member.UserId}`)
    const itemList = resItems.data

    // 3. 整合成前端需要的結構
    orders.value = orderList.map(order => {
      return {
        info: {
          fOrderId: order.FOrderId,
          fOrderName: order.FOrderName,
          fOrderPhone: order.FOrderPhone,
          fOrderEmail: order.FOrderEmail,
          fCartCreateAt: order.FCartCreateAt,
          fOrderAt: order.FOrderAt,
          fVenueId: order.FVenueId,
          fTotalAmount: order.FTotalAmount,
          fOrderStatus: order.FOrderStatus,
          fPayMethod: order.FPayMethod,
          fVenueName: order.FVenue?.VenueName // 關聯場館
        },
        items: itemList
          .filter(i => i.FOrderId === order.FOrderId) // 對應同一張訂單
          .map(i => ({
            fOrderItemId: i.FOrderItemId,
            fOrderId: i.FOrderId,
            fMealId: i.FMealId,
            fMealName: i.FMeal?.FMealName,
            fQty: i.FQty,
            fUnitPrice: i.FUnitPrice,
            fSubtotal: i.FSubtotal,
            fPickDate: i.FPickDate,
            fPickTimeID: `${i.FPickTime?.FStartTime.substring(0,5)}-${i.FPickTime?.FEndTime.substring(0,5)}`,
            fQrContent: i.FQrContent,
            fPickupStatus: i.FPickupStatus,
            showQr: false,
            fMealImage: i.FMeal?.FImageUrl
          }))
      }
    })
  } catch (err) {
    console.error("載入訂單失敗", err)
  }
}

onMounted(() => {
  if (authStore.isLogin) {
    fetchOrders()
  }
})

// const orders = ref([
//   {
//     info: {
//       fOrderId: 1,
//       fOrderName: '王小明',
//       fOrderPhone: '0912-345-678',
//       fOrderEmail: 'test@mail.com',
//       fCartCreateAt: '2026-02-06 10:30',
//       fOrderAt: '2026-02-06 10:45',
//       fVenueId: 1,
//       fTotalAmount: 980,
//       fOrderStatus: '已付款',
//       fPayMethod: '信用卡',
//       fVenueName: '大安館'
//     },
//     items: [
//       {
//         fOrderItemId: 1,
//         fOrderId: 1,
//         fMealId: 101,
//         fMealName: '高蛋白舒肥雞胸',
//         fQty: 2,
//         fUnitPrice: 180,
//         fSubtotal: 360,
//         fPickDate: '2026-02-07',
//         fPickTimeID: '12:00-13:00',
//         fQrContent: 'ORDERITEM-001',
//         fPickupStatus: false,
//         showQr: false,
//         fMealImage: '/assets/img/meals/1.jpg'
//       },
//       {
//         fOrderItemId: 2,
//         fOrderId: 1,
//         fMealId: 205,
//         fMealName: '低脂香煎鱸魚',
//         fQty: 2,
//         fUnitPrice: 310,
//         fSubtotal: 620,
//         fPickDate: '2026-02-07',
//         fPickTimeID: '18:00-19:00',
//         fQrContent: 'ORDERITEM-002',
//         fPickupStatus: false,
//         showQr: false,
//         fMealImage: '/assets/img/meals/1.jpg'
//       }
//     ]
//   },
//   {
//     info: {
//       fOrderId: 2,
//       fOrderName: '王小明',
//       fOrderPhone: '0912-345-678',
//       fOrderEmail: 'test@mail.com',
//       fCartCreateAt: '2026-01-31 09:20',
//       fOrderAt: '2026-01-31 09:45',
//       fVenueId: 2,
//       fTotalAmount: 310,
//       fOrderStatus: '已付款',
//       fPayMethod: '信用卡',
//       fVenueName: '信義館'
//     },
//     items: [
//       {
//         fOrderItemId: 3,
//         fOrderId: 2,
//         fMealId: 301,
//         fMealName: '低醣牛肉沙拉',
//         fQty: 1,
//         fUnitPrice: 310,
//         fSubtotal: 310,
//         fPickDate: '2026-02-01',
//         fPickTimeID: '12:00-13:00',
//         fQrContent: 'ORDERITEM-003',
//         fPickupStatus: true,
//         showQr: false,
//         fMealImage: '/assets/img/meals/1.jpg'
//       }
//     ]
//   }
// ]);
</script>



<template>

<div class="card border-0  container py-3">
  <h2 class="text-center mb-4 order-title"><i class="bi bi-qr-code order-title"></i> 取餐QR Code</h2>
    <div class="card-header header-orange text-white">
      
    </div>
    <div class="card-body">
      <div class="row g-3">
        <template v-for="order in orders" :key="order.info.fOrderId">
          <div 
            class="col-12  col-lg-4" 
            v-for="item in order.items" 
            :key="item.fOrderItemId"
          >
            <OrderQrcode 
              :item="item" 
              :venue-name="order.info.fVenueName"
              :order-status="order.info.fOrderStatus"
            />
          </div>
        </template>
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