/**
 * Created by Administrator on 2017/3/28 0028.
 */

    const u=require('./init')
    const avalon = require('avalon2');
    require('./banner')

    require('../dist/mmRouter')


    var vm = avalon.define({
        $id: 'test',
        user:u.user,
        aaa: "第一页的内容",
        bbb: "第二页的内容",
        ccc: "第三页的内容",
        curPop:""
    })


    avalon.router.add("/aaa", function (a) {
        vm.curPop=require('./setting.html')
    })


    avalon.history.start({
        root: "/mmRouter"

    })



module.exports = avalon //注意这里必须返回avalon,用于webpack output配置

