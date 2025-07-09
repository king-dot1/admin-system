<script setup>
import { ref, reactive, computed } from 'vue'
import * as echarts from 'echarts'
import {
  homeTableDataService,
  homeCountDataService,
  homeChartDataService
} from '@/api/home'

//这个tableData是假数据，等会我们使用axios请求mock数据
const tableData = ref([])
const countData = ref([])

const tableLabel = ref({
  name: '课程',
  todayBuy: '今日购买',
  monthBuy: '本月购买',
  totalBuy: '总购买'
})

// 这个是折线图和柱状图 两个图表共用的公共配置
const xOptions = reactive({
  // 图例文字颜色
  textStyle: {
    color: '#333'
  },
  // 图列
  legend: {},
  // 网格
  grid: {
    left: '20%'
  },
  // 提示框
  tooltip: {
    trigger: 'axis'
  },
  // x轴
  xAxis: {
    type: 'category', // 类目轴
    data: [],
    axisLine: {
      lineStyle: {
        color: '#17b3a3'
      }
    },
    // x轴文字
    axisLabel: {
      interval: 0,
      color: '#333'
    }
  },
  // y轴
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#17b3a3'
        }
      }
    }
  ],
  // 折线图颜色
  color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3'],
  series: []
})

const pieOptions = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {},
  color: [
    '#0f78f4',
    '#dd536b',
    '#9462e5',
    '#a6a6a6',
    '#e1bb22',
    '#39c362',
    '#3ed1cf'
  ],
  series: []
})

const getTableData = async () => {
  const res = await homeTableDataService()
  tableData.value = res.tableData
}
getTableData()

const getCountData = async () => {
  const res = await homeCountDataService()
  countData.value = res
}
getCountData()

// 折线图数据
const lineChart = ref(null)
const barChart = ref(null)
const pieChart = ref(null)
// 接收观察器实例对象
const observer = ref(null)

const getChartData = async () => {
  const { orderData, videoData, userData } = await homeChartDataService()

  // 折线图
  xOptions.xAxis.data = orderData.date
  xOptions.series = Object.keys(orderData.data[0]).map((key) => ({
    name: key,
    data: orderData.data.map((item) => item[key]),
    type: 'line'
  }))
  const oneEchart = echarts.init(lineChart.value)
  oneEchart.setOption(xOptions)

  // 柱状图
  xOptions.xAxis.data = userData.map((item) => item.date)
  xOptions.series = [
    {
      name: '新增用户',
      data: userData.map((item) => item.new),
      type: 'bar'
    },
    {
      name: '活跃用户',
      data: userData.map((item) => item.active),
      type: 'bar'
    }
  ]
  const barEchart = echarts.init(barChart.value)
  barEchart.setOption(xOptions)

  // 饼图
  pieOptions.series = [
    {
      type: 'pie',
      data: videoData
    }
  ]
  const pieEchart = echarts.init(pieChart.value)
  pieEchart.setOption(pieOptions)

  // ResizeObserver 如果监视的容器大小变化，就会调用回调函数
  observer.value = new ResizeObserver(() => {
    // resize 方法可以重新设置图表的大小
    oneEchart.resize()
    barEchart.resize()
    pieEchart.resize()
  })
  // 如果容器存在
  if (lineChart.value) {
    // 则调用监视器的 observe 方法，监视这个容器的大小
    observer.value.observe(lineChart.value)
  }
}
getChartData()

// 获取用户信息
import { useAllDataStore } from '@/stores'
const store = useAllDataStore()
const userInfo = computed(() => store.state.userInfo)

const getImageUrl = (url) => {
  return new URL(url, import.meta.url).href
}
// 默认头像
import activeDefault from '@/assets/images/user-default.png'
</script>

<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <!-- <img :src="userInfo?.avatar || activeDefault" /> -->
          <img :src="getImageUrl(userInfo?.avatar || activeDefault)" />

          <div class="user-info">
            <p class="user-info-name">{{ userInfo?.name || 'Admin' }}</p>
            <p class="user-info-role">{{ userInfo?.role || '超级管理员' }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2023-01-01</span></p>
          <p>上次登录地点：<span>北京</span></p>
        </div>
      </el-card>

      <!-- 表格 -->
      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(item, key) in tableLabel"
            :key="item"
            :label="item"
            :prop="key"
          ></el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <!-- 统计卡片 -->
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          shadow="hover"
          :body-style="{ display: 'flex', padding: '0' }"
          v-for="item in countData"
          :key="item.name"
        >
          <component
            :is="item.icon"
            class="icons"
            :style="{ background: item.color }"
          />
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 折线图 -->
      <el-card shadow="hover" class="top-echarts">
        <div ref="lineChart" style="height: 280px"></div>
      </el-card>

      <!-- 柱状图 和 饼图 -->
      <div class="graph">
        <el-card shadow="hover" class="l-echarts">
          <div ref="barChart" style="height: 240px"></div>
        </el-card>
        <el-card shadow="hover" class="r-echarts">
          <div ref="pieChart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    padding-bottom: 20px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 40px;
      }
      .user-info-name {
        font-size: 35px;
      }
      .user-info-role {
        color: #999;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .user-table {
    margin-top: 20px;
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }
    .icons {
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      font-size: 30px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .num {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 15px;
        text-align: center;
        color: #999;
      }
    }
  }
  .graph {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .el-card {
      width: 48%;
      height: 260px;
    }
  }
}
</style>
