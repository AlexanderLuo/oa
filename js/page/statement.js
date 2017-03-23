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
        degr_id: "",   //当前用户设备组
        dataList: [],
        lastReq: 0,
        weight: 1,  //权限
        curPage: "statement",  //当前路由
        checkAllFlag: false,  //全选标志
        pop: false,
        pageNo: 1,
        pageSize: 10,
        records: 0,

        last_req_time: 0,
        look: function (el) {
            $.ajax({
                url: "http://www.kh122.com:8080/Childrensys/servlet/api/meas/measureReport",
                type: "post",
                data: {
                    meas_id: 10,
                    class_id: el.class_id,
                    child_id: el.child_id,
                }
            }).done(function (data) {
                console.log(data);
            })

        },

        query: function (pageNo) {
            vm.pageNo = pageNo;
            $.ajax({
                url: conf.baseUrl + conf.getChildStatementList,
                type: "post",
                data: {
                    page: vm.pageNo,
                    page_size: vm.pageSize,
                    last_req_time: vm.last_req_time
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
        },
        del: function () {
            var delete_scales_id = "";
            for (var a = 0; a < vm.dataList.length; a++) {
                if (vm.dataList[a].check == true) {
                    delete_scales_id = delete_scales_id + vm.dataList[a].scales_id
                    if (a != vm.dataList.length - 1) {
                        delete_scales_id = delete_scales_id + ","
                    }
                }
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
                success: function (res) {
                    conf = res
                    vm.router("statement")
                },
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                    vm.router("statement")
                }
            });
        }
    })

    avalon.scan()
    vm.init();

})