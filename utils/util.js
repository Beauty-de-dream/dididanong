// utils/util.js

/**
 * 格式化日期
 */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${padZero(month)}-${padZero(day)}`
}

const padZero = (n) => {
  return n < 10 ? '0' + n : '' + n
}

/**
 * 生成星级数组
 */
const getStars = (rating) => {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(i < rating ? 'full' : 'empty')
  }
  return stars
}

/**
 * 显示成功提示
 */
const showSuccess = (title) => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 */
const showError = (title) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 拨打电话
 */
const makePhoneCall = (phone) => {
  wx.makePhoneCall({
    phoneNumber: phone,
    fail() {
      console.log('用户取消拨打电话')
    }
  })
}

module.exports = {
  formatDate,
  getStars,
  showSuccess,
  showError,
  makePhoneCall
}
