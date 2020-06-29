//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: '欢迎您',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showDialog:false,//绑卡对话框显示开关
    admin:{LoginName:'',Password:''},//绑定权限用
  },

  onLoad: function () {
    var that = this
    if (app.globalData.memberInfo) {
      this.setData({
        memberInfo: app.globalData.memberInfo
      })
    } else {
      // 由于 wx.request是网络请求，可能会在 Page.onLoad 之后才返回
      // 使用Promise
      app.Promise.then(function (value) {
        //console.log(value)
        that.setData({
          memberInfo: value
        })
      }, function (error) {
        // failure
      });
    }
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
        }
      })
    }
  },
  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //弹出绑定对话框
  showBindDialog:function(){
    this.setData({
      showDialog:true
    })
  },
  
  //双向绑定loginName
  bindInputChange:function(e){
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.admin
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      admin: m
    })
  },
  //绑定内部账号
  bindAdmin:function(){
    if(this.data.admin.LoginName.trim()=='' || this.data.admin.Password==''){
      wx.showToast({
        title: '请正确输入账号密码',
        icon:'none',
        duration:2000
      })
      this.showBindDialog();//再次弹出模态框
    }
    else{
      let m = {
        ...this.data.admin
      }
      m.OpenId = wx.getStorageSync('openId')
      app.api.bindAdmin(m)
      .then(r => {
        //console.log(r)
        this.setData({
          ['memberInfo.IsAdmin']:true,
          ['memberInfo.Name']:r.Name,
          ['memberInfo.RoleId']:r.RoleId,
          ['memberInfo.RoleName']:r.RoleName,
        })
        wx.setStorage({
          key: "userId",
          data: r.UserId
        })
        wx.showToast({
          title: '绑定成功',
          duration:2000
        })
      })
    }
  }
})