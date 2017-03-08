if(jQuery.qtip){
    //qtip最顶部
    $.fn.qtip.zindex = 99999999;
}
$.ajaxSetup ({
    cache: false //关闭AJAX相应的缓存
});



/*********************************************************************
 *                    全局变量 及方法                                 *
 **********************************************************************/

//获取url地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}


// 获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


//星期列表
var timeDay = {
    "0": "星期天",
    "1": "星期一",
    "2": "星期二",
    "3": "星期三",
    "4": "星期四",
    "5": "星期五",
    "6": "星期六"
};




var THIRDCONFIG = "thirdConfig";

//loading
var loadIndex;
var openLoading = function () {
    loadIndex = layer.load(1, {
        shade: [0.3, '#000'],
        area: '64px'
    });
}
var closeLoading = function () {
    layer.close(loadIndex);
}
//时间长度
var timeLength = function (param) {
    param += "";
    return param.length === 2 ? param : "0" + param;
};
//将时间戳改成年月日时分秒
var timeFormat = function (ms, showDay) {
    if (typeof ms == 'string') {
        ms = parseInt(ms);
    }
    var timeLocal = new Date(ms);
    var year = timeLocal.getYear() + 1900;
    var month = timeLength(timeLocal.getMonth() + 1);
    var day = timeLength(timeLocal.getDate());
    var hour = timeLength(timeLocal.getHours());
    var minutes = timeLength(timeLocal.getMinutes());
    var second = timeLength(timeLocal.getSeconds());
    var weekDay = timeDay[timeLocal.getDay()];
    if (!showDay) {
        var timeNew = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
    }
    else {
        var timeNew = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second + " " + weekDay;
    }

    return timeNew;
};
//是否成功返回
var isSuccess = function (result) {
    var rtnCode = result.rtnCode || result;
    if (result.uri && rtnCode == "0000001") {//登录无效
        window.location.href = result.uri;
        return false;
    }
     return "0000000" == rtnCode;
}

/*********************************************************************
 *                    扩展方法                                  *
 **********************************************************************/
// js中String添加replaceAll 方法
String.prototype.replaceAll = function (a, b) {
    var reg = new RegExp(a, "g");
    return this.replace(reg, b);
};
// js中String添加startWith方法
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}
// js中String添加endWith方法
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt)
{ //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

$.extend({
    //是否为空
    isNull: function (obj) {
        if (typeof(obj) == "undefined" || obj == "undefined") {
            return true;
        } else {
            return obj == null ? true : false;
        }
    },
    //获取IE版本
    msieVersion: function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0)      // If Internet Explorer, return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)))
        else                 // If another browser, return 0
            return 0
    },
    //是否IE
    isIE: function () {
        return $.msieVersion() > 0 ? true : false;
    },
    //扩展兼容主流浏览器ajax（兼容IE8+、chrome、firefox...）
    ajaxFun: function (options) {
        //IE版本
        var msieVersion = $.msieVersion.call(this);
        // 设置默认参数
        var settings = $.extend({
            url: '',
            isPlain: true,      //content-type是否为空text/plain
            isXhr: false,    //检查跨域头（主平台）
            data: {},
            type: 'get',
            dataType: 'json',
            onSuccess: function (data) {
            },
            onError: function (data) {
            }
        }, options);
        settings.isCrossDomain = false;
        //http开头，默认外链
        if (settings.url.startWith("http")) {
            settings.isCrossDomain = true;
        }
        //IE浏览器（IE10以下）并且跨域请求
        if ($.isIE.call(this) && settings.isCrossDomain && msieVersion <= 9) {
            if (!settings.isPlain) {
                settings.type = "get";
            }
            // IE7 and lower can't do cross domain
            if (msieVersion <= 7) {
                alert("不支持IE8以下浏览器，请升级浏览器版本！");
                return;
            }
            // IE8 & 9 only Cross domain  request
            if (msieVersion == 8 || msieVersion == 9) {
                var xdr = new XDomainRequest(); // Use Microsoft XDR
                settings.data["t"] = Math.random();
                if (settings.type.toLocaleLowerCase() == "get") {
                    settings.url += ( ( /\?/ ).test(settings.url) ? "&" : "?") + $.param(settings.data);
                }
                xdr.open(settings.type, settings.url);
                xdr.onload = function () {
                    var dom = new ActiveXObject('Microsoft.XMLDOM'),
                        JSON = $.parseJSON(xdr.responseText);
                    dom.async = false;
                    if (JSON == null || typeof (JSON) == 'undefined') {
                        JSON = $.parseJSON(data.firstChild.textContent);
                    }
                    settings.onSuccess.call(this, JSON);
                };
                xdr.onerror = function (e) {
                    settings.onError.call(this, {});
                };
                xdr.send($.param(settings.data));
            }
        }
        //普通方式
        else {
            $.ajax({
                url: settings.url,
                type: settings.type,
                data: settings.data,
                cache: false,
                dataType: settings.dataType,
                xhrFields: {
                    withCredentials: settings.isXhr
                },
                complete: function (data) {
                    if (data.getResponseHeader("sessionstatus") == "timeout") {
                        layer.alert("登录超时，请重新登录！", function () {
                            store.clear();
                            sessionStorage.clear();
                            $.removeCookie("access_token");
                            window.location = "/";
                            return;
                        });
                    }
                    settings.onComplete.call(this, data);
                },
                success: function (data) {
                    settings.onSuccess.call(this, data);
                },
                error: function (data) {
                    avalon.log("error", data)
                    settings.onError.call(this, data);
                }
            });
        }
    }
});
/*********************************************************************
 *                    公用方法                                  *
 **********************************************************************/

//设置本地存储
var setLocalValue = function (itemName, itemValue) {
    //存储，IE6~7 cookie 其他浏览器HTML5本地存储
    if (window.localStorage) {
        localStorage.setItem(itemName, JSON.stringify(itemValue));
    } else {
        Cookie.write(itemName, JSON.stringify(itemValue));
    }
}

//获得本地存储
var getLocalValue = function (item, key) {
    if (key == undefined) {
        return JSON.parse(window.localStorage ? localStorage.getItem(item) : Cookie.read(item));
    } else {
        return JSON.parse(window.localStorage ? localStorage.getItem(item) : Cookie.read(item))[key];
    }
}

//获取用户信息并设置在本地存储
var getUserInfo = function (callback) {
    $.ajaxFun({
        url: "/sys/user/getUserInfo",
        onSuccess: function (data) {
            if (isSuccess(data)) {
                setLocalValue("account", data.bizData.account);
                setLocalValue("projectInfo", data.bizData.projectInfo);
                if (callback)callback(data.bizData);
            }
        }
    });
}

//layer弹出层读取参数
var getParam = function (name) {
    return JSON.parse($(".layui-layer-content #param").val())[name];
}

//弹窗公共方法
var layerOpen = function (url, title, data, width, height, afterSave,afterCancel,afterOpen) {
    var area = [width, height];
    if (height == 'auto') {
        area = width;
    }
    var str = JSON.stringify(data);
    var hidden = "<input id='param' type='hidden' value='" + str + "' />";
    $.get(url, function (html) {
        layer.open({
            type: 1,
            title: title,
            shift: 2,
            moveEnd: function () {
                closeAllTip();
            },
            cancel: function () {
                //取消时重置回调，避免刷新
                /*callBack = function () {
                };*/
                afterCancel&&afterCancel();
            },
            end: function () {
                closeAllTip();
                //为了保存后刷新
                afterSave&&afterSave();
            },
            shadeClose: false,
            content: html + hidden,
            area: area
        });
        afterOpen&&afterOpen();
    });
}

//弹窗关闭公共方法
var layerClose = function () {
    layer.closeAll('page');
}

//关闭所有提示
function closeAllTip() {
    $('.qtip').each(function () {
        $(this).data('qtip').destroy();
    })
}


//获取url地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}


// 获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}


/**错误显示**/
function errorPlacement(error, element) {
    if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
        var eid = element.attr('name'); //获取元素的name属性
        element = $("input[name='" + eid + "']").last().parent(); //将错误信息添加当前元素的父结点后面
    }
    if (!error.is(':empty')) {

        $(element).not('.valid').qtip({
            overwrite: false,
            content: error,
            hide: false,
            show: {
                event: false,
                ready: true
            },
            style: {
                classes: 'qtip-cream qtip-shadow qtip-rounded'
            },
            position: {
                my: 'top left',
                at: 'bottom right'
            }
        }).qtip('option', 'content.text', error);
    }
    else {
        element.qtip('destroy');
    }
}
