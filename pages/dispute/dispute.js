// pages/dispute/dispute.js
const util = require('../../utils/util')

Page({
  data: {
    formData: {
      name: '',
      phone: '',
      type: '',
      otherParty: '',
      description: '',
      expectation: ''
    },
    disputeTypes: ['拖欠工资', '工作条件不符', '工伤争议', '合同纠纷', '设备损坏赔偿', '其他']
  },

  onLoad(options) {
    if (options.jobId) {
      this.setData({ 'formData.relatedJobId': options.jobId })
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`formData.${field}`]: e.detail.value })
  },

  onTypeChange(e) {
    const index = e.detail.value
    this.setData({ 'formData.type': this.data.disputeTypes[index] })
  },

  submitDispute() {
    const { name, phone, type, description } = this.data.formData
    if (!name || !phone || !type || !description) {
      util.showError('请填写必填信息')
      return
    }

    wx.showModal({
      title: '确认提交',
      content: '确认提交调解申请？平台调解员将在1-2个工作日内与您联系。',
      success: (res) => {
        if (res.confirm) {
          // 保存调解申请
          const disputes = wx.getStorageSync('my_disputes') || []
          disputes.push({
            ...this.data.formData,
            id: Date.now(),
            status: 'pending',
            createTime: util.formatDate(new Date())
          })
          wx.setStorageSync('my_disputes', disputes)

          util.showSuccess('申请已提交')
          setTimeout(() => { wx.navigateBack() }, 1500)
        }
      }
    })
  },

  callHotline() {
    util.makePhoneCall('057110000')
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 劳务纠纷调解',
      path: '/pages/dispute/dispute'
    }
  }
})
