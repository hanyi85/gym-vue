import { createRouter, createWebHistory, RouterView } from 'vue-router'

const routes = [
  // 首頁
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },

  /* =========================
   * 會員 Users
   * ========================= */
  // 會員登入
  {
    path: '/users/login',
    name: 'User-login',
    component: () => import('@/views/users/UserLogin.vue'),
  },

  // 會員註冊
  {
    path: '/users/register',
    name: 'user-register',
    component: () => import('@/views/users/UserRegister.vue'),
  },
// 會員首頁
   {
    path: '/users/home',
    name: 'user-home',
    component: () => import('@/views/users/UserHome.vue'),
  },

  // 會員基本資料
  {
    path: '/users/profile',
    name: 'user-profile',
    component: () => import('@/views/users/UserProfile.vue'),
  },

   {
    path: '/users/verifyEmail',
    name: 'user-verify-Email',
    component: () => import('@/views/users/UserVerifyEmail.vue'),
  },

  // 會員健康資訊
  {
    path: '/users/profile-health',
    name: 'user-profile-health',
    component: () => import('@/views/users/UserProfileHealth.vue'),
  },

  // 忘記密碼
  {
    path: '/users/forgot-password',
    name: 'user-forgot-password',
    component: () => import('@/views/users/UserForgotPassword.vue'),
  },

  // 體重紀錄
  {
    path: '/users/weight',
    name: 'user-weight-record',
    component: () => import('@/views/users/UserWeightRecord.vue'),
  },

  // 飲食紀錄
  {
    path: '/users/diet',
    name: 'user-diet',
    component: () => import('@/views/users/food/UserDiet.vue'),
  },

  // 飲食首頁
  {
    path: '/users/food',
    name: 'food-home',
    component: () => import('@/views/users/food/FoodHome.vue'),
  },

  // 新增飲食
  {
    path: '/users/food/create',
    name: 'food-create',
    component: () => import('@/views/users/food/FoodCreate.vue'),
  },

  // 新增飲食明細
  {
    path: '/users/food/create-detail',
    name: 'food-create-detail',
    component: () => import('@/views/users/food/FoodCreateDetail.vue'),
  },
  /* =========================
   * 課程 Courses
   * ========================= */

  // 課程入口（選場館）
  {
    path: '/courses',
    name: 'courses',
    component: () => import('@/views/courses/Course-View.vue'),
  },

  // 場館內課程列表（找課 / 找教練）
  {
    path: '/courses/list',
    name: 'courses-list',
    component: () => import('@/views/courses/CourseList-View.vue'),
  },

  // 課程詳細
  {
    path: '/courses/detail/:id',
    name: 'courses-detail',
    component: () => import('@/views/courses/CourseDetail-View.vue'),
  },

  // 教練詳細
  {
    path: '/courses/coach-detail/:id',
    name: 'courses-coach-detail',
    component: () => import('@/views/courses/CoachDetail-View.vue'),
  },

  // 預約流程
  {
    path: '/courses/booking',
    name: 'courses-booking',
    component: () => import('@/views/courses/Booking-View.vue'),
  },
  {
    path: '/courses/booking-confirm',
    name: 'courses-booking-confirm',
    component: () => import('@/views/courses/BookingConfirm-View.vue'),
  },
  {
    path: '/courses/booking-payment',
    name: 'courses-booking-payment',
    component: () => import('@/views/courses/BookingPayment-View.vue'),
  },
  {
    path: '/courses/booking-success',
    name: 'courses-booking-success',
    component: () => import('@/views/courses/BookingSuccess-View.vue'),
  },
  {
    path: '/courses/booking-fail',
    name: 'courses-booking-fail',
    component: () => import('@/views/courses/BookingFail-View.vue'),
  },

  // 預約紀錄 / 評論
  {
    path: '/courses/booking-history',
    name: 'courses-booking-history',
    component: () => import('@/views/courses/BookingHistory-View.vue'),
  },
  {
    path: '/courses/review',
    name: 'courses-review',
    component: () => import('@/views/courses/Review-View.vue'),
  },

  /* =========================
   * 商城 Shop
   * ========================= */

  // 商品列表
  {
    path: '/shop/products',
    name: 'shop-products',
    component: () => import('@/views/shop/Shop-product.vue'),
  },

  // 商品詳細
  {
    path: '/shop/products/:id',
    name: 'shop-product-detail',
    component: () => import('@/views/shop/Shop-productDetail.vue'),
  },

  // 訂單列表
  {
    path: '/shop/orders',
    name: 'shop-orders',
    component: () => import('@/views/shop/Shop-order.vue'),
  },

  // 訂單詳細
  {
    path: '/shop/orders/:id',
    name: 'shop-order-detail',
    component: () => import('@/views/shop/Shop-orderDetail.vue'),
  },

  // 購物車
  {
    path: '/shop/cart',
    name: 'shop-cart',
    component: () => import('@/views/shop/Shop-cart.vue'),
  },

  // 商城預約
  {
    path: '/shop/booking',
    name: 'shop-booking',
    component: () => import('@/views/shop/Shop-Booking.vue'),
  },

  // 商城預約成功
  {
    path: '/shop/booking-success',
    name: 'shop-booking-success',
    component: () => import('@/views/shop/Shop-BookingSuccess.vue'),
  },

  /* =========================
   * 健康餐 Meals
   * ========================= */

  // 健康餐列表
  {
    path: '/meals',
    name: 'meals-list',
    component: () => import('@/views/meals/MealList-View.vue'),
  },

  // 健康餐詳細
  {
    path: '/meals/:mealId',
    name: 'meals-detail',
    component: () => import('@/views/meals/MealDetail-View.vue'),
  },

  // 健康餐購物車
  {
    path: '/meals/cart',
    name: 'meals-cart',
    component: () => import('@/views/meals/MealOrderList-View.vue'),
  },

  // 健康餐訂單確認
  {
    path: '/meals/confirm',
    name: 'meals-confirm',
    component: () => import('@/views/meals/MealOrderConfirm-View.vue'),
  },

  // 健康餐訂單結果
  {
    path: '/meals/result/:orderId',
    name: 'meals-result',
    component: () => import('@/views/meals/MealOrderResult-View.vue'),
  },

  // 健康餐訂單紀錄
  {
    path: '/users/order-history',
    name: 'meals-order-history',
    component: () => import('@/views/meals/MealOrderHistory-View.vue'),
  },

  // 健康餐訂單詳細
  {
    path: '/users/order/:orderId',
    name: 'meals-order-detail',
    component: () => import('@/views/meals/MealOrderDetail-View.vue'),
  },

  // 我喜愛的健康餐
  {
    path: '/users/favorite',
    name: 'meals-favorite',
    component: () => import('@/views/meals/MealFavorite-View.vue'),
  },

  /* =========================
   * 最新消息 / 內容 Post
   * ========================= */

  // 最新消息卡片
  {
    path: '/post',
    name: 'post-card',
    component: () => import('@/views/post/postCard.vue'),
  },

  // 最新消息列表
  {
    path: '/post/list',
    name: 'post-list',
    component: () => import('@/views/post/postList.vue'),
  },

  // 最新消息詳細
  {
    path: '/post/:id',
    name: 'post-detail',
    component: () => import('@/views/post/postDetail.vue'),
  },

  // 關於我們
  {
    path: '/about/:id',
    name: 'about',
    component: () => import('@/views/post/postAbout.vue'),
  },

  // 常見問題
  {
    path: '/faq',
    name: 'faq',
    component: () => import('@/views/post/postFaq.vue'),
  },

  // 門市地點
  {
    path: '/store',
    name: 'store',
    component: () => import('@/views/post/postStore.vue'),
  },

  // 客服回報
  {
    path: '/customer-service',
    name: 'customer-service',
    component: () => import('@/views/post/postcustomerService.vue'),
  },

  // 報名表
  {
    path: '/join/:id',
    name: 'join-form',
    component: () => import('@/views/post/postJoinForm.vue'),
  },

  // 部落格
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/post/postBlog.vue'),
  },

  // 部落格詳細
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('@/views/post/postBlogDetail.vue'),
  },

  // 找不到頁面
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/common/404-View.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
