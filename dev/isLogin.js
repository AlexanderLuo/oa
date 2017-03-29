/**
 * Created by Administrator on 2017/3/28 0028.
 */

    const user = JSON.parse(localStorage.getItem('user'));

    if (user == null) {
        location.href="/oa/login.html";
    }else{
        var avalon=require('avalon2')
        avalon.component('ms-banner', {
            template:require('./banner.html'),
            defaults: {
                user: user,
                loginOut:()=>{
                    localStorage.removeItem('user');
                    window.location.href = "./login.html"
                },
                open:()=>{
                  this.settingPop=require("./setting.html")
                },
                settingPop:""
            }
        });

        module.exports=user
    }







