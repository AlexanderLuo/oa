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
        pop:"",
        popData:{},




        pageNo:1,
        pageSize:10,
        total:1,
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

        checkAllFlag:false,  //全选标志

        query:function(pageNo){
            vm.pageNo=pageNo
            vm.queryData.page=pageNo;
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function(data){vm.queryHandle(data,vm["get"+path])})
        },
        queryHandle:function(data,callback,error){
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                callback(json);
            }else{
                error && error.call()
            }
        },



        getGoods: function (json) {
            vm.goodsReq=json.result.last_req_time;
            vm.orderReq = json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            json.result.list.forEach(function(el){
                el.check=false;
            });

            vm.dataList = json.result.list;
        },

        getOrder: function (json) {
            vm.orderReq = json.result.last_req_time;
            vm.records=json.result.total_count;
            vm.total=Math.ceil(vm.records/vm.pageSize)
            json.result.list.forEach(function(el){
                el.check=false;
            });
            vm.dataList = json.result.list;
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

        },     //全选
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
        //关掉
        close:function(){
            vm.pop=false;
        },
        open:function(el){
            vm.pop=vm.curPage;
            vm.popData={}

            switch (vm.curPage){
                case "goods":
                    vm.popData={
                        goods_name:el.goods_name,
                        goods_type:el.goods_type,
                        goods_size:el.goods_size,
                        goods_color:el.goods_color,
                        goods_shape:el.goods_shape,
                        goods_repertory:el.goods_repertory,
                        goods_sales:el.goods_sales,
                        goods_price:el.goods_price,
                        goods_postage:el.goods_postage,
                        goods_discount:el.goods_discount,
                        goods_sell_state:el.goods_sell_state,
                        goods_image:el.goods_image,
                        goods_detail:el.goods_detail
                    }

                    break;
                case "order":
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
                // success: function(res){
                //     conf=res
                //     vm.router("goods")
                // },
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

})