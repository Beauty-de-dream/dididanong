// pages/jobs-detail/jobs-detail.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    job: null,
    showApplyForm: false,
    formData: {
      userName: '',
      phone: '',
      age: '',
      experience: ''
    }
  },

  onLoad(options) {
    const id = parseInt(options.id)
    const job = app.globalData.jobs.find(j => j.id === id)
    if (job) {
      this.setData({ job })
      wx.setNavigationBarTitle({ title: job.title })
    }

    if (options.apply === '1') {
      this.setData({ showApplyForm: true })
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  toggleApplyForm() {
    this.setData({ showApplyForm: !this.data.showApplyForm })
  },

  submitApply() {
    const { userName, phone, age } = this.data.formData
    if (!userName || !phone || !age) {
      util.showError('请填写完整信息')
      return
    }

    wx.showModal({
      title: '确认申请',
      content: `确认申请「${this.data.job.title}」？\n薪资：${this.data.job.salary}\n地点：${this.data.job.location}`,
      success: (res) => {
        if (res.confirm) {
          // 保存订单到全局数据
          app.addOrder({
            type: 'jobs',
            itemId: this.data.job.id,
            itemName: this.data.job.title,
            userName,
            userPhone: phone,
            age: parseInt(age),
            experience: this.data.formData.experience,
            salary: this.data.job.salary,
            location: this.data.job.location,
            jobDuration: this.data.job.duration,
            contactPhone: this.data.job.contact,
            status: 'pending'
          })
          util.showSuccess('申请成功')
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },

  callContact() {
    if (this.data.job && this.data.job.contact) {
      util.makePhoneCall(this.data.job.contact)
    }
  },

  onShareAppMessage() {
    return {
      title: `滴滴打农 - ${this.data.job.title}`,
      path: `/pages/jobs-detail/jobs-detail?id=${this.data.job.id}`
    }
  }
})
