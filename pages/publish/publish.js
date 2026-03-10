// pages/publish/publish.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    currentTab: 'machinery',
    tabs: [
      { key: 'machinery', label: '农机出租', icon: '🚜' },
      { key: 'jobs', label: '务工招聘', icon: '💼' },
      { key: 'picking', label: '采摘发布', icon: '🍎' }
    ],

    // 农机表单
    machineryForm: {
      name: '',
      type: '',
      price: '',
      location: '',
      owner: '',
      phone: '',
      description: '',
      insurancePlan: ''
    },
    machineryTypes: ['拖拉机', '收割机', '插秧机', '播种机', '喷洒机', '其他'],
    selectedMachineryType: '',

    // 务工招聘表单
    jobForm: {
      title: '',
      location: '',
      salary: '',
      duration: '',
      requirements: '',
      description: '',
      contact: '',
      tags: ''
    },

    // 采摘发布表单
    pickingForm: {
      name: '',
      location: '',
      price: '',
      priceNum: 0,
      season: '',
      description: '',
      phone: '',
      address: '',
      features: ''
    },

    // 用户发布记录
    myMachinery: [],
    myJobs: [],
    myPickingSpots: []
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ currentTab: options.tab })
    }
  },

  onShow() {
    this.loadMyPublish()
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
  },

  // 加载我的发布
  loadMyPublish() {
    this.setData({
      myMachinery: app.globalData.userMachinery || [],
      myJobs: app.globalData.userJobs || [],
      myPickingSpots: app.globalData.userPickingSpots || []
    })
  },

  // ============ 农机表单 ============
  onMachineryInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`machineryForm.${field}`]: e.detail.value })
  },

  onMachineryTypeChange(e) {
    const index = e.detail.value
    const type = this.data.machineryTypes[index]
    this.setData({
      selectedMachineryType: type,
      'machineryForm.type': type
    })
  },

  selectInsurancePlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({ 'machineryForm.insurancePlan': plan })
  },

  submitMachinery() {
    const { name, type, price, location, owner, phone, description } = this.data.machineryForm
    if (!name || !type || !price || !location || !owner || !phone) {
      util.showError('请填写完整信息')
      return
    }

    wx.showModal({
      title: '确认发布',
      content: `确认发布农机「${name}」？\n类型：${type}\n价格：¥${price}/天`,
      success: (res) => {
        if (res.confirm) {
          app.publishMachinery({
            name,
            type,
            price: parseInt(price),
            location,
            owner,
            phone,
            description: description || '暂无描述',
            image: '/images/tractor1.webp'
          })

          util.showSuccess('发布成功')
          this.setData({
            machineryForm: { name: '', type: '', price: '', location: '', owner: '', phone: '', description: '', insurancePlan: '' },
            selectedMachineryType: ''
          })
          this.loadMyPublish()
        }
      }
    })
  },

  // ============ 务工招聘表单 ============
  onJobInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`jobForm.${field}`]: e.detail.value })
  },

  submitJob() {
    const { title, location, salary, duration, requirements, description, contact } = this.data.jobForm
    if (!title || !location || !salary || !duration || !contact) {
      util.showError('请填写完整信息')
      return
    }

    wx.showModal({
      title: '确认发布',
      content: `确认发布招聘「${title}」？\n薪资：${salary}\n地点：${location}`,
      success: (res) => {
        if (res.confirm) {
          const tags = this.data.jobForm.tags ? this.data.jobForm.tags.split('、') : []
          app.publishJob({
            title,
            location,
            salary: salary + (salary.includes('元') ? '' : '元/天'),
            duration: duration + (duration.includes('天') ? '' : '天'),
            requirements: requirements || '无特殊要求',
            description: description || '暂无详细描述',
            contact,
            tags
          })

          util.showSuccess('发布成功')
          this.setData({
            jobForm: { title: '', location: '', salary: '', duration: '', requirements: '', description: '', contact: '', tags: '' }
          })
          this.loadMyPublish()
        }
      }
    })
  },

  // ============ 采摘发布表单 ============
  onPickingInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`pickingForm.${field}`]: value })
    if (field === 'price') {
      this.setData({ 'pickingForm.priceNum': parseInt(value) || 0 })
    }
  },

  submitPicking() {
    const { name, location, price, season, description, phone, address } = this.data.pickingForm
    if (!name || !location || !price || !season || !phone || !address) {
      util.showError('请填写完整信息')
      return
    }

    wx.showModal({
      title: '确认发布',
      content: `确认发布采摘点「${name}」？\n价格：${price}元/人\n地点：${location}`,
      success: (res) => {
        if (res.confirm) {
          const features = this.data.pickingForm.features ? this.data.pickingForm.features.split('、') : []
          app.publishPickingSpot({
            name,
            location,
            price: price + '元/人',
            priceNum: parseInt(price) || 0,
            season,
            description: description || '暂无详细描述',
            phone,
            address,
            features,
            image: '/images/apple.png'
          })

          util.showSuccess('发布成功')
          this.setData({
            pickingForm: { name: '', location: '', price: '', priceNum: 0, season: '', description: '', phone: '', address: '', features: '' }
          })
          this.loadMyPublish()
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 发布服务',
      path: '/pages/publish/publish'
    }
  }
})
