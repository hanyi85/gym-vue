import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Banner from './components/banner.vue'
import Btn from './components/btn.vue'
import vue3GoogleLogin from 'vue3-google-login'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css' // 這是讓左右箭頭出現的關鍵
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 這是讓輪播能動的關鍵

import 'bootstrap'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
  clientId:'874375293354-0e80b54jna35e184l0irr7pb7eq3be25.apps.googleusercontent.com'
})
app.mount('#app')
app.component('Banner', Banner)
app.component('Btn', Btn)