// app.js
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('滴滴打农小程序启动')
    // 从本地存储恢复订单数据
    const orders = wx.getStorageSync('orders')
    if (orders) {
      this.globalData.orders = orders
    }
    // 从本地存储恢复用户发布数据
    const userMachinery = wx.getStorageSync('userMachinery')
    if (userMachinery) {
      this.globalData.userMachinery = userMachinery
    }
    const userJobs = wx.getStorageSync('userJobs')
    if (userJobs) {
      this.globalData.userJobs = userJobs
    }
    const userPickingSpots = wx.getStorageSync('userPickingSpots')
    if (userPickingSpots) {
      this.globalData.userPickingSpots = userPickingSpots
    }
    // 恢复老人模式设置
    const elderMode = wx.getStorageSync('elderMode')
    if (elderMode) {
      this.globalData.elderMode = true
    }
  },

  // ============ 订单管理方法 ============

  // 添加订单
  addOrder(order) {
    const orderData = {
      ...order,
      orderId: 'DD' + Date.now() + Math.floor(Math.random() * 1000),
      createTime: this.formatTime(new Date()),
      status: order.status || 'pending' // pending, confirmed, completed, cancelled
    }
    this.globalData.orders.unshift(orderData)
    wx.setStorageSync('orders', this.globalData.orders)
    return orderData
  },

  // 获取指定类型订单
  getOrders(type) {
    if (!type || type === 'all') {
      return this.globalData.orders
    }
    return this.globalData.orders.filter(o => o.type === type)
  },

  // 获取订单统计
  getOrderCounts() {
    const orders = this.globalData.orders
    return {
      machinery: orders.filter(o => o.type === 'machinery').length,
      jobs: orders.filter(o => o.type === 'jobs').length,
      picking: orders.filter(o => o.type === 'picking').length,
      all: orders.length
    }
  },

  // 更新订单状态
  updateOrderStatus(orderId, status) {
    const order = this.globalData.orders.find(o => o.orderId === orderId)
    if (order) {
      order.status = status
      order.updateTime = this.formatTime(new Date())
      wx.setStorageSync('orders', this.globalData.orders)
    }
  },

  // 取消订单
  cancelOrder(orderId) {
    this.updateOrderStatus(orderId, 'cancelled')
  },

  // ============ 发布管理方法 ============

  // 发布农机
  publishMachinery(data) {
    const item = {
      ...data,
      id: Date.now(),
      available: true,
      isUserPublished: true,
      publishTime: this.formatTime(new Date())
    }
    this.globalData.machinery.push(item)
    this.globalData.userMachinery.push(item)
    wx.setStorageSync('userMachinery', this.globalData.userMachinery)
    return item
  },

  // 发布务工招聘
  publishJob(data) {
    const item = {
      ...data,
      id: Date.now(),
      isUserPublished: true,
      publishTime: this.formatTime(new Date())
    }
    this.globalData.jobs.push(item)
    this.globalData.userJobs.push(item)
    wx.setStorageSync('userJobs', this.globalData.userJobs)
    return item
  },

  // 发布采摘点
  publishPickingSpot(data) {
    const item = {
      ...data,
      id: Date.now(),
      isUserPublished: true,
      publishTime: this.formatTime(new Date())
    }
    this.globalData.pickingSpots.push(item)
    this.globalData.userPickingSpots.push(item)
    wx.setStorageSync('userPickingSpots', this.globalData.userPickingSpots)
    return item
  },

  // ============ 老人模式管理 ============

  // 切换老人模式
  toggleElderMode(enabled) {
    this.globalData.elderMode = enabled
    wx.setStorageSync('elderMode', enabled)
  },

  // 获取老人模式状态
  isElderMode() {
    return this.globalData.elderMode
  },

  // 获取当前页面可朗读内容
  getPageReadContent(pageName) {
    const contentMap = {
      'index': '欢迎使用滴滴打农平台。这是一个连接农机租赁、助农务工和乡村采摘的综合服务平台。您可以在这里查找农机租赁信息、寻找工作机会、预订采摘体验。',
      'machinery': '这是农机共享页面。您可以在这里浏览各类农机设备，包括拖拉机、收割机、插秧机等。选择心仪的农机后可以进行租用预订。',
      'jobs': '这是助农务工页面。这里展示各类农业工作机会，包括果园管理、田间种植等岗位。您可以筛选地区，找到适合的工作并申请。',
      'picking': '这是乡村采摘页面。您可以浏览各地的采摘园信息，了解可采摘的水果种类、价格和位置，进行在线预订。',
      'mine': '这是个人中心页面。您可以查看我的订单、发布信息、联系客服和修改设置。',
      'settings': '这是设置页面。您可以在这里开启或关闭老人模式。老人模式将使用更大的字体，简化页面内容，让操作更方便。'
    }
    return contentMap[pageName] || '当前页面暂无朗读内容'
  },

  // 格式化时间
  formatTime(date) {
    const y = date.getFullYear()
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    const h = date.getHours().toString().padStart(2, '0')
    const min = date.getMinutes().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${min}`
  },

  globalData: {
    // 订单数据
    orders: [],
    // 用户发布数据
    userMachinery: [],
    userJobs: [],
    userPickingSpots: [],
    userInfo: null,
    // 老人模式
    elderMode: false,
    // 模拟数据 - 农机列表
    machinery: [
      {
        id: 1,
        name: '东风拖拉机DX1204',
        type: '拖拉机',
        price: 300,
        location: '河南省郑州市',
        owner: '张师傅',
        available: true,
        image: '/images/tractor1.webp',
        description: '120马力，适合中型农田作业',
        phone: '13800138001'
      },
      {
        id: 2,
        name: '雷沃谷神收割机',
        type: '收割机',
        price: 500,
        location: '山东省潍坊市',
        owner: '李师傅',
        available: true,
        image: '/images/harvester1.webp',
        description: '效率高，适合水稻、小麦收割',
        phone: '13800138002'
      },
      {
        id: 3,
        name: '久保田插秧机',
        type: '插秧机',
        price: 200,
        location: '湖南省长沙市',
        owner: '王师傅',
        available: true,
        image: '/images/planter.webp',
        description: '自动化程度高，提高插秧效率',
        phone: '13800138003'
      },
      {
        id: 4,
        name: '约翰迪尔播种机',
        type: '播种机',
        price: 250,
        location: '湖北省武汉市',
        owner: '赵师傅',
        available: true,
        image: '/images/seeder.webp',
        description: '精密播种，节省种子，提高出苗率',
        phone: '13800138004'
      },
      {
        id: 5,
        name: '沃得锐龙收割机',
        type: '收割机',
        price: 450,
        location: '河南省洛阳市',
        owner: '孙师傅',
        available: false,
        image: '/images/harvester2.jpg',
        description: '大型联合收割机，日作业面积可达100亩',
        phone: '13800138005'
      },
      {
        id: 6,
        name: '中联重科拖拉机',
        type: '拖拉机',
        price: 350,
        location: '山东省济南市',
        owner: '周师傅',
        available: true,
        image: '/images/tractor2.png',
        description: '180马力大型拖拉机，适合大面积农田',
        phone: '13800138006'
      }
    ],

    // 模拟数据 - 工作列表
    jobs: [
      {
        id: 1,
        title: '阳光果园采摘员',
        location: '河南省洛阳市',
        salary: '150元/天',
        duration: '7天',
        requirements: '身体健康，55-70岁',
        description: '协助游客采摘，维护果园秩序。工作时间为早上8点到下午5点，包含午休时间。提供工作餐和交通补贴。',
        contact: '13800138001',
        tags: ['轻体力', '包餐', '交通补贴']
      },
      {
        id: 2,
        title: '绿色农场除草工',
        location: '山东省济南市',
        salary: '120元/天',
        duration: '10天',
        requirements: '能够从事轻体力劳动',
        description: '农田除草，施肥协助。采用现代化工具作业，劳动强度适中。提供劳动工具和防护装备。',
        contact: '13800138002',
        tags: ['工具提供', '防护装备', '灵活时间']
      },
      {
        id: 3,
        title: '生态园管理员',
        location: '湖北省武汉市',
        salary: '180元/天',
        duration: '15天',
        requirements: '有农业经验优先',
        description: '协助管理生态园日常事务，包括植物浇灌、游客接待、环境维护等。工作环境优美，适合热爱自然的人。',
        contact: '13800138003',
        tags: ['环境优美', '经验优先', '长期合作']
      },
      {
        id: 4,
        title: '葡萄园修枝员',
        location: '河北省张家口市',
        salary: '160元/天',
        duration: '5天',
        requirements: '有修枝经验，55-65岁',
        description: '负责葡萄园的修枝、绑蔓工作。专业技术人员现场指导，工作时间灵活。',
        contact: '13800138004',
        tags: ['技术支持', '短期工', '经验优先']
      }
    ],

    // 模拟数据 - 采摘点列表
    pickingSpots: [
      {
        id: 1,
        name: '春天草莓园',
        location: '北京市昌平区',
        price: '80元/人',
        priceNum: 80,
        season: '12月-5月',
        features: ['有机种植', '亲子友好', '现摘现吃'],
        image: '/images/strawberry.jpg',
        description: '北京最大的草莓采摘基地，品种丰富，采用有机种植方式，口感香甜。园区设施完善，配有儿童游乐区、休息区和停车场。',
        phone: '010-12345678',
        address: '北京市昌平区南口镇草莓大道18号'
      },
      {
        id: 2,
        name: '阳光樱桃园',
        location: '山东省烟台市',
        price: '60元/人',
        priceNum: 60,
        season: '5月-7月',
        features: ['山地樱桃', '风景优美', '农家乐'],
        image: '/images/cherry.jpg',
        description: '烟台大樱桃原产地，品质优良。坐落在山坡上，空气清新，风景如画。园区提供农家乐服务，可品尝地道农家菜。',
        phone: '0535-12345678',
        address: '山东省烟台市福山区樱桃路66号'
      },
      {
        id: 3,
        name: '田园苹果庄园',
        location: '陕西省咸阳市',
        price: '45元/人',
        priceNum: 45,
        season: '9月-11月',
        features: ['红富士', '无公害', '包装带走'],
        image: '/images/apple.png',
        description: '陕西优质苹果，香甜脆嫩。采用绿色无公害种植技术，果园提供免费包装袋，采摘的水果可带走。',
        phone: '029-12345678',
        address: '陕西省咸阳市礼泉县苹果大道99号'
      },
      {
        id: 4,
        name: '蓝天葡萄庄园',
        location: '河北省张家口市',
        price: '55元/人',
        priceNum: 55,
        season: '8月-10月',
        features: ['多品种', '亲子体验', '农家餐'],
        image: '/images/grape.jpg',
        description: '拥有十余种葡萄品种，从巨峰到阳光玫瑰应有尽有。园区提供亲子体验活动和正宗农家餐。',
        phone: '0313-12345678',
        address: '河北省张家口市怀来县葡萄大道8号'
      }
    ],

    // 用户评价
    testimonials: [
      {
        name: '张大爷',
        age: 65,
        role: '务工人员',
        content: '通过平台找到了合适的工作，既锻炼了身体，又有了收入，很满意！',
        rating: 5,
        avatar: '/images/avatar1.jpg'
      },
      {
        name: '李农户',
        age: 50,
        role: '农机租户',
        content: '租到了质量很好的收割机，价格公道，节省了很多成本。',
        rating: 5,
        avatar: '/images/avatar2.jpg'
      },
      {
        name: '王女士',
        age: 35,
        role: '游客',
        content: '带孩子来采摘，体验很棒，孩子玩得很开心，还学到了农业知识。',
        rating: 4,
        avatar: '/images/avatar3.jpg'
      }
    ],

    // 平台统计数据
    stats: {
      machineryCount: 1268,
      workerCount: 856,
      gardenCount: 342,
      satisfaction: 95
    }
  }
})
