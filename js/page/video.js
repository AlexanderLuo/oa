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
        total:1,


        isReving:false,

        addUrl:"",

        addData: {},


        //添加
        addName: "",
        addLength: "",
        addSize: "",
        addPath: "",
        addVideo: "",
        addPic:"",

        last_req_time: 0,



        query: function (pageNo) {
            vm.pageNo = pageNo;
            vm.dataList=[]
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
                    vm.records=json.result.total_count;
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
        },

        del: function () {
            var ids = ""
            var li = []
            switch (vm.curPage) {
                case "video":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].video_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        delete_video_id: ids
                    }
                    break;
            }
            if(ids==""){
                layer.closeAll()
                layer.msg("请选择删除项")
                return;
            }

            var path = vm.upperPage();
            $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function (data) {
                vm.query(1)
                layer.closeAll()
            })

        },
        delPop: function () {
            layer.confirm("确定删除吗？", function () {
                vm.del()
            }, layer.closeAll())
        },
        addHandle: function (data, callback, error) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            } else {
                error && error.call()
            }
        },
        add: function () {
            if(vm.isReving){
                vm.rev();
                return;
            }
            var path = vm.upperPage();
            var check = vm.addData.isLegal();
            if (check) {
                console.log(vm.addData.collecData())
                vm.dataList=[];
                vm.checkAllFlag=false;
                $.ajax({url: vm.addUrl, type: "post", data: vm.addData.collecData()}).done(function (data) {
                    vm.close();
                    vm.query(1)
                })
            } else {
                layer.msg("请填写完整")
                //console.log("worng");
            }

        },

        rev:function(){
            var path = vm.upperPage();
            var check=vm.addData.isLegal();
            if(check){
                $.ajax({url: vm.revUrl, type: "post", data: vm.addData.collecData()}).done(function(data){
                    vm.close();
                    vm.query(1)
                })
            }else{
                layer.msg("请填写完整")
            }
        },

        open: function (el) {
            vm.pop = true;
            vm.isReving=false
            switch (vm.curPage) {
                case "video":
                    if (el) {
                        vm.isReving = true;
                        vm.addLength = el.video_length;
                        vm.addName = el.video_name;
                        vm.addSize = el.video_size;
                        vm.addPath = el.video_path;
                        vm.addPic=el.video_cover
                        vm.addData = {
                            isLegal: function () {
                                var data = vm.addData.collecData();
                                if (data.video_name.trim()==""|| data.video_path.trim() == ""
                                    || data.video_cover.trim() == "") {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            collecData: function () {
                                return {
                                    video_id:el.video_id,
                                    video_name: vm.addName,
                                    video_length: vm.addLength,
                                    video_size: vm.addSize,
                                    video_path: vm.addPath,
                                    video_cover:vm.addPic,
                                    video_see_count:el.video_see_count,
                                    user_id:el.user_id
                                }
                            }
                        }
                    }else{
                        vm.addData = {
                            isLegal: function () {
                                console.log(vm.addData.collecData())
                                var data = vm.addData.collecData();
                                if (data.video_name.trim()==""|| data.video_path.trim() == ""
                                    || data.video_cover.trim() == "") {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            collecData: function () {
                                return {
                                    video_name: vm.addName,
                                    video_length: vm.addLength,
                                    video_size: vm.addSize,
                                    video_path: vm.addPath,
                                    video_cover:vm.addPic,
                                    user_id:user.user_id,
                                    video_see_count:0
                                }
                            }
                        }
                        break;
                    }
            }

        },
        upload:function() {
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/uploadApi/uploadImage",
                cache: false,
                type:"post",
                data: new FormData($('#uploadForm')[0]),
                processData: false,
                contentType: false,
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    vm.addPic=json.result
                }
            });
        },
        //单词首字母大写
        upperPage: function () {
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            return word;
        },
        //路由
        router: function (str) {
            vm.dataList = [];
            vm.checkAllFlag = false;
            vm.curPage = str;
            vm.addUrl=conf.baseUrl + conf.addVideos
            vm.revUrl=conf.baseUrl+conf.revVideos
            vm.delUrl=conf.baseUrl+conf.delVideos
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
        close: function () {
            vm.pop = false;
            vm.addName= ""
            vm.addLength=""
            vm.addSize=""
            vm.addPath=""
            vm.addVideo=""
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