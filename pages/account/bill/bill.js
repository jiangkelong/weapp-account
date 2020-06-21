//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageParm: { CurrentPage: 1, Limit: 30},
    pageLoadSwitch:true,//分页数据加载开关
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
    app.api.getBillPageList(this.data.pageParm)
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
  }
})