/// <reference path="msg.js" />
var param = {};
// 所有页面初始化效果
$(function() {
	/** 设置表单中启动与关闭事件 */
	select_radio();
	/** 分页绑定 */
	clickBind();
	/** 展示效果 */
	show_effect();
	/** 统计字数 */
	showTextLength();	
	/** 后台回车搜索*/
	$(window).keydown(function (event){
		if (event.keyCode==13){
			$(".btn-search ").click();
		}
	});
});
/**
 * 展示效果
 */
var show_effect = function() {
	/** 提示操作 展开与隐藏 */
	$("#cols_show tr.odd").css( { "cursor" : "pointer" });
	$("#prompt tr.odd,#cols_show tr.odd").click(function() {
		$(this).nextAll("tr:not(.odd)").toggle();
		$(this).find(".title").toggleClass("ac");
		$(this).find(".arrow").toggleClass("up");
		if ($(this).parents("table").hasClass("freight")) {
			if ($(this).next("tr:not(.odd)").css("display") != "none") {
				if ($("[name=freight_mode]:checked").val() == 2 && $("#select_freight_template").find("select").val() != -1) {
					$("#tr_delivery_mode").show();
					return;
				}
			}
			$("#tr_delivery_mode").hide();
		}
		if ($(this).parents("table").hasClass("region")) {
			$("#app_region").hide();
			$("#tv_region").hide();
			if ($(this).next("tr:not(.odd)").css("display") != "none") {
				if ($("#h_app").val() == 1) {
					$("#app_region").show();
				}
				if ($("#h_tv").val() == 1) {
					$("#tv_region").show();
				}
			}
		}
	});
	/** 显示隐藏预览图 start */
	$('.show_image').hover(function() {
		$(this).next().css('display', 'block');
	}, function() {
		$(this).next().css('display', 'none');
	});
	/** 显示图片*/
	show_image();
	/** 选项卡切换*/
	tabs();
};
var show_image = function() {
	/** 显示隐藏预览图 start */
	$('.show_image').hover(function() {
		$(this).next().css('display', 'block');
	}, function() {
		$(this).next().css('display', 'none');
	});
};
/**
 * 选项卡
 */
var tabs = function() {
	$("[data-tag=tabs]").each(function() {
		var tabs = $(this);
		tabs.find(".ui-tabs-panel").hide();
		tabs.find(".ui-tabs-panel").eq(0).show();
		tabs.find(".tab li").eq(0).addClass("ui-tabs-selected").siblings().removeClass("ui-tabs-selected");
		tabs.find(".tab li:not(.add)").click(function() {
			var li = $(this),index=$(this).index();
			li.addClass("ui-tabs-selected").siblings().removeClass("ui-tabs-selected");
			tabs.find(".ui-tabs-panel").eq(li.index()).show().siblings(".ui-tabs-panel").hide();
			
		});
	});
};
var clickBind = function() {
	$("[data-tag]:not(.uploadImg)").unbind("click");
	/** 表单是否启用 */
	_fromEnabled();
	/** 表单文本输入 */
	_fromPrintText();
	
	/** 设置多项操作 */
	_fromHandle();
	/** 绑定全选事件 */
	_fromAllCheck();
	/** 绑定单个操作事件 */
	_fromtSingleData();
	/** 绑定表单验证 */
	onlyInput();
	/** 列表变色 */
	$(".hover").hover(function() {
		$(this).addClass("cur");
	}, function() {
		$(this).removeClass("cur");
	});
};
/** *****************************************************表单验证、字符替换*************************************** */
/***
 * 统计字数
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
var showTextLength = function() {
	$("[data-tag=textLength]").each(function() {
		var maxLength = $(this).attr("maxlength");
		if (isNaN(maxLength)) {
			return;
		}
		var showTag = $(this).attr("showTag");
		if (isNull(showTag)) {
			return;
		}
		var value = $(this).val();
		if (!isNull(value)) {
			$("#" + showTag).html(maxLength - value.length);
		}
		var lengthText = function(_this) {
			var val = $(_this).val();
			var length = maxLength - val.length;
			$("#" + showTag).html(length);
		};
		$(this).keypress(function() {
			lengthText(this);
		});
		$(this).keydown(function() {
			lengthText(this);
		});
		$(this).keyup(function() {
			lengthText(this);
		});
		$(this).blur(function(){
			lengthText(this);
		});
	});
};


/**文本框特殊事件*/
var onlyInput = function() {
	/** onlyInputNum=1 标签 文本框只能输入数字 */
	isNum();
	/** isToFixed=1 标签 文本框保留小数点 */
	isToFixed();
	/** isToFixedOne=1 标签 文本框保留小数点一位 */
	isToFixedOne();
	/** isToFixedTwo=1 标签 文本框保留小数点二位 */
	isToFixedTwo();
	/** 获取交单事件*/
	isInputTip();
};
/** 文本框失去焦点和获取焦点事件显示提示 */
var isInputTip = function() {
	$(":input[onlyInputTip=1]").each(function() {
		var text = $(this);
		var tip = text.attr("data-tip");
		if (isNull(text.val())) {
			text.val(tip);
		}
		text.focus(function() {
			if (text.val() == tip) {
				text.val("");
			}
		});
		text.blur(function() {
			if (isNull(text.val())) {
				text.val(tip);
			}
		});
	});
};
/** 验证文本框是否等于空或者等于提示值 true不通过 false通过 */
var validatorInputTip = function(id) {
	var value = $(id).val();
	var tip = $(id).attr("data-tip");
	if (isNull(value) || value == tip) {
		return true;
	}
	return false;
};
/**
 * 文本框只能输入数字
 */
var isNum = function() {
	/** 只能输入数字文本框 */
	$(":input[onlyInputNum=1]").each(function() {
		var _this = $(this);
		if (!isNull(_this.val())){
			_this.val(replaceNum($(_this).val()));
		}
		_this.css({"ime-mode": "disabled"});
		_this.keypress(function (event){
			key = event.which;			
			 /** 49-57小键盘数字 */
			 if (key==8 || key==0|| (key>=48 && key<=57)){			
				 return true;
			 }else {
				 return false;
			 }
		});
		_this.blur(function() {
			$(this).val(replaceNum($(this).val()));
		});
	});

};
var isToFixed = function() {	
	$(":input[onlyInputFixed=1]").each(function() {
		var _this = $(this);
		if (!isNull(_this.val())){
			_this.val(replaceFixed($(_this).val()));
		}
		_this.css({"ime-mode": "disabled"});
		_this.keypress(function (event){
			key = event.which;	
			 /** 46小数点 49-57小键盘数字 */
			 if (key==8 || key==0||key==46||(key>=48 && key<=57)){
				 value=$(this).val();
				 /** 如果存在小数点则不让输入 */
				 if (key==46 &&(isNull(value) ||value.indexOf(".")!=-1)){
					 return false;
				 }
				 return true;
			 }else {
				 return false;
			 }
		});
		_this.blur(function() {
			$(this).val(replaceFixed($(this).val()));
		});
	});
};
/**
 * 文本框验证小数点一位
 */
var isToFixedOne = function() {
	$(":input[onlyInputFixedOne=1]").each(function() {
		var _this = $(this);
		if (!isNull(_this.val())){
			_this.val(replaceFixedOne($(_this).val()));
		}
		_this.css({"ime-mode": "disabled"});		
		_this.keypress(function (event){
			 key = event.which;	
			 /** 46小数点 49-57小键盘数字 */
			 if (key==8 || key==0||key==46||(key>=48 && key<=57)){
				 value=$(this).val();
				 /** 如果存在小数点则不让输入 */
				 if (key==46 &&(isNull(value) ||value.indexOf(".")!=-1)){
					 return false;
				 }
				 return true;
			 }else {
				 return false;
			 }
		});
		_this.blur(function() {
			$(this).val(replaceFixedOne($(this).val()));
		});
	});
};
/**
 * 文本框验证小数点二位
 */
var isToFixedTwo = function() {	
	$(":input[onlyInputFixedTwo=1]").each(function() {
		var _this = $(this);
		if (!isNull(_this.val())){
			_this.val(replaceFixedTwo($(_this).val()));
		}
		_this.css({"ime-mode": "disabled"});
		_this.keypress(function (event){
			key = event.which;	
			 /** 46小数点 49-57小键盘数字 */
			 if (key==8 || key==0||key==46||(key>=48 && key<=57)){
				 value=$(this).val();
				 /** 如果存在小数点则不让输入 */
				 if (key==46 &&(isNull(value) ||value.indexOf(".")!=-1)){
					 return false;
				 }
				 return true;
			 }else {
				 return false;
			 }
		});
		_this.blur(function() {
			$(this).val(replaceFixedTwo($(this).val()));
		});
	});
};
/** 保留一位小数 */
var replaceFixedOne = function(val) {
	if (isNull(val)  || isNaN(val)) {
		val = "0.0";
	} else {	
		val = parseFloat(val);
		if (isNaN(val)){
			val="0.0";
		}
		if(val<0){
			val="0.0";
		}
		if (isNaN(val)){
			val = "0.0";
		}else {			
			val = parseFloat(val).toFixed(1);
		}
	}
	return val;
};
/** 保留两位小数 */
var replaceFixedTwo = function(val) {
	if (isNull(val))
		val = "0.00";
	else {
		val = parseFloat(val);
		if (isNaN(val)){
			val="0.00";
		}
		if(val<0){
			val="0.00";
		}
		if (isNaN(val)){
			val = "0.00";
		}else {			
			val = parseFloat(val).toFixed(2);
		}
	}
	return val;
};
/** 保留小数 */
var replaceFixed= function(val) {
	if (isNull(val))
		val = "0.00";
	else {
		val = parseFloat(val);
		if (isNaN(val)){
			val="0.00";
		}
		if(val<0){
			val="0.00";
		}
		if (isNaN(val)){
			val = "0.00";
		}
	}
	return val;
};
/** 替换成纯数字字符串 */
var replaceNum = function(val) {
	if (isNull(val))
		val = 0;
	else{	
		if ( isNaN(val)){			
			val = val.replace(/\D/gi, "");
		}
	}
	return val;
};
/** 替换成带小数的字符串 */
var replaceFixed=function (val){
	if (isNull(val)){
		val = 0;
	}else{
		if (isNaN(val)){
			val = val.replace(/[^\d.]/g,"");
			val = val.replace(/^\./g,"");
			val = val.replace(/\.{2,}/g,".");
		}	
	}
	return val;
};
/** 去除空格 */
var replaceTrim = function(val) {
	if (isNull(val))
		val = "";
	else
		val.replace(/(^\s*)|(\s*$)/g, "");
	return val;
};
/** 验证是否是空 true 空 false 不是空 */
var isNull = function(text) {
	if (text == null || text == undefined || $.trim(text).length <= 0) {
		text = text + "";
		if (isNaN(text)) {
			return true;
		} else {
			if ($.trim(text).length <= 0) {
				return true;
			}
		}
	}
	return false;
};
/** 验证复选框是否点击 */
var isChecked = function(_this) {
	if (_this.attr("checked") == "checked") {
		return true;
	} else {
		return false;
	}
};
/** 等同于 java.trim 注:内容必须等于String类型否则不能引用此方法 */
String.prototype.trim = function() {
	val = this+"";
	return val.replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '');	
};
/** toFixed 方法重现 保留小数点后面d位小叔 */
Number.prototype.toFixed = function(d) {
	var s = this + "";
	if (!d)
		d = 0.0;
	if (s.indexOf(".") == -1)
		s += ".";
	s += new Array(d + 1).join("0");
	if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
		var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
		if (a == d + 2) {
			a = s.match(/\d/g);
			if (parseInt(a[a.length - 1]) > 4) {
				for ( var i = a.length - 2; i >= 0; i--) {
					a[i] = parseInt(a[i]) + 1;
					if (a[i] == 10) {
						a[i] = 0;
						b = i != 1;
					} else
						break;
				}
			}
			s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
		}
		if (b)
			s = s.substr(1);
		return (pm + s).replace(/\.$/, "");
	}
	return this + "";
};

 var removeHtml=function (str){
 	 return str.replace(/<[^>]+>/g,"");
 };
 
 
/** *****************************************************表单事件*************************************** */
var select_radio = function() {
	/** 是否启用 有data-tag="onoff" 标签开启是否启用按钮 data-value="" 为获取值 */
	$("[data-tag=onoff] label").click(function() {
		var _label = $(this);
		_label.addClass("selected").siblings().removeClass("selected");
		/** 设置值 */
		_label.parent().find(":hidden").val($(this).attr("data-value"));
	});
	/** 设置默认选中值 */
	$("[data-tag=onoff]").each(function() {
		var select_id = $(this).find(":hidden").val();
		if (isNull(select_id)) {
			$(this).find(":hidden").val("1");
		} 
		$(this).find("[data-value=" + select_id + "]").addClass("selected").siblings().removeClass("selected");
	});
};

/**
 * 
 * 获取是否启用文本值 val : 选择器 retrun 所选中的data-value值
 */
var radio_value = function(val) {
	/** 单选获取值 */
	var val = $(val + "[data-tag=onoff]").find(".selected").attr("data-value");
	return val;
};
/*******************************************************************************
 * 上传图片
 * 
 */
var _kindEnitor={};
$.loadImgInit=function (callback){	
	var upload=$("[data-tag=uploadImg]");
	if (upload.length<=0){ return;}
	/** 加载JS */
	$("<link>").attr({
		rel: "stylesheet",
   		type: "text/css",
    	href: "../common/kindeditor/themes/default/default.css"
   	}).appendTo("head");
	$("<link>").attr({ 
		rel: "stylesheet",
    	type: "text/css",
    	href: "../common/kindeditor/plugins/code/prettify.css"
	}).appendTo("head");
	$.getScript("../common/kindeditor/lang/zh_CN.js");
	$.getScript("../common/kindeditor/plugins/code/prettify.js");
	/** 加载JS结束 */
	loadKindEdiet(upload, callback);
};


//加载编辑器
function loadKindEdiet(upload, callback){
	/** 加载JS结束 **/
	KindEditor.ready(function(K) {	
		upload.each(function (){
			var _btn=$(this);// 上传按钮
			_btn.css({"cursor":"pointer"});
			var _class=_btn.attr("data-class"); // 获取图片样式
			if (isNull(_class)){
				alertMsg("上传图片参数出错...",2);
				return;
			}
			var _dev=_btn.attr("data-dev");
			if (isNull(_dev)){
				alertMsg("上传图片参数出错...",2);
				return;
			}
			var _value=$(this).attr("data-value");
			if (isNull(_value)){
				alertMsg("上传图片参数出错...",2);
				return;
			}
			var kindeditor_upload_img =null;
			if (isNull(_kindEnitor[_class])){
				kindeditor_upload_img = K.editor({
					uploadJson : 'myFileUpload.do?p='+_dev, 
					fileManagerJson : 'myKindEditorManager.do?p='+_dev
				});
				_kindEnitor[_class]=kindeditor_upload_img;
			}else {
				kindeditor_upload_img=_kindEnitor[_class];				
			}			
			var _url=$("."+_class+":hidden").val();
			
			if (!isNull(_url)){
			
				_btn.parents(".upload-div").find("img[class="+_class+"]").attr("src",parent._basePath + _url);
				_btn.parents(".upload-div").find("."+_class+":input").val(_url);
			}
			$(this).parents(".upload-div").find(":button,:text, img,."+_class+",[data-tag=uploadImg]").on("click",function() {
				kindeditor_upload_img.loadPlugin('image', function() {
					kindeditor_upload_img.plugin.imageDialog( { 
						showRemote : false, 
						imageUrl : $("."+_class+":image").attr("src"), 
						clickFn : function(data) {
							_btn.parents(".upload-div").find("."+_class+":input").val(data.url);
							data.basePath=parent._basePath;
							_btn.parents(".upload-div").find("img[class="+_class+"]").attr("src",data.basePath + data.url);
							kindeditor_upload_img.hideDialog();
							if (callback!=null && callback!=undefined){
								callback(_value, data);
							}
						}
					});
				});
			});
		});
	});	
	
}

/** *****************************************************列表事件*************************************** */

/**
 * 全选
 */
var _fromAllCheck = function() {
	/** 绑定全选事件 */
	$("[data-tag=check_all]").click(function() {
		_fromCheckAll(this, $(this).attr("data-children_name"));
	});
};
/**
 * 执行多项操作方法
 */
var _fromHandle = function() {
	$("[data-tag=handle]").each(function() {
		var btn = $(this);
		var children_name = btn.attr("data-children_name");
		/** 选中复选框 name 属性值 */
		if (isNull(children_name)) {
			alertMsg("选中复选框name未绑定!", 2);
			return;
		}
		_fromDataCheck(children_name, btn);
	});
};
/**
 * 
 * 执行多项操作事件 checkbox ：复选框 children_name ：子级复选框 name属性值 button ：删除按钮
 * 
 */
var _fromDataCheck = function(children_name, button) {
	/**
	 * 设置多行操作事件 /**_fromDataCheck("del_id", "#btnDel"); /** 按钮绑定自定标签 /**
	 * data-url="Handler1.ashx" 异步操作路径 /** data-confirmmsg="你确定要操作?" 弹出确认层消息 /**
	 * data-msg="操作成功!" 消息层消息 /**绑定操作事件
	 */
	$(button).click(function() {
		var btn = $(this);
		/** 回调路径 */
		var url = btn.attr("data-url");
		if (isNull(url)) {
			alertMsg("回调路径有误", 2);
			return;
		}
		/** 参数 */
		var _param = btn.attr("data-param");
		var confirmMsg = btn.attr("data-confirmmsg");
		var msg = btn.attr("data-msg");
		var ids = _fromCheckValue(children_name);
		if (isNull(ids)) {
			alertMsg("请选择操作项!", 2);
			return;
		}
		if (isNull(confirmMsg)) {
			handleData(url, ids, _param, msg);
		} else {
			alertConfirm(confirmMsg, function() {
				handleData(url, ids, _param, msg);
			});
		}
	});
};
/**
 * 单个事件执行
 */
var _fromtSingleData = function() {
	$("[data-tag=single_handle]").click(function() {
		/** 回调路径 */
		var url = $(this).attr("data-url");
		if (isNull(url)) {
			alertMsg("回调路径有误", 2);
			return;
		}
		/** 参数 */
		var _param = $(this).attr("data-param");
		var confirmMsg = $(this).attr("data-confirmmsg");
		var msg = $(this).attr("data-msg");
		if (isNull(confirmMsg)) {
			handleData(url, "", _param, msg);
		} else {
			alertConfirm(confirmMsg, function() {
				handleData(url, "", _param, msg);
			});
		}
	});
};
/**
 * 
 * 操作数据
 * 
 */
var handleData = function(url, ids, _param, msg) {
	debugger;
	param = _paramValues(_param);
	if (!isNull(ids)) {
		param["ids"] = ids;
	}
	$.shovePost_(url, param, function(data) {
		if (data > 0) {
			if (!isNull(msg)) {
				alertMsg(msg, 1, function() {
					doJumpPage(1);
				});
			} else {
				doJumpPage(1);
			}
		} else {
			/** 删除之后 */
			alertMsg("系统错误...", 2);
		}
	});
};
/**
 * 
 * 表单中是否启用按钮
 * 
 */
var _fromEnabled = function(val) {
	/**
	 * 表单中是否启用 有 data-tag="enabled" 开启 data-url="" 异步URL data-enabled="{}"
	 * 启用执行参数 data-disabled="{}" 禁用执行参数
	 */
	$("[data-tag=enabled]").click(function() {
		var link = $(this);
		/** 回调路径 */
		var url = link.attr("data-url");
		if (isNull(url)) {
			alertMsg("回调路径有误", 2);
			return;
		}
		/** 启用参数 */
		var enabled = link.attr("data-enabled");
		if (isNull(enabled)) {
			alertMsg("启用参数有误", 2);
			return;
		}
		/** 关闭参数 */
		var disabled = link.attr("data-disabled");
		if (isNull(disabled)) {
			alertMsg("关闭参数有误", 2);
			return;
		}
		/** 是否刷新表单 */
		var isRefresh = link.attr("data-isRefresh");
		var value = "";
		var status = link.hasClass("enabled");
		/** 状态 */
		if (status) {
			/** 启用事件 */
			value = enabled;
		} else {
			/** 取消事件 */
			value = disabled;
		}
		param = _paramValues(value);
		if(val == 1){//不需要关闭窗口
			$.shovePost(url, param, function(data) {
				if (data > 0) {
					/** 成功之后 */
					alertMsg("修改成功", 1);
					if (status) {link.addClass("disabled").removeClass("enabled");} 
					else {link.addClass("enabled").removeClass("disabled");}
				} else {alertMsg("系统错误...", 2);/** 删除之后 */}
			});
			return ;			
		}
		
		$.shovePost_(url, param, function(data) {
			if (data > 0) {
				/** 成功之后 */
				if (status) {
					link.addClass("disabled").removeClass("enabled");
				} else {
					link.addClass("enabled").removeClass("disabled");
				}
				if (isRefresh==1){		
					doJumpPage($("#txtPageNum").val());
				}
			} else {
				/** 删除之后 */
				alertMsg("系统错误...", 2);
			}
		});
	});
};
function _paramValues(str) {
	param = {};
	if (!isNull(str)) {
		var list = str.split(",");
		for ( var i = 0; i < list.length; i++) {
			var val = list[i];
			var values = val.split(":");
			if (values.length == 2) {
				param[values[0]] = values[1];
			}
		}
	}
	return param;
}
/**
 * 
 * 表单文本框控制
 * 
 */
var _fromPrintText = function() {
	/** maxvalue="5" 文本框最大长度 */
	/** data-text="2" 文本框类型 1文本 2数字 */
	/** data-url="Handler1.ashx" 回调路径 */
	/** data-id="1" 执行ID */
	/** data-tag="text" 必填类型标签 */
	$("[data-tag=text]").each(function() {
		var span = $(this);
		/** 点击span */
		var id = span.attr("data-id");
		/** 文本框ID */
		var url = span.attr("data-url");
		/** 回调路径 */
		if (isNull(url)) {
			alertMsg("回调路径有误", 2);
			return;
		}
		if (isNull(id)) {
			alertMsg("配置错误ID空");
			return;
		}
		var text_type = span.attr("data-text");
		/** 文本类型 1、文本 2、数字 */
		/** 判断文本类型 */
		if (isNull(text_type)) {
			text_type = 1;
		}
		/** 鼠标移入 */
		span.mouseover(function() {
			span.attr("class", "editable2");
		});
		/** 鼠标移出 */
		span.mouseout(function() {
			span.attr("class", "editable");
		});
		/** 获取焦点 */
		span.click(function() {
			/** 获取文本最大长度 */
			var maxvalue = span.attr("maxvalue");
			var span_value = span.html();
			if (isNaN(maxvalue)) {
				maxvalue = 250;
			}
			var div = span.parent();
			div.append('<input type="text" value="' + span_value.trim() + '" '+(text_type==2?'onlyInputNum="1"':'') +' maxlength="' + maxvalue + '"/>');
			/** 添加文本框HTML */
			var text = div.find(":input");
			/** 选中文本框 */
			span.hide();
			text.focus();
			text.select();
			isNum();
			text.blur(function() {
				value = text.val();
				/** 验证类型是否正确 */
				if (text_type == 1) {
					if (isNull(value)) {
						alertMsg("请输入正确的文本值.", 2);
						return;
					}
				} else if (text_type == 2) {
					value = parseInt(value);
					if (isNaN(value)) {
						alertMsg("请输入正确的数字.", 2);
						return;
					}
				} else {
					return;
				}
				if (value == span_value) {
					text.remove();
					span.html(value);
					span.show();
					return;
				}
				param = {};
				param["value"] = value;
				param["id"] = id;
				/** 异步提交 */
				$.shovePost(url, param, function(data) {
					if (data <= 0) {
						alertMsg("系统错误...", 2);
						value = span_value;
					}
					text.remove();
					span.html(value);
					span.show();
				});
			});
		});
	});
};


/**
 * 
 * 表单文本框控制
 * 
 */

var _fromPrintTextupdate = function(_this,test,url) {
	if(event.stopPropagation){
		event.stopPropagation();
	}else if(event.cancelBubble){
		event.cancelBubble();
	}
	/** maxvalue="5" 文本框最大长度 */
	/** data-text="2" 文本框类型 1文本 2数字 */
	/** data-url="Handler1.ashx" 回调路径 */
	/** data-id="1" 执行ID */
	/** data-tag="text" 必填类型标签 */
	
	$("#"+_this).attr("onclick","_fromPrintTextupdate1('"+_this+"','"+test+"','"+url+"')");
	$("#"+_this).attr("value","保存");
	$("[data-tag="+test+"]").each(function() {
		var span = $(this);
		/** 点击span */
		var text_type = span.attr("data-text");
		/** 文本类型 1、文本 2、数字 */
		/** 判断文本类型 */
		if (isNull(text_type)) {
			text_type = 1;
		}
		/** 获取文本最大长度 */
		var maxvalue = span.attr("maxvalue");
		var span_value = span.html();
		if (isNaN(maxvalue)) {
			maxvalue = 250;
		}
		var div = span.parent();
		if(text_type==1){
			div.append('<input type="text"   value="' + span_value.trim() + '"  maxlength="' + maxvalue + '"/>');
		}else if(text_type==2){
			div.append('<input type="text" onclick="_fromDate()" id="date1"   value="' + span_value.trim() + '"  maxlength="' + maxvalue + '"/>');
		}else if(text_type==3){
			var PROVINCE_ID=$("#PROVINCE_ID1").val();
			var CITY_ID=$("#CITY_ID1").val();
			var AREA_ID=$("#AREA_ID1").val();
			var CONSIGNEE_ADDRESS=$("#CONSIGNEE_ADDRESS1").val();
			var arr = [];
			arr.push('<span data-max="3" id="PROVINCE1" data-id="ID" data-name="REGIONNAME" data-url="ajaxqueryRegion.do">');
			arr.push('<input type="hidden" name="paramMap.PROVINCE_ID" id="PROVINCE_ID" value="'+PROVINCE_ID.trim()+'"/>');
			arr.push('<input type="hidden" name="paramMap.CITY_ID" id="CITY_ID" value="'+CITY_ID.trim()+'"/> ');
			arr.push('<input type="hidden" name="paramMap.AREA_ID" id="AREA_ID"   value="'+AREA_ID.trim()+'" />');
			arr.push('</span>');
			arr.push('<input type="text"  class="mr3" value="' + CONSIGNEE_ADDRESS.trim() + '"  maxlength="' + maxvalue + '"/>');
			div.append(arr.join(""));
		}
		/** 添加文本框HTML */
		var text = div.find(":input");
		if(text_type==3){
			 text = div.find("span");
		}
		/** 选中文本框 */
		span.hide();
		text.focus();
		text.select();
		isNum();
		if(text_type==3){
			$.multilevel.Init("#PROVINCE1");
		}
	});
		
};

var _fromDate=function()
{
	layDate("#date1");
};

var _fromPrintTextupdate1 = function(_this,test,url) {
	//防止冒泡
	if(event.stopPropagation){
		event.stopPropagation();
	}else if(event.cancelBubble){
		event.cancelBubble();
	}
	/** maxvalue="5" 文本框最大长度 */
	/** data-text="2" 文本框类型 1文本 2数字 */
	/** data-url="Handler1.ashx" 回调路径 */
	/** data-id="1" 执行ID */
	/** data-tag="text" 必填类型标签 */
	$("#"+_this).attr("onclick","_fromPrintTextupdate('"+_this+"','"+test+"','"+url+"')");
	$("#"+_this).attr("value","编辑");
	param = {};
	param["ID"]=$("#"+test+"_Id").val();
	$("[data-tag="+test+"]").each(function() {
		var span = $(this);
		/** 点击span */
		var text_type = span.attr("data-text");
		if (isNull(text_type)) {
			text_type = 1;
		}
		if(text_type==3){
			var div = span.parent(); 
			var PROVINCE1 = div.find("#PROVINCE1");
			var _PROVINCE_ID = div.find("#PROVINCE_ID");
			var _CITY_ID = div.find("#CITY_ID");
			var _AREA_ID = div.find("#AREA_ID");
			var _text = div.find(":text");
			var PROVINCE_ID = _PROVINCE_ID.val();
			var CITY_ID =_CITY_ID.val();
			var AREA_ID = _AREA_ID.val();
			var text = _text.val();
			var PROVINCE_NAME=div.find("select").eq(0).find("option:selected").text();
			var CITY_NAME=div.find("select").eq(1).find("option:selected").text();
			var AREA_NAME=div.find("select").eq(2).find("option:selected").text();
			
			_text.remove();
			PROVINCE1.remove();
			
			span.html(PROVINCE_NAME+CITY_NAME+AREA_NAME+text);
			$("#PROVINCE_ID1").val(PROVINCE_ID);
			$("#CITY_ID1").val(CITY_ID);
			$("#AREA_ID1").val(AREA_ID);
			$("#CONSIGNEE_ADDRESS1").val(text);
			param["PROVINCE_ID"]=PROVINCE_ID;
			param["CITY_ID"]=CITY_ID;
			param["AREA_ID"]=AREA_ID;
			param["CONSIGNEE_ADDRESS"]=text;
			span.show();
			
		}else 
		{
			var div = span.parent(); 
			var text = div.find(":input");
			value = text.val();
			text.remove();
			span.html(value);
			span.show();
			var spanId=span.attr('id');
			var spanValue=span.text().trim();
			param[spanId] = spanValue;
		}
		
			
	});
	/** 异步提交 */
	$.shovePost(url, param, function(data) {
		if (data.type <= 0) {
			alertMsg(data.msg, 2);
		}
	});
	
	
};



/**
 * 
 * @Description 发送post请求 当有拦截器返回信息进行处理
 * @param url
 *            请求地址
 * @param param
 *            请求参数
 * @param callBack
 *            成功后回调方法
 * @Author Yang Cheng
 * @Date: 2012-2-17 18：00
 * @Version 1.0
 * 
 */
$.shovePost = function(url, param, callBack) {
	url = url + "?shoveDate" + new Date().getTime();
	$.ajax( { type : "post", url : url, data : param, success : function(data) {
		if (data == "noLogin") {
			alertMsg("请您先登录...", 2, function() {
				location.href = "login.do";
			});
			return;
		}
		callBack(data);
	}, error : function(XMLHttpRequest, textStatus, errorThrown) {} });
};
/** 加载 */
$.shovePost_= function(url, param, callBack) {
	alertLoad("加载中...");
	url = url + "?shoveDate" + new Date().getTime();
	$.ajax( { type : "post", url : url, data : param, success : function(data) {
		alertClose();
		if (data == "noLogin") {
			alertMsg("请您先登录...", 2, function() {
				location.href = "login.do";
			});
			return;
		}
		callBack(data);
	}, error : function(XMLHttpRequest, textStatus, errorThrown) {
		//console.log("出错");
		alertMsg("系统错误",2);		
	} });
};
/**
 * 
 * @Description 跳转页面方法
 * @param i
 *            跳转页数
 * @Author Yang Cheng
 * @Date: 2012-2-17 18：10
 * @Version 1.0
 * 
 */
function doJumpPage(i) {
	if (isNaN(i)) {
		alert("输入格式不正确!");
		return;
	}
	$("#pageNum").val(i);
	/** 回调页面方法 */
	initListInfo(i);
}

/** *****************************************************通用*************************************** */
/**
 * 
 * 加载日历控件 val : 日历控件选择器
 * 
 */

var layDate = function(val) {

	laydate({ 
			elem : val, // 需显示日期的元素选择器
			format: 'YYYY-MM-DD hh:mm:ss', // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(new Date().getTime(),'YYYY-MM-DD hh:mm:ss')// 默认日期为当前日期
			
		});
};

/**
 * 加载日历控件 val : 日历控件选择器
 */
var loadDate = function(val, format, istime, festival, max, start) {
	laydate({ 
			elem : val, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			max : max, // 最大截至时间
			start: start// 默认日期为当前日期， laydate.now(new Date().getTime(),'YYYY-MM-DD hh:mm:ss')
		});
};

/**
 * 
 * 加载日历控件 val : 日历控件选择器
 * @author LiMin
 */
var layFormatDate = function(val, format, istime) {

	laydate({ 
			elem : val, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(new Date().getTime(), format)// 默认日期为当前日期
			
		});
};


/**
 * * 加载日历控件  （结束时间不能早于开始时间）
 * @param {Object} val1  开始时间id
 * @param {Object} val2	 结束时间id
 */
var newLayDate = function(val1,val2,format) {
	if (format==null || format==undefined){
		format='YYYY-MM-DD hh:mm:ss';
	}
	
	var begin=( 
		{ 
			elem : val1, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
	            end.min = datas; //开始日选好后，重置结束日的最小日期
	            end.start = datas; //将结束日的初始值设定为开始日
            }
		});	
	var end={ 
			elem :val2, // 需显示日期的元素选择器
			format:format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
		    	begin.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		};
	$(val1).click(function(){
		laydate(begin);
	});
	$(val2).click(function(){
		laydate(end);
	});
};

/**
 * * 加载日历控件  （结束时间不能早于开始时间）
 * @param {Object} val1  开始时间id
 * @param {Object} val2	 结束时间id
 */
var newFormatLayDate = function(val1, val2, format, istime) {
	if (format==null || format==undefined){
		format='YYYY-MM-DD hh:mm:ss';
	}
	
	var begin=( 
		{ 
			elem : val1, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
	            end.min = datas; //开始日选好后，重置结束日的最小日期
	            end.start = datas; //将结束日的初始值设定为开始日
            }
		});	
	var end={ 
			elem :val2, // 需显示日期的元素选择器
			format:format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
		    	begin.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		};
	$(val1).click(function(){
		laydate(begin);
	});
	$(val2).click(function(){
		laydate(end);
	});
};

/**
 * * 加载日历控件  （结束时间不能早于开始时间）
 * @param {Object} val1  开始时间id
 * @param {Object} val2	 结束时间id
 */
var newFormatLayDate = function(dom1, val1, dom2, format, istime) {
	if (format==null || format==undefined){
		format='YYYY-MM-DD hh:mm:ss';
	}
	
	var begin=( 
		{ 
			elem : dom1, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
			min: val1,
		    choose: function(datas){
	            end.min = datas; //开始日选好后，重置结束日的最小日期
	            end.start = datas; //将结束日的初始值设定为开始日
            }
		});	
	var end={ 
			elem :dom2, // 需显示日期的元素选择器
			format:format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: istime, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
		    	begin.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		};
	$(dom1).click(function(){
		laydate(begin);
	});
	$(dom2).click(function(){
		laydate(end);
	});
};

var newLayDate = function(val1,val2,format,endIsStartTime) {
	if (format==null || format==undefined){
		format='YYYY-MM-DD hh:mm:ss';
	}
	if(endIsStartTime == null || endIsStartTime.length <= 0){
		endIsStartTime=laydate.now();
	}
	var begin=( 
		{ 
			elem : val1, // 需显示日期的元素选择器
			format:  format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
	            end.min = datas; //开始日选好后，重置结束日的最小日期
	            end.start = datas; //将结束日的初始值设定为开始日
            }
		});	
	var end=( { 
			elem :val2, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: endIsStartTime, // 默认日期为当前日期
			min : endIsStartTime,
		    choose: function(datas){
		       begin.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		});		
	laydate(begin);
    laydate(end);
};

var sanLayDate = function(val1,val2,val3) {
	var	format='YYYY-MM-DD hh:mm:ss';
	var one=( 
		{ 
			elem : val1, // 需显示日期的元素选择器
			format: format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
	            two.min = datas; //开始日选好后，重置结束日的最小日期
	            two.start = datas; //将结束日的初始值设定为开始日
            }
		});	
	var two=({ 
			elem :val2, // 需显示日期的元素选择器
			format:format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
		       one.max = datas; //结束日选好后，重置开始日的最大日期
		       thr.min = datas; //开始日选好后，重置结束日的最小日期
	           thr.start = datas; //将结束日的初始值设定为开始日
		    }
		});	
	
	var thr=({ 
			elem :val3, // 需显示日期的元素选择器
			format:format, // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			start: laydate.now(), // 默认日期为当前日期
		    choose: function(datas){
		       two.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		});	
	laydate(one);
    laydate(two);
    laydate(thr);
};



/**
 * 
 * * 加载日历控件  （结束时间不能早于开始时间,开始时间大于当前时间）
 * @param {Object} val1  开始时间id
 * @param {Object} val2	 结束时间id
 */
var newLayDateCom = function(val1,val2) {
	var begin=( 
		{ 
			elem : val1, // 需显示日期的元素选择器
			format: 'YYYY-MM-DD hh:mm:ss', // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			min: laydate.now(), //设定最小日期为当前日期
		    choose: function(datas){
	            end.min = datas; //开始日选好后，重置结束日的最小日期
	            end.start = datas; //将结束日的初始值设定为开始日
	            if(datas >laydate.now()){
	            	end.istoday=false;
	            }
            }
		});	
	var end=( { 
			elem :val2, // 需显示日期的元素选择器
			format: 'YYYY-MM-DD hh:mm:ss', // 日期格式 YYYY-MM-DD hh:mm:ss
			istime: true, // 是否开启时间选择
			festival : true,// 是否显示节日
			min: laydate.now(),
		    choose: function(datas){
		       begin.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		});		
	laydate(begin);
    laydate(end);
};

/**
 * 
 * 全选
 * 
 */
var _fromCheckAll = function(_this, name) {
	var checked = $(_this).attr("checked");
	if (checked == undefined) {
		checked = false;
	}
	_fromCheckedInCheckAllChecked(_this,name);
	$(":checkbox[name=" + name + "]").attr("checked", checked);
};
var _fromCheckedInCheckAllChecked = function (_this,name){
	$(":checkbox[name=" + name + "]").click(function() {
		if ($(":checkbox[name=" + name + "]:checked").length == $(":checkbox[name=" + name + "]").length) {
			$(_this).attr("checked", "checked");
		} else {
			$(_this).attr("checked", false);
		}
	});
};
/**
 * 
 * 获取选中值
 * 
 */
var _fromCheckValue = function(name) {
	var ids = "";
	$(":checkbox[name=" + name + "]").each(function() {
		if ($(this).attr("checked") == "checked") {
			if (ids == "") {
				ids += $(this).val();
			} else {
				ids += "," + $(this).val();
			}
		}
	});
	return ids;
};


