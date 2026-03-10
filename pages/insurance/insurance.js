// pages/insurance/insurance.js
const util = require('../../utils/util')

Page({
  data: {
    selectedAccidentPlan: '',
    selectedEquipPlan: '',
    policies: [],
    faqs: [
      { q: '保险什么时候生效？', a: '购买成功后立即生效，保障期间为工作/租赁期间。', open: false },
      { q: '如何申请理赔？', a: '发生意外后请在24小时内通过平台提交理赔申请，上传相关证明材料，我们将在3个工作日内处理。', open: false },
      { q: '可以中途退保吗？', a: '可以，未生效的保险全额退款，已生效的按剩余天数比例退款。', open: false },
      { q: '保险费用谁来承担？', a: '保险费用由双方在签订合约时协商确定，可由雇主承担、务工者承担或双方分摊。', open: false }
    ]
  },

  onLoad() {
    this.loadPolicies()
  },

  loadPolicies() {
    const policies = wx.getStorageSync('my_policies') || []
    this.setData({ policies })
  },

  selectAccidentPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({
      selectedAccidentPlan: this.data.selectedAccidentPlan === plan ? '' : plan
    })
  },

  selectEquipPlan(e) {
    const plan = e.currentTarget.dataset.plan
    this.setData({
      selectedEquipPlan: this.data.selectedEquipPlan === plan ? '' : plan
    })
  },

  toggleFaq(e) {
    const index = e.currentTarget.dataset.index
    const key = `faqs[${index}].open`
    this.setData({ [key]: !this.data.faqs[index].open })
  },

  callService() {
    util.makePhoneCall('057110000')
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 保险服务',
      path: '/pages/insurance/insurance'
    }
  }
})
