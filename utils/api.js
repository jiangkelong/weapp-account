import {HTTP} from 'http.js'

class api extends HTTP{
  //登录
  wxLogin(js_code){
    //返回的是一个promise
    return this.request({
      url:'Weapp/wxLogin',
      data:{'js_code':js_code}
    })
  }
  //客户修改密码
  customerChangePassword(newPassword){
    //返回的是一个promise
    return this.request({
      url:'Weapp/CustomerChangePassword',
      data:{'newPassword':newPassword}
    })
  }
  //获取账户余额
  getBalance(){
    return this.request({
      url:'Weapp/getBalance'
    })
  }
  //绑定会员卡号
  bindCard(parm){
    return this.request({
      url:'Weapp/BindMemberCard',
      data:parm,
      method: 'post'
    })
  }
  //获取角色列表
  getRoleList(){
    return this.request({
      url:'Weapp/GetRoleList'
    })
  }
  //绑定工作人员账号
  bindAdmin(parm){
    return this.request({
      url:'Weapp/BindAdmin',
      data:parm,
      method: 'post'
    })
  }
  //获取工作人员列表
  getWorkingPersonnelList(){
    return this.request({
      url:'Weapp/GetWorkingPersonnelList'
    })
  }
  //保存工作人员账号信息
  saveWorkingPersonnel(parm){
    return this.request({
      url:'Weapp/SaveWorkingPersonnel',
      data:parm,
      method: 'post'
    })
  }
  //删除工作人员账号信息
  delWorkingPersonnel(id){
    return this.request({
      url:'Weapp/DelWorkingPersonnel',
      data:{'id':id}
    })
  }
  //获取会员列表
  getMemberPageList(pageParm){
    return this.request({
      url:'Weapp/GetMemberList',
      data:pageParm,
      method: 'post'
    })
  }
  //保存会员信息
  saveMember(parm){
    return this.request({
      url:'Weapp/SaveMember',
      data:parm,
      method: 'post'
    })
  }
  //删除会员信息
  delMember(id){
    return this.request({
      url:'Weapp/DelMember',
      data:{'id':id}
    })
  }
  //重置会员密码
  resetMemberPassword(id){
    return this.request({
      url:'Weapp/ResetMemberPassword',
      data:{'id':id}
    })
  }
  //充值、收款
  changeBalance(parm){
    return this.request({
      url:'Weapp/ChangeBalance',
      data:parm,
      method: 'post'
    })
  }
  //工作人员获取账户变动记录列表
  getChargeLogPageList(pageParm){
    return this.request({
      url:'Weapp/GetChargeLogList',
      data:pageParm,
      method: 'post'
    })
  }
  //客户获取账单
  getBillPageList(pageParm){
    return this.request({
      url:'Weapp/GetBillList',
      data:pageParm,
      method: 'post'
    })
  }
  //客户付款
  paySubmit(parm){
    return this.request({
      url:'Weapp/PaySubmit',
      data:parm,
      method: 'post'
    })
  }

  getQrcode(parm){
    return this.request({
      url:'Weapp/CreateQRCode'
    })
  }
}
export {api}