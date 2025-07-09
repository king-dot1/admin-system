<script setup>
import { computed } from 'vue'
import { useAllDataStore } from '@/stores'
// 引入路由
import { useRoute, useRouter } from 'vue-router'
// 获取当前路由
const route = useRoute()
const router = useRouter()
const store = useAllDataStore()
const tags = computed(() => store.state.tags)

// 点击 Tag
const handleMenu = (tag) => {
  // 跳转到点击的页面
  router.push(tag.path)
}
// 关闭 Tag
const handleClose = (tag, index) => {
  store.delTag(tag)
  // 1. 关闭不是当前页面的，直接关闭
  if (tag.name !== route.name) return
  // 2. 关闭当前页面的
  // 2.1 当前是最后一个，跳转为最后
  // 2.2 当前不是最后，跳转为当前
  if (index === store.state.tags.length) {
    router.push(tags.value[index - 1].path)
  } else {
    router.push(tags.value[index].path)
  }
  // router.back()
}
</script>

<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
.tags {
  margin: 20px 0 0 20px;
  .el-tag {
    margin-right: 10px;
  }
}
</style>
