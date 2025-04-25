import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: '/api/', // Updated to use the proxied path
  timeout: 15000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = store.getters['user/token']
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应状态码不是200或成功状态，则为错误
    if (res.code !== 200 && res.code !== 0) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5000
      })
      
      // 401: token过期或未登录
      if (res.code === 401) {
        store.dispatch('user/logoutUser').then(() => {
          router.push('/login')
        })
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('Response error:', error)
    
    // 处理HTTP状态码错误
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          store.dispatch('user/logoutUser').then(() => {
            router.push('/login')
          })
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误 ${error.response.status}`
      }
    } else {
      message = '网络连接异常，请检查您的网络'
    }
    
    Message({
      message: message,
      type: 'error',
      duration: 5000
    })
    
    return Promise.reject(error)
  }
)

export default service