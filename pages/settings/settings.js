// pages/settings/settings.js
const app = getApp()

Page({
  data: {
    elderMode: false,
    version: '1.0.0'
  },

  onLoad() {
    this.setData({
      elderMode: app.isElderMode()
    })
  },

  onShow() {
    this.setData({
      elderMode: app.isElderMode()
    })
  },

  // 切换老人模式
  onElderModeChange(e) {
    const enabled = e.detail.value
    app.toggleElderMode(enabled)
    this.setData({ elderMode: enabled })

    wx.showToast({
      title: enabled ? '已开启老人模式' : '已关闭老人模式',
      icon: 'success',
      duration: 1500
    })

    // 通知其他页面刷新
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onElderModeChange) {
        page.onElderModeChange(enabled)
      }
    })
  },

  // 朗读当前页面内容
  onReadAloud() {
    const content = app.getPageReadContent('settings')
    this.readText(content)
  },

  // 文字转语音朗读
  readText(text) {
    // 使用微信小程序内置TTS插件
    const innerAudioContext = wx.createInnerAudioContext()
    
    // 微信小程序没有原生TTS，使用同声传译插件或模拟方案
    // 这里使用 wx.showModal 显示文字 + 震动提示作为辅助
    wx.showModal({
      title: '🔊 为您朗读',
      content: text,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#4CAF50'
    })

    // 同时震动提醒
    wx.vibrateShort({ type: 'medium' })
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '确认清除',
      content: '清除缓存将删除所有本地数据，包括订单和发布记录，确定继续吗？',
      confirmColor: '#F44336',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync()
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          })
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/index/index' })
          }, 1500)
        }
      }
    })
  },

  // 关于应用
  onAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 连接希望的田野',
      path: '/pages/index/index'
    }
  }
})
