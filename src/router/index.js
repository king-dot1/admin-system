import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [
  {
    path: '/',
    name: 'main',
    redirect: '/login',
    component: () => import('@/views/MainIndex.vue')
    // children: [
    //   {
    //     path: 'home',
    //     name: 'home',
    //     component: () => import('@/views/HomeIndex.vue')
    //   },
    //   {
    //     path: 'user',
    //     name: 'user',
    //     component: () => import('@/views/UserIndex.vue')
    //   },
    //   {
    //     path: 'mall',
    //     name: 'mall',
    //     component: () => import('@/views/MallIndex.vue')
    //   }
    // ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginIndex.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导出路由
export default router
