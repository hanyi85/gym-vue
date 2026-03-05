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

          <div class="flex-grow-1 d-flex align-items-center position-relative overflow-hidden" style="min-width: 0;">
            <button class="btn btn-link text-orange p-0 me-2 scroll-arrow" @click="scrollButtons('left')">
              <i class="bi bi-chevron-left fs-4"></i>
            </button>

            <div ref="scrollContainer" class="d-flex gap-2 overflow-auto no-scrollbar pb-1 px-1 flex-nowrap"
              style="scroll-behavior: smooth;">
              <button v-for="store in filteredStores" :key="store.id" @click="activeStoreId = store.id" :class="['btn btn-sm rounded-pill text-nowrap px-4 py-2 transition-all border flex-shrink-0',
                activeStoreId === store.id ? 'btn-orange border-orange shadow-sm' : 'btn-white text-muted']">
                {{ store.name }}
              </button>
              <div v-if="filteredStores.length === 0" class="text-muted small py-2 text-nowrap">該區域暫無據點</div>
            </div>

            <button class="btn btn-link text-orange p-0 ms-2 scroll-arrow" @click="scrollButtons('right')">
              <i class="bi bi-chevron-right fs-4"></i>
            </button>
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
                  @click="navigateTo(currentStore.address)">
                  <div class="icon-box me-3"><i class="bi bi-geo-alt-fill"></i></div>
                  <div>
                    <div class="small text-muted">門市地址 (點擊導航)</div>
                    <div class="fw-bold text-dark d-flex align-items-center">
                      {{ currentStore.address }}
                      <i class="bi bi-signpost-2 ms-2 text-orange small opacity-50"></i>
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
                <button @click="navigateTo(currentStore.address)"
                  class="btn btn-orange py-3 rounded-3 fw-bold shadow-orange border-0">
                  <i class="bi bi-signpost-2-fill me-2"></i>一鍵導航 (Google Map)
                </button>
                <button @click="copyAddress(currentStore.address)"
                  class="btn btn-outline-light text-muted py-2 border-0 small">
                  <i class="bi bi-copy me-2"></i>複製地址
                </button>
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
const scrollContainer = ref(null);

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

const scrollButtons = (direction) => {
  if (scrollContainer.value) {
    const scrollAmount = 250;
    scrollContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

// 【一鍵導航核心邏輯】
const navigateTo = (address) => {
  if (!address) return;

  const encodedAddress = encodeURIComponent(address);
  // 使用 Google Maps Universal URL，它會自動判斷要開 App 還是網頁
  const googleMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  window.open(googleMapUrl, '_blank');
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
  alert('地址已複製到剪貼簿！');
};

onMounted(fetchVenues);
</script>

<style scoped>
/* 維持你原本的所有樣式 */
.text-orange {
  color: #f3722c !important;
}

.btn-orange {
  background-color: #f3722c;
  color: white;
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.flex-shrink-0 {
  flex-shrink: 0 !important;
}

.scroll-arrow {
  text-decoration: none;
  opacity: 0.6;
  transition: 0.3s;
}

.scroll-arrow:hover {
  opacity: 1;
  transform: scale(1.1);
}

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

.map-wrapper {
  display: flex;
  flex-direction: column;
  background: #fff;
}

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
}
</style>