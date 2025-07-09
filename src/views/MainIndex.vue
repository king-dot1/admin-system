<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTag from '@/components/CommonTag.vue'
</script>

<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 自定义左侧组件 -->
      <common-aside />
      <!-- 右侧内容 -->
      <el-container>
        <el-header class="el-header">
          <common-header />
        </el-header>
        <!-- Tag标签 -->
        <common-tag />
        <el-main class="right-main">
          <!-- 主要内容 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  background-color: #333;
}
</style>
