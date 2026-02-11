<script setup>
import { useRoute, useRouter } from 'vue-router'
import Btn from '@/components/btn.vue'

const route = useRoute()
const router = useRouter()

const coach = {
  id: route.params.id,
  name: 'Annie',
  title: '瑜珈資深教練',
  experience: 6,
  desc: '專注於基礎瑜珈與伸展訓練，擅長引導初學者建立正確姿勢與呼吸節奏。',
  skills: ['基礎瑜珈', '伸展放鬆', '呼吸訓練'],
  image:  'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}

function goBack() {
  router.push({ name: 'courses-list' })
}

function goBooking() {
  router.push({
    name: 'courses-list',
    query: {
      coach: coach.name
    }
  })
}
</script>

<template>
  <div class="page-wrapper">
    <div class="detail-card">

      <div class="image-area">
        <img :src="coach.image" class="main-img" />
      </div>

      <div class="info-area">
        <h2>{{ coach.name }}</h2>
        <div class="coach-title">{{ coach.title }}</div>

        <div class="tags">
          <span
            class="tag"
            v-for="s in coach.skills"
            :key="s"
          >
            {{ s }}
          </span>
        </div>

        <p class="desc">{{ coach.desc }}</p>

        <div class="exp">教學年資：{{ coach.experience }} 年</div>

       
        <div class="action-group">
          <Btn
            addText="回到課程列表"
            buyText="立即預約"
            @add="goBack"
            @buy="goBooking"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  margin-top: 100px;
  max-width: 1100px;
  margin: auto;
}

.detail-card {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}


.main-img {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-radius: 16px;
}

.coach-title {
  margin-top: 6px;
  color: #666;
}

.tags {
  margin: 12px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #fff4ea;
  color: #c2410c;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.desc {
  margin-top: 16px;
  line-height: 1.7;
}

.exp {
  margin-top: 20px;
  font-weight: 600;
}


.action-group {
  margin-top: 28px;
}
</style>
