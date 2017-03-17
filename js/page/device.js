var conf={}
var user={}
function  error(){
    layer.msg("未知异常")
}
avalon.ready(function () {
    var vm = avalon.define({
        $id: "deviceVm",
        //公用

        degr_id: "",   //当前用户设备组


        deviceReq:0,
        ringReq: 0,
        rulerReq:0,
        steelyardReq:0,
        pageNo:1,
        pageSize:10,

        tegr_id:0,
        tegerList:[],

        //逻辑
        queryUrl:"",
        queryData:{},
        addUrl:"",
        addData:{},
        revUrl:"",
        revData:{},
        delUrl:"",
        delData:"",
        dataList:[],


        //控制
        weight:1,  //权限

        curPage: "ring",  //当前路由
        checkAllFlag:false,  //全选标志
        pop:false,
        popData:{},
        querytTeg:function(){
            $.ajax({url:conf.baseUrl+conf.getTegrList,type:"post",data:{user_id:user.user_id}}).done(function(data){
                var json = eval("(" + data + ")");// 解析json
                if (json.code == 200) {
                    var li=[{tegr_id:0,tegr_name:"默认"}]
                    li=li.concat(json.result)
                    vm.tegerList=li;
                }else{
                    error && error.call()
                }
            })
        }


        ,


        query:function(pageNo){
            vm.pageNo=pageNo;
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function(data){vm.queryHandle(data,vm["get"+path])})
        },
        del:function(){
            switch (vm.curPage){
                case "device":
                    vm.queryData= {
                        user_id: user.user_id,
                        tegr_id: user.tegr_id,
                        page: vm.pageNo,
                        page_size:  vm.pageSize,
                        last_req_time: vm.deviceReq
                    }
                    break;
                case "ring":
                    vm.queryData={
                        user_id: user.user_id,
                        degr_id: vm.degr_id,
                        page: vm.pageNo,
                        page_size:  vm.pageSize,
                        last_req_time: vm.ringReq
                    }
                    break;
                case "ruler":
                    var delete_ruler_id=""
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            delete_ruler_id=delete_ruler_id+vm.dataList[a].ruler_id
                            if(a!=vm.dataList.length-1){
                                delete_ruler_id=delete_ruler_id+","
                            }
                        }
                    }
                    vm.queryData={
                        user_id: user.user_id,
                        tegr_id: user.tegr_id,
                        delete_ruler_id: delete_ruler_id
                    };
                    break;
                case "steelyard":
                    var delete_scales_id="";
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            delete_scales_id=delete_scales_id+vm.dataList[a].scales_id
                            if(a!=vm.dataList.length-1){
                                delete_scales_id=delete_scales_id+","
                            }
                        }
                    }
                    vm.delData={
                        user_id: user.user_id,
                        tegr_id: user.tegr_id,
                        delete_scales_id:delete_scales_id
                    }
                    break;
            }
            var path = vm.upperPage();
            $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function(data){console.log(111)})

        },
        add:function(){
            var path = vm.upperPage();
            vm.popData.collecData();
            var check=vm.popData.isLegal();
            if(check){
                $.ajax({url: vm.addUrl, type: "post", data: vm.addData.$model}).done(function(data){vm.addHandle(data,vm["add"+path])})
            }else{
                console.log("worng");
            }
            vm.close();
        },
        rev:function(){
        },
        queryHandle:function(data,callback,error){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            }else{
                error && error.call()
            }
        },
        addHandle:function(data,callback,error){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            }else{
                error && error.call()
            }
        },
        //查询设备
        getDevice: function (json) {
            vm.deviceReq = json.result.last_req_time;
            var tar=json.result.list.filter(function(el){
                return el.user_id==user.user_id;
            });
            vm.degr_id=tar[0].degr_id;
            json.result.list.forEach(function(el){
                el.check=false;
            });
            vm.dataList = json.result.list;
        },
        //查询手环
        getRing: function (json) {
            vm.ringReq = json.result.last_req_time;
            json.result.list.forEach(function(el){
                el.check=false;
            });
            vm.dataList = json.result.list;
        },
        //身高尺
        getRuler: function (json) {
            vm.rulerReq = json.result.last_req_time;
            json.result.list.forEach(function(el){
                el.check=false;
            });
            vm.dataList = json.result.list;
        },
//                健康秤
        getSteelyard: function (json) {
            vm.steelyardReq= json.result.last_req_time;
            json.result.list.forEach(function(el){
                el.check=false;
            });
            vm.dataList = json.result.list;
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
            vm.tegr_id=0;

            var path = vm.upperPage();
            var c=conf;
            var b= c.baseUrl;
            vm.addUrl= b+ c["add"+path]
            vm.delUrl= b+ c["del"+path]
            vm.revUrl= b+ c["rev"+path]
            vm.queryUrl=b+c["query"+path]

            vm.pageAdapter();
            vm.query(1);
        },
        //单词首字母大写
        upperPage:function(){
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function(word){
                return word.substring(0,1).toUpperCase()+word.substring(1);
            });
            return word;
        },
        //路由适配
        pageAdapter:function(str){
            vm.queryData={}
            if(!str){
                switch (vm.curPage){
                    case "device":
                        vm.queryData= {
                            user_id: user.user_id,
                            tegr_id: user.tegr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.deviceReq
                        }
                        break;
                    case "ring":
                        vm.queryData={
                            user_id: user.user_id,
                            degr_id: vm.degr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.ringReq
                        }
                        break;
                    case "ruler":
                        vm.queryData={
                            user_id: user.user_id,
                            tegr_id: user.tegr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.ringReq
                        };
                        break;
                    case "steelyard":
                        vm.queryData={
                            user_id: user.user_id,
                            tegr_id: user.tegr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.ringReq
                        }
                        break;
                }
            }

        },
        //弹窗
        open:function(){
            vm.pop=vm.curPage;
            switch (vm.curPage){
                case "device":
                    vm.popData={
                        title:"设备组",
                        rows:[{name:"集团ID",key:"",value:""},{name:"所属用户ID",key:"",value:""},{name:"设备组名称",key:"",value:""}],
                        isLegal:function(){
                            if(vm.popData.rows[0].value==""){
                                return false;
                            } else{
                                return true;
                            }
                        },
                        collecData:function(){
                            vm.addData={
                                tegr_id:vm.popData.rows[0].value,
                                user_id:vm.popData.rows[1].value,
                                degr_name:vm.popData.rows[2].value
                            }
                        }
                    }
                    break;
                case "ring":
                    vm.popData={
                        title:"手环",
                        rows:[{name:"学生ID",key:"",value:""},{name:"设备组ID",key:"",value:""},{name:"手环编号",key:"",value:""},{name:"手环地址",key:"",value:""}]
                    }
                    break;
                case "ruler":
                    vm.popData={
                        title:"身高尺",
                        rows:[{name:"身高尺编号",key:"",value:""},{name:"身高尺地址",key:"",value:""},{name:"集团ID",key:"",value:""}]
                    }
                    break;
                case "steelyard":
                    vm.popData={
                        title:"健康秤",
                        rows:[{name:"健康秤编号",key:"",value:""},{name:"健康秤地址",key:"",value:""},{name:"集团ID",key:"",value:""}]
                    }
                    break;
            }

        },
        delPop:function () {
          layer.confirm("确定删除吗？",function () {
                vm.del()
                layer.closeAll()},layer.closeAll())
        },



        //关掉
        close:function(){
            vm.pop=false;
        },
        //全选
        checkAll:function(){
            vm.checkAllFlag=!vm.checkAllFlag
            vm.dataList.forEach(function(el){
                el.check=vm.checkAllFlag;
            })
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

        //初始化
        init: function () {
            var userr = getLocalValue('user');
            if (userr == null) {location.href="/oa/login.html";}
            user = userr;
            var ty=user.role_type;
            if(ty=="8"){vm.weight=2}
            else if(ty=="16" || ty=="32"){vm.weight=3}
            else{vm.weight=1}
            $.ajax({
                url: "/oa/conf/config.json",
                success: function(res){
                    conf=res
                     vm.querytTeg();
                     vm.router("device")
                },
                complete:function(res){
                    conf=eval("("+res.responseText+")")
                    vm.querytTeg();
                    vm.router("device")
                }
            });



        }
    })



    avalon.scan()
    vm.init();
    vm.$watch("tegr_id",function(data){
        vm.queryData.tegr_id=data;
        vm.query(1)
    })

})