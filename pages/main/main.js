// pages/main/mian.js

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalStatus: true,
    type: '网站应用',
    currentIndex: 0,
    index: 0,
    array: ['天', '周', '月', '年'],
    objectArray: [{
        id: 0,
        name: '天'
      },
      {
        id: 1,
        name: '周'
      },
      {
        id: 2,
        name: '月'
      },
      {
        id: 3,
        name: '年'
      }
    ],
    orderinfo: {
      "name": "postman测试",
      "mobile": "18853756864",
      "ordertype": 1,
      "content": "postman新增订单接口测试",
      "time": "2020-11-12T14:19:10.4780126+08:00"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '粥一软件开发'
    }
  },

  // 创建订单模态框
  neworder: function () {
    this.setData({
      modalStatus: false
    });
  },

  // 隐藏模态框
  hiddemodal: function () {
    this.setData({
      modalStatus: true
    });
  },

  // 提交订单
  submitorder: function (obj) {
    this.addOrder();
    this.setData({
      modalStatus: true
    });
  },

  // 选择类型
  block_click: function (e) {
    var t = e.currentTarget.dataset['type'];
    this.setData({
      type: t
    });
  },

  // 联系我们
  makecall: function () {
    wx.makePhoneCall({
      phoneNumber: '18853756864',
    })
  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex;
      currentPageIndex = (currentPageIndex + 1) % 4;
      var tp = this.getType(currentPageIndex);
      this.setData({
        currentIndex: currentPageIndex,
        type: tp
      })
    }
  },

  //用户点击tab时调用
  titleClick: function (e) {
    let currentPageIndex = e.currentTarget.dataset.idx;
    currentPageIndex = currentPageIndex * 1;
    var tp = this.getType(currentPageIndex);
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: currentPageIndex,
      type: tp
    })
  },

  // 获取当前类型
  getType: function (i) {
    switch (i) {
      case 0:
        return "网站应用";
      case 1:
        return "桌面APP";
      case 2:
        return "安卓APP";
      case 3:
        return "微信平台";
    }
    return "";
  },

  // 时限类型
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  //调用api
  addOrder: function () {
    var _this = this;
    var url = app.globalData.webapi + '/api/order/add';
    console.log(url);
    wx.request({
      url: url, //这里填写你的接口路径
      method: 'POST',
      header: { //这里写你借口返回的数据是什么类型，这里就体现了微信小程序的强大，直接给你解析数据，再也不用去寻找各种方法去解析json，xml等数据了
        'Content-Type': 'application/json'
      },
      data: { //这里写你要请求的参数
        orderinfo: _this.data.orderinfo
      },
      success: function (res) {
        //这里就是请求成功后，进行一些函数操作
        console.log('提交成功！您的订单编号为：' + res.data.data.orderid);
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})