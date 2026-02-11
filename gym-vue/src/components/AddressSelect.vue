<template>
  <div class="address-card shadow">

    <h3 class="title">聯絡地址</h3>

    <!-- 縣市 -->
    <div class="form-group">
      <label>縣市</label>
      <select v-model="selectedCity" @change="onCityChange">
        <option value="">請選擇縣市</option>
        <option v-for="city in cities" :key="city.name" :value="city.name">
          {{ city.name }}
        </option>
      </select>
    </div>

    <!-- 區域 -->
    <div class="form-group">
      <label>區域</label>
      <select v-model="selectedArea" @change="onAreaChange" :disabled="!selectedCity">
        <option value="">請選擇區域</option>
        <option v-for="area in areas" :key="area.name" :value="area.name">
          {{ area.name }}
        </option>
      </select>
    </div>

    <!-- 路名 -->
    <div class="form-group">
      <label>路名</label>
      <select v-model="selectedRoad" :disabled="!selectedArea">
        <option value="">請選擇路名</option>
        <option v-for="road in roads" :key="road" :value="road">
          {{ road }}
        </option>
      </select>
    </div>

    <!-- 詳細地址 -->
    <div class="form-group">
      <label>門牌號碼</label>
      <input v-model="detailAddress" placeholder="例：100號 3樓" />
    </div>

    <!-- 顯示組合結果 -->
    <div class="result" v-if="fullAddress">
      📍 完整地址：{{ fullAddress }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cities = ref([
  {
    name: '台北市',
    areas: [
      { name: '中正區', roads: ['忠孝東路', '羅斯福路', '和平西路'] },
      { name: '大安區', roads: ['信義路', '復興南路', '敦化南路'] }
    ]
  },
  {
    name: '新北市',
    areas: [
      { name: '板橋區', roads: ['文化路', '中山路', '民生路'] },
      { name: '新莊區', roads: ['幸福路', '中正路', '中港路'] }
    ]
  }
])

const selectedCity = ref('')
const selectedArea = ref('')
const selectedRoad = ref('')
const detailAddress = ref('')

const areas = ref([])
const roads = ref([])

const onCityChange = () => {
  const city = cities.value.find(c => c.name === selectedCity.value)
  areas.value = city ? city.areas : []
  selectedArea.value = ''
  selectedRoad.value = ''
  roads.value = []
}

const onAreaChange = () => {
  const area = areas.value.find(a => a.name === selectedArea.value)
  roads.value = area ? area.roads : []
  selectedRoad.value = ''
}

const fullAddress = computed(() => {
  if (!selectedCity.value || !selectedArea.value || !selectedRoad.value) return ''
  return `${selectedCity.value}${selectedArea.value}${selectedRoad.value}${detailAddress.value}`
})
</script>

<style scoped>
.address-card {
  max-width: 420px;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
}

.title {
  font-weight: bold;
  margin-bottom: 16px;
  font-size: 1.3rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

label {
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: #555;
}

select,
input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s;
}

select:focus,
input:focus {
  border-color: #f38d00;
}

select:disabled {
  background: #f5f5f5;
  color: #aaa;
}

.result {
  margin-top: 16px;
  padding: 12px;
  background: #fff3e0;
  border-radius: 10px;
  color: #f38d00;
  font-weight: 600;
}
</style>
