

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from'axios'
import AMapLoader from '@amap/amap-jsapi-loader';
import qs from 'qs'
const app = createApp(App)
// 设置 Axios 的基础 URL
axios.defaults.baseURL = 'http://154.9.253.102:8000'

// 将 Axios 挂载到全局属性上，方便在组件中使用
app.config.globalProperties.$axios = axios
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')

