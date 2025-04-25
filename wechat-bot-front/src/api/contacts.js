import request from './request'

// 获取用户联系人列表
export function fetchContacts(wxId) {
  return request({
    url: '/contacts/list',
    method: 'get',
    params: { wxId }
  })
}

// 更新联系人聊天模式
export function updateContactChatModel(cxId, chatModel) {
  return request({
    url: '/contacts/updateChatModel',
    method: 'post',
    data: { cxId, chatModel }
  })
}