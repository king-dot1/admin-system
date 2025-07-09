import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import router from '@/router'

function initState() {
  return {
    isCollapse: false,
    // tag 标签
    tags: [{ path: '/home', name: 'home', label: '首页', icon: 'home' }],
    // 登录信息
    menuList: [],
    token: '',
    routeList: [],
    // 当前菜单
    currenMenu: null,
    // 用户信息
    userInfo: {
      name: 'Admin',
      role: '超级管理员',
      avatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  }
}

export const useAllDataStore = defineStore('AllData', () => {
  // ref() => state
  // computed() => getters
  // function() => actions
  const state = ref(initState())

  // 添加 tag 标签
  const addTag = (tag) => {
    if (tag.name === 'home') {
      state.value.currenMenu = null
      return
    }
    state.value.currenMenu = tag
    // 判断是否存在
    const tagIndex = state.value.tags.findIndex(
      (item) => item.name === tag.name
    )
    if (tagIndex === -1) {
      state.value.tags.push(tag)
    }
  }

  // 删除 tag 标签
  const delTag = (tag) => {
    // 判断是否存在
    const tagIndex = state.value.tags.findIndex(
      (item) => item.name === tag.name
    )
    if (tagIndex !== -1) {
      state.value.tags.splice(tagIndex, 1)
    }
  }

  // 更新登录信息
  const updateInfo = (list, token, userInfo) => {
    state.value.menuList = list
    state.value.token = token
    state.value.userInfo = userInfo
  }

  // 动态添加路由
  const addMenu = (router) => {
    const menu = state.value.menuList
    const routeArr = formatRoutes(menu)
    state.value.routeList = routeArr

    // 处理动态路由
    router.getRoutes().forEach((item) => {
      if (item.name === 'main' || item.name === 'login' || item.name === '404')
        return
      router.removeRoute(item.name)
    })

    // 动态添加路由
    routeArr.forEach((item) => {
      router.addRoute('main', item)
    })
  }
  // 格式化路由
  const formatRoutes = (menu) => {
    const routeArr = []
    menu.forEach((item) => {
      item.component = () => import(`../views/${item.url}.vue`)
      // 处理子路由
      if (item.children && item.children.length > 0) {
        item.children = formatRoutes(item.children)
      }
      routeArr.push(item)
    })
    return routeArr
  }

  // 监听 state 变化，实现本地存储
  watch(
    state,
    (newState) => {
      // 变化后 token 不存在，说明已经退出；不需要持久化
      if (!newState.token) return
      localStorage.setItem('state', JSON.stringify(newState))
    },
    { deep: true }
  )

  // 刷新页面后，从本地获取数据
  const init = () => {
    if (localStorage.getItem('state')) {
      state.value = JSON.parse(localStorage.getItem('state'))
      //routeList保存的函数，存储的时候不能解析，其中的值就是null，这里重新赋值[]
      state.value.routeList = []
      // 刷新页面后，重新获取路由
      addMenu(router)
    }
  }

  // 退出
  const logout = () => {
    // 清除本地存储
    localStorage.removeItem('state')
    // 清除 state 数据
    state.value = initState()
    // 跳转到登录页
    router.push('/login')
  }
  return {
    state,
    addTag,
    delTag,
    updateInfo,
    addMenu,
    init,
    logout
  }
})
