/**
 * Created by Administrator on 2017/3/16 0016.
 */
var conf = {}
var user = {}
function error() {
    layer.msg("未知异常")
}

avalon.ready(function () {
    var vm = avalon.define({
        $id: "statementVm",
        //公用
        conf: {},
        user: {},
        tegr_id: 0,   //集团ID
        dataList: [],
        lastReq: 0,
        weight: 1,  //权限
        curPage: "statement",  //当前路由
        checkAllFlag: false,  //全选标志
        pop: false,
        pageNo: 1,
        pageSize: 10,
        records: 0,
        total:1,
        measName:"",
        school_id:"",
        meas_id:"",
        tegerList:[],
        teger_id:0,

        //查询条件
        teger_search:0,

        last_req_time: 0,
        querytTeg:function(callback,args){
            $.ajax({url:conf.baseUrl+conf.getTegrList,type:"post",data:{user_id:user.user_id}}).done(function(data){
                var json = eval("(" + data + ")");// 解析json
                if (json.code == 200) {
                    vm.tegerList=json.result;
                    var stu = {"tegr_id":"0","tegr_name":"全部"};
                    vm.tegerList.push(stu);
                    vm.tegr_id=json.result[0].tegr_id;
                    console.log(vm.tegr_id);
                    console.log(vm.tegerList);
                    callback(args)
                }else{
                    error && error.call()
                }
            })
        },

        seeMeas:function(el){
            vm.measName = el.meas_num;
            vm.school_id = el.meas_school_id;
            vm.meas_id = el.meas_id;
            vm.router('meas');
        },
        look: function (el) {
            window.open('/measure.html'+"?meas_id="+vm.meas_id+"&class_id="+el.class_id+"&child_id="+el.child_id);
        },
        query: function (pageNo) {
            switch (vm.curPage){
                case "statement":
                    if(vm.weight>=3){
                        vm.teger_search = vm.teger_id;
                    }else {
                        vm.teger_search = getLocalValue('user').tegr_id;
                    }
                    vm.pageNo = pageNo;
                    vm.dataList =[];
                    vm.records = 0;
                    vm.total = 1;
                    $.ajax({
                        url: conf.baseUrl + conf.getMeasureList,
                        type: "post",
                        data: {
                            user_id:getLocalValue('user').user_id,
                            tegr_id:vm.teger_search,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.last_req_time
                        }
                    }).done(function (data) {
                        var json = eval("(" + data + ")");// 解析json
                        if (json.code == 200) {
                            vm.last_req_time = json.result.last_req_time;
                            vm.records = json.result.total_count;
                            vm.total=Math.ceil(vm.records/vm.pageSize)
                            
                            json.result.list.forEach(function (p1, p2, p3) {
                                p1.check = false
                            })
                            vm.dataList = json.result.list
                            vm.records = json.result.total_count;
                        } else {
                            error && error.call()
                        }

                    })
                    break;
                case "meas":
                    vm.pageNo = pageNo;
                    vm.dataList =[];
                    vm.records = 0;
                    vm.total = 1;
                    $.ajax({
                        url: conf.baseUrl + conf.getChildStatementList,
                        type: "post",
                        data: {
                            user_id:getLocalValue('user').user_id,
                            school_id:vm.school_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: 0,
                        }
                    }).done(function (data) {
                        var json = eval("(" + data + ")");// 解析json
                        if (json.code == 200) {
                            vm.last_req_time = json.result.last_req_time;
                            json.result.list.forEach(function (p1, p2, p3) {
                                p1.check = false
                            })
                            vm.dataList = json.result.list
                            vm.records = json.result.total_count;
                        } else {
                            error && error.call()
                        }
                    })
                 break;
            }
        },
        //路由
        router: function (str) {
            vm.dataList = [];
            vm.checkAllFlag = false;
            vm.curPage = str;
            vm.query(1);
        },
        //单选
        checkOne: function (el) {
            el.check = !el.check;
            var no = vm.dataList.filter(function (al) {
                return al.check == false;
            })
            if (no.length == 0) {
                vm.checkAllFlag = true
            }
            if (no.length > 0) {
                vm.checkAllFlag = false
            }

        },
        //弹窗
        open: function (str) {
            vm.pop = true;
        },
        //全选
        checkAll: function () {
            vm.checkAllFlag = !vm.checkAllFlag
            vm.dataList.forEach(function (el) {
                el.check = vm.checkAllFlag;
            })
        },
        //初始化
        init: function () {
            var userr = getLocalValue('user');
            if (userr == null) {
                location.href = "/oa/login.html";
            }
            user = userr;
            var ty = user.role_type;
            if (ty == "8") {
                vm.weight = 2
            }
            else if (ty == "16" || ty == "32") {
                vm.weight = 3
            }
            else {
                vm.weight = 1
            }
            $.ajax({
                url: "/oa/conf/config.json",
                //success: function (res) {
                //    conf = res
                //    vm.router("statement")
                //},
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                    //vm.router("statement")
                    vm.querytTeg(vm.router,"statement")
                }
            });
        }
    })


    avalon.scan();
    vm.init();


    vm.$watch("teger_id",function(data,old){
        vm.teger_id=data;
        console.log(data,old);
        vm.query(1);
    })
})