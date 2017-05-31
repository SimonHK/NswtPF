//公共变量
var shortcut_key_json = { "8": "backspace", "9": "tabtab", "12": "clear", "13": "enter", "16": "shift", "17": "control", "18": "alt", "19": "pause", "20": "capslock", "27": "escape", "32": "space", "33": "prior", "34": "next", "35": "end", "36": "home", "37": "←", "38": "↑", "39": "→", "40": "↓", "41": "select", "42": "print", "43": "execute", "45": "insert", "46": "delete", "47": "help", "48": "0", "49": "1", "50": "2", "51": "3", "52": "4", "53": "5", "54": "6", "55": "7", "56": "8", "57": "9", "65": "a", "66": "b", "67": "c", "68": "d", "69": "e", "70": "f", "71": "g", "72": "h", "73": "i", "74": "j", "75": "k", "76": "l", "77": "m", "78": "n", "79": "o", "80": "p", "81": "q", "82": "r", "83": "s", "84": "t", "85": "u", "86": "v", "87": "w", "88": "x", "89": "y", "90": "z", "96": "kp_0", "97": "kp_1", "98": "kp_2", "99": "kp_3", "100": "kp_4", "101": "kp_5", "102": "kp_6", "103": "kp_7", "104": "kp_8", "105": "kp_9", "106": "kp_multiply", "107": "+", "108": "kp_separator", "109": "-", "110": "kp_decimal", "111": "kp_divide", "112": "f1", "113": "f2", "114": "f3", "115": "f4", "116": "f5", "117": "f6", "118": "f7", "119": "f8", "120": "f9", "121": "f10", "122": "f11", "123": "f12", "124": "f13", "125": "f14", "126": "f15", "127": "f16", "128": "f17", "129": "f18", "130": "f19", "131": "f20", "132": "f21", "133": "f22", "134": "f23", "135": "f24", "136": "num_lock", "137": "scroll_lock", "187": "acute", "188": "comma", "189": "minus", "190": "period", "192": "numbersign", "210": "plusminus", "212": "copyright", "213": "guillemotleft", "214": "masculine", "215": "ae", "216": "cent", "217": "questiondown", "218": "onequarter", "220": "lessgreater", "221": "plusasterisk", "227": "multiply", "228": "acircumflex", "229": "ecircumflex", "230": "icircumflex", "231": "ocircumflex", "232": "ucircumflex", "233": "ntilde", "234": "yacute", "235": "oslash", "236": "aring", "237": "ccedilla", "238": "thorn", "239": "eth", "240": "diaeresis", "241": "agrave", "242": "egrave", "243": "igrave", "244": "ograve", "245": "ugrave", "246": "adiaeresis", "247": "ediaeresis", "248": "idiaeresis", "249": "odiaeresis", "250": "udiaeresis", "251": "ssharp", "252": "asciicircum", "253": "sterling", "254": "mode_switch" };
var comon_key_arr = [];
var shortcut_key_repeat = false; // 快捷键是否重复
var osd = 1;
var clikcname = "";
var dataconioctorn = null;
var jiaodianname = "";
var jieshuanid = 0;
var swiper;
var checkSubmitFlg = false;
var memberlist = "";
var productlist = ""; // 拼接订单json
var StrEmployeelId = "";//员工id
var overdue_userecord_id = "";
var member_product_overdue_id = "";
var Preferential_TopUpGiving_ConfigList = "";//充值赠送信息
var configleveldata = [];//等级配置信息
var isShowWindow = false; // 是否已打开过计重商品窗口
var keyup_Code; // keyup键盘按下的code
var key_close_window = false; // 窗口是否已打开，进行关闭
var capital_letters = true; // 是否为大写字母
var _member_discount = 100; // 会员折扣
var _cache_memberinfo_json; // 单个会员缓存信息
var _common_csshjsbox_window_open = false;
var wxauthcode_waitfor = false; // 微信或支付宝，扫条码是否需要等待，密码支付
var wxauthcode_isSuccess = false; // 微信或支付宝 支付是否成功
var _g_wechatPayNumber = ''; // 微信支付二维码回调

var paymembername = "";//会员姓名
var paymembernumber = "";//会员卡号
var paymembercatagory = "";//会员等级
var paymemberintegral = "";//会员积分
var paymemberbalance = "";//会员余额
var paymembergrandtotal = "";//会员累计消费
var paymemberbirthday = "";//会员生日
var paymemberphotoimg = "";//会员头像


$(function () {
    getkey_settingInfo();
});
function checkSubmit() {
    if (checkSubmitFlg == true) {
        return false;
    }
}
function cliskgetuser(userid,cardno) {
    var is_GetConfigdataBylevel = false;
    if ($("#memberlevel_id").val() != null && $("#memberlevel_id").val() != "" && $("#memberlevel_id").val() >= 1) {
        is_GetConfigdataBylevel = true;
    }
    if (!cardno) {
        cardno = $("#query_user").val();
    }
    if ($("#query_user").val() != "") {
        var _userid = userid == undefined ? "" : ($("#userid").val() == undefined ? "" : $("#userid").val())
        $.get("/Ajaxdata/QueryUserModel?id=" + cardno + "&userid=" + _userid, function (data) {
            if (data == null) {
                layer.msg("找不到该会员，请查证再查询");
                $(".sv_ml_name").text("");
                $(".sv_mw_availableamount").text("");
                $(".sv_mw_availablepoint").text("");
                $(".sv_ml_commondiscount").text("");
                $(".sv_mr_birthday").text("");
                $(".sv_mr_mobile").text("");
                $("#query_user").data("id", "");
                return;
            }
            if (data.type == 1) {
                Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=42", f4, ['730px', ''], "shoyin2");
                $("#userid").val("");
                memberlist = data.list;
            }
            else if (data.isOverdue) {
                layer.msg("此卡已过期");
                $(".sv_ml_name,.sv_mr_name").text("");
                $(".sv_mw_availableamount").text("");
                $(".sv_mw_availablepoint").text("");
                $(".sv_ml_commondiscount").text("");
                $(".sv_mr_birthday").text("");
                $(".sv_mr_mobile").text("");
                $("#query_user").data("id", "");
                return false;
            } else if (data.sv_mr_status == 1) {
                layer.msg("此卡已挂失");
                $(".sv_ml_name,sv_mr_name").text("");
                $(".sv_mw_availableamount").text("");
                $(".sv_mw_availablepoint").text("");
                $(".sv_ml_commondiscount").text("");
                $(".sv_mr_birthday").text("");
                $(".sv_mr_mobile").text("");
                $("#query_user").data("id", "");
                return false;
            }
            else {
                _cache_memberinfo_json = data;
                $("#user_descount").text(_member_discount);
                for (var key in data) {

                    if (key == "sv_mr_birthday") {

                        var t = new Date(data[key]).Format("yyyy-MM-dd");
                        if (t == "1-01-01") {
                            t = "";
                        }
                        $("." + key).text(t);

                    } else {
                        if (key == "member_id") {

                            // alert(data[key]);
                            $("#" + key).val(data[key]);
                            $("#query_user").data("id", data[key]);
                        } else {
                            if (key == "user_id") {
                                $("#" + key).val(data[key]);
                                $("#userid").val(data[key]);
                            } if (key == "sv_recommended_peopleid") {
                                $("#" + key).val(data[key]);
                            }
                            else {
                                if (key == "memberlevel_id") {
                                    $("#" + key).val(data[key]);
                                } else {
                                    $("." + key).text(data[key]);
                                }
                            }
                        }

                        if (key == "sv_mr_name") {
                            $("#Cashxzhy").find("input").val(data[key]);
                            $("#query_user").data("name", data[key]);;
                        }

                        if (key == "sv_ml_commondiscount") {
                            if (parseFloat(data[key]) != 0) {
                                $("#yinshou").val(returnFloat(parseFloat($("#yinshou").data("val")) * (parseFloat(data[key]) / 10)));
                                $("#xianjin").val($("#yinshou").val()).change();
                                $("#order_discount").val(parseFloat(data[key]));
                            }
                        }

                    }

                }

                if (!is_GetConfigdataBylevel && $("#memberlevel_id").val() != null && $("#memberlevel_id").val() != "") {
                    GetConfigdataBylevel($("#memberlevel_id").val());
                }

            }
        });
    }
}

function f11() {
    var html = '';
    overdue_userecord_id = "";
    $("#Cashlefsit > li").each(function () {
        if ($(this).hasClass("product_type")) {
            html += ' <tr class="MouseMobile" data-id="' + this.id + '" id="Overdue_tr_' + this.id + '"><td>' + $(this).find(".nn1").text() + '</td><td>' + $(this).find(".nump").text() + '</td><td>' + $(this).find(".jiage").text() + '</td> <td>-' + $(this).find(".nump").text() + '次</td><td>储值卡</td><td> <a id="Overdue_' + this.id + '"  href="javascript:void(0);" style="display:none" ><span onclick="DeleteOverdue(' + this.id + ')" data-id="' + this.id + '" class="icon-remove"></span></a></td></tr>';
        } else {

            var jiege = parseFloat($(this).find(".jiage").text()) * (parseFloat(_member_discount) / 100);

            var jiege2 = jiege * parseFloat($(this).find(".nump").text());


            html += ' <tr ><td>' + $(this).find(".nn1").text() + '</td><td>' + $(this).find(".nump").text() + '</td><td>' + jiege + '</td> <td>' + jiege2 + '</td><td>待选择</td></tr>';
        }
    });

    $("#liulist").html(html);
    // jieshuajie2
    $("#yinfu").text($("#jieshuajie2").text());
    html = "";
    $.getJSON("/Ajaxdata/GetCharge/" + $('#huiyuan_id').attr('data-id'), { "clas": 0, "page": -1 }, function (data) {

        for (var i = 0; i < data.length; i++) {
            if (data[i].sv_mcc_leftcount > 0) {
                var adsd = "";
                if (isNullOrWhiteSpace(data[i].validity_date)) {
                    adsd = new Date(data[i].validity_date).Format("yyyy-MM-dd");
                };
                if (data[i].getvalidity) {
                    if (member_product_overdue_id.indexOf(data[i].product_id) < 0) {
                        member_product_overdue_id += data[i].product_id + ",";
                        overdue_userecord_id += data[i].product_id + ",";
                        $(".diaobox").append('<li calss="toptop_' + data[i].product_id + '" style="background:#f2c210"><div class="toptop"><span>' + data[i].sv_p_name + '</span> <a href="javascript:void(0)" onclick="chsaisi2($(\'#sv_mr_cardno\').text(),\'' + data[i].product_id + '\',\'' + data[i].sv_p_name + '\')" class="milefts">充次</a> </div><div class="botbot"><p>剩余次数 <span>' + data[i].sv_mcc_leftcount + '次</span></p><p>有效日期 <span style="background: #ff6668; color: #fff;">' + adsd + '(已逾期)</span></p></div></li>');
                    }
                } else {
                    $(".diaobox").append('<li><div class="toptop"><span>' + data[i].sv_p_name + '</span> <a href="javascript:void(0)" onclick="chsaisi2($(\'#sv_mr_cardno\').text(),\'' + data[i].product_id + '\',\'' + data[i].sv_p_name + '\')" class="milefts">充次</a> </div><div class="botbot"><p>剩余次数 <span>' + data[i].sv_mcc_leftcount + '次</span></p><p>有效日期 <span>' + adsd + '</span></p></div></li>');
                }

            }
        }
        overdue_userecord_id = overdue_userecord_id.replace(/,$/gi, "");
    });

    $("#CAshjsuan").click(function () {
        var cm = true;
        if (!isNullOrWhiteSpace(overdue_userecord_id)) {
            if ($("#Cashlefsit li:not('.product_type')").length == 0) {
                cm = confirm("您确认帐单没有问题了吗？");
                //layer.confirm('您确认帐单没有问题了吗？', {
                //    btn: ['确定', '取消'], //按钮
                //}, function () {
                //    return cm = true;
                //}, function () {
                //    return cm = false;
                //});

            }
            if (cm) {
                if ($("#liulist .MouseMobile").length >= 1) {
                    Deke.DeKe_dialog.show_Url3("", "/html/cash/jieshuan2.html?v=" + getTimeStamp(), f2, ['877px', ''], "shoyin2");
                }
                else {
                    layer.msg("请选择您要结算的订单！");
                }

            }
        } else {
            layer.msg("当前订单存在逾期信息！");
            return false;
        }

    });
    $(".MouseMobile").each(function () {
        this.onmouseover = function () {
            $("#Overdue_" + $(this).data("id")).show();
        };
        this.onmouseout = function () {
            $("#Overdue_" + $(this).data("id")).hide();
        };
    });


}

function f10() {
    $(".product_type").remove();
    if ($("#query_user").data("id") == undefined || $("#query_user").data("id") == "") {
        $("#huiyuan_id").text("").data("id", "0").data("jiekou", "100");
        $("#yuecount").text("0.00").attr('data-money', 0);
        _member_discount = 100;
        zhonger();
    } else {
        //  alert($("#query_user").data("name"));

        $.getJSON("/Ajaxdata/branchrelation", { userid: $("#userid").val() }, function (data) {
            if (data == -3) {
                $("#userid").val("");
                layer.msg("当前会员不支持跨店消费");
                setTimeout(function () {
                    layer.closeAll();
                }, 800);
            } else {
                //$("#userid").val($("#userid").val());
                var memberscode = $("#query_user").val();
                $("#sv_mr_cardno").val($("#query_user").val());
                memberscode = memberscode.length > 4 ? "**" + memberscode.slice(-4) : memberscode;
                member_product_overdue_id = "";
                var membersname = $("#query_user").data("name");
                membersname = membersname.length > 3 ? membersname.slice(0, 2) + "*" + membersname.slice(-1) : membersname;
                $("#huiyuan_id").text(membersname + "(" + memberscode + ")").attr("data-id", $("#query_user").data("id")).data("jiekou", $(".sv_ml_commondiscount").text());
                $("#yuecount").text(returnFloat($(".sv_mw_availableamount").text())).attr('data-money', returnFloat($(".sv_mw_availableamount").text()));;
                var this_member_discount = 100;
                if ($('.sv_ml_commondiscount').text() != null && $('.sv_ml_commondiscount').text() != undefined && $('.sv_ml_commondiscount').text() != '') {
                    this_member_discount = parseFloat($('.sv_ml_commondiscount').text()) * 10
                }
                $('#user_descount').text(this_member_discount);
                if (this_member_discount > 0) {
                    _member_discount = this_member_discount;
                }
                var discort = parseFloat($(".sv_ml_commondiscount").text());

                if (discort == 0 || $(".sv_ml_commondiscount").text() == "") {
                    discort = 10;
                }
                $("#user_descount").text(returnFloat(discort * 10));
                //读取会员所有次卡的列表
                $.getJSON("/Ajaxdata/GetCharge/" + $("#query_user").data("id"), { "clas": 0, "page": -1 }, function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].sv_mcc_leftcount > 0 && !data[i].Getvalidity) {
                            $("#" + data[i].product_id).remove();
                            $("#Cashlefsit").prepend(' <li id="' + data[i].product_id + '" data-pricingmethod="0" class="product_type"><div class="naerigh">  <p class="nn1">' + data[i].sv_p_name + '</p><p class="nn2"><span class="fl">' + data[i].product_id + '</span><span class="fr">数量 <text class="nump" data-cnum="' + data[i].sv_mcc_leftcount + '">1</text>(' + data[i].sv_mcc_leftcount + ')</span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="0">0</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="0"> 0</span></p></div> </li>');
                            osd++;
                        }
                    }
                    zhonger();
                });

                layer.closeAll();
            }
        })
    }
    //cnum
}

function fukuanfashi() {
    if ($(".opgol.open").length == 0 || ($(".paywaylist").find(".selectpaytype.active").length < 2)) {

        $("#xianjinname").html($(".paywaylist").find(".selectpaytype.active span").eq(0).html());
        $("#daoshouname").html("待收");

    } else {

        $(".paywaylist").find(".selectpaytype.active").each(function (i) {

            if (i == 0) {
                $("#xianjinname").html($(this).children("span").html());
            } else {

                $("#daoshouname").html($(this).children("span").html());
            }

        });

    }

}

// 选择会员
$(document).unbind("click", "#userlist .xianzhehuiyan").on("click", "#userlist .xianzhehuiyan", function () {
    if ($(this).data("isoverdue")) {
        layer.msg("此卡已过期");
    } else {
        if (this.id == 1) {
            layer.msg("此卡已挂失");
        }
            //搜索会员
        else {
            $("#userid").val($(this).parent().parent().data("user_id"));
            $("#query_user").val($(this).parent().parent().data("sv_mr_cardno")).data("id", $(this).parent().parent().data("id"));
            cliskgetuser($(this).parent().parent().data("user_id"), $(this).parent().parent().data("sv_mr_cardno"));
            try {
                layer.close(jieshuajie);
            } catch (e) {

            } 
        }
    }
});

// 会员列表
function GetList(key) {
    $.get("/ajaxdata/GetMemberList/1", { "key": key, "pageSize": 30 }, function (data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {

            html += ' <tr data-user_id="' + data[i].user_id + '" data-sv_mr_cardno="' + data[i].sv_mr_cardno + '" data-id="' + data[i].member_id + '" data-name="' + data[i].sv_mr_name + '" data-isoverdue="' + data[i].isOverdue + '" >';

            html += '    <td><span>' + data[i].sv_mr_cardno + '</span></td>';
            html += '    <td><span>' + data[i].sv_mr_name + '</span></td>';
            html += '    <td><span>' + data[i].sv_mr_mobile + '</span></td>';
            html += '   <td><i>¥' + data[i].sv_mw_availableamount + '</i></td>';
            html += '  <td><i>¥0.00</i></td>';
            if (isNullOrWhiteSpace(data[i].sv_ml_name))
                html += '  <td><span>' + data[i].sv_ml_name + '</span></td>';
            else html += '  <td><span></span></td>';
            html += '  <td><span>' + data[i].sv_mw_availablepoint + '</span></td>';
            html += '   <td id="' + data[i].sv_mr_status + '"><a href="javascript:void(0);" class="xianzhehuiyan" id="' + data[i].sv_mr_status + '" data-isoverdue="' + data[i].isOverdue + '">选择</a></td>';
            html += '   </tr>';
        }
        $("#usercoutn").html(data.length);
        $("#userlist").html(html);

        $(".check-box").click(function () {
            $(".check-box").removeClass("checkedBox");
            $(this).addClass("checkedBox");
        });
        //checkedBox
    });
    $("#guanbinimab").click(function () {

        layer.close(index);
    });

    ///
    $("#userlist").on("dblclick", "tr", function () {
        if ($(this).data("isoverdue")) {
            layer.msg("此卡已过期");
        } else {
            if ($(this).find("td").eq(6).attr("id") == 1) {
                layer.msg("此卡已挂失");
            } else {
                //搜索会员
                $("#userid").val($(this).data("user_id"))
                $("#query_user").val($(this).data("sv_mr_cardno")).data("id", $(this).data("id")).data("name", $(this).data("name"));
                // $("#Cashxzhy").find("input").val($(this).data("name"));
                cliskgetuser($(this).data("user_id"));
                layer.close(jieshuajie);
            }
        }


    });

}

//（连锁会员共享）刷卡出现多个同卡信息
function Getmemberlist(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        html += ' <tr data-user_id="' + data[i].user_id + '" data-sv_mr_cardno="' + data[i].sv_mr_cardno + '" data-id="' + data[i].member_id + '" data-name="' + data[i].sv_mr_name + '" data-isoverdue="' + data[i].isOverdue + '">';

        html += '    <td><span>' + data[i].sv_mr_cardno + '</span></td>';
        html += '    <td><span>' + data[i].sv_mr_name + '</span></td>';
        html += '    <td><span>' + data[i].sv_mr_mobile + '</span></td>';
        html += '   <td><i>¥' + data[i].sv_mw_availableamount + '</i></td>';
        html += '  <td><i>¥0.00</i></td>';
        if (isNullOrWhiteSpace(data[i].sv_ml_name))
            html += '  <td><span>' + data[i].sv_ml_name + '</span></td>';
        else html += '  <td><span></span></td>';
        html += '   <td id="' + data[i].sv_mr_status + '"><a href="javascript:void(0);" class="xianzhehuiyan" id="' + data[i].sv_mr_status + '" data-isoverdue="' + data[i].isOverdue + '">选择</a></td>';
        html += '   </tr>';
    }
    $("#usercoutn").html(data.length);
    $("#userlist").html(html);

    $(".check-box").click(function () {
        $(".check-box").removeClass("checkedBox");
        $(this).addClass("checkedBox");
    });

    $("#guanbinimab").click(function () {

        layer.close(index);
    });
    ///
    $("#userlist").on("click", ".xianzhehuiyan", function () {
        if ($(this).data("isoverdue")) {
            layer.msg("此卡已过期");
        } else {
            if (this.id == 1) {
                layer.msg("此卡已挂失");
            }
                //搜索会员
            else {
                $("#userid").val($(this).parent().parent().data("user_id"))
                $("#query_user").val($(this).parent().parent().data("sv_mr_cardno")).data("id", $(this).parent().parent().data("id"));

                cliskgetuser($(this).parent().parent().data("user_id"));
                layer.close(index);
            }
        }
    });
    ///
    $("#userlist").on("dblclick", "tr", function () {
        if ($(this).data("isoverdue")) {
            layer.msg("此卡已过期");
        } else {
            if ($(this).find("td").eq(6).attr("id") == 1) {
                layer.msg("此卡已挂失");
            } else {
                //搜索会员
                $("#userid").val($(this).data("user_id"))
                $("#query_user").val($(this).data("sv_mr_cardno")).data("id", $(this).data("id")).data("name", $(this).data("name"));
                cliskgetuser($(this).data("user_id"));
                layer.close(index);
            }
        }


    });

}
function f4() {
    Getmemberlist(memberlist);
    $("#query_like").keyup(function () {
        GetList($("#query_like").val());
    });
    jieshuajie = index;
}
function f3() {

    GetList($("#query_user").val());

    $("#query_like").keyup(function () {
        GetList($("#query_like").val());
    });
    jieshuajie = index;
}

// 结算时，文本框值改变，计算金额
function settlementInputChange() {

    //var xianjin = $("#xianjin").val() || 0;
    //var receivable = $("#yinshou").val();
    //if (receivable != null && receivable != '' && receivable != undefined && receivable != 0) {
    //    var yins = Math.round((parseFloat(xianjin) - parseFloat(receivable || 0)) * 100) / 100;
    //    var collect = 0; // 待收金额
    //    if (parseFloat($("#yinshou").val() || 0) > 0) {
    //        collect = Math.round((parseFloat($("#yinshou").val() || 0) - (parseFloat(xianjin))) * 100) / 100;
    //    }
    //    //现金小于应收，更新待收
    //    if (parseFloat(xianjin) < parseFloat($("#yinshou").val() || 0)) {
    //        $("#daishou").val(returnFloat(collect));
    //        $("#zhaoling").val("0.00");
    //    } else {
    //        //现金大于应收，更新找零
    //        if (yins < 0)
    //            yins = 0;
    //        $("#zhaoling").val(returnFloat(yins));
    //        $("#daishou").val("0.00");
    //    }
    //}

}

// 结算
function f2() {
    checkSubmit();
    $("#ttuser_descount").change(function () {
        var receivable = $("#jieshuajie2").text();
        if (receivable != null && receivable != undefined && receivable != '' && receivable > 0) {
            var jiekou = parseFloat($(this).val()) / 100 * parseFloat(receivable);
            $("#yinshou").val(returnFloat(jiekou));
            $("#xianjin").val(returnFloat(jiekou)).change();
        }
    });

    // 现金文本框
    $('#xianjin').bind('change', '#xianjin', function () {
        var cashValue = $(this).val().trim();
        if (!isNullOrWhiteSpace(cashValue)) {
            if (cashValue.indexOf('.') > -1) {
                if (cashValue.length > 9) {
                    layer.msg("金额长度不能超过7位数");
                }
            }
            else {
                if (cashValue.length >= 8) {
                    layer.msg("金额长度不能超过7位数");
                }
            }
        }
    });
    _common_csshjsbox_window_open = $('#csshjsbox_window_open').val(); // 标志结算窗口已打开

    // 应收值改变 [实收金额改变]
    $("#yinshou").data("val", $("#jieshuajie2").text()).val($("#jieshuajie2").text()).bind('change keyup', function () {
        var receivable = $("#jieshuajie2").text();//应收金额
        if (receivable) {
            if (receivable > 0 ) {
                var jiekou = parseFloat($(this).val() || 0) / parseFloat(receivable);
                $("#ttuser_descount").val((jiekou * 100).toFixed(2));
                var cash = $("#xianjin").val();
                //settlementInputChange();
                $("#xianjin").val($(this).val()).change();
            } else
            {
                //应收为0特殊处理，以实收  *  折扣计算
                var discount = (parseFloat($("#ttuser_descount").val()||0)).toFixed(2);
                $("#xianjin").val(((parseFloat($(this).val() || 0) * discount)/100).toFixed(2)).change();
            }
        }
    });
    $("#zhaoling").val("0.00");
    $("#xianjin").val($("#jieshuajie2").text());
    cashFocus();
    $("#daishou").val("0.00");
    //备注
    if ($(".ssteater").val()) {
        $("#order_remark").val($(".ssteater").val());
    }
    ShowCusDisplay(2, $("#yinshou").val());
    CalculateGiving();
    if (is_open_print != null && !Boolean(parseInt(is_open_print.split("@")[1]))) {
        $(".biglis").removeClass("open");
    }
    // $("#ttuser_descount").val(100);
    //几次商品的选择的swiper的互动参数的配置/等下要放在搜索会员的里面
    swiper = new Swiper('.producttimesbox .swiper-container', {
        slidesPerView: 6,
        paginationClickable: true,
        spaceBetween: 5,
        freeMode: true
    });
    //  alert($('.showiimb .swiper-slide').length);

    //导航点击事件
    $('.paywaylist').on('click', '.selectpaytype', function () {
        if ($(".opgol.open").length == 0) {
            $(this).addClass('active').siblings().removeClass('active');
        } else {

            if ($(this).hasClass("active")) {
                $(this).toggleClass('active');
            } else {

                if ($(".paywaylist").find(".selectpaytype.active").length > 1) {
                    $(".paywaylist").find(".selectpaytype.active").eq(1).removeClass('active');
                }
                $(this).toggleClass('active');
            }
            $('#s_cashPay').addClass('active');
        }
        fukuanfashi();
    });
    if ($('#huiyuan_id').attr('data-id') != "0" && $('#huiyuan_id').attr('data-id') != "" && $('#huiyuan_id').attr('data-id') != null && $('#huiyuan_id').attr('data-id') != undefined) {
        var data = _cache_memberinfo_json;
        if (data != null && data != '' && data != undefined) {
            $('#btnMemberRecharge').attr('data-userId', data.user_id).attr('data-cardno', data.sv_mr_cardno).attr("data-level", data.memberlevel_id);
            $('#member_photo').attr('src', data.sv_mr_headimg);
            $('#huiyuan_id').attr('data-id', data.member_id);
            $("#memberNamenumber").html(data.sv_mr_mobile);
            if (data.sv_ml_commondiscount > 0 && data.sv_ml_commondiscount < 10) {
                $("#memberdIscount").html('折扣:' + (parseFloat(data.sv_ml_commondiscount) * 10).toFixed(2) + '%');
            } else {
                $("#memberdIscount").html('折扣:100%');
            }
            $("#membercatagory").html(data.sv_ml_name);
            $("#memberbalance").html(data.sv_mw_availableamount);
            $("#memberconsumptiongrand").html(data.sv_mw_sumamount);
            $("#memberintegral").html(data.sv_mw_availablepoint);
            $("#memberbirthday").html(new Date(data.sv_mr_birthday).Format("MM-dd"));
            $("#memberNamep").html(data.sv_mr_name);

            $('#member_id').val(data.member_id);
            $('#userid').val(data.user_id);
            $('.sv_mr_cardno').text(data.sv_mr_cardno);
            $('.sv_mr_name').text(data.sv_mr_name);
            $("#yuecount").attr('data-money', data.sv_mw_availableamount);
            $('.sv_mw_availableamount').text(data.sv_mw_availableamount);
            $('.paywaylist .selectpaytype').eq(1).click();
            //$('#ttuser_descount').val($('#user_descount').text());

            $('#ttuser_descount').val('100');

            $('.paywaylist .selectpaytype').eq(1).click();
        }
    }
    // 处理异常图片
    $('#member_photo').error(function () {
        $(this).attr('src', '/images/001.png');
    });
    $(".opgol").click(function () {
        var member_id = $('#huiyuan_id').attr('data-id');
        if (member_id != null && member_id != undefined && member_id != '' && member_id != "0" && member_id != 0) {

        }
        $(this).toggleClass("open");
        if ($(this).hasClass('open')) {
            $('.selectpaytype').removeClass('active');
            $('#s_cashPay').addClass('active');
        }
        else {
            $('.selectpaytype').removeClass('active');
            $('#s_cashPay').addClass('active');
        }
        fukuanfashi();
    });
    //收银界面 数字点击
    var _xianjin_first = true;
    $("#cash_dialog .nnrmskk>li,.calui>li").click(function () {
        if (_xianjin_first) {
            if ($(this).data("val") >= 0) {
                $("#xianjin").val($(this).data("val")).change();
            }
            _xianjin_first = false;
            return;
        }


        if ($(this).data("val") >= 0) {
            if ($(this).data("val") > 9) {
                if (jiaodianname) {
                    jiaodianname.val($(this).data("val")).change();
                } else {
                    $("#xianjin").val($(this).data("val")).change();
                }
                //cashFocus();
            } else {
                if (jiaodianname) {
                    jiaodianname.val(jiaodianname.val() + $(this).data("val")).change();
                } else {
                    $("#xianjin").val($("#xianjin").val() + $(this).data("val")).change();

                }
                //cashFocus();
            }
        } else if ($(this).data("val") == ".") {
            if (jiaodianname) {
                jiaodianname.val(jiaodianname.val() + $(this).data("val")).change();
            } else {
                $("#xianjin").val($("#xianjin").val() + $(this).data("val")).change();

            }
            //cashFocus();
        }
    });


    //删除键

    $("#deletenum").click(function () {
        if (jiaodianname) {
            jiaodianname.val('').focus();
        }
    });

    $("input").focus(function () {
        jiaodianname = $(this);
        _xianjin_first = false;
    });

    //$("#xianjin,#daishou,#yinshou,#sv_mrr_amountbefore,#sv_mrr_present").blur(function() {
    //    jiaodianname = $(this);
    //});
    var _xianjin_first = true;

    $("#xianjin").on("keydown", function () {
        if (_xianjin_first) {
            $("#xianjin").val('');
            _xianjin_first = false;
        }
    });

    //现金改变
    $("#xianjin").on("focus change keyup", function () {
        var xianjin = $("#xianjin").val() || 0;
        var cashMoney = parseFloat($("#xianjin").val() || 0);
        var receivableMoney = parseFloat($("#yinshou").val() || 0);
        if (xianjin != null && xianjin != '' && xianjin != undefined) {
            xianjin = cashMoney.toFixed(2);
        }
        var yins = Math.round((parseFloat(xianjin) - parseFloat($("#yinshou").val() || 0)) * 100) / 100;

        if (parseFloat(xianjin) < parseFloat($("#yinshou").val() || 0)) {
            yins = Math.round((parseFloat($("#yinshou").val() || 0) - (parseFloat(xianjin))) * 100) / 100;
        }
        if (parseFloat(xianjin) < parseFloat($("#yinshou").val() || 0)) {
            $("#daishou").val(returnFloat(yins));
            $("#zhaoling").val("0.00");
        } else {
            $("#zhaoling").val(returnFloat(yins));
            $("#daishou").val("0.00");
        }
    });

    $("#lohei").click(function () {
        var lisjsd = JSON.parse(dataconioctorn.sv_uc_saletozeroset);
        var tempMoney = $("#yinshou").val() || 0;
        if (lisjsd.whether) {
            if (lisjsd.auto == 0) {
                //抹角
                $("#yinshou").val(parseInt($("#yinshou").val() || 0));
                $("#xianjin").val($("#yinshou").val() || 0).change();

                cashFocus();
            }
            else if (lisjsd.auto == 1) {
                //抹分
                $("#yinshou").val(parseInt(($("#yinshou").val() || 0) * 10) / 10);
                $("#xianjin").val($("#yinshou").val() || 0).chang();
                cashFocus();
            } else if (lisjsd.auto == 2) {
                //抹元
                $("#yinshou").val(parseInt(($("#yinshou").val() || 0) / 10) * 10);
                $("#xianjin").val($("#yinshou").val() || 0).change();
                cashFocus();
            }

            $("#jieshuaanniu").attr("freechange", (parseFloat(tempMoney) - parseFloat($("#yinshou").val() || 0)).toFixed(2));

        } else {
            layer.msg("没有开启抺零功能");
        }
    });

    //   搜索会员
    $("#query_user").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#userid").val("");
            cliskgetuser("");
        }
    });

    //点击结算按扭

    $("#jieshuaanniu").click(function () {
        try {
            //客显
            var change = parseFloat($("#zhaoling").val());
            if (change > 0) {
                //显示找零
                ShowCusDisplay(4, $("#zhaoling").val());
            } else {
                //显示收款
                ShowCusDisplay(3, $("#yinshou").val());
            }
            //分屏
            SendSecondScreenData(true);
        } catch (e) {

        }
        if (!checkSubmitFlg) {
            jieshu();
        }
    });
    if ($("#Cashlefsit li:not('.product_type')").length == 0) {
        $("#jieshuaanniu").click();
    }
    if (Is_open_commission) {
        getEmployessinfohtml();
    }
    else {
        $("#shoyin2").parent().width($("#shoyin2").parent().width() - 110);
        $(".paymemberlist3").hide();
        $(".paymemberlist1").removeClass("col-xs-5").addClass("col-xs-6");
        $(".paymemberlist2").removeClass("col-xs-5").addClass("col-xs-6");
    }

    $('#btnSelectmemberlist').click(function () {
        Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=20178965", selectmemberlist, ['730px', '450px']);
    });

    // 新版结算弹窗中的充值操作
    $(document).on('click', '#btnMemberRecharge', function () {
        var user_id = $(this).attr('data-userId'); // 店铺Id
        var member_cardno = $(this).attr('data-cardno'); // 会员卡号
        var memberlevel_id = $(this).attr('data-level');
        if ($('#huiyuan_id').attr('data-id') == 0 || $('#huiyuan_id').attr('data-id') == '' || $('#huiyuan_id').attr('data-id') == null) {
            layer.msg("还没有选择会员");
        }
        else {
            Deke.DeKe_dialog.show_Url3("会员充值", "/html/cash/chongzhu2.html?v=20170314", func_MemberRecharge(member_cardno, user_id, memberlevel_id), ['730px', ''], "chuxi");
        }
    });


    //打开钱箱
    $(document).unbind("click", "#cash_func_cashbox").on("click", "#cash_func_cashbox", function () {
        try {
            if (((typeof Cef) !== 'undefined')) {
                //打开钱箱
                Cef.OpenCashBox();
            } else {
                //是否Android客户端运行环境
                if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
                    try {
                        //Android客户端打印
                        cordova.plugins.barcodeScanner.open(
                            function (result) {
                            },
                            function (error) {
                                alert("打印钱箱失败: " + error);
                            },
                            {
                            }
                        );
                    } catch (e) {
                        alert("打印钱箱失败: " + e.message);
                    }
                }
            }
        } catch (e) {

        }

    });

    //商米分屏-应收显示
    //是否Android客户端运行环境
    if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
        var postData = {
            "FooterList": [
            ]
        };
        postData.FooterList.push({ "Content": ".", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
        postData.FooterList.push({ "Content": ".", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
        postData.FooterList.push({ "Content": "应收金额：¥" + ($("#xianjin").val() || "0.00"), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

        try {
            //Android客户端打印
            cordova.plugins.barcodeScanner.showsecond(
                function (result) {
                },
                function (error) {
                },
                {
                    myPrintData: JSON.stringify(postData)
                }
            );
        } catch (e) {
        }
    }
}

// 提交会员充值数据
function postMemberRecharge(model) {
    $.ajax({
        url: "/Ajaxdata/User_Siblings",
        data: JSON.stringify(model),
        type: "POST",
        contentType: "application/json",
        success: function (result) {
            if (result == -3) {
                $("#userid").val("");
                layer.msg("当前会员不支持跨店操作！");
                layer.close(index);
            } else if (result == -2) {
                layer.msg("没有权限操作！");
                layer.close(index);
            } else {
                if (result.sate) {
                    $("#sv_mrr_amountbefore,#sv_mrr_desc,#sv_mrr_present").val('');
                    layer.close(index);
                    layer.msg("充值成功！");
                    layer.closeAll('loading');
                    getMemberInfoByMemberId($('#memberNamenumber').text());
                    if ($(".swtith ").hasClass("open")) {
                        $.getJSON("/system/Getprint", function (data) {
                            if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                result.datames.sv_mrr_payment = result.datames.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                            };
                            var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                            var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                            Cef.openMyPc(JSON.stringify({ "moedel": model, "data": result.datames, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                        });
                    }
                }
                else {
                    layer.msg("充值操作失败，请刷新重试");
                    layer.close(index);
                }
            }

        }
    });
}

// 新版结算弹窗中的充值回调方法
function func_MemberRecharge(member_cardno, user_id, memberlevel_id) {
    setTimeout(function () {
        $('#member_id').val($('#huiyuan_id').attr('data-id')); // 会员Id
        $('.sv_mr_cardno').text(member_cardno);
        $('.sv_mr_name').text($('#memberNamep').text());
        $('.sv_mw_availableamount').text($('#memberbalance').text());
    }, 200);
    PreferentialTopUpGivingConfigList("Preferential", "TopUpGiving");

    $(document).undelegate('#clickMoneyNum_new li', 'click').delegate('#clickMoneyNum_new li', 'click', function () {
        if ($(this).data("val") >= 0) {
            $("#sv_mrr_amountbefore").val($("#sv_mrr_amountbefore").val() + $(this).data("val"));
        }
    });

    // 充值操作
    $(document).undelegate('#chongzhi', 'click').delegate('#chongzhi', 'click', function () {
        if ($("#member_id").val() != "0") {
            var sv_mrr_present = $("#sv_mrr_present");
            var sv_mrr_amountbefore = $("#sv_mrr_amountbefore");
            var sv_mrr_desc = $("#sv_mrr_desc");
            if (sv_mrr_amountbefore.val() == "") {
                layer.msg("请输入，充值金额！");
                sv_mrr_amountbefore.focus();
                return;
            }
            var val = sv_mrr_present.val() || 0;
            var cname = "充值";

            var isname = "";
            if ($(".sv_mr_name").length > 0) {

                isname = $(".sv_mr_name").text();
            } else {
                isname = $("#Cashxzhy").find("input").val();
            }
            var index = layer.load(1, { shade: [0.1, '#000'] }); //0代表加载的风格，支持0-2
            var model = {
                "member_id": $("#member_id").val(),
                "sv_mrr_type": $(".on[data-name='type']").data("id"),
                "sv_mrr_payment": $('.CSczpayui li.active').text(),
                "sv_mrr_amountbefore": sv_mrr_amountbefore.val(),
                "sv_mrr_desc": sv_mrr_desc.val(),
                "sv_mrr_present": val,
                "user_id": $("#userid").val(),
                "sv_user_givingtype": $("#sv_user_givingtype").val(), //赠送类型*@
                "sv_detali_proportionalue": $("#sv_detali_proportionalue").val(),//配置比例值*@
                "sv_detail_value": $("#sv_detail_value").val(), //赠送*@
                "sv_recommended_peopleid": $("#sv_recommended_peopleid").val(),//推荐人
            };
            if ($('.CSczpayui li.active').data('id') == '微信' || $('.CSczpayui li.active').data('id') == '支付宝') {
                var orderTime = 0;
                var data = {
                    member_id: $("#member_id").val(),
                    sv_recharge_money: sv_mrr_amountbefore.val(),
                    sv_recharge_type: 0,
                    sv_payment_method: $('.CSczpayui li.active').data('id') == '微信' ? 0 : 1,
                    sv_give_money: val,
                    sv_remark: sv_mrr_desc.val(),
                    user_id: $("#userid").val(),
                    sv_mrr_type: 1
                };

                $.postAsyncJson('/Ajaxdata/MemberRechargeQRCode', data, function (result) {
                    if (result.succeed == true) {
                        var scanPay = "<div class=\"wxsaosao\"><br><br><img src=" + result.values + " width=\"200\" class=\"bbimg\">";
                        scanPay += '<input type="text" id="authcode" name="sv_mr_cardno" class="form-control" placeholder="请用扫描枪扫码客户二维码" maxlength="30" autofocus="" /></div>';
                        layer.open({
                            type: 1,
                            title: $('.CSczpayui li.active').data('id') + "支付",
                            area: ['380px', '360px'],
                            content: scanPay
                        });
                        $('#authcode').keypress(function (event) {
                            if (event.keyCode == 13) {
                                data.authcode = $('#authcode').val();
                                $.ajax({
                                    url: '/Ajaxdata/MemberBarCodePay',
                                    type: 'post',
                                    data: data,
                                    dataType: 'json',
                                    async: true,
                                    success: function (_data) {
                                        if (_data.succeed == true) {
                                            layer.msg("支付成功！");
                                            layer.closeAll('loading');
                                            getMemberInfoByMemberId($('#memberNamenumber').text());
                                            if ($(".swtith ").hasClass("open")) {
                                                $.getJSON("/system/Getprint", function (data) {
                                                    if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                                        _data.values.sv_mrr_payment = _data.values.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                                    };
                                                    var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                                    var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                                    Cef.openMyPc(JSON.stringify({ "moedel": model, "data": _data.values, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                                });
                                            }
                                            setTimeout(function () {
                                                layer.closeAll();
                                            }, 650);
                                        }
                                        else {
                                            $("#wxauthcode").val("");
                                            layer.closeAll('loading');
                                            $('#errorMsg').html(data.errmsg);
                                        }
                                    }
                                });
                            }
                        });

                        $('.layui-layer-close').click(function () {
                            layer.close(index);
                            clearInterval(iCount);
                        });

                        var iCount = setInterval(function () {
                            orderTime += 3;
                            if (orderTime <= 600) {
                                $.getJSON("/Ajaxdata/QueryMemberRechargeOrder?orderNumber=" + result.errmsg, function (_data) {
                                    if (_data.sate == true) {
                                        getMemberInfoByMemberId($('#memberNamenumber').text());
                                        clearInterval(iCount);
                                        layer.closeAll('loading');
                                        layer.open({
                                            type: 1,
                                            area: ['300px', '200px'],
                                            shadeClose: false,
                                            content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">支付成功 </p>\<\/div>',
                                            time: '1500',
                                        });
                                        cliskgetuser($("#userid").val());
                                        if ($(".swtith ").hasClass("open")) {
                                            $.getJSON("/system/Getprint", function (data) {
                                                if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                                    _data.datames.sv_mrr_payment = _data.datames.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                                };
                                                var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                                var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                                Cef.openMyPc(JSON.stringify({ "moedel": model, "data": _data.datames, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                            });
                                        }
                                        $(".layui-layer").css({
                                            borderRadius: 5,
                                        });
                                        //$(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                                        setTimeout(function () {
                                            layer.closeAll();
                                        }, 1000);
                                    }
                                });
                            }
                            else {
                                clearInterval(iCount);
                                alert("您的订单已过期失效！");
                                location.reload();
                            }
                        }, 3000);
                        //Deke.DeKe_dialog.show_Url2("扫码支付", "/html/cash/barCodePay.html?v=250", barCodePay, ['550px', '380px']);         // 微信或支付宝扫码支付
                    }
                    else { //发起支付失败，继续操作
                        layer.msg($('.CSczpayui li.active').data('id') + "支付失败");
                        layer.closeAll('loading');
                    }
                });
            }
            else { // 现金，银行卡支付
                postMemberRecharge(model);
            }

        } else {
            $("#Cashxzhy").click();
            layer.msg("请先查找会员或识别会员卡");
        }
    });

    $(document).on('click', '.CSczpayui li', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //开关按钮事件
    $(document).on('click', '.swtith i', function () {
        $(this).parents('.swtith').toggleClass('open');
    });
}

function chuxikachuli(val) {
    if ($('#huiyuan_id').attr('data-id') == 0 || $('#huiyuan_id').attr('data-id') == '' || $('#huiyuan_id').attr('data-id') == null) {
        layer.msg("还没有选择会员");
        return false;
    }
    else {
        var ji = parseFloat($("#yuecount").attr('data-money'));

        if (parseFloat(val) > ji) {
            layer.msg("会员卡余额不足");
            return false;
        }
    }
    return true;
}

function jieshu() {
    var vl = true;
    if ($("#xianjinname").text() == "储值卡") {
        vl = chuxikachuli($("#xianjin").val());
    }
    //
    if ($("#daoshouname").text() == "储值卡") {

        vl = chuxikachuli($("#daishou").val());
    }
    if ($('#xianjin').val().trim() == null || $('#xianjin').val().trim() == '' || $('#xianjin').val().trim() == null) {
        vl = false; +
        layer.msg($('#xianjinname').text() + "不能为空！");
        $('#xianjin').focus();
        return;
    }
    if ($('#yinshou').val().trim() == null || $('#yinshou').val().trim() == '' || $('#yinshou').val().trim() == null) {
        vl = false;
        layer.msg("应收金额不能为空！");
        $('#yinshou').focus();
        return;
    }
    if (vl) {
        var falg = true;
        if ($("#xianjinname").text() == "储值卡") {
            verifyenable($('#huiyuan_id').attr('data-id'));

        } else {
            jiesuan($("#xianjinname").text());
        }

    }
}

//打开输入数量的工具
function f() {
    setTimeout(function () {
        if (clikcname == 'shulian') {
            $('#updateNum_en').css('display', 'none');
            $('#updateNum').css('width', '190px');
        }
    }, 100);
    $("#jishukuan").val("");
    $("#jishukuan").focus();
    $(".posia").click(function () {
        $("#jishukuan").val("");
        $("#jishukuan").focus();
    });

    $("#woquren").click(function () {
        if ($("#jishukuan").val() != "") {
            var memberprice = parseFloat($("#Cashlefsit .active").find(".memberprice").text());//会员价
            var mindiscount = parseFloat($("#Cashlefsit .active").find(".mindiscount").text());//最低折扣
            var minunitprice = parseFloat($("#Cashlefsit .active").find(".minunitprice").text());//最低价
            //数量处理
            if (clikcname == "shulian") {
                if ($("#Cashlefsit .active").hasClass("product_type")) {
                    var sdaa = parseInt($("#Cashlefsit .active").find(".nump").data("cnum"));
                    if ($("#jishukuan").val() > sdaa) {
                        layer.msg("会员该项目次数不够，若刚充值，请重新选择会员");
                        return;
                    }
                }
                $("#Cashlefsit .active").find(".nump").text($("#jishukuan").val());
                jiagesss = parseFloat(parseFloat($("#Cashlefsit .active").find(".jiage").text()) * parseFloat($("#jishukuan").val()) * 100) / 100;
                $("#Cashlefsit .active").find(".zhong").text(jiagesss);
                $("#Cashlefsit .active").find(".minunitprice").text(returnFloat($("#Cashlefsit .active").data("minunitprice")));
                $("#Cashlefsit .active").find(".memberprice").text(returnFloat($("#Cashlefsit .active").data("memberprice")));

            } else if (clikcname == "zhekou") {
                if (parseFloat($("#jishukuan").val()) < 11 && parseFloat($("#jishukuan").val()) > 0) {
                    if (mindiscount > 0 && mindiscount > parseFloat($("#jishukuan").val()) * 10) {
                        layer.msg("折扣不能低于商品最低折扣");
                    } else {
                        //处理折扣
                        zhekouuval = Math.round(parseFloat($("#jishukuan").val()) * 100) / 100 / 10;
                        jiagesss = Math.round(parseFloat($("#Cashlefsit .active").find(".jiage").data("rjia")) * zhekouuval * 100) / 100;
                        var sumprice = jiagesss * parseFloat($("#Cashlefsit .active").find(".nump").text())
                        if (memberprice > 0 && sumprice < memberprice) {
                            layer.msg("折扣后的金额不能低于商品会员价");
                        } else {
                            if (minunitprice > 0 && minunitprice > sumprice) {
                                layer.msg("折扣后的金额不能低于商品最低价");
                            } else {
                                $("#Cashlefsit .active").find(".jiage").text(returnFloat(jiagesss));
                                $("#Cashlefsit .active").find(".zhong").data("zhekou", zhekouuval).text(sumprice);
                            }
                        }

                    }

                } else {
                    layer.msg("折扣不能大于10");
                    return;
                }
            } else if (clikcname == "gaijia") {
                //价格处理
                jiagesss = $("#jishukuan").val();
                if (memberprice > 0 && jiagesss < memberprice) {
                    layer.msg("修改后的价不能低于商品会员价");
                } else {
                    if (minunitprice > 0 && jiagesss < minunitprice) {
                        layer.msg("修改后的价不能低于商品最低价");
                    } else {
                        var updateafterdiscount = jiagesss / $("#Cashlefsit .active").find(".jiage").data("rjia");
                        if (mindiscount > 0 && updateafterdiscount < mindiscount / 100) {
                            layer.msg("修改后的价折扣不能低于不能低于商品最低折扣");
                        } else {
                            $("#Cashlefsit .active").find(".jiage").text(returnFloat($("#jishukuan").val()));
                            $("#Cashlefsit .active").find(".zhong").text(returnFloat(jiagesss * returnFloat($("#Cashlefsit .active").find(".nump").text()) * 100) / 100);
                            //改价要换算折扣
                            //以折扣为准
                            jiagesss = jiagesss / $("#Cashlefsit .active").find(".jiage").data("rjia");
                            jiagesss = Math.round(parseFloat(jiagesss) * 100) / 100;
                            $("#Cashlefsit .active").find(".zhong").data("zhekou", jiagesss);
                        }
                    }
                }
            }
            layer.close(index);
            zhonger();
        } else {
            layer.msg("没有设置任何值哦");
            $("#jishukuan").focus();
        }
    });

    ///
    $("#jishukuan").keydown(function (key) {

        if (key.keyCode == "13") {
            $("#woquren").click();
        } else if (key.keyCode == "27") {
            layer.closeAll();
        }

    });
}

// 获取流水号
function shuxin() {

    //读取配置
    $.getAsyncJson("/system/GetUserPage", null, function (data) {
        dataconioctorn = data;
        var json = JSON.parse(data.sv_uc_serialnumberset);
        $("#danhao").text(json.nomber);
    });
}

//增加最低单价、商品数量（称重）
function zhonger() {
    var sumorigprice = 0.00;

    var summemberprice = 0;//会员价
    var sumorigpricemembe = 0;//计算会员价时的原售价
    var summinprice = 0;//最低价
    var sumorigpricemmin = 0;//计算最低价时的原售价
    var summindiscountprice = 0;//最低折扣价
    var sumorigpricediscoun = 0;//计算最低折扣价时的原售价
    var id = $("#huiyuan_id").attr('data-id');//会员
    var origmemberprice = 0;//原会员折后价
    var sumnocodingprice = 0;//无码金额

    var descount = 1;
    if (_member_discount != null && _member_discount != undefined && _member_discount != '' && _member_discount != 0 && _member_discount != "0") {
        descount = parseFloat(_member_discount) / 100;//会员折扣
    }
    $("#Cashlefsit > li").each(function () {
        //最低价计算
        var minprice = parseFloat($(this).find(".minunitprice").text()) * parseFloat($(this).find(".nump").text());
        origmemberprice = parseFloat($(this).find(".zhong").text()) * descount;
        //最低折扣价计算
        var mindiscount = parseFloat($(this).find(".mindiscount").text()) / 100;
        //会员价计算
        var memberprice = parseFloat($(this).find(".memberprice").text());
        var thisOriginalPriceTotal = parseFloat($(this).find(".zhong").text()); // 当前商品总计价格
        if (isNullOrWhiteSpace(id) && id != "0" && id != 0 && memberprice > 0) {
            summemberprice += parseFloat($(this).find(".memberprice").text() * parseFloat($(this).find(".nump").text()));
            sumorigpricemembe += parseFloat($(this).find(".zhong").text());
        }
        else if (mindiscount > 0 && id != "0" && id != 0 && isNullOrWhiteSpace(id) && descount < mindiscount) {  //最低折扣价计算 会员折扣小于最低折扣
            sumorigpricediscoun += parseFloat($(this).find(".zhong").text());
            summindiscountprice += mindiscount * thisOriginalPriceTotal;
        }
        else if (mindiscount > 0 && isNullOrWhiteSpace(id) && id != "0" && id != 0 && descount > mindiscount) {
            sumorigpricediscoun += parseFloat($(this).find(".zhong").text());
            summindiscountprice += descount * thisOriginalPriceTotal;
        }
        else if (minprice > 0 && isNullOrWhiteSpace(id) && id != "0" && id != 0 && origmemberprice < minprice) { //最低价计算 会员价小于最低价
            sumorigpricemmin += parseFloat($(this).find(".zhong").text());
            summinprice += minprice;
        }
        else if (minprice > 0 && isNullOrWhiteSpace(id) && id != "0" && id != 0 && origmemberprice > minprice) {
            sumorigpricemmin += parseFloat($(this).find(".zhong").text());
            summinprice += origmemberprice;
        }
        //else if (Number(this.id) == 0) {
        //    sumnocodingprice += parseFloat($(this).find(".zhong").text())*descount;
        //}

        sumorigprice += parseFloat($(this).find(".zhong").text());

    });
    $("#jieshuajie").text(returnFloat(sumorigprice));
    if (summemberprice > 0) {   //会员价
        sumorigprice = (sumorigprice - sumorigpricemembe)
    } if (summinprice > 0) {
        sumorigprice = (sumorigprice - sumorigpricemmin)
    } if (summindiscountprice > 0) {
        sumorigprice = (sumorigprice - sumorigpricediscoun)
    }
    //if (sumnocodingprice > 0)
    //{ sumorigprice = (sumorigprice -sumnocodingprice) }
    sumorigprice = sumorigprice * descount + summemberprice + summinprice + summindiscountprice;
    $("#jieshuajie2").text(returnFloat(sumorigprice));

    $('#xianjin').val(returnFloat(sumorigprice));
    $('#yinshou').val(returnFloat(sumorigprice));
    //数据变化，每次都会触发
    SendSecondScreenData(false);
}

SendSecondScreenDataClear(true);

//发送数据到分屏
function SendSecondScreenData(isClear) {
    try {
        if ((typeof Cef) !== "undefined") {
            //检查用户分屏设置
            if (hardware_secondscreen_enable) {
                if (isClear) { //清屏
                    var orderData = { "ProList": [], "TotalAmount": "￥0.00", "DisCount": "100%", "RealAmount": "￥0.00", "isClear": true };

                    Cef.SecondScreenOrderSend(JSON.stringify(orderData));
                } else {
                    //更新分屏

                    var orderData = { "ProList": [], "TotalAmount": "￥" + $("#jieshuajie").html(), "DisCount": _member_discount + "%", "RealAmount": "￥" + $("#jieshuajie2").html(), "isClear": false };
                    //var productData = { "ID": "1", "ProName": "无码收银2222", "ProCode": " ", "ProNum": 2, "ProPrice": "￥555.00", "Amount": "￥1110", "SpPrice": "", "ImgUrl": "", "ExtrlString": "", "IsGood": true };
                    //获取商品数据
                    $("#Cashlefsit > li").each(function () {
                        var productData = { "ID": "1", "ProName": $(this).find(".nn1").text(), "ProCode": $(this).find(".nn2 span.fl").text(), "ProNum": parseInt($(this).find(".nump").text()), "ProPrice": $(this).find(".jiage").text(), "Amount": $(this).find(".zhong").text(), "SpPrice": "", "ImgUrl": "", "ExtrlString": "", "IsGood": true };
                        orderData.ProList.push(productData);
                    });
                    Cef.SecondScreenOrderSend(JSON.stringify(orderData));
                }
            }
        }
    } catch (e) {

    }
}

function SendSecondScreenDataClear(isClear) {
    try {
        if ((typeof Cef) !== "undefined") {
            if (isClear) { //清屏
                var orderData = { "ProList": [], "TotalAmount": "￥0.00", "DisCount": "100%", "RealAmount": "￥0.00", "isClear": true };

                Cef.SecondScreenOrderSend(JSON.stringify(orderData));
            }

        }
    } catch (e) {

    }
}

//充值专用

function f6() {
    $("input").focus(function () {
        jiaodianname = $(this);
    });
    PreferentialTopUpGivingConfigList("Preferential", "TopUpGiving");
    var userid = $("#userid").val();
    if ($("#memberlevel_id").val() != null && $("#memberlevel_id").val() != "")
    { GetConfigdataBylevel($("#memberlevel_id").val()); }
    $("#userid").val(userid);
    $("#Cashxzhy").click(function () {

        Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=42", f3, ['730px', ''], "shoyin2");
        $("#userid").val("");
    });

    //后其修整
    cliskgetuser(userid);
    //数字点击
    $(document).on('click', '.calui>li', function () {
        if ($(this).data("val") >= 0) {
            if (jiaodianname) {
                jiaodianname.val(jiaodianname.val() + $(this).data("val")).change().focus();
            } else {
                $("#sv_mrr_amountbefore").val($("#sv_mrr_amountbefore").val() + $(this).data("val")).change().focus();
            }
        }
    });
    //   搜索会员
    $("#query_user").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#userid").val("");
            cliskgetuser("");
        }
    });
    $("#chongzhi").click(function () {
        //alert($("#member_id").val());

        if ($("#member_id").val() != "0") {
            var sv_mrr_present = $("#sv_mrr_present");
            var sv_mrr_amountbefore = $("#sv_mrr_amountbefore");
            var sv_mrr_desc = $("#sv_mrr_desc");
            if (sv_mrr_amountbefore.val() == "") {
                layer.msg("请输入，充值金额！");
                sv_mrr_amountbefore.focus();
                return;
            }
            var val = sv_mrr_present.val() || 0;
            var cname = "充值";

            var isname = "";
            if ($(".sv_mr_name").length > 0) {

                isname = $(".sv_mr_name").text();
            } else {
                isname = $("#Cashxzhy").find("input").val();
            }
            var index = layer.load(1, { shade: [0.1, '#000'] }); //0代表加载的风格，支持0-2
            var model = {
                "member_id": $("#member_id").val(),
                "sv_mrr_type": $(".on[data-name='type']").data("id"),
                "sv_mrr_payment": $('.CSczpayui li.active').text(),
                "sv_mrr_amountbefore": sv_mrr_amountbefore.val(),
                "sv_mrr_desc": sv_mrr_desc.val(),
                "sv_mrr_present": val,
                "user_id": $("#userid").val(),
                "sv_user_givingtype": $("#sv_user_givingtype").val(), //赠送类型*@
                "sv_detali_proportionalue": $("#sv_detali_proportionalue").val(),//配置比例值*@
                "sv_detail_value": $("#sv_detail_value").val(), //赠送*@
                "sv_recommended_peopleid": $("#sv_recommended_peopleid").val(),//推荐人
            };
            if ($('.CSczpayui li.active').data('id') == '微信' || $('.CSczpayui li.active').data('id') == '支付宝') {
                var orderTime = 0;
                var data = {
                    member_id: $("#member_id").val(),
                    sv_recharge_money: sv_mrr_amountbefore.val(),
                    sv_recharge_type: 0,
                    sv_payment_method: $('.CSczpayui li.active').data('id') == '微信' ? 0 : 1,
                    sv_give_money: val,
                    sv_remark: sv_mrr_desc.val(),
                    user_id: $("#userid").val(),
                    sv_mrr_type: 1
                };

                $.postAsyncJson('/Ajaxdata/MemberRechargeQRCode', data, function (result) {
                    if (result.succeed == true) {
                        var scanPay = "<div class=\"wxsaosao\"><br><br><img src=" + result.values + " width=\"200\" class=\"bbimg\">";
                        scanPay += '<input type="text" id="authcode" name="sv_mr_cardno" class="form-control" placeholder="请用扫描枪扫码客户二维码" maxlength="30" autofocus="" /></div>';
                        layer.open({
                            type: 1,
                            title: $('.CSczpayui li.active').data('id') + "支付",
                            area: ['380px', '360px'],
                            content: scanPay
                        });
                        $('#authcode').keypress(function (event) {
                            if (event.keyCode == 13) {
                                data.authcode = $('#authcode').val();
                                $.ajax({
                                    url: '/Ajaxdata/MemberBarCodePay',
                                    type: 'post',
                                    data: data,
                                    dataType: 'json',
                                    async: true,
                                    success: function (_data) {
                                        if (_data.succeed == true) {
                                            layer.msg("支付成功！");
                                            cliskgetuser($("#userid").val());
                                            if ($(".swtith ").hasClass("open")) {
                                                $.getJSON("/system/Getprint", function (data) {
                                                    if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                                        _data.values.sv_mrr_payment = _data.values.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                                    };
                                                    var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                                    var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                                    Cef.openMyPc(JSON.stringify({ "moedel": model, "data": _data.values, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                                });
                                            }
                                            setTimeout(function () {
                                                layer.closeAll();
                                            }, 650);
                                        }
                                        else {
                                            $("#wxauthcode").val("");
                                            layer.closeAll('loading');
                                            $('#errorMsg').html(data.errmsg);
                                        }
                                    }
                                });
                            }
                        });

                        $('.layui-layer-close').click(function () {
                            layer.close(index);
                            clearInterval(iCount);
                        });

                        var iCount = setInterval(function () {
                            orderTime += 3;
                            if (orderTime <= 600) {
                                $.getJSON("/Ajaxdata/QueryMemberRechargeOrder?orderNumber=" + result.errmsg, function (_data) {
                                    if (_data.sate == true) {
                                        clearInterval(iCount);
                                        layer.open({
                                            type: 1,
                                            area: ['300px', '200px'],
                                            shadeClose: false,
                                            content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">支付成功 </p>\<\/div>',
                                            time: '1500',
                                        });
                                        cliskgetuser($("#userid").val());
                                        if ($(".swtith ").hasClass("open")) {
                                            $.getJSON("/system/Getprint", function (data) {
                                                if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                                    _data.datames.sv_mrr_payment = _data.datames.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                                };
                                                var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                                var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                                Cef.openMyPc(JSON.stringify({ "moedel": model, "data": _data.datames, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                            });
                                        }
                                        $(".layui-layer").css({
                                            borderRadius: 5,
                                        });
                                        //$(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                                        setTimeout(function () {
                                            layer.closeAll();
                                        }, 1000);
                                    }
                                });
                            }
                            else {
                                clearInterval(iCount);
                                alert("您的订单已过期失效！");
                                location.reload();
                            }
                        }, 3000);
                        //Deke.DeKe_dialog.show_Url2("扫码支付", "/html/cash/barCodePay.html?v=250", barCodePay, ['550px', '380px']);         // 微信或支付宝扫码支付
                    } else {
                        // 失败
                        $.ajax({
                            url: "/Ajaxdata/User_Siblings",
                            data: JSON.stringify(model),
                            type: "POST",
                            contentType: "application/json",
                            success: function (result) {
                                if (result == -3) {
                                    $("#userid").val("");
                                    layer.msg("当前会员不支持跨店操作！");
                                    layer.close(index);
                                } else if (result == -2) {
                                    layer.msg("没有权限操作！");
                                    layer.close(index);
                                } else {
                                    if (result.sate) {
                                        //GetList(1);
                                        $("#sv_mrr_amountbefore,#sv_mrr_desc,#sv_mrr_present").val('');
                                        // cliskgetuser();
                                        layer.close(index);
                                        //GetUserdata = null;
                                        layer.msg("充值成功！");
                                        cliskgetuser($("#userid").val());
                                        if ($(".swtith ").hasClass("open")) {
                                            $.getJSON("/system/Getprint", function (data) {
                                                if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                                    result.datames.sv_mrr_payment = result.datames.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                                };
                                                var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                                var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                                Cef.openMyPc(JSON.stringify({ "moedel": model, "data": result.datames, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                            });
                                        }
                                    }
                                    else {
                                        layer.msg("充值操作失败，请刷新重试");
                                        layer.close(index);
                                    }
                                }

                            }
                        });
                    }
                });
            }
            else {
                //  alert(JSON.stringify(model));
                $.ajax({
                    url: "/Ajaxdata/User_Siblings",
                    data: JSON.stringify(model),
                    type: "POST",
                    contentType: "application/json",
                    success: function (result) {
                        if (result == -3) {
                            $("#userid").val("");
                            layer.msg("当前会员不支持跨店操作！");
                            layer.close(index);
                        } else if (result == -2) {
                            layer.msg("没有权限操作！");
                            layer.close(index);
                        } else {
                            if (result.sate) {
                                //GetList(1);
                                $("#sv_mrr_amountbefore,#sv_mrr_desc,#sv_mrr_present").val('');
                                // cliskgetuser();
                                layer.close(index);
                                //GetUserdata = null;
                                layer.msg("充值成功！");
                                cliskgetuser($("#userid").val());
                                if ($(".swtith ").hasClass("open")) {
                                    $.getJSON("/system/Getprint", function (data) {
                                        if (model.sv_user_givingtype > 0 && model.sv_detail_value > 0) {
                                            result.datames.sv_mrr_payment = result.datames.sv_mrr_payment + "(充" + model.sv_mrr_amountbefore + "元送" + model.sv_detail_value + (model.sv_user_givingtype == 1 ? "积分" : "元)") + ")";
                                        };
                                        var sv_mr_cardno = $(".sv_mr_cardno").text() || $(".sv_mr_cardno").val();
                                        var sv_mr_name = $($(".sv_mr_name")[0]).text() || $(".sv_mr_name").val();
                                        Cef.openMyPc(JSON.stringify({ "moedel": model, "data": result.datames, "user": { "sv_mr_cardno": sv_mr_cardno, "sv_mr_name": sv_mr_name } }), JSON.stringify(data), 4, 1, '' + receptionPtNum + '', receptionPtName);
                                    });
                                }
                            }
                            else {
                                layer.msg("充值操作失败，请刷新重试");
                                layer.close(index);
                            }
                        }

                    }
                });
            }

        } else {
            $("#Cashxzhy").click();
            layer.msg("请先查找会员或识别会员卡");
        }
    });
    $('.CSczpayui li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //开关按钮事件
    $('.swtith i').click(function () {
        $(this).parents('.swtith').toggleClass('open');
    });
}

//  取单
function f8() {
    if ($(".joove").length > 0) {
        var member_id = $('#guandanlist tr.joove').attr('data-memberid');
        if (confirm("一但取出，该记录会在挂单列表删除")) {
            $.post("/settle/deleteguandan?order_id=" + $(".joove").data("id"), function (data) {
                if (data) {
                    $("#Cashlefsit").html("");
                    $("#guanprlist tr").each(function (i) {
                        var str = '';
                        var sv_pricing_method = parseInt($(this).data("pricingmethod")); // 商品是计件还是计重（0 -- 计件，1--计重）
                        var minunitprice = returnFloat($(this).data("minunitprice")) == 0 ? "" : returnFloat($(this).data("minunitprice"));
                        var mindiscount = returnFloat($(this).data("mindiscount")) == 0 ? "" : returnFloat($(this).data("mindiscount"));
                        var memberprice = returnFloat($(this).data("memberprice")) == 0 ? "" : returnFloat($(this).data("memberprice"));
                        var number = $(this).find("td").eq(3).text() || 1;
                        if (memberprice > 0) {
                            str = '<p class="nn4" style="color:red"><span class="fl">会员单价¥ <text class="memberprice">' + returnFloat(memberprice) + '</text></span></p>';
                        } else if (mindiscount > 0) {
                            str = '<p class="nn4" style="color:red"><span class="fl">最低折扣 <text class="mindiscount">' + mindiscount * 10 + '</text>%</span></p>';
                        } else if (minunitprice > 0) {
                            str = '<p class="nn4" style="color:red"><span class="fl">最低单价¥ <text class="minunitprice">' + returnFloat(minunitprice) + '</text></span></p>';
                        }


                        $("#Cashlefsit").append(' <li id="' + $(this).data("id") + '" data-mindiscount="' + $(this).data("mindiscount") + '" data-minunitprice="' + $(this).data("minunitprice") + '" data-memberprice="' + $(this).data("memberprice") + '" data-pricingmethod="' + $(this).data("pricingmethod") + '" data-sv_p_commissiontype="' + ($(this).data("sv_p_commissiontype") || 0) + '" data-sv_p_commissionratio="' + ($(this).data("sv_p_commissionratio") || "") + '"><div class="naerigh">  <p class="nn1">' + $(this).find("td").eq(2).text() + '</p><p class="nn2"><span class="fl">' + $(this).find("td").eq(1).text() + '</span><span class="fr">数量 <text class="nump" data-cnum="0">' + $(this).find("td").eq(3).text() + '</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage"> ' + returnFloat($(this).find("td").eq(4).text()) + '</text></span><span class="fr">¥ <text class="zhong" data-sv_p_originalprice="' + returnFloat($(this).find("td").eq(5).text()) + '"> ' + returnFloat($(this).find("td").eq(5).text()) + '</span></p>' + str + '</div> </li>');
                    });
                    zhonger();
                    layer.closeAll();
                }
            });
            if (member_id != null && member_id != undefined && member_id != '') {
                $.getAsyncJson('/Ajaxdata/GetUserModel', { id: member_id }, function (result_data) {
                    $("#huiyuan_id").text(result_data.sv_mr_name).data("id", result_data.member_id).data("jiekou", result_data.sv_ml_commondiscount);
                    $("#yuecount").text(returnFloat(result_data.sv_mw_availableamount)).attr('data-money', returnFloat(result_data.sv_mw_availableamount));
                    var descount = parseFloat(result_data.sv_ml_commondiscount);
                    if (data.sv_ml_commondiscount != null && data.sv_ml_commondiscount != undefined && data.sv_ml_commondiscount != '' && data.sv_ml_commondiscount != 0 && data.sv_ml_commondiscount != "0") {
                        _member_discount = parseFloat(data.sv_ml_commondiscount) * 10;
                    }
                    else {
                        _member_discount = 100;
                    }
                    zhonger();
                });
            }
        }
    } else {

        layer.msg("还没有选中要取的订单");
    }

}

function f7() {
    $.getJSON("/settle/Getguandan", { pageIndex: 1, pageSize: 100 }, function (data) {
        var htmlaa = "";
        for (var i = 0; i < data.length; i++) {
            var member_id = "";
            var remark = "";
            if (data[i].member_id != null && data[i].member_id != undefined && data[i].member_id != '') {
                member_id = data[i].member_id;
            }
            if (data[i].sv_remark != null && data[i].sv_remark != undefined && data[i].sv_remark != '') {
                remark = data[i].sv_remark;
            }
            //htmlaa += '<tr data-id="' + data[i].wt_nober + '" data-memberId = "' + member_id + '"><td>' + (i + 1) + '</td><td>' + data[i].wt_nober + '</td> </tr> ';
            htmlaa += '<li data-id="' + data[i].wt_nober + '" data-memberId = "' + member_id + '"><div class="nalefisfristbox"><span>单号:</span><span>' + data[i].wt_nober + '</span><span>' + new Date(data[i].wt_datetime).Format("hh:mm:ss") + '</span></div><div class="nalefisfristbox"><span>备注:</span><span class="listremarks">' + remark + '</span></div><input type="radio" id="" name="productName" class="member-check"></li>';
        }

        $("#guandanlist").html(htmlaa);

        $("#guandanlist li").click(function () {
            $(this).toggleClass("joove").siblings().removeClass("joove");
            $.getJSON("/settle/GetGuanList?order_id=" + $(this).data("id"), function (data) {
                loggin.chklogn(data);
                htmlaa = "";
                for (var i = 0; i < data.length; i++) {
                    var number = 0;
                    if (data[i].sv_pricing_method == 1) {
                        number = data[i].sv_p_weight;
                    }
                    else {
                        number = data[i].product_num;
                    }
                    htmlaa += '  <tr data-mindiscount="' + data[i].sv_p_mindiscount + '" data-minunitprice="' + data[i].sv_p_minunitprice + '" data-memberprice="' + data[i].sv_p_memberprice + '" data-id="' + data[i].product_id + '" data-pricingmethod="' + data[i].sv_pricing_method + '" data-sv_p_commissiontype="' + data[i].sv_p_commissiontype + '" data-sv_p_commissionratio="' + data[i].sv_p_commissionratio + '"><td>' + (i + 1) + '</td><td>' + data[i].product_nober + '</td> <td>' + data[i].product_name + '</td> <td>' + number + '</td> <td>' + data[i].product_unitprice + '</td> <td>' + data[i].product_total + '</td> </tr>';
                }
                $("#guanprlist").html(htmlaa);

            });

        });
    });

}


function f9() {
    $("#query_user").focus();
    $("#Cashxzhy").click(function () {
        Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=20166", f3, ['730px', ''], "shoyin2");
        $("#userid").val("");
    });
    var _query_user_last_search = "";
    $("#query_user").keydown(function (e) {
        if (e.keyCode == 13) {
            if ($("#query_user").val()) {
                if (_query_user_last_search != $("#query_user").val()) {
                    //重新检索会员卡
                    $("#userid").val("");
                    cliskgetuser();
                } else {
                    //选取会员卡
                    $(".layui-layer-btn0").trigger("click");
                }
                _query_user_last_search = $("#query_user").val();
            }
        } else if (e.keyCode == 113) //F2
        {
            var c_ = typeof Cef;
            if (c_ !== "undefined") {
                GetICCardEventData($("#query_user"), e);
                if ($("#query_user").val()) {
                    if (_query_user_last_search != $("#query_user").val()) {
                        //重新检索会员卡
                        $("#userid").val("");
                        cliskgetuser();
                    } else {
                        //选取会员卡
                        $(".layui-layer-btn0").trigger("click");
                    }
                    _query_user_last_search = $("#query_user").val();
                }
            }
        }
    });

    $("#query_user").change(function (e) {
        if ($("#query_user").val().length > 0) {
            $("#userid").val("");
            cliskgetuser("");
        }
    });

    $("#huiyuan_click > li").click(function () {
        $("#query_user").data("id", "");

        if ($(this).hasClass("cdbule")) {

            var str = $("#query_user").val();
            $("#query_user").val(str.substring(0, str.length - 1));

        } else if ($(this).text() == "OK") {

            $("#query_user").change();
        } else {
            $("#query_user").val($("#query_user").val() + $(this).text());
        }
        $("#query_user").focus();
    });

}

$(document).ready(function () {
    $(document).on("click", ".biglis", function () {
        $(this).toggleClass("open");

    });
    //取消密码输入
    $(document).on("click", "#quxiao", function () {

        layer.closeAll("page");
    });

    $("#Cashchongzhi").click(function () {
        $("#userid").val("");
        Deke.DeKe_dialog.show_Url("选择会员", "/html/cash/huiyuanka.html?v=2040", ["确认选择会员", "关闭"], f10, f9, ['630px', '']);
        $("#userid").val("");
    });

    $("#Cashlefsit").on("click", "li", function () {

        $(this).addClass('active').siblings().removeClass('active');

    });

    queryProductFocus();
    $("#guadaiclick").click(function () {
        if ($("#Cashlefsit li").length == 0) {
            Deke.DeKe_dialog.show_Url("挂单系统", "/html/cash/guadan.html?v=2036", ["取出选中订单", "关闭"], f8, f7, ['780px', '']);
        }
        else {
            layer.confirm("", { btn: ["确认挂单", "取单", "关闭"] },
                 function () {
                     if (!isNullOrWhiteSpace($("#danhao").text())) { // 流水号不存在情况重新获取流水号
                         shuxin();
                     }
                     var pendingModel = { member_id: $('#huiyuan_id').attr('data-id'), sv_remark: $("#remarks").val(), prlist: [], wt_nober: $("#danhao").text() }; // 挂单信息
                     $("#Cashlefsit > li").each(function () {
                         var productlist = {
                             product_nober: $(this).find(".fl").eq(0).text(),
                             product_id: $(this).attr("id"),
                             product_name: replaceStr($(this).find(".nn1").text()),
                             product_num: $(this).find(".nump").text(),
                             product_unitprice: $(this).find(".jiage").text(),
                             product_discount: 0,
                             product_total: $(this).find(".zhong").text(),
                             sv_pricing_method: $(this).attr("data-pricingmethod"),
                             sv_p_commissiontype: $(this).attr("data-sv_p_commissiontype") || 0,
                             sv_p_commissionratio: $(this).attr("data-sv_p_commissionratio") || 0
                         };
                         pendingModel.prlist.push(productlist);
                     });

                     var i2 = layer.load(1, { shade: [0.1, '#000'] });
                     $.ajax({
                         url: '/settle/Post_guadan',
                         type: 'post',
                         data: JSON.stringify(pendingModel),
                         contentType: 'application/json',
                         async: true,
                         success: function (data) {
                             loggin.chklogn(data);
                             if (data) {

                                 shuxin();
                                 $("#Cashlefsit").html("");
                                 zhonger();
                                 layer.closeAll();
                                 layer.msg("挂单操作成功！");
                             } else {
                                 layer.close(i2);
                                 layer.msg("操作失败！");
                             }
                         }
                     });
                     layer.close(i2);
                 },
            function () {

                Deke.DeKe_dialog.show_Url("挂单系统", "/html/cash/guadan.html?v=2036", ["取出选中订单", "关闭"], f8, f7, ['730px', '']);
            }
            );
            $(".layui-layer-content").html('<input type="text" id="remarks" value="" placeholder="请输入备注信息(可不输入)" style="width: 100%;"/>');
            $('#remarks').focus();
        }

    });


    $(document).on("click", "#Czjsje", function () {
        if ($("#query_user").val() != "") {
            Deke.DeKe_dialog.show_Url3("会员充值", "/html/cash/chongzhu2.html?v=2031", f6, ['730px', ''], "chuxi");
            $("#userid").val($("#userid").val())
        } else {

            layer.msg("请先选择会员");
        }

    });

    $("#chongji").click(function () {
        Deke.DeKe_dialog.show_Url3("会员充值", "/html/cash/chongzhu.html?v=2031", f6, ['730px', ''], "chuxi");
        $("#userid").val($("#userid").val())
    });


    $("#userbur").click(function () {
        layer.open({
            type: 2,
            title: '会员管理',
            shadeClose: true,
            shade: 0.8,
            area: ['80%', '90%'],
            content: '/member/?x=1' //iframe的url
        });
        //$("#userid").val("");
        //Deke.DeKe_dialog.show_Url("选择会员", "/html/cash/huiyuanka.html?v=2040", ["确认选择会员", "关闭"], f10, f9, ['630px', '']);
        //$("#userid").val("");
    });

    //结算
    shuxin();

    function CashlebtnFunc(vkey) {
        if (vkey == 13 && $("#queryproduct").is(":focus")) {
            return;
        }
    }
    $("#Cashlebtn").click(function () {
        if ($("#Cashlefsit > li").length > 0) {
            GetConfigdataBylevel($("#memberlevel_id").val());
            //  Deke.DeKe_dialog.show_Url3("收银结算", "/html/cash/yilang.html?v=20212", f2, ['730px', ''], "shoyin");

            if ($(".product_type").length > 0) {

                Deke.DeKe_dialog.show_Url3("收银结算", "/html/cash/yilang.html?v=" + getTimeStamp(), f11, ['730px', ''], "shoyin");
            }
            else {
                Deke.DeKe_dialog.show_Url3("", "/html/cash/jieshuan2.html?v=" + getTimeStamp(), f2, ['877px', ''], "shoyin2");
            }
        }
        else {
            layer.msg("请选择商品后再进行结算！");
        }
    });

    //数量点击数字的时候
    $(document).on("click", ".calui>li", function () {
        $("#jishukuan").val($("#jishukuan").val() + $(this).data("val"));
        $("#jishukuan").change();
    });

    //点击数量按扭，改价，折扣
    $(".shudian").click(function () {
        if ($("#Cashlefsit .active").length > 0) {
            clikcname = $(this).data("name");
            name = "";
            switch (clikcname) {
                case "shulian":
                    name = "修改产品数量";
                    break;
                case "zhekou":
                    name = "修改产品折扣 1~10之间";
                    break;
                case "gaijia":
                    name = "修改产品价格";
                    break;
            }

            Deke.DeKe_dialog.show_Url2(name, "/html/cash/jishu.html?v=25", f, ['310px', '']);
        } else {
            layer.msg("还没有选中产品");
        }
    });

    //搜索框的计算的弹窗
    $(".search-product-buy").click(function () {
        Deke.DeKe_dialog.show_Url2('条码/助词码（大写）/价格（0~100000)', "/html/cash/jishu.html?v=25", searchproductFn, ['310px', '']);
    });
    function searchproductFn() {
        $("#woquren").click(function () {
            if ($("#jishukuan").val()) {
                $("#queryproduct").val($("#jishukuan").val());
            }
            queryProductFocus();
            layer.closeAll();
        });
        $(".posia").click(function () {
            $("#jishukuan").val("");
        });
    };

    //时间变动
    setInterval(function () {
        var date = new Date();
        //$("#date_ss").text("系统时间：" + new Date().Format("yyyy年MM月dd日 hh:mm:ss"));
        var year = date.getFullYear();//当前年份
        var month = date.getMonth();//当前月份
        var data = date.getDate();//天
        var hours = date.getHours();//小时
        var minute = date.getMinutes();//分
        var second = date.getSeconds();//秒
        var time = year + "年" + fnW((month + 1)) + "月" + fnW(data) + "日 " + fnW(hours) + ":" + fnW(minute) + ":" + fnW(second);
        $("#date_ss").text('销售时间：' + time);
    }, 1000);
    //补位 当某个字段不是两位数时补0
    function fnW(str) {
        var num;
        str >= 10 ? num = str : num = "0" + str;
        return num;
    }
    //点击加号
    $("#num_jia").click(function () {
        var sda = parseInt($("#Cashlefsit .active").find(".nump").text());
        sda++;

        if ($("#Cashlefsit .active").hasClass("product_type")) {
            var sdaa = parseInt($("#Cashlefsit .active").find(".nump").data("cnum"));
            if (sda > sdaa) {
                layer.msg("会员该项目次数不够，若刚充值，请重新选择会员");
                return;
            }
        }

        $("#Cashlefsit .active").find(".nump").text(sda);
        $("#Cashlefsit .active").find(".zhong").text(returnFloat(Math.round($("#Cashlefsit .active").find(".jiage").text() * sda * 100) / 100));
        $("#Cashlefsit .active").find(".minunitprice").text(returnFloat($("#Cashlefsit .active").data("minunitprice")))
        $("#Cashlefsit .active").find(".memberprice").text(returnFloat($("#Cashlefsit .active").data("memberprice")))
        zhonger();
    });

    //点击减号
    $("#num_jian").click(function () {

        var sda = parseInt($("#Cashlefsit .active").find(".nump").text());
        sda--;

        if (sda < 1) {
            //  layer.alert("ssss");
            layer.confirm("您要删除该产品吗？", { btn: ["确认", "取消"] }, function () {

                $("#Cashlefsit .active").remove();
            });
            sda = 1;
        }
        $("#Cashlefsit .active").find(".nump").text(sda);
        $("#Cashlefsit .active").find(".zhong").text(returnFloat(Math.round($("#Cashlefsit .active").find(".jiage").text() * sda * 100) / 100));
        $("#Cashlefsit .active").find(".minunitprice").text(returnFloat($("#Cashlefsit .active").data("minunitprice")))
        $("#Cashlefsit .active").find(".memberprice").text(returnFloat($("#Cashlefsit .active").data("memberprice")))
        zhonger();
        layer.closeAll();
    });


    ///删除产品

    $("#delete_p").click(function () {
        if ($("#Cashlefsit .active").length > 0) {
            $("#Cashlefsit .active").remove();
            layer.closeAll();
            zhonger();
        } else {
            //layer.confirm("您真的要删除的产品吗？", function () {

            $("#Cashlefsit li").eq(0).remove();
            layer.closeAll();
            zhonger();
            //});

        }
    });

    $("#queryproduct").keyup(function (key) {
        var txtSeachProductStr = $("#queryproduct").val().replace(/\ +/g, "");
        //var inputval = parseFloat($("#queryproduct").val() || 0);
        ////无码0到100000
        //if (inputval > 0 && inputval < 100001) {
        //    $("#nocoding").css("display", "block");
        //} else {
        //    $("#nocoding").css("display", "none");
        //}
        fastCash();
        if (key.keyCode == 13) {
            if (txtSeachProductStr) {
                if (capital_letters) {
                    GetProductList(1, 0, 0, 0, 0, txtSeachProductStr);
                    queryProductFocus();
                    $("#classlist .swiper-slide").eq(0).addClass("active ").siblings().removeClass("active ");
                }
            }
        }

    });
    var _key_input = "";
    var _key_input_time_flag = false;
    var _key_input_old = "";
    $("#queryproduct").on("focus", function () {
        _key_input_time_flag = true;
        setInterval(function () {
            if (_key_input_time_flag) {
                _key_input_time_flag = false;
                _key_input = $("#queryproduct").val().replace(/\ +/g, "");
                if (($("#queryproduct").val().replace(/\ +/g, "") && $("#queryproduct").val().replace(/\ +/g, "") == _key_input && _key_input != _key_input_old)) {
                    _key_input_old = _key_input;
                    $("#queryproduct").change();
                } else {
                    _key_input = $("#queryproduct").val().replace(/\ +/g, "");
                    setTimeout(function () { _key_input_time_flag = true; }, 1000);
                }
            }
        }, 200);
    });

    nocodingAdd();//无码商品
    //这个是充值弹框支付点击事件
    $('.CSczpayui li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //开关按钮事件
    $('.swtith i').click(function () {
        $(this).parents('.swtith').toggleClass('open');
    });

    //右侧导航栏的点击事件

    $('.maska').click(function () {
        $(this).parents('li').toggleClass('active').siblings().removeClass('active');
        if ($(this).parents('li').hasClass('active')) {
            $(this).siblings('.urlsk').slideDown(200);
            $(this).parents('li').siblings().removeClass('active').find('.urlsk').slideUp(200);
        } else {
            $(this).parents('li').find('.urlsk').slideUp(200);
        }
    });

    //导航点击事件
    $('.Cashtopnav').on('click', '.swiper-slide', function () {
        if ($(this).data("id") > -1) {
            $(this).addClass('active').siblings().removeClass('active');
            GetProductList(1, 0, -1, 0, $(this).data("id"), "");
        }
    });

    //快速收银 无码收银 快收
    function fastCash() {
        var inputval = parseFloat($("#queryproduct").val().replace(/\ +/g, "") || 0);
        //无码0到100000
        if (inputval > 0 && inputval < 100001) {
            //$("#nocoding").css("display", "block");
            $("#nocoding").removeClass("disabled");
        } else {
            $("#nocoding").addClass("disabled");
            //$("#nocoding").css("display", "none");
        }
    }
    //结算弹框选择支付移动事件
    //var swiper = new Swiper('.showiimb .swiper-container', {
    //    slidesPerView: 4,
    //    paginationClickable: true,
    //    spaceBetween: 5,
    //    freeMode: true,
    //    prevButton: '.showiimb .swiper-button-prev',
    //    nextButton: '.showiimb .swiper-button-next'
    //});

    //导航点击事件
    $('.paywaylist').on('click', '.selectpaytype', function () {

        $(this).addClass('active').siblings().removeClass('active');

    });

    // 处理计重商品
    function weightProduct(productInfo) {
        setTimeout(function () {
            $('#weightUnitPrice').html(parseFloat(productInfo.find(".jiage").text()));
            $('#weightUnitPrice').attr('data-price', productInfo.find(".jiage").text());
            $('#weightProductName').html(productInfo.find(".name").text());
            $('#txtproduct_weight').focus();


            if (((typeof Cef) !== 'undefined')) {
                if (hardware_secondscreen_enable) {
                    Cef.ShowWeightPanel("0.00," + $('#weightUnitPrice').attr('data-price') + ",0.00");
                }
            }

            // 称重量
            $('#txtproduct_weight').bind('keyup', function () {
                var unitPrice = parseFloat($('#weightUnitPrice').attr('data-price'));
                var product_weight = isNullOrEmpty($(this).val()) == true ? parseFloat($(this).val().trim()) : 0;

                $('#product_Total').val((product_weight * unitPrice).toFixed(2));

                try {
                    if (((typeof Cef) !== 'undefined')) {
                        if (hardware_secondscreen_enable) {
                            Cef.ShowWeightPanel(product_weight + "," + unitPrice + "," + $('#product_Total').val());
                        }
                    }
                } catch (e) {

                }

            });

            $('#txtproduct_weight').keydown(function (key) {
                if (key.keyCode == "13") {
                    try {
                        if (((typeof Cef) !== 'undefined')) {
                            if (hardware_secondscreen_enable) {
                                Cef.HideWeightPanel();
                            }
                        }
                    } catch (e) {

                    }
                    $('#btnWeightProduct').click();
                }
            });

            // 确定
            $('#btnWeightProduct').click(function () {
                var str = "";
                var minunitprice = parseFloat(productInfo.data("minunitprice")) == 0 ? "" : parseFloat(productInfo.data("minunitprice"));
                var mindiscount = parseFloat(productInfo.data("mindiscount")) == 0 ? "" : parseFloat(productInfo.data("mindiscount"));
                var memberprice = parseFloat(productInfo.data("memberprice")) == 0 ? "" : parseFloat(productInfo.data("memberprice"));
                var unitprice = parseFloat(productInfo.find(".jiage").text());
                var product_weight = isNullOrEmpty($('#txtproduct_weight').val()) == true ? parseFloat($('#txtproduct_weight').val().trim()) : 0;
                var product_Total = isNullOrEmpty($('#product_Total').val()) == true ? parseFloat($('#product_Total').val().trim()) : 0;

                if (memberprice > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">会员单价¥ <text class="memberprice">' + (memberprice).toFixed(2) + '</text></span></p>';
                } else if (mindiscount > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">最低折扣 <text class="mindiscount">' + (mindiscount * 10).toFixed(2) + '</text>%</span></p>';
                } else if (minunitprice > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">最低单价¥ <text class="minunitprice">' + (minunitprice).toFixed(2) + '</text></span></p>';
                }

                if (product_weight > 0 && product_Total > 0) {
                    if ($("#" + productInfo.data("prid")).length == 0) {
                        var cashlefsitHtml = '<li data-mindiscount="' + productInfo.data("mindiscount") + '" data-minunitprice="' + parseFloat(productInfo.data("minunitprice")).toFixed(2) + '" ';
                        cashlefsitHtml += 'data-memberprice="' + parseFloat(productInfo.data("memberprice")).toFixed(2) + '" id="' + productInfo.data("prid") + '" data-pricingmethod="' + productInfo.data("pricingmethod") + '" data-sv_p_commissiontype="' + productInfo.data("sv_p_commissiontype") + '" data-sv_p_commissionratio="' + productInfo.data("sv_p_commissionratio") + '"><div class="naelfe">' + osd + '';
                        cashlefsitHtml += '</div> <div class="naerigh"><p class="nn1">' + productInfo.find(".name").text() + '</p><p class="nn2"><span class="fl">';
                        cashlefsitHtml += '' + productInfo.data("id") + '</span><span class="fr">数量 <text class="nump" data-cnum="0">' + product_weight + '</text></span></p> <p class="nn3">';
                        cashlefsitHtml += '<span class="fl">¥<text class="jiage" data-rjia="' + parseFloat(productInfo.find(".jiage").text()) + '"> ';
                        cashlefsitHtml += '' + parseFloat(productInfo.find(".jiage").text()).toFixed(2) + '</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" ';
                        cashlefsitHtml += 'data-sv_p_originalprice="' + productInfo.find(".jiage").data("sv_p_originalprice") + '"> ';
                        cashlefsitHtml += '' + (unitprice * product_weight).toFixed(2) + '</span></p>' + str + '</div> </li>';
                        $("#Cashlefsit").prepend(cashlefsitHtml);
                    }
                    else {
                        $("#" + productInfo.data("prid")).find(".nump").text((parseFloat($("#" + productInfo.data("prid")).find(".nump").text()) + product_weight).toFixed(2));
                        var number = !isNullOrWhiteSpace($("#" + productInfo.data("prid")).find(".nump").text()) ? 1 : parseFloat($("#" + productInfo.data("prid")).find(".nump").text());
                        jiagesss = returnFloat((parseFloat(number) * parseFloat($("#" + productInfo.data("prid")).find(".jiage").text()) * 100).toFixed(2) / 100);
                        $("#" + productInfo.data("prid")).find(".zhong").text(jiagesss);
                        if (parseFloat(minunitprice) > 0) {
                            $("#" + productInfo.data("prid")).find(".minunitprice").text((minunitprice).toFixed(2));
                        }
                        else {
                            $("#" + productInfo.data("prid")).find(".minunitprice").text('');
                        }
                        $("#" + productInfo.data("prid")).find(".memberprice").text(memberprice);
                    }
                    isShowWindow = false; // 初始化计重商品弹窗显示标志
                    layer.closeAll();
                    $("#queryproduct").val("");
                    zhonger();
                    queryProductFocus();
                }
                else if (product_weight == 0) {
                    layer.msg('请输入正确的商品重量');
                    $('#txtproduct_weight').focus();
                }
                else {
                    layer.msg('请输入商品重量');
                    $('#txtproduct_weight').focus();
                }
            });
        }, 200);
    }

    //点击产品
    $("#productlist").on("click", ".textlistbox", function () {
        var cashlefsitLength = $('#Cashlefsit li').length;
        var cashlefsit_Active = "";
        var str = "";
        var sv_pricing_method = parseInt($(this).data("pricingmethod")); // 商品是计件还是计重（0 -- 计件，1--计重）
        var minunitprice = returnFloat($(this).data("minunitprice")) == 0 ? "" : returnFloat($(this).data("minunitprice"));
        var mindiscount = returnFloat($(this).data("mindiscount")) == 0 ? "" : returnFloat($(this).data("mindiscount"));
        var memberprice = returnFloat($(this).data("memberprice")) == 0 ? "" : returnFloat($(this).data("memberprice"));

        // 处理计重商品
        if (sv_pricing_method == 1 && isShowWindow == false) {
            isShowWindow = true;
            Deke.DeKe_dialog.show_Url2(" ", "/html/cash/weight.html?v=556565", weightProduct($(this)), ['360px', '470px']);
            return;
        }
        else if (isShowWindow == false) {
            // 添加
            if ($("#" + $(this).data("prid")).length == 0) {
                if (memberprice > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">会员单价¥ <text class="memberprice">' + memberprice + '</text></span></p>';
                } else if (mindiscount > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">最低折扣 <text class="mindiscount">' + mindiscount * 10 + '</text>%</span></p>';
                } else if (minunitprice > 0) {
                    str = '<p class="nn4" style="color:red"><span class="fl">最低单价¥ <text class="minunitprice">' + minunitprice + '</text></span></p>';
                }
                if (cashlefsitLength <= 0) {
                    cashlefsit_Active = "active";
                }
                //$("#Cashlefsit").prepend(' <li data-mindiscount="' + $(this).data("mindiscount") + '" data-minunitprice="' + $(this).data("minunitprice") + '" data-memberprice="' + $(this).data("memberprice") + '" id="' + $(this).data("prid") + '"><div class="naelfe">' + osd + '</div> <div class="naerigh">  <p class="nn1">' + $(this).find(".name").text() + '</p><p class="nn2"><span class="fl">' + $(this).data("id") + '</span><span class="fr">数量 <text class="nump" data-cnum="0">1</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="' + returnFloat($(this).find(".jiage").text()) + '"> ' + returnFloat($(this).find(".jiage").text()) + '</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="' + $(this).find(".jiage").data("sv_p_originalprice") + '"> ' + returnFloat($(this).find(".jiage").text()) + '</span></p></div> </li>');
                $("#Cashlefsit").prepend('<li class="' + cashlefsit_Active + '" data-mindiscount="' + $(this).data("mindiscount") + '" data-minunitprice="' + $(this).data("minunitprice") + '" data-memberprice="' + $(this).data("memberprice") + '" id="' + $(this).data("prid") + '" data-pricingmethod="' + $(this).data("pricingmethod") + '" data-sv_p_commissiontype="' + $(this).data("sv_p_commissiontype") + '" data-sv_p_commissionratio="' + $(this).data("sv_p_commissionratio") + '"><div class="naelfe">' + osd + '</div> <div class="naerigh"><p class="nn1">' + $(this).find(".name").text() + '</p><p class="nn2"><span class="fl">' + $(this).data("id") + '</span><span class="fr">数量 <text class="nump" data-cnum="0">1</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="' + returnFloat($(this).find(".jiage").text()) + '"> ' + returnFloat($(this).find(".jiage").text()) + '</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="' + $(this).find(".jiage").data("sv_p_originalprice") + '" data-sv_p_commissiontype="' + $(this).find(".jiage").data("sv_p_commissiontype") + '" data-sv_p_commissionratio="' + $(this).find(".jiage").data("sv_p_commissionratio") + '"> ' + returnFloat($(this).find(".jiage").text()) + '</span></p>' + str + '</div> </li>');
                osd++;
            }
                // 增加 
            else {
                $("#" + $(this).data("prid")).find(".nump").text(parseInt($("#" + $(this).data("prid")).find(".nump").text()) + 1);
                var number = !isNullOrWhiteSpace($("#" + $(this).data("prid")).find(".nump").text()) ? 1 : parseFloat($("#" + $(this).data("prid")).find(".nump").text());
                jiagesss = returnFloat(Math.round(parseFloat(number) * parseFloat($("#" + $(this).data("prid")).find(".jiage").text()) * 100) / 100);
                $("#" + $(this).data("prid")).find(".zhong").text(jiagesss);
                $("#" + $(this).data("prid")).find(".minunitprice").text(minunitprice);
                $("#" + $(this).data("prid")).find(".memberprice").text(memberprice);
            }
        }

        $("#queryproduct").val("");
        zhonger();
        queryProductFocus();
    });

    //类别初始化
    $.getAsyncJson("/ProductCategory/GetSaleProductCategoryList", null, function (data) {

        if (data.length > 0) {

            for (var i in data) {

                $("#classlist").append(' <div class="swiper-slide" data-id="' + data[i].productcategory_id + '">' + data[i].sv_pc_name + '</div>');
            }
            if (data.length < 10) {
                for (var i = 0; i < (10 - data.length) ; i++)
                    $("#classlist").append(' <div class="swiper-slide" data-id="-1">&nbsp;</div>');
            }

            //导航滑动的
            var swiper = new Swiper('.Cashtopnav .swiper-container', {
                slidesPerView: 6,
                paginationClickable: true,
                spaceBetween: 4,
                freeMode: true,
                prevButton: '.Cashtopnav .swiper-button-prev',
                nextButton: '.Cashtopnav .swiper-button-next'
            });
        }
    });
    //---------------------结束---------------
    GetProductList(1, 0, -1, 0, 0, "");
    if (moduleConfigList) {
        PreferentialTopUpGivingConfigList("Preferential", "ConsumptionReduction");
    }
});
var PageCount = 0;
var thisPage = 1;
//var mySwiper = new Swiper('.Cashbotobx .swiper-container', {});
var mySwiper = new Swiper('.Cashbotobx2 .swiper-container', {});
var _g_fast_query_isn = "";
function GetProductList(pageIndex, type, tianshu, storageFlag, categoryFlag, nameFlag) {
    $("#productlist").html("");
    var statusFlag = "0";
    var adddateFlag = "0";
    var multipleproductnumber = 0;
    var isn = "";
    //称内码检查条件：1、商超行业；2、13位条码
    //例：条码组成（全数字）：2+5+5+1，如：9902538004059，2031848017903
    if (nameFlag && nameFlag.length == 13 && !isNaN(nameFlag)) {
        isn = nameFlag.substring(2, 7);
        _g_fast_query_isn = nameFlag;
    }
    var html = ' ';
    $.ajax({
        url: "/AjaxProduct/GetSalesProductList?producttype_id=-1",
        data: {
            status: statusFlag,
            category: categoryFlag,
            storage: storageFlag,
            adddate: adddateFlag,
            name: nameFlag,
            pageIndex: 5,
            pageSize: count,   //每页记录数
            tianshu: -1,
            isn: isn
        },
        dataType: "json",
        async: true,
        cache: true,
        success: function (res2) {
            var list = res2.list;
            if (list.length > 0) {
                for (var j = 0; j < list.length; j++) {
                    html = ' <li class="swiper-slide productlistboxaaa">';
                    multipleproductnumber = list[j].length;
                    for (var i = 0; i < list[j].length; i++) {
                        html += '<div data-mindiscount="' + list[j][i].sv_p_mindiscount + '" data-minunitprice="' + list[j][i].sv_p_minunitprice + '" data-memberprice="' + list[j][i].sv_p_memberprice + '" class="textlistbox" data-id="' + list[j][i].sv_p_barcode + '"  data-prid="' + list[j][i].product_id + '" data-pricingmethod="' + list[j][i].sv_pricing_method + '" data-sv_p_commissiontype="' + (list[j][i].sv_p_commissiontype || "") + '" data-sv_p_commissionratio="' + (list[j][i].sv_p_commissionratio || "") + '" ';
                        html += '<a href="javascript:void(0);">';
                        html += ' <div class="teimg">';

                        if (list[j][i].sv_p_images != null && list[j][i].sv_p_images != '{}') {
                            var imagejson = $.parseJSON(list[j][i].sv_p_images);
                            if (imagejson && imagejson != null && imagejson.length > 0 && imagejson[0].code != '[]') {
                                if (imagejson[0].code.indexOf('[{') >= 0 && imagejson[0].code.indexOf('}]') > 0) {
                                    //子 格式{code: "[{"code": "[]", "isdefault": true}]", isdefault: true}
                                    var childimage = $.parseJSON(imagejson[0].code);
                                    if (childimage != null && childimage[0].code != '[]' && imagejson[0].code.indexOf('//') < 0) {
                                        html += '<img src="' + childimage[0].code + '" onerror="this.src=\'/images/omg1.jpg\';" >';
                                    } else {
                                        html += '<img src="" onerror="this.src=\'/images/omg1.jpg\';" >';
                                    }
                                } else {
                                    //格式 {code: "[]", isdefault: true}
                                    if (imagejson[0].code.indexOf('[{') < 0 && imagejson[0].code != "" && imagejson[0].code != null && imagejson[0].code.indexOf('//') < 0) {
                                        html += '<img src="' + imagejson[0].code + '" onerror="this.src=\'/images/omg1.jpg\';" >';
                                    } else {
                                        html += '<img src="" onerror="this.src=\'/images/omg1.jpg\';" >';
                                    }
                                }

                            } else {
                                html += '<img src="" onerror="this.src=\'/images/omg1.jpg\';" >';
                            }
                        } else {
                            html += '<img src="" onerror="this.src=\'/images/omg1.jpg\';" >';
                        }
                        //html += '<div class="teitext">';
                        //html += '<span>¥<text class="jiage" data-sv_p_originalprice="' + list[j][i].sv_p_originalprice + '">' + returnFloat(list[j][i].sv_p_unitprice) + '</text>元</span>';
                        //html += '<h3><text class="name"> ' + (list[j][i].sv_p_name == null ? "" : list[j][i].sv_p_name) + '</text></h3>';
                        //html += '</div>';
                        html += '</div><div class="teitext">';
                        var prodct_name = list[j][i].sv_p_name;
                        if (prodct_name != null && prodct_name != '' && prodct_name != undefined) {
                            if (prodct_name.length > 0) {
                                prodct_name = list[j][i].sv_p_name;
                            }
                        }
                        else {
                            prodct_name = "";
                        }
                        html += '<p class="productpicename"><span class="name"> ' + prodct_name + '</span></p>';
                        html += '<p class="productpice">¥<span class="jiage" data-sv_p_originalprice="' + list[j][i].sv_p_originalprice + '">' + returnFloat(list[j][i].sv_p_unitprice) + '</span>元</p>';
                        html += '</div></a></div> ';
                    }
                    html += ' </li>';
                    $("#productlist").append(html);
                    //商品图片高度
                    var teming = $('.teimg img').width();
                    $('.teimg img').height(teming);
                    if (nameFlag != "" && multipleproductnumber == 1) {
                        //检索是否按商品编码
                        //当检索结果唯一，自动添加至清单
                        //$("#productlist.swiper-wrapper li").eq(0).children(".textlistbox[data-id='" + nameFlag + "']").click();
                        //按条码检索到唯一结果，并且非商品条码，表示为秤码
                        if (_g_fast_query_isn && list[0][0] && _g_fast_query_isn.substring(2, 7) == list[0][0].sv_p_artno && $("#productlist.swiper-wrapper li").eq(0).children(".textlistbox[data-id='" + nameFlag + "']").length == 0) {
                            //读取总价/数量并添加
                            var str = "";
                            var minunitprice = parseFloat(list[0][0].sv_p_minunitprice) || 0;
                            var mindiscount = parseFloat(list[0][0].sv_p_mindiscount) || 0;
                            var memberprice = parseFloat(list[0][0].sv_p_memberprice) || 0;
                            var unitprice = parseFloat(list[0][0].sv_p_unitprice) || 0;
                            //保留2位小数
                            var _l_product_Total = (parseFloat(_g_fast_query_isn.substring(7, 12)) || 0) / 100;
                            var _l_product_weight = 0;
                            if (unitprice > 0) {
                                //条码打印，取销售价进行计算重量
                                _l_product_weight = parseFloat(_l_product_Total / unitprice).toFixed(2) || 0;
                            }

                            if (memberprice > 0) {
                                str = '<p class="nn4" style="color:red"><span class="fl">会员单价¥ <text class="memberprice">' + (memberprice).toFixed(2) + '</text></span></p>';
                            } else if (mindiscount > 0) {
                                str = '<p class="nn4" style="color:red"><span class="fl">最低折扣 <text class="mindiscount">' + (mindiscount * 10).toFixed(2) + '</text>%</span></p>';
                            } else if (minunitprice > 0) {
                                str = '<p class="nn4" style="color:red"><span class="fl">最低单价¥ <text class="minunitprice">' + (minunitprice).toFixed(2) + '</text></span></p>';
                            }

                            if (_l_product_Total > 0) {
                                //新增为
                                if ($("#" + list[0][0].product_id).length == 0 || true) {
                                    var cashlefsitHtml = '<li data-mindiscount="' + mindiscount + '" data-minunitprice="' + parseFloat(minunitprice).toFixed(2) + '" ';
                                    cashlefsitHtml += 'data-memberprice="' + parseFloat(memberprice).toFixed(2) + '" id="' + list[0][0].product_id + '" data-pricingmethod="' + 1 + '" data-sv_p_commissiontype="' + (list[0][0].sv_p_commissiontype || "") + '" data-sv_p_commissionratio="' + (list[0][0].sv_p_commissionratio || "") + '"><div class="naelfe">' + osd + '';
                                    cashlefsitHtml += '</div> <div class="naerigh"><p class="nn1">' + list[0][0].sv_p_name + '</p><p class="nn2"><span class="fl">';
                                    cashlefsitHtml += '' + list[0][0].product_id + '</span><span class="fr">数量 <text class="nump" data-cnum="0">' + _l_product_weight + '</text></span></p> <p class="nn3">';
                                    cashlefsitHtml += '<span class="fl">¥<text class="jiage" data-rjia="' + parseFloat(unitprice) + '"> ';
                                    cashlefsitHtml += '' + parseFloat(unitprice).toFixed(2) + '</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" ';
                                    cashlefsitHtml += 'data-sv_p_originalprice="' + parseFloat(unitprice).toFixed(2) + '"> ';
                                    cashlefsitHtml += '' + (unitprice * _l_product_weight).toFixed(2) + '</span></p>' + str + '</div> </li>';
                                    $("#Cashlefsit").prepend(cashlefsitHtml);
                                }
                                $("#queryproduct").val("");
                                zhonger();
                                queryProductFocus();
                            }
                        } else {
                            //默认添加单件商品
                            $("#productlist.swiper-wrapper li").eq(0).children(".textlistbox").click();
                        }
                    }
                    _key_input_time_flag = true;
                    mySwiper.updateSlidesSize();
                    mySwiper.slideTo(0);
                }
            } else {
                layer.msg("找不到相关产品");
                return;
            }
        }
    });
}

function returnFloat(value) {
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
        if (xsd[1].length < 2) {
            value = value.toString() + "0";
        }
        return value;
    }
}

function clearNoNum(obj, strid) {
    obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
    obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是.
    obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
    CalculateGiving_topup(strid);
    // obj.value = returnFloat(obj.value);
}
function verifyenable(id) {
    $.ajax({
        url: "/System/VerifyEnable?name=" + id + "&userid=" + $("#userid").val(),
        dataType: "json",
        async: true,
        success: function (data) {
            if (data == 1) {
                jiesuan($("#xianjinname").text());
                return false;
            }
            else if (data == 2) {
                layer.msg("会员信息错误！");
                return false;
            }
            else if (data == 3) {
                Deke.DeKe_dialog.show_Url2("请输入会员密码", "/html/cash/huiyuanpwd.html?v=215", baochuuserpwd, ['', '230px']);
            }
        }
    });
}

function baochuuserpwd() {
    $("#member_id").val($('#huiyuan_id').attr('data-id'));
    $("#sv_mr_pwd").focus();

    $("#baochuuser").click(function () {
        $.post("/System/VerifyEnable", { name: $("#member_id").val(), valu: $("#sv_mr_pwd").val(), userid: $("#userid").val() }, function (data) {
            if (data == 1) {
                jiesuan($("#xianjinname").text())
                layer.close(index);
                return false;
            }
            else if (data == 4) {
                layer.msg("会员密码输入有误");
                $("#sv_mr_pwd").val("");
            }
        });
    });
    $("#sv_mr_pwd").keypress(function (event) {
        if (event.which == 13) {
            $.post("/System/VerifyEnable", { name: $("#member_id").val(), valu: $("#sv_mr_pwd").val(), userid: $("#userid").val() }, function (data) {
                if (data == 1) {
                    jiesuan($("#xianjinname").text(), 1)
                    layer.close(index);
                    return false;
                }
                else if (data == 4) {
                    layer.msg("会员密码输入有误");
                }
            });
        }
    });

}

// 拼接订单json
function orderlistJson() {
    GetEmployessid();
    productlist = '';
    productlist += '[';
    $("#Cashlefsit > li").each(function () {
        //折扣处理
        var descount = 0;
        var origprice = 0;
        var newdescount = 0;
        var product_orig_discount = 0;
        var member_id = $('#huiyuan_id').attr('data-id'); // 会员Id
        //alert($(this).find(".zhong").data("zhekou"));
        if (parseFloat(_member_discount) != 1 && $(this).attr("id") > 0) {
            var number = $(this).find(".nump").text();//数量
            descount = (parseFloat(_member_discount) / 100);
            product_orig_discount = descount;
            var origprice = parseFloat($(this).find(".jiage").text());//原商品单价
            //-----------------------------会员售价，最低折扣，最低售价

            if (member_id != null && member_id != '' && member_id != '0' && member_id != undefined) {
                //最低价计算
                var minprice = parseFloat($(this).data("minunitprice"));
                //最低总价=最低价*数量
                var mintotalprice = parseFloat(minprice * number);
                //最低折扣价计算
                var mindiscount = parseFloat($(this).data("mindiscount")) / 10;
                //原总价=原单价*数量*会员折扣
                origtotalprice = parseFloat(origprice * number * descount);
                //会员价计算
                var memberprice = parseFloat($(this).data("memberprice"));
                if (memberprice > 0) {
                    //会员价商品
                    origprice = memberprice;
                    descount = 1;
                } else if (mindiscount > 0 && descount < mindiscount) {
                    //最低折扣商品：会员折扣小于最低折扣
                    descount = mindiscount;
                } else if (minprice > 0 && origtotalprice < mintotalprice) {
                    ///最低价商品：最低价计算 会员价小于最低价
                    origprice = minprice;
                    descount = 1;
                }
                //--------------------------
                origprice = parseFloat(origprice * descount);
            }
        } else {
            if ($(this).attr("id") == 0 && parseFloat(_member_discount) != 1) {
                origprice = parseFloat($(this).find(".jiage").text() * (parseFloat(_member_discount) / 100));

            } else {
                origprice = parseFloat($(this).find(".jiage").text());
            }
        }
        productlist += '{"product_id":' + $(this).attr("id") + ',"product_name":"' + replaceStr($(this).find(".nn1").text(), "''") + '","product_num":' + $(this).find(".nump").text() + ',"product_unitprice":' + origprice + ',"product_discount":' + descount + ',"product_total":' + origprice * parseFloat($(this).find(".nump").text()) + ',"product_pleased":' + $(this).find(".zhong").data("sv_p_originalprice") + ',"type":' + $(this).hasClass("product_type") + ',"cnum":' + $(this).find(".nump").data("cnum") + ',"product_orig_discount":' + product_orig_discount + ', "sv_commissionemployes":"' + StrEmployeelId + '","sv_pricing_method":' + $(this).attr("data-pricingmethod") + ',"sv_p_commissiontype":"' + ($(this).attr("data-sv_p_commissiontype") || 0) + '","sv_p_commissionratio":"' + ($(this).attr("data-sv_p_commissionratio") || "") + '"},';

    });
    productlist = productlist.substring(0, productlist.length - 1);

    productlist += "]";
    // $("body").append();z
    productlist = JSON.parse(productlist);
}
/*字符串替换*/
function replaceStr(str, targetstr) {
    str = str.replace(/'/ig, targetstr);
    return str;
}

// 结算
function jiesuan(xianjinname, j) {


    var money = $("#yinshou").val();
    var daishou = $('#daishou').val();
    var orderMoney = $('#xianjin').val();
    var order_payment = $("#xianjinname").text();
    var totalAmount = $("#jieshuajie").text();
    var givingtype = $("#sv_user_givingtype").val();
    var deserved = $("#sv_sumobtain_value").val();
    orderlistJson();
    var cm = true;
    //if ($("#Cashlefsit li:not('.product_type')").length > 0) {}
    var payment2 = $("#daoshouname").text(); // 组合支付中的第二种方式 判断.text是否为微信支付，或者支付宝支付、扫码支付
    var _order_remark = $('#order_remark').val().trim();
    if (payment2 == '待收') {
        if (parseFloat(money) > parseFloat(orderMoney) && parseFloat(daishou) > 0) {
            layer.msg('请检查当前待收金额和实收金额是否正确！');
            $("#yinshou").focus();
            return;
        }
    }

    if (_order_remark.indexOf("'") > 0) {
        //特殊字符串过滤：'
        _order_remark = _order_remark.replace("'", "''");
    }
    var user_cardno = "0";
    if ($('#huiyuan_id').attr('data-id') != null && $('#huiyuan_id').attr('data-id') != '' && !$('#huiyuan_id').attr('data-id') != undefined) {
        user_cardno = $('#huiyuan_id').attr('data-id');
    }
    if (!isNullOrWhiteSpace($("#danhao").text())) { // 流水号不存在情况重新获取流水号
        shuxin();
    }
    var data2 = {
        "prlist": productlist,
        "order_running_id": $("#danhao").text(),
        "order_receivable": $("#yinshou").val(),
        "order_payment": $("#xianjinname").text(),
        "order_money": $("#xianjin").val(),
        "order_payment2": $("#daoshouname").text(),
        "order_money2": $("#daishou").val(),
        "order_change": $("#yinshou").val(),
        "user_cardno": user_cardno,
        "order_discount": (parseFloat($("#ttuser_descount").val()) / 100).toFixed(5),
        "order_receivabley": $("#yinshou").data("val"),
        "sv_remarks": _order_remark,
        "givingtype": givingtype,
        "deserved": deserved,
        sv_recommended_peopleid: $("#sv_recommended_peopleid").val(),
        free_change: $('#jieshuaanniu').attr("freechange"),
        sv_member_discount: (parseFloat($("#user_descount").text()) / 100).toFixed(2),
        sv_member_total_money: parseFloat($('#jieshuajie2').text()),
        sv_order_total_money: parseFloat($('#jieshuajie').text()),
        sv_give_change: parseFloat($('#zhaoling').val())
    };
    var printflat = $(".biglis").hasClass("open");
    //现金、储值卡支付
    if ((xianjinname == '微信支付' || payment2 == '微信支付') && sv_enable_wechatpay == true) {
        layer.closeAll('loading');
        if (payment2 == '微信支付' && isNullOrWhiteSpace(daishou) && parseFloat(daishou) <= 0) {
            layer.msg('微信支付金额必须大于0');
            return;
        }
        weChatPay(); // 微信二维码支付
    }
    else if (xianjinname == '扫码支付' || payment2 == '扫码支付') {
        layer.closeAll('loading');
        if (payment2 == '扫码支付' && isNullOrWhiteSpace(daishou) && parseFloat(daishou) <= 0) {
            layer.msg('扫码支付支付金额必须大于0');
            return;
        }
        Deke.DeKe_dialog.show_Url2("扫码支付", "/html/cash/barCodePay.html?v=250", barCodePay, ['550px', '380px']);         // 微信或支付宝扫码支付
    }
    else if ((xianjinname == '支付宝' || payment2 == '支付宝') && sv_enable_alipay == true) {
        layer.closeAll('loading');
        if (payment2 == '支付宝' && isNullOrWhiteSpace(daishou) && parseFloat(daishou) <= 0) {
            layer.msg('支付宝支付金额必须大于0');
            return;
        }
        alliPay(); // 支付宝扫码支付
    }
    else {
        var loadIndex = layer.msg("正在提交数据请稍后...", { icon: 16, shade: 0.01, time: 0 });
        disableButton("jieshuaanniu");
        if (j == 1 || $("#Cashlefsit li:not('.product_type')").length == 0) {
            $.ajax({
                url: '/settle/Post_settle',
                type: 'post',
                data: JSON.stringify(data2),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    enabledButton("jieshuaanniu");
                    layer.close(loadIndex);
                    if (data.bl) {
                        shuxin();
                        $("#Cashlefsit").html("");
                        zhonger();
                        layer.closeAll();
                        layer.open({
                            type: 1,
                            area: ['300px', '200px'],
                            shadeClose: false,
                            content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                            time: '1500',
                        })
                        $(".layui-layer").css({
                            borderRadius: 5,
                        });
                        $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                        //读取配置
                        if (printflat) {
                            data2["user"] = data.user;
                            $.getJSON("/system/Getprint", function (data) {
                                pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                            });
                        }
                        $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
                        $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                        $("#user_descount").text("100");
                        _member_discount = 100;
                        _cache_memberinfo_json = null;
                        queryProductFocus();
                    }
                    else {
                        layer.msg("操作失败！");
                    }
                }
            });
        }
        else {
            disableButton("jieshuaanniu");
            $.ajax({
                url: '/settle/Post_settle',
                type: 'post',
                data: JSON.stringify(data2),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    enabledButton("jieshuaanniu");
                    if (data.bl) {
                        shuxin();
                        $("#Cashlefsit").html("");
                        zhonger();
                        layer.closeAll();
                        //layer.msg("结算成功！");
                        layer.open({
                            type: 1,
                            area: ['300px', '200px'],
                            shadeClose: false,
                            content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                            time: '1500',
                        })
                        $(".layui-layer").css({
                            borderRadius: 5,
                        });
                        $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                        //读取配置
                        if (printflat) {
                            data2["user"] = data.user;
                            $.getJSON("/system/Getprint", function (data) {
                                pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                            });
                        }
                        $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
                        $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                        $("#user_descount").text("100");
                        _member_discount = 100;
                        _cache_memberinfo_json = null;
                        queryProductFocus();
                    }
                    else {
                        layer.msg("操作失败！");
                    }
                }
            });
        }
    }
}

// 微信二维码支付
function weChatPay() {
    var money = $("#yinshou").val();
    orderlistJson();// 拼接订单json
    var printflat = $(".biglis").hasClass("open");
    var order_payment = $("#xianjinname").text();
    var totalAmount = $("#jieshuajie").text();
    var givingtype = $("#sv_user_givingtype").val();
    var deserved = $("#sv_sumobtain_value").val();
    var orderTime = 0;
    var user_cardno = "0";
    if ($('#huiyuan_id').attr('data-id') != null && $('#huiyuan_id').attr('data-id') != '' && !$('#huiyuan_id').attr('data-id') != undefined) {
        user_cardno = $('#huiyuan_id').attr('data-id');
    }
    // 切换为扫码支付
    var data2 = {
        "prlist": productlist,
        "order_running_id": $("#danhao").text(),
        "order_receivable": $("#yinshou").val(),
        "order_payment": $("#xianjinname").text(),
        "order_money": $("#xianjin").val(),
        "order_payment2": $("#daoshouname").text(),
        "order_money2": $("#daishou").val(),
        "order_change": $("#yinshou").val(),
        "user_cardno": user_cardno,
        "order_discount": (parseFloat($("#ttuser_descount").val()) / 100).toFixed(5),
        "order_receivabley": $("#yinshou").data("val"),
        "type": "scan",
        "authcode": "",
        "givingtype": givingtype,
        "deserved": deserved,
        sv_member_discount: (parseFloat($("#user_descount").text()) / 100).toFixed(2),
        sv_member_total_money: parseFloat($('#jieshuajie2').text()),
        sv_order_total_money: parseFloat($('#jieshuajie').text()),
        sv_give_change: parseFloat($('#zhaoling').val())
    };
    disableButton("jieshuaanniu");
    $.ajax({
        url: '/settle/WeChatPay',
        type: 'post',
        data: JSON.stringify(data2),
        contentType: 'application/json',
        async: false,
        success: function (data) {
            enabledButton("jieshuaanniu");
            if (data.succeed == true) {
                _g_wechatPayNumber = data.errmsg;
                var scanPay = "<div id=\"wechatPayImgShow\" data-value=\"true\" class=\"wxsaosao\"><img src=\"/images/WePayLogo.png\" width=\"100\" class=\"kkimg\"><img src=" + data.values + " width=\"200\" class=\"bbimg\"></div>";
                layer.open({
                    type: 1,
                    title: "微信扫一扫支付",
                    area: ['420px', '440px'],
                    content: scanPay
                });
                var wechatPayImgShow = $('#wechatPayImgShow').attr('data-value');
                var iCount = setInterval(function () {
                    orderTime += 3;
                    if (orderTime <= 600 && wechatPayImgShow) {
                        wechatPayImgShow = $('#wechatPayImgShow').attr('data-value');
                        $.getJSON("/settle/GetPaymentResult?orderNumber=" + _g_wechatPayNumber, function (_data) {
                            if (_data.succeed == true) {
                                clearInterval(iCount);
                                //alert("支付成功");
								layer.closeAll();
                                layer.open({
                                    type: 1,
                                    area: ['300px', '200px'],
                                    shadeClose: false,
                                    content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                                    time: '1500',
                                });
                                if (printflat) {
                                    data2["user"] = _data.values.user;
                                    $.getJSON("/system/Getprint", function (data) {
                                        pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                                    });
                                }
                                $(".layui-layer").css({
                                    borderRadius: 5,
                                });
                                $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");

                                $("#huiyuan_id").text("").data("id", "0").data("jiekou", "100");
                                $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                                $("#user_descount").text("100");
                                _member_discount = 100;
                                queryProductFocus();
                                _cache_memberinfo_json = null;
                                layer.closeAll();
                            }
                        });
                    }
                    else {
                        clearInterval(iCount);
                        alert("您的订单已过期失效！");
                        location.reload();
                    }
                }, 3000);
            }
            else {
                $("#wxauthcode").val("");
                layer.closeAll('loading');
                layer.msg(data.errmsg);
                layer.confirm("发起微信支付失败，是否需要继续交易?", { btn: ["确认", "取消"] }, function () {
                    disableButton("jieshuaanniu");
                    $.ajax({
                        url: '/settle/Post_settle',
                        type: 'post',
                        data: JSON.stringify(data2),
                        contentType: 'application/json',
                        async: false,
                        success: function (data) {
                            enabledButton("jieshuaanniu");
                            if (data.bl) {
                                shuxin();
                                $("#Cashlefsit").html("");
                                zhonger();
                                layer.closeAll();
                                //layer.msg("结算成功！");
                                layer.open({
                                    type: 1,
                                    area: ['300px', '200px'],
                                    shadeClose: false,
                                    content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                                    time: '1500',
                                });
                                $(".layui-layer").css({
                                    borderRadius: 5,
                                });
                                $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                                //读取配置
                                if (printflat) {
                                    data2["user"] = data.user;
                                    $.getJSON("/system/Getprint", function (data) {
                                        pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                                    });
                                }
                                $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
                                $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                                $("#user_descount").text("100");
                                _member_discount = 100;
                                _cache_memberinfo_json = null;
                                queryProductFocus();
                            }
                            else {
                                layer.close(i2);
                                layer.msg("操作失败！");
                            }
                        }
                    });
                });
            }
        }
    });
}

// 微信或支付宝扫码支付
function barCodePay() {
    var orderTime = 0;
    $('#authcode').focus();
    var iCount;
    $('#authcode').keypress(function (event) {
        var authcode = $(this).val().trim();
        if (event.keyCode == 13) {
            wxauthcode_waitfor = false;
            wxauthcode_isSuccess = false;
            if (authcode != null && authcode != undefined && authcode != '' && authcode.length > 10) {
                if (wxauthcode_isSuccess) {
                    wxauthcode_isSuccess = false;
                    clearInterval(iCount);
                }
                else if (!wxauthcode_waitfor && !wxauthcode_isSuccess) {
                    authcode_pay();
                    if (wxauthcode_waitfor) {
                        setTimeout(function () {
                            iCount = setInterval(function () {
                                var isShowbarCodePayWindows = $('#isShowbarCodePayWindows').val();
                                if (isShowbarCodePayWindows) {
                                    orderTime += 3;
                                    if (orderTime <= 200) {
                                        authcode_pay();
                                    }
                                    else {
                                        clearInterval(iCount);
                                        $('#errorMsg').html("您的订单已过期失效！");
                                        $('#authcode').removeAttr("disabled");
                                        $('#authcode').val('');
                                    }
                                }
                                else {
                                    clearInterval(iCount);
                                }
                            }, 1000);
                        }, 1000);
                    }
                }
            }
            else {
                $('#errorMsg').html("请填写正确的支付码！");
            }
        }
    });
}

// 微信或支付宝扫码支付方法
function authcode_pay() {
    $('#authcode').attr("disabled", "disabled");
    var totalAmount = $("#jieshuajie").text();
    var givingtype = $("#sv_user_givingtype").val();
    var deserved = $("#sv_sumobtain_value").val();
    var printflat = $(".biglis").hasClass("open");
    var user_cardno = "0";
    var totalOrderMoney = $("#yinshou").val();
    if ($('#huiyuan_id').attr('data-id') != null && $('#huiyuan_id').attr('data-id') != '' && !$('#huiyuan_id').attr('data-id') != undefined) {
        user_cardno = $('#huiyuan_id').attr('data-id');
    }
    var data2 = {
        "prlist": productlist,
        "order_running_id": $("#danhao").text(),
        "order_receivable": $("#yinshou").val(),
        "order_payment": $("#xianjinname").text(),
        "order_money": $("#xianjin").val(),
        "order_payment2": $("#daoshouname").text(),
        "order_money2": $("#daishou").val(),
        "order_change": $("#yinshou").val(),
        "user_cardno": user_cardno,
        "order_discount": (parseFloat($("#ttuser_descount").val()) / 100).toFixed(5),
        "order_receivabley": $("#yinshou").data("val"),
        "type": "", "authcode": $('#authcode').val().trim(),
        "givingtype": givingtype,
        "deserved": deserved,
        sv_member_discount: (parseFloat($("#user_descount").text()) / 100).toFixed(2),
        sv_member_total_money: parseFloat($('#jieshuajie2').text()),
        sv_order_total_money: parseFloat($('#jieshuajie').text()),
        sv_give_change: parseFloat($('#zhaoling').val())
    };
    disableButton("jieshuaanniu");
    $.ajax({
        url: '/settle/BarCodePay',
        type: 'post',
        data: JSON.stringify(data2),
        contentType: 'application/json',
        async: false,
        success: function (_data) {
            enabledButton("jieshuaanniu");
            if (_data.succeed == true) {
                wxauthcode_isSuccess = true;
                wxauthcode_waitfor = false; // 不需要等待密码输入
                $('#authcode').removeAttr("disabled");
                shuxin();
                $("#Cashlefsit").html("");
                zhonger();
                $("#wxauthcode").val("");
                layer.closeAll();
                layer.open({
                    type: 1,
                    area: ['300px', '200px'],
                    shadeClose: false,
                    content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + totalOrderMoney + '</p><p>结算 交易成功 </p>\<\/div>',
                    time: '1500',
                });
                //读取配置
                if (printflat) {
                    data2["user"] = _data.values.user;
                    $.getJSON("/system/Getprint", function (data) {
                        pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                    });
                }
                $("#huiyuan_id").text("").data("id", "0").data("jiekou", "100");
                $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                $("#user_descount").text("100");
                _member_discount = 100;
                _cache_memberinfo_json = null;
                queryProductFocus();
                //setTimeout(function () {
                //    window.location.href = "/home/index2";
                //}, 2000);
            }
            else {
                $("#wxauthcode").val("");
                layer.closeAll('loading');
                if (_data.errmsg == "需要用户输入支付密码") {
                    wxauthcode_waitfor = true;
                    $('#errorMsg').html("正在等待用户输入密码！");
                }
                else {
                    $('#authcode').removeAttr("disabled");
                    wxauthcode_waitfor = false;
                    $('#errorMsg').html(_data.errmsg);
                }
            }
        }
    });
}

// 支付宝二维码支付
function alliPay() {
    orderlistJson();
    var money = $("#yinshou").val();
    var printflat = $(".biglis").hasClass("open");
    var order_payment = $("#xianjinname").text();
    var totalAmount = $("#jieshuajie").text();
    var givingtype = $("#sv_user_givingtype").val();
    var deserved = $("#sv_sumobtain_value").val();
    var orderTime = 0;
    var user_cardno = "0";
    if ($('#huiyuan_id').attr('data-id') != null && $('#huiyuan_id').attr('data-id') != '' && !$('#huiyuan_id').attr('data-id') != undefined) {
        user_cardno = $('#huiyuan_id').attr('data-id');
    }
    var data2 = {
        "prlist": productlist, "order_running_id": $("#danhao").text(),
        "order_receivable": $("#yinshou").val(), "order_payment": $("#xianjinname").text(),
        "order_money": $("#xianjin").val(), "order_payment2": $("#daoshouname").text(),
        "order_money2": $("#daishou").val(), "order_change": $("#yinshou").val(),
        "user_cardno": user_cardno, "order_discount": (parseFloat($("#ttuser_descount").val()) / 100).toFixed(5),
        "order_receivabley": $("#yinshou").data("val"), "type": "scan", "authcode": "",
        "givingtype": givingtype, "deserved": deserved,
        sv_member_discount: (parseFloat($("#user_descount").text()) / 100).toFixed(2),
        sv_member_total_money: parseFloat($('#jieshuajie2').text()),
        sv_order_total_money: parseFloat($('#jieshuajie').text()),
        sv_give_change: parseFloat($('#zhaoling').val())
    };
    disableButton("jieshuaanniu");
    $.ajax({
        url: '/settle/AliBarCodePay',
        type: 'post',
        data: JSON.stringify(data2),
        contentType: 'application/json',
        async: false,
        success: function (data) {
            enabledButton("jieshuaanniu");
            if (data.succeed == true && isNullOrWhiteSpace(data.values)) {
                var scanPay = "<div id=\"aliPayImgShow\" data-value=\"true\" class=\"wxsaosao\"><img src=\"/images/alipaylogo.png\" width=\"100\" class=\"kkimg\"><img src=" + data.values + " width=\"200\" class=\"bbimg\"></div>";
                layer.open({
                    type: 1,
                    title: "支付宝扫一扫支付",
                    area: ['420px', '440px'],
                    content: scanPay
                });
                var aliPayImgShow = $('#aliPayImgShow').attr('data-value');
                setTimeout(function () {
                    var iCount = setInterval(function () {
                        orderTime += 3;
                        if (orderTime <= 600 && aliPayImgShow) {
                            aliPayImgShow = $('#aliPayImgShow').attr('data-value');
                            $.getAsyncJson("/settle/GetPaymentResult?orderNumber=" + data.errmsg, null, function (_data) {
                                if (_data.succeed == true) {
                                    clearInterval(iCount);
                                    //alert("支付成功");
									layer.closeAll();
                                    layer.open({
                                        type: 1,
                                        area: ['300px', '200px'],
                                        shadeClose: false,
                                        content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                                        time: '1500',
                                    });
                                    if (printflat) {
                                        data2["user"] = _data.values.user;
                                        $.getJSON("/system/Getprint", function (data) {
                                            pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                                        });
                                    }
                                    $(".layui-layer").css({
                                        borderRadius: 5,
                                    });
                                    $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                                    $("#huiyuan_id").text("").data("id", "0").data("jiekou", "100");
                                    $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                                    $("#user_descount").text("100");
                                    _member_discount = 100;
                                    queryProductFocus();
                                    _cache_memberinfo_json = null;
                                    layer.closeAll();
                                }
                            });
                        }
                        else {
                            clearInterval(iCount);
                            alert("您的订单已过期失效！");
                            location.reload();
                        }
                    }, 3000);
                }, 2000);
            }
            else {
                $("#wxauthcode").val("");
                layer.closeAll('loading');
                layer.msg(data.errmsg);

                layer.confirm("发起支付宝支付失败，是否需要继续交易?", { btn: ["确认", "取消"] }, function () {
                    disableButton("jieshuaanniu");
                    $.ajax({
                        url: '/settle/Post_settle',
                        type: 'post',
                        data: JSON.stringify(data2),
                        contentType: 'application/json',
                        async: false,
                        success: function (data) {
                            enabledButton("jieshuaanniu");
                            if (data.bl) {
                                shuxin();
                                $("#Cashlefsit").html("");
                                zhonger();
                                layer.closeAll();
                                //layer.msg("结算成功！");
                                layer.open({
                                    type: 1,
                                    area: ['300px', '200px'],
                                    shadeClose: false,
                                    content: '\<\div class="box-center"><div class="success-bg"></div><p id="success-money">￥' + money + '</p><p>' + order_payment + '结算 交易成功 </p>\<\/div>',
                                    time: '1500',
                                })
                                $(".layui-layer").css({
                                    borderRadius: 5,
                                });
                                $(".layui-layer-title, .layui-layer-setwin, .layui-layer-shade").css("display", "none");
                                //读取配置
                                if (printflat) {
                                    data2["user"] = data.user;
                                    $.getJSON("/system/Getprint", function (data) {
                                        pushprintData(JSON.stringify(data2), JSON.stringify(data), 0, totalAmount, deserved, givingtype);
                                    });
                                }
                                $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
                                $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
                                $("#user_descount").text("100");
                                _cache_memberinfo_json = null;
                                _member_discount = 100;
                                queryProductFocus();
                            }
                            else {
                                layer.close(i2);
                                layer.msg("操作失败！");
                            }
                        }
                    });
                });
            }
        }
    });
}
//添加无码
function nocodingAdd() {
    $("#nocoding").click(function () {
        var nocodingCash = parseFloat($("#queryproduct").val().replace(/\ +/g, "") || 0);
        if (nocodingCash > 0 && nocodingCash < 100001) {
            if ($(".nocoding_" + nocodingCash).length == 0) {
                $("#Cashlefsit").prepend('<li data-mindiscount=0"' + '" data-minunitprice=0  data-memberprice=0  id=0  data-pricingmethod="0" class=nocoding_' + nocodingCash + '><div class="naerigh"><p class="nn1">无码收银</p><p class="nn2"><span class="fl"></span><span class="fr">数量 <text class="nump" data-cnum="0">1</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="' + returnFloat(nocodingCash) + '"> ' + returnFloat(nocodingCash) + '</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="' + nocodingCash + '"> ' + returnFloat(nocodingCash) + '</span></p></div> </li>');
                osd++;
            } else {
                $(".nocoding_" + nocodingCash).find(".nump").text(parseInt($(".nocoding_" + nocodingCash).find(".nump").text()) + 1);
                var number = !isNullOrWhiteSpace($(".nocoding_" + nocodingCash).find(".nump").text()) ? 1 : parseFloat($(".nocoding_" + nocodingCash).find(".nump").text());
                jiagesss = returnFloat(Math.round(parseFloat(number) * parseFloat($(".nocoding_" + nocodingCash).find(".jiage").text()) * 100) / 100);
                $(".nocoding_" + nocodingCash).find(".zhong").text(jiagesss);
            }
            $("#queryproduct").val("");
            zhonger();
            $("#nocoding").addClass("disabled");
            queryProductFocus();
        } else {
            layer.msg("无码现金收银金额金额不能超过100000！");
            $("#nocoding").addClass("disabled");
        }
    });
}

//获取员工信息页面
function getEmployessinfohtml() {
    $.ajax({
        url: '/Html/system/EmployeesInfo.html',
        type: 'get',
        async: false,
        success: function (data) {
            //$("#shoyin2").parent().width($("#shoyin2").parent().width() + 110);
            //$("#operatingMember").html(data);
            //$(".Employeelist").attr("style", "max-height:" + $("#shoyin2").height() + "px;overflow:overlay");
            setTimeout(function () {
                OpenEmployessinfo();
            }, 200);
        }
    });
}
//本地提成员工信息
var _g_employee_list = [];

//打开员工信息
function OpenEmployessinfo() {
    //获取员工信息
    var html = '';
    var list_employee_name = '';
    if (_g_employee_list && _g_employee_list.length > 0) {
        cashDisplayEmployeeInfo(_g_employee_list);
    } else {
        $.getJson("/Employee/GetEmployeePageList/", null, function (data) {
            cashDisplayEmployeeInfo(data);
        });
    }
    //结算选择操作员的按钮
    $('#operatingMember li').click(function () {
        $(this).toggleClass("active");
    });
}

function cashDisplayEmployeeInfo(data) {
    var html = '';
    var list_employee_name = '';
    if (data != null) {
        //缓存数据
        _g_employee_list = data;
        for (var i = 0; i < data.length; i++) {
            if (i % 2 == 0) {
                html += '<li data-employee_id="' + data[i].sv_employee_id + '" data-configtype="' + data[i].sv_configtype + '" data-employee_name="' + data[i].sv_employee_name + '">';
            }
            else { html += '<li data-employee_id="' + data[i].sv_employee_id + '" data-configtype="' + data[i].sv_configtype + '" data-employee_name="' + data[i].sv_employee_name + '">'; }
            // html += '<a href="#" >';
            html += '<div class="operatinguserphoto"><img src="/images/001.png"  onerror="javascript:this.src ="/images/001.png";"/>';//后期替换头像
            if (data[i].sv_employee_name.length > 4) {
                var lengthName = data[i].sv_employee_name;
                list_employee_name = lengthName.substring(0, 4) + '..';
            } else {
                list_employee_name = data[i].sv_employee_name;
            }

            html += '</div><p class="operatingusername">' + list_employee_name + '</p><i></i></li>';
        }
    }
    else {
        html = '';
    }
    if (isNullOrWhiteSpace(html)) {
        $("#operatingMember").html(html);
    } else {
        $("#play-settlement-box").parent().width($("#play-settlement-box").parent().width() - 110);
    }
}




//获取选中的员工id
function GetEmployessid() {
    StrEmployeelId = "";
    $("#operatingMember li").each(function () {
        if ($(this).hasClass("active")) {
            StrEmployeelId += $(this).data("employee_id") + ",";
        }
    })
    if (StrEmployeelId != "") {
        StrEmployeelId = StrEmployeelId.replace(/,$/gi, "");
    }
}
//移除过期充次产品
function DeleteOverdue(strtid) {
    overdue_userecord_id = overdue_userecord_id.replace(strtid, "");
    $("#" + strtid).remove();
    $("#Overdue_tr_" + strtid).remove();
    overdue_userecord_id = overdue_userecord_id.replace(/^,*|,*$/g, '');//去首尾
};

//启用充次方法
function chsaisi2(id, pid, pname, user_id) {
    var str_Is_open_commission = Is_open_commission == false ? 0 : 1;
    user_id = user_id || $("#userid").val();
    id = id || $("#sv_mr_cardno").val();
    layer.open({
        type: 2,
        title: '会员管理',
        shadeClose: true,
        shade: 0.8,
        area: ['80%', '90%'],
        content: '/member/acharge/?x=1#' + id + "@" + pid + "@" + pname + "@" + str_Is_open_commission + "@" + user_id//iframe的url
    });
}

//根据等级获取对应的配置值
function GetConfigdataBylevel(memberlevel) {
    configleveldata = [];
    if (Preferential_TopUpGiving_ConfigList != null) {
        var ConfigList = Preferential_TopUpGiving_ConfigList
        for (var i = 0; i < ConfigList.length; i++) {
            if (ConfigList[i].sv_user_leveltype_id == memberlevel) {
                configleveldata.push(ConfigList[i]);
            }
        }
    }
}

//计算赠送（消费）
function CalculateGiving() {
    var proportionalue = 0;
    var deserved = 0;
    var givingtype = 0;
    var yinshou = parseFloat($("#yinshou").val() || 0);
    if (configleveldata != "" && configleveldata.length > 0) {
        for (var i = 0; i < configleveldata.length; i++) {
            if (configleveldata[i].sv_detali_proportionalue <= yinshou
                && proportionalue <= configleveldata[i].sv_detali_proportionalue
                && configleveldata[i].sv_detail_is_enable) {
                proportionalue = configleveldata[i].sv_detali_proportionalue;
                deserved = parseInt(configleveldata[i].sv_detail_value);
                givingtype = configleveldata[i].sv_user_givingtype
                $("#sv_user_givingtype").val(givingtype); // 写入隐藏域 ，赠送类型（1 赠送积分，2赠送金额）
                $("#sv_sumobtain_value").val(deserved); // 写入隐藏域 ，赠送金额或积
                if (deserved > 0) {
                    var strRemark = "";
                    $("#Stored_Giving_Remark").show();
                    if (givingtype == 1) {
                        strRemark = "*应收" + yinshou + "元,活动消费满" + proportionalue + "元赠送" + deserved + (givingtype == 1 ? "积分" : "元储值现金")
                    }
                    if (givingtype == 2) {
                        strRemark = "*应收" + yinshou + "元,活动消费满" + proportionalue + "元立减" + deserved + (givingtype == 1 ? "积分" : "元现金")
                    }
                    $("#StoredRemark").text(strRemark);
                } else {
                    $("#Stored_Giving_Remark").hide();
                }

            }
        }
    } else {
        $("#Stored_Giving_Remark").hide();
        $("#sv_user_givingtype").val(0);
        $("#sv_sumobtain_value").val(0);
    }
    if (givingtype == 2) {
        yinshou = yinshou - deserved;
    }

    $("#yinshou").val(yinshou.toFixed(2));
    $("#xianjin").val(yinshou.toFixed(2));
    // 计算优惠后的折扣
    var receivable = $("#jieshuajie2").text();
    if (receivable != null && receivable != undefined && receivable != '' && receivable > 0) {
        receivable = parseFloat(receivable);
        var jiekou = parseFloat($("#yinshou").val() || 0) / receivable;
        $("#ttuser_descount").val((jiekou * 100).toFixed(2));
    }
}

//计算赠送（充值）
function CalculateGiving_topup(strobj) {
    var sv_mrr_amountbefore = parseFloat($("#sv_mrr_amountbefore").val() || 0);
    var deserved = 0;
    var detail_value = 0;
    var givingtype = 0;
    if (configleveldata != "" && configleveldata.length > 0) {
        for (var i = 0; i < configleveldata.length; i++) {
            if (configleveldata[i].sv_detail_is_enable) {
                var proportionalue = configleveldata[i].sv_detali_proportionalue;
                if (proportionalue <= sv_mrr_amountbefore) {
                    detail_value = parseInt(configleveldata[i].sv_detail_value);
                    givingtype = configleveldata[i].sv_user_givingtype;
                    deserved = detail_value;
                    $("#sv_user_givingtype").val(givingtype);
                    $("#sv_detali_proportionalue").val(proportionalue);
                    $("#sv_detail_value").val(detail_value)
                    if (deserved > 0) {
                        $("#StoredRemark").text("(充值" + sv_mrr_amountbefore + "元,活动充值" + proportionalue + "元赠送" + deserved + (givingtype == 1 ? "积分" : "元储值现金)"));
                    }
                }
            }
        }

    } else {

        $("#sv_user_givingtype").val(0);
        $("#sv_detali_proportionalue").val(0);
        $("#sv_detail_value").val(0)
    }
    if (deserved <= 0 && detail_value <= 0 && givingtype <= 0) {
        $("#sv_user_givingtype").val(0);
        $("#sv_detali_proportionalue").val(0);
        $("#sv_detail_value").val(0)
        if (!isNullOrWhiteSpace(strobj)) { $("#sv_mrr_present").val(0) };
    }
    if (givingtype == 2 && !isNullOrWhiteSpace(strobj)) {
        $("#sv_mrr_present").val(deserved);
    }
    var sv_mrr_present = $("#sv_mrr_present").val() || 0;
    $("#huoji").text(parseFloat(sv_mrr_present) + parseFloat(sv_mrr_amountbefore));
}

//显示客显数据
//type   1:显示单价，2：显示合计，3：显示收款，4：显示找零
function ShowCusDisplay(type, showinfo) {
    try {
        if (((typeof Cef) !== 'undefined') &&
            hardware_cusdisplay_enable &&
            hardware_cusdisplay_port &&
            hardware_cusdisplay_baud) {
            Cef.CustomerDisplay(hardware_cusdisplay_port,
                parseInt(hardware_cusdisplay_baud),
                "One",
                8,
                type,
                showinfo);
        }

    } catch (e) {

    }
}

// 快捷键设置
$('#keysetting').click(function () {
    Deke.DeKe_dialog.show_Url3('快捷键设置', "/html/cash/keysetting.html?v=" + clearCache, keysetting, ['595px', '440px'], "shoyin2");

});

// 
function keysetting() {
    // 读取快捷键设置 val
    setTimeout(function () {
        disableButton('btnSaveKeySetting');
        if (shortcut_key_json_str != null && shortcut_key_json_str != '' && shortcut_key_json_str != undefined) {
            for (var key in shortcut_key_json_str) {
                if (shortcut_key_json_str[key] != null && shortcut_key_json_str[key] != '' && shortcut_key_json_str[key] != undefined) {
                    $('#' + key).val(shortcut_key_json_str[key]);
                }
            }
        }
    }, 200);

    // 快捷键data-value
    setTimeout(function () {
        if (shortcut_key_json_ascii_index != null && shortcut_key_json_ascii_index != '' && shortcut_key_json_ascii_index != undefined) {
            for (var key in shortcut_key_json_ascii_index) {
                $('#' + key).attr('data-value', shortcut_key_json_ascii_index[key]);
            }
        }

    }, 200);

    $('.layui-layer-setwin').css('display', 'none');
    //关闭快捷键设置弹窗的事件
    $("#close-keypage").click(function () {
        layer.closeAll();
    });
    //快捷键设置启用的事件
    $('#settingkeybtn').click(function () {
        enabledButton('btnSaveKeySetting');
        $('.setting-key li a>input').removeAttr("disabled");
        $('#key_zero_price').focus();
    });

    // 保存快捷键配置信息
    $('#btnSaveKeySetting').click(function () {
        if (shortcut_key_repeat) {
            layer.msg("快捷键有重复！");
            return;
        }
        comon_key_arr = [];
        var arr_input = $('.setting-key>li a input');
        for (var i = 0; i < arr_input.length; i++) {
            var data_value = $('.setting-key>li a input:eq(' + i + ')').attr('data-value');
            if (data_value != null && data_value != '' && data_value != undefined) {
                comon_key_arr.push(data_value);
            }
            else {
                layer.msg("快捷键必须填写！");
                return;
            }
        }
        var detaillist = [];
        var data = {
            "sv_user_configdetail_id": sv_user_configdetail_key_id,
            "sv_detail_value": comon_key_arr.join(","),
            "sv_user_config_id": shortcut_key_user_config_id,
            "sv_user_module_id": shortcut_key_user_module_id,
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": "快捷键设置",
            "sv_remark": "快捷键设置"
        };
        detaillist.push(data);
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=Set_SysFastKey', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    setTimeout(function () {
                        location.reload();
                    }, 600);
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    });

    // 恢复默认设置
    $(document).on('click', '#default_keysetting', function () {
        enabledButton('btnSaveKeySetting');
        if (default_shortcut_key_json_str != null && shortcut_key_json_str != '' && shortcut_key_json_str != undefined) {
            for (var key in default_shortcut_key_json_str) {
                if (default_shortcut_key_json_str[key] != null && default_shortcut_key_json_str[key] != '' && default_shortcut_key_json_str[key] != undefined) {
                    $('#' + key).val(default_shortcut_key_json_str[key]);
                }
            }
        }

        if (default_shortcut_key_json_ascii_index != null && default_shortcut_key_json_ascii_index != '' && default_shortcut_key_json_ascii_index != undefined) {
            for (var key in default_shortcut_key_json_ascii_index) {
                $('#' + key).attr('data-value', default_shortcut_key_json_ascii_index[key]);
            }
        }
        $('#btnSaveKeySetting').click();
    });
}
var input_change = $('.setting-key>li a input');

// 键盘按下时间
$(document).on('keydown', '.setting-key>li a input', function (event) {
    var isShowThisWindows = $('#isShowThisWindows').val();
    if (isShowThisWindows) {
        var isInputDisabled = $('.setting-key li a>input').is("disabled");
        var inputFocusId = document.activeElement.id;
        var keyCodeStr = shortcut_key_json[event.keyCode];
        var lastshortcut_key_value = shortcut_key_json[$('#' + inputFocusId).attr('data-value')];
        var keyCode_num = event.keyCode;
        if (keyCode_num >= 48 && keyCode_num <= 57) {
            setTimeout(function () { $('#' + inputFocusId).val(lastshortcut_key_value); }, 100);
            layer.msg("数字不能作为快捷键");
            return;
        }
        else {
            var inputValue = $(this).attr('data-value');
            var input_id = $(this).attr('id');
            var input_change = $('.setting-key>li a input');
            for (var i = 0; i < input_change.length; i++) {
                var this_input_id = $('.setting-key>li a input:eq(' + i + ')').attr('id');
                var this_inputValue = $('.setting-key>li a input:eq(' + i + ')').attr('data-value');
                if (keyCode_num == this_inputValue && input_id != this_input_id) {
                    shortcut_key_repeat = true;
                    //$(this).val('');
                    layer.msg("该键已被占用，请重新设置该快捷键");
                    event.preventDefault();
                    return;
                }
                else {
                    shortcut_key_repeat = false;
                }
            }
            if (!shortcut_key_repeat) {
                var thisInputValue = $('#' + inputFocusId).val();
                $('#' + inputFocusId).val(keyCodeStr).attr('data-value', keyCode_num);
            }
        }
    }
});

// 读取快捷键配置信息
function getkey_settingInfo() {
    if (shortcut_key_json_str != null && shortcut_key_json_str != '' && shortcut_key_json_str != undefined) {
        for (var key in shortcut_key_json_str) {
            $('.' + key + ' i').html(shortcut_key_json_str[key]);
        }
    }
}

// 读取快捷键设置，并触发相应的功能
$(document).keypress(function (event) {
    var isShowThisWindows = $('#isShowThisWindows').val();
    var keypress_Code = event.keyCode;
    if (keypress_Code != null && keypress_Code != '' && keypress_Code != undefined) {
        if ((keypress_Code >= 65 && keypress_Code <= 90 && !isShowThisWindows) || keypress_Code == 46) {//大写字母，符号.
            capital_letters = true;
        }
        else if (keypress_Code >= 48 && keypress_Code <= 57 && !isShowThisWindows) {//数字
            capital_letters = true;
        }
        else if ((keypress_Code >= 97 && keypress_Code <= 122) || keypress_Code == 32) {//小写字母 32 空格键
            capital_letters = false;
            var is_layui_layer_open = $('.layui-layer').hasClass('layui-layer-page');
            var csshjsbox_window_open = $('#csshjsbox_window_open').val();
            if ((!isShowThisWindows && !is_layui_layer_open) || csshjsbox_window_open) {
                // 读取快捷配置信息
                if (shortcut_key_json_ascii_index != null && shortcut_key_json_ascii_index != undefined && shortcut_key_json_ascii_index != '') {
                    for (var key in shortcut_key_json_ascii_index) {
                        if (key == 'key_close_window' && shortcut_key_json_ascii_index[key] == keypress_Code - 32) {
                            layer.closeAll();
                            event.preventDefault();
                            return;
                        } else if (key == 'key_member' && keypress_Code - 32 == shortcut_key_json_ascii_index[key]) {
                            $("." + key).click();
                            event.preventDefault();
                            return;
                        } else if (keypress_Code - 32 == shortcut_key_json_ascii_index[key]) {
                            $("." + key).click();
                            key_close_window = true;
                            event.preventDefault();
                            return;
                        }
                        else if (keypress_Code == 32 && key == 'key_settlement') {
                            if (!csshjsbox_window_open) {
                                $("." + key).click();
                                key_close_window = true;
                                event.preventDefault();
                                return;
                            }
                        }
                    }
                }
            }
            else if (key_close_window) {
                if (shortcut_key_json_ascii_index != null && shortcut_key_json_ascii_index != undefined && shortcut_key_json_ascii_index != '') {
                    for (var key in shortcut_key_json_ascii_index) {
                    }
                }
            }
            else if (isShowThisWindows) {
                //？？？？？
            }
            else {
                capital_letters = true;
                $('#queryproduct').focus();
            }
            event.preventDefault();
            return;
        }
        else if (keypress_Code >= 37 && keypress_Code <= 40)//方向键 左37上38右39下40
        {
            //上下键控制清单的上下选择
            //左右键控制右侧商品分页（左右滑动）
            event.preventDefault();
            return;
        }
        else //其他非大写字母、数字、小写字母 的按键
        {
            ////event.preventDefault();
            //return;
        }
    }
});

// 快捷键触发
function shortcut_key(key_Code, event) {
    if (shortcut_key_json_ascii_index != null && shortcut_key_json_ascii_index != undefined && shortcut_key_json_ascii_index != '' && key_Code != undefined && key_Code != null && key_Code != '') {
        for (var key in shortcut_key_json_ascii_index) {
            if (shortcut_key_json_ascii_index[key] == key_Code) {
                $("." + key).click();
                event.preventDefault();
                return;
            }

        }
    }
}

var cashlefsit_move_index = 0;
// 快捷键中的其它键盘
$(document).keyup(function (key) {
    var getFocusId = document.activeElement.id; // 获得焦点控件的Id
    var selectMemberWindowds = $('#selectMemberWindowds').val();
    var isShowThisWindows = $('#isShowThisWindows').val();
    var this_keyup_code = key.keyCode;
    if (this_keyup_code >= 112 && this_keyup_code <= 123 && !isShowThisWindows) { // f3 ---f12 键
        shortcut_key(this_keyup_code, key);
    }
    else if (this_keyup_code >= 37 && this_keyup_code <= 40) { // 上下左右键
        var cashlefsitlength = $('#Cashlefsit li').length;
        if (this_keyup_code == 38) { // 上移
            if (cashlefsit_move_index > 0) {
                cashlefsit_move_index--;
                $('#Cashlefsit li').removeClass('active');
                $('#Cashlefsit li:eq(' + cashlefsit_move_index + ')').addClass('active');
            }
        }
        else if (this_keyup_code == 40) { // 下移
            if (cashlefsitlength > cashlefsit_move_index) {
                cashlefsit_move_index++;
                $('#Cashlefsit li').removeClass('active');
                $('#Cashlefsit li:eq(' + cashlefsit_move_index + ')').addClass('active');
            }
        }
    }
    else if (this_keyup_code == 107 || this_keyup_code == 109) { // 加减
        shortcut_key(this_keyup_code, key);
    }
    else if (this_keyup_code == 27 || this_keyup_code == 13) {
        var is_layui_layer_open = $('.layui-layer, layui-layer-title').hasClass('layui-layer-page');
        var layer_title = $('.layui-layer-title');
        if (is_layui_layer_open || layer_title) {
            if (this_keyup_code == 27) {
                layer.closeAll(); // 关闭弹窗
                isShowWindow = false;
            }
            else if (this_keyup_code == 13) {
                var isShowbarCodePayWindows = $('#isShowbarCodePayWindows').val();
                if (getFocusId == "txtPayselectmember" || getFocusId == "query_like" || selectMemberWindowds || getFocusId == "authcode" || isShowbarCodePayWindows) {

                }
                else {
                    $('.com_key_confirm_enter').click(); // 触发公共的回车键
                    $('.layui-layer-btn0').click();
                }
            }
        }
    }
    else if (this_keyup_code == 112 || this_keyup_code == 113) { // F1 --F2 
        if (isShowThisWindows) {
            if (this_keyup_code == 112) {
                $('#default_keysetting').click();
            }
            else if (this_keyup_code == 113) {
                $('#settingkeybtn').click(); // 快捷键启用编辑
            }
        }
    }
});

//判断设备类型
var decerpbrowser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }()
}
//-- 收银快收、商品编码、助记码输入框 焦点控制
function queryProductFocus() {
    //安卓环境下，不自动触发焦点，优化前端事件
    if ($("#queryproduct") && $("#queryproduct").length > 0) {
        if (!decerpbrowser.versions.android) {
            $("#queryproduct").focus();
        }
    }
}

//收银界面焦点控制
function cashFocus() {
    //安卓环境下，不自动触发焦点，优化前端事件
    if ($("#xianjin") && $("#xianjin").length > 0) {
        if (!decerpbrowser.versions.android) {
            if (jiaodianname) {
            } else {
                $("#xianjin").focus();
            }
        }
    }
}


//清除条码助码输入框的value值
$("#deletebtn").on("click", function () {
    $("#queryproduct").val("");
});

//收银选择会员
function paySelectMemberFn(memberSeachstr, userid, memberlevel_id) {
    clearSelectMemberInfo();
    var is_GetConfigdataBylevel = false;
    if (memberlevel_id != null && memberlevel_id != "" && memberlevel_id >= 1) {
        is_GetConfigdataBylevel = true;
    }
    var payselectmember = memberSeachstr;
    if (payselectmember != null && payselectmember != '' && payselectmember != undefined) {
        $.get("/Ajaxdata/QueryUserModel?id=" + payselectmember + "&userid=" + userid, function (data) {
            if (data == null) {
                layer.msg("找不到该会员，请查证再查询");
                return;
            }
            else if (data.type == 1) {
                Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=42", f4, ['730px', ''], "shoyin2");
            }
            else if (data.isOverdue) {
                layer.msg("此卡已过期");

                return false;
            }
            else if (data.sv_mr_status == 1) {
                layer.msg("此卡已挂失");
                $("#memberNamep").html("");
                $("#memberNamenumber").html("");
                $("#membercatagory").html("");
                $("#memberintegral").html("");
                $("#memberbalance").html("");
                $("#memberconsumptiongrand").html("");
                $("#memberbirthday").html("");
                $('#txtPayselectmember').val('');
                $("#yuecount").attr('data-money', 0);
                $('#member_photo').attr('src', '/images/001.png');
                return false;
            }
            else {
                _cache_memberinfo_json = data;
                $('#txtPayselectmember').blur();
                //如果会员的名字为空的话就读取会员的ID
                if (data.sv_mr_name != null && data.sv_mr_name != "" && data.sv_mr_name != undefined) {
                    $("#memberNamep").html(data.sv_mr_name);
                } else {
                    $("#memberNamep").html(data.member_id);
                }
                $('#btnMemberRecharge').attr('data-userId', data.user_id).attr('data-cardno', data.sv_mr_cardno).attr("data-level", data.memberlevel_id);
                $('#member_photo').attr('src', data.sv_mr_headimg);
                $('#huiyuan_id').attr('data-id', data.member_id);
                $("#memberNamenumber").html(data.sv_mr_mobile);
                if (data.sv_ml_commondiscount > 0 && data.sv_ml_commondiscount < 10) {
                    $("#memberdIscount").html('折扣:' + (parseFloat(data.sv_ml_commondiscount) * 10).toFixed(2) + '%');
                } else {
                    $("#memberdIscount").html('折扣:100%');
                }
                $("#membercatagory").html(data.sv_ml_name);
                $("#memberintegral").html(data.sv_mw_availablepoint);
                $("#memberbalance").html(data.sv_mw_availableamount);
                $("#memberconsumptiongrand").html(data.sv_mw_sumamount);
                $("#memberbirthday").html(new Date(data.sv_mr_birthday).Format("MM-dd"));

                $('#member_id').val(data.member_id);
                $('#userid').val(data.user_id);
                $('.sv_mr_cardno').text(data.sv_mr_cardno);
                $('.sv_mr_name').text(data.sv_mr_name);
                $("#yuecount").attr('data-money', data.sv_mw_availableamount).text(data.sv_mw_availableamount);
                $('.sv_mw_availableamount').text(data.sv_mw_availableamount);
                if (data.sv_ml_commondiscount != null && data.sv_ml_commondiscount != undefined && data.sv_ml_commondiscount != '' && data.sv_ml_commondiscount != 0 && data.sv_ml_commondiscount != "0") {
                    _member_discount = parseFloat(data.sv_ml_commondiscount) * 10;
                }
                else {
                    _member_discount = 100;
                }
                $("#huiyuan_id").text(data.sv_mr_name).data("id", data.member_id).data("jiekou", _member_discount);
                $('#ttuser_descount').val("100");
                $('#user_descount').text(_member_discount);
                if (!is_GetConfigdataBylevel && $("#memberlevel_id").val() != null && $("#memberlevel_id").val() != "") {
                    GetConfigdataBylevel($("#memberlevel_id").val());
                }
                $('.paywaylist .selectpaytype').eq(1).click();
                zhonger();
                //settlementInputChange();
                $("#xianjin").change();
                CalculateGiving(); // 计算满赠送
            }
            // 处理异常图片
            $('#member_photo').error(function () {
                $(this).attr('src', '/images/001.png');
            });
        });
    }
    else {
        layer.msg("请输入手机号码或卡号");
    }
}

//会员现在初始化为未选择
function clearSelectMemberInfo() {
    $('#btnMemberRecharge').attr('data-userId', "").attr('data-cardno', "").attr("data-level", "");
    $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
    $("#yuecount").text(returnFloat(0)).attr('data-money', 0);
    $("#user_descount").text("100");
    _cache_memberinfo_json = null;
    _member_discount = 100;
    $('#jieshuajie2').text($('#jieshuajie').text());

    $("#memberdIscount").html('');
    $("#huiyuan_id").text("").attr("data-id", "0").data("jiekou", "100");
    $("#memberNamep").html("");
    $("#memberNamenumber").html("");
    $("#membercatagory").html("");
    $("#memberintegral").html("");
    $("#memberbalance").html("");
    $("#memberconsumptiongrand").html("");
    $("#memberbirthday").html("");
    $('#payselectmember').val('');
    $('#member_photo').attr('src', '/images/001.png');
}

// 搜索会员
$(document).on("keyup", "#txtPayselectmember", function (event) {
    var _query_user_last_search = "";
    var this_memberValue = $(this).val().replace(/\ +/g, "");
    if (event.keyCode == "13") {
        paySelectMemberFn(this_memberValue, '', '');
    }
    else if (event.keyCode == "113") {
        var c_ = typeof Cef;
        if (c_ !== "undefined") {
            GetICCardEventData($("#payselectmember"), e);
            if ($("#payselectmember").val()) {
                if (_query_user_last_search != $("#payselectmember").val()) {
                    //重新检索会员卡
                    $("#userid").val("");
                    paySelectMemberFn($(this).val().trim(), '', '');
                } else {
                    //选取会员卡
                }
                _query_user_last_search = $("#payselectmember").val();
            }
        }
    }
});

$(document).on("click", ".paywaylist .disabledbtn", function () {
    layer.msg("此功能正在开发中!");
})

//清除数字
$(document).on("click", ".pay-settlement-input .clean", function () {
    $(this).siblings("input").val("");
    $(this).siblings("input").focus();
});

// 选择会员列表
function selectmemberlist() {
    getMemberListBySeachStr($("#payselectmember").val());
}

function getmemberlist(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {

        html += ' <tr data-user_id="' + data[i].user_id + '" data-sv_mr_cardno="' + data[i].sv_mr_cardno + '" data-id="' + data[i].member_id + '" data-name="' + data[i].sv_mr_name + '" data-isoverdue="' + data[i].isOverdue + '">';

        html += '    <td><span>' + data[i].sv_mr_cardno + '</span></td>';
        html += '    <td><span>' + data[i].sv_mr_name + '</span></td>';
        html += '    <td><span>' + data[i].sv_mr_mobile + '</span></td>';
        html += '   <td><i>¥' + data[i].sv_mw_availableamount + '</i></td>';
        html += '  <td><i>¥0.00</i></td>';
        if (isNullOrWhiteSpace(data[i].sv_ml_name))
            html += '  <td><span>' + data[i].sv_ml_name + '</span></td>';
        else html += '  <td><span></span></td>';
        html += '   <td id="' + data[i].sv_mr_status + '"><a href="javascript:void(0);" class="xianzhehuiyan" id="' + data[i].sv_mr_status + '" data-isoverdue="' + data[i].isOverdue + '">选择</a></td>';
        html += '   </tr>';
    }
    $("#usercoutn").html(data.length);
    $("#userlist").html(html);
}

// 会员列表
function getMemberListBySeachStr(key) {
    $("#query_like").val(key);
    $.get("/ajaxdata/GetMemberList/1", { "key": key, "pageSize": 30 }, function (data) {
        var html = "";
        for (var i = 0; i < data.length; i++) {
            html += ' <tr data-user_id="' + data[i].user_id + '" data-sv_mr_cardno="' + data[i].sv_mr_cardno + '" data-id="' + data[i].member_id + '" data-name="' + data[i].sv_mr_name + '" data-isoverdue="' + data[i].isOverdue + '" >';
            html += '    <td><span>' + data[i].sv_mr_cardno + '</span></td>';
            html += '    <td><span>' + data[i].sv_mr_name + '</span></td>';
            html += '    <td><span>' + data[i].sv_mr_mobile + '</span></td>';
            html += '   <td><i>¥' + data[i].sv_mw_availableamount + '</i></td>';
            html += '  <td><i>¥0.00</i></td>';
            if (isNullOrWhiteSpace(data[i].sv_ml_name))
                html += '  <td><span>' + data[i].sv_ml_name + '</span></td>';
            else html += '  <td><span></span></td>';
            html += '  <td><span>' + data[i].sv_mw_availablepoint + '</span></td>';
            html += '   <td id="' + data[i].sv_mr_status + '"><a href="javascript:void(0);" class="xianzhehuiyan select" ';
            html += ' id="' + data[i].sv_mr_status + '" data-user_id="' + data[i].user_id + '" ';
            html += ' data-sv_mr_cardno="' + data[i].sv_mr_cardno + '" data-id="' + data[i].member_id + '" ';
            html += 'data-name="' + data[i].sv_mr_name + '" data-isoverdue="' + data[i].isOverdue + '" data-level="' + data[i].memberlevel_id + '">选择</a></td>';
            html += '</tr>';
        }
        $("#usercoutn").html(data.length);
        $("#userlist").html(html);

        //   搜索会员
        $("#query_like").keydown(function (e) {
            var thisValue = $(this).val();
            if (thisValue != null && thisValue != undefined && thisValue != '') {
                if (e.keyCode == 13) {
                    getMemberListBySeachStr(thisValue);
                }
            }
        });

        $(document).on("click", "#userlist .select", function () {
            if ($(this).data("isoverdue")) {
                layer.msg("此卡已过期");
            }
            else {
                if (this.id == 1) {
                    layer.msg("此卡已挂失");
                }
                else { //搜索会员
                    paySelectMemberFn($(this).attr('data-sv_mr_cardno'), $(this).attr('data-user_id'), $(this).attr('data-level'));
                    layer.close(index);
                }
            }
        });
    });
}

// 刷新结算窗口会员信息
function getMemberInfoByMemberId(sv_mr_cardno, userid) {
    if (userid == null || userid == undefined || userid == '') {
        userid = user_id;
    }
    $.get("/Ajaxdata/QueryUserModel?id=" + sv_mr_cardno + "&userid=" + userid, function (data) {
        if (data == null) {
            layer.msg("找不到该会员，请查证再查询");
            return;
        }
        else if (data.type == 1) {
            Deke.DeKe_dialog.show_Url3("选择会员", "/html/cash/xianzhehuiy.html?v=42", f4, ['730px', ''], "shoyin2");
        }
        else if (data.isOverdue) {
            layer.msg("此卡已过期");

            return false;
        }
        else if (data.sv_mr_status == 1) {
            layer.msg("此卡已挂失");
            $("#memberNamep").html("");
            $("#memberNamenumber").html("");
            $("#membercatagory").html("");
            $("#memberintegral").html("");
            $("#memberbalance").html("");
            $("#memberconsumptiongrand").html("");
            $("#memberbirthday").html("");
            $('#txtPayselectmember').val('');
            $("#yuecount").attr('data-money', 0);
            $('#member_photo').attr('src', '/images/001.png');
            return false;
        }
        else {
            _cache_memberinfo_json = data;
            $('#txtPayselectmember').blur();
            //如果会员的名字为空的话就读取会员的ID
            if (data.sv_mr_name != null && data.sv_mr_name != "" && data.sv_mr_name != undefined) {
                $("#memberNamep").html(data.sv_mr_name);
            } else {
                $("#memberNamep").html(data.member_id);
            }
            $('#btnMemberRecharge').attr('data-userId', data.user_id).attr('data-cardno', data.sv_mr_cardno).attr("data-level", data.memberlevel_id);
            $('#member_photo').attr('src', data.sv_mr_headimg);
            $('#huiyuan_id').attr('data-id', data.member_id);
            $("#memberNamenumber").html(data.sv_mr_mobile);
            if (data.sv_ml_commondiscount > 0 && data.sv_ml_commondiscount < 10) {
                $("#memberdIscount").html('折扣:' + (parseFloat(data.sv_ml_commondiscount) * 10).toFixed(2) + '%');
            } else {
                $("#memberdIscount").html('折扣:100%');
            }
            $("#membercatagory").html(data.sv_ml_name);
            $("#memberintegral").html(data.sv_mw_availablepoint);
            $("#memberbalance").html(data.sv_mw_availableamount);
            $("#memberconsumptiongrand").html(data.sv_mw_sumamount);
            $("#memberbirthday").html(new Date(data.sv_mr_birthday).Format("MM-dd"));

            $('#member_id').val(data.member_id);
            $('#userid').val(data.user_id);
            $('.sv_mr_cardno').text(data.sv_mr_cardno);
            $('.sv_mr_name').text(data.sv_mr_name);
            $("#yuecount").attr('data-money', data.sv_mw_availableamount).text(data.sv_mw_availableamount);
            $('.sv_mw_availableamount').text(data.sv_mw_availableamount);
            if (data.sv_ml_commondiscount != null && data.sv_ml_commondiscount != undefined && data.sv_ml_commondiscount != '' && data.sv_ml_commondiscount != 0 && data.sv_ml_commondiscount != "0") {
                _member_discount = parseFloat(data.sv_ml_commondiscount) * 10;
            }
            else {
                _member_discount = 100;
            }
            $("#huiyuan_id").text(data.sv_mr_name).data("id", data.member_id).data("jiekou", _member_discount);
            $('#ttuser_descount').val("100");
            $('#user_descount').text(_member_discount);
            $('.paywaylist .selectpaytype').eq(1).click();
        }
        // 处理异常图片
        $('#member_photo').error(function () {
            $(this).attr('src', '/images/001.png');
        });
    });
}