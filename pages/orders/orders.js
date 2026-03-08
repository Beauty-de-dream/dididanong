// pages/orders/orders.js
const app = getApp()

Page({
  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'machinery', label: '农机' },
      { key: 'jobs', label: '务工' },
      { key: 'picking', label: '采摘' }
    ],
    orders: [],
    statusMap: {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    },
    statusColorMap: {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ currentTab: options.tab })
    }
  },

  onShow() {
    this.loadOrders()
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    this.loadOrders()
  },

  // 加载订单
  loadOrders() {
    const type = this.data.currentTab === 'all' ? null : this.data.currentTab
    const orders = app.getOrders(type)
    this.setData({ orders })
  },

  // 取消订单
  onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认取消',
      content: '确定要取消此订单吗？',
      success: (res) => {
        if (res.confirm) {
          app.cancelOrder(orderId)
          this.loadOrders()
          wx.showToast({ title: '订单已取消', icon: 'success' })
        }
      }
    })
  },

  // 确认完成
  onCompleteOrder(e) {
    const orderId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认完成',
      content: '确定此订单已完成？',
      success: (res) => {
        if (res.confirm) {
          app.updateOrderStatus(orderId, 'completed')
          this.loadOrders()
          wx.showToast({ title: '订单已完成', icon: 'success' })
        }
      }
    })
  },

  // 查看详情导航
  goToDetail(e) {
    const order = e.currentTarget.dataset.order
    let url = ''
    if (order.type === 'machinery') {
      url = `/pages/machinery-detail/machinery-detail?id=${order.itemId}`
    } else if (order.type === 'jobs') {
      url = `/pages/jobs-detail/jobs-detail?id=${order.itemId}`
    } else if (order.type === 'picking') {
      url = `/pages/picking-detail/picking-detail?id=${order.itemId}`
    }
    if (url) {
      wx.navigateTo({ url })
    }
  },

  // 拨打电话
  callPhone(e) {
    const phone = e.currentTarget.dataset.phone
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail() {}
      })
    }
  }
})
