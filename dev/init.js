/**
 * Created by Administrator on 2017/3/28 0028.
 */
    var user=JSON.parse(localStorage.getItem('user'))
    var conf={}
    if (user == null) {
        location.href="/oa/login.html";
    }else{
        $.ajax({
            url: "/oa/conf/config.json",
            async: false}).done(function(data){
            conf=data
        })

        module.exports={
            getUser:function(){
                return JSON.parse(localStorage.getItem('user'));
            },
            getConf:function(){
                return conf
            }
        }
    }







