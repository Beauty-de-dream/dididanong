// pages/about/about.js
const util = require('../../utils/util')

Page({
  data: {
    team: [
      { name: '皮哥猪', role: '创始人 & CEO', desc: '农业科技专家，拥有15年农业信息化经验' },
      { name: '猪皮哥', role: '技术总监 & CTO', desc: '资深软件工程师，负责平台技术架构' },
      { name: '皮哥', role: '运营总监 & COO', desc: '市场营销专家，负责平台运营拓展' }
    ]
  },

  callUs() {
    util.makePhoneCall('057110000')
  },

  copyEmail() {
    wx.setClipboardData({
      data: 'pigzhu@dididanong.com',
      success() {
        wx.showToast({ title: '邮箱已复制', icon: 'success' })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '滴滴打农 - 关于我们',
      path: '/pages/about/about'
    }
  }
})
