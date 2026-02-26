<template>
  <div class="address-wrapper">
    <div class="grid">
      <!-- 縣市 -->
      <div class="field">
        <label class="field-label">縣市</label>
        <select v-model="city" @change="area = ''">
          <option value="">選擇縣市</option>
          <option v-for="c in taiwanAddress" :key="c.name" :value="c.name">
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- 區域 -->
      <div class="field">
        <label class="field-label">區域</label>
        <select v-model="area" :disabled="!city">
          <option value="">選擇區域</option>
          <option v-for="d in districts" :key="d.name" :value="d.name">
            {{ d.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 郵遞區號 -->
    <div class="field">
      <label class="field-label">郵遞區號</label>
      <input :value="zipcode" readonly />
    </div>

    <!-- 詳細地址 -->
    <div class="field">
      <label class="field-label">路名與門牌號碼</label>
      <input v-model="detailAddress" placeholder="例：中山路一段 100 號" />
      <div class="full-address-preview">
        {{ fullAddress }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { taiwanAddress } from "@/data/twzipcode"

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(["update:modelValue"])

const city = ref("")
const area = ref("")
const detailAddress = ref("")

const districts = computed(() => {
  return taiwanAddress.find(c => c.name === city.value)?.districts || []
})

const zipcode = computed(() => {
  return districts.value.find(d => d.name === area.value)?.zipcode || ""
})

const fullAddress = computed(() => {
  return `${zipcode.value}${city.value}${area.value}${detailAddress.value}`
})

/* 對外同步 */
watch(fullAddress, (val) => {
  emit("update:modelValue", val)
})

/* 解析舊地址 */
onMounted(() => {
  if (!props.modelValue) return

  const raw = props.modelValue.trim()
  let parsed = false

  // 有郵遞區號格式
  if (/^\d{3}/.test(raw)) {
    const zip = raw.slice(0, 3)

    for (const c of taiwanAddress) {
      const district = c.districts.find(d => d.zipcode === zip)
      if (district) {
        city.value = c.name
        area.value = district.name
        const prefix = zip + c.name + district.name
        detailAddress.value = raw.slice(prefix.length)
        parsed = true
        break
      }
    }
  }

  // 無郵遞區號格式
  if (!parsed) {
    for (const c of taiwanAddress) {
      if (raw.startsWith(c.name)) {
        city.value = c.name
        for (const d of c.districts) {
          if (raw.includes(d.name)) {
            area.value = d.name
            const prefix = c.name + d.name
            detailAddress.value = raw.slice(prefix.length)
            break
          }
        }
        break
      }
    }
  }
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #8a7a65;
}

input,
select {
  padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 15px;
  transition: border-color .2s, box-shadow .2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #f38d00;
  box-shadow: 0 0 0 3px rgba(243, 141, 0, 0.15);
}

.full-address-preview {
  margin-top: 6px;
  font-size: 14px;
  color: #666;
}
</style>