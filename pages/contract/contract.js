// pages/contract/contract.js
const app = getApp()
const util = require('../../utils/util')

Page({
  data: {
    contractData: {},
    accidentPlan: '',
    equipPlan: 'none',
    employerAgreed: false,
    workerAgreed: false,
    canSubmit: false,
    accidentCostText: '未选择',
    equipCostText: '¥0',
    totalCostText: '¥0'
  },

  onLoad() {
    const contractData = app.globalData.pendingContract || {}
    this.setData({ contractData })
  },

  selectAccidentPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({ accidentPlan: plan })
    this.updateCost()
    this.checkCanSubmit()
  },

  selectEquipPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({ equipPlan: plan })
    this.updateCost()
    this.checkCanSubmit()
  },

  toggleEmployerAgree() {
    this.setData({ employerAgreed: !this.data.employerAgreed })
    this.checkCanSubmit()
  },

  toggleWorkerAgree() {
    this.setData({ workerAgreed: !this.data.workerAgreed })
    this.checkCanSubmit()
  },

  updateCost() {
    const accidentPrices = { basic: 3, standard: 8, premium: 15 }
    const equipPrices = { none: 0, basic: 5, standard: 10, premium: 20 }
    const accidentCost = accidentPrices[this.data.accidentPlan] || 0
    const equipCost = equipPrices[this.data.equipPlan] || 0
    const total = accidentCost + equipCost

    this.setData({
      accidentCostText: accidentCost > 0 ? `¥${accidentCost}/天` : '未选择',
      equipCostText: `¥${equipCost}/天`,
      totalCostText: `¥${total}`
    })
  },

  checkCanSubmit() {
    const canSubmit = this.data.accidentPlan !== '' &&
                      this.data.employerAgreed &&
                      this.data.workerAgreed
    this.setData({ canSubmit })
  },

  onCancel() {
    wx.showModal({
      title: '确认取消',
      content: '取消后将返回上一页，已填写的信息不会保存。',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },

  onConfirm() {
    if (!this.data.canSubmit) {
      if (!this.data.accidentPlan) {
        util.showError('请选择人身意外险方案')
        return
      }
      if (!this.data.employerAgreed || !this.data.workerAgreed) {
        util.showError('需要双方都勾选同意')
        return
      }
      return
    }

    wx.showModal({
      title: '确认签署',
      content: '双方确认签署合约后，订单将正式生效。',
      success: (res) => {
        if (res.confirm) {
          const contractData = this.data.contractData
          // 保存订单
          app.addOrder({
            type: contractData.type,
            itemId: contractData.itemId,
            itemName: contractData.itemName,
            userName: contractData.userName,
            userPhone: contractData.userPhone,
            age: contractData.age,
            experience: contractData.experience,
            salary: contractData.salary,
            location: contractData.location,
            jobDuration: contractData.jobDuration,
            contactPhone: contractData.contactPhone,
            status: 'pending',
            accidentInsurance: this.data.accidentPlan,
            equipInsurance: this.data.equipPlan,
            contractSigned: true,
            contractTime: util.formatDate(new Date())
          })

          // 清除临时数据
          app.globalData.pendingContract = null

          util.showSuccess('合约签署成功')
          setTimeout(() => {
            wx.navigateBack({ delta: 2 })
          }, 1500)
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 合约确认',
      path: '/pages/contract/contract'
    }
  }
})
