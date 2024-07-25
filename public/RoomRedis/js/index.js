var showTip = false;
var url = '';
var isAndroid = false;
var isIos = false;
var androidurl = '';
var androidLinkUrl = '';
var iosurl = '';
var iosLinkUrl = '';
var isTouch = false;
var isHD = isHD();
var activity = this.getUrlParam("activity") ? this.getUrlParam("activity") : "";
var source = this.getUrlParam("source") ? this.getUrlParam("source") : "";
var inviteUid = this.getUrlParam("uid") ? this.getUrlParam("uid") : "";

$(document).ready(function() {
	setFontSize();
	if (isHD) { // 是否在团团内
		showTip = true;
		return
	}
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("android") > -1) {
		isAndroid = true;
		if (isInWx()) { //在微信中
			// showTip = true;
			console.log("在微信中");
		}
	} else {
		showTip = false;
		isIos = true;
		if (isInWx()) { //在微信中
			// showTip = true;
			console.log("在微信中");
		}
	}

	ajaxget('/Main/app').then(function(res) {
		if (res.android) {
			androidurl = res.android.download_url;
			androidLinkUrl = res.android.link;
		}
		if (res.ios) {
			iosurl = res.ios.download_url;
			iosLinkUrl = res.ios.link;
		}
	});

	$(".topBox").removeClass("hiden");
});

// 微信浏览器 配置
function wxSetInfo() {
	wx.config({
		debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
		appId: '', // 必填，公众号的唯一标识
		timestamp: '', // 必填，生成签名的时间戳
		nonceStr: '', // 必填，生成签名的随机串
		signature: '', // 必填，签名
		jsApiList: [], // 必填，需要使用的JS接口列表
		openTagList: ['wx-open-launch-app'] // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
	});

	var btn = document.getElementById('launch-btn');
	btn.addEventListener('launch', function(e) {
		console.log('success');
	});
	btn.addEventListener('error', function(e) {
		// console.log('fail', e.detail);
		$(".wx-tips").removeClass("hiden");
	});

}

function isHD() { // 判定是否不在在团团应用内
	var isHd = false;
	var ua = navigator.userAgent.toLowerCase();
	if (ua == "hdpay" || ua.indexOf("hdpay") > -1) {
		isHd = true;
	} else {
		isHd = false;
	}
	return isHd;
}

function isInWx() {
	var ua = navigator.userAgent.toLowerCase();
	return ua.match(/MicroMessenger/i) == "micromessenger";
}

function isIos() {
	var ua = navigator.userAgent.toLocaleLowerCase()
	var u = navigator.userAgent
	var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	return isIOS;
}

function isAndroid() {
	var u = navigator.userAgent;
	var android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // android终端
	return android
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var l = decodeURI(window.location.search);
	var r = l.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return '';
}

// ios 下载 调起app
function downLoadIos() {
	// this.jump();
	isTouch = true;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("android") > -1) {} else {
		isIos = true;
		if (isInWx() || isHD) {
			showTip = true; // 在微信中 或者汇达中
		} else {
			showTip = false;
			var loadDateTime = new Date();
			window.setTimeout(function() {
				var timeOutDateTime = new Date();
				if (timeOutDateTime - loadDateTime < 5000) {
					window.location = iosurl;
				} else {
					window.close();
				}
			}, 1000);
			window.location = iosLinkUrl;
		}
	}
}

// android 下载 调起app
function downLoadAndroid() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("android") > -1) {
		isAndroid = true;
		if (isInWx() || isHD) {
			showTip = true; // 在微信中 或者汇达中
		} else {
			showTip = false;
			if (androidLinkUrl !== "") {
				window.location = androidLinkUrl;
			}
			setTimeout(function() {
				window.location = androidurl;
			}, 1000);
		}
	}
}

function setFontSize() {
	function resizeBaseFontSize() {
		var rootHtml = document.documentElement,
			deviceWidth = rootHtml.clientWidth;

		if (deviceWidth > 640) {
			deviceWidth = 640;
		}

		rootHtml.style.fontSize = deviceWidth / 7.5 + "px";
	}

	resizeBaseFontSize();

	window.addEventListener("resize", resizeBaseFontSize, false);
	window.addEventListener("orientationchange", resizeBaseFontSize, false);
}

// 根据地址栏appName 批量替换文件
function getUrlParam(key) {
	// 获取参数
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	return result ? decodeURIComponent(result[2]) : null;
}
function changeClassName(num, title="用户协议") {
	let appName = getUrlParam("appName");
	console.log("🚀 ~ file: agreement.html:216 ~ appName", appName)
	if (!appName || appName == "") {
		appName = num == 2 ? "声撩语音" : "团团"
	}
	document.title = appName + title;
	let nameDom = document.getElementsByClassName("name");
	for (var i = 0; i < nameDom.length; i++) {
		let itemDom = nameDom[i];
		itemDom.innerText = appName;
	}
}
function changeSexClassName(){
	let roomType = getUrlParam("roomType");
  let roomTypeStr = '白富美';
  let title1Str = '梦想白';
  let title2Str = '梦想富';
  let title3Str = '梦想美';
  if(roomType == 1) {
    roomTypeStr = '高富帅';
    title1Str = '梦想高';
    title2Str = '梦想富';
    title3Str = '梦想帅';
  } else if(roomType == 2) {
    roomTypeStr = '喵喵';
    title1Str = '幸运喵';
    title2Str = '魔法喵';
    title3Str = '神奇喵';
  }
  // 修改页面标题
  document.title = `梦想${roomTypeStr}说明`;
  // 修改页面所有相关title
	let sexDom = document.getElementsByClassName("title");
	for (var i = 0; i < sexDom.length; i++) {
		let itemDom = sexDom[i];
		itemDom.innerText = roomTypeStr;
	}
  // 修改分类标题
	document.getElementsByClassName("title1")[0].innerText = title1Str;
	document.getElementsByClassName("title2")[0].innerText = title2Str;
	document.getElementsByClassName("title3")[0].innerText = title3Str;
}

// 点击整个页面随意位置执行链接复制
$("body").off("click").on("click", function() {
	onCopy();
})

// 复制链接
function onCopy() {
	var tag = document.createElement('input');
	tag.setAttribute('id', 'cp_hgz_input');
	tag.value = window.location.href + "&url=" + encodeURIComponent(window.location.href);
	document.getElementsByTagName('body')[0].appendChild(tag);
	document.getElementById('cp_hgz_input').select();
	var a = document.execCommand('copy');
	document.getElementById('cp_hgz_input').remove();
}

// 弹出立即加入弹框
$(".homeownerBackBox, .hotBox").off("click").on("click", function() {
	$(".maskBox").removeClass("hiden");
})

// 点击遮罩关闭弹出框
$(".maskBox").off("click").on("click", function() {
	$(".maskBox").addClass("hiden");
})


// 立即打开
$(".joinBtn").off("click").on("click", function() {

	var maskBoxClass = $(".maskBox")[0].className;
	if (maskBoxClass.indexOf("hiden") == -1) {
		$(".maskBox").addClass("hiden");
	}


	// if (isInWx()) { //在微信中 使用在微信调起app的方法
	// 	wxSetInfo();
	// 	return
	// }

	if (isInWx()) { // 在微信或者汇达
		$(".wx-tips").removeClass("hiden");
	}

	// 是安卓 
	if (isAndroid == true) {
		downLoadAndroid();
	}

	// 是ios
	if (isIos == true) {
		downLoadIos();
	}
})
