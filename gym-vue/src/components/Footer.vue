<template>
  <footer id="footer" class="footer">
    <div class="footer-top">
      <div class="container">
        <div class="row gy-4">
          
          <div class="col-lg-4 col-md-6 footer-about">
            <router-link to="/" class="logo d-flex align-items-center mb-3">
              <span class="sitename">練吧 <small>Fitness bar</small></span>
            </router-link>
            <div class="footer-contact">
              <p>台南市安南區安南路一段 88 號</p>
              <p>台南市, 709 台灣</p>
              <p class="mt-4"><strong>Phone:</strong> <span>+886 6 123 4567</span></p>
              <p><strong>Email:</strong> <span>info@Fitnessbar.com</span></p>
            </div>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Useful Links</h4>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Our Services</h4>
            <ul>
              <li><a href="#">一對一私人教練</a></li>
              <li><a href="#">團體燃脂課程</a></li>
              <li><a href="#">空中瑜珈教學</a></li>
              <li><a href="#">銀髮族體能發展</a></li>
              <li><a href="#">營養膳食規劃</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Community</h4>
            <ul>
              <li><a href="#">學員見證</a></li>
              <li><a href="#">教練團隊</a></li>
              <li><a href="#">場館設施</a></li>
              <li><a href="#">合作夥伴</a></li>
              <li><a href="#">加入我們</a></li>
            </ul>
          </div>

          <div class="col-lg-2 col-md-3 footer-links">
            <h4>Support</h4>
            <ul>
              <li><a href="#">常見問題</a></li>
              <li><a href="#">收費標準</a></li>
              <li><a href="#">預約流程</a></li>
              <li><a href="#">退費說明</a></li>
              <li><a href="#">聯絡我們</a></li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <div class="copyright-bar">
      <div class="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
        <div class="copyright-content">
          <p>© Copyright <strong><span>練吧 Fitness bar</span></strong>. All Rights Reserved</p>
          <div class="credits">
            Designed by <a href="#">YourTeam</a> Distributed by <a href="#">Fitness bar</a>
          </div>
        </div>

        <div class="social-links mt-3 mt-lg-0">
          <a href="#"><i class="bi bi-twitter-x"></i></a>
          <a href="#"><i class="bi bi-facebook"></i></a>
          <a href="#"><i class="bi bi-instagram"></i></a>
          <a href="#"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 核心背景：極致深黑 */
.footer {
  background-color: #0d0d0d !important;
  color: #ffffff;
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-top {
  background-color: #0d0d0d !important;
  padding: 60px 0 30px;
}

/* 移除 Logo 的底線 */
.logo {
  text-decoration: none !important; /* 強制消除底線 */
  display: inline-flex;
  align-items: center;
}

.sitename {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff; /* 確保字體是純白，不被超連結顏色覆蓋 */
  text-decoration: none !important;
}

.sitename small {
  color: #28a745; 
  font-size: 14px;
  margin-left: 5px;
  text-decoration: none !important;
}

/* 標題與短綠線 */
h4 {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  position: relative;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 20px;
  background-color: #28a745;
}

/* 列表連結消除底線 */
.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links ul li {
  padding: 8px 0;
}

.footer-links ul li a {
  color: #dbdbdb;
  text-decoration: none !important; /* 確保所有連結都沒有底線 */
  transition: 0.3s;
  font-size: 14px;
}

.footer-links ul li a:hover {
  color: #28a745;
  text-decoration: none !important;
}

/* 版權條 */
.copyright-bar {
  background-color: #080808 !important;
  padding: 25px 0;
  border-top: 1px solid #1a1a1a;
}

/* 消除版權條內連結底線 */
.credits a {
  text-decoration: none !important;
  color: #28a745;
}

/* 社群方框按鈕 */
.social-links a {
  text-decoration: none !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: #1a1a1a;
  color: #888;
  margin-left: 10px;
  border-radius: 4px;
}

.social-links a:hover {
  background: #28a745;
  color: #fff;
}
</style>