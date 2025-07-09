// 登录模块 api
import request from '@/utils/request'

// 登录
export const login = (data) => request.post('/api/login', data)
