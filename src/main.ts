import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/theme/global.less'
import '@/theme/element-overrid.less'
import '@/theme/animation.less'
import "highlight.js/styles/github-dark.css";

const app = createApp(App).use(ElementPlus)

app.use(router)

app.mount('#app')
