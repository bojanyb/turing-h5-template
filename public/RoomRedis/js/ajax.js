var isPro = true;
var curUrl = window.location.host;
var baseApi = '';
// if (isPro) {
// var baseApi = 'https://m.aiyi.live';
// 	baseApi1 = '//m.live.huidapay.net';
// }
switch (curUrl) {
	case "h5.linux.ac.cn": // 测试环境
		baseApi = 'https://m.linux.ac.cn';
		break;
	case "h5.tuantuan.live": // 生产环境
		baseApi = 'https://m.tuantuan.live';
		break;
	default:
		baseApi = 'https://m.tuantuan.live';
		break;
}
function isInWx(){
	var ua = navigator.userAgent.toLowerCase();
	return ua.match(/MicroMessenger/i)=="micromessenger";
}
function isIos(){
	// var u = navigator.userAgent;
	//alert(u)
	//var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	// var ios = /iPhone/.test(u);
	var ua = navigator.userAgent.toLocaleLowerCase()
	var u = navigator.userAgent
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	return isIOS;
}
function isAndroid(){
	 var u = navigator.userAgent;
	 var android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端
	 return android
}
function ajax(options) {
 	options = options || {}; //调用函数时如果options没有指定，就给它赋值{},一个空的Object
 	options.type = (options.type || "GET").toUpperCase(); /// 请求格式GET、POST，默认为GET
 	options.dataType = "json"; //响应数据格式，默认json
 	var params = formatParams(options.data); //options.data请求的数据
 	var xhr;
 	//考虑兼容性
 	if (window.XMLHttpRequest) {
 		xhr = new XMLHttpRequest();
 	} else if (window.ActiveObject) { //兼容IE6以下版本
 		xhr = new ActiveXobject('Microsoft.XMLHTTP');
 	}
 	//启动并发送一个请求
 	if (options.type == "GET") {
 		xhr.open("GET", options.url + "?" + params, true);
 		xhr.send(null);
 	} else if (options.type == "POST") {
 		xhr.open("post", options.url, true);
 		//Content-type数据请求的格式
 		xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
 		xhr.send(JSON.stringify(options.data));
 	}
 	//设置有效时间
 	setTimeout(function() {
 		if (xhr.readySate != 4) {
 			xhr.abort();
 		}
 	}, options.timeout)
 	// 接收
 	// options.success成功之后的回调函数  options.error失败后的回调函数    
 	xhr.onreadystatechange = function() {
 		if (xhr.readyState == 4) {
 			var status = xhr.status;
			if (status >= 200 && status < 300 || status == 304) {
				options.success && options.success(JSON.parse(xhr.response).data);
			} else {
				options.error && options.error( (xhr.response !== "" ? JSON.parse(xhr.response) : "" ));
			}
 		}
 	}
 }

 //格式化请求参数
 function formatParams(data) {
 	var arr = [];
 	for (var name in data) {
 		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
 	}
 	arr.push(("v=" + Math.random()).replace(".", ""));
 	return arr.join("&");

 }

 function ajaxget(url, params) {
 	return sendReq(baseApi+url, 'get', params);
 }

 function ajaxpost(url, params) {
 	return sendReq(baseApi+url, 'post', params);
 }

 function sendReq(url, type, params) {
 	return new Promise(function(resolt, reject) {
 		//基本的使用实例
 		ajax({
 			url:url,
 			type:type,
 			data:params,
 			dataType:"json",
 			timeout:10000,
 			contentType:"application/json;charset=utf-8",
 			success: function(data) {
 				//服务器返回响应，根据响应结果，分析是否登录成功
				//console.log(data)
 				resolt(data);
 			}, 
 			error: function(e) {
				//console.log(e);
				showInfo(e.message);
				//异常处理
 				reject(e);
 			}
 		})
 	});
 }
 function showInfo(str){
	 var ele_showinfo =  document.getElementById('showinfo');
	 var body = document.querySelector('body');
	 var ele_showinfo;
	 var ele_showinfo_con;
	 var timer;
	 if (!ele_showinfo) {
	 	 ele_showinfo = document.createElement('div');//创建新的div标签
		 ele_showinfo.setAttribute('id','showinfo');
		 ele_showinfo_con = document.createElement('div');
		 ele_showinfo_con.className = 'showinfocon';
		 ele_showinfo_con.textContent = str;
		 ele_showinfo.appendChild(ele_showinfo_con);
		 body.appendChild(ele_showinfo);
		 if (timer) {
		 	clearTimeout(timer);
		 }
		 timer =  setTimeout(function(){
			 ele_showinfo.style.display = 'none';
		 },1500);
	 }else{
		 ele_showinfo = document.getElementById('showinfo');
		 ele_showinfo.style.display = 'flex';
		 ele_showinfo_con = document.getElementsByClassName('showinfocon')[0];
		 ele_showinfo_con.textContent = str;
		 if (timer) {
		 	clearTimeout(timer);
		 }
		 timer = setTimeout(function(){
		 	ele_showinfo.style.display = 'none';
		 },1500);
	 }
 }
