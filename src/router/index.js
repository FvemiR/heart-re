import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/mental-test',
      name: 'MentalTest',
      component: () => import('../views/MentalTestView.vue')
    },
    {
      path: '/community',
      name: 'Community',
      component: () => import('../views/CommunityView.vue')
    },
    {
      path: '/knowledge',
      name: 'Knowledge',
      component: () => import('../views/KnowledgeView.vue')
    },
    {
      path: '/ai-counseling',
      name: 'AICounseling',
      component: () => import('../views/AICounselingView.vue')
    },
    {
      path: '/mood-diary',
      name: 'MoodDiary',
      component: () => import('../views/MoodDiaryView.vue')
    },
    {
      path: '/Home',
      name: 'Home',
      component: () => import('../views/Homeview.vue')
    },
    {
      path: '/',
      redirect: '/Home' // 关键配置：将根路径重定向到/Home
    },
    {
      path:'/register',
      name:'register',
      component: ()=> import('../views/RegisterView.vue')
    },
  ],
})

export default router
