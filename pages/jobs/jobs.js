// pages/jobs/jobs.js
const app = getApp()

Page({
  data: {
    elderMode: false,
    allJobs: [],
    filteredJobs: [],
    locationOptions: ['全部地区', '河南省', '山东省', '湖北省', '湖南省', '河北省'],
    selectedLocation: '',
    cases: [
      {
        name: '张大爷',
        age: 65,
        location: '河南省洛阳市',
        content: '通过平台找到了果园工作，不仅锻炼了身体，每个月还能赚到2000多元，给孙子买玩具再也不用伸手要钱了！'
      },
      {
        name: '李奶奶',
        age: 58,
        location: '山东省济南市',
        content: '年轻时就在农村干活，现在能重新回到田间地头，感觉特别有成就感。工作轻松，收入稳定。'
      },
      {
        name: '王师傅',
        age: 62,
        location: '湖北省武汉市',
        content: '退休后在家闲着无聊，通过平台找到了生态园管理的工作。每天都有事情做，身体更健康了。'
      }
    ]
  },

  onLoad() {
    const jobs = app.globalData.jobs
    this.setData({
      allJobs: jobs,
      filteredJobs: jobs
    })
  },

  onShow() {
    // 刷新数据（包含用户发布的）
    this.setData({
      allJobs: app.globalData.jobs,
      elderMode: app.isElderMode()
    })
    this.filterJobs()
  },

  // 朗读当前页面
  onReadAloud() {
    const content = app.getPageReadContent('jobs')
    wx.showModal({
      title: '🔊 为您朗读',
      content: content,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#4CAF50'
    })
    wx.vibrateShort({ type: 'medium' })
  },

  // 地区筛选
  onLocationChange(e) {
    const index = e.detail.value
    const location = index == 0 ? '' : this.data.locationOptions[index]
    this.setData({ selectedLocation: location })
    this.filterJobs()
  },

  // 重置筛选
  resetFilter() {
    this.setData({ selectedLocation: '' })
    this.filterJobs()
  },

  // 执行筛选
  filterJobs() {
    let result = this.data.allJobs
    const { selectedLocation } = this.data

    if (selectedLocation) {
      result = result.filter(j => j.location.includes(selectedLocation.replace('省', '')))
    }

    this.setData({ filteredJobs: result })
  },

  // 跳转详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/jobs-detail/jobs-detail?id=${id}`
    })
  },

  // 申请工作
  onApplyJob(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/jobs-detail/jobs-detail?id=${id}&apply=1`
    })
  },

  // 发布招聘
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish?tab=jobs'
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 助农务工',
      path: '/pages/jobs/jobs'
    }
  }
})
