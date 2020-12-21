//app.js

App({
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },
  globalData: {
    uniqueid: 0,
    userInfo: null,
    // webapi: 'https://localhost:44333',
    // webapi: 'http://www.bigfish-develop.cn',
    webapi: 'http://112.126.90.220:11080',
    defaultPhone: ''
  }
})