import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import lazyPlugin from 'vue3-lazy'
import 'normalize.css'
import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'

createApp(App).use(ElementPlus).use(lazyPlugin, {
    loading: require('@/assets/image/common/loading.gif'),
    error: ''
}).use(store).use(router).mount('#app')
