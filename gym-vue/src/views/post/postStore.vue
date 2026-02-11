<template>
  <div class="store-wrapper bg-light min-vh-100 pb-5">
   <banner title="場地資訊" subtitle="尋找最近的健身房，打造最完美的身材曲線" />
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <p class="text-muted small">
          <router-link to="/" class="breadcrumb-link text-decoration-none text-muted">首頁</router-link>
          <span class="mx-2">/</span>
          <span class="text-orange">門市據點</span>
        </p>
      </nav>

      <div class="row justify-content-center mb-5">
        <div class="col-auto d-flex gap-3 flex-wrap justify-content-center">
          <button v-for="store in stores" :key="store.id" @click="activeStoreId = store.id"
            :class="['btn rounded-pill px-5 py-2 fw-bold transition-all', activeStoreId === store.id ? 'btn-orange shadow' : 'btn-outline-orange']">
            {{ store.name }}
          </button>
        </div>
      </div>

      <div class="row justify-content-center mb-5">
        <div class="col-lg-10">
          <div class="card border-0 shadow-sm rounded-4 overflow-hidden animate-fade-in">
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-md-5">
                  <div class="store-img-container h-100">
                    <img :src="currentStore.image" :alt="currentStore.name" class="store-img">
                  </div>
                </div>
                <div class="col-md-7 p-4 p-md-5 position-relative">
                  <div class="mb-4">
                    <h3 class="fw-bold text-dark mb-3">{{ currentStore.name }}</h3>
                    <hr class="border-orange opacity-50 w-25">
                  </div>

                  <div class="store-info-list mb-4">
                    <p class="mb-2"><i class="bi bi-telephone-fill text-orange me-3"></i>電話：{{ currentStore.phone }}</p>
                    <p class="mb-2"><i class="bi bi-geo-alt-fill text-orange me-3"></i>地址：{{ currentStore.address }}</p>
                    <p class="mb-2"><i class="bi bi-clock-fill text-orange me-3"></i>營業時間：{{ currentStore.hours }}</p>
                    <p class="mb-2"><i class="bi bi-p-square-fill text-orange me-3"></i>會員福利：{{ currentStore.parking }}
                    </p>
                    <p class="mb-0"><i class="bi bi-info-circle-fill text-orange me-3"></i>鄰近停車場：{{
                      currentStore.nearbyParking }}</p>
                  </div>

                  <div class="d-grid gap-2 store-actions">
                    <button class="btn btn-orange-light text-orange fw-bold rounded-3 py-2 border-0">館內特色</button>
                    <button class="btn btn-orange-light text-orange fw-bold rounded-3 py-2 border-0">教練介紹</button>
                    <button class="btn btn-orange-light text-orange fw-bold rounded-3 py-2 border-0">課程介紹</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="map-container rounded-4 shadow-sm overflow-hidden border-0">
            <iframe :src="currentStore.mapUrl" width="100%" height="450" style="border:0;" allowfullscreen=""
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Banner from '@/components/banner.vue'
// 門市資料陣列
const stores = ref([
  {
    id: 1,
    name: '信義旗艦館',
    phone: '02-2720-1234',
    address: '台北市信義區忠孝東路五段XXX號',
    hours: '24小時全年無休',
    parking: '申辦會員免費停車 2 小時',
    nearbyParking: '信義中心停車場 (步行 3 分鐘)',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.922572561937!2d121.5645!3d25.0339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da80a7ad%3A0xacc4d11ee96c3763!2z6Ie65YyXMTAx!5e0!3m2!1szh-TW!2stw!4v1715000000000!5m2!1szh-TW!2stw'
  },
  {
    id: 2,
    name: '台中精誠館',
    phone: '04-2320-5678',
    address: '台中市西區精誠路XXX號',
    hours: '06:00 - 00:00',
    parking: '申辦會員免費停車 1.5 小時',
    nearbyParking: '大隆路公有停車場 (步行 5 分鐘)',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.604473347146!2d120.6596!3d24.1477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d052800366d%3A0x67345634563456!2z6Ie65Lit5biC5pS_5bqc!5e0!3m2!1szh-TW!2stw!4v1715000000000!5m2!1szh-TW!2stw'
  }
]);

// 當前選中的門市 ID
const activeStoreId = ref(1);

// 透過計算屬性取得當前門市詳細資料
const currentStore = computed(() => {
  return stores.value.find(s => s.id === activeStoreId.value) || stores.value[0];
});
</script>

<style scoped>
/* 品牌色系 */
.bg-orange {
  background-color: #f3722c;
}

.text-orange {
  color: #f3722c !important;
}

.border-orange {
  border-color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  border-color: #f3722c;
  color: white;
}

.btn-orange:hover {
  background-color: #d65a1a;
  color: white;
}

.btn-outline-orange {
  color: #f3722c;
  border-color: #f3722c;
  background-color: white;
}

.btn-outline-orange:hover {
  background-color: rgba(243, 114, 44, 0.05);
  color: #f3722c;
}

/* 按鈕選中後的淺色背景版（用於側邊功能鍵） */
.btn-orange-light {
  background-color: rgba(243, 114, 44, 0.1) !important;
  transition: all 0.2s;
}

.btn-orange-light:hover {
  background-color: rgba(243, 114, 44, 0.2) !important;
  transform: translateX(5px);
}

/* 圖片處理 */
.store-img-container {
  overflow: hidden;
}

.store-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 300px;
}

/* 地圖容器 */
.map-container {
  border: 4px solid white;
}

/* 進場動畫 */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 麵包屑 */
.breadcrumb-link:hover {
  color: #f3722c !important;
}

/* 響應式調整 */
@media (min-width: 768px) {
  .store-actions {
    position: absolute;
    right: 3rem;
    top: 50%;
    transform: translateY(-50%);
    width: 150px;
  }
}
</style>