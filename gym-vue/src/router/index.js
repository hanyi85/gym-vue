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
    component: () => import('@/views/users/auth/UserLogin.vue'),
  },

  // 會員註冊
  {
    path: '/users/register',
    name: 'user-register',
    component: () => import('@/views/users/register/UserRegister.vue'),
  },
// 會員首頁
   {
    path: '/users/home',
    name: 'user-home',
    component: () => import('@/views/users/UserHome.vue'),
  },

  // 會員註冊基本資料
  {
    path: '/users/profile',
    name: 'user-profile',
    component: () => import('@/views/users/register/RegisterStepBasic.vue'),
  },

   {
    path: '/users/verify-email',
    name: 'user-verify-Email',
    component: () => import('@/views/users/register/RegisterStepVerify.vue'),
  }, 
  //舊用戶信箱驗證
  {
    path: '/users/EmailNotice',
    name: 'user-Email-Notice',
    component: () => import('@/views/users/VerifyEmailNotice.vue'),
  },

  // 會員健康資訊
  {
    path: '/users/profile-health',
    name: 'user-profile-health',
    component: () => import('@/views/users/register/RegisterStepHealth.vue'),
  },
  // 會員註冊完成
     {
    path: '/users/profile-finished',
    name: 'user-profile-finished',
    component: () => import('@/views/users/register/RegisterComplete.vue'),
  },
  {
  path: "/line-callback",
  component: () => import("@/views/users/auth/UserLogin-LineCallback.vue")
},
 {
  path: "/users/line-register",
  component: () => import("@/views/users/register/LineRegister.vue")
},
  // 忘記密碼
  {
    path: '/users/forgot-password',
    name: 'user-forgot-password',
    component: () => import('@/views/users/auth/UserForgotPassword.vue'),
  },
//重設密碼
  {
  path: '/reset-password',
  name: 'ResetPassword',
  component: () => import('@/views/users/auth/UserResetPassword.vue')
},

    {
    path: '/users/profile-edit',
    name: 'user-profile-edit',
    component: () => import('@/views/users/UserProfileEdit.vue'),
  },
  // 體重紀錄
    {
    path: '/users/weight-records',
    name: 'user-weight-record',
    component: () => import('@/views/users/weight/UserWeightRecords.vue'),
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

// 教練詳細
{
  path: '/courses/coach-detail/:id',
  name: 'courses-coach-detail',
  component: () => import('@/views/courses/CoachDetail-View.vue'),
},

//  預約流
{
  path: '/courses/:slug/booking',
  name: 'courses-booking',
  component: () => import('@/views/courses/Booking-View.vue'),
},
{
  path: '/courses/:slug/booking/confirm/:scheduleId',
  name: 'courses-booking-confirm',
  component: () => import('@/views/courses/BookingConfirm-View.vue'),
},
{
  path: '/courses/:slug/booking/payment/:scheduleId',
  name: 'courses-booking-payment',
  component: () => import('@/views/courses/BookingPayment-View.vue'),
},
{
  path: '/courses/:slug/booking/payment/by-booking/:bookingId',
  name: 'courses-booking-payment-by-booking',
  component: () => import('@/views/courses/BookingPayment-View.vue'),
},
{
  path: '/courses/booking-success',
  name: 'courses-booking-success',
  component: () => import('@/views/courses/BookingSuccess-View.vue'),

},
{
  path: '/courses/:slug/booking/fail',
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
{
  path: '/courses/review-success',
  name: 'courses-review-success',
  component: () => import('@/views/courses/ReviewSuccess-View.vue'),
},

// demo
{
  path: '/counter/demo',
  name: 'CounterDemo',
  component: () => import('@/views/courses/CounterScan-View.vue'),
},

// 場館內課程列表
{
  path: '/courses/:city/:venue',
  name: 'courses-list',
  component: () => import('@/views/courses/CourseList-View.vue'),
},

// 課程詳細（最寬鬆，放最後避免吃掉其他路由）
{
  path: '/courses/:slug',
  name: 'courses-detail',
  component: () => import('@/views/courses/CourseDetail-View.vue'),
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

  // 健康餐員工取餐QRCODE
  {
    path: '/staff/meal-pickup',
    name: 'meal-staff-pickup',
    component: () => import('@/views/meals/MealPickup-View.vue'),
  },

  // 取餐QRcode
  {
    path: '/users/meal-qrcode',
    name: 'meals-qrcode',
    component: () => import('@/views/meals/MealQrCode-View.vue'),
  },

  /* =========================
   * 最新消息 / 內容 Post
   * ========================= */

  // 最新消息卡片
  {
    path: '/post/card',
    name: 'postCard',
    component: () => import('@/views/post/postCard.vue'),
  },

  // 最新消息列表
  {
    path: '/post/list',
    name: 'postList',
    component: () => import('@/views/post/postList.vue'),
  },

  // 最新消息詳細
  {
    path: '/post/postDetail/:id',
    name: 'postDetail',
    component: () => import('@/views/post/postDetail.vue'),
  },

  // 關於我們
  {
    path: '/post/about/:id',
    name: 'about',
    component: () => import('@/views/post/postAbout.vue'),
  },

  // 常見問題
  {
    path: '/post/faq',
    name: 'faq',
    component: () => import('@/views/post/postFaq.vue'),
  },

  // 門市地點
  {
    path: '/post/store',
    name: 'store',
    component: () => import('@/views/post/postStore.vue'),
  },

  // 客服回報
  {
    path: '/post/customer-service',
    name: 'customerService',
    component: () => import('@/views/post/postcustomerService.vue'),
  },

  // 報名表
  {
    path: '/post/join/:id',
    name: 'joinForm',
    component: () => import('@/views/post/postJoinForm.vue'),
  },

  // 部落格
  {
    path: '/post/blog',
    name: 'blog',
    component: () => import('@/views/post/postBlog.vue'),
  },

  // 部落格詳細
  {
    path: '/post/blog/:id',
    name: 'blogDetail',
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

  scrollBehavior(to, from, savedPosition) {
    // 瀏覽器上一頁 / 下一頁
    if (savedPosition) {
      return savedPosition
    }

    // 其他情況（router.push / router-link）
    return { top: 0 }
  },
})


export default router
