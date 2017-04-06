/**
 * Created by Administrator on 2017/4/6 0006.
 */
    const u=require('./init');

    const statement=require("./statement.html");
    const statementDetail=require("./statementDetail.html");

    var map = {
        'statement': statement,
        'statementDetail': statementDetail
    }


    avalon.component('ms-tabs', {
        template:require('./statementTabs.html'),
        defaults: {
            pageNo:1,
            total:1,
            records:0,
            dataList:[],
            curPage:'',
            $query:"",

            query:function(pageNo){
                console.log(this.$query());
            },
            router:function(str,obj){
                this.curPage=map[str];
                this.pageAdapter(str,obj);
            },
            pageAdapter:function(str,obj){
                var _this=this;
                switch (str){
                    case 'statement':
                        _this.$query=function(){
                            return {
                                url:u.getConf().baseUrl+u.getConf().getMeasureList,
                                type:"post",
                                data:{
                                    page:_this.pageNo
                                },
                            }
                        };
                        break;
                    case 'statementDetail':
                        console.log(1)
                        break;
                }
            },
            onReady:function() {
                this.router('statement')
            }
        }
    });




