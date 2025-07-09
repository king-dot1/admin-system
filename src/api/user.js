// 用户管理 api 模块
import request from '@/utils/request'

// 获取 用户管理数据
export const getUserData = (params) =>
  request.get('/api/user/getUserData', { params })

// 删除
export const deleteUser = (id) =>
  request.get('/api/user/deleteUser/', { params: { id } })

// 新增
export const createUser = (data) => request.post('/api/user/createUser/', data)

// 更新
export const updateUser = (data) => request.post('/api/user/updateUser/', data)
