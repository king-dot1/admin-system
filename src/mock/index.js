// 引入mock
import Mock from 'mockjs'
import home from './mockData/home'
import user from './mockData/user'
import login from './mockData/login'

// 拦截请求
Mock.mock(/api\/home\/getTableData/, 'get', home.getTableData)

// 首页 统计数据
Mock.mock(/api\/home\/getCountData/, 'get', home.getCountData)

// 首页 折线图数据
Mock.mock(/api\/home\/getChartData/, 'get', home.getChartData)

// 用户管理 获取用户数据
Mock.mock(/api\/user\/getUserData/, 'get', user.getUserList)

// 用户管理 删除用户
Mock.mock(/api\/user\/deleteUser/, 'get', user.deleteUser)

// 用户管理 增加用户
Mock.mock(/api\/user\/createUser/, 'post', user.createUser)

// 用户管理 更新用户
Mock.mock(/api\/user\/updateUser/, 'post', user.updateUser)

// 登录
Mock.mock(/api\/login/, 'post', login.getMenu)
