<template>
  <header class="header trans_300">
    <div class="top_nav">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="top_nav_left">新會員首購現折 $100 | 加入官方 LINE 預約專業教練體驗課</div>
          </div>
        </div>
      </div>
    </div>

    <div class="main_nav_container">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-12 d-flex justify-content-between align-items-center">
            <div class="logo_container">
              <router-link to="/" class="logo">
                <img :src="練吧logo" alt="練吧 Fitness Bar" class="logo-img" />
              </router-link>
            </div>




            <nav class="navbar d-flex align-items-center">
              <ul class="navbar_menu d-none d-lg-flex">
                <li><router-link to="/courses">課程專區</router-link></li>
                <li><router-link to="/shop/products">線上商城</router-link></li>
                <li><router-link to="/meals">健康餐購買</router-link></li>
                <li><router-link to="/postCard">資訊公告</router-link></li>
                <li><router-link to="/store">場地資訊</router-link></li>
                <li><router-link to="/faq">常見問題</router-link></li>
              </ul>

              <ul class="navbar_user d-flex align-items-center list-unstyled mb-0">
                <li>
                  <a href="#"><i class="fa fa-search" aria-hidden="true"></i></a>
                </li>

                <li class="account position-relative">
                  <a href="javascript:void(0)" @click.stop="toggleAccount" class="nav-icon-btn">
                    <i class="fa fa-user" aria-hidden="true"></i>
                    <span v-if="isLoggedIn" class="user-label">{{ userName }}</span>
                  </a>

                  <ul v-if="isAccountOpen" class="account_selection shadow">
                    <template v-if="!isLoggedIn">
                      <li><a href="javascript:void(0)" @click="handleLogin">假登入</a></li>
                      <li><router-link to="/users/login" @click="closeAccount">登入系統</router-link></li>
                      <li><router-link to="/users/forgot-password" @click="closeAccount">忘記密碼</router-link></li>
                      <li><router-link to="/users/register" @click="closeAccount">註冊帳號</router-link></li>
                    </template>

                    <template v-else>
                      <li class="user_info">{{ userName }} 您好</li>
                      <li>
                        <router-link to="/users/profile" class="dropdown-item-plain" @click="closeAccount">
                          <i class="bi bi-person-vcard me-2"></i>基本資料
                        </router-link>
                      </li>

                      <li>
                        <router-link to="/users/weight" class="dropdown-item-plain" @click="closeAccount">
                          <i class="bi bi-speedometer2 me-2"></i>體重紀錄
                        </router-link>
                      </li>

                      <li>
                        <router-link to="/users/diet" class="dropdown-item-plain" @click="closeAccount">
                          <i class="bi bi-egg-fried me-2"></i>飲食紀錄
                        </router-link>
                      </li>
                      <li>
                        <RouterLink class="dropdown-item-plain" to="/courses/booking-history" @click="closeAccount">
                          <i class="fa fa-calendar-check-o me-2"></i> 課程訂單
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink class="dropdown-item-plain" to="/users/order-history" @click="closeAccount">
                          <i class="fa fa-cutlery me-2"></i> 健康餐訂單
                        </RouterLink>
                      </li>
                      <li>
                        <RouterLink class="dropdown-item-plain" to="/shop/orders" @click="closeAccount">
                          <i class="fa fa-shopping-bag me-2"></i> 商品訂單
                        </RouterLink>
                      </li>
                      <li class="logout-border">
                        <a href="javascript:void(0)" @click="handleLogout" class="text-danger">登出</a>
                      </li>
                    </template>
                  </ul>
                </li>

                <li class="nav-item position-relative">
                  <a class="nav-icon-btn position-relative" @click.stop="toggleCart">
                    <i class="fa fa-shopping-cart"></i>
                  </a>

                  <ul v-if="isCartOpen" class="account_selection shadow" style="min-width: 180px">
                    <li class="user_info px-3 py-2" style="font-size: 13px; color: #888">
                      我的購物車
                    </li>
                    <li>
                      <RouterLink class="dropdown-item-plain" to="/meals/cart" @click="closeCart">
                        <i class="fa fa-cutlery me-2"></i> 健康餐購物車
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink class="dropdown-item-plain" to="/shop/cart" @click="closeCart">
                        <i class="fa fa-shopping-bag me-2"></i> 商城購物車
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>

              <div class="hamburger_container d-lg-none" @click="toggleMobileNav">
                <i class="fa fa-bars" aria-hidden="true"></i>
              </div>

              <div :class="['hamburger_menu', { active: isMobileNavOpen }]">
                <div class="hamburger_close" @click="toggleMobileNav">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </div>
                <ul class="hamburger_menu_content">
                  <li><router-link to="/">首頁</router-link></li>
                  <li><router-link to="/shop/products">線上商城</router-link></li>
                  <li><router-link to="/meals">健康餐購買</router-link></li>
                  <li><router-link to="/postCard">資訊公告</router-link></li>
                  <li><router-link to="/store">場地資訊</router-link></li>
                  <li><router-link to="/faq">常見問題</router-link></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import 練吧logo from '@/assets/練吧logo.png'

/* =====================
   基本狀態
===================== */
const router = useRouter()

const isMobileNavOpen = ref(false)
const isCartOpen = ref(false)
const isAccountOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('王小明')

/* =====================
   共用關閉
===================== */
const closeAll = () => {
  isCartOpen.value = false
  isAccountOpen.value = false
}

/* =====================
   Toggle（互斥）
===================== */
const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
  isAccountOpen.value = false
}

const toggleAccount = () => {
  isAccountOpen.value = !isAccountOpen.value
  isCartOpen.value = false
}

/* =====================
   單獨關閉
===================== */
const closeCart = () => {
  isCartOpen.value = false
}

const closeAccount = () => {
  isAccountOpen.value = false
}

/* =====================
   模擬登入 / 登出
===================== */
const handleLogin = () => {
  isLoggedIn.value = true
  closeAll()
  alert('模擬登入成功！')
}

const handleLogout = () => {
  isLoggedIn.value = false
  closeAll()
  alert('已登出')
  router.push('/')
}
</script>


<style scoped>
/* 舒服的背景顏色 */
.bg-light-green {
  background-color: #f1f3f2;
  color: #7a9d96;
}

.bg-light-tan {
  background-color: #f9f7f2;
  color: #d8cfbc;
}

/* 基礎結構 */
.header {
  position: sticky;
  top: 0;
  left: 0;
  padding: 12px 0;
  width: 100%;
  background: #ffffff;
  z-index: 1000;
  display: block;
  font-family: var(--nav-font), var(--default-font), sans-serif;
}

.top_nav {
  width: 100%;
  height: 50px;
  background: #1e1e27;
}

.top_nav_left {
  line-height: 50px;
  font-size: 13px;
  color: #b5aec4;
  text-transform: uppercase;
}

.user-greeting {
  font-weight: bold;
  color: #f38d00;
  /* 讓歡迎文字顯眼一點 */
  font-size: 13px;
  padding-bottom: 8px !important;
}

/* 主導覽列 */
.main_nav_container {
  width: 100%;
  padding: 12px 0;
  background: #ffffff;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.15);
}


.col-lg-12 {
  min-height: 130px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 130px;
  width: auto;
  max-height: none;
  object-fit: contain;
}


.logo_container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}



.logo_container a {
  font-size: 24px;
  color: #1e1e27;
  font-weight: 700;
  text-transform: uppercase;
}

.logo_container span {
  color: #f38d00;
}

/* 導航選單 */
.navbar_menu li a {
  padding: 0 15px;
  color: #1e1e27;
  text-transform: uppercase;
  font-weight: 500;
}

/* 購物車數字標籤精修 */
.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #fe4c50;
  /* 保留一點原本的亮眼色，或是改用 #7a9d96 */
  color: white;
  font-size: 10px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  /* 加個白邊會更有質感 */
  font-weight: 700;
}

/* 確保購物車選單與會員選單寬度、圓角一致 */
.account_selection {
  border: none !important;
  top: 55px !important;
  /* 與大 Icon 保持距離 */
}

/* 讓選單內的文字更有呼吸感 */
.dropdown-item-plain {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #555;
  font-size: 14px;
  transition: all 0.2s ease;
}

.dropdown-item-plain:hover {
  background-color: #f1f3f2;
  color: #7a9d96;
  padding-left: 25px;
  /* 絲滑的左移效果 */
}

/* 購物車特殊處理 */
.checkout {
  position: relative;
}

.checkout_items {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fe4c50;
  color: #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

/* ===== Icon 外層排列間距（推薦） ===== */
.nav-icons {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 🎯 放大外層 Icon 按鈕 */
.nav-icon-btn {
  color: #1e1e27 !important;
  min-height: 44px;
  /*  跟其他 icon 同高 */
  padding: 0 14px;
  /*  撐出長方形寬度 */
  background: #f5f5f7;
  display: inline-flex;
  /*  icon + 文字 水平排列 */
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  /*  膠囊型圓角 */
  gap: 8px;
  /*  icon 與文字距離 */
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

/* Icon 本體 */
.nav-icon-btn i {
  font-size: 18px;
  /* ✔ 跟搜尋、購物車一致 */
  line-height: 1;
}

/* 使用者名稱 */
.user-label {
  font-size: 13px;
  margin-left: 12px;
  /* ⭐ 稍微再拉開一點 */
  white-space: nowrap;
  color: #1e1e27;
  font-weight: 500;
}

/* Hover 效果 */
.nav-icon-btn:hover {
  background: #e8e8ea;
  transform: scale(1.05);
}

/* ===== 下拉選單 ===== */
.account_selection {
  position: absolute;
  top: 55px;
  right: 0;
  min-width: 200px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 1001;
}

/* 下拉選單文字（深色） */
.account_selection li a {
  width: 100% !important;
  padding: 12px 20px !important;
  display: block !important;
  text-align: left !important;
  font-size: 14px;
  color: #1e1e27 !important;
}

.account_selection li a:hover {
  background-color: #f5f5f7;
  color: #1e1e27 !important;
}




/* =====  強制 header icon 顏色 ===== */
.header a,
.header i,
.header svg {
  color: #1e1e27 !important;
  fill: #1e1e27 !important;
}

/* =====  icon 之間不要擠 ===== */
.header ul li {
  margin-left: 16px;
}

/* =====  icon 點擊區域放大 ===== */
.header ul li a {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

/* 預設隱藏手機版選單 */
.hamburger_menu {
  position: fixed;
  top: 0;
  right: -100%;
  /* 藏在右邊螢幕外 */
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  z-index: 1002;
  transition: all 0.4s ease;
}

/* 當 active 為真時，選單滑入 */
.hamburger_menu.active {
  right: 0;
}

/* 漢堡圖標本身的手感 */
.hamburger_container {
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #1e1e27;
}

.hamburger_container:hover {
  color: #7a9d96;
  /* 換成你的主題森林綠 */
}


@media (max-width: 768px) {
  .logo-img {
    height: 58px;
  }
}

@media (max-width: 1200px) {
  .navbar_menu {
    display: none !important;
  }

  .hamburger_container {
    display: flex !important;
  }
}

@media (min-width: 1201px) {
  .navbar_menu {
    display: flex !important;
  }

  .hamburger_container {
    display: none !important;
  }
}

html {
  --s: 291px;
  /* control the size*/
  --c1: #f5f5f5;
  --c2: #f9dbc3;

  --g: #0000 45%, var(--c1) 46% 54%, #0000 55%;
  background:
    linear-gradient(60deg, var(--g)),
    linear-gradient(-60deg, var(--g)) var(--c2);
  background-size: var(--s) calc(tan(60deg)*var(--s));
}
</style>
