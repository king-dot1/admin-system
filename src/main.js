import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/less/index.less'
import router from './router'
import { createPinia } from 'pinia'

// 全都引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 注册所有 Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 开发环境启动 mock
if (import.meta.env.MODE === 'development') {
  // console.log('开发环境')
  import('./mock/index.js') // 动态导入 Mock 配置
}

import { useAllDataStore } from './stores/index'

// 路由守卫
router.beforeEach((to) => {
  // 1. 没有 token，跳转登录页
  const token = store.state.token
  if (to.path !== '/login' && !token) return { name: 'login' }
  // 2. 有 token, 如果访问的是登录页，跳转主页
  if (token && to.name === 'login') return { name: 'home' }
  // 3. 有 token, 如果访问的页面不存在，跳转 404
  // hasRoute 判断路由是否存在；参数：name ==》路由名称
  if (token && !router.hasRoute(to.name)) return { name: '404', replace: true }
  return true
})

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
const store = useAllDataStore()
store.init()
app.use(router).mount('#app')
