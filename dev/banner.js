/**
 * Created by Administrator on 2017/4/5 0005.
 */


    const u=require('./init');
    const laydate= require("../dist/laydate/laydate")
    const layer=require('../dist/layer.min')


    avalon.component('ms-banner', {
        template:require('./banner.html'),
        defaults: {
            user: u.getUser(),
            settingPop:"",
            name:u.getUser().name,
            sex:u.getUser().sex,
            remark:u.getUser().remark,
            birth:new Date(u.getUser().birthday).Format("yyyy-MM-dd"),
            loginOut:()=>{
                localStorage.removeItem('user');
                window.location.href = "./login.html"
            },
            open:function(){
                this.settingPop=require("./setting.html")
            },
            close: function () {
                this.settingPop=""
            },
            save:function(){
                var _this=this;
                if(this.name.trim() == ""){
                    layer.msg("请填写完整");
                    return;
                }
                var data={
                    user_id:u.getUser().user_id,
                    name:this.name,
                    sex:this.sex,
                    birthday:new Date(_this.birth).getTime(),
                    remark:this.remark
                }

                $.ajax({
                    url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/userApi/editUserInfo" ,
                    type: "post",
                    data:data
                }).done(function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        var users = u.getUser()
                        users.name = _this.name;
                        users.remark = _this.remark;
                        users.sex = _this.sex;
                        users.birthday = new Date(_this.birth).getTime();
                        localStorage.setItem('user',JSON.stringify(users))
                        _this.user=u.getUser()
                    }
                    _this.close();
                    layer.msg("修改成功",1,9)
                })

            }
        }
    });


