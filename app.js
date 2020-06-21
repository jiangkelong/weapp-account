//app.js
import Toast from 'miniprogram_npm/@vant/weapp/toast/toast'
import {
  api
} from 'utils/api.js'
App({
  api: new api(),
  Promise: null,
  onLaunch: function () {
    this.Promise = this.login()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    memberInfo: null
  },

  // 登录
  //这里使用了Promise解决方案，Pomise是 ES6中的一个对象，从它可以获取异步操作的消息。
  //解决了当pages需要使用openid时，openid还未得到这个问题。
  login: function () {
    var that = this;
    var promise = new Promise(function (resolve, reject) {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          that.api.wxLogin(res.code)
            .then(r => {
              that.globalData.memberInfo = r;
              wx.setStorage({
                key: "openId",
                data: r.OpenId
              })
              wx.setStorage({
                key: "userId",
                data: r.UserId
              })
              resolve(r);
            })
        }
      })
    });
    return promise;
  }
})