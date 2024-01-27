import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '@/pages/ChatView.vue'
import LoginView from '@/components/login/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/chat',
    name:'chat',
    component:ChatView
  },{
    path: '/login',
    name: 'login',
    component: LoginView
  },{
    path: '/',
    name: '/',
    redirect: '/chat'
  }]
})

export default router
