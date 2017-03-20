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


        pageSize:4,
        pageNo:1,
        total:1,
        records:0,

        tegr_id:0,
        tegerList:[],

        addTegr:"",
        addUser:"",
        addName:"",
        addDegr:0,
        addNo:"",
        addAddr:"",

        userList:[{name:"请选择",user_id:0}],



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
        deviceReq:0,
        ringReq: 0,
        rulerReq:0,
        steelyardReq:0,


        //控制
        weight:1,  //权限
        curPage: "device",  //当前路由
        checkAllFlag:false,  //全选标志
        pop:false,
        popData:{},
        edit:false,


        //查看
        degrName:"",


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
        },
        query:function(pageNo){
            vm.pageNo=pageNo;
            vm.records=0;
            vm.total=1;
            vm.checkAllFlag=false;
            vm.queryData.page=pageNo;
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function(data){vm.queryHandle(data,vm["get"+path])})
        },
        del:function(){
            var ids=""
            var li=[]
            switch (vm.curPage){
                case "device":
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            li.push(vm.dataList[a].degr_id)
                        }
                    }
                    for(var b=0;b<li.length;b++){
                        ids=ids+li[b]
                        if(b!=li.length-1){
                            ids=ids+","
                        }
                    }
                    vm.delData= {
                        user_id: user.user_id,
                        delete_degr_id:ids
                    }
                    break;
                case "ring":
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            li.push(vm.dataList[a].bracelet_id)
                        }
                    }
                    for(var b=0;b<li.length;b++){
                        ids=ids+li[b]
                        if(b!=li.length-1){
                            ids=ids+","
                        }
                    }
                    vm.delData={
                        user_id: user.user_id,
                        delete_bracelet_id: ids
                    };
                    break;
                case "ruler":
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            li.push(vm.dataList[a].ruler_id)
                        }
                    }
                    for(var b=0;b<li.length;b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData={
                        user_id: user.user_id,
                        tegr_id: user.tegr_id,
                        delete_ruler_id: ids
                    };
                    break;
                case "steelyard":
                    for(var a=0;a<vm.dataList.length;a++){
                        if(vm.dataList[a].check==true){
                            li.push(vm.dataList[a].scales_id)
                        }
                    }
                    for(var b=0;b<li.length;b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData={
                        user_id: user.user_id,
                        tegr_id: user.tegr_id,
                        delete_scales_id:ids
                    }
                    break;
            }

            var path = vm.upperPage();
            $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function(data){vm.query(1)})

        },
        add:function(){
            var path = vm.upperPage();
            var check=vm.addData.isLegal();
            if(check){
                console.log(vm.addData.collecData())
                $.ajax({url: vm.addUrl, type: "post", data: vm.addData.collecData()}).done(function(data){
                    vm.close();
                    vm.query(1)
                })
            }else{
                layer.msg("请填写完整")
            }

        },
        rev:function(){
        },
        seeRing:function(el){
            vm.degrName=el.degr_name
            vm.degr_id=el.degr_id
            vm.addDegr=el.degr_id
            vm.router('ring')
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
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)

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

        //路由
        router: function (str) {
            vm.dataList=[];
            vm.checkAllFlag=false;
            vm.curPage=str;
            vm.addUrl="";
            vm.addTegr=0;
            vm.addName=""


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
        open:function(el){
            vm.pop=vm.curPage;
            switch (vm.curPage){
                case "device":
                    if(el){
                        //vm.addTegr=el.
                    }
                    vm.addData={
                        isLegal:function(){
                            var data=vm.addData.collecData();
                            if(data.tegr_id==0 || data.user_id==0 || data.degr_name.trim()==""){
                                return false;
                            } else{
                                return true;
                            }
                        },
                        collecData:function(){
                            return{
                                tegr_id:vm.addTegr,
                                user_id:vm.addUser,
                                degr_name:vm.addName
                            }
                        }
                    }
                    break;
                case "ring":
                    vm.addData={
                        isLegal:function(){
                            var data=vm.addData.collecData();
                            if(data.addDegr==0 || data.bracelet_no.trim()=="" || data.bracelet_address.trim()==""){
                                return false;
                            } else{
                                return true;
                            }
                        },
                        collecData:function(){
                            return{
                                degr_id:vm.addDegr,
                                bracelet_no:vm.addNo,
                                bracelet_address:vm.addAddr
                            }
                        }
                    }
                    break;
                case "ruler":
                    vm.addData={
                        isLegal:function(){
                            var data=vm.addData.collecData();
                            if(data.tegr_id==0 || data.user_id==0 || data.ruler_no.trim()=="" || data.ruler_addr.trim()==""){
                                return false;
                            } else{
                                return true;
                            }
                        },
                        collecData:function(){
                            return{
                                tegr_id:vm.addTegr,
                                user_id:vm.addUser,
                                ruler_no:vm.addNo,
                                ruler_addr:vm.addAddr

                            }
                        }
                    }
                    break;
                case "steelyard":
                    vm.addData={
                        isLegal:function(){
                            var data=vm.addData.collecData();
                            if(data.tegr_id==0 || data.user_id==0 || data.scales_no.trim()=="" || data.scales_addr.trim()==""){
                                return false;
                            } else{
                                return true;
                            }
                        },
                        collecData:function(){
                            return{
                                tegr_id:vm.addTegr,
                                user_id:vm.addUser,
                                scales_no:vm.addNo,
                                scales_addr:vm.addAddr
                            }
                        }
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
            vm.addNo=""
            vm.addAddr=""
            vm.addUser=""
            vm.addName=""
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
                // success: function(res){
                //     conf=res
                //     vm.router("device")
                //     vm.querytTeg()
                // },
                complete:function(res){
                    conf=eval("("+res.responseText+")")
                    vm.router("device")
                    vm.querytTeg()
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
    //添加设备组联动
    vm.$watch("addTegr",function(data){
        if(data==0){
            vm.userList=[{name:"请选择",user_id:0}]
            return
        }
        $.ajax({url:conf.baseUrl+conf.getTeacherList,type:"post",data:{user_id:user.user_id,tegr_id:data,page:1,page_size:800,last_req_time:0}}).done(function(data){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                vm.userList=json.result.list;
                vm.addUser=vm.userList[0].user_id
            }else{
                error && error.call()
            }
        })
    })
    avalon.filters.addFilter=function(str){
        if(str=="默认"){
            return "请选择"
        }else {
            return str}
    }


})