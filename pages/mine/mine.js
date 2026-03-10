// pages/mine/mine.js
const app = getApp()

Page({
  data: {
    elderMode: false,
    userInfo: null,
    stats: {},
    orderCounts: {
      machinery: 0,
      jobs: 0,
      picking: 0,
      all: 0
    },
    recentOrders: []
  },

  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
      stats: app.globalData.stats
    })
  },

  onShow() {
    // 每次显示页面时刷新订单数据
    const orderCounts = app.getOrderCounts()
    const recentOrders = app.getOrders().slice(0, 3)
    this.setData({
      userInfo: app.globalData.userInfo,
      elderMode: app.isElderMode(),
      orderCounts,
      recentOrders
    })
  },

  // 朗读当前页面
  onReadAloud() {
    const content = app.getPageReadContent('mine')
    wx.showModal({
      title: '🔊 为您朗读',
      content: content,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#4CAF50'
    })
    wx.vibrateShort({ type: 'medium' })
  },

  // 登录
  onLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: () => {
        // 模拟登录
        const mockUser = {
          nickName: '用户',
          avatarUrl: '/images/avatar1.jpg'
        }
        app.globalData.userInfo = mockUser
        this.setData({ userInfo: mockUser })
        wx.showToast({ title: '登录成功', icon: 'success' })
      }
    })
  },

  // 跳转到订单页面
  goToOrders(e) {
    const tab = e.currentTarget.dataset.tab || 'all'
    wx.navigateTo({ url: `/pages/orders/orders?tab=${tab}` })
  },

  // 跳转到发布页面
  goToPublish(e) {
    const tab = e.currentTarget.dataset.tab || 'machinery'
    wx.navigateTo({ url: `/pages/publish/publish?tab=${tab}` })
  },

  // 联系我们
  onContact() {
    wx.showActionSheet({
      itemList: ['拨打电话: 0571-10000', '发送邮件: pigzhu@dididanong.com'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.makePhoneCall({
            phoneNumber: '057110000',
            fail() {}
          })
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: 'pigzhu@dididanong.com',
            success() {
              wx.showToast({ title: '邮箱已复制', icon: 'success' })
            }
          })
        }
      }
    })
  },

  // 关于我们
  goToAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  // 合作推广
  goToPartnership() {
    wx.navigateTo({ url: '/pages/partnership/partnership' })
  },

  // 保险服务
  goToInsurance() {
    wx.navigateTo({ url: '/pages/insurance/insurance' })
  },

  // 紧急求助
  goToEmergency() {
    wx.navigateTo({ url: '/pages/emergency/emergency' })
  },

  // 设置
  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  // 即将上线
  showComingSoon() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 连接希望的田野',
      path: '/pages/index/index'
    }
  }
})
