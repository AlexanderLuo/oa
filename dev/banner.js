/**
 * Created by Administrator on 2017/4/5 0005.
 */

    const u=require('./init');
    const avalon=require('avalon2')

    avalon.component('ms-banner', {
        template:require('./banner.html'),
        defaults: {
            user: u.user,
            loginOut:()=>{
                localStorage.removeItem('user');
                window.location.href = "./login.html"
            }
        }
    });

