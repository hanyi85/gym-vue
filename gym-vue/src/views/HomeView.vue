<template>
  <!-- 全站導覽列 -->

  <div class="index-page">
    <main class="main">
      <Hero />
      <!-- 教練 Section -->
      <section class="team-area section-gap" id="trainer">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="menu-content pb-70 col-lg-8">
              <div class="title text-center">
                <h1 class="mb-10">專業教練團隊</h1>
                <p>練吧嚴選業界頂尖師資，具備多項國際證照，為你量身打造專屬訓練計劃。</p>
              </div>
            </div>
          </div>

          <div class="row justify-content-center d-flex align-items-center">
            <div v-for="trainer in trainers" :key="trainer.id" class="col-md-3 single-team">
              <div class="thumb">
                <img class="img-fluid" :src="trainer.image" :alt="trainer.name" />
                <div class="align-items-center justify-content-center d-flex">
                  <a href="#"><i class="bi bi-facebook"></i></a>
                  <a href="#"><i class="bi bi-instagram"></i></a>
                  <a href="#"><i class="bi bi-line"></i></a>
                </div>
              </div>
              <div class="meta-text mt-30 text-center">
                <h4>{{ trainer.name }}</h4>
                <p>{{ trainer.specialty }}</p>
                <div class="certifications mt-2">
                  <small class="text-muted">{{ trainer.certs }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- /教練 Section -->

      <!-- 商品 Section -->
<section class="container py-5">
  <div class="text-center mb-5">
    <h1 class="fw-bold">推薦商品</h1>
    <p class="text-muted">精選熱銷健身補給，助你突破極限</p>
  </div>

<div
    id="recommendedCarousel"
    class="carousel slide"
    data-bs-ride="false"
  >
    <div class="carousel-inner">

      <div
        v-for="(group, index) in groupedProducts"
        :key="index"
        :class="['carousel-item', { active: index === 0 }]"
      >
        <div class="row g-4 justify-content-center">
          <div
            v-for="product in group"
            :key="product.PId"
            class="col-md-3 col-sm-6"
            @click="goToDetail(product.PId)"
          >
            <div class="product-card">
              <div class="img-wrapper mb-3 rounded bg-light shadow-sm d-flex align-items-center justify-content-center">
                <img
                  v-if="product.ImagePath"
                  :src="`https://localhost:7218${product.ImagePath.startsWith('/') ? '' : '/'}${product.ImagePath}`"
                  class="product-img"
                />
              </div>

              <p class="small mb-1 product-name">
                {{ product.FullName }}
              </p>

              <div>
                <span class="price-orange fw-bold me-2">
                  NT${{
                    product.DiscountPrice && product.DiscountPrice > 0
                      ? product.DiscountPrice
                      : product.Price
                  }}
                </span>

                <span
                  v-if="product.DiscountPrice && product.DiscountPrice > 0"
                  class="text-muted text-decoration-line-through small"
                >
                  NT${{ product.Price }}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- 左右按鈕 -->
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#recommendedCarousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon"></span>
    </button>

    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#recommendedCarousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon"></span>
    </button>
    </div>


  <div class="text-center mt-4">
    <router-link to="/shop/products" class="btn btn-outline-dark px-4">
      查看更多商品
    </router-link>
  </div>
</section>
      <!-- /商品 Section -->

      <!-- 課程預約 Section-->
      <section class="top-course-area section-gap" id="top-course">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="menu-content pb-70 col-lg-9">
              <div class="title text-center">
                <h1 class="mb-10">熱門健身課程預約</h1>
                <p>挑戰自我極限，由專業教練帶領您達成理想體態。</p>
              </div>
            </div>
          </div>

          <div class="row">
            <div
  v-for="course in courses.slice(0, 6)"
  :key="course.id"
  class="col-lg-4 col-md-6"
>
  <div class="course-card">

    <div class="course-img-wrapper">
      <img :src="course.image" :alt="course.name" />
      <span class="course-tag">{{ course.status }}</span>
    </div>

    <div class="course-body">
      <h4 class="course-title">
        {{ course.name }}
      </h4>

      <div class="course-footer">
        <span class="course-price">
          NT$ {{ course.price }}
        </span>

        <button class="reserve-btn">
          立即預約
        </button>
      </div>
    </div>

  </div>
</div>
          </div>
        </div>
      </section>
      <!-- /Services 2 Section -->

      <!-- 學員好評 Section -->
      <section class="testimonials section" id="testimonials">
        <div class="container section-title" data-aos="fade-up">
          <h2>學員好評推薦</h2>
          <p>聽聽在練吧轉變人生的學員們怎麼說</p>
        </div>

        <div class="testimonial-wrap">
          <div class="container">
            <div class="row">
              <div v-for="user in testimonials" :key="user.id" class="col-md-6 mb-4">
                <div class="testimonial-item">
                  <div class="d-flex align-items-center mb-3">
                    <img :src="user.avatar" class="testimonial-img" alt="學員頭像" />
                    <div class="ms-3">
                      <p class="client-name mb-0">{{ user.name }}</p>
                      <div class="stars">
                        <i class="bi bi-star-fill" v-for="s in 5" :key="s"></i>
                      </div>
                    </div>
                  </div>
                  <blockquote class="testimonial-text">
                    <p>
                      <i class="bi bi-quote quote-icon-left"></i>
                      {{ user.comment }}
                      <i class="bi bi-quote quote-icon-right"></i>
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- /學員好評 Section -->

      <!-- 健康餐 Section -->
      <div class="container-fluid service py-5">
        <div class="container py-5">
          <div class="row g-4 justify-content-center">
            <div class="col-md-6 col-lg-4">
              <a href="#" class="text-decoration-none">
                <div
                  class="service-item rounded border-0"
                  style="background-color: #f1f3f2; transition: 0.3s"
                >
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"
                    class="img-fluid rounded-top w-100"
                    alt="增肌高蛋白餐"
                    style="height: 250px; object-fit: cover"
                  />
                  <div class="px-4 rounded-bottom">
                    <div
                      class="service-content text-center p-4 rounded"
                      style="background-color: #7a9d96; margin-top: -20px; position: relative"
                    >
                      <h5 class="text-white mb-2">增肌高蛋白餐</h5>
                      <h3 class="mb-0 text-white" style="font-weight: 700">第二件 8 折</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div class="col-md-6 col-lg-4">
              <a href="#" class="text-decoration-none">
                <div
                  class="service-item rounded border-0"
                  style="background-color: #f9f7f2; transition: 0.3s"
                >
                  <img
                    src="https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=500"
                    class="img-fluid rounded-top w-100"
                    alt="低卡舒肥餐"
                    style="height: 250px; object-fit: cover"
                  />
                  <div class="px-4 rounded-bottom">
                    <div
                      class="service-content text-center p-4 rounded"
                      style="background-color: #d8cfbc; margin-top: -20px; position: relative"
                    >
                      <h5 class="text-dark mb-2">低卡舒肥系列</h5>
                      <h3 class="mb-0 text-dark" style="font-weight: 700">全台免運費</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div class="col-md-6 col-lg-4">
              <a href="#" class="text-decoration-none">
                <div
                  class="service-item rounded border-0"
                  style="background-color: #f2f4f5; transition: 0.3s"
                >
                  <img
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"
                    class="img-fluid rounded-top w-100"
                    alt="能量輕食沙拉"
                    style="height: 250px; object-fit: cover"
                  />
                  <div class="px-4 rounded-bottom">
                    <div
                      class="service-content text-center p-4 rounded"
                      style="background-color: #a3ad8d; margin-top: -20px; position: relative"
                    >
                      <h5 class="text-white mb-2">能量輕食沙拉</h5>
                      <h3 class="mb-0 text-white" style="font-weight: 700">現折 $30</h3>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- /健康餐 Section -->

      <!-- Recent Posts Section -->
      <section id="recent-posts" class="recent-posts section">
        <div class="container section-title" data-aos="fade-up">
          <h2>最新消息</h2>
          <p>掌握最新的健身資訊、課程優惠與健康飲食建議</p>
        </div>

        <div class="container">
          <div class="row gy-5">
            <div v-for="(post, index) in newsPosts" :key="post.id" class="col-xl-4 col-md-6">
              <div
                class="post-item position-relative h-100"
                data-aos="fade-up"
                :data-aos-delay="100 * (index + 1)"
              >
                <div class="post-img position-relative overflow-hidden">
                  <img :src="post.image" class="img-fluid" :alt="post.title" />
                  <span class="post-date">{{ post.date }}</span>
                </div>

                <div class="post-content d-flex flex-column">
                  <h3 class="post-title">{{ post.title }}</h3>

                  <div class="meta d-flex align-items-center">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person"></i>
                      <span class="ps-2">{{ post.author }}</span>
                    </div>
                    <span class="px-3 text-black-50">/</span>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-folder2"></i>
                      <span class="ps-2">{{ post.category }}</span>
                    </div>
                  </div>

                  <hr />

                  <router-link :to="`/news/${post.id}`" class="readmore stretched-link">
                    <span>閱讀更多</span>
                    <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- /Recent Posts Section -->

      <!-- Call To Action Section -->
      <section id="call-to-action" class="call-to-action section light-background">
        <div class="content">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <h3>開啟你的增肌減脂計畫</h3>
                <p class="opacity-75">
                  訂閱「練吧」週報，第一時間獲取專業教練的訓練課表、健身補給折扣以及限時場地優惠。
                </p>
              </div>
              <div class="col-lg-6">
                <form action="forms/newsletter.php" class="form-subscribe php-email-form">
                  <div class="form-group d-flex align-items-stretch">
                    <input
                      type="email"
                      name="email"
                      class="form-control h-100"
                      placeholder="Enter your e-mail"
                    />
                    <input type="submit" class="btn btn-secondary px-4" value="Subcribe" />
                  </div>
                  <div class="loading">Loading</div>
                  <div class="error-message"></div>
                  <div class="sent-message">
                    Your subscription request has been sent. Thank you!
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- /Call To Action Section -->
    </main>

    <!-- Scroll Top -->
    <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"
      ><i class="bi bi-arrow-up-short"></i
    ></a>

    <!-- Preloader -->
    <!-- <div id="preloader"></div> -->
  </div>
</template>

<script setup>
import Hero from '@/components/Hero.vue'
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_URL = import.meta.env.VITE_API_URL
const chunkSize = 4

const groupedProducts = computed(() => {
  const result = []
  for (let i = 0; i < recommendedProducts.value.length; i += chunkSize) {
    result.push(recommendedProducts.value.slice(i, i + chunkSize))
  }
  return result
})

const products = ref([])

// 只取前 4 筆當推薦商品
const recommendedProducts = computed(() => {
  return Array.isArray(products.value)
  ? products.value.slice(0, 16)
  : []
})
function getProducts() {
  axios.get(API_URL + 'SProducts')
  .then(res => {
    products.value = res.data  
  })
  .catch(err => {
    console.error('載入商品失敗', err)
  })
}

onMounted(() => {
  getProducts()
})

const goToDetail = (id) => {
  router.push({
    name: 'shop-product-detail',
    params: { id }
  })
}



const trainers = ref([
  {
    id: 1,
    name: '阿強 Coach Ken',
    specialty: '專精：健力、肌力訓練',
    certs: 'NSCA-CPT / NASM-PES',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    name: '李安 Annie',
    specialty: '專精：空中瑜珈、皮拉提斯',
    certs: 'RYT-200 國際瑜珈證照',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    name: '張飛 Jeff',
    specialty: '專精：拳擊燃脂、格鬥訓練',
    certs: 'WBC 職業拳擊教練認證',
    image:
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    name: '小梅 May',
    specialty: '專精：產後體態恢復、增肌減脂',
    certs: 'ACE-CPT 國際教練證照',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=80',
  },
])

// 商品資料
// 分類選單
const categories = [
  { id: 'all', name: '所有商品' },
  { id: 'Supplements', name: '營養補給' },
  { id: 'Equipment', name: '重訓器材' },
  { id: 'Apparel', name: '運動服飾' },
  { id: 'Accessories', name: '訓練配件' },
]


// 課程消息資料
const courses = ref([
  {
    id: 1,
    name: '基礎跑步心肺',
    price: 275,
    status: '開放報名',
    image: 'https://images.unsplash.com/photo-1538370621607-4919ce7889b3?q=80&w=600',
  },
  {
    id: 2,
    name: '專業重量訓練',
    price: 200,
    status: '開放報名',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600',
  },
  {
    id: 3,
    name: '團體拳擊燃脂',
    price: 225,
    status: '名額緊張',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600',
  },
  {
    id: 4,
    name: '空中瑜珈放鬆',
    price: 300,
    status: '開放報名',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
  },
  {
    id: 5,
    name: '高強度間歇 HIIT',
    price: 500,
    status: '專業進階',
    image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600',
  },
  {
    id: 6,
    name: '健體健美專修',
    price: 250,
    status: '開放報名',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600',
  },
])

// 健身房消息資料
const newsPosts = ref([
  {
    id: 1,
    title: '春季增肌大挑戰：報名即享教練課 8 折優惠',
    date: 'March 01',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600', // 示意圖，可換成在地路徑
    author: '專業教練組',
    category: '優惠活動',
  },
  {
    id: 2,
    title: '生酮飲食 vs. 低 GI 飲食：哪種更適合你的健身計畫？',
    date: 'February 25',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600',
    author: '營養師團隊',
    category: '健康飲食',
  },
  {
    id: 3,
    title: '新場館落成！全台最頂級悍馬機進駐，邀請您來體驗',
    date: 'February 10',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600',
    author: '管理中心',
    category: '場館公告',
  },
])

// 學員好評資料
const testimonials = ref([
  {
    id: 1,
    name: '李佳佳 - 職場媽媽',
    comment:
      '以前下班總是腰酸背痛，加入練吧後，教練針對我的久坐問題調整訓練，現在體力變超好，工作效率也提升了！',
    avatar: 'https://i.pravatar.cc/150?u=1', // 隨機頭像產生器
  },
  {
    id: 2,
    name: '王小明 - 科技業工程師',
    comment: '團體課程氣氛超棒！拳擊燃脂課程讓我壓力全消，三個月內體脂掉了 5%，真的找回了自信。',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: '張大衛 - 業餘運動員',
    comment:
      '這裡的器材是全台最頂尖的，悍馬機配置非常齊全。特別推薦一對一私人教學，細節抓得很精準。',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: '陳艾琳 - 大學生',
    comment: '空中瑜珈環境非常安靜舒適，老師很有耐心。很適合初學者加入，完全沒有壓力！',
    avatar: 'https://i.pravatar.cc/150?u=4',
  },
])
</script>


<style scoped>
/* 帳號 */
/* 確保選單在 Vue 控制下能正確顯示 */
.account_selection {
  display: block;
  visibility: hidden;
  opacity: 0;
  background: #ffffff;
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 160px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  padding: 0;
  list-style: none;
}

/* 當 show_menu 類別存在時顯示 */
.account_selection.show_menu {
  visibility: visible;
  opacity: 1;
  top: 120%; /* 稍微往下飄的感覺 */
}

/* 如果你想保留原本 hover 就能打開的功能，也可以加上這行 */
.account:hover .account_selection {
  visibility: visible;
  opacity: 1;
}

.account_selection li {
  border-bottom: 1px solid #eee;
}

.account_selection li a {
  display: block;
  padding: 12px 20px;
  color: #333 !important;
  font-size: 14px;
  text-decoration: none;
}

.account_selection li a:hover {
  background: #fe4c50;
  color: #ffffff !important;
}

.user_greeting_box {
  background: #f8f9fa;
  padding: 12px 20px;
  border-bottom: 2px solid #fe4c50;
}

.user_name {
  color: #fe4c50;
  font-weight: bold;
}

/* 教練 */
.section-gap {
  padding: 100px 0;
}

.title h1 {
  font-weight: 700;
  color: #222;
}

.single-team {
  margin-bottom: 30px;
}

.single-team .thumb {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

/* 懸浮效果：顯示社群圖標 */
.single-team .thumb div {
  position: absolute;
  left: 0;
  bottom: -50px;
  width: 100%;
  background: #f38d00; 
  transition: 0.3s;
  padding: 10px 0;
}

.single-team:hover .thumb div {
  bottom: 0;
}

.single-team .thumb div a {
  color: #fff;
  margin: 0 10px;
  font-size: 18px;
}

.meta-text h4 {
  margin-top: 20px;
  font-weight: 700;
  transition: 0.3s;
}

.single-team:hover h4 {
  color: #f38d00; /* 懸浮時名字變色 */
}

.certifications {
  font-size: 0.85rem;
  line-height: 1.4;
}

/* 商品 */
.product-card {
  cursor: pointer;
  transition: 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.img-wrapper {
  height: 220px;
  overflow: hidden;
}

.product-img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.product-name {
  min-height: 40px;
}

.price-info {
  font-size: 0.95rem;
}
.price-orange{
  color: #f3722c;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #f3722c;
  border-radius: 50%;
  padding: 20px;
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
}


/* ===== 首頁課程新風格 ===== */

.course-card {
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
  transition: 0.35s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.course-img-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.course-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s ease;
}

.course-card:hover img {
  transform: scale(1.08);
}

.course-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #f3722c;
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.course-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.course-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  min-height: 2.6em;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price {
  color: #f3722c;
  font-weight: 800;
  font-size: 18px;
}

.reserve-btn {
  background: #f3722c;
  border: none;
  color: #fff;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  transition: 0.3s;
}

.reserve-btn:hover {
  background: #e55d00;
}
/* 課程結束 */

/* 學員好評 */
.testimonials {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.testimonial-item {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: transform 0.3s ease;
}

.testimonial-item:hover {
  transform: translateY(-5px);
}

.testimonial-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f38d00;
}

.client-name {
  font-weight: 700;
  color: #222;
  font-size: 1.1rem;
}

.stars {
  color: #ffc107; /* 金色星星 */
  font-size: 0.8rem;
}

.testimonial-text {
  font-style: italic;
  color: #555;
  margin-top: 15px;
  line-height: 1.6;
}

.quote-icon-left,
.quote-icon-right {
  color: #f6214b;
  font-size: 1.2rem;
  opacity: 0.3;
}

/* 最新消息 */
.post-item {
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.06);
  transition: 0.3s;
  background: #fff;
}

.post-item:hover {
  transform: translateY(-5px);
}

.post-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 15px 0;
  color: #222;
}

.post-date {
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: var(--accent-color, #fe4c50);
  color: #fff;
  padding: 6px 12px;
  font-size: 13px;
}


</style>
