// pages/orderlist/orderlist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderlist: [],
    modalStatus: true,
    index: 0,
    currentOrderid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log('userInfo' + JSON.stringify(this.data.userInfo));
        }
      })
    };
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
    this.getOrderList();
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

  },

  // 获取用户信息
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 获取订单列表
  getOrderList: function () {
    var _this = this;
    var url = app.globalData.webapi + '/api/order/getlist?customerid=10042';
    console.log(url);
    wx.request({
      url: url,
      success: function (res) {
        console.log(res.data);
        _this.setData({
          orderlist: res.data.data
        });
      }
    })
  },

  // 查看订单详情
  orderDetail: function (e) {
    console.log(e.currentTarget.dataset.index);
    console.log(e.currentTarget.dataset.id);
    this.setData({
      index: e.currentTarget.dataset.index,
      currentOrderid: e.currentTarget.dataset.id,
      modalStatus: false
    })
  },

  // 查看订单详情
  hiddemodal: function () {
    this.setData({
      modalStatus: true
    })
  },

  // 删除订单
  delOrder: function () {
    var _this = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '取消后将无法恢复，是否继续？',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          var url = app.globalData.webapi + '/api/order/cancel?orderid=' + _this.data.currentOrderid;
          wx.request({
            url: url,
            success(res) {
              if (res.data.success) {
                wx.showToast({
                  title: '订单已取消！',
                  duration: 2000
                });
                _this.getOrderList();
              } else {
                wx.showToast({
                  title: '取消失败！' + res.data.error,
                  duration: 2000,
                  icon: 'none'
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('取消操作！')
        }
      }
    })
  }
})