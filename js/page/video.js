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
        $id: "videoVm",
        //公用
        conf: {},
        user: {},
        degr_id: "",   //当前用户设备组
        dataList: [],
        lastReq: 0,
        weight: 1,  //权限
        curPage: "video",  //当前路由
        checkAllFlag: false,  //全选标志
        pop: false,
        pageNo: 1,
        pageSize: 10,
        records: 0,

        addUrl:conf.baseUrl + conf.addVideos,
        addData:{},

        addName:"",
        addLength:"",
        addSize:"",
        addPath:"",


        addvideo: "",

        last_req_time: 0,

        query: function (pageNo) {
            vm.pageNo = pageNo;
            $.ajax({
                url: conf.baseUrl + conf.queryVideos,
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
        addHandle:function(data,callback,error){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            }else{
                error && error.call()
            }
        },
        add:function(){
            var path = vm.upperPage();
            var check=vm.addData.isLegal();
            if(check){
                console.log(vm.addData.collecData())
                $.ajax({url: vm.addUrl, type: "post", data: vm.addData.collecData()}).done(function(data){vm.addHandle(data,vm["add"+path])})
            }else{
                layer.msg("请填写完整")
                //console.log("worng");
            }

        },

        open: function () {
            vm.pop = true;
            switch (vm.curPage) {
                case "video":
                    vm.addData = {
                        isLegal: function () {
                            var data = vm.addData.collecData();
                            if (data.addName.trim() == ""|| data.addLength.trim() == ""||data.addSize.trim()==""||data.addPath.trim()=="") {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        collecData: function () {
                            return {
                                addName: vm.addName,
                                user_id: user.user_id,
                                addLength: vm.addLength,
                                addSize:vm.addSize,
                                addPath:vm.addPath
                            }
                        }
                    }
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
        // open: function (str) {
        //
        //     vm.pop = true;
        // },
        //关掉
        close:function(){
            vm.pop=false;
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
                    vm.router("video")
                },
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                    vm.router("video")
                }
            });
        }
    })

    avalon.scan()
    vm.init();

})