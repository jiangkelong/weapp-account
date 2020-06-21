// pages/workbench/memberList/memberList.js
//获取应用实例
const app = getApp()
const _model = {
  MemberId: 0,
  MemberNo: "",
  MemberName: "",
  Tel: ""
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    model: {},
    index: 0,
    pageParm: { CurrentPage: 1, Limit: 30,QueryWords:''},
    pageLoadSwitch:true,//分页数据加载开关
    showDialogEdit: false,
    dialogTitle: '添加'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  //下拉触底
  onReachBottom:function(options){
    if(!this.data.pageLoadSwitch)
    return;
    let nextPage=this.data.pageParm.CurrentPage + 1
    this.setData({
      ['pageParm.CurrentPage']:nextPage
    })
    this.getList();
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > -50 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  //分页获取会员列表
  getList: function (refresh) {
    if(refresh){
      this.setData({
        list:[],
        ['pageParm.CurrentPage']:1
      })
    }
    app.api.getMemberPageList(this.data.pageParm)
      .then(r => {
        //console.log(r.Items.length)
        var tempList=this.data.list
        tempList=tempList.concat(r.Items)
        this.setData({
          list: tempList,
          pageLoadSwitch:true
        })
        if(r.Items.length<this.data.pageParm.Limit){
          this.setData({
            pageLoadSwitch: false
          })
        }
      })
  },
  //搜索
  bindSearch:function(){
    this.setData({
      list:[],
      ['pageParm.CurrentPage']:1
    })
    this.getList();
  },
  //弹出添加会员对话框
  showAddDialog: function () {
    this.setData({
      showDialogEdit: true,
      dialogTitle: '添加',
      model: {
        ..._model
      }
    })
  },
  //弹出修改会员对话框,不修改余额
  showEditDialog: function (event) {
    const tmp = event.currentTarget.dataset.item
    this.setData({
      showDialogEdit: true,
      dialogTitle: '修改',
      ['model.MemberId']: tmp.MemberId,
      ['model.MemberNo']: tmp.MemberNo,
      ['model.MemberName']: tmp.MemberName,
      ['model.Tel']: tmp.Tel
    })
  },
  //双向绑定
  bindInputSearchChange: function (e) {
    this.setData({
      ['pageParm.QueryWords']: e.detail.value
    })
  },
  bindInputChange: function (e) {
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.model
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      model: m
    })
  },
  //保存会员
  bindSave: function () {
    if (this.data.model.MemberNo.trim() == "") {
      wx.showToast({
        title: '请填写会员编号',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        showDialogEdit: true
      })
      return;
    }
    app.api.saveMember(this.data.model)
      .then(r => {
        wx.showToast({
          title: '保存成功',
          duration: 1500
        })
        setTimeout(() => {
          this.getList(true)
        }, 1500);
      })
  },
  //删除
  delItem: function (event) {
    const idx = event.currentTarget.dataset.index
    const id = event.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: (res) => {
        if (res.confirm) {
          app.api.delMember(id)
            .then(r => {
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })
              //移除
              const tmpList = this.data.list
              tmpList.splice(idx, 1)
              this.setData({
                list: tmpList
              })
            })
        }
      }
    })
  },
  //重置密码
  resetPassword: function (event) {
    const id = event.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否确认重置密码？',
      success: (res) => {
        if (res.confirm) {
          app.api.resetMemberPassword(id)
            .then(r => {
              wx.showToast({
                title: '重置成功',
                duration: 1500
              })
            })
        }
      }
    })
  },
})