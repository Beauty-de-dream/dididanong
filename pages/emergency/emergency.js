// pages/emergency/emergency.js
const util = require('../../utils/util')

Page({
  data: {
    contacts: [],
    showAddModal: false,
    contactForm: {
      name: '',
      relation: '',
      phone: ''
    },
    relations: ['配偶', '父母', '子女', '兄弟姐妹', '朋友', '同事', '其他']
  },

  onLoad() {
    this.loadContacts()
  },

  loadContacts() {
    const contacts = wx.getStorageSync('emergency_contacts') || []
    this.setData({ contacts })
  },

  addContact() {
    this.setData({
      showAddModal: true,
      contactForm: { name: '', relation: '', phone: '' }
    })
  },

  closeModal() {
    this.setData({ showAddModal: false })
  },

  onContactInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`contactForm.${field}`]: e.detail.value })
  },

  onRelationChange(e) {
    const index = e.detail.value
    this.setData({ 'contactForm.relation': this.data.relations[index] })
  },

  saveContact() {
    const { name, relation, phone } = this.data.contactForm
    if (!name || !relation || !phone) {
      util.showError('请填写完整信息')
      return
    }

    const contacts = this.data.contacts
    contacts.push({
      id: Date.now(),
      name,
      relation,
      phone
    })
    wx.setStorageSync('emergency_contacts', contacts)
    this.setData({ contacts, showAddModal: false })
    util.showSuccess('添加成功')
  },

  deleteContact(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确认删除该紧急联系人？',
      success: (res) => {
        if (res.confirm) {
          const contacts = this.data.contacts.filter(c => c.id !== id)
          wx.setStorageSync('emergency_contacts', contacts)
          this.setData({ contacts })
          util.showSuccess('已删除')
        }
      }
    })
  },

  callContact(e) {
    const phone = e.currentTarget.dataset.phone
    util.makePhoneCall(phone)
  },

  callPolice() {
    util.makePhoneCall('110')
  },

  callAmbulance() {
    util.makePhoneCall('120')
  },

  callFire() {
    util.makePhoneCall('119')
  },

  callPlatform() {
    util.makePhoneCall('057110000')
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 紧急求助',
      path: '/pages/emergency/emergency'
    }
  }
})
