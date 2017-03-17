/**
 * Created by Administrator on 2017/3/17 0017.
 */
var conf={}
var user={}
function  error(){
    layer.msg("未知异常")
}
avalon.ready(function () {
    var vm = avalon.define({
        $id: "goodsVm",

        goods_type:0,
        order_state:0,
        list:[],
        goodsList: [],
        orderList: [],
        lastReq: 0,
        goodsReq: 0,
        orderReq: 0,
        curPage: "",




        pageNo:1,
        pageSize:10,
        records:0,

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





        getGoods: function () {
            vm.goodsList=[]
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/goodsApi/getGoodsList",
                type: "post",
                data: {
                    goods_type: vm.goods_type,
                    page: 1,
                    page_size: 10,
                    last_req_time: vm.lastReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
//                                var tar = json.result.list.filter(function (el) {
//                                    return el.user_id == vm.user.user_id;
//                                })
//                                vm.lastReq = json.result.last_req_time;
//                                vm.degr_id = tar[0].degr_id;
                        vm.goodsList = json.result.list;
                    }

                }
            })
        },

        getOrder: function () {
            vm.orderList = [];
            $.ajax({
                url: "http://www.kh122.com:8081/ChildrenBackstage/backstageServlet/orderApi/getOrderList",
                type: 'post',
                data: {
                    user_id: vm.user.user_id,
                    order_state: vm.order_state,
                    page: vm.pageNo,
                    page_size: vm.pageSize,
                    last_req_time: vm.goodsReq
                },
                success: function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.orderReq = json.result.last_req_time;
                        vm.orderList = json.result.list;
                    }
                }

            })
        },


        router: function (str) {
            vm.dataList=[];
            vm.checkAllFlag=false;
            vm.curPage=str;

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
        pageAdapter:function(){
            vm.queryData={}
            switch (vm.curPage){
                case "goods":
                    vm.queryData= {
                        goods_type: vm.goods_type,
                        page: vm.pageNo,
                        page_size: vm.pageSize,
                        last_req_time: vm.lastReq
                    }
                    break;
                case "order":
                    vm.queryData={
                        user_id: user.user_id,
                        order_state: vm.order_state,
                        page: vm.pageNo,
                        page_size: vm.pageSize,
                        last_req_time: vm.orderReq
                    }
                    break;
            }

        },
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
                    vm.router("goods")
                },
                complete:function(res){
                    conf=eval("("+res.responseText+")")
                    vm.router("goods")
                }
            });
        },
        //单词首字母大写
        upperPage:function(){
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function(word){
                return word.substring(0,1).toUpperCase()+word.substring(1);
            });
            return word;
        }
    })

    vm.init();
    avalon.scan()

    vm.$watch('degr_id', function (value, oldValue) {
        vm.getRing();
    })
    vm.$watch('curPage',function(value){
        if(value=="goods"){
            vm.getGoods();
        }
        if(value=="order"){
            vm.getOrder();
        }
    })


})