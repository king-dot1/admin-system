// 封装 axios
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量中获取
  timeout: 5000 // 超时时间
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data
    // 判断响应状态码
    if (code === 200) {
      return data
    } else {
      ElMessage({
        message: msg ? msg : data.message || '网络错误',
        type: 'error'
      })
      return Promise.reject(msg ? msg : data.message || '网络错误')
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 导出
export default instance
