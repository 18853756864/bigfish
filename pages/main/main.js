// pages/main/mian.js

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    modalStatus: true,
    type: ['网站应用', '桌面APP', '安卓APP', '微信平台'],
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
    name: "",
    mobile: "",
    content: "",
    timelimit: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.webapi + '/api/common/phone',
      success(res) {
        if (res) {
          if (res.data.success) {
            app.globalData.defaultPhone = JSON.stringify(res.data.data);
          } else {
            console.log('获取默认手机号失败：' + res.data.error);
          }
        }
      },
      fail(err) {
        console.log('获取默认手机号失败：' + JSON.stringify(err));
      }
    })
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
    console.log('打开首页.');
    console.log('校验用户标识');
    getUser();
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
    console.log(obj)
    this.addOrder();
    this.setData({
      modalStatus: true
    });
  },

  // 选择类型
  block_click: function (e) {
    var index = e.currentTarget.dataset.index;
    console.log('选择类型：' + index);
    this.setData({
      currentIndex: index
    });
  },

  // 联系我们
  makecall: function () {
    console.log('拨打电话：' + app.globalData.defaultPhone);
    wx.makePhoneCall({
      phoneNumber: app.globalData.defaultPhone,
    })
  },

  //swiper切换时会调用
  pagechange: function (e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex;
      currentPageIndex = (currentPageIndex + 1) % 4;
      this.setData({
        currentIndex: currentPageIndex,
      })
    }
  },

  //用户点击tab时调用
  titleClick: function (e) {
    console.log(e);
    let currentPageIndex = e.currentTarget.dataset.index;
    console.log('选择项：' + currentPageIndex);
    this.setData({
      currentIndex: currentPageIndex,
    })
  },

  // 时限类型
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  //提交新订单
  addOrder: function () {
    var _this = this;
    var info = {
      'customerid': app.globalData.uniqueid,
      'name': _this.data.name,
      'mobile': _this.data.mobile,
      'ordertype': Number(_this.data.currentIndex) + 1,
      'content': _this.data.content,
      'timelimit': (_this.data.timelimit).constructor
    };
    console.log(info);
    var url = app.globalData.webapi + '/api/order/add';

    wx.request({
      url: url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: info,
      success: function (res) {
        console.log('提交成功！您的订单编号为：' + JSON.stringify(res.data.data));
        _this.setData({
          name: '',
          mobile: '',
          content: '',
          timelimit: 10
        });
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 2000
        });
      }
    })
  }
})

//用户登陆接口
function login(code) {
  console.log('调用登陆接口:' + code);
  wx.request({
    url: app.globalData.webapi + '/api/wx/login',
    data: {
      'code': code
    },
    success(data) {
      console.log(data);
      if (data.data.success) {
        console.log(data.data.data);
        app.globalData.uniqueid = data.data.data;
        //设置用户标识缓存
        wx.setStorage({
          data: (data.data.data),
          key: 'uniqueid',
        });
        console.log('设置缓存标识：' + app.globalData.uniqueid);
      }
    },
    fail(err) {
      console.log(JSON.stringify(err));
    }
  })
}

//加载用户信息
function getUser() {
  // 展示本地存储能力
  var logs = wx.getStorageSync('logs') || []
  logs.unshift(Date.now())
  wx.setStorageSync('logs', logs)
  // 登录
  wx.login({
    success: res => {
      console.log(res);
      //获取用户缓存标识
      wx.getStorage({
        key: 'uniqueid',
        success(value) {
          console.log('获取缓存用户标识：' + JSON.stringify(value));
          if (value) {
            //若该用户存在缓存信息，则判断该用户信息是否有效
            app.globalData.uniqueid = value.data;
            wx.request({
              url: app.globalData.webapi + '/api/customer/check?id=' + app.globalData.uniqueid,
              success(val) {
                //若用户信息无效， 则删除该用户缓存， 并重新创建用户信息，生成用户缓存
                if (!val.data.success) {
                  console.log(val.data.error);
                  wx.removeStorage({
                    key: 'uniqueid',
                  });
                  console.log('缓存已清除');
                  login(res.code);
                } else {
                  console.log('用户缓存标识有效：' + app.globalData.uniqueid);
                }
              }
            })
          }
        },
        fail(err) {
          console.log('获取缓存用户标识失败！' + JSON.stringify(err));
          //若无缓存标识，则调用登录接口， 创建用户信息并生成缓存标识
          login(res.code);
        }
      })
    }
  });
}