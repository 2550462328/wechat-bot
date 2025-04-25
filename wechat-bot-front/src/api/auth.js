import request from './request'

// 微信登录
export function login(code) {
  return request({
    url: '/auth/wxLogin',
    method: 'post',
    data: { code }
  })
}

// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取微信登录二维码
export function getWxQrCode() {
  return request({
    url: '/auth/wxQrCode',
    method: 'get'
  })
}