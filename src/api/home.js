// 引入axios；首页 api 模块
import request from '@/utils/request'

// 获取表格数据
export const homeTableDataService = () => request.get('/api/home/getTableData')

// 获取统计数据
export const homeCountDataService = () => request.get('/api/home/getCountData')

// 获取折线图数据
export const homeChartDataService = () => request.get('/api/home/getChartData')
