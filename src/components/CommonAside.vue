<script setup>
import { computed } from 'vue'
import { useAllDataStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

// const list = ref([
//   {
//     path: '/home',
//     name: 'home',
//     label: '首页',
//     icon: 'house',
//     url: 'Home'
//   },
//   {
//     path: '/mall',
//     name: 'mall',
//     label: '商品管理',
//     icon: 'video-play',
//     url: 'Mall'
//   },
//   {
//     path: '/user',
//     name: 'user',
//     label: '用户管理',
//     icon: 'user',
//     url: 'User'
//   },
//   {
//     path: 'other',
//     label: '其他',
//     icon: 'location',
//     children: [
//       {
//         path: '/page1',
//         name: 'page1',
//         label: '页面1',
//         icon: 'setting',
//         url: 'Page1'
//       },
//       {
//         path: '/page2',
//         name: 'page2',
//         label: '页面2',
//         icon: 'setting',
//         url: 'Page2'
//       }
//     ]
//   }
// ])
const store = useAllDataStore()

const list = computed(() => store.state.menuList)

const onChildren = computed(() => list.value.filter((item) => !item.children))
const hasChildren = computed(() => list.value.filter((item) => item.children))

const isCollapse = computed(() => store.state.isCollapse)
const width = computed(() => (store.state.isCollapse ? '64px' : '180px'))
const router = useRouter() // 路由
const route = useRoute() // 获取当前路由
// 点击菜单
const handleMenu = (item) => {
  // 添加 tag 标签
  store.addTag(item)
  // 路由跳转
  router.push(item.path)
}
// 默认选选中
const activeMenu = computed(() => route.path)
</script>

<template>
  <el-aside :width="width">
    <el-menu
      :default-active="activeMenu"
      background-color="#545c64"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>
      <el-menu-item
        v-for="item in onChildren"
        :key="item.path"
        :index="item.path"
        @click="handleMenu(item)"
      >
        <component class="icons" :is="item.icon" />
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        v-for="item in hasChildren"
        :key="item.path"
        :index="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon" />
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="subItem in item.children"
            :key="subItem.path"
            :index="subItem.path"
            @click="handleMenu(subItem)"
          >
            <component class="icons" :is="subItem.icon" />
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    text-align: center;
    color: #fff;
  }
}
.el-aside {
  height: 100%;
  background-color: #545c64;
}
</style>
