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
        typeList:[{id:0,name:"全部"},{id:1,name:"教材"},{id:2,name:"器材"},{id:3,name:"服饰"},{id:4,name:"其他"}],
        typeFilter:0,
        saleList:[{id:0,name:"上架",select:false},{id:1,name:"下架",select:false}],
        orderList:[{id:0,name:"全部"},{id:1,name:"待付款"},{id:2,name:"待发货"},{id:3,name:"待收货"},{id:4,name:"已收货"}],



        goods_type:0,
        order_state:0,
        list:[],
        goodsList: [],
        lastReq: 0,
        goodsReq: 0,
        orderReq: 0,
        curPage: "",
        pop:"",
        popData:{},
        imgList:{},
        detailList:{},




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
        rev:function(){
            switch (vm.curPage){
                case "goods":
                    var co=0;
                    vm.saleList.forEach(function(el){
                        if(el.select){
                            co=el.id
                        }
                    })
                    vm.popData.goods_sell_state=co;


                    break;
                case "order":
                    break
            }
            var path = vm.upperPage();
            $.ajax({url: vm.revUrl, type: "post", data: vm.popData}).done(function(data){vm.close();vm.query(1)})
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
                    vm.saleList[0].select=false
                    vm.saleList[1].select=false
                    vm.popData={
                        goods_id:el.goods_id,
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
                    if(el.goods_sell_state==0){
                        vm.saleList[0].select=true
                    }
                    if(el.goods_sell_state==1){
                        vm.saleList[1].select=true
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

    vm.$watch("typeFilter",function(data){
        console.log(data)
    })


    avalon.filters.typeStrFilter=function(str){
        var re="";
        vm.typeList.forEach(function(el){
            if(el.id==str){
                re=el.name
            }
        })
        return re
    }
    avalon.filters.saleStrFilter=function(str){
        var re="";
        vm.saleList.forEach(function(el){
            if(el.id==str){
                re=el.name
            }
        })
        return re
    }


})