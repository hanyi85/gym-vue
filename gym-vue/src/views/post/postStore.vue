<template>
  <div class="store-wrapper bg-light min-vh-100 pb-5">
    <banner title="場地資訊" subtitle="尋找最近的健身房，打造最完美的身材曲線" />

    <div class="container mt-n5 position-relative z-3">
      <div class="filter-card bg-white p-3 p-md-4 rounded-4 shadow-sm mb-5 border-0">
        <div class="d-flex flex-column flex-lg-row align-items-lg-center gap-3">

          <div class="d-flex align-items-center flex-shrink-0">
            <i class="bi bi-search text-orange fs-4 me-2"></i>
            <h5 class="fw-bold mb-0 text-nowrap">探索據點</h5>
          </div>

          <div class="flex-grow-0" style="min-width: 200px;">
            <select v-model="selectedCity" class="form-select custom-select shadow-none" @change="onCityChange">
              <option value="">顯示所有縣市</option>
              <option v-for="city in cityOptions" :key="city" :value="city">{{ city }}</option>
            </select>
          </div>

          <div class="flex-grow-1 overflow-hidden">
            <div class="d-flex gap-2 overflow-auto no-scrollbar pb-1 px-1">
              <button v-for="store in filteredStores" :key="store.id" @click="activeStoreId = store.id" :class="['btn btn-sm rounded-pill text-nowrap px-4 py-2 transition-all border',
                activeStoreId === store.id ? 'btn-orange border-orange shadow-sm' : 'btn-white text-muted']">
                {{ store.name }}
              </button>
              <div v-if="filteredStores.length === 0" class="text-muted small py-2">該區域暫無據點</div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="!loading && currentStore.id" class="row g-4 animate-fade-in">
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
            <div class="store-img-wrapper">
              <img :src="currentStore.image" :alt="currentStore.name" class="store-img-top">
              <div class="img-overlay">
                <span class="badge bg-orange px-3 py-2 rounded-pill shadow-sm">{{ currentStore.city }}</span>
              </div>
            </div>

            <div class="card-body p-4">
              <h2 class="fw-bold text-dark mb-4">{{ currentStore.name }}</h2>

              <div class="info-group mb-4">
                <div class="d-flex align-items-start mb-3 pointer hover-orange"
                  @click="copyAddress(currentStore.address)">
                  <div class="icon-box me-3"><i class="bi bi-geo-alt-fill"></i></div>
                  <div>
                    <div class="small text-muted">門市地址</div>
                    <div class="fw-bold text-dark d-flex align-items-center">
                      {{ currentStore.address }}
                      <i class="bi bi-copy ms-2 text-orange small opacity-50"></i>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-start mb-3">
                  <div class="icon-box me-3"><i class="bi bi-telephone-fill"></i></div>
                  <div>
                    <div class="small text-muted">聯絡電話</div>
                    <div class="fw-bold text-dark">{{ currentStore.phone }}</div>
                  </div>
                </div>

                <div class="d-flex align-items-start">
                  <div class="icon-box me-3"><i class="bi bi-clock-fill"></i></div>
                  <div>
                    <div class="small text-muted">營業時間</div>
                    <div class="fw-bold text-dark">{{ currentStore.hours }}</div>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <a :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentStore.address)}`"
                  target="_blank" class="btn btn-orange py-3 rounded-3 fw-bold shadow-orange">
                  <i class="bi bi-signpost-2-fill me-2"></i>開啟 Google Map 導航
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="map-wrapper shadow-sm rounded-4 overflow-hidden h-100 border border-white">
            <div class="map-header bg-white p-3 d-flex justify-content-between align-items-center border-bottom">
              <span class="fw-bold small text-muted d-flex align-items-center">
                <span class="pulse-red me-2"></span> 門市據點精確位置
              </span>
              <span class="badge bg-light text-secondary fw-normal">互動式地圖</span>
            </div>
            <div class="map-content">
              <iframe :src="currentStore.mapUrl" width="100%" height="100%" style="border:0; min-height: 500px;"
                allowfullscreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-orange" style="width: 3rem; height: 3rem;" role="status"></div>
        <p class="mt-3 text-muted fw-bold">正在探索您的健身生活...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Banner from '@/components/banner.vue';

const stores = ref([]);
const loading = ref(true);
const selectedCity = ref('');
const activeStoreId = ref(null);

const fetchVenues = async () => {
  try {
    loading.value = true;
    const response = await axios.get('https://localhost:7218/api/Venues');
    stores.value = response.data;
    if (stores.value.length > 0) activeStoreId.value = stores.value[0].id;
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setTimeout(() => { loading.value = false; }, 600);
  }
};

const cityOptions = computed(() => [...new Set(stores.value.map(s => s.city))]);
const filteredStores = computed(() => {
  if (!selectedCity.value) return stores.value;
  return stores.value.filter(s => s.city === selectedCity.value);
});
const currentStore = computed(() => stores.value.find(s => s.id === activeStoreId.value) || {});

const onCityChange = () => {
  if (filteredStores.value.length > 0) activeStoreId.value = filteredStores.value[0].id;
};

const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  alert('地址已複製，快去預約健身吧！');
};

onMounted(fetchVenues);
</script>

<style scoped>
/* 核心變數與基礎樣式 */
.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  color: white;
  border: none;
  transition: 0.3s;
}

.btn-orange:hover {
  background-color: #e6601a;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(243, 114, 44, 0.3);
}

.border-orange {
  border-color: #f3722c !important;
}

/* 修正後的探索據點 Div 樣式 */
.filter-card {
  margin-top: -40px;
  z-index: 100;
  position: relative;
}

.custom-select {
  border-radius: 12px;
  border: 1px solid #dee2e6;
  padding: 0.6rem 1rem;
  font-weight: 500;
  cursor: pointer;
}

/* 隱藏滾動條但保持滾動功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 門市資訊卡片優化 */
.store-img-wrapper {
  position: relative;
  height: 250px;
}

.store-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}

.card:hover .store-img-top {
  transform: scale(1.05);
}

.icon-box {
  width: 42px;
  height: 42px;
  background: rgba(243, 114, 44, 0.08);
  color: #f3722c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.hover-orange:hover .fw-bold {
  color: #f3722c;
  transition: 0.3s;
}

/* 地圖樣式 */
.map-wrapper {
  display: flex;
  flex-direction: column;
  background: #fff;
}

.map-content {
  flex-grow: 1;
}

/* 地圖小紅點動畫 */
.pulse-red {
  width: 10px;
  height: 10px;
  background: #ff4d4d;
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(255, 77, 77, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 77, 77, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 991px) {
  .filter-card {
    margin-top: 0;
  }

  .store-actions {
    position: static;
    width: 100%;
    transform: none;
    margin-top: 1.5rem;
  }
}
</style>