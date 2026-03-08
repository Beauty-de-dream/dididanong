// pages/picking/picking.js
const app = getApp()

Page({
  data: {
    elderMode: false,
    allSpots: [],
    filteredSpots: [],
    locationOptions: ['全部地区', '北京市', '山东省', '陕西省', '河北省'],
    selectedLocation: ''
  },

  onLoad() {
    const spots = app.globalData.pickingSpots
    this.setData({
      allSpots: spots,
      filteredSpots: spots
    })
  },

  onShow() {
    // 刷新数据（包含用户发布的）
    this.setData({
      allSpots: app.globalData.pickingSpots,
      elderMode: app.isElderMode()
    })
    this.filterSpots()
  },

  // 朗读当前页面
  onReadAloud() {
    const content = app.getPageReadContent('picking')
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
    this.filterSpots()
  },

  // 重置筛选
  resetFilter() {
    this.setData({ selectedLocation: '' })
    this.filterSpots()
  },

  // 执行筛选
  filterSpots() {
    let result = this.data.allSpots
    const { selectedLocation } = this.data

    if (selectedLocation) {
      result = result.filter(s => s.location.includes(selectedLocation.replace('省', '').replace('市', '')))
    }

    this.setData({ filteredSpots: result })
  },

  // 跳转详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/picking-detail/picking-detail?id=${id}`
    })
  },

  // 预订采摘
  onBookSpot(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/picking-detail/picking-detail?id=${id}&book=1`
    })
  },

  // 发布采摘点
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish?tab=picking'
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 乡村采摘游',
      path: '/pages/picking/picking'
    }
  }
})
