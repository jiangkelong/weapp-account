//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0,
    pageParm: { CurrentPage: 1, Limit: 10,QueryWords:''},
    pageLoadSwitch:true,//分页数据加载开关
    charge: {},
    showDialogCharge: false,
    dialogChargeTitle: '充值'
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
    app.api.getMemberPageList(this.data.pageParm,this.data.queryWords)
      .then(r => {
        //console.log(r.Items.length)
        var tempList=this.data.list
        tempList=tempList.concat(r.Items)
        this.setData({
          list: tempList,
          pageLoadSwitch:true
        })
        if(r.Items.length<=this.data.pageParm.Limit){
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
  //弹出充值收款编辑框
  showChargeDialog: function (event) {
    const index = event.currentTarget.dataset.index
    const type = event.currentTarget.dataset.type
    const id = event.currentTarget.dataset.id
    const title = type == 'recharge' ? '充值' : '收款'

    this.setData({
      showDialogCharge: true,
      dialogChargeTitle: title,
      ['charge.MemberId']: id,
      ['charge.Money']: null,
      ['charge.Num']: null,
      ['charge.Type']: type
    })
  },
  //双向绑定
  bindInputSearchChange: function (e) {
    this.setData({
      ['pageParm.QueryWords']: e.detail.value
    })
  },
  bindInputChangeCharge: function (e) {
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.charge
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      charge: m
    })
  },
  //提交充值/收款
  bindChargeSave: function () {
    const money = parseFloat(this.data.charge.Money)
    const num = parseFloat(this.data.charge.Num)
    if (money < 0 || num < 0 || (isNaN(money) && isNaN(num)) || (money == 0 && isNaN(num)) || (num == 0 && isNaN(money))) {
      wx.showToast({
        title: '请填写有效数值',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        showDialogCharge: true
      })
      return;
    }
    const tmp = {
      ...this.data.charge
    }
    tmp.Money = isNaN(money) ? 0 : money
    tmp.Num = isNaN(num) ? 0 : num
    app.api.changeBalance(tmp)
      .then(r => {
        wx.showToast({
          title: '提交成功',
          duration: 1500
        })
        setTimeout(() => {
          this.getList(true)
        }, 1500);
      })
  },
})