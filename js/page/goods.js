/**
 * Created by Administrator on 2017/3/17 0017.
 */
var conf = {}
var user = {}
function error() {
    layer.msg("未知异常")
}
avalon.ready(function () {
    var vm = avalon.define({
        $id: "goodsVm",
        typeList: [{id: 0, name: "全部"}, {id: 1, name: "教材"}, {id: 2, name: "器材"}, {id: 3, name: "服饰"}, {id: 4, name: "其他"}],
        typeFilter: 0,
        saleList: [{id: 0, name: "上架", select: false}, {id: 1, name: "下架", select: false}],
        orderList: [{id: 0, name: "全部"}, {id: 1, name: "待付款"}, {id: 2, name: "待发货"}, {id: 3, name: "待收货"}, {id: 4, name: "已收货"}],
        orderList2: [{id: 1, name: "待付款"}, {id: 2, name: "待发货"}, {id: 3, name: "待收货"}, {id: 4, name: "已收货"}],

        goods_type: 0,
        order_state: 0,
        list: [],
        goodsList: [],
        goodsReq: 0,
        orderReq: 0,
        curPage: "",
        pop: "",
        popData: {},
        confs: {},

        isReving: false,


        picList: [],
        detailList: [],

        //添加商品
        addGoodsName: "",
        addGoodsType: "",
        addGoodsSize: "",
        addGoodsColor: "",
        addGoodsShape: "",
        addGoodsRepertory: "",
        addGoodsSales: "",
        addGoodsPrice: "",
        addGoodsPostage: "",
        addGoodsDiscount: "",
        addGoodsState: "",
        addGoodsImg: "",
        addGoodsDetail: "",
        //订单
        addOrderNumber: "",
        addOrderStream: "",
        addAddrPhone: "",
        addCreateTime: "",
        addOrderPrice: "",
        addOrderAmount: "",
        addOrderAddr: "",
        addOrderState: "",


        pageNo: 1,
        pageSize: 10,
        total: 1,
        records: 0,
        weight: 1,

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

        checkAllFlag: false,  //全选标志

        query: function (pageNo) {
            vm.pageNo = pageNo
            vm.queryData.page = pageNo;
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function (data) {
                vm.queryHandle(data, vm["get" + path])
            })
        },
        queryHandle: function (data, callback, error) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            } else {
                error && error.call()
            }
        },

        del: function () {
            var ids = ""
            var li = []
            switch (vm.curPage) {
                case "goods":
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            li.push(vm.dataList[a].goods_id)
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                    }
                    vm.delData = {
                        delete_goods_id: ids
                    }
                    break
            }
            if (ids == "") {
                layer.closeAll()
                layer.msg("请选择删除项")
                return;
            }

            var path = vm.upperPage();
            layer.confirm("确定删除吗？", function () {
                $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "删除成功" || json.msg == "成功") {
                        layer.msg("操作成功", 1, 9);
                        vm.query(1);
                        layer.close();
                    } else {
                        layer.msg("操作失败," + json.msg);
                    }
                })
            }, layer.closeAll())

        },


        upload: function (str) {
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/uploadApi/uploadImage",
                cache: false,
                type: "post",
                data: new FormData($('#uploadForm' + str)[0]),
                processData: false,
                contentType: false,
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (str == 0) {
                        vm.picList.push(json.result)
                    }
                    if (str == 1) {
                        vm.detailList.push(json.result)
                    }
                }
            });
        },


        getGoods: function (json) {
            vm.goodsReq = json.result.last_req_time;
            vm.orderReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            json.result.list.forEach(function (el) {
                el.check = false;
            });

            vm.dataList = json.result.list;
        },
        getOrder: function (json) {
            vm.orderReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            json.result.list.forEach(function (el) {
                el.check = false;
            });
            vm.dataList = json.result.list;
        },
        rev: function () {
            var path = vm.upperPage();
            var check = vm.popData.isLegal();
            if (check == true) {
                $.ajax({url: vm.revUrl, type: "post", data: vm.popData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "添加成功" || json.msg == "修改成功") {
                        layer.msg("操作成功", 1, 9);
                        vm.close();
                        vm.query(1);
                    } else {
                        layer.msg("操作失败," + json.msg);
                    }
                })
            } else if (!check) {
                layer.msg("请填写完整")
            } else {
                layer.msg(check);
            }
        },
        router: function (str) {
            vm.dataList = [];
            vm.checkAllFlag = false;
            vm.curPage = str;
            var path = vm.upperPage();
            var c = vm.confs;
            vm.isReving = false;
            var b = c.baseUrl;
            vm.addUrl = b + c["add" + path]
            vm.delUrl = b + c["del" + path]
            vm.revUrl = b + c["rev" + path]
            vm.queryUrl = b + c["query" + path]
            vm.pageAdapter();
            vm.query(1);

        },
        add: function () {
            if (vm.isReving) {
                console.log("reving")
                vm.rev();
                return;
            }
            var path = vm.upperPage();
            var check = vm.popData.isLegal();
            console.log(vm.addUrl)
            if (check==true) {
                $.ajax({url: vm.addUrl, type: "post", data: vm.popData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "添加成功" || json.msg == "修改成功") {
                        layer.msg("操作成功", 1, 9);
                        vm.close();
                        vm.query(1);
                    } else {
                        layer.msg("操作失败," + json.msg);
                    }
                })
            } else if(!check){
                layer.msg("请填写完整")
            }else {
                layer.msg(check);
            }
        },
        pageAdapter: function () {
            vm.queryData = {}
            switch (vm.curPage) {
                case "goods":
                    vm.queryData = {
                        goods_type: vm.goods_type,
                        page: vm.pageNo,
                        page_size: vm.pageSize,
                        last_req_time: vm.lastReq
                    }
                    break;
                case "order":
                    vm.queryData = {
                        user_id: user.user_id,
                        order_state: vm.order_state,
                        page: vm.pageNo,
                        page_size: vm.pageSize,
                        last_req_time: vm.orderReq
                    }
                    break;
            }

        },     //全选
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
        open: function (el) {
            vm.pop = vm.curPage;
            vm.popData = {}
            vm.isReving = false;
            vm.picList = [];
            vm.detailList = [];
            switch (vm.curPage) {
                case "goods":
                    if (el) {
                        vm.isReving = true;

                        vm.picList = el.goods_image.split(",");
                        vm.detailList = el.goods_detail.split(",")

                        vm.addGoodsName = el.goods_name;
                        vm.addGoodsType = el.goods_type;
                        vm.addGoodsSize = el.goods_size;
                        vm.addGoodsColor = el.goods_color;
                        vm.addGoodsShape = el.goods_shape;
                        vm.addGoodsRepertory = el.goods_repertory;
                        vm.addGoodsSales = el.goods_sales;
                        vm.addGoodsPrice = el.goods_price;
                        vm.addGoodsPostage = el.goods_postage;
                        vm.addGoodsDiscount = el.goods_discount;
                        vm.addGoodsState = el.goods_sell_state;

                        vm.addGoodsImg = el.goods_image;
                        vm.addGoodsDetail = el.goods_detail;

                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.goods_name.trim() == ""
                                    || data.goods_size.trim() == ""
                                    || data.goods_color.trim() == ""
                                    || data.goods_shape.trim() == ""
                                    || data.goods_repertory == ""
                                    || data.goods_sales == ""
                                    || data.goods_price == ""
                                    || data.goods_postage == ""
                                    || data.goods_discount == ""
                                    || data.goods_sell_state == -1
                                    || data.goods_image == ""
                                    || data.goods_detail == ""
                                ) {
                                    return false;
                                } else {
                                    if (data.goods_name.length > 50) {
                                        return "商品名称不得大于50字符"
                                    } else if (isNaN(parseInt(data.goods_discount))) {
                                        return "商品的折扣为0-1"
                                    } else if (data.goods_discount < 0 || data.goods_discount > 1) {
                                        return "商品的折扣为0-1"
                                    } else if (data.goods_image.split(',').length > 4) {
                                        return "商品图片不得超过4张"
                                    } else if (data.goods_detail.split(',').length > 8) {
                                        return "商品图片不得超过8张"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                var st = "";
                                for (var b = 0; b < vm.picList.length; b++) {
                                    st = st + vm.picList[b]
                                    if (b != vm.picList.length - 1) {
                                        st = st + ","
                                    }
                                }
                                vm.addGoodsImg = st;
                                var at = ""
                                for (var b = 0; b < vm.detailList.length; b++) {
                                    at = at + vm.detailList[b]
                                    if (b != vm.detailList.length - 1) {
                                        at = at + ","
                                    }
                                }
                                vm.addGoodsDetail = at;

                                return {
                                    goods_id: el.goods_id,
                                    goods_name: vm.addGoodsName,
                                    goods_type: vm.addGoodsType,
                                    goods_size: vm.addGoodsSize,
                                    goods_color: vm.addGoodsColor,
                                    goods_shape: vm.addGoodsShape,
                                    goods_repertory: vm.addGoodsRepertory,
                                    goods_sales: vm.addGoodsSales,
                                    goods_price: vm.addGoodsPrice,
                                    goods_postage: vm.addGoodsPostage,
                                    goods_discount: vm.addGoodsDiscount,
                                    goods_sell_state: vm.addGoodsState,
                                    goods_image: vm.addGoodsImg,
                                    goods_detail: vm.addGoodsDetail
                                }
                            }

                        }
                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.goods_name.trim() == ""
                                    || data.goods_size.trim() == ""
                                    || data.goods_color.trim() == ""
                                    || data.goods_shape.trim() == ""
                                    || data.goods_repertory == ""
                                    || data.goods_sales == ""
                                    || data.goods_price == ""
                                    || data.goods_postage == ""
                                    || data.goods_discount == ""
                                    || data.goods_sell_state == -1
                                    || data.goods_image == ""
                                    || data.goods_detail == ""
                                ) {
                                    return false;
                                } else {
                                    console.log(data.goods_image.split(','))
                                    if (data.goods_name.length > 50) {
                                        return "商品名称不得大于50字符"
                                    } else if (isNaN(parseInt(data.goods_discount))) {
                                        return "商品的折扣为0-1"
                                    } else if (data.goods_discount < 0 || data.goods_discount > 1) {
                                        return "商品的折扣为0-1"
                                    } else if (data.goods_image.split(',').length > 4) {
                                        return "商品图片不得超过4张"
                                    } else if (data.goods_detail.split(',').length > 8) {
                                        return "商品图片不得超过8张"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                var st = "";
                                for (var b = 0; b < vm.picList.length; b++) {
                                    st = st + vm.picList[b]
                                    if (b != vm.picList.length - 1) {
                                        st = st + ","
                                    }
                                }
                                vm.addGoodsImg = st;
                                var at = ""
                                for (var b = 0; b < vm.detailList.length; b++) {
                                    at = at + vm.detailList[b]
                                    if (b != vm.detailList.length - 1) {
                                        at = at + ","
                                    }
                                }
                                vm.addGoodsDetail = at;
                                return {
                                    goods_name: vm.addGoodsName,
                                    goods_type: vm.addGoodsType,
                                    goods_size: vm.addGoodsSize,
                                    goods_color: vm.addGoodsColor,
                                    goods_shape: vm.addGoodsShape,
                                    goods_repertory: vm.addGoodsRepertory,
                                    goods_sales: vm.addGoodsSales,
                                    goods_price: vm.addGoodsPrice,
                                    goods_postage: vm.addGoodsPostage,
                                    goods_discount: vm.addGoodsDiscount,
                                    goods_sell_state: vm.addGoodsState,
                                    goods_image: vm.addGoodsImg,
                                    goods_detail: vm.addGoodsDetail
                                }
                            }
                        }
                    }
                    break;
                case "order":
                    el = el || {}
                    vm.addOrderNumber = el.order_number
                    vm.addOrderStream = el.order_stream
                    vm.addAddrPhone = el.address_info.addr_phone
                    vm.addCreateTime = el.create_time
                    vm.addOrderPrice = el.order_price
                    vm.addGoodsName = el.goods_name
                    vm.addGoodsShape = el.goods_shape
                    vm.addGoodsSize = el.goods_size
                    vm.addOrderAmount = el.order_amount
                    vm.addGoodsColor = el.goods_color
                    vm.addGoodsDetail = el.order_message
                    vm.addOrderAddr = el.address_info.addr_detail
                    vm.addOrderState = el.order_state

                    vm.popData = {
                        isLegal: function () {
                            var data = vm.popData.collecData();
                            if (data.order_id == 0) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        collecData: function () {
                            return {
                                order_id: el.order_id,
                                order_state: vm.addOrderState,
                                addr_detail: vm.addOrderAddr,
                                addr_detail: vm.addGoodsDetail
                            }
                        }
                    }
                    break;
            }
        },
        delPic: function (index, el) {
            if (index == 0) {
                vm.picList.remove(el)
            }
            if (index == 1) {
                vm.detailList.remove(el)
            }
        },
        close: function () {
            vm.pop = false;
            vm.saleList[0].select = false
            vm.saleList[1].select = false
            vm.addGoodsName = ""
            vm.addGoodsType = ""
            vm.addGoodsSize = ""
            vm.addGoodsColor = ""
            vm.addGoodsShape = ""
            vm.addGoodsRepertory = ""
            vm.addGoodsSales = ""
            vm.addGoodsPrice = ""
            vm.addGoodsPostage = ""
            vm.addGoodsDiscount = ""
            vm.addGoodsState = ""
            vm.addGoodsImg = ""
            vm.addGoodsDetail = ""
        },
        switchCheck: function (str) {
            var goto;
            if (str == 0) {
                if (vm.saleList[1].select == true) {
                    vm.saleList[0].select = true
                    goto = function () {
                        vm.saleList[1].select = false;
                    }
                }
                if (vm.saleList[1].select == false) {
                    vm.saleList[0].select = false
                    goto = function () {
                    }
                }
                goto()
            }
            if (str == 1) {
                if (vm.saleList[0].select == true) {
                    vm.saleList[1].select = true
                    goto = function () {
                        vm.saleList[0].select = false;
                    }
                }
                if (vm.saleList[0].select == false) {
                    vm.saleList[1].select = false
                    goto = function () {
                    }
                }
                goto()
            }
        },
        delPop: function () {
                vm.del();
        },

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
                //     vm.router("goods")
                // },
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                    vm.confs = conf;
                    vm.router("goods")
                }
            });
        },
        //单词首字母大写
        upperPage: function () {
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            return word;
        }
    })

    vm.init();
    avalon.scan()

    vm.$watch("typeFilter", function (data) {
        vm.queryData.goods_type = data
        vm.checkAllFlag = false;
        vm.query(1)
    })


    avalon.filters.typeStrFilter = function (str) {
        var re = "";
        vm.typeList.forEach(function (el) {
            if (el.id == str) {
                re = el.name
            }
        })
        return re
    }
    avalon.filters.saleStrFilter = function (str) {
        var re = "";
        vm.saleList.forEach(function (el) {
            if (el.id == str) {
                re = el.name
            }
        })
        return re
    }


})