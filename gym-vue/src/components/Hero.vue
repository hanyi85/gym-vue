<template>
  <section id="hero" class="hero">
    <div id="hero-carousel" class="carousel slide carousel-fade">
      <div class="carousel-indicators">
        <button
          v-for="(item, index) in carouselItems"
          :key="'ind-' + index"
          type="button"
          data-bs-target="#hero-carousel"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          class="custom-indicator"
        />
      </div>

      <div class="carousel-inner">
        <div
          v-for="(item, index) in carouselItems"
          :key="'item-' + index"
          class="carousel-item"
          :class="{ active: index === 0 }"
        >
          <div class="hero-overlay"></div>

          <img
            :src="
              item.image ||
              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80'
            "
            class="d-block w-100"
            :alt="item.title"
          />

          <div
            class="carousel-caption d-flex flex-column justify-content-center align-items-center"
          >
            <h2 class="animate-title">{{ item.title }}</h2>
            <p class="animate-desc">{{ item.description }}</p>
            <div class="animate-btn">
              <a href="#" class="btn btn-gym">立即預約體驗</a>
            </div>
          </div>
        </div>
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#hero-carousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon shadow-sm"></span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#hero-carousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon shadow-sm"></span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import * as bootstrap from 'bootstrap'

onMounted(() => {
  const el = document.querySelector('#hero-carousel')
  if (el) {
    new bootstrap.Carousel(el, {
      interval: 5000, // 自動切換時間
      ride: 'carousel',
      pause: false,
      wrap: true,
    })
  }
})
const carouselItems = [
  {
    title: '開啟體能巔峰',
    description: '頂級器材與專業場地，為你的目標提供最強支援',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920',
  },
  {
    title: '精準科學訓練',
    description: '一對一私人顧問，量身打造最高效的增肌減脂計畫',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920',
  },
  {
    title: '團體動能燃脂',
    description: '多樣化課程選擇，在歡樂氣氛中突破自我極限',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1920',
  },
]
</script>

<style scoped>
.hero {
  height: 80vh; /* 根據視窗高度自動縮放，比固定 600px 更有彈性 */
  min-height: 500px;
  background-color: #000;
}

#hero-carousel,
.carousel-inner,
.carousel-item {
  height: 100%;
}

.carousel-indicators {
  z-index: 5;
  bottom: 30px;
}

#hero-carousel {
  overflow: hidden;
}

/* 黑色半透明漸層遮罩：讓文字在任何圖片上都清晰 */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%);
  z-index: 1;
}

.carousel-item img {
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  inset: 0;              /* top:0 right:0 bottom:0 left:0 */
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 0 24px;       /* 不要再用 15% */
  text-align: center;
}

/* --- 動畫設定 --- */
.carousel-item.active .animate-title {
  animation: fadeInUp 0.8s ease backwards;
}

.carousel-item.active .animate-desc {
  animation: fadeInUp 0.8s ease 0.3s backwards; /* 延遲 0.3 秒 */
}

.carousel-item.active .animate-btn {
  animation: fadeInUp 0.8s ease 0.6s backwards; /* 延遲 0.6 秒 */
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

/* --- 文字與按鈕美化 --- */
h2 {
  max-width: 1000px;
  margin: 0 auto 20px;

  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
}
@media (min-width: 992px) {
  h2 {
    white-space: nowrap;
  }
}
p {
  font-size: 1.2rem;
  font-weight: 300;
  max-width: 600px;
   margin: 0 auto 30px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
}

.btn-gym {
  background-color: #f38d00; /* 健身房常用的亮紅色 */
  color: #fff;
  padding: 12px 35px;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-gym:hover {
  background-color: #d38211;
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(246, 33, 75, 0.3);
}

/* --- 指示點美化 --- */
.custom-indicator {
  width: 40px !important;
  height: 5px !important;
  border-radius: 2px;
  margin: 0 5px !important;
}

/* 隱藏箭頭，滑入時才出現 */
.carousel-control-prev,
.carousel-control-next {
  opacity: 0;
  transition: 0.3s;
}
#hero-carousel:hover .carousel-control-prev,
#hero-carousel:hover .carousel-control-next {
  opacity: 1;
}
</style>
