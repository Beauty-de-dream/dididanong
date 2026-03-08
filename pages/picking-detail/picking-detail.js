// pages/picking-detail/picking-detail.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    spot: null,
    showBookForm: false,
    formData: {
      userName: '',
      phone: '',
      visitDate: '',
      peopleCount: ''
    }
  },

  onLoad(options) {
    const id = parseInt(options.id)
    const spot = app.globalData.pickingSpots.find(s => s.id === id)
    if (spot) {
      this.setData({ spot })
      wx.setNavigationBarTitle({ title: spot.name })
    }

    if (options.book === '1') {
      this.setData({ showBookForm: true })
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  onDateChange(e) {
    this.setData({
      'formData.visitDate': e.detail.value
    })
  },

  toggleBookForm() {
    this.setData({ showBookForm: !this.data.showBookForm })
  },

  submitBooking() {
    const { userName, phone, visitDate, peopleCount } = this.data.formData
    if (!userName || !phone || !visitDate || !peopleCount) {
      util.showError('请填写完整信息')
      return
    }

    const totalCost = this.data.spot.priceNum * parseInt(peopleCount)
    wx.showModal({
      title: '确认预订',
      content: `确认预订「${this.data.spot.name}」？\n到访日期：${visitDate}\n人数：${peopleCount}人\n预计费用：¥${totalCost}`,
      success: (res) => {
        if (res.confirm) {
          // 保存订单到全局数据
          app.addOrder({
            type: 'picking',
            itemId: this.data.spot.id,
            itemName: this.data.spot.name,
            userName,
            userPhone: phone,
            visitDate,
            peopleCount: parseInt(peopleCount),
            totalCost,
            unitPrice: this.data.spot.priceNum,
            location: this.data.spot.location,
            contactPhone: this.data.spot.phone,
            address: this.data.spot.address,
            status: 'pending'
          })
          util.showSuccess('预订成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  callSpot() {
    if (this.data.spot && this.data.spot.phone) {
      util.makePhoneCall(this.data.spot.phone)
    }
  },

  openLocation() {
    wx.openLocation({
      latitude: 39.9,
      longitude: 116.4,
      name: this.data.spot.name,
      address: this.data.spot.address,
      scale: 15
    })
  },

  onShareAppMessage() {
    return {
      title: `滴滴打农 - ${this.data.spot.name}`,
      path: `/pages/picking-detail/picking-detail?id=${this.data.spot.id}`
    }
  }
})
