var conf={}
var user={}
function  error(){
    layer.msg("未知异常")
}

avalon.ready(function () {
    var vm = avalon.define({
        $id: "adminVm",
        user: {},
        tegr_id: 0,   //集团ID
        school_id:0,//学校ID
        list:[],
        weight:1,
        adminList: [],
        tegerList: [],
        teacherList: [],
        schoolList: [],
        classList: [],
        parentList: [],
        studentList: [],
        lastReq: 0,
        tegerReq: 0,
        curPage: " ",
        teacherReq:0,
        schoolReq:0,
        classReq:0,
        parentReq:0,
        studentReq:0,
        pop:"",
        getAdmin: function () {
            vm.adminList=[]
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/userApi/getAdminList",
                type: "post",
                data: {
                    user_id: vm.user.user_id,
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    console.log(json);
                    if (json.code == 200) {
                        vm.adminList = json.returnObject;
                    }
                }
            })
        },
        getTeger: function () {
            vm.tegerList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/tegrApi/getTegrList",
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.tegerList = json.result;
                    }
                }

            })
        },
        getTeacher: function () {
            vm.teacherList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/teacherApi/getTeacherList",
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    tegr_id: vm.user.tegr_id,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.teacherReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.teacherReq= json.result.last_req_time;
                        vm.teacherList = json.result.list;
                    }
                }

            })
        },
        getSchool: function () {
            vm.rulerList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/schoolApi/getSchoolList",
                type: 'post',
                data: {
//                            user_id: vm.user.user_id,
                    tegr_id: vm.tegr_id,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.lastReq = json.result.last_req_time;
                        vm.schoolList = json.result.list;
                    }
                }

            })
        },
        getClass: function () {
            vm.classList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/classApi/getClassList",
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    school_id: vm.school_id,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    console.log(json);
                    if (json.code == 200) {
                        vm.lastReq = json.result.last_req_time;
                        vm.classList = json.result.list;
                    }
                }

            })
        },
        getParent: function () {
            vm.steelyardList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/parentApi/getParentList",
                type: 'post',
                data: {
                    teger_id: vm.user.teger_id,
                    school_id: vm.school_id,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    console.log(json);
                    if (json.code == 200) {
                        vm.lastReq = json.result.last_req_time;
                        vm.parentList = json.result.list;
                    }
                }

            })
        },
        getStudent: function () {
            vm.studentList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/childApi/getChildList",
                type: 'post',
                data: {
                    class_id: vm.user.user_id,
                    school_id: vm.school_id,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.ringReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    console.log(json);
                    if (json.code == 200) {
                        vm.lastReq = json.result.last_req_time;
                        vm.studentList = json.result.list;
                    }
                }
            })
        },
        router: function (str) {
            vm.curPage=str;
        },
        init: function () {
            var user = getLocalValue('user');
            if (user == null) {
                location.href="/oa/login.html";
            }
            vm.user = user;
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
                    if(  vm.weight==2 ){ vm.router('teacher')}
                    if(  vm.weight==3){  vm.router('admin')}
                    if(  vm.weight==1){  vm.router('school')}
                }
            });



        }
    })


    vm.$watch('tegr_id', function (value, oldValue) {
        vm.getTeger();
    })
    vm.$watch('curPage',function(value){
        if(value=="admin"){vm.getAdmin();}
        if(value=="teger"){vm.getTeger();}
        if(value=="teacher"){vm.getTeger();vm.getTeacher();}
        if(value=="school"){vm.getSchool();}
        if(value=='class'){vm.getClass();}
        if(value=='parent'){vm.getParent();}
        if(value=='student'){vm.getStudent();}
    })

    avalon.scan()
    vm.init();



})