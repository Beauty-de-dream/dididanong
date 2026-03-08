// pages/index/index.js
const app = getApp()

Page({
  data: {
    elderMode: false,
    featuredMachinery: [],
    featuredJobs: [],
    featuredSpots: [],
    testimonials: [],
    stats: {},
    news: [
      {
        date: '2024-06-25',
        title: '滴滴打农平台与30个村镇达成战略合作',
        desc: '平台持续扩大服务范围，为更多农户提供便利服务...'
      },
      {
        date: '2024-06-20',
        title: '夏季采摘季正式开启，多地果园迎来客流高峰',
        desc: '随着夏季水果成熟，平台采摘业务迎来旺季...'
      },
      {
        date: '2024-06-15',
        title: '智能农机调度系统正式上线',
        desc: '新系统将进一步提升农机租赁效率和用户体验...'
      }
    ]
  },

  onLoad() {
    this.setData({
      elderMode: app.isElderMode(),
      featuredMachinery: app.globalData.machinery.slice(0, 3),
      featuredJobs: app.globalData.jobs.slice(0, 3),
      featuredSpots: app.globalData.pickingSpots.slice(0, 3),
      testimonials: app.globalData.testimonials,
      stats: app.globalData.stats
    })
  },

  onShow() {
    this.setData({ elderMode: app.isElderMode() })
  },

  // 朗读当前页面
  onReadAloud() {
    const content = app.getPageReadContent('index')
    wx.showModal({
      title: '🔊 为您朗读',
      content: content,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#4CAF50'
    })
    wx.vibrateShort({ type: 'medium' })
  },

  // 跳转到农机共享
  goToMachinery() {
    wx.switchTab({
      url: '/pages/machinery/machinery'
    })
  },

  // 跳转到助农务工
  goToJobs() {
    wx.switchTab({
      url: '/pages/jobs/jobs'
    })
  },

  // 跳转到乡村采摘
  goToPicking() {
    wx.switchTab({
      url: '/pages/picking/picking'
    })
  },

  // 跳转到关于我们
  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  // 跳转到合作推广
  goToPartnership() {
    wx.navigateTo({
      url: '/pages/partnership/partnership'
    })
  },

  // 跳转到农机详情
  goToMachineryDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/machinery-detail/machinery-detail?id=${id}`
    })
  },

  // 跳转到工作详情
  goToJobDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/jobs-detail/jobs-detail?id=${id}`
    })
  },

  // 跳转到采摘详情
  goToPickingDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/picking-detail/picking-detail?id=${id}`
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 连接希望的田野',
      path: '/pages/index/index'
    }
  }
})
