/**
 * 数据模型定义
 */

// 微信用户
export class WxUser {
  constructor(data = {}) {
    this.userName = data.userName || ''  // 用户名称
    this.wxId = data.wxId || ''         // 微信用户id
    this.openId = data.openId || ''     // 微信用户openId
  }
}

// 联系人
export class Contact {
  constructor(data = {}) {
    this.contactName = data.contactName || ''  // 联系人名称
    this.wxId = data.wxId || ''               // 绑定微信用户id
    this.cxId = data.cxId || ''               // 联系人微信用户id
    this.chatModel = data.chatModel || 1       // 聊天模式(1:关键字 2:知识库 3:大模型)
  }
}

// 群组
export class Group {
  constructor(data = {}) {
    this.contactName = data.contactName || ''  // 群组名称
    this.wxId = data.wxId || ''               // 绑定微信用户id
    this.gxId = data.gxId || ''               // 群组微信id
    this.chatModel = data.chatModel || 1       // 聊天模式(1:关键字 2:知识库 3:大模型)
  }
}

// 聊天模式枚举
export const ChatModelEnum = {
  KEYWORD: 1,    // 关键字模式
  KNOWLEDGE: 2,  // 知识库模式
  AI_MODEL: 3    // 大模型模式
}

// 根据值获取聊天模式名称
export function getChatModelName(model) {
  switch (model) {
    case ChatModelEnum.KEYWORD:
      return '关键字模式'
    case ChatModelEnum.KNOWLEDGE:
      return '知识库模式'
    case ChatModelEnum.AI_MODEL:
      return '大模型模式'
    default:
      return '未知模式'
  }
}

// 根据值获取聊天模式类型（用于Element UI的Tag类型）
export function getChatModelType(model) {
  switch (model) {
    case ChatModelEnum.KEYWORD:
      return 'info'
    case ChatModelEnum.KNOWLEDGE:
      return 'success'
    case ChatModelEnum.AI_MODEL:
      return 'warning'
    default:
      return 'info'
  }
}