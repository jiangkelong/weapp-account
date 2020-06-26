//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '欢迎您',
    userInfo: {},
    memberInfo: {},
    account:{},//账户余额
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showDialog:false,//绑卡对话框显示开关
    member:{},//绑定卡号用
    showDialogChangePassword:false,
    newPassword:""
  },
  onShow: function () {
    //页面显示时重新获取账户余额
    if(wx.getStorageSync('userId')){
      this.getBalance();
    }
  },
  onLoad: function () {
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo
      })
    } else{
    // 由于 wx.request是网络请求，可能会在 Page.onLoad 之后才返回
    //使用Promise
    app.Promise.then(value => {
      //console.log(value)
      this.setData({
        memberInfo:value
      })
      }, error => {
        // failure
      });
      if(wx.getStorageSync('userId')){
        this.getBalance();
      }
  }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
        }
      })
    }
  },
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取账户余额
  getBalance:function(){
    app.api.getBalance()
    .then(r => {
      //console.log(r)
      this.setData({
        account:r
      })
      wx.setStorage({
        key: "userId",
        data: r.UserId
      })
    })
  },
  //弹出绑定卡号对话框
  showBindCardDialog:function(){
    this.setData({
      showDialog:true
    })
  },
  //弹出修改密码对话框
  showChangePasswordDialog:function(){
    this.setData({
      showDialogChangePassword:true
    })
  },
  //双向绑定卡号memberCardNo
  bindInputChange:function(e){
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.member
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      member: m
    })
  },
  bindInputChangePassword:function(e){
    this.setData({
      newPassword: e.detail.value
    })
  },
  //绑定卡号
  bindCard:function(){
    if(this.data.member.MemberNo.trim()==''||this.data.member.Password.trim()==''){
      wx.showToast({
        title: '请正确输入卡号和密码',
        icon:'none',
        duration:2000
      })
      this.showBindCardDialog();//再次弹出模态框
    }
    else{
      let m = {
        ...this.data.member
      }
      m.OpenId = wx.getStorageSync('openId')

      app.api.bindCard(m)
      .then(r => {
        //console.log(r)
        this.setData({
          account:r,
          ['memberInfo.IsMember']:true
        })
        wx.setStorage({
          key: "userId",
          data: r.UserId
        })
        wx.showToast({
          title: '绑定会员卡成功',
          duration:2000
        })
      })
    }
  },
  //提交修改密码
  bindSaveChangePassword:function(){
    if(this.data.newPassword.trim()==''){
      wx.showToast({
        title: '请正确输入新密码',
        icon:'none',
        duration:2000
      })
      this.showChangePasswordDialog();//再次弹出模态框
    }
    else{
      app.api.customerChangePassword(this.data.newPassword.trim())
      .then(r => {
        wx.showToast({
          title: '修改密码成功',
          duration:2000
        })
      })
    }
  }
})
