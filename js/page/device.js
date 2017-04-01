var conf = {}
var user = {}
function error() {
    layer.msg("未知异常")
}
avalon.ready(function () {
    var vm = avalon.define({
        $id: "deviceVm",
        //公用

        degr_id: "",   //当前用户设备组


        pageSize: 10,
        pageNo: 1,
        total: 1,
        records: 0,

        //集团导航过滤条件
        tegr_id: 0,

        tegerList: [],

        addTegr: "",
        addUser: "",
        addName: "",
        addDegr: 0,
        addNo: "",
        addAddr: "",

        userList: [{name: "请选择", user_id: 0}],


        //逻辑
        queryUrl: "",
        queryData: {},
        addUrl: "",
        addData: {},
        revUrl: "",
        revData: {},
        delUrl: "",
        delData: "",
        dataList: [],
        deviceReq: 0,
        ringReq: 0,
        rulerReq: 0,
        steelyardReq: 0,


        //控制
        weight: 1,  //权限
        curPage: "device",  //当前路由
        checkAllFlag: false,  //全选标志
        pop: false,
        popData: {},
        isReving: false,
        edit: false,


        //查看
        degrName: "",


        querytTeg: function (callback, args) {
            $.ajax({
                url: conf.baseUrl + conf.getTegrList,
                type: "post",
                data: {user_id: user.user_id}
            }).done(function (data) {
                var json = eval("(" + data + ")");// 解析json
                if (json.code == 200) {
                    vm.tegerList = json.result;
                    vm.tegr_id = json.result[0].tegr_id
                    console.log(vm.tegr_id)
                    callback(args)
                } else {
                    error && error.call()
                }
            })
        },
        query: function (pageNo) {
            vm.pageNo = pageNo;
            vm.records = 0;
            vm.total = 1;
            vm.checkAllFlag = false;
            vm.queryData.page = pageNo;
            vm.dataList = []
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function (data) {
                vm.queryHandle(data, vm["get" + path])
            })
        },
        del: function () {
            var ids = ""
            var li = []
            switch (vm.curPage) {
                case "device":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].degr_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        user_id: user.user_id,
                        delete_degr_id: ids
                    }
                    break;
                case "ring":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].bracelet_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        user_id: user.user_id,
                        delete_bracelet_id: ids
                    };
                    break;
                case "ruler":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].ruler_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        user_id: user.user_id,
                        // tegr_id: user.tegr_id,
                        tegr_id: vm.tegr_id,
                        delete_ruler_id: ids
                    };
                    break;
                case "steelyard":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].scales_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        user_id: user.user_id,
                        tegr_id: vm.tegr_id,
                        // tegr_id: user.tegr_id,
                        delete_scales_id: ids
                    }
                    console.log(vm.delData)
                    break;
            }
            if(ids==""){
                layer.closeAll()
                layer.msg("请选择删除项")
                return;
            }

            var path = vm.upperPage();
            layer.confirm("确定删除吗？", function () {
            $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function (data) {
                var json = eval("(" + data + ")")
                if (json.msg == "删除成功" || json.msg == "成功") {
                    layer.msg("操作成功",1,9);
                    vm.query(1);
                    layer.close();
                } else {
                    layer.msg("操作失败," + json.msg);
                }
            })
            }, layer.closeAll())

        },
        add: function () {
            if (vm.isReving) {
                vm.rev();
                return;
            }
            var path = vm.upperPage();
            var check = vm.addData.isLegal();
            console.log(check);
            if (check == true) {
                $.ajax({url: vm.addUrl, type: "post", data: vm.addData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")");
                    if(json.msg=="添加成功"||json.msg=="修改成功"){
                        layer.msg("操作成功",1,9);
                        vm.close();
                        vm.query(1)
                    }else{
                        layer.msg("操作失败，"+json.msg);
                    }
                })
            } else if (!check) {
                layer.msg("请填写完整")
            } else {
                layer.msg(check);
            }

        },
        rev: function () {
            var path = vm.upperPage();
            var check = vm.addData.isLegal();
            console.log(check);
            if (check == true) {
                $.ajax({url: vm.revUrl, type: "post", data: vm.addData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if(json.msg=="添加成功"||json.msg=="修改成功"){
                        layer.msg("操作成功",1,9);
                        vm.close();
                        vm.query(1)
                    }else{
                        layer.msg("操作失败，"+json.msg);
                    }
                })
            } else if (!check) {
                layer.msg("请填写完整")
            } else {
                layer.msg(check);
            }
        },
        seeRing: function (el) {
            vm.degrName = el.degr_name
            vm.degr_id = el.degr_id
            vm.addDegr = el.degr_id
            vm.router('ring')
        },
        queryHandle: function (data, callback, error) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            } else {
                error && error.call()
            }
        },
        addHandle: function (data, callback, error) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            } else {
                error && error.call()
            }
        },
        //查询设备
        getDevice: function (json) {

            vm.deviceReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)

            json.result.list.forEach(function (el) {
                el.check = false;
            });
            vm.dataList = json.result.list;

        },
        //查询手环
        getRing: function (json) {
            vm.ringReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            json.result.list.forEach(function (el) {
                el.check = false;
            });
            vm.dataList = json.result.list;
        },
        //身高尺
        getRuler: function (json) {
            vm.rulerReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)

            json.result.list.forEach(function (el) {
                el.check = false;
            });
            vm.dataList = json.result.list;
        },
//                健康秤
        getSteelyard: function (json) {
            vm.steelyardReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            console.log(vm.total)

            json.result.list.forEach(function (el) {
                el.check = false;
            });
            vm.dataList = json.result.list;
        },


        //路由
        router: function (str) {
            vm.dataList = [];
            vm.checkAllFlag = false;
            vm.curPage = str;
            vm.addUrl = "";
            vm.addTegr = 0;
            vm.addName = ""
            vm.isReving = false;


            vm.tegr_id = vm.tegerList[0].tegr_id;

            var path = vm.upperPage();
            var c = conf;
            var b = c.baseUrl;
            vm.addUrl = b + c["add" + path]
            vm.delUrl = b + c["del" + path]
            vm.revUrl = b + c["rev" + path]
            vm.queryUrl = b + c["query" + path]

            vm.pageAdapter();
            vm.query(1);
        },
        //单词首字母大写
        upperPage: function () {
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            return word;
        },
        //路由适配
        pageAdapter: function (str) {
            vm.queryData = {}
            if (!str) {
                switch (vm.curPage) {
                    case "device":
                        vm.queryData = {
                            user_id: user.user_id,
                            tegr_id: vm.tegr_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.deviceReq
                        }
                        break;
                    case "ring":
                        vm.queryData = {
                            user_id: user.user_id,
                            degr_id: vm.degr_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.ringReq
                        }
                        break;
                    case "ruler":
                        vm.queryData = {
                            user_id: user.user_id,
                            tegr_id: vm.tegr_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.ringReq
                        };
                        break;
                    case "steelyard":
                        vm.queryData = {
                            user_id: user.user_id,
                            tegr_id: vm.tegr_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.ringReq
                        }
                        break;
                }
            }

        },
        //弹窗
        open: function (el) {
            vm.pop = vm.curPage;
            vm.addData = {};
            var reg = /^\d{1,10}$/;
            var reg2 =/^[a-zA-Z0-9]{12}$/;
            switch (vm.curPage) {
                case "device":
                    if (el) {
                        vm.isReving = true
                        vm.addUser = el.user_id
                        vm.addName = el.degr_name;
                        vm.addTegr = el.tegr_id
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.degr_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.degr_name.length > 12) {
                                        return "设备组名称大于12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    degr_id: el.degr_id,
                                    user_id: vm.addUser,
                                    degr_name: vm.addName
                                }
                            }
                        }

                    } else {
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.degr_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.degr_name.length > 12) {
                                        return "设备组名称大于12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    tegr_id: vm.addTegr,
                                    user_id: vm.addUser,
                                    degr_name: vm.addName
                                }
                            }
                        }
                    }

                    break;
                case "ring":
                    if (el) {
                        vm.isReving = true
                        vm.addNo = el.bracelet_no
                        vm.addAddr = el.bracelet_address
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.addDegr == 0 || data.bracelet_no.trim() == "" || data.bracelet_address.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.bracelet_no)) {
                                        return "请填写手环编号为10位数字"
                                    } else if (!reg2.test(data.bracelet_address)) {
                                        return "请填写手环地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    bracelet_id: el.bracelet_id,
                                    degr_id: vm.addDegr,
                                    bracelet_no: vm.addNo,
                                    bracelet_address: vm.addAddr,
                                    child_id: el.child_id
                                }
                            }
                        }

                    } else {
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.addDegr == 0 || data.bracelet_no.trim() == "" || data.bracelet_address.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.bracelet_no)) {
                                        return "请填写手环编号为10位数字"
                                    } else if (!reg2.test(data.bracelet_address)) {
                                        return "请填写手环地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    degr_id: vm.addDegr,
                                    bracelet_no: vm.addNo,
                                    bracelet_address: vm.addAddr
                                }
                            }
                        }

                    }
                    break;
                case "ruler":
                    if (el) {
                        vm.isReving = true
                        vm.addUser = el.user_id
                        vm.addAddr = el.ruler_addr;
                        vm.addTegr = el.tegr_id
                        vm.addNo = el.ruler_no;

                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.ruler_addr.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.ruler_no)) {
                                        return "请填写身高尺编号为10位数字"
                                    } else if (!reg2.test(data.ruler_addr)) {
                                        return "请填写身高尺地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    ruler_id: el.ruler_id,
                                    user_id: vm.addUser,
                                    login_user_id: user.user_id,
                                    ruler_no: vm.addNo,
                                    ruler_addr: vm.addAddr
                                }
                            }
                        }

                    } else {
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.ruler_no.trim() == "" || data.ruler_addr.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.ruler_no)) {
                                        return "请填写身高尺编号为10位数字"
                                    } else if (!reg2.test(data.ruler_addr)) {
                                        return "请填写身高尺地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    tegr_id: vm.addTegr,
                                    user_id: vm.addUser,
                                    ruler_no: vm.addNo,
                                    ruler_addr: vm.addAddr,
                                    login_user_id: user.user_id
                                }
                            }
                        }
                    }
                    break;
                case "steelyard":
                    if (el) {
                        vm.isReving = true;
                        vm.addTegr = el.tegr_id;
                        vm.addUser = el.user_id;
                        vm.addNo = el.scales_no
                        vm.addAddr = el.scales_addr
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.scales_no.trim() == "" || data.scales_addr.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.scales_no)) {
                                        return "请填写健康秤编号为10位数字"
                                    } else if (!reg2.test(data.scales_addr)) {
                                        return "请填写健康秤地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    scales_id: el.scales_id,
                                    tegr_id: vm.addTegr,
                                    user_id: vm.addUser,
                                    scales_no: vm.addNo,
                                    scales_addr: vm.addAddr,
                                    login_user_id: user.user_id
                                }
                            }
                        }


                    } else {
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.scales_no.trim() == "" || data.scales_addr.trim() == "") {
                                    return false;
                                } else {
                                    if (!reg.test(data.scales_no)) {
                                        return "请填写健康秤编号为10位数字"
                                    } else if (!reg2.test(data.scales_addr)) {
                                        return "请填写健康秤地址为12位字母或数字"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    tegr_id: vm.addTegr,
                                    user_id: vm.addUser,
                                    scales_no: vm.addNo,
                                    scales_addr: vm.addAddr,
                                    login_user_id: user.user_id
                                }
                            }
                        }
                    }
                    break;
            }

        },
        delPop: function () {
                vm.del();
        },


        //关掉
        close: function () {
            vm.pop = false;
            vm.addNo = ""
            vm.addAddr = ""
            vm.addUser = ""
            vm.addName = ""
            vm.isReving = false;
        },
        //全选
        checkAll: function () {
            vm.checkAllFlag = !vm.checkAllFlag
            vm.dataList.forEach(function (el) {
                el.check = vm.checkAllFlag;
            })
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
                // success: function(res){
                //     conf=res
                //     vm.router("device")
                //     vm.querytTeg()
                // },
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                    vm.querytTeg(vm.router, "device")
                }
            });


        }
    })

    avalon.scan()
    vm.init();

    vm.$watch("tegr_id", function (data) {
        vm.queryData.tegr_id = data;
        vm.query(1)
    })
    //添加设备组联动
    vm.$watch("addTegr", function (data) {
        if (data == 0 || !data) {
            vm.userList = [{name: "请选择", user_id: 0}]
            return;
        }
        console.log(data)
        $.ajax({
            url: conf.baseUrl + conf.getTeacherList, type: "post", data: {
                user_id: user.user_id,
                tegr_id: data,
                page: 1,
                page_size: 800,
                last_req_time: 0
            }
        }).done(function (data) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                vm.userList = json.result.list;
                vm.addUser = vm.userList[0].user_id
            } else {
                error && error.call()
            }
        })
    })
    avalon.filters.addFilter = function (str) {
        if (str == "默认") {
            return "请选择"
        } else {
            return str
        }
    }


})