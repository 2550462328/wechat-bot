import request from './request'

// 获取用户群组列表
export function fetchGroups(wxId) {
  return request({
    url: '/groups/list',
    method: 'get',
    params: { wxId }
  })
}

// 更新群组聊天模式
export function updateGroupChatModel(gxId, chatModel) {
  return request({
    url: '/groups/updateChatModel',
    method: 'post',
    data: { gxId, chatModel }
  })
}