/**
 * Created by Administrator on 2017/3/28 0028.
 */

    const user = JSON.parse(localStorage.getItem('user'));
    var conf={}

    if (user == null) {
        location.href="/oa/login.html";
    }else{
        var $=require('jquery')
        $.ajax({url: "/oa/conf/config.json"}).done((data)=>{
            conf=data
        })

        module.exports={
            user:user,
            conf:conf
        }

    }







