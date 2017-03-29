/**
 * Created by Administrator on 2017/3/28 0028.
 */



    const user=require('./isLogin')
    const avalon = require('avalon2');


    var vm = avalon.define({
        $id: 'test',
        user:user,
        aaa: "第一页的内容",
        bbb: "第二页的内容",
        ccc: "第三页的内容",
    })



