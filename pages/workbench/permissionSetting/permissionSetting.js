// pages/workbench/permissionSetting/permissionSetting.js
//获取应用实例
const app = getApp()
const _model = {
  Id: 0,
  Name: "",
  LoginName: "",
  Password: "",
  RoleId: 2
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleList: [],
    list: [],
    model: {},
    index: 0,
    showDialogEdit: false,
    dialogTitle: '添加'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.getRoleList();
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
  //获取工作人员列表
  getList: function () {
    app.api.getWorkingPersonnelList()
      .then(r => {
        //console.log(r)
        this.setData({
          list: r
        })
      })
  },
  //获取权限列表
  getRoleList: function () {
    app.api.getRoleList()
      .then(r => {
        //console.log(r)
        this.setData({
          roleList: r
        })
      })
  },
  //弹出添加对话框
  showAddDialog: function () {
    this.setData({
      showDialogEdit: true,
      dialogTitle: '添加',
      model: {
        ..._model
      }
    })
  },
  //弹出修改对话框
  showEditDialog: function (event) {
    const tmp = event.currentTarget.dataset.item
    let i = this.data.roleList.findIndex(v => v.RoleId === tmp.RoleId) //查找RoleId在角色列表中的索引
    this.setData({
      showDialogEdit: true,
      dialogTitle: '修改',
      ['model.Id']: tmp.Id,
      ['model.LoginName']: tmp.LoginName,
      ['model.Password']: tmp.Password,
      ['model.Name']: tmp.Name,
      ['model.RoleId']: tmp.RoleId,
      index: i
    })
  },
  //选择器改变赋值
  bindPickerChange: function (e) {
    //console.log(this.data.roleList[e.detail.value].RoleId)
    const roleId = this.data.roleList[e.detail.value].RoleId;
    this.setData({
      index: e.detail.value,
      ['model.RoleId']: roleId
    })
  },
  //双向绑定
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
  //保存
  bindSave: function () {
    if (this.data.model.LoginName.trim() == "" || this.data.model.Password.trim() == "" || this.data.model.Name.trim() == "") {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        showDialogEdit: true
      })
      return;
    }
    app.api.saveWorkingPersonnel(this.data.model)
      .then(r => {
        wx.showToast({
          title: '保存成功',
          duration: 1500
        })
        setTimeout(() => {
          this.getList()
        }, 1500);
      })
  },
  //删除
  delItem: function (event) {
    const idx = event.currentTarget.dataset.index
    const id=this.data.list[idx].Id
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success:(res) =>{
        if (res.confirm) {
          app.api.delWorkingPersonnel(id)
            .then(r => {
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })
              //移除
              const tmpList=this.data.list
              tmpList.splice(idx,1)
              this.setData({
                list:tmpList
              })
            })
        }
      }
    })
  }
})