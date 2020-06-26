// pages/workbench/collectionQrcode/collectionQrcode.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcode_url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.api.getQrcode()
      .then(r => {
        this.setData({
          qrcode_url: r
        })
      })
  }
})