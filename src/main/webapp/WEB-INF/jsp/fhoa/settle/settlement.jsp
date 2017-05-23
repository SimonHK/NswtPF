<%--
  Created by IntelliJ IDEA.
  User: hongkai
  Date: 2017/5/4
  Time: 下午2:03
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!-- saved from url=(0032)http://www.decerp.cc/home/index2 -->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>收银界面</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <!--bootstrap框架样式-->
    <link rel="stylesheet" href="settle/bootstrap.css">
    <!--文字代替ICON的样式-->
    <link rel="stylesheet" href="settle/font-awesome.min.css">
    <!--总样式-->
    <link rel="stylesheet" href="settle/index.css">
    <!--收银模块CSS-->
    <link rel="stylesheet" href="settle/swiper.min.css">
    <link rel="stylesheet" href="settle/Cash.css">
    <link rel="stylesheet" href="settle/iconfont.css">
    <link href="settle/buttons.css" rel="stylesheet">
    <link href="settle/attr.css" rel="stylesheet">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">

    <style>
        body {
            font-family: '微软雅黑';
        }

        nav a, .navbtnbox a {
            color: #333333 !important;
        }

        .nafrigh a {
            color: #333 !important;
        }

        .layui-layer-setwin a {
            width: 40px !important;
            height: 40px !important;
            background-position: 0 -6px !important;
        }
    </style>

    <link rel="stylesheet" href="settle/layer.css" id="layui_layer_skinlayercss"><link type="text/css" rel="stylesheet" href="settle/laydate.css"><link type="text/css" rel="stylesheet" href="settle/laydate(1).css" id="LayDateSkin"><link rel="stylesheet" href="settle/layer.ext.css" id="layui_layer_skinlayerextcss"></head>

<body style="background: url(&#39;/images/cashbg.jpg&#39;) repeat;">

<!---------------------am------------------------>
<!---头部 end----->
<!--收银box-->
<div class="main-box">
    <!--左边-->
    <div class="fl naflet" style="position: relative; z-index: 99; height: 563px;">
        <!--搜索框-->
        <div class="top top2">
            <i class="search-product-buy" data-name="search-product-buy"></i>
            <input type="text" id="queryproduct" placeholder="条码/助词码（大写）/价格（0~100000)">
            <span class="deletebtn" id="deletebtn"></span>
        </div>
        <!--搜索框-->
        <div class="bdtext" style="height: 515px;">
            <!--操作员名字和信息-->
            <div class="padding titiels" style="height: 67px;">
                <p class="" style="overflow:hidden;">
                    <span class="fr" id="date_ss" style="float:left">销售时间：2017年05月04日 14:59:58</span>
                </p>
                <p>
                    <span>销售单号：<text id="danhao">1493274193</text></span>
                </p>
            </div>
            <!--操作员名字和信息-->
            <!--商品列表-->
            <div class="cashbox maxbox">
                <ul class="Cashlefsit" id="Cashlefsit" style="height: 273px;"><li class="" data-mindiscount="0" data-minunitprice="0" data-memberprice="0" id="146956" data-pricingmethod="0" data-sv_p_commissiontype="" data-sv_p_commissionratio=""><div class="naelfe">3</div> <div class="naerigh"><p class="nn1"> 海之言</p><p class="nn2"><span class="fl">00033</span><span class="fr">数量 <text class="nump" data-cnum="0">1</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="38.00"> 38.00</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="30" data-sv_p_commissiontype="undefined" data-sv_p_commissionratio="undefined"> 38.00</text></span></p></div> </li><li class="active" data-mindiscount="0" data-minunitprice="0" data-memberprice="0" id="146932" data-pricingmethod="0" data-sv_p_commissiontype="" data-sv_p_commissionratio=""><div class="naelfe">2</div> <div class="naerigh"><p class="nn1"> 智利进口车厘子</p><p class="nn2"><span class="fl">000012</span><span class="fr">数量 <text class="nump" data-cnum="0">1</text></span></p> <p class="nn3"><span class="fl">¥<text class="jiage" data-rjia="340.00"> 340.00</text></span><span class="fr">¥ <text class="zhong" data-zhekou="1" data-sv_p_originalprice="280" data-sv_p_commissiontype="undefined" data-sv_p_commissionratio="undefined"> 340.00</text></span></p></div> </li></ul>
            </div>
            <!--商品列表-->
            <!--结账按钮-->
            <div class="Cashlebtn">
                <div class="cltop">
                    <div class="tiptops">
                        <input type="hidden" id="sv_mr_cardno" value="658">
                        <input type="hidden" id="memberlevel_id" value="4642">
                        <span><em>会员</em><i id="huiyuan_id" data-id="0"></i></span>
                        <span><em class="yelow">余额</em><i class="cohuise">¥<text id="yuecount" data-money="0">0.00</text></i></span>
                    </div>
                    <div class="tiptops">
                        <span><em>合计</em></span>
                        <span><i>¥<text id="jieshuajie">378.00</text></i></span>
                    </div>
                    <div class="tiptops">
                        <span><em>折扣</em></span>
                        <span><i><text id="user_descount">100</text>%</i></span>
                    </div>
                    <div class="tiptops">
                        <span><em class="corrrred">应收</em></span>
                        <span><i class="corrrred">¥<text id="jieshuajie2">378.00</text></i></span>
                    </div>
                </div>

                <div class="clbtom">
                    <input type="hidden" id="userid" name="userid" value="51604066">
                    <a href="javascript:void(0);" id="Cashchongzhi" style="font-family: SimHei;" class="key_select_member">选择会员</a>
                    <a style="border-left: 1px solid #ff8d8d;font-family: SimHei;" ;="" href="javascript:void(0);" id="Cashlebtn" class="key_settlement">结算</a>
                </div>
            </div>
            <!--结账按钮-->
        </div>
    </div>
    <!--左边-->
    <!--右边-->
    <div class="nafrigh nafrigh2" style="height: 563px;">
        <!--左侧的按钮-->
        <div class="navbtnbox navbtnbox2">
            <nav>
                <a href="javascript:void(0);" id="nocoding" class="btn disabled key_fast_collect" alt="输入金额1-100000可快速收银" )="" data-name="">快收<i>k</i></a>
                <a href="javascript:void(0);" id="num_jia" class="big bule key_add_num" alt="" )="" data-name="">+</a>
                <a href="javascript:void(0);" id="num_jian" class="big key_minus_num" alt="" )="" data-name="">-</a>
                <a href="javascript:void(0);" id="num_sl" class="shudian key_num" alt="" )="" data-name="shulian">数量<i>n</i></a>
                <a href="javascript:void(0);" id="pay_zk" class="shudian key_discount" alt="" )="" data-name="zhekou">折扣<i>o</i></a>
                <a href="javascript:void(0);" id="pay_gj" class="shudian key_change_price" alt="" )="" data-name="gaijia">改价<i>g</i></a>
                <a href="javascript:void(0);" id="delete_p" class="key_delete" alt="" )="" data-name="">删除<i>d</i></a>
                <a href="javascript:void(0);" id="chongji" class="key_recharge" alt="" )="" data-name="">充值<i>r</i></a>
                <a href="javascript:void(0);" id="userbur" class="key_member" alt="" )="" data-name="">会员<i>m</i></a>
                <a href="javascript:void(0);" id="guadaiclick" class="key_pending" alt="" )="" data-name="">挂单<i>h</i></a>
                <a href="javascript:void(0);" id="keysetting" class="key_setting" alt="" )="" data-name="">快捷键<i>j</i></a>

            </nav>
        </div>
        <!--左侧的按钮-->
        <!--右边商品展示框-->
        <div class="Cashporictbox displayproductlist">
            <!--顶部导航栏-->
            <div class="Cashtopnav" style="height:50px;">
                <div class="swiper-container swiper-container-horizontal swiper-container-free-mode">
                    <div class="swiper-wrapper" id="classlist" style="transition-duration: 0ms; transform: translate3d(-1px, 0px, 0px);">
                        <div class="swiper-slide active swiper-slide-active" data-id="0" style="width: 130.667px; margin-right: 4px;">所有分类</div>
                        <div class="swiper-slide swiper-slide-next" data-id="136" style="width: 130.667px; margin-right: 4px;">热卖水果</div>
                        <div class="swiper-slide" data-id="7354" style="width: 130.667px; margin-right: 4px;">时令水果</div>
                        <div class="swiper-slide" data-id="141" style="width: 130.667px; margin-right: 4px;">进口水果</div>
                        <div class="swiper-slide" data-id="935" style="width: 130.667px; margin-right: 4px;">零食</div>
                        <div class="swiper-slide" data-id="5631" style="width: 130.667px; margin-right: 4px;">饮料</div>
                        <div class="swiper-slide" data-id="137" style="width: 130.667px; margin-right: 4px;">海鲜</div></div>
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
            <!--顶部导航栏-->
            <!--产品展示-->
            <div class="Cashbotobx2" style="padding-right: 12px;">
                <div class="swiper-container swiper-container-horizontal">
                    <ul class="swiper-wrapper productmorelist" id="productlist" style="transition-duration: 0ms; transform: translate3d(-2487px, 0px, 0px);">
                        <li class="swiper-slide productlistboxaaa" style="width: 829px;">
                            <div data-mindiscount="0" data-minunitprice="0"
                                 data-memberprice="0"
                                 class="textlistbox"
                                 data-id="0033"
                                 data-prid="149874"
                                 data-pricingmethod="1"
                                 data-sv_p_commissiontype=""
                                 data-sv_p_commissionratio="">
                                <a href="javascript:void(0);"> <div class="teimg"><img src="settle/20170323094518964.jpg" style="height: 80px;"></div></a>
                                <div class="teitext">
                                    <p class="productpicename"><span class="name"> 汇达柠檬</span></p>
                                    <p class="productpice">¥<span class="jiage" data-sv_p_originalprice="0">60.00</span>元</p>
                                </div>
                            </div>
                            <div data-mindiscount="0" data-minunitprice="0"
                                 data-memberprice="0"
                                 class="textlistbox"
                                 data-id="56412378"
                                 data-prid="149873"
                                 data-pricingmethod="1"
                                 data-sv_p_commissiontype=""
                                 data-sv_p_commissionratio="">
                                <a href="javascript:void(0);"> <div class="teimg"><img src="settle/20170323094327320.png"  style="height: 80px;"></div></a>
                                <div class="teitext">
                                    <p class="productpicename"><span class="name"> 海南三亚菠萝蜜</span></p>
                                    <p class="productpice">¥<span class="jiage" data-sv_p_originalprice="0">30.00</span>元</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

<!--产品展示-->
<!-- 产品信息提示-->
<!-- 产品信息提示-->
</div>
<!--右边商品展示框-->
</div>
<!--右边-->

</div>
<!--右侧导航栏-->
<!--收银box-->
<script src="settle/jquery-2.1.0.js"></script>
<script type="text/javascript" src="settle/bootstrap.min.js"></script>
<script type="text/javascript" src="settle/swiper.min.js"></script>
<script src="settle/layer.js"></script>
<script src="settle/laydate.js"></script>
<script src="settle/laypage.js"></script>
<script src="settle/layer.ext.js"></script>
<script src="settle/ajaxfileupload.js"></script>
<script src="settle/deke_data.js"></script>
<script>
    var default_shortcut_key_json_str = { "key_zero_price": "z", "key_clean_price": "c", "key_combination_pay": "f1", "key_bank_card": "f2", "key_weChatpay": "f3", "key_alipay": "f4", "key_scan_code": "f5", "key_stored_card": "f6", "key_cash": "f7", "key_product_code": "f8", "key_card_read": "numbersign", "key_fast_collect": "k", "key_print": "p", "key_minus_num": "-", "key_add_num": "+", "key_settlement": "space", "key_select_member": "x", "key_pending": "h", "key_recharge": "r", "key_delete": "d", "key_change_price": "g", "key_discount": "o", "key_num": "n", "key_close_window": "s", "key_setting": "j", "key_member": "m" }; // 快捷键
    var default_shortcut_key_json_ascii_index = { "key_zero_price": "90", "key_clean_price": "67", "key_combination_pay": "112", "key_bank_card": "113", "key_weChatpay": "114", "key_alipay": "115", "key_scan_code": "116", "key_stored_card": "117", "key_cash": "118", "key_product_code": "119", "key_card_read": "192", "key_fast_collect": "75", "key_print": "80", "key_minus_num": "109", "key_add_num": "107", "key_settlement": "32", "key_select_member": "88", "key_pending": "72", "key_recharge": "82", "key_delete": "68", "key_change_price": "71", "key_discount": "79", "key_num": "78", "key_close_window": "83", "key_setting": "74", "key_member": "77" };
    var shortcut_key_arr; // 快捷键设置读取
    var shortcut_key_json_ascii = { "32": "key_settlement", "49": "key_combination_pay", "50": "key_bank_card", "51": "key_weChatpay", "52": "key_alipay", "53": "key_scan_code", "54": "key_stored_card", "55": "key_cash", "67": "key_clean_price", "68": "key_delete", "71": "key_change_price", "72": "key_pending", "74": "key_setting", "75": "key_fast_collect", "78": "key_num", "79": "key_discount", "80": "key_print", "82": "key_recharge", "83": "key_close_window", "84": "key_product_code", "88": "key_select_member", "90": "key_zero_price", "107": "key_add_num", "109": "key_minus_num", "112": "key_combination_pay", "113": "key_bank_card", "114": "key_weChatpay", "115": "key_alipay", "116": "key_scan_code", "117": "key_stored_card", "118": "key_cash", "119": "key_product_code", "192": "key_card_read", "77": "key_member" }; // 快捷键设置json
    var shortcut_key_json_ascii_index = { "key_zero_price": "90", "key_clean_price": "67", "key_combination_pay": "112", "key_bank_card": "113", "key_weChatpay": "114", "key_alipay": "115", "key_scan_code": "116", "key_stored_card": "117", "key_cash": "118", "key_product_code": "119", "key_card_read": "192", "key_fast_collect": "75", "key_print": "80", "key_minus_num": "109", "key_add_num": "107", "key_settlement": "32", "key_select_member": "88", "key_pending": "72", "key_recharge": "82", "key_delete": "68", "key_change_price": "71", "key_discount": "79", "key_num": "78", "key_close_window": "83", "key_setting": "74", "key_member": "77" };
    var shortcut_key_user_config_id;   // 快捷键配置主键Id
    var shortcut_key_user_module_id;  // 快捷键模块主键Id
    var key_arr_str = ["key_zero_price", "key_clean_price", "key_combination_pay", "key_bank_card", "key_weChatpay", "key_alipay", "key_scan_code", "key_stored_card", "key_cash", "key_product_code", "key_card_read", "key_fast_collect", "key_print", "key_minus_num", "key_add_num", "key_settlement", "key_select_member", "key_pending", "key_recharge", "key_delete", "key_change_price", "key_discount", "key_num", "key_close_window", "key_setting", "key_member"];
    var shortcut_key_json_str = { "key_zero_price": "z", "key_clean_price": "c", "key_combination_pay": "f1", "key_bank_card": "f2", "key_weChatpay": "f3", "key_alipay": "f4", "key_scan_code": "f5", "key_stored_card": "f6", "key_cash": "f7", "key_product_code": "f8", "key_card_read": "numbersign", "key_fast_collect": "k", "key_print": "p", "key_minus_num": "-", "key_add_num": "+", "key_settlement": "space", "key_select_member": "x", "key_pending": "h", "key_recharge": "r", "key_delete": "d", "key_change_price": "g", "key_discount": "o", "key_num": "n", "key_close_window": "s", "key_setting": "j", "key_member": "m" }; // 快捷键
    var sv_user_configdetail_key_id; // 快捷键主键id
    var count = 42;
    //全局是否代理商客户标识
    var _g_is_distributor_customer = false;
    //-----------------------IC卡
    var _g_is_ic_flag = false;
    var _g_is_ic_userid = "";
    var _g_is_ic_pwd = "";
    var _g_is_ic_type = "0";//IC卡通讯硬件设备类型
    //=======================IC卡
    var Is_open_commission = false;
    var sv_enable_wechatpay = false; // 是否开启微信支付
    var sv_enable_alipay = false; // 是否开启支付宝支付
    var sv_current_operato = "";
    var user_id; // 店铺Id
    var moduleConfigList = "";//营销活动配置
    var is_open_print = "";


    // ====================== 打印配置
    var receptionPtNum = 1; // 前台打印份数
    var receptionPtName;  // 前台打印机名字
    var backstagePtNum = 0; // 后台打印份数
    var backstagePtName; // 后台打印机名字
    var printSet_network_enable = false; // 是否启用后台打印机
    var printSet_network_device_font_islabel = false; // 前台打印机是否为标签打印机
    var printSet_network_device_back_islabel = false; // 后台打印机是否为标签打印机
    var printSet_network_devive_isandroid_enable = false;//是否启用安卓环境打印

    // ====================== 打印配置
    // ====================== 分屏配置
    var hardware_secondscreen_value = ""; // 分屏参数
    var hardware_secondscreen_enable = false; // 是否启用分屏
    // ====================== 分屏配置
    // ====================== 客显配置
    var hardware_cusdisplay_port = ""; // 客显参数 - 端口
    var hardware_cusdisplay_baud = ""; // 客显参数 - 波特率
    var hardware_cusdisplay_enable = false; // 是否启用客显
    // ====================== 客显配置

    var Is_verify_store_version = true;//验证版本权限
    var verify_distributor_id = 1;
    var isOpenMicroMall = false;//是否开启微信商城分店
    var IsStore = false;//是否分店
    //-----------------------用户信息
    var _g_user_config = '';
    var decerpLogoUrl_270 = "/images/logo.jpg"; // 左侧Logo
    var decerpLogoUrl_80 = "/images/dklogo.png"; // 我的店铺LOGO
    var _g_sv_uit_cache_name; // 行业缓存名称

    //=======================用户信息
    $(document).ready(function () {
        addUserFeedback();
        $('#userLogOut').click(function () {
            $.post('/AjaxUser/LogOut', null, function (data) {
                if (_g_is_distributor_customer || verify_distributor_id == 100) {
                    location.href = '/Dealerlogin.html';

                } else {
                    location.href = '/login.html';
                }
            });
        });

        $.ajax({
            url: '/Ajaxdata/Islogin?ISD=' + new Date(),
            async: false,
            cache: true,
            success: function (d) {
                _g_sv_uit_cache_name = d.sv_uit_cache_name;
                //-----------------
                //try {
                //    var socket = io('http://139.196.24.17:3000');
                _g_user_config = d;
                //    socket.on('common_connect', function (data) {
                //        if (d != -1) {
                //            socket.emit('i_' + data.sid, _g_user_config);
                //        }
                //    });
                //} catch (e) {
                //}
                //=================
                user_id = d.user_id;
                sv_enable_wechatpay = d.sv_enable_wechatpay;
                sv_enable_alipay = d.sv_enable_alipay;
                moduleConfigList = d.moduleConfigList;
                is_open_print = d.is_open_print;
                Is_verify_store_version = d.sv_versionid == 1 ? true : false;
                verify_distributor_id = d.distributor_id;
                isOpenMicroMall = d.is_open_micromall;
                IsStore = d.isStore;
                if (d == -1) {
                    window.location.href = "/login.html";
                } else {
                    if (d.isStore == true) {
                        $("#IsStorePwd").hide();
                    }
                    //检查IC卡
                    //检查IC卡配置
                    //检查IC卡配置
                    PreferentialTopUpGivingConfigList("SetTardware", "SetTardware_type");
                    var sv_config_is_enable = false;
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        sv_config_is_enable = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable;
                        _g_is_ic_type = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                    }
                    //IC卡密码
                    PreferentialTopUpGivingConfigList("SetTardware", "SetTardware_pwd");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        _g_is_ic_pwd = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                    }

                    if (sv_config_is_enable) {
                        var c_ = typeof Cef;
                        if (c_ !== "undefined") {
                            _g_is_ic_flag = true;
                            _g_is_ic_userid = d.user_id;
                            if (_g_is_ic_type == 1) {
                                _g_is_ic_pwd = GetICCardPwd(d.user_id);
                            }
                        }
                    }
                    if ((d.distributor_id != 1 || d.isStore == true) && d.distributor_id != 100) {
                        $("#IsonlineRenewal").hide();
                    }
                    // ----------------  读取打印配置（打印机打印份数）
                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_default");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        receptionPtNum = Preferential_TopUpGiving_ConfigList[0].sv_detail_value; // 前台打印份数
                    }

                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_default_device");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        receptionPtName = Preferential_TopUpGiving_ConfigList[0].sv_detail_value; // 前台打印机名字
                    }

                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_network_enable");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        printSet_network_enable = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable; // 是否启用后台打印机
                    }

                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_network");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        backstagePtNum = Preferential_TopUpGiving_ConfigList[0].sv_detail_value; // 前台打印份数
                    }

                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_network_device");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        backstagePtName = Preferential_TopUpGiving_ConfigList[0].sv_detail_value; // 后台打印机名字
                    }


                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_network_device_font_islabel");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        printSet_network_device_font_islabel = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable; // 前台标签打印机是否启用
                    }
                    PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_network_device_back_islabel");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        printSet_network_device_back_islabel = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable; // 后台标签打印机是否启用
                    }

                    // ----------------  读取打印配置（打印机打印份数）

                    // ----------------  读取分屏配置（读取分屏配置）
                    PreferentialTopUpGivingConfigList("Set_Hardware_SecondScreen", "Set_Hardware_SecondScreen_URL");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        hardware_secondscreen_enable = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable;
                        hardware_secondscreen_value = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                    }
                    if ((typeof Cef) !== "undefined") {
                        try {
                            if (hardware_secondscreen_enable)
                            {
                                //Cef.SecondScreenWithMutiImg("http://www.decerp.cn/Content/resource/img/lunbo_1.jpg,http://www.decerp.cn/Content/resource/img/lunbo_2.jpg,http://www.decerp.cn/Content/resource/img/lunbo_3.jpg,http://www.decerp.cn/Content/resource/img/lunbo_4.jpg");
                                Cef.SecondScreen(hardware_secondscreen_value);
                            } else {
                                Cef.SecondScreenClose();
                            }
                        } catch (e) {

                        }
                    }
                    // ----------------  读取分屏配置（读取分屏配置）

                    // ----------------  读取客显配置（读取客显配置）
                    PreferentialTopUpGivingConfigList("Set_Hardware_CusDisplay", "Set_Hardware_CusDisplay_Port");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        hardware_cusdisplay_enable = Preferential_TopUpGiving_ConfigList[0].sv_detail_is_enable;
                        hardware_cusdisplay_port = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                    }
                    PreferentialTopUpGivingConfigList("Set_Hardware_CusDisplay", "Set_Hardware_CusDisplay_Baud");

                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        hardware_cusdisplay_baud = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                    }
                    // ----------------  读取客显配置（读取客显配置）

                    // ----------------  读取快捷键配置（读取快捷键配置）
                    PreferentialTopUpGivingConfigList("Set_SysFastKey", "Set_SysFastKey_Config");
                    if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                        shortcut_key_arr = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                        sv_user_configdetail_key_id = Preferential_TopUpGiving_ConfigList[0].sv_user_configdetail_id; // 快捷键主键Id
                        shortcut_key_user_config_id = Preferential_TopUpGiving_ConfigList[0].sv_user_config_id;
                        shortcut_key_user_module_id = Preferential_TopUpGiving_ConfigList[0].sv_user_module_id;
                        if (shortcut_key_arr != null && shortcut_key_arr != '' && shortcut_key_arr != undefined) {
                            shortcut_key_arr = shortcut_key_arr.split(",");
                            for (var i = 0; i < shortcut_key_arr.length; i++) {
                                shortcut_key_json_ascii[shortcut_key_arr[i]] = key_arr_str[i];
                                shortcut_key_json_str[key_arr_str[i]] = shortcut_key_json[shortcut_key_arr[i]];
                                shortcut_key_json_ascii_index[key_arr_str[i]] = shortcut_key_arr[i];
                            }
                        }
                    }
                    else {
                        for (var i = 0; i < moduleConfigList.length; i++) {
                            if (moduleConfigList[i].sv_user_module_code == "Set_SysFastKey") {
                                shortcut_key_user_config_id = moduleConfigList[i].childInfolist[0].sv_user_config_id;
                                shortcut_key_user_module_id = moduleConfigList[i].sv_user_module_id;
                            }
                        }
                    }
                    // ----------------  读取快捷键配置（读取快捷键配置）

                    Is_open_commission = d.sv_isopen_commission;
                    sv_current_operato = d.sv_code_Name;
                    $(".operatorid").text("操作员：" + sv_current_operato);

                    // LOGO 
                    if (d.sv_dc_websitelogo != null && d.sv_dc_websitelogo != '' && d.sv_dc_websitelogo != undefined) {
                        decerpLogoUrl_270 = d.sv_dc_websitelogo; // 左侧Logo
                        decerpLogoUrl_80 = d.sv_dc_websitelogo; // 我的店铺LOGO

                    } else {
                        decerpLogoUrl_270 = "/images/agentLogo_270.jpg"; // 左侧Logo
                        decerpLogoUrl_80 = "/images/agentLogo_80.png"; // 我的店铺LOGO
                    }
                    // LOGO

                    if (d.distributor_id != 1 && d.distributor_id != 100) {
                        //---经销商客户过滤---------------
                        //隐藏QQ技术支持
                        $(".floatCtro").hide();
                        $("#IsonlineRenewal").hide();
                        $(".dropdown.bzzxws.am-san-jian-top").hide();
                        _g_is_distributor_customer = true;
                    } else {
                        $(".dropdown.bzzxws.am-san-jian-top").show();
                    }
                    $("#username").text(d.sv_us_name);
                    $("#dianzhu").text(d.sv_ul_name);
                    $('#postion').text(d.sp_grouping_name);
                    if (isNullOrWhiteSpace(d.sv_us_logo)) {
                        $('#userImg').attr('src', 'http://decerp.cc' + d.sv_us_logo);
                    }
                    if (isNullOrWhiteSpace(d.sv_store_logo)) {
                        $("#logoid").attr('src', 'http://decerp.cc' + d.sv_store_logo);
                    }
                    else {
                        $("#logoid").attr('src', decerpLogoUrl_270);
                    }
                }
            }
        });

        // 处理异常图片
        $('#logoid').error(function () {
            $(this).attr('src', decerpLogoUrl_270);
        });

        //左边收银框高度
        var $winhei = $(window).height();
        $('.naflet').height($winhei - 93);
        var $nafle = $('.naflet').height();
        $('.bdtext').height($nafle - 48);
        var $bdthei = $('.bdtext').height();
        $('.Cashlefsit').height($bdthei - 242);
        // 右边的收银框高度

        var width = $(window).width();

        if (width >= 1500 && width < 1697) {
            count = 30;
        } else if (width > 1280 && width < 1500) {
            count = 24;
        } else if (width >= 1270 && width <= 1280) {
            count = 20;
        } else if (width > 960 && width < 1270) {
            count = 15;
        } else if (width > 900 && width <= 960) {
            count = 15;
        } else if (width <= 900) {
            count = 8;

        }
        // 右边的收银框高度
        $('.nafrigh').height($nafle);

        getMessageBox(user_id);

        setInterval(function () {
            getMessageBox(user_id);
        }, 60000);
    });

    // 弹出消息窗口
    $(document).on('click', '#btnShowMesssageBox', function () {
        if ($('#showSystemMsg').hasClass('open')) {
            $('#showSystemMsg').css('display', 'none');
            $('#showSystemMsg').removeClass('open');
        }
        else {
            $('#showSystemMsg').addClass('open');
            $('#showSystemMsg').css('display', 'block');
            setTimeout(function () {
                $('#showSystemMsg').css('display', 'none');
            }, 3000);
        }
    });

    function getMessageBox(user_id) {
        $.getAsyncJson('/MessageBox/InstantMessage', {
                userId: user_id
            }
            , function (result) {
                var messagehtml = '';
                if (result.succeed && result.values != null && result.values != '') {
                    var data = result.values;
                    for (var i = 0; i < data.length; i++) {
                        messagehtml += '<li><a href="/news/MessageHint"><i>' + data[i].sv_message_content + '</i><strong>' + data[i].sv_created_by + '</strong></a></li>';
                    }
                    messagehtml += '<li><a href="/news/MessageHint">更多消息</a></li>';
                    $('#messagehtml').html(messagehtml);
                    $('#Messagenumber').html(result.errmsg);
                }
                else {
                    $('#btnShowMesssageBox').attr('href', '/news/MessageHint');
                }
            });
    }
    //---------------IC公共方法--------------
    //获取店铺IC卡的秘钥
    function GetICCardPwd(userid) {
        return userid.substring(0, 6);
    }

    //绑定IC卡事件
    function bindICCardEvent(icobj) {
        var c_ = typeof Cef;
        if (c_ !== "undefined") {
            icobj.keydown(function (e) {
                GetICCardEventData(icobj, e);
            });
        }
    }
    //读取IC卡数据
    function GetICCardEventData(icobj, e) {
        if (_g_is_ic_flag && e.keyCode == 113) {
            try {
                //var data = Cef.ReadICCardNoWithPwd(_g_is_ic_pwd);
                var data = { Success: false, Message: "" };
                if (_g_is_ic_type == 1) {
                    data = Cef.ReadICCardNoWithPwd(_g_is_ic_pwd, true);
                } else if (_g_is_ic_type == 0) {
                    data = Cef.URFReadCardNo(_g_is_ic_pwd);
                }
                var result = JSON.parse(data);
                if (result) {
                    if (result.Success || result.Success == "true" || result.Success == "True") {
                        var len = parseInt(result.Message.substring(0, 2));
                        icobj.val(result.Message.substring(2, len + 2));
                    } else {
                        layer.msg("读卡失败：" + result.Message);
                    }
                }
            } catch (e) {
            }
        }
    }

    //---------------IC公共方法--------------
</script>
<!-------------------am--------------------->
<script>
    $('.am-img1').click(function () {

        $('.am-file1').click();

    })
    function amfile(t) {
        $('.am-show1').css('display', 'block');
        $('.am-p1').text(t.value);
        $('.am-help1').fadeIn();

    }

    $('.am-san-jian-top').on("click", function () {
        if ($(".am-help1").css("display") == "none") {
            $('.am-help1').fadeIn();
        } else {
            $('.am-help1').fadeOut();
        }
    });

    $('.win7').click(function () {
        $('.am-help1').fadeOut();
    })
    $('.am-loger1').click(function () {
        $('.am-help1').fadeOut();
    })

    $('.am-returnfalse').click(function () {

    })
</script>

<script>
    var totak = '';
    function ajax(url, fnSucc, fnFaild) {
        //1.创建Ajax对象
        if (window.XMLHttpRequest) {
            var oAjax = new XMLHttpRequest();
        }
        else {
            var oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //2.连接服务器
        //open(方法, 文件名, 异步传输)
        oAjax.open('Post', url, true);

        //3.发送请求
        oAjax.send();

        //4.接收返回
        oAjax.onreadystatechange = function () {
            //oAjax.readyState	//浏览器和服务器，进行到哪一步了
            if (oAjax.readyState == 4)	//读取完成
            {
                if (oAjax.status == 200)	//成功
                {
                    fnSucc(oAjax.responseText);
                    totak = oAjax.responseText;
                    totak = JSON.parse(totak);
                    paging(totak);
                }
                else {
                    if (fnFaild) {
                        fnFaild(oAjax.status);
                    }
                    //alert('失败:'+oAjax.status);
                }
            }
        };
    }





</script>




<script src="settle/decerp.print.js"></script>
<script src="settle/collect2.js"></script>
<script src="settle/decerp.common.js"></script>

<script>
    if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
        //仅在Android真机环境下工作，需启用安卓环境下的打印
        if (true || printSet_network_devive_isandroid_enable)
        {
            document.write('<scri' + 'pt type="text/javascript" src="/cordova.js"></s' + 'cript>');
        }
    }
</script>
<script>
    $(top.hangge());//关闭加载状态
</script>

</body></html>


