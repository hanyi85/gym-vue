<script setup>
const props = defineProps({
  item: Object,
  timeSlots: Array
});

const emit = defineEmits(['update', 'delete']);

//計數的另一種
// const changeQty = (val) => {
//   if (props.item.qty + val >= 1) {
//     props.item.qty += val;
//     updateItem();
//   }
// };

const updateItem = () => {
  // 計算新的小計
  props.item.subtotal = props.item.qty * props.item.unitPrice;
  emit('update', props.item);
};
</script>

<template>
  <div class="col">
    <div class="card h-100 shadow-sm border-0 cart-card">
      <div class="position-relative">
        <img :src="'https://localhost:7218' + item.imageUrl" class="card-img-top meal-img" alt="meal image" />
        <button 
          class="btn btn-delete position-absolute top-0 end-0 m-2" 
          @click="$emit('delete', item.orderItemId)"
          title="移除餐點"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="card-body d-flex flex-column">
        <h5 class="card-title fw-bold text-dark mb-3">{{ item.mealName }}</h5>
        
        <div class="mb-3">
          <label class="form-label small fw-bold text-muted mb-1">
            <i class="bi bi-calendar-event me-1"></i>取餐日期
          </label>
          <input type="date" class="form-control custom-focus" v-model="item.pickDate" @change="updateItem">
        </div>

        <div class="row g-2 mb-3">
          <div class="col-7">
            <label class="form-label small fw-bold text-muted mb-1">
              <i class="bi bi-clock me-1"></i>時段
            </label>
            <select class="form-select custom-focus" v-model="item.pickTimeId" @change="updateItem">
              <option v-for="slot in timeSlots" :key="slot.id" :value="slot.id">{{ slot.label }}</option>
            </select>
          </div>
          <div class="col-5">
            <label class="form-label small fw-bold text-muted mb-1">
              <i class="bi bi-basket me-1"></i>份數
            </label>
            <div class="input-group">
              <!-- <button class="btn btn-outline-secondary border-end-0" @click="changeQty(-1)">-</button> -->
              <input type="number" class="form-control text-center px-0  custom-focus" v-model.number="item.qty" @change="updateItem" min="1" @input="item.qty = item.qty < 1 ? 1 : item.qty"
 />
              <!-- <button class="btn btn-outline-secondary border-start-0" @click="changeQty(1)">+</button> -->
            </div>
          </div>
        </div>

        <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-end">
          <div class="text-muted small">單價 ${{ item.unitPrice }}</div>
          <div class="h5 mb-0 price-text fw-bold">小計 ${{ item.subtotal }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 橘色系主題設定 */
.cart-card {
  transition: transform 0.2s ease-in-out;
  border-radius: 15px;
  overflow: hidden;
  background-color: #fffaf4; /* 卡片色 */
}
.cart-card:hover {
  transform: translateY(-5px);
}

.meal-img {
  height: 200px;
  object-fit: cover;
}
/* i{
    color: #ff9f1c;
} */
.price-text {
  color: #f3722c;
}

.btn-outline-orange {
  color: #ff9f1c;
  border-color: #ff9f1c;
}
.btn-outline-orange:hover {
  background-color: #ff9f1c;
  border-color: #ff9f1c;
  color: white;
}

.border-orange {
  border-color: #ff9f1c !important;
}

.custom-focus:focus {
  border-color: #ff9f1c;
  box-shadow: 0 0 0 0.25rem rgba(255, 159, 28, 0.25);
}

.btn-delete {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f3722c;
  border: none;
}
.btn-delete:hover {
  background: #f3722c;
  color: white;
}
</style>