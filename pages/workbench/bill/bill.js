// pages/workbench/bill/bill.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0,
    pageParm: { CurrentPage: 1, Limit: 30,MemberNo:'',MemberName:'',MakeMan:'',BeginDate:'',EndDate:''},
    pageLoadSwitch:true,//分页数据加载开关
    types:['全部','充值','收款'],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.pageLoadSwitch)
    return;
    let nextPage=this.data.pageParm.CurrentPage + 1
    this.setData({
      ['pageParm.CurrentPage']:nextPage
    })
    this.getList();
  },
  //分页获取列表
  getList: function () {
    app.api.getChargeLogPageList(this.data.pageParm)
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
  //弹出搜索对话框
  showQueryDialog: function () {
    this.setData({
      showDialog: true
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
  bindInputChange: function (e) {
    let item = e.currentTarget.dataset.item; //在每个input绑定不同的item作为标识
    const m = {
      ...this.data.pageParm
    }
    m[item] = e.detail.value //对象的属性名称是动态判定时，通过方括号标记访问
    this.setData({
      pageParm: m
    })
  },
  //选择器改变赋值
  bindPickerChange: function (e) {
    const type = this.data.types[e.detail.value];
    this.setData({
      index: e.detail.value,
      ['pageParm.Type']: type
    })
  },
  BeginDateChange: function (e) {
    this.setData({
      ['pageParm.BeginDate']: e.detail.value
    })
  },
  EndDateChange: function (e) {
    this.setData({
      ['pageParm.EndDate']: e.detail.value
    })
  },
})