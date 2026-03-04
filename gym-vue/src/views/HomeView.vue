<script setup>
import Hero from '@/components/Hero.vue'
import { ref,computed } from 'vue'


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

const currentTab = ref('all')

// 商品資料（健身商品版本）
const products = ref([
  {
    id: 1,
    title: '分離式乳清蛋白 (2kg)',
    category: 'Supplements',
    price: 1880,
    description: '高純度、極速吸收，每份含有 25g 優質蛋白質，助你高效增肌。',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=500',
  },
  {
    id: 2,
    title: '可調式啞鈴組 (24kg)',
    category: 'Equipment',
    price: 3200,
    description: '15 段重量一秒切換，節省空間，是居家健身的最佳重量選擇。',
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500',
  },
  {
    id: 3,
    title: '高強度彈性拉力帶',
    category: 'Accessories',
    price: 450,
    description: '天然乳膠材質，輔助引體向上或加強深蹲阻力。',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500',
  },
  {
    id: 4,
    title: '超輕量排汗訓練衫',
    category: 'Apparel',
    price: 790,
    description: '極致透氣纖維，保持運動時的乾爽體感。',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
  },
  {
    id: 5,
    title: '專業牛皮護掌',
    category: 'Accessories',
    price: 880,
    description: '高摩擦力防護，預防重訓老繭，提升抓握穩定度。',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500',
  },
  {
    id: 6,
    title: '肌酸補給粉 (無味)',
    category: 'Supplements',
    price: 650,
    description: '提升爆發力與運動表現，讓你挑戰更高重量。',
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=500',
  },
])
// 根據點選的分類過濾商品
const filteredProducts = computed(() => {
  if (currentTab.value === 'all') return products.value
  return products.value.filter((p) => p.category === currentTab.value)
})

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
    name: '王小明 - 科技業工程師',
    comment:
      '以前下班總是腰酸背痛，加入練吧後，教練針對我的久坐問題調整訓練，現在體力變超好，工作效率也提升了！',
    avatar: 'https://i.pravatar.cc/150?u=1', // 隨機頭像產生器
  },
  {
    id: 2,
    name: '李佳佳 - 職場媽媽',
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
      <div class="container-fluid fruite py-5">
        <div class="container py-5">
          <div class="tab-class text-center">
            <div class="row g-4">
              <div class="col-lg-4 text-start">
                <h1>我們的精選商品</h1>
              </div>
              <div class="col-lg-8 text-end">
                <ul class="nav nav-pills d-inline-flex text-center mb-5">
                  <li class="nav-item" v-for="(category, index) in categories" :key="index">
                    <a
                      class="d-flex m-2 py-2 bg-light rounded-pill"
                      :class="{ active: currentTab === category.id }"
                      @click.prevent="currentTab = category.id"
                      href="#"
                    >
                      <span class="text-dark" style="width: 130px">{{ category.name }}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="tab-content">
              <div class="tab-pane fade show p-0 active">
                <div class="row g-4">
                  <div
                    class="col-md-6 col-lg-4 col-xl-3"
                    v-for="item in filteredProducts"
                    :key="item.id"
                  >
                    <div class="rounded position-relative fruite-item border border-secondary">
                      <div class="fruite-img">
                        <img
                          :src="item.image"
                          class="img-fluid w-100 rounded-top"
                          :alt="item.title"
                          style="height: 250px; object-fit: cover"
                        />
                      </div>
                      <div
                        class="text-white bg-secondary px-3 py-1 rounded position-absolute"
                        style="top: 10px; left: 10px"
                      >
                        {{ item.category }}
                      </div>
                      <div class="p-4 border-top-0 rounded-bottom">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.description }}</p>
                        <div class="d-flex justify-content-between flex-lg-wrap">
                          <p class="text-dark fs-5 fw-bold mb-0">${{ item.price }} / kg</p>
                          <a
                            href="#"
                            class="btn border border-secondary rounded-pill px-3 text-primary"
                          >
                            <i class="fa fa-shopping-bag me-2 text-primary"></i> 加入購物車
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            <div v-for="course in courses" :key="course.id" class="col-lg-4 col-md-6">
              <div class="single-course">
                <div class="thumb">
                  <img class="img-fluid" :src="course.image" :alt="course.name" />
                  <span class="course-status">{{ course.status }}</span>
                </div>
                <div class="course-details">
                  <router-link :to="`/courses/${course.id}`">
                    <h4>
                      {{ course.name }} <span>${{ course.price }}</span>
                    </h4>
                  </router-link>
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
/* 確保標籤定位在圖片左上角 */
.category-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

/* 統一商品圖片的容器大小 */
.product-card img {
  width: 100%;
  height: 200px; /* 強制所有圖片高度固定為 200px (可依需求調整) */
  object-fit: cover; /* 關鍵！這會讓圖片自動裁切填滿容器，不變形 */
  object-position: center; /* 確保裁切時以中心為主 */
}

.product-card {
  position: relative;
  overflow: hidden; /* 確保圖片不會超出邊框 */
}

.btn.text-primary,
.text-primary {
  color: #f38d00 !important;
}

.btn.border-secondary:hover {
  background: #f38d00;
  color: #fff !important;
  border-color: #f38d00;
}


/* 課程 */
.top-course-area {
  padding: 100px 0;
  background: #f1f3f6;
}

.pb-70 {
  padding-bottom: 70px;
}

/* --- 核心卡片樣式 --- */
.single-course {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 30px;
  transition: all 0.4s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  /* 移除 padding-bottom，讓卡片由內容決定高度 */
  height: 100%;
}

/* --- 圖片統一尺寸的關鍵 --- */
.single-course .thumb {
  position: relative;
  overflow: hidden;
  /* 強制設定圖片容器的高度，你可以根據需求調整 200px 或 250px */
  height: 220px;
}

.single-course img {
  width: 100%;
  height: 100%; /* 強制填滿容器高度 */
  object-fit: cover; /* 關鍵：這會自動裁切圖片，保持比例不變形 */
  object-position: center; /* 裁切時以中間為準 */
  transition: transform 0.6s ease;
  display: block;
}

/* 懸浮效果 */
.single-course:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.single-course:hover img {
  transform: scale(1.1);
}

/* --- 狀態標籤 --- */
.single-course .course-status {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #f6214b;
  color: #fff;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

/* --- 文字區域 --- */
.course-details {
  padding: 20px;
}

.single-course h4 {
  margin: 0;
  font-size: 17px; /* 稍微縮小字體確保一行能放完 */
  font-weight: 600;
  color: #222;
}

.single-course h4 span {
  float: right;
  color: #f6214b;
  font-weight: 700;
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
