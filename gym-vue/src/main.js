import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css' // 這是讓左右箭頭出現的關鍵
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // 這是讓輪播能動的關鍵

import 'bootstrap'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')