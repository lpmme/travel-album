﻿//npm run-script webpack
//加载---------------------------------------------------------------------------------------
//alert("检测加载时url"+window.location.href);
var callback = ""; //SetGameValue
var JsTicket = "", timsstampStr = "", signStr = "",openid = "";
var allData = {}, urlHrefs = "";

function GetJsTicket(data, urlHref) {
    allData = data;
    urlHrefs = urlHref;
    $.ajax({
        url: "https://m.iflying.com/new/Interface/GetJsTicket.ashx",
        crossDomain: true,
        cache: false,
        type: "POST",
        dataType: 'text',
        contentType: "application/x-www-form-urlencoded; charset=gb2312",
        success: function (responseData, textStatus, jqXHR) {
            JsTicket = responseData;
            Getautograph(responseData);//拼接签名
        },
        error: function (responseData, textStatus, errorThrown) {

        }
    });
}//获取唯一授权编码

function Getautograph(jsTicket) {
    var par1 = { openid: "", jsTicket: '' + jsTicket, httpurl: window.location.href };
    if (!isnull(jsTicket)) {
        $.ajax({
            url: "https://feiinterface.iflying.com:4443/XiaoLong/Treasure/GetTreasure",//feiinterface.iflying.com
            data: par1,
            cache: false,
            type: "POST",
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded; charset=gb2312",
            success: function (data) {
                if (data.code > 700) {
                    timsstampStr = data.data.timsstampStr;
                    signStr = data.data.signStr;
                    isauthorize = data.data.isauthorize;
                        WeChatShare(timsstampStr, signStr);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // alert("未知错误");
            }
        });
    }
}//签名和用户信息

function WeChatShare(timsstampStr, signStr) {
    //alert(timsstampStr+"-----"+signStr );
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxd438ca7726cbc438', // 必填，公众号的唯一标识
        timestamp: timsstampStr, // 必填，生成签名的时间戳
        nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
        signature: signStr,// 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        //var openid = window.sessionStorage.getItem("openid");
        wx.onMenuShareTimeline({
            title: allData.TouristAlbums.Title,
            link: urlHrefs,
            imgUrl: allData.TouristAlbumSorts[0].Pics[0].Picurl,
            success: function () {
                // 用户确认分享后执行的回调函数
                //alert(link);
                ShareRecord(1, openid, 1);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                ShareRecord(1, openid, 2);
            }
        });

        wx.onMenuShareAppMessage({
            title: allData.TouristAlbums.Title,
            desc: allData.TouristAlbumSorts[0].WrittenWords.WrittenWords,
            link: urlHrefs,
            imgUrl: allData.TouristAlbumSorts[0].Pics[0].Picurl,
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
                //alert(link);
                ShareRecord(2, openid, 1);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                ShareRecord(2, openid, 2);
            }
        });
    });
    wx.error(function (res) {

        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        // alert('here'+res);
    });
    wx.checkJsApi({
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });
}//分享

function ShareRecord(type, myopenid, status) {//分享记录
    //分享给好友，分享到朋友圈1分享2取消分享

}

//-----------------------------------------公共方法-------------------------------------------------------------------
function isnull(parameters) {
    //alert(openid);
    if (parameters == "undefined" || parameters == "" || parameters == null || !parameters) {
        return true;
    } else {
        return false;
    }
}
