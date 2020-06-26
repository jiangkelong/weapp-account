import {
  config
} from 'config.js'

//定义错误码
const tips = {
  //10086:表示显示后端返回的错误信息
  1: "抱歉，出现了一个错误",
  401: "401：未登录",
  403: "403：token失效",
  404: "404：请求地址无效",
  500: "500：服务器错误"
}

class HTTP {
  request({
    url,
    data = {},
    method = 'get'
  }) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }
  _request(url, resolve, reject, data = {}, method = 'get') {
    var openid = wx.getStorageSync('openId') || '';
    var userid = wx.getStorageSync('userId');
    var header={
      'content-type': 'application/json',
      'openid': openid
    };
    if(userid){
      header.userid=userid
    }
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res.data.statusCode == 200) {
          resolve(res.data.data)
        } else {
          this._show_error(res.data.statusCode,res.data.message)
          //console.log(res)
          reject()
        }
      },
      fail: (err) => {
        //console.log(err)
        this._show_error()
        reject()
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  }
  _show_error(err_code, err_msg) {
    //console.log(err_code)
    var msg;
    if (!err_code) {
      msg = tips[1];
    }
    else if (err_code == 10086) {
      msg = err_msg;
    }
    else {
      msg = tips[err_code] || tips[1];
    }
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel:false
    })
    // wx.showToast({
    //   title: msg,
    //   icon: 'none',
    //   duration: 2000
    // })
  }
}

export {
  HTTP
}