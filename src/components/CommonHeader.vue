<script setup>
import { computed } from 'vue'
import { useAllDataStore } from '@/stores'

const store = useAllDataStore()
const handleCollapse = () => {
  store.state.isCollapse = !store.state.isCollapse
}

// 退出登录
const handleLogout = () => {
  store.logout()
}

// 面包屑
const current = computed(() => store.state.currenMenu)

// 获取用户信息
const userInfo = computed(() => store.state.userInfo)
const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
// 默认头像
import activeDefault from '@/assets/images/user-default.png'
</script>

<template>
  <div class="header">
    <!-- 左侧区域 -->
    <div class="l-content">
      <!-- 点击按钮事件控制菜单组件的收缩 -->
      <el-button size="small" @click="handleCollapse">
        <!-- 如表展示，动态组件来展示 -->
        <!-- <component class="icons" is="menu"></component> -->
        <el-icon><Menu /></el-icon>
      </el-button>

      <el-breadcrumb separator="/" class="bread">
        <!-- 首页是一定存在，直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }"> 首页 </el-breadcrumb-item>
        <el-breadcrumb-item v-if="current" :to="current.path">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧头像 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- 定义一个URL对象地址，这里是传入图片名称 -->
          <img
            :src="getImageUrl(userInfo?.avatar || activeDefault)"
            class="user"
          />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #333;
}
.icons {
  width: 20px;
  height: 20px;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}

:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}

// 面包屑默认加粗取消掉
:deep(.el-breadcrumb__inner.is-link) {
  font-weight: 400 !important;
}
</style>
