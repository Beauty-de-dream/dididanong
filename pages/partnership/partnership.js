// pages/partnership/partnership.js
const util = require('../../utils/util')

Page({
  data: {
    businessTypes: ['农机设备', '果园采摘', '农业基地', '农民合作社', '其他'],
    selectedType: '',
    formData: {
      businessName: '',
      contactPerson: '',
      contactPhone: '',
      location: '',
      businessType: '',
      scale: '',
      intention: ''
    },
    cases: [
      {
        city: '河南省洛阳市',
        type: '政府合作典型案例',
        desc: '与洛阳市农业农村局签署战略合作协议，推动当地农机共享和务工服务发展，惠及农户超过3000户。',
        badge: '成功案例',
        badgeClass: 'badge-green'
      },
      {
        city: '山东省烟台市',
        type: '乡贤推荐成功案例',
        desc: '通过当地乡贤推荐，成功开展樱桃采摘旅游项目，年接待游客超过5万人次。',
        badge: '乡贤推荐',
        badgeClass: 'badge-orange'
      },
      {
        city: '陕西省咸阳市',
        type: '综合合作示范区',
        desc: '政府与乡贤共同支持，建设农业现代化示范区，集农机共享、务工就业、采摘旅游于一体。',
        badge: '示范区',
        badgeClass: 'badge-blue'
      }
    ]
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  onTypeChange(e) {
    const index = e.detail.value
    const type = this.data.businessTypes[index]
    this.setData({
      selectedType: type,
      'formData.businessType': type
    })
  },

  submitForm() {
    const { businessName, contactPerson, contactPhone, location, businessType } = this.data.formData
    if (!businessName || !contactPerson || !contactPhone || !location || !businessType) {
      util.showError('请填写必填信息')
      return
    }

    wx.showModal({
      title: '确认提交',
      content: `确认提交合作申请？\n企业名称：${businessName}\n联系人：${contactPerson}`,
      success: (res) => {
        if (res.confirm) {
          util.showSuccess('申请已提交')
          // 清空表单
          this.setData({
            selectedType: '',
            formData: {
              businessName: '',
              contactPerson: '',
              contactPhone: '',
              location: '',
              businessType: '',
              scale: '',
              intention: ''
            }
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 合作推广',
      path: '/pages/partnership/partnership'
    }
  }
})
