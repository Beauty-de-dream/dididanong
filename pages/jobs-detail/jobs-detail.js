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

    // 跳转到合约确认页面
    const contractData = {
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
      contactPhone: this.data.job.contact
    }
    // 将合约数据存入全局临时变量
    getApp().globalData.pendingContract = contractData
    wx.navigateTo({ url: '/pages/contract/contract' })
  },

  callContact() {
    if (this.data.job && this.data.job.contact) {
      util.makePhoneCall(this.data.job.contact)
    }
  },

  goToDispute() {
    wx.navigateTo({
      url: '/pages/dispute/dispute?jobId=' + (this.data.job ? this.data.job.id : '')
    })
  },

  onShareAppMessage() {
    return {
      title: `滴滴打农 - ${this.data.job.title}`,
      path: `/pages/jobs-detail/jobs-detail?id=${this.data.job.id}`
    }
  }
})
