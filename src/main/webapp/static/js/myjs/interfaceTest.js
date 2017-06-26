var locat = (window.location + '').split('/');
$(function () {
    if ('tool' == locat[3]) {
        locat = locat[0] + '//' + locat[2];
    } else {
        locat = locat[0] + '//' + locat[2] + '/' + locat[3];
    }
    ;
});

$(top.hangge());

//重置
function gReload() {
    top.jzts();
    $("#serverUrl").val('');
    $("#json-field").val('');
    $("#S_TYPE_S").val('');
    self.location.reload();
}

//请求类型
function setType(value) {
    $("#S_TYPE").val(value);
}

function sendSever() {
    if ($("#serverUrl").val() == "") {
        $("#serverUrl").tips({
            side: 3,
            msg: '输入请求地址',
            bg: '#AE81FF',
            time: 2
        });
        $("#serverUrl").focus();
        return false;
    }

    //加密方式  (取其中一个参数名+当前日期[格式 20150405]+混淆码",fh," 然后md5加密 的值作为 参数FKEY的值提交)
    var paraname = $("#S_TYPE_S").val();	//要加密的参数
    var nowtime = date2str(new Date(), "yyyyMMdd");
    //alert($.md5(paraname+nowtime+',nswt,'));

    var startTime = new Date().getTime(); //请求开始时间  毫秒
    top.jzts();
    $.ajax({
        type: "POST",
        url: locat + '/tool/severTest.do',
        data: {
            serverUrl: $("#serverUrl").val() + "&FKEY=" + $.md5(paraname + nowtime + ',fh,'),
            requestMethod: $("#S_TYPE").val(),
            tm: new Date().getTime()
        },
        dataType: 'json',
        cache: false,
        success: function (data) {
            $(top.hangge());
            if ("success" == data.errInfo) {
                $("#serverUrl").tips({
                    side: 1,
                    msg: '服务器请求成功',
                    bg: '#75C117',
                    time: 10
                });
                var endTime = new Date().getTime();  //请求结束时间  毫秒
                $("#ctime").text(endTime - startTime);

            } else {
                $("#serverUrl").tips({
                    side: 3,
                    msg: '请求失败,检查URL正误',
                    bg: '#FF5080',
                    time: 10
                });
                return;
            }
            $("#json-field").val(data.result);
            $("#json-field").tips({
                side: 2,
                msg: '返回结果',
                bg: '#75C117',
                time: 10
            });
            $("#stime").text(data.rTime);
        }
    });
}

function intfBox() {
    var intfB = document.getElementById("json-field");
    var intfBt = document.documentElement.clientHeight;
    intfB.style.height = (intfBt - 320) + 'px';
}
intfBox();
window.onresize = function () {
    intfBox();
}

//js  日期格式
function date2str(x, y) {
    var z = {
        y: x.getFullYear(),
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
}


//sop------------------------
//测试脚本JSON
function methodgetJson() {
    var data = {
        appKey: $("#appKey").val(),
        userName: $("#userName").val(),
//                password:$("#password").val(),  //password不签名！
        method: $("#methodName").val(),
        messageFormat: $("#getDataType").val(),
        v: $("#methodVersin").val()
    };
    signBySha1(data);
    $.ajax({
        type: "get",
        async: false,
        url: $("#routerUrl").val(),
        data: data,
        dataType: "jsonp",
        jsonp: "__invoke",//__invoke传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
        //jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
        success: function (data, textStatus) {
            $("#routerUrl").tips({
                side: 1,
                msg: '服务器请求成功',
                bg: '#75C117',
                time: 10
            });
            $("#json-field").html("");
            $("#json-field").fadeOut();
            var date = (new Date());
            var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            $("#json-field").html("[time]:" + time + "[data]:" + JSON.stringify(data)+ "[textStatus]:" + textStatus);
            $("#json-field").tips({
                side: 2,
                msg: '返回结果',
                bg: '#75C117',
                time: 10
            });
            $("#json-field").fadeIn();
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            $("#routerUrl").tips({
                side: 3,
                msg: '请求失败,检查URL正误,或OSP服务器是否启动！',
                bg: '#FF5080',
                time: 10
            });
            $("#json-field").html("");
            $("#json-field").fadeOut();
            var date = (new Date());
            var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            $("#json-field").html("[time]:" + time + "[data]:" + JSON.stringify(xmlHttpRequest) + "[textStatus]:" + textStatus);
            $("#json-field").tips({
                side: 2,
                msg: '返回结果',
                bg: '#75C117',
                time: 10
            });
            $("#json-field").fadeIn();
        }
    });
}

function signBySha1(data) {
    var secret = $("#secret").val();
    var tempStr = secret + "appKey" + data["appKey"];
    tempStr += "messageFormat" + data["messageFormat"];
    tempStr += "method" + data["method"];
//          tempStr += "password"+data["password"];
    tempStr += "userName" + data["userName"];
    tempStr += "v" + data["v"];
    tempStr += secret;
    var signData = $.encoding.digests.hexSha1Str(tempStr);
    data["sign"] = signData;
    return data;
}

//sop end ----------------