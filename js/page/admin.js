var conf={}
var user={}
function  error(){
    layer.msg("未知异常")
}

avalon.ready(function () {
    var vm = avalon.define({
        $id: "adminVm",
        tegr_id: 0,   //集团ID
        school_id:0,//学校ID
        class_id:0,


        tegerList: [],

        list:[],







        tegerReq: 0,
        teacherReq:0,
        schoolReq:0,
        classReq:0,
        parentReq:0,
        studentReq:0,




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
        popData:{},
        //控制
        weight:1,  //权限
        curPage: "",  //当前路由
        checkAllFlag:false,  //全选标志
        pop:false,
        //数据
        pageSize:4,
        pageNo:1,
        total:1,
        records:0,

        //查看集团下的老师
        tegrName:"",
        schoolName:"",
        className:"",
        isReving:false,

        //查询条件
        teger_search:0,
        school_search:0,


        addName:"",


        addAccount:"",
        addSummary:"",
        addRole:"",
        //集团添加
        addTegrName:"",
        addAdmin:"",
        adminList: [],
        //学校添加
        addTegr:"",
        addSchoolName:"",
        addAddr:"",
        addPhone:"",
        addUserName:"",




        //单词首字母大写
        upperPage:function(){
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function(word){
                return word.substring(0,1).toUpperCase()+word.substring(1);
            });
            return word;
        },
        querytTeg:function(callback){
            $.ajax({url:conf.baseUrl+conf.getTegrList,type:"post",data:{user_id:user.user_id}}).done(function(data){
                var json = eval("(" + data + ")");// 解析json
                if (json.code == 200) {
                    vm.tegerList=json.result;
                    vm.tegr_id=vm.tegerList[0].tegr_id
                    callback();
                }else{
                    error && error.call()
                }
            })
        },
        query:function (pageNo) {
            vm.pageNo=pageNo;
            vm.records=0;
            vm.total=1;
            vm.checkAllFlag=false;
            vm.queryData.page=pageNo;
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function(data){vm.queryHandle(data,vm["get"+path])})
            if(vm.curPage=='teger'){
                $.ajax({
                    url:conf.baseUrl+conf.queryAdmin,
                    data:{
                        user_id: user.user_id
                    },
                    type:"post"
                }).done(function(data){vm.queryHandle(data,function(json){
                    vm.adminList=json.returnObject
                })})
            }
        },
        add:function(){
            if(vm.isReving){
                vm.rev();
                return;
            }
            console.log(11)
            var path = vm.upperPage();
            var check=vm.popData.isLegal();
            if(check){
                console.log(vm.popData.collecData())
                $.ajax({url: vm.addUrl, type: "post", data: vm.popData.collecData()}).done(function(data){
                    vm.close();
                    vm.query(1)
                })
            }else{
                layer.msg("请填写完整")
            }

        },
        queryHandle:function(data,callback,error){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            }else{
                error && error.call()
            }
        },
        open:function(el){
            console.log(el)
            vm.pop=vm.curPage;
            vm.popData={
                isLegal:function(){},
                collecData:function(){}
            }
            switch (vm.curPage){
                case 'admin':
                    if(el){


                    }else{
                        vm.popData={
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
                                    scales_addr:vm.addAddr,
                                    login_user_id:user.user_id
                                }
                            }
                        }
                    }
                    break;
                case 'teger':
                    if(el){

                    }else{
                        vm.popData={


                        }
                    }
                    break;
                case 'school':
                    if(el){

                    }else{
                        vm.popData={
                            isLegal:function(){
                                var data=vm.popData.collecData();
                                if(data.tegr_id==0 || data.user_id==0 || data.school_person.trim()=="" ||data.school_name.trim()=="" || data.school_call.trim()=="" || data.school_address.trim()==""){
                                    return false;
                                } else{
                                    return true;
                                }
                            },
                            collecData:function(){
                                return{
                                    tegr_id:vm.addTegr,
                                    school_name:vm.addSchoolName,
                                    school_call:vm.addPhone,
                                    school_person:vm.addUserName,
                                    school_address:vm.addAddr
                                }
                            }
                        }
                    }

                    break;
            }
        },
        getAdmin: function (json) {
            var li=json.returnObject;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList= li;
        },
        getTeger: function (json) {
            var li=json.result;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList= li;
        },

        getTeacher: function (json) {
            vm.teacherReq = json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            var li=json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })

            vm.dataList = li;

        },
        getSchool: function (json) {
            vm.schoolReq = json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)

            var li=json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList = li
        },
        getClass: function (json) {
            vm.classReq= json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            var li=json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList = li
        },
        getParent: function (json) {

            vm.parentReq = json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList = li
        },
        getStudent: function (json) {
            vm.studentReq= json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            var li=json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check=false;
            })
            vm.dataList = li
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
        router: function (str) {
            vm.dataList=[];
            vm.checkAllFlag=false;
            vm.curPage=str;
            vm.addUrl="";
            vm.addTegr=0;
            vm.addName=""
            vm.tegr_id=vm.tegerList[0].tegr_id;

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
        pageAdapter:function (str) {
            vm.queryData={}
            if(!str){
                switch (vm.curPage){
                    case "admin":
                        vm.queryData= {
                            user_id: user.user_id,
                        }
                        break;
                    case "teger":
                        vm.queryData={
                            user_id: user.user_id,
                            degr_id: vm.degr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.tegerReq
                        }
                        break;
                        //todo 配置tegr ID
                    case "teacher":
                        console.log(vm.tegr_id)
                        vm.queryData={
                            user_id: user.user_id,
                            tegr_id: vm.tegr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.teacherReq
                        };
                        break;
                    //todo 配置tegr ID
                    case "school":
                        vm.queryData={
                            tegr_id: user.tegr_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.schoolReq
                        }
                        break;
                    case "class":
                        vm.queryData={
                            tegr_id: vm.tegr_id,
                            school_id:vm.school_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.classReq
                        }
                        break;
                    //todo 配置tegr ID
                    case "parent":
                        vm.queryData={
                            tegr_id: vm.tegr_id,
                            school_id:vm.school_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.parentReq
                        }
                        break;
                    case "student":
                        vm.queryData={
                            class_id: vm.class_id,
                            school_id: vm.school_id,
                            page: vm.pageNo,
                            page_size:  vm.pageSize,
                            last_req_time: vm.studentReq
                        }
                        break;
                }
            }
        },
        //关掉
        close:function(){
            vm.pop=false;
            vm.isReving=false;
        },
        delPop:function () {
            layer.confirm("确定删除吗？",function () {
                vm.del()
                layer.closeAll()},layer.closeAll())
        },
        seeTeacher:function(el){
            vm.tegr_id=el.tegr_id
            vm.tegrName=el.tegr_name
            vm.router('teacher')
        },
        seeClass:function(el){
            vm.tegr_id=el.tegr_id
            vm.school_id=el.school_id
            vm.schoolName=el.school_name
            vm.router('class')
        },
        seeStudent:function (el) {
            vm.class_id=el.class_id
            vm.className=el.class_name
            vm.school_id=el.school_id;
            vm.router('student')
        },
        init: function () {
            var userr = getLocalValue('user');
            if (userr == null) {
                location.href="/oa/login.html";
            }
            user = userr;
            var ty=user.role_type;
            if(ty=="8"){
                vm.weight=2
            }
            else if(ty=="16" || ty=="32"){
                vm.weight=3
            }else{
                vm.weight=1
            }
            $.ajax({
                url: "/oa/conf/config.json",
                // success: function(res){
                //     conf=res
                //     vm.router("device")
                //     vm.querytTeg()
                // },
                complete:function(res){
                    conf=eval("("+res.responseText+")")

                    function goto() {
                        if(  vm.weight==2 ){ vm.router('teacher')}
                        if(  vm.weight==3){  vm.router('admin')}
                        if(  vm.weight==1){  vm.router('school')}
                    }

                    vm.querytTeg(goto)
                }
            });


        }
    })


    avalon.scan()
    vm.init();

    vm.$watch("teger_search",function(data){
        console.log(1)
        vm.queryData.tegr_id=data;
        vm.query(1)
    })
    vm.$watch("school_search",function(data){
        vm.queryData.school_id=data;
        vm.query(1)
    })




})