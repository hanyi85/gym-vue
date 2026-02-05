<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])
const expandedOrders = ref([])

/* 展開 / 收合訂單 */
function toggle(orderId) {
  const index = expandedOrders.value.indexOf(orderId)
  if (index === -1) {
    expandedOrders.value.push(orderId)
  } else {
    expandedOrders.value.splice(index, 1)
  }
}

/* 模擬 API 資料（之後可換成 fetch / axios） */
onMounted(() => {
  orders.value = [
    {
      orderId: 1,
      orderNo: 'OD20260201',
      orderDate: '2026-02-01',
      items: [
        {
          orderItemId: 101,
          mealName: '舒肥雞胸健康餐',
          calories: 520,
          protein: 42,
          pickupTime: '12:00–13:00',
          isPickedUp: false,
          qrCodeUrl: '/assets/img/meals/qrcode.jpg'
        },
        {
          orderItemId: 102,
          mealName: '低脂牛肉能量餐',
          calories: 610,
          protein: 45,
          pickupTime: '18:00–19:00',
          isPickedUp: true,
          qrCodeUrl: '/assets/img/meals/qrcode.jpg'
        }
      ]
    }
  ]
})

</script>



<template>

<div class="container py">
    <h2 class="mb-4 fw-bold">我的健康餐訂單</h2>

    <div
      v-for="order in orders"
      :key="order.orderId"
      class="card mb-3 shadow-sm"
    >
      <!-- 訂單主資訊 -->
      <div
        class="card-header d-flex justify-content-between align-items-center"
        @click="toggle(order.orderId)"
        style="cursor: pointer;"
      >
        <div>
          <strong>訂單編號：</strong>{{ order.orderNo }}<br />
          <small class="text-muted">
            訂單日期：{{ order.orderDate }}
          </small>
        </div>

        <span class="badge bg-primary">
          共 {{ order.items.length }} 份餐點
        </span>
      </div>

      <!-- 訂單明細 -->
      <div v-show="expandedOrders.includes(order.orderId)">
        <ul class="list-group list-group-flush">
          <li
            v-for="item in order.items"
            :key="item.orderItemId"
            class="list-group-item"
          >
            <div class="row align-items-center">
              <div class="col-md-6">
                <h6 class="mb-1">{{ item.mealName }}</h6>
                <small class="text-muted">
                  熱量:{{ item.calories }} kcal　
                   蛋白質: {{ item.protein }} g
                </small><br />
                <small class="text-muted">
                  取餐時段：{{ item.pickupTime }}
                </small>
              </div>

              <div class="col-md-3 text-center">
                <img
                  :src="item.qrCodeUrl"
                  alt="QR Code"
                  class="img-fluid"
                  style="max-width: 80px;"
                />
              </div>

              <div class="col-md-3 text-end">
                <span
                  class="badge"
                  :class="item.isPickedUp ? 'bg-success' : 'bg-secondary'"
                >
                  {{ item.isPickedUp ? '已領取' : '未領取' }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>


</template>



<style scoped>

</style>