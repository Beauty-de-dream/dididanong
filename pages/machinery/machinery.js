// pages/machinery/machinery.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    elderMode: false,
    allMachinery: [],
    filteredMachinery: [],
    typeOptions: ['全部类型', '拖拉机', '收割机', '插秧机', '播种机'],
    locationOptions: ['全部地区', '河南省', '山东省', '湖南省', '湖北省'],
    selectedType: '',
    selectedLocation: ''
  },

  onLoad() {
    const machinery = app.globalData.machinery
    this.setData({
      allMachinery: machinery,
      filteredMachinery: machinery
    })
  },

  onShow() {
    // 刷新数据（包含用户发布的）
    this.setData({
      allMachinery: app.globalData.machinery,
      elderMode: app.isElderMode()
    })
    this.filterMachinery()
  },

  // 朗读当前页面
  onReadAloud() {
    const content = app.getPageReadContent('machinery')
    wx.showModal({
      title: '🔊 为您朗读',
      content: content,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#4CAF50'
    })
    wx.vibrateShort({ type: 'medium' })
  },

  // 类型筛选
  onTypeChange(e) {
    const index = e.detail.value
    const type = index == 0 ? '' : this.data.typeOptions[index]
    this.setData({ selectedType: type })
    this.filterMachinery()
  },

  // 地区筛选
  onLocationChange(e) {
    const index = e.detail.value
    const location = index == 0 ? '' : this.data.locationOptions[index]
    this.setData({ selectedLocation: location })
    this.filterMachinery()
  },

  // 重置筛选
  resetFilter() {
    this.setData({
      selectedType: '',
      selectedLocation: ''
    })
    this.filterMachinery()
  },

  // 执行筛选
  filterMachinery() {
    let result = this.data.allMachinery
    const { selectedType, selectedLocation } = this.data

    if (selectedType) {
      result = result.filter(m => m.type === selectedType)
    }
    if (selectedLocation) {
      result = result.filter(m => m.location.includes(selectedLocation.replace('省', '')))
    }

    this.setData({ filteredMachinery: result })
  },

  // 跳转详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/machinery-detail/machinery-detail?id=${id}`
    })
  },

  // 预订农机
  onBookMachinery(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/machinery-detail/machinery-detail?id=${id}&book=1`
    })
  },

  // 发布农机
  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish?tab=machinery'
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 农机共享',
      path: '/pages/machinery/machinery'
    }
  }
})
