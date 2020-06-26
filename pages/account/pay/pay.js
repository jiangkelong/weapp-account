// pages/account/pay/pay.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pay:{MakeManId:null,Money:null,Num:null,Password:null},
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('userId')) {
      // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      const scene = decodeURIComponent(options.scene)
      if(!scene){
        wx.showToast({
          title: '参数无效',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1900);
      }
      else{
        this.setData({
          ['pay.MakeManId']:scene,
          show:true
        })
      }
    } else {
      wx.showToast({
        title: '请先登录绑定会员卡',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../index/index',
        })
      }, 1900);
    }
  },
  bindInputChange: function (e) {
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.pay
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      pay: m
    })
  },
  paySubmit:function(){
    if(this.data.pay.Password == null || this.data.pay.Password.trim()==""){
      wx.showToast({
        title: '请正确输入密码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    const money = parseFloat(this.data.pay.Money)
    const num = parseFloat(this.data.pay.Num)
    if (money < 0 || num < 0 || (isNaN(money) && isNaN(num)) || (money == 0 && isNaN(num)) || (num == 0 && isNaN(money))) {
      wx.showToast({
        title: '请填写有效数值',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否确认支付？',
      success: (res) => {
        if (res.confirm) {
          const tmp = {
            ...this.data.pay
          }
          tmp.Money = isNaN(money) ? 0 : money
          tmp.Num = isNaN(num) ? 0 : num
          app.api.paySubmit(tmp)
            .then(r => {
              wx.showToast({
                title: '支付成功',
                duration: 1500,
                mask: true
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500);
            })
        }
      }
    })
    
  }
})