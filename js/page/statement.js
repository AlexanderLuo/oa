/**
 * Created by Administrator on 2017/3/16 0016.
 */
avalon.ready(function () {
    var vm = avalon.define({
        $id: "statementVm",
        //公用
        conf:{},
        user: {},
        degr_id: "",   //当前用户设备组
        dataList:[],
        lastReq: 0,
        weight:1,  //权限
        curPage: "",  //当前路由
        checkAllFlag:false,  //全选标志
        pop:false,
        pageNo:1,
        pageSize:10,


        deviceReq:0,
        ringReq: 0,
        rulerReq:0,
        steelyardReq:0,

        query:function(pageNo){
            vm.pageNo=pageNo;
            if(vm.curPage=="device"){vm.getDevice()}
            if(vm.curPage=="ring"){  vm.getRing()}
            if(vm.curPage=="ruler"){ vm.getRuler()}
            if(vm.curPage=='steelyard'){ vm.getSteelyard()}
        },
        del:function(){
            if(vm.curPage=="device"){vm.getDevice()}
            if(vm.curPage=="ring"){  vm.getRing()}
            if(vm.curPage=="ruler"){ vm.getRuler()}
            if(vm.curPage=='steelyard'){ vm.getSteelyard()}
        },
        add:function(){
            if(vm.curPage=="device"){vm.getDevice()}
            if(vm.curPage=="ring"){  vm.getRing()}
            if(vm.curPage=="ruler"){ vm.getRuler()}
            if(vm.curPage=='steelyard'){ vm.getSteelyard()}
        },
        rev:function(){
            if(vm.curPage=="device"){vm.getDevice()}
            if(vm.curPage=="ring"){  vm.getRing()}
            if(vm.curPage=="ruler"){ vm.getRuler()}
            if(vm.curPage=='steelyard'){ vm.getSteelyard()}
        },
        //查询设备
        getDevice: function () {
            $.ajax({
                url: vm.conf.baseUrl+vm.conf.queryDevice,
                type: "post",
                data: {
                    user_id: vm.user.user_id,
                    tegr_id: vm.user.tegr_id,
                    page: vm.pageNo,
                    page_size:  vm.pageSize,
                    last_req_time: vm.deviceReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.deviceReq = json.result.last_req_time;
                        var tar=json.result.list.filter(function(el){
                            return el.user_id==vm.user.user_id;
                        })
                        vm.degr_id=tar[0].degr_id
                        json.result.list.forEach(function(el){
                            el.check=false;
                        })
                        vm.dataList = json.result.list;
                    }

                }
            })
        },
        //查询手环
        getRing: function () {
            $.ajax({
                url: vm.conf.baseUrl+vm.conf.queryRing,
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    degr_id: vm.degr_id,
                    page: vm.pageNo,
                    page_size:  vm.pageSize,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.ringReq = json.result.last_req_time;
                        json.result.list.forEach(function(el){
                            el.check=false;
                        })
                        vm.dataList = json.result.list;
                    }
                }

            })
        },
        //身高尺
        getRuler: function () {
            $.ajax({
                url: vm.conf.baseUrl+vm.conf.queryRuler,
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    tegr_id: vm.user.tegr_id,
                    page: vm.pageNo,
                    page_size:  vm.pageSize,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.rulerReq = json.result.last_req_time;
                        json.result.list.forEach(function(el){
                            el.check=false;
                        })
                        vm.dataList = json.result.list;
                    }
                }

            })
        },
//                健康秤
        getSteelyard: function () {
            $.ajax({
                url: vm.conf.baseUrl+vm.conf.querySteelyard,
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    tegr_id: vm.user.tegr_id,
                    page: vm.pageNo,
                    page_size:  vm.pageSize,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    console.log(json);
                    if (json.code == 200) {
                        vm.steelyardReq= json.result.last_req_time;
                        json.result.list.forEach(function(el){
                            el.check=false;
                        })
                        vm.dataList = json.result.list;
                    }
                }

            })
        },
        delDevice:function(){
        },
        delRing:function(){
        },
        delRuler:function(){
        },
        delSteelyard:function(){
        },
        addDevice:function(){
        },
        addRing:function(){
        },
        addRuler:function(){
        },
        addSteelyard:function(){
        },
        revDevice:function(){
        },
        revRing:function(){
        },
        revRuler:function(){
        },
        revSteelyard:function(){
        },

        //路由
        router: function (str) {
            vm.dataList=[];
            vm.checkAllFlag=false;
            vm.curPage=str;
            vm.query(1);
        },
        //单选
        checkOne:function(el){
            el.check=!el.check;
            var no=vm.dataList.filter(function(al){
                return al.check==false;
            })
            if(no.length==0){
                vm.checkAllFlag=true
            }
            if(no.length>0){
                vm.checkAllFlag=false
            }

        },
        //弹窗
        open:function(str){

            vm.pop=true;
        },
        //全选
        checkAll:function(){
            vm.checkAllFlag=!vm.checkAllFlag
            vm.dataList.forEach(function(el){
                el.check=vm.checkAllFlag;
            })
        },
        //初始化
        init: function () {
            var user = getLocalValue('user');
            if (user == null) {location.href="/oa/login.html";}
            vm.user = user;
            var ty=user.role_type;
            if(ty=="8"){vm.weight=2}
            else if(ty=="16" || ty=="32"){vm.weight=3}
            else{vm.weight=1}
            $.ajax({
                url: "/oa/conf/config.json",
                async:false,
                success: function(res){
                    vm.conf=res
                }
            });
            vm.router("device")
        }
    })

    avalon.scan()
    vm.init();

})