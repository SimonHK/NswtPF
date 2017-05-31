/// <reference path="../html/system/changepwd.html" />
/// <reference path="../html/system/changepwd.html" />
/// <reference path="../html/system/changepwd.html" />
//tip效果
$(document).on("mouseover", ".tips", function () {

    index = layer.tips($(this).data("content"), $(this), {
        tips: [2, '#ffefe3'],
        style: ['background-color:#FFF8ED; color:#000; border:1px solid #FF9900', '#FF9900'],
        maxWidth: 440,
        time: 6000
    });
});
////登录相关操作方法
loggin = {

    chklogn: function (type) {
        if (type == -1) {
            layer.alert("登录已失效，请重新登录！", function () { window.location.href = "/login.html"; });
            return;
        }

    }

};

//时间 加天数
Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz
    laydate.skin('molv');//主题皮肤
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
var dijige = 0;
//仓库相关的
var warehouse = {

    //供应商管理
    supplier: function () {
        getpage("");

        function getpage(key) {

            //初始化分页内容
            $.get("/supplier/suppliercount?key=" + key, function (data) {
                loggin.chklogn(data);
                // $("#User_cout").text(data);
                var i = Math.ceil(data / 5);
                laypage({
                    cont: $('#pageGro'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: i, //总页数
                    skin: 'molv', //皮肤
                    first: '首页', //若不显示，设置false即可
                    last: '尾页', //若不显示，设置false即可
                    prev: '上一页', //若不显示，设置false即可
                    next: '下一页', //若不显示，设置false即可
                    jump: function (e, first) {

                        crts(e.curr, key);

                    }
                });
            });
        }

        //默认加载数据
        function crts(id, key) {
            $.getJSON("/supplier/supplierlist?id=" + id + "&key=" + key, function (data) {
                loggin.chklogn(data);
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i].sv_suaddtime).Format("yyyy-MM-dd hh:mm:ss");
                    html += '<tr><td><div class="check-box "><i><input type="checkbox" name="subbox" value="' + data[i].sv_suid + '"></i></div></td> ';
                    if (isNullOrWhiteSpace(data[i].sv_suname)) {
                        html += '<td class="cour"><span data-id="' + data[i].sv_suid + '" class="showinfo" >' + data[i].sv_suname + '</span></td>';
                    }
                    else {
                        html += '<td class="cour"><span data-id="' + data[i].sv_suid + '" class="showinfo" ></span></td>';
                    }
                    //html += ' <td><i>¥' + data[i].sv_suarrears + '</i></td> ';
                    if (isNullOrWhiteSpace(data[i].sv_sulinkmnm)) {
                        html += '<td><span>' + data[i].sv_sulinkmnm + '</span></td>';
                    }
                    else {
                        html += '<td><span></span></td>';
                    }
                    if (isNullOrWhiteSpace(data[i].sv_sumoble)) {
                        html += '<td><span>' + data[i].sv_sumoble + '</span></td>';
                    }
                    else {
                        html += '<td><span></span></td>';
                    }
                    html += '<td><span>' + date + '</span></td>';
                    if (isNullOrWhiteSpace(data[i].sv_suoperation)) {
                        html += '<td><span>' + data[i].sv_suoperation + '</span></td></tr>';
                    }
                    else {
                        html += '<td><span></span></td></tr>';
                    }
                }
                $("#newwlist").html(html);
            });
        }


        $(document).on("click", ".showinfo", function () {
            dijige = $(this).data("id");
            Deke.DeKe_dialog.show_Url2('供应商详细信息', '/html/supplier/viewinfo.html?v=17', supplierGet, ['670px', '540px']);

        });

        $(document).on("click", "#supplierBaochun", function () {

            //
            if ($("#sv_suname").val().length < 2) {
                layer.msg("请输入供应商的名字");
                $("#sv_suname").focus();
                return;
            }
            //
            if ($("#sv_sulinkmnm").val().length < 2) {
                layer.msg("请输入联系人的名字");
                $("#sv_sulinkmnm").focus();
                return;
            }

            if ($("#sv_sumoble").val().length < 2) {
                layer.msg("请输入联系电话");
                $("#sv_sumoble").focus();
                return;
            }

            $.ajax({
                url: '/supplier/Addsupplier',
                type: 'post',
                data: JSON.stringify($("#addsupplier").serializeArray()),
                contentType: 'application/json',
                async: false,
                success: function (data) {
                    loggin.chklogn(data);
                    // alert(data);
                    if (data == 1) {
                        getpage('');
                        var index = layer.confirm("供应商操作成功，是否继续操作？", { btn: ["关闭", "继续操作"] },
                              function () {
                                  layer.closeAll();
                              },
                              function () {

                                  layer.close(index);
                              });
                    } else if (data == -2) {
                        layer.msg("供应商已经存在记录中");
                        layer.close(index);
                    }
                    else if (data == -4) {
                        layer.msg("你没有该操作权限");
                        layer.close(index);
                    }
                    else {
                        layer.msg("供应商操作失败，请刷新重试");
                        layer.close(index);
                    }
                }
            });


        });

        //修改供应商
        $("#update").click(function () {

            if ($('input[name="subbox"]:checked').length == 1) {

                Deke.DeKe_dialog.show_Url2('修改供应商', '/html/supplier/editinfo.html?v=15', supplierGet, ['420px', '540px']);

            } else {

                layer.msg("请先择您要修改的供应商，不能选择多个！");
            }
        });

        $("#query_like").keyup(function () {

            getpage($("#query_like").val());
        });

        $("#refresh").click(function () {
            getpage($("#query_like").val());
        });

        //删除供应商
        $("[data-name='delete']").click(function () {

            if ($('input[name="subbox"]:checked').length == 1) {

                //  Deke.DeKe_dialog.show_Url2('修改供应商', '/html/supplier/editinfo.html?v=15', supplierGet, ['420px', '540px']);
                layer.confirm("您确认要删除先中的供应商吗？", function () {

                    $.post("/supplier/supplierdelete", { id: $('input[name="subbox"]:checked').val() }, function (data) {
                        loggin.chklogn(data);
                        if (data == -1) {
                            layer.alert("登录已失效，请重新登录！");
                            window.location.href = "/login.html";
                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限");
                        }
                        else {
                            layer.msg("删除成功");
                            getpage('');

                        }
                    });

                });

            } else {

                layer.msg("请先择您要修改的供应商，不能选择多个！");
            }
        });
        //
        function supplierGet() {

            if (dijige == 0) {
                dijige = $('input[name="subbox"]:checked').val();
            } else {

                $("#jilulist").html("");
                $("#chchchchchcch").data("id", dijige);

                $.getJSON("/supplier/getsupplierlog?logid=" + $("#chchchchchcch").data("id"), function (data) {
                    for (i = 0; i < data.length; i++) {
                        $("#jilulist").append('<tr><td><span>' + (i + 1) + '</span></td> <td><span>' + new Date(data[i].sv_pc_date).Format("yyyy-MM-dd") + '</span></td><td><span>' + data[i].sv_p_name + '</span></td><td><span>' + data[i].sv_p_unit + '</span></td><td><span>' + data[i].sv_pc_pnumber + '</span></td><td><i>' + data[i].sv_pc_price + '</i></td> </tr>');
                    }

                    $("#gongcjjososos").text(data.length);

                });
                //会员详细信息移动TAB事件
                $('#xqtabbox li').hover(function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    var index = $('#xqtabbox li').index(this);
                    $('.reclxqtab>div').eq(index).fadeIn(50).siblings().fadeOut(0);

                });

                $("#chchchchchcch").keydown(function (e) {
                    if (e.keyCode == "13") {
                        $("#jilulist").html("");
                        $.getJSON("/supplier/getsupplierlog?logid=" + $("#chchchchchcch").data("id") + "&key=" + $(this).val(), function (data) {
                            for (i = 0; i < data.length; i++) {
                                $("#jilulist").append('<tr><td><span>' + (i + 1) + '</span></td> <td><span>' + new Date(data[i].sv_pc_date).Format("yyyy-MM-dd") + '</span></td><td><span>' + data[i].sv_p_name + '</span></td><td><span>' + data[i].sv_p_unit + '</span></td><td><span>' + data[i].sv_pc_pnumber + '</span></td><td><i>' + data[i].sv_pc_price + '</i></td> </tr>');
                            }
                            $("#gongcjjososos").text(data.length);


                        });
                    }
                });


            }
            $.get("/supplier/supplierlist?pp=" + dijige, function (data) {
                loggin.chklogn(data);
                for (var key in data) {
                    if (key == "sv_mr_birthday") {

                        var t = new Date(data[key]).Format("yyyy-MM-dd");
                        if (t == "1-01-01") {
                            t = "";
                        }
                        $("#" + key).val(t);
                        $("." + key).text(t);

                    } else {
                        $("." + key).text(data[key]);
                        $("#" + key).val(data[key]);
                    }
                }

                //   GetUserdata = data;
                dijige = 0;
            });
        }


    },
    //采购页面，采购相关
    procurement: function () {



        //初始货供应商
    }



};



//系统配置专用
//USer即会员配置
var System = {
    User: function () {
        MemberSharedOperate(-1, "", 0);
        //店铺信息
        $.getJSON("/AjaxUser/GetUserinfo/", function(data) {
            if (data)
            {
                loggin.chklogn(data);
                if (!data.isStore)
                {
                    $("#OperateMembersShare").show();
                } else
                {
                    $("#OperateMembersShare").hide();
                }
                var _strname = "";
                if (data.sv_branchrelation == 2)
                {
                    _strname = "crossShopEdit";
                } else if (data.sv_branchrelation == 3)
                {
                    _strname = "crossShopConsume";
                }
                MemberSharedOperate(data.sv_branchrelation, _strname, 1);
            }
        });
        //加载积分 
        var jibie = '<div class="mod"><span>当顾客积分在</span><input type="text" name="sv_ml_initpoint"  value="@sv_ml_initpoint" class="mintext" /><span>到</span> <input name="sv_ml_endpoint" value="@sv_ml_endpoint" type="text" class="mintext" /> <span>之间,</span> <span>可享受</span> <input type="text" name="sv_ml_commondiscount" value="@sv_ml_commondiscount" class="mintext" /> <span>折优惠，</span><span>会员等级</span><input type="text" name="sv_ml_name" value="@sv_ml_name" class="mintext form-control" /> <a href="javascript:void(0);" class="delelable" data-id="@id">删除</a></div>';
        var fengzhu = '<a href="javascript:void(0)" class="klisos" data-id="@id" data-name="@dname"> <span>@name</span><i class="poriss  icon-edit faengzhuedit" ></i><em class="porvv icon-trash rovierw"  ></em></a>';
        var biaoqian = '<div class="bq_pssos bg-bule" style="background-color:@color;"> <img src="/images/tag-cover.png" class="tag-mask"><span class="tagInfo">@name</span><img src="/images/tag-delete.png" height="8" class="del-tags" data-id="@id"> </div>';
        $.getJSON("/system/GetUserPage", function (data) {
            if (data) {

                //设置积分
                $("#jifen_M").val(data.sv_uc_pointtocashset[0]);
                $("#jifen").val(data.sv_uc_pointtocashset[1]);

                //  alert(JSON.stringify(data));
                if (!data.GetUserLevel)
                {
                    data.GetUserLevel = data.getUserLevel;
                }


                if (!data.GetMembergroup)
                {
                    data.GetMembergroup = data.getMembergroup;
                }

                if (!data.GetSv_membertag)
                {
                    data.GetSv_membertag = data.getSv_membertag;
                }

                //级别处理
                for (var i = 0; i < data.GetUserLevel.length; i++)
                {
                    $("#jibie").append(jibie.replace("@sv_ml_initpoint", data.GetUserLevel[i].sv_ml_initpoint).replace("@sv_ml_endpoint", data.GetUserLevel[i].sv_ml_endpoint).replace("@sv_ml_commondiscount", data.GetUserLevel[i].sv_ml_commondiscount).replace("@sv_ml_name", data.GetUserLevel[i].sv_ml_name).replace("@id", data.GetUserLevel[i].memberlevel_id));
                }

                for (var i = 0; i < data.GetMembergroup.length; i++)
                {
                    $("#fengzhu").append(fengzhu.replace("@name", data.GetMembergroup[i].sv_mg_name).replace("@id", data.GetMembergroup[i].membergroup_id));
                }

                for (var i = 0; i < data.sv_uc_callnameList.length; i++)
                {
                    $("#chengwei").append(fengzhu.replace("@name", data.sv_uc_callnameList[i]).replace("@id", 0).replace("@dname", "chengwei"));
                }

                for (var i = 0; i < data.GetSv_membertag.length; i++)
                {
                    $("#tag").append(biaoqian.replace("@color", data.GetSv_membertag[i].sv_mt_color).replace("@name", data.GetSv_membertag[i].sv_mt_name).replace("@id", data.GetSv_membertag[i].membertag_id));
                    //sv_mr_name
                }
                $("#fengzhucount").text(data.GetMembergroup.length);
                $("#chengweicount").text(data.sv_uc_callnameList.length);
                $("#tagcount").text(data.GetSv_membertag.length);
                //放在里面执行
                $("#jiebieadd").click(function() {
                    if ($("#jibie div").length < 20)
                    {
                        $("#jibie").append(jibie.replace("@sv_ml_initpoint", 0).replace("@sv_ml_endpoint", 0).replace("@sv_ml_commondiscount", 0).replace("@sv_ml_name", "").replace("@id", 0));
                    } else
                    {
                        layer.msg("会员等级最多支持20个");
                        layer.close(index);
                    }
                });
                //删除级别

                ///
                $("#baochunjibie").click(function() {
                    var bols = true;
                    var jiebiedata = "[";
                    var j = 0;
                    $("#jibie >div").each(function(i) {
                        var thisDiscount = parseFloat($(this).find("input[name='sv_ml_commondiscount']").val());
                        if (thisDiscount < 0 || thisDiscount > 10)
                        {
                            $(this).find("input[name='sv_ml_commondiscount']").focus();
                            layer.msg("会员折扣只能输入0--10");
                            bols = false;
                            return;
                        }
                        if (parseInt($(this).find("input[name='sv_ml_initpoint']").val()) >= parseInt($(this).find("input[name='sv_ml_endpoint']").val()))
                        {
                            $(this).find("input[name='sv_ml_initpoint']").focus();
                            layer.msg("左边的积分不能大于或等于右边的积分");
                            bols = false;
                            return;
                        }

                        if (i > 0)
                        {
                            //和前一配置对比，检查是否存在重合
                            var c_min = parseInt($(this).find("input[name='sv_ml_initpoint']").val());
                            var c_max = parseInt($(this).find("input[name='sv_ml_endpoint']").val());
                            for (var ii = 0; ii < $("#jibie >div").length; ii++)
                            {
                                if (i !== ii)
                                {
                                    var lc_min = parseInt($($("#jibie >div")[ii]).find("input[name='sv_ml_initpoint']").val());
                                    var lc_max = parseInt($($("#jibie >div")[ii]).find("input[name='sv_ml_endpoint']").val())

                                    if ((c_min >= lc_min && c_min <= lc_max) || (c_max >= lc_min && c_max <= lc_max))
                                    {
                                        layer.msg("注意:该级积分被包含于其他会员等级");
                                        if ((c_min >= lc_min && c_min <= lc_max))
                                        {
                                            $(this).find("input[name='sv_ml_initpoint']").focus();
                                        } else
                                        {
                                            $(this).find("input[name='sv_ml_endpoint']").focus();
                                        }
                                        bols = false;
                                        return;
                                    }
                                }
                            }
                        }

                        if ($(this).find("input[name='sv_ml_name']").val() == "")
                        {
                            layer.msg("请输入级别名字");
                            $(this).find("input[name='sv_ml_name']").focus();
                            bols = false;
                            return;
                        }
                        jiebiedata += '{"sv_ml_initpoint":' + $(this).find("input[name='sv_ml_initpoint']").val() + ',"sv_ml_endpoint":' + $(this).find("input[name='sv_ml_endpoint']").val() + ',"sv_ml_name":"' + $(this).find("input[name='sv_ml_name']").val() + '","memberlevel_id":' + $(this).find(".delelable").data("id") + ',"sv_ml_commondiscount":' + $(this).find("input[name='sv_ml_commondiscount']").val() + '},';
                        j++;
                    });

                    jiebiedata += "]";
                    if (bols)
                    {
                        if (j <= 20)
                        {
                            $.ajax({
                                url: "/System/Update_Live",
                                data: jiebiedata,
                                type: "POST",
                                contentType: "application/json",
                                success: function(result) {
                                    if (result == true)
                                    {
                                        layer.msg("修改成功~");
                                    }
                                    else if (result == -2)
                                    {
                                        layer.msg("你没有该操作权限！");
                                        layer.close(index);
                                    } else if (result == -1)
                                    {
                                        layer.msg("会员等级最多支持20个,请重新操作");
                                        layer.close(index);
                                    }
                                    else
                                    {
                                        layer.msg("添加员会失败，请刷新重试");
                                        layer.close(index);
                                    }
                                }
                            });
                        } else
                        {
                            layer.msg("会员等级最多支持20个,请重新操作");
                            layer.close(index);
                        }
                    }

                });
            }
        });

        $(document).on("click", ".delelable", function () {
            var delelablename = $(this);
            var levelNumber = $(".delelable").length;
            if (levelNumber > 1) {
                layer.confirm("确认要删除选中的级别吗，该级别的会员都会转移到默认第一个级别！", function () {

                    if (delelablename.data("id") == 0) {
                        layer.closeAll();
                        delelablename.parent().remove();
                    } else {
                        layer.load();
                        $.post("/System/Update_dalete", { id: delelablename.data("id") }, function (data) {
                            if (data == true) {
                                layer.closeAll();
                                delelablename.parent().remove();
                            }
                            else if (data == -2) {
                                layer.closeAll();
                                layer.msg("你没有该操作权限！");
                            }
                            else {

                                layer.closeAll();
                                layer.msg("删除级别失败,最后一个等级不能删除,请修改！");
                            }
                        });
                    }
                });
            } else {
                layer.msg("最后一个等级不能删除,请修改！");
            }
        });

        //称谓，分级的删除

        $(document).on("click", ".rovierw", function () {

            var thisname = $(this);

            layer.confirm("确认要删除吗？", function () {

                if (thisname.parent().data("id") == 0) {


                    layer.load();
                    $.post("/System/Update_chengwei", { id: 2, name: thisname.prev().prev().text(), name2: "" }, function (data) {
                        if (data.r == true) {
                            $("#chengwei").html("");
                            //  alert(JSON.stringify(data.sv_uc_callnameList));
                            for (var i = 0; i < data.sv_uc_callnameList.length; i++) {
                                $("#chengwei").append(fengzhu.replace("@name", data.sv_uc_callnameList[i]).replace("@id", 0).replace("@dname", "chengwei"));
                            }
                            $("#chengweicount").text(data.sv_uc_callnameList.length);
                            layer.closeAll();
                            layer.msg("称谓删除成功");

                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限！");
                            layer.closeAll();
                        }
                        else {
                            layer.msg("添加称谓失败");

                        }

                    });

                } else {

                    layer.load();
                    $.post("/System/Membergroup_dalete", { id: thisname.parent().data("id") }, function (data) {
                        layer.closeAll();
                        if (data == true) {

                            layer.msg("删除分组成功");
                            thisname.parent().remove();
                            $("#fengzhucount").text((parseInt($("#fengzhucount").text()) - 1));
                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限！");
                            layer.close();
                        }
                        else {
                            layer.msg("删除分组成功");

                        }
                    });
                }

            });
        });


        ///////////////////////////////标签模块//////////////////////////////////////////////
        $(document).on("click", "#addtag", function () {

            layer.prompt({
                title: '添加会员标签',
                formType: 3 //prompt风格，支持0-2
                , value2: '#db913d'
            }, function (pass, b, d, e) {

                // alert(e)
                layer.load();
                $.post("/System/Update_Tag", { id: 0, name: pass, color: e }, function (data) {
                    if (data.r == true) {
                        $("#tag").html("");
                        if (!data.GetSv_membertag) {
                            data.GetSv_membertag = data.getSv_membertag;
                        }
                        for (var i = 0; i < data.GetSv_membertag.length; i++) {
                            $("#tag").append(biaoqian.replace("@color", data.GetSv_membertag[i].sv_mt_color).replace("@name", data.GetSv_membertag[i].sv_mt_name).replace("@id", data.GetSv_membertag[i].membertag_id));
                            //sv_mr_name
                        }
                        $("#tagcount").text(data.GetSv_membertag.length);
                        layer.closeAll();
                        layer.msg("添加标签成功");

                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.closeAll();
                        layer.msg("添加标签失败");

                    }
                });
            });
        });
        //删除标签
        $(document).on("click", ".del-tags", function () {
            var delelablename = $(this);
            layer.confirm("确认要删除选中的标签吗？", function () {

                layer.load();
                $.post("/System/Update_Tag", { id: -1, name: delelablename.data("id") }, function (data) {
                    if (data.r == true) {
                        layer.closeAll();
                        delelablename.parent().remove();
                    } else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.msg("删除标签失败");

                    }
                });
            });

        });
        //////////////////////////////////////////////////////////////////////////////////////////////////
        //

        /*
        //添加会员分组
        //
        */
        $(document).on("click", "#fanzhuadd", function () {

            layer.prompt({
                title: '添加会员分组',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                layer.load();
                $.post("/System/Update_Membergroup", { id: 0, name: pass }, function (data) {
                    if (data.r == true) {
                        $("#fengzhu").html("");
                        if (!data.GetMembergroup) {
                            data.GetMembergroup = data.getMembergroup;
                        }
                        for (var i = 0; i < data.GetMembergroup.length; i++) {
                            $("#fengzhu").append(fengzhu.replace("@name", data.GetMembergroup[i].sv_mg_name).replace("@id", data.GetMembergroup[i].membergroup_id));
                        }
                        $("#fengzhucount").text(data.GetMembergroup.length);

                        layer.closeAll();
                        layer.msg("添加分组成功");

                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                        layer.closeAll();
                    }
                    else {
                        layer.msg("添加分组失败"); chengweiadd

                    }
                });
            });
        });

        /*
      //称谓添加
      //
      */
        //称谓添加
        $(document).on("click", "#chengweiadd", function () {

            layer.prompt({
                title: '添加会员称谓',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                layer.load();
                $.post("/System/Update_chengwei", { id: 0, name: pass, name2: "" }, function (data) {
                    if (data.r == true) {
                        $("#chengwei").html("");
                        //  alert(JSON.stringify(data.sv_uc_callnameList));
                        for (var i = 0; i < data.sv_uc_callnameList.length; i++) {
                            $("#chengwei").append(fengzhu.replace("@name", data.sv_uc_callnameList[i]).replace("@id", 0).replace("@dname", "chengwei"));
                        }
                        $("#chengweicount").text(data.sv_uc_callnameList.length);
                        layer.closeAll();
                        layer.msg("称谓添加改成功");

                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                        layer.closeAll();
                    }
                    else {
                        layer.msg("添加称谓失败");
                        layer.closeAll();
                    }
                });
            });
        });

        //
        //修改选中的分组
        $(document).on("click", ".faengzhuedit", function () {
            var ss = $(this).parent();
            var val = $(this).prev().text();
            layer.prompt({
                title: '修改选中的分组',
                value: val,
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {

                if (ss.data("name") == "chengwei") {
                    $.post("/System/Update_chengwei", { id: 1, name: pass, name2: val }, function (data) {
                        if (data.r == true) {
                            $("#chengwei").html("");
                            //  alert(JSON.stringify(data.sv_uc_callnameList));
                            for (var i = 0; i < data.sv_uc_callnameList.length; i++) {
                                $("#chengwei").append(fengzhu.replace("@name", data.sv_uc_callnameList[i]).replace("@id", 0).replace("@dname", "chengwei"));
                            }

                            $("#chengweicount").text(data.sv_uc_callnameList.length);

                            layer.closeAll();
                            layer.msg("称谓修改成功");

                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限！");
                            layer.close(index);
                        }
                        else {
                            layer.msg("添加分组失败");

                        }


                    });
                } else {

                    $.post("/System/Update_Membergroup", { id: ss.data("id"), name: pass }, function (data) {
                        if (data.r) {
                            $("#fengzhu").html("");

                            for (var i = 0; i < data.getMembergroup.length; i++) {
                                $("#fengzhu").append(fengzhu.replace("@name", data.getMembergroup[i].sv_mg_name).replace("@id", data.getMembergroup[i].membergroup_id));
                            }
                            $("#fengzhucount").text(data.getMembergroup.length);

                            layer.closeAll();
                            layer.msg("分组修改成功");

                        } else {
                            layer.msg("添加分组失败");

                        }


                    });

                }
            });
        });
        //消费积分规则
        $(document).on("click", "#serv_pointtocashset", function () {
            layer.confirm("确认要修改消费积分规则吗？", { btn: ["是的朕想好了", "没想好，不改了"], icon: 3 }, function () {
                var money = $("#jifen_M").val();
                var integralNum = $("#jifen").val();
                if (isNullOrWhiteSpace(money) && isNullOrWhiteSpace(integralNum)) {
                    if (parseInt(money) <= 0) {
                        $("#jifen_M").focus();
                        layer.msg("请输入正确的金额并且大于0！");
                        return;
                    }
                    if (parseInt(integralNum) <= 0){
                        $("#jifen").focus();
                        layer.msg("请输入正确的积分并且大于0！");
                        return;
                    }
                    $.post("/System/Update_Pointto", { jifen_M: money, jifen: integralNum }, function (data) {
                        if (data == true) {
                            layer.msg("保存成功，请继续操作！");
                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限！");
                        }
                        else {
                            layer.msg("保存失败！");
                        }
                    });
                }
                else {
                    layer.msg("请填写金额与兑换积分数量！");
                }
            });

        });

        //开关按钮事件
        $(document).on("click", ".swtith i", function () {
            var branchrelation = 0;
            var strname = "";
            //if ($(this).parents('.swtith').data("name") == "crossShopConsume" && $(".swtith[data-name='membersShare']").is(".open") && $(".swtith[data-name='crossShopEdit']").is(".open"))
            //{
            //    layer.msg("请先关闭跨店编辑");
            //    return false;
            //}
            strname = $(this).parents('.swtith').data("name");
            $.post("/System/MemberSharedOperate", { name: $(this).parents('.swtith').data("name"), valu: $(this).parents('.swtith').is(".open") }, function (data) {
                if (data.succeed) {
                    branchrelation = data.values;
                    layer.msg("保存成功，请继续操作！");
                }
                else if (!data.succeed) {
                    window.location.href = data.values;
                }
                else {
                    layer.msg("操作失败，请稍后重试！");
                }
                MemberSharedOperate(branchrelation, strname, 0);
                if (strname == "crossShopConsume" && $(".swtith[data-name='crossShopEdit']").is(".open")) {
                    $.post("/System/MemberSharedOperate", { name: "crossShopEdit", valu: false }, function (data) {
                        if (data.succeed) {
                            branchrelation = data.values;
                        }
                    });
                }
            });


        });
        //控制开关方法
        function MemberSharedOperate(branchrelation, name, type) {
            if (branchrelation == 1) {
                if (!$(".swtith[data-name='membersShare']").is(".open"))
                    $(".swtith[data-name='membersShare']").toggleClass('open');
                $(".swtith[data-name='membersShare']").parent().next().find("input").removeAttr("readonly", "readonly");
                $(".swtith[data-name='membersShare']").parent().next().find(".kkbtn").removeClass("disabled");
                $("#CrossShopSwitch").show();
            }
            else if (branchrelation == 2) {
                if (!$(".swtith[data-name='membersShare']").is(".open"))
                    $(".swtith[data-name='membersShare']").toggleClass('open');
                if (name == "crossShopConsume") {
                    if ($(".swtith[data-name='crossShopConsume']").is(".open"))
                        $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                }
                if (name == "crossShopEdit" && type == 1) {
                    $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                }
                if ($(".swtith[data-name='crossShopEdit']").is(".open"))
                    $(".swtith[data-name='crossShopEdit']").toggleClass('open');
                else
                    $(".swtith[data-name='crossShopEdit']").toggleClass('open');
                $("#CrossShopSwitch").show();
                $(".swtith[data-name='membersShare',data-name='crossShopEdit']").parent().next().find("input").removeAttr("readonly", "readonly");
                $(".swtith[data-name='membersShare',data-name='crossShopEdit']").parent().next().find(".kkbtn").removeClass("disabled");
            }
            else if (branchrelation == 3) {
                if (!$(".swtith[data-name='membersShare']").is(".open"))
                    $(".swtith[data-name='membersShare']").toggleClass('open');
                if (!$(".swtith[data-name='crossShopEdit']").is(".open"))
                    $(".swtith[data-name='crossShopEdit']").toggleClass('open');
                if ($(".swtith[data-name='crossShopConsume']").is(".open"))
                    $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                else
                    $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                $(".swtith[data-name='membersShare',data-name='crossShopConsume']").parent().next().find("input").removeAttr("readonly", "readonly");
                $(".swtith[data-name='membersShare',data-name='crossShopConsume']").parent().next().find(".kkbtn").removeClass("disabled");
                $("#CrossShopSwitch").show();

            } else if (branchrelation == 4) {
                if (name == "crossShopConsume") {
                    if ($(".swtith[data-name='crossShopConsume']").is(".open"))
                        $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                }
                if (name == "crossShopEdit") {
                    if ($(".swtith[data-name='crossShopEdit']").is(".open"))
                        $(".swtith[data-name='crossShopEdit']").toggleClass('open');
                }
                $(".swtith[data-name='membersShare',data-name='crossShopEdit',data-name='crossShopConsume']").parent().next().find("input").attr("readonly", "readonly");
                $(".swtith[data-name='membersShare',data-name='crossShopEdit',data-name='crossShopConsume']").parent().next().find(".kkbtn").addClass("disabled");
                if (!$(".swtith[data-name='membersShare']").is(".open"))
                { $("#CrossShopSwitch").hide(); }
            }
            else {
                if ($(".swtith[data-name='crossShopConsume']").is(".open"))
                    $(".swtith[data-name='crossShopConsume']").toggleClass('open');
                if ($(".swtith[data-name='crossShopEdit']").is(".open"))
                    $(".swtith[data-name='crossShopEdit']").toggleClass('open');
                if ($(".swtith[data-name='membersShare']").is(".open"))
                    $(".swtith[data-name='membersShare']").toggleClass('open');
                $(".swtith[data-name='membersShare',data-name='crossShopEdit',data-name='crossShopConsume']").parent().next().find("input").attr("readonly", "readonly");
                $(".swtith[data-name='membersShare',data-name='crossShopEdit',data-name='crossShopConsume']").parent().next().find(".kkbtn").addClass("disabled");
                $("#CrossShopSwitch").hide();
            }
        }
    },
    product: function () {
        $(document).off("click");


        var danwei = '<a href="javascript:void(0)" class="klisos" data-id="@id" data-name="@dname"> <span>@name</span><i class="poriss  icon-edit danweiedit" ></i><em class="porvv icon-trash rovierw"  ></em></a>';
        $.getJSON("/system/GetUserPage", function (data) {
            var dd = JSON.parse(data.sv_uc_unit);
            for (var i = 0; i < dd.length; i++) {
                $("#danweiss").append(danwei.replace("@name", dd[i]).replace("@id", 0).replace("@dname", "chengwei"));
            }
        });
        var productconfig = '<a href="javascript:void(0)" class="klisos" data-id="@id" data-name="@name"> <span>@name</span><i class="poriss  icon-edit updateconfig" ></i><em class="porvv icon-trash productconfigdelete"  ></em></a>'
        //产品配置查询
        GetProductConfig(productconfig);
        /*
//添加单位
//
*/
        $(document).on("click", "#danweiadd", function () {

            layer.prompt({
                title: '添加单位',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                layer.load();
                $.post("/System/Update_danwei", { id: 0, name: pass, name2: "" }, function (data) {
                    if (data.r == true) {
                        $("#danweiss").html("");
                        // var dd = JSON.parse(data.sv_uc_unit);
                        //  alert(JSON.stringify(data.sv_uc_callnameList));
                        for (var i = 0; i < data.sv_uc_unit.length; i++) {
                            $("#danweiss").append(danwei.replace("@name", data.sv_uc_unit[i]).replace("@id", 0).replace("@dname", "chengwei"));
                        }
                        //  $("#chengweicount").text(data.sv_uc_callnameList.length);
                        layer.closeAll();
                        layer.msg("单位添加改成功");

                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                        layer.closeAll();
                    }
                    else {
                        layer.msg("添加单位失败");
                        layer.closeAll();
                    }

                });
            });
        });


        //修改选中的分组
        $(document).on("click", ".danweiedit", function () {
            var ss = $(this).parent();
            var val = $(this).prev().text();
            layer.prompt({
                title: '修改选中的单位',
                value: val,
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {


                $.post("/System/Update_danwei", { id: 1, name: pass, name2: val }, function (data) {
                    if (data.r == true) {
                        $("#danweiss").html("");
                        //  var dd = JSON.parse(data.sv_uc_unit);
                        //  alert(JSON.stringify(data.sv_uc_callnameList));
                        for (var i = 0; i < data.sv_uc_unit.length; i++) {
                            $("#danweiss").append(danwei.replace("@name", data.sv_uc_unit[i]).replace("@id", 0).replace("@dname", "chengwei"));
                        }

                        //  $("#chengweicount").text(data.sv_uc_callnameList.length);

                        layer.closeAll();
                        layer.msg("单位修改成功");

                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.msg("单位分组失败");
                        layer.closeAll();
                    }
                });
            });
        });


        //称谓，单位的删除

        $(document).on("click", ".rovierw", function () {

            var thisname = $(this);

            layer.confirm("确认要删除吗？", function () {

                layer.load();
                $.post("/System/Update_danwei", { id: 2, name: thisname.prev().prev().text(), name2: "" }, function (data) {
                    if (data.r == true) {
                        $("#danweiss").html("");
                        // var dd = JSON.parse(data.sv_uc_unit);
                        //  alert(JSON.stringify(data.sv_uc_callnameList));
                        for (var i = 0; i < data.sv_uc_unit.length; i++) {
                            $("#danweiss").append(danwei.replace("@name", data.sv_uc_unit[i]).replace("@id", 0).replace("@dname", "chengwei"));
                        }
                        layer.closeAll();
                        layer.msg("单位删除成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.msg("单位失败");
                        layer.closeAll();
                    }
                });

            });
        });
        //开关
        $(document).on("click", ".swtith[data-name='InventoryWarning'] i", function () {
            $(this).parents('.swtith').toggleClass('open');
            $.post("/System/Update_repertory", { kaiqi: $(this).parents('.swtith').is(".open") }, function (data) {
                if (data == true) {
                    layer.msg("保存成功，请继续操作！");
                }
                else if (data == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("操作失败请稍后重试！");
                }
            });

            if ($(this).parents('.swtith[data-name="InventoryWarning"]').is(".open")) {
                $("input").removeAttr("readonly");
                $("#prodcsaver").removeClass("disabled");
            } else {
                $("input").attr("readonly", "readonly");
                $("#prodcsaver").addClass("disabled");
            }


        });

        $.getJSON("/system/GetUserPage", function (data) {
            // alert(JSON.stringify(data));
            //设置积分

            if (data.sv_uc_storagealertis) {
                $(".swtith[data-name='InventoryWarning']").toggleClass('open');
                $("input").removeAttr("readonly");
                $("#prodcsaver").removeClass("disabled");
            } else {
                $("input").attr("readonly", "readonly");
                $("#prodcsaver").addClass("disabled");
            }

            var json = JSON.parse(data.sv_uc_storagealert);
            // alert(data.sv_uc_storagealert);
            $("#alertvalue").val(json.alertvalue);
            $("#alerttime").val(json.alerttime);
            $(".stecs").eq(json.alertmethod).addClass("on").siblings().removeClass("on");
            //
            $(".stecs").click(function () {
                $(this).addClass("on").siblings().removeClass("on");
            });


            $('#alerttime').datetimepicker({
                initialDate: '',
                weekStart: 1,
                todayBtn: 0,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0,
                pickerPosition: "bottom-left",
                format: 'hh:ii'
            });


            $("#prodcsaver").click(function () {


                if (!$(this).hasClass("disabled")) {
                    var i = 0;
                    $(".stecs").each(function (index) {
                        if ($(this).hasClass("on")) {
                            i = index;
                        }
                    });

                    //  var jason = { "alertvalue": $("#alertvalue").val(), "alertmethod": i, "alerttime": $("#alerttime").val() };

                    $.post("/System/Update_repertory2", { dats: JSON.stringify({ "alertvalue": $("#alertvalue").val(), "alertmethod": i, "alerttime": $("#alerttime").val() }) }, function (data) {
                        if (data == true) {
                            layer.msg("保存成功，请继续操作！");
                        }
                        else if (data == -2) {
                            layer.msg("你没有该操作权限！");
                        }
                        else {
                            layer.msg("操作失败，请稍后再试！");
                        }
                    });

                }

            });

        });

        //产品配置添加
        $(document).on("click", "#AddConfiginfo", function () {
            layer.prompt({
                title: '添加产品自定义类别',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                layer.load();
                $.post("/ProductCustomProperties/AddProductAttributeConfiginfo", { configname: pass }, function (data) {
                    if (data == true) {
                        $("#Configinfotext").html("");
                        GetProductConfig(productconfig);
                        layer.closeAll();
                        layer.msg("添加配置成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");

                    } else if (data == -3) {
                        layer.closeAll();
                        layer.msg("名称不能为空！");
                    } else if (data == 3) {
                        layer.closeAll();
                        layer.msg("名称不能重复！");


                    }
                    else {
                        layer.closeAll();
                        layer.msg("添加配置失败！");

                    }

                });
            });
        });
        //产品配置删除
        $(document).on("click", ".productconfigdelete", function () {
            var thisname = $(this);
            layer.confirm("确认要删除吗？", function () {
                layer.load();
                $.post("/ProductCustomProperties/DeleteProductAttributeConfiginfo", { ConfigId: thisname.parent().data("id") }, function (data) {
                    if (data == 1) {
                        $("#Configinfotext").html("");
                        GetProductConfig(productconfig);
                        layer.closeAll();
                        layer.msg("删除配置成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.closeAll();
                        layer.msg("删除配置失败");
                    }
                });

            });
        });
        //产品配置修改
        $(document).on("click", ".updateconfig", function () {
            var _configid = $(this).parent().data("id");
            layer.prompt({
                title: '产品自定义属性配置',
                value: $(this).parent().data("name"),
                formType: 0
            }, function (pass) {
                $.post("/ProductCustomProperties/UpdateProductAttributeConfiginfo", { configid: _configid, configname: pass }, function (data) {
                    if (data == 1) {
                        $("#Configinfotext").html("");
                        GetProductConfig(productconfig);
                        layer.closeAll();
                        layer.msg("产品自定义属性配置修改成功");

                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.closeAll();
                        layer.msg("产品自定义属性配置修改");

                    }
                });
            });
        });
        //产品配置开关
        $(document).on("click", "#detailinfo .configopen i", function () {
            $(this).parents('#detailinfo .configopen').toggleClass('open');
            $.post("/ProductCustomProperties/SwitchOperation", { configIid: $(this).parents('#detailinfo .configopen').data("configid"), isswitch: $(this).parents('#detailinfo .configopen').is(".open") }, function (data) {
                if (data == true) {
                    $("#Configinfotext").html("");
                    GetProductConfig(productconfig);
                    layer.msg("保存成功，请继续操作！");
                }
                else if (data == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("操作失败请稍后重试！");
                }
            });
        });
        //产品配置明细添加
        $(document).on("click", ".attributedetail", function () {
            var _configid = $(this).data("configid");
            layer.prompt({
                title: '产品自定义属性添加',
                formType: 0
            }, function (pass) {
                layer.load();
                $.post("/ProductCustomProperties/AddProductAttributeDetailinfo", { configid: _configid, detailid: 0, detailname: pass, }, function (data) {
                    if (data == true) {
                        GetProductAttributeDetail(_configid);
                        layer.closeAll();
                        layer.msg("添加属性成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    } else if (data == -3) {
                        layer.closeAll();
                        layer.msg("名称不能为空！");

                    } else if (data == 3) {
                        layer.closeAll();
                        layer.msg("名称不能重复！");

                    }
                    else {
                        layer.closeAll();
                        layer.msg("添加属性失败");
                    }

                });
            });
        });
        //产品配置明细删除
        $(document).on("click", ".detaidelete", function () {
            var thisname = $(this);
            var _configid = thisname.parent().data("configid")
            layer.confirm("确认要删除吗？", function () {
                layer.load();

                $.post("/ProductCustomProperties/DeleteProductAttributeDetailinfo", { configid: _configid, detailid: thisname.parent().data("detailid") }, function (data) {
                    if (data == 1) {
                        GetProductAttributeDetail(_configid);
                        layer.closeAll();
                        layer.msg("删除设置成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.closeAll();
                        layer.msg("删除设置失败");

                    }
                });

            });
        });
        //产品配置明细修改
        $(document).on("click", ".updatedetai", function () {
            var _configid = $(this).parent().data("configid");
            var _detailid = $(this).parent().data("detailid");

            layer.prompt({
                title: '产品自定义属性修改',
                value: $(this).parent().data("name"),
                formType: 0
            }, function (pass) {
                layer.load();
                $.post("/ProductCustomProperties/AddProductAttributeDetailinfo", { configid: _configid, detailid: _detailid, detailname: pass, }, function (data) {
                    if (data == true) {
                        GetProductAttributeDetail(_configid);
                        layer.closeAll();
                        layer.msg("修改属性成功");
                    }
                    else if (data == -2) {
                        layer.closeAll();
                        layer.msg("你没有该操作权限！");
                    } else if (data == -3) {
                        layer.closeAll();
                        layer.msg("名称不能为空！");

                    } else if (data == 3) {
                        layer.closeAll();
                        layer.msg("名称不能重复！");
                    }
                    else {
                        layer.closeAll();
                        layer.msg("修改属性失败");
                    }

                });
            });
        });

    },
    Isindex: function () {
        // 读取店铺信息
        $.getJSON("/AjaxUser/GetUserinfo/", function (data) {
            if (data) {
                for (key in data) {
                    if (key != "sv_versionname") {
                        if (key == "sv_versionexpiration" && (data[key] == "" || data[key].slice(0, 4) == "0001")) {
                            $("#_" + key).text("");
                            if (data["sv_versionid"] == 1 || data["sv_versionid"] == 5 || data["sv_versionname"].indexOf("至尊") >= 0) {
                                $("#_sv_versionexpiration").text("永久");
                            }
                        } else {
                            if (key == "sv_versionexpiration") {
                                if (data["sv_versionid"] != 1) {
                                    $("#_" + key).text(new Date(data[key]).Format('yyyy-MM-dd'));
                                }
                                else {
                                    $("#_sv_versionexpiration").text("永久");
                                }
                            }
                            else if (key == "sv_ul_regdate") {
                                $("#" + key).text(new Date(data[key]).Format('yyyy-MM-dd hh:mm:sss'))
                            } else {
                                $("#_" + key).text(data[key]);
                                $("#" + key).text(data[key]);
                                $("." + key).text(data[key]);
                            }

                        }


                    } else {
                        $("#_" + key).text(data[key]);
                        if (isNullOrWhiteSpace(data[key])) {
                            $("#sv_versionname").addClass("bg-bule");
                            $("#sv_versionname").text("版本：" + data[key]);


                        }
                        else {
                            $("#sv_versionname").addClass("bg-bule");
                            $("#sv_versionname").text("版本：免费版");
                        }

                    }
                    if (key == "isStore" && data[key] == true) {

                        $("#showlogoImg").removeAttr("onclick");
                        $("#logodetails").hide();
                    }
                    if (key == "sv_versionid" && data[key] != 1) {
                        $("#TrialVersion").hide();
                        if (data[key] == 2) {
                            $("#showlogoImg").removeAttr("onclick");
                            $("#logodetails").hide();

                            $("#btnSelectImg").attr("href", "/Home/paylinkage?version=5&distributor=" + data["distributor_id"] + "&gobackpage=system");
                        }
                    } else {
                        if (key == "sv_versionid" && data[key] == 1) {
                            $('#btnRenewVersion').hide();
                            $("#TrialVersion").show();
                            $("#showlogoImg").removeAttr("onclick");
                            $("#logodetails").hide();
                            $("#btnSelectImg").attr("href", "/Home/paylinkage?version=5&distributor=" + data["distributor_id"] + "&gobackpage=system");
                            $("#getTrialVersion").text("领取高级试用版");
                        }

                    }
                    if (key == 'sv_store_logo') {
                        if (isNullOrWhiteSpace(key) && isNullOrWhiteSpace(data[key])) {
                            $("#showlogoImg").attr('src', 'http://decerp.cc' + data[key]);
                            $('#logoid').attr('src', 'http://decerp.cc' + data[key]);
                        }
                        else {
                            $("#showlogoImg").attr('src', decerpLogoUrl_80);
                            $('#logoid').attr('src', decerpLogoUrl_270);
                        }
                    }
                    //else {
                    //    alert('ddd');
                    //    $('#logoid').attr('src', '/images/logo.jpg');
                    //}
                    if (key == 'sv_us_logo' && isNullOrWhiteSpace(key) && isNullOrWhiteSpace(data[key])) {
                        $('#userImg').attr('src', 'http://decerp.cc' + data[key]);
                        $("#showImg").attr('src', 'http://decerp.cc' + data[key]);
                    }
                    if (key == 'user_id') {
                        $('#user_id').html('' + data[key]);
                    }
                }
                $("._sv_versionexpiration").text('有效期间：' + $("#_sv_versionexpiration").text());
            }
        });

        // 处理异常图片
        $('#logoid').error(function () {
            $(this).attr('src', decerpLogoUrl_270);
        });

        // 修改店铺信息
        $(document).on("click", "#updainfo", function () {

            //   Deke.DeKe_dialog.show_Url2("修改店铺基本信息","",null,[]);
            index = layer.open({
                id: "54321",
                type: 1, //page层
                title: '修改店铺基本信息',
                shade: 0.6, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: 0, //0-6的动画形式，-1不开启
                area: ['360px', '450px'], //宽高
                closeBtn: 1,
                content: ' <div class="modal-body maodelsbox "> <ul class="modderlis" style="height:320px;"> <li> <input type="hidden"  value="" class="sv_us_industrytype"/> <input type="hidden"  value="" class="sv_us_province"/><input type="hidden"  value="" class="sv_us_district"/><input type="hidden"  value="" class="sv_us_city"/>  <span>店铺名称：</span>  <input type="text" class="sv_us_name" placeholder="还没填写" autofocus="" /> </li> <li>  <span>店主姓名：</span>  <input type="text" class="sv_ul_name" placeholder="还没填写" />'
                            + '</li>  <li> <span>行业类型：</span>  <select id="sv_us_industrytype" name="sv_us_industrytype" class="form-control" size="1"></select> </li><li> <span>店铺简称：</span> <input type="text" class="sv_us_shortname" placeholder="简称" />'
                           + ' </li><li> <span>店铺电话：</span> <input type="text" placeholder="" class="sv_us_phone" /></li><li class="xzsfdiqubox"> <select id="sv_us_province" name="sv_us_province" class="form-control" size="1"> <option value="0">省份</option>  </select> <select id="sv_us_city" name="sv_us_city" class="form-control" size="1"> <option value="0">城市</option>'
                            + ' </select> <select id="sv_us_district" name="sv_us_district" class="form-control" size="1">  <option value="0">地区</option> </select></li><li><span>店铺地址：</span><input type="text" placeholder="" class="sv_us_address"></li> </ul> </div>',
                btn: ["确认", "取消"],
                yes: function (id) {
                    var sv_ul_name = $(".sv_ul_name").val().trim();
                    var sv_us_shortname = $(".sv_us_shortname").val().trim();
                    var sv_us_name = $(".sv_us_name").eq(1).val().trim();
                    if (!isNullOrEmpty(sv_ul_name)) {
                        $(".sv_ul_name").focus();
                        layer.msg("店主姓名不能为空！");
                        return;
                    }
                    if (!isNullOrEmpty(sv_us_shortname)) {
                        $(".sv_us_shortname").focus();
                        layer.msg("店铺简称不能为空！");
                        return;
                    } else {

                        // var strlength = getstrlength(sv_us_shortname)
                        if (sv_us_shortname.length < 2 || sv_us_shortname.length > 8) {
                            layer.msg("店铺简称长度为2-8字符");
                            return;
                        }
                    }
                    if (!isNullOrEmpty(sv_us_name)) {
                        $(".sv_us_name").focus();
                        layer.msg("店铺名称不能为空！");
                        return;
                    }
                    if (!checkTel($(".sv_us_phone").val())) {
                        $(".sv_us_phone").focus();
                        layer.msg("电话号码格式不对");
                        return;
                    }
                    var inde = layer.load();


                    var data = { sv_ul_name: sv_ul_name, sv_us_shortname: sv_us_shortname, sv_us_name: sv_us_name, sv_us_phone: $(".sv_us_phone").val(), sv_us_address: $(".sv_us_address").val(), sv_us_province: $("#sv_us_province").val() || 0, sv_us_city: $("#sv_us_city").val() || 0, sv_us_district: $("#sv_us_district").val() || 0, sv_us_industrytype: $("#sv_us_industrytype").val() };
                    //alert(JSON.stringify(data));
                    $.ajax({
                        url: '/System/UpdaueShopInfo',
                        type: 'post',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        async: false,
                        success: function (data) {
                            // alert(data);
                            if (data == true) {
                                $("#username").text($(".sv_us_name").eq(1).val());
                                $("#dianzhu").text($(".sv_ul_name").val());
                                // getpage('');
                                layer.closeAll();
                                layer.msg("资料修改成功！");

                                $.getJSON("/AjaxUser/GetUserinfo/", function (data) {
                                    loggin.chklogn(data);
                                    for (key in data) {
                                        $("#" + key).text(data[key]);
                                        $("." + key).text(data[key]);
                                    }

                                });
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                                layer.closeAll();
                            }
                            else {
                                layer.msg("资料修改失败，请刷新重试");
                                layer.closeAll();
                            }
                        }
                    });
                }, success: function () {
                    $.getJSON("/AjaxUser/GetUserinfo/", function (data) {
                        loggin.chklogn(data);
                        for (key in data) {
                            $("." + key).val(data[key]);
                        }

                    });
                    //加载行业类型并赋值
                    $.get("/Ajaxdata/GetIndustryType", function (data) {
                        if (data.length > 0) {
                            for (var i in data) {
                                $("#sv_us_industrytype").append("<option value=\"" + data[i].industrytype_id + "\">" + data[i].sv_uit_name + "</option>");
                            }
                        }

                    });
                    setTimeout(function () {
                        $("#sv_us_industrytype").val($(".sv_us_industrytype").val());
                    }, 200);


                    //页面加载时只需绑定省份下拉框
                    $.get("/Ajaxdata/GetPCD/1", function (data) {

                        if (data.length > 0) {
                            for (var i in data) {

                                $("#sv_us_province").append("<option value=\"" + data[i].code + "\">" + data[i].name + "</option>");
                            }
                        }
                    });
                    setTimeout(function () {
                        $("#sv_us_province").val($(".sv_us_province").val()).change();
                    }, 100);

                    //联动
                    $("#sv_us_province").change(function () {
                        $("#sv_us_district").empty();

                        $.get("/Ajaxdata/GetCityInterlock/" + $("#sv_us_province").val(), function (data1) {

                            $("#sv_us_city").empty();//清空城市下拉框
                            for (var i in data1) {
                                $("#sv_us_city").append("<option value=\"" + data1[i].code + "\">" + data1[i].name + "</option>");
                            }
                        });
                        setTimeout(function () {
                            $("#sv_us_city").val($(".sv_us_city").val());
                            $("#sv_us_city").change();
                        }, 100);
                    });

                    //改变省份
                    $("#sv_us_city").change(function () {
                        $.get("/Ajaxdata/GetDistrictInterlock/" + $("#sv_us_city").val(), function (data) {
                            if (data.length > 0) {
                                $("#sv_us_district").empty();
                                for (var i in data) {
                                    $("#sv_us_district").append("<option value=\"" + data[i].code + "\">" + data[i].name + "</option>");
                                }

                            }
                        });
                        setTimeout(function () {
                            $("#sv_us_district").val($(".sv_us_district").val());
                        }, 100);
                    });
                }

            });
        });

        function checkTel(value) {
            var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
            var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
            if (value == "") {
                return true;
            }
            if (isMob.test(value) || isPhone.test(value)) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    xiaoshou: function () {


        $.getJSON("/system/GetUserPage", function (data) {
            var json = JSON.parse(data.sv_uc_serialnumberset);

            //处理流水号
            if (json.whether) {

                $(".swtith[data-name='sv_uc_serialnumberset']").toggleClass('open');

            } else {
                $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find("input").attr("readonly", "readonly");
                $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find(".kkbtn").addClass("disabled");
            }

            $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find("input").val(json.nomber);

            $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find(".stecs").eq(json.auto).addClass("on").siblings().removeClass("on");



            ///流水号结束
            json = JSON.parse(data.sv_uc_dixian);
            //积分 抵现设置

            if (json.whether) {

                $(".swtith[data-name='sv_uc_dixian']").toggleClass('open');

            } else {
                $(".swtith[data-name='sv_uc_dixian']").parent().next().find("input").attr("readonly", "readonly");
                $(".swtith[data-name='sv_uc_dixian']").parent().next().find(".kkbtn").addClass("disabled");
            }
            $(".swtith[data-name='sv_uc_dixian']").parent().next().find("input").val(json.auto);

            //积分抵现结束


            ///销售挂零
            json = JSON.parse(data.sv_uc_saletozeroset);

            if (json.whether) {

                $(".swtith[data-name='sv_uc_saletozeroset']").toggleClass('open');

            } else {

                $(".swtith[data-name='sv_uc_saletozeroset']").parent().next().find(".kkbtn").addClass("disabled");
            }


            $(".swtith[data-name='sv_uc_saletozeroset']").parent().next().find(".stecs").eq(json.auto).addClass("on").siblings().removeClass("on");

            ///密码启用
            if (data.sv_uc_isenablepwd) {
                $(".swtith[data-name='sv_uc_isenablepwd']").toggleClass('open');
            }
            //提成启用
            if (data.sv_isopen_commission) {
                $(".swtith[data-name='sv_isopen_commission']").toggleClass('open');
            }
            // $(".swtith[data-name='sv_uc_dixian']").parent().next().find("input").val(json.auto);

            //结束

            // alert(data.sv_uc_saleprediscount);
            $(".kkbtn").click(function () {
                if (!$(this).hasClass("disabled")) {

                    if ($(this).data("name") == "sv_uc_serialnumberset") {
                        $.post("/System/updateUserinfo", { name: "sv_uc_serialnumberset", key: "nomber", valu: $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find("input").val() }, function (data) {
                            if (data == true) {
                                var i = 0;
                                layer.msg("保存成功，请继续操作！");
                                $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find(".stecs").each(function (index) {
                                    if ($(this).hasClass("on")) {
                                        i = index;
                                    }
                                });

                                //$.post("/System/updateUserinfo", { name: "sv_uc_serialnumberset", key: "auto", valu: i }, function (data) {
                                //    if (data == true) {
                                //        layer.msg("保存成功，请继续操作！");
                                //    }
                                //    else if (data == -2) {
                                //        layer.msg("你没有该操作权限！");
                                //    }
                                //    else if (data == -5) {
                                //        layer.msg("当前设置的流水号必须大于上次设置的流水号！");
                                //    }
                                //    else {
                                //        layer.msg("操作失败，请稍后重试！");
                                //    }
                                //});
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else if (data == -5) {
                                layer.msg("当前设置的流水号必须大于上次设置的流水号！");
                            }
                            else {
                                layer.msg("操作失败，请稍后重试！");
                            }
                        });
                    }

                    if ($(this).data("name") == "sv_uc_dixian") {

                        $.post("/System/updateUserinfo", { name: "sv_uc_dixian", key: "auto", valu: $(".swtith[data-name='sv_uc_dixian']").parent().next().find("input").val() }, function (data) {
                            if (data == true) {
                                layer.msg("保存成功，请继续操作！");
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.msg("操作失败，请稍后重试！");
                            }
                        });

                    }
                    if ($(this).data("name") == "sv_uc_saletozeroset") {
                        var i = 0;
                        $(".swtith[data-name='sv_uc_saletozeroset']").parent().next().find(".stecs").each(function (index) {
                            if ($(this).hasClass("on")) {
                                i = index;
                            }
                        });

                        $.post("/System/updateUserinfo", { name: "sv_uc_saletozeroset", key: "auto", valu: i }, function (data) {
                            if (data == true) {
                                layer.msg("保存成功，请继续操作！");
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.msg("操作失败，请稍后重试！");
                            }
                        });

                    }
                    if ($(this).data("name") == "sv_uc_isenablepwd") {
                        var i = 0;
                        $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find(".stecs").each(function (index) {
                            if ($(this).hasClass("on")) {
                                i = index;
                            }
                        });
                        $.post("/System/updateUserinfo", { name: "sv_uc_isenablepwd", key: "auto", valu: i }, function (data) {
                            if (data == true) {
                                layer.msg("保存成功，请继续操作！");
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.msg("操作失败，请稍后重试！");
                            }
                        });
                    }

                    if ($(this).data("name") == "sv_isopen_commission") {
                        var i = 0;
                        $(".swtith[data-name='sv_uc_serialnumberset']").parent().next().find(".stecs").each(function (index) {
                            if ($(this).hasClass("on")) {
                                i = index;
                            }
                        });
                        $.post("/System/updateUserinfo", { name: "sv_isopen_commission", key: "auto", valu: i }, function (data) {
                            if (data == true) {
                                layer.msg("保存成功，请继续操作！");
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.msg("操作失败，请稍后重试！");
                            }
                        });
                    }
                }
            });


            $(".stecs").click(function () {
                $(this).addClass("on").siblings().removeClass("on");

            });

            //var xiaohtml = '  <a href="#" class="klisos"> <span>@name折</span><i class="poriss  icon-edit"></i> <em class="porvv icon-trash"></em> </a>';
            //json = JSON.parse(data.sv_uc_saleprediscount);

            //for (var i = 0; i < json.length; i++) {
            //    $("#zhekouss").append(xiaohtml.replace("@name", json[i]));
            //    //sv_mr_name
            //}
            //$(document).on("click", "#tianjiazhekoui", function () {

            //    layer.prompt({
            //        title: '添加折扣1-10之间',
            //        formType: 0 //prompt风格，支持0-2

            //    }, function (pass) {

            //        // alert(e)
            //        layer.load();
            //        $.post("/System/Update_discount", { id: 0, name: pass, name2: '' }, function (data) {
            //            if (data.r) {
            //                $("#zhekouss").html("");


            //                for (var i = 0; i < data.sv_uc_saleprediscount.length; i++) {
            //                    $("#zhekouss").append(xiaohtml.replace("@name", data.sv_uc_saleprediscount[i]));
            //                    //sv_mr_name
            //                }
            //                layer.closeAll();

            //                layer.msg("添加折扣成功");

            //            } else {
            //                layer.closeAll();
            //                layer.msg("添加折扣失败");

            //            }
            //        });
            //    });
            //});
        });


        $(document).off("click");
        //开关按钮事件
        $(document).on("click", ".swtith i", function () {
            $(this).parents('.swtith').toggleClass('open');

            $.post("/System/updateUserinfo", { name: $(this).parents('.swtith').data("name"), key: "whether", valu: $(this).parents('.swtith').is(".open") }, function (data) {
                if (data == true) {
                    layer.msg("保存成功，请继续操作！");
                }
                else if (data == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("操作失败，请稍后重试！");
                }
            });

            if ($(this).parents('.swtith').is(".open")) {
                $(".swtith[data-name='" + $(this).parents('.swtith').data("name") + "']").parent().next().find("input").removeAttr("readonly", "readonly");
                $(".swtith[data-name='" + $(this).parents('.swtith').data("name") + "']").parent().next().find(".kkbtn").removeClass("disabled");
            } else {
                $(".swtith[data-name='" + $(this).parents('.swtith').data("name") + "']").parent().next().find("input").attr("readonly", "readonly");
                $(".swtith[data-name='" + $(this).parents('.swtith').data("name") + "']").parent().next().find(".kkbtn").addClass("disabled");
            }

        });

        //    $("[data-toggle='popover']").popover();

    },
    sjchulli: function () {
        $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=DataManage', function (data) {
            if (isNullOrWhiteSpace(data)) {
                window.location.href = data;
            }
        });
        $(document).off("click");
        $(document).on("click", '.uikslx', function () {

            $(this).toggleClass('on');
        });


        $(document).on("click", '#queqinchu', function () {
            layer.confirm("初始化店铺数据将无法恢复，确认初始化？", { btn: ["确认", "取消"] }, function () {
                var str = "";
                $(".uikslx.on").each(function () {

                    str += $(this).data("id") + ",";

                });
                if (str != "") {
                    $.ajax({
                        type: "GET",
                        url: "/AjaxUser/GetIsAdmin",
                        dataType: "json",
                        success: function (data) {

                            if (data == null) {
                                layer.prompt({
                                    title: '请输入密码',
                                    formType: 1,
                                    cancel: function (index) {
                                    }
                                }, function (value, index, elem) {
                                    systemPwd(value);

                                });

                            }
                            else {

                                layer.alert("没有权限初始化，请联系总店管理员");
                            }

                        }

                    });
                } else {
                    layer.msg("请选择要清除的对象");
                }
            });

        });

    },
    // 打印设置
    dayin: function () {

        $("[data-toggle='popover']").popover();
        $("#styerigbox").on("click", ".stecs", function () {
            if (this.id == "product") {
                $(".integral").each(function () {
                    var _hid = "#" + $(this).attr("id");
                    $(this).removeClass("on");
                    $(_hid + "_html").css("display", "none");
                });
                if (!$(this).hasClass('on')) {
                    $("." + this.id).each(function () {
                        $(this).toggleClass("on");
                        var _hid = "#" + $(this).attr("id");
                        $(_hid + "_html").css("display", "table-cell");

                    });
                } else {
                    $("." + this.id).each(function () {
                        var _hid = "#" + $(this).attr("id");
                        $(this).removeClass("on");
                        $(_hid + "_html").css("display", "none");
                    });
                }
            } else if (this.id == "integral") {
                $(".product").each(function () {
                    var _hid = "#" + $(this).attr("id");
                    $(this).removeClass("on");
                    $(_hid + "_html").css("display", "none");
                });
                if (!$(this).hasClass('on')) {

                    $("." + this.id).each(function () {
                        var _hid = "#" + $(this).attr("id");
                        $(this).toggleClass("on");
                        $(_hid + "_html").css("display", "table-cell");
                    });
                } else {
                    $("." + this.id).each(function () {
                        var _hid = "#" + $(this).attr("id");
                        $(this).removeClass("on");
                        $(_hid + "_html").css("display", "none");
                    });
                }
            } else if ($(this).data("strtype") != "product_integral") {
                $(this).toggleClass("on").siblings().removeClass("on");
            }


        });

        $.getJSON("/system/GetUserPage", function (data) {
            var json = JSON.parse(data.sv_uc_dayin);

            $("[data-name='" + json.xiaopiao + "']").click();
            if (json.xianzhe) {
                $("#tan").click();
            }

            if (json.yl) {
                $("#xian").click();
            }
            // mypring.PREVIEW();
            $(".SytemtabUI ul>li").eq((json.mo - 1)).addClass("active").click();

        });

        $("#yinlan").click(function () {
            //  mypring.PREVIEW("/home/printview/" + $(".SytemtabUI ul>li.active").data("id"));
            //读取配置
            $.getJSON("/system/Getprint", function (data) {
                Cef.openMyPc("{}", JSON.stringify(data), 1, $(".SytemtabUI ul>li.active").data("id"), '' + receptionPtNum + '', receptionPtName);
            });
        });


        $(".SytemtabUI ul>li").click(function () {
            if ($(this).data("id") == 4) {
                $(".printui .ritianshu:eq(0) .stecs:eq(2)").css("display", "inline-block");
                $.getJSON("/system/Getprint", function (data) {
                    //显示自定义选项
                    $(".print_custorm_head").each(function (i, m) {
                        //绑定各项的值
                        $(m).css("display", "normal");
                    });
                    //绑定
                    var configData = JSON.parse(data.cof.sv_pfconfig);
                    if (configData) {
                        var h_config = ''; //读取"0,0,0,0,0,0,0"的开关配置
                        if (configData && configData.h && configData.h.split(',')) {
                            h_config = configData.h.split(',');
                        }
                        var t_config = '';
                        if (!t_config) {
                            t_config = configData.b.split(',');
                        }
                        //var b_config = pfData.prlist;
                        var f_config = '';
                        if (!f_config) {
                            f_config = configData.f.split(',');
                        }
                        var q_config = configData.q;
                        var l_config = configData.l;

                        //$($(".print_custorm_head")[0]).
                        for (var i = 0; i < h_config.length; i++) {
                            var _tempId = "#print_custorm_1";
                            if (i > 9) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if (h_config[i] == 1) {
                                $(_tempId).addClass("on");
                            } else {
                                $(_tempId).removeClass("on");
                                $(_tempId + "_html").css("display", "none");
                            }
                        }
                        for (var i = 0; i < t_config.length; i++) {
                            var _tempId = "#print_custorm_2";
                            if (i > 8) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if (t_config[i] == 1) {
                                if ($(_tempId).data("statetype") == "integral") {
                                    $("." + $(_tempId).data("statetype")).addClass("on");
                                    $(".product").removeClass("on");
                                } else if ($(_tempId).data("statetype") == "product") {
                                    $("." + $(_tempId).data("statetype")).addClass("on");
                                    $(".integral").removeClass("on");
                                }
                                $(_tempId).addClass("on");
                                $(_tempId + "_html").css("display", "table-cell");
                            }
                            else {
                                $(_tempId).removeClass("on");
                                $(_tempId + "_html").css("display", "none");
                                $(_tempId + "_value").css("display", "none");
                            }
                        }

                        for (var i = 0; i < f_config.length; i++) {
                            var _tempId = "#print_custorm_3";
                            if (i > 14) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if (f_config[i] == 1) {
                                $(_tempId).addClass("on");
                                if (i == 11) {
                                    $(_tempId + "_html_txt").html(data.user.address);//地址信息
                                } else if (i == 12 || i == 9) {
                                    //销售时间
                                    $(_tempId + "_html_txt").html((new Date()).Format("yyyy.MM.dd hh:mm:ss"));
                                } else if (i == 10) {//电话
                                    $(_tempId + "_html_txt").html(data.user.sv_ul_mobile);
                                }
                            }
                            else {
                                $(_tempId).removeClass("on");
                                $(_tempId + "_html").css("display", "none");
                            }

                        }

                        if (q_config) {
                            $("#print_custorm_401").addClass("on");
                            if (q_config.ImageString) {
                                $("#print_custorm_401_html img").attr('src', q_config.ImageString);
                            }

                        } else {
                            $("#print_custorm_401").removeClass("on");
                            $("#print_custorm_401_html").css("display", "none");
                            $("#print_custorm_401_img").css("display", "none");
                        }
                        if (l_config) {
                            $("#print_custorm_400").addClass("on");
                            //绑定店铺图片
                            $("#print_custorm_400_html img").attr('src', l_config.ImageString);

                        } else {
                            $("#print_custorm_400").removeClass("on");
                            $("#print_custorm_400_html").css("display", "none");
                        }
                    }
                });
            } else {
                //隐藏自定义选项     
                $(".printui .ritianshu:eq(0) .stecs:eq(2)").css("display", "none");
                $(".print_custorm_head").each(function (i, m) {
                    $(m).css("display", "none");
                });
            }
            if ($(this).data("id") != 5) {
                $(this).addClass("active").siblings().removeClass("active");
                $("#mobi" + $(this).data("id")).show().siblings().hide();
                $(".printui").show();
                $(".msanbottom").show();
                $(".PrintShow").show();
                $(".lableprintphoto").hide();
                $(".lableprintfooter").hide();
            } else {
                $(this).addClass("active").siblings().removeClass("active");
                $("#mobi" + $(this).data("id")).show().siblings().hide();
                $(".printui").hide();
                $(".msanbottom").hide();
                $(".PrintShow").hide();
                $(".lableprintphoto").show();
                $(".lableprintfooter").show();

                //点击分类
                $(document).on("click", ".bigclassificationa", function () {
                    $(this).parent().toggleClass('active').siblings().removeClass('active');
                    $(this).children(".selectPiece").addClass("active");
                    if ($(this).parents('li').hasClass('active')) {
                        $(this).siblings('ul').slideDown(250);
                        $(this).parents('li').siblings().children('ul').slideUp(250);
                        $(this).parents('li').siblings().children('a').children('.selectPiece').removeClass("active");
                    } else {
                        $(this).siblings('ul').slideUp(250);
                    }
                });
            }

            // 打印机设置
            if ($(this).data("id") == 6) {
                $('.system_Dyingbox').css("display", "none");
                $('#print_set_all').css("display", "none");
                $('.printSet').css("display", "block");
                try {
                    var printSet_network_device = Cef.GetLocalPrinters();
                    if (printSet_network_device != null && printSet_network_device != '') {
                        var printSet_network_device_json = JSON.parse(printSet_network_device);
                        var printSet_network_device_Html = '';
                        for (var i = 0; i < printSet_network_device_json.length; i++) {
                            printSet_network_device_Html += ' <option value="' + printSet_network_device_json[i] + '">' + printSet_network_device_json[i] + '</option>';
                        }
                    }
                    $('#PrintSet_network_device').html(printSet_network_device_Html);
                    $('#PrintSet_default_device').html(printSet_network_device_Html);
                }
                catch (e) {
                    disableButton('btnTestPrintSet');
                }
                getPrintSetingInfo(); // 读取打印机配置
            }
            else {
                $('.system_Dyingbox').css("display", "block");
                $('.printSet').css("display", "none");
                $('#print_set_all').css("display", "block");
            }
        });

        $("#baochunmoban").click(function () {
            var yl = false, xianzhe = false, xiaopiao = "";
            if ($("#xian").hasClass("on")) {
                yl = true;
            }
            if ($("#tan").hasClass("on")) {
                xianzhe = true;
            }

            if ($("[data-name='58']").hasClass("on")) {
                xiaopiao = 58;
            } else if ($("[data-name='80']").hasClass("on")) {
                xiaopiao = 80;
            } else if ($("[data-name='210']").hasClass("on")) {
                xiaopiao = 210;
            } else {
                xiaopiao = 58;
            }

            layer.load();
            if ($(".SytemtabUI li.active").attr("data-id") == 4) {
                //权限验证
                //if (Is_verify_store_version) {
                $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                    if (isNullOrWhiteSpace(data)) {
                        window.location.href = data;
                    } else {
                        var cdata = {
                            "h": "",
                            "b": "",
                            "t": "",
                            "f": "",
                            "l": null,
                            "q": {
                                "ImageString": "",
                                "Width": 100,
                                "Height": 100,
                                "Align": 1
                            },
                            "p": 0,
                            "a": 1
                        };
                        var temp = "";
                        for (var i = 0; i < 8; i++) {
                            var _tempId = "#print_custorm_1";
                            if (i > 9) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if ($(_tempId).hasClass("on")) {
                                temp += "1" + ",";
                            } else {
                                temp += "0" + ",";
                            }
                        }
                        cdata.h = temp.substring(0, temp.length - 1);

                        temp = "";
                        for (var i = 0; i < 9; i++) {
                            var _tempId = "#print_custorm_2";
                            if (i > 9) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if ($(_tempId).hasClass("on")) {
                                temp += "1" + ",";
                            } else {
                                temp += "0" + ",";
                            }
                        }
                        cdata.b = temp.substring(0, temp.length - 1);

                        temp = "";
                        for (var i = 0; i < 13; i++) {
                            var _tempId = "#print_custorm_3";
                            if (i > 9) _tempId = _tempId + i;
                            else _tempId = _tempId + "0" + i;
                            if ($(_tempId).hasClass("on")) {
                                temp += "1" + ",";
                            } else {
                                temp += "0" + ",";
                            }
                        }
                        cdata.f = temp.substring(0, temp.length - 1);

                        //店铺图片
                        if ($("#print_custorm_400").hasClass("on") && $("#print_custorm_400_html img").attr('src')) {
                            cdata.l = { "ImageString": $("#print_custorm_400_html img").attr('src').replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', ''), "Width": 50, "Height": 50, "Align": 1 };
                        } else {
                            cdata.l = null;
                        }
                        //二维码
                        if ($("#print_custorm_401").hasClass("on")) {
                            cdata.q = { "ImageString": "", "Width": 100, "Height": 100, "Align": 1 };
                        } else {
                            cdata.q = null;
                        }
                        $.post("/system/updatedayin2", { mo: $(".SytemtabUI ul>li.active").data("id"), yl: yl, bili: $("#bili").val(), xianzhe: xianzhe, xiaopiao: xiaopiao, config: JSON.stringify(cdata) }, function (data) {
                            layer.closeAll();
                            loggin.chklogn(data);
                            if (data == true) {
                                layer.msg("模板设置成功");
                                //----保存打印扩展配置
                                if ($("#cus_print_extra_info").val()) {
                                    $.post("/UserModuleConfig/ConfigdetailUpSetting", { user_config_code: "PrintSet_ExtraInfo", config_value: $("#cus_print_extra_info").val() }, function (data) {
                                        PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_ExtraInfo");
                                        if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                                            Preferential_TopUpGiving_ConfigList[0].sv_detail_value = $("#cus_print_extra_info").val();
                                        }
                                    });
                                }
                            }
                            else if (data == -2) {
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.msg("模板设置失败");
                            }
                        });
                    }
                });
                //}
            } else {
                $.post("/system/updatedayin", { mo: $(".SytemtabUI ul>li.active").data("id"), yl: yl, bili: $("#bili").val(), xianzhe: xianzhe, xiaopiao: xiaopiao }, function (data) {
                    layer.closeAll();
                    loggin.chklogn(data);
                    if (data == true) {
                        layer.msg("模板设置成功");
                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        layer.msg("模板设置失败");
                    }
                });
            }
        });
        if (is_open_print != null && is_open_print.split("@").length >= 1) {
            $("#PrintReceipts").val(is_open_print.split("@")[0]);
            if (Boolean(parseInt(is_open_print.split("@")[1]))) {
                $(".PrintReceipts").addClass("open")
            } else {
                $(".PrintReceipts").removeClass("open");
            }
        }

        var c_ = typeof Cef;
        if (c_ == "undefined") {
            disableButton('btnSavePrintSet');
        }

        // 保存打印设置
        $(document).on('click', '#btnSavePrintSet', function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    savePrintSet();
                }
            });
        });

        // 测试打印
        $(document).on('click', '#btnTestPrintSet', function () {
            try {
                if ($('#PrintSet_network_device').val() != null && $('#PrintSet_network_device').val() != '') {
                    var c_ = typeof Cef;
                    if (c_ !== "undefined") {
                        Cef.TestPrinter($('#PrintSet_network_device').val());
                    }
                }
                else {
                    layer.msg("请选择打印机");
                }
            }
            catch (e) {
                layer.msg("测试打印失败，请下载最新版客户端！");
            }
        });

        // 前台是否标签打印
        $('#PrintSet_network_device_font_islabel').click(function () {
            var printSet_default_device = $('#PrintSet_default_device').val();
            if (printSet_default_device != null && printSet_default_device != '' && printSet_default_device != undefined) {
                var data = {
                    "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
                    "sv_detail_value": printSet_default_device,
                    "sv_user_config_id": parseInt($(this).attr("data-configid")),
                    "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
                    "sv_detail_is_enable": $(this).hasClass('on') == true ? false : true,
                    "sv_user_configdetail_name": $(this).attr('data-name'),
                    "sv_remark": "前台标签打印机设置"
                };
                var list = [];
                list.push(data);
                saveBackSelectLabel(list);
            }
            else {
                layer.msg("请选择设备打印机");
            }
        });

        // 后台是否标签打印
        $('#PrintSet_network_device_back_islabel').click(function () {
            var printSet_network_device = $('#PrintSet_network_device').val();
            if (printSet_network_device != null && printSet_network_device != '' && printSet_network_device != undefined) {
                var data = {
                    "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
                    "sv_detail_value": printSet_network_device,
                    "sv_user_config_id": parseInt($(this).attr("data-configid")),
                    "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
                    "sv_detail_is_enable": $(this).hasClass('on') == true ? false : true,
                    "sv_user_configdetail_name": $(this).attr('data-name'),
                    "sv_remark": "后台标签打印机设置"
                };
                var list = [];
                list.push(data);
                saveBackSelectLabel(list);
            }
            else {
                layer.msg("请选择设备打印机");
            }
        });

        // 开启后台打印份数设置
        $(document).on('click', '.PrintSet_network_enable', function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    printSetEnable($('.PrintSet_network_enable').attr('data-moduleId'), $('.PrintSet_network_enable').attr('data-configId'), $('.PrintSet_network_enable').hasClass('open'), 'network');
                }
            });
        });
    },
    weixin: function () {


        $.getJSON("/system/GetUserLogin", function (data) {

            if (data.weixin_openid != "" && data.weixin_openid != null) {
                $("#wangcheng").show().prev().hide();

            } else {

                $("#wangcheng").hide().prev().show();
            }


        });

        $("#yzweixin").click(function () {

            if ($("#wxyzma").val().length < 4) {
                layer.msg("请输入正确的验证码！~");
            } else {

                $.post("/System/BindWeiXin?yzm=" + $("#wxyzma").val(), function (data) {

                    if (data == null) {
                        layer.msg("BOOS您的验证不正确啊！");
                    }
                    else if (data == -2) {
                        layer.msg("你没有该操作权限！");
                    }
                    else {

                        $("#wangcheng").show().prev().hide();
                    }

                });

            }



        });



        $("#qixiao").click(function () {
            if (confirm("您确认要取消微信的绑定吗？一但取消不能再用微信查账了！")) {


                $.post("/System/QBindWeiXin", function (data) {
                    if (data == -2) {
                        layer.msg("你没有该操作权限！");
                    }
                    else {
                        $("#wangcheng").show().prev().hide();
                    }
                });

            }
        });

    },  // 硬件设置
    setHardware: function () {
        //设置IC硬件设置开关
        $(document).unbind("click", ".setTardware i").on("click", ".setTardware i", function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    var values = $('.setTardware').hasClass('open') == true ? false : true;
                    $.postAsyncJson('/UserModuleConfig/ConfigdetailSetHardwareOperate', {
                        valu: values
                    }, function (result) {
                        if (result == true) {
                            if (values) {
                                $('#show_setTardware').css('display', 'block');
                                getUserModuleConfigList();
                                if ($('#SetTardware_port').attr('data-id') == "0") {
                                    saveSetHardware();
                                }
                                $('.setTardware').addClass('open');
                            }
                            else {
                                $('#show_setTardware').css('display', 'none');
                                $('.setTardware').removeClass('open');
                            }
                        }
                        else {
                            layer.msg('设置失败！');
                        }
                    });
                }
            });
        });

        getUserModuleConfigList();

        // 保存IC硬件设置
        $('#btnSaveSetHardware').click(function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    saveSetHardware();
                }
            });
        });

        // 初始化IC卡
        $(document).on("click", "#btnInitialization", function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    try {
                        if (_g_is_ic_type == 1) {
                            var data = Cef.ReadICCardNoWithPwd(_g_is_ic_pwd, true);
                            var result = JSON.parse(data);
                            if (result) {
                                if (result.Success || result.Success == "true" || result.Success == "True") {
                                    var str_f = '';
                                    for (var i = 0; i < result.Message.length; i++) {
                                        str_f += 'f';
                                    }
                                    var initialization = Cef.WriteICCardNoWithPwd(str_f, "ffffff");
                                    var result_initialization = JSON.parse(initialization);
                                    if (result_initialization) {
                                        if (result_initialization.Success || result_initialization.Success == "true" || result_initialization.Success == "True") {
                                            layer.msg("IC卡初始化成功！");
                                            return true;
                                        } else {
                                            layer.msg("IC卡初始化失败：" + result_initialization.Message);
                                            return false;
                                        }
                                    }
                                } else {
                                    layer.msg("读卡失败：" + result.Message);
                                }
                            }
                        } else if (_g_is_ic_type == 0) {
                            //明华330 M1卡初始化
                            var initialization = Cef.URFResetICCard(_g_is_ic_pwd);
                            var result_initialization = JSON.parse(initialization);
                            if (result_initialization) {
                                if (result_initialization.Success || result_initialization.Success == "true" || result_initialization.Success == "True") {
                                    layer.msg("IC卡初始化成功！");
                                    return true;
                                } else {
                                    layer.msg("IC卡初始化失败：" + result_initialization.Message);
                                    return false;
                                }
                            }
                        }

                    }
                    catch (e) {
                        layer.msg("IC卡初始化失败");
                    }
                }
            })
        });

        // 测试IC卡
        $(document).on("click", "#btnTestICCard", function () {
            try {
                var data = { Success: false };
                if (_g_is_ic_type == 1) {
                    data = Cef.CheckICDevice();
                } else if (_g_is_ic_type == 0) {
                    data = Cef.URFCheckICDevice();
                }
                var result_IC = JSON.parse(data);
                if (result_IC.Success || result_IC.Success == "true" || result_IC.Success == "True") {
                    layer.msg("设备测试连接成功！");
                }
                else {
                    layer.msg("设备测试连接失败！");
                }
            }
            catch (e) {
                layer.msg("设备测试连接失败！");
            }
        });
        //---======================客显==========--------------
        // 客显 设置客显硬件设置开关
        $(document).unbind("click", ".setHardwareCusDisplay i").on("click", ".setHardwareCusDisplay i", function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    var values = $('.setHardwareCusDisplay').hasClass('open') == true ? false : true;
                    $.postAsyncJson('/UserModuleConfig/ConfigdetailSetHardwareOperates', {
                        valu: values, muid: 7
                    }, function (result) {
                        if (result == true) {
                            if (values) {
                                $('#show_setHardwareCusDisplay').css('display', 'block');
                                getUserModuleConfigList_CusDisplay();
                                if ($('#show_setHardwareCusDisplay_port').attr('data-id') == "0") {
                                    saveSetHardware_CusDisplay();
                                }
                                $('.setHardwareCusDisplay').addClass('open');
                            }
                            else {
                                $('#show_setHardwareCusDisplay').css('display', 'none');
                                $('.setHardwareCusDisplay').removeClass('open');
                            }
                        }
                        else {
                            layer.msg('设置失败！');
                        }
                    });
                }
            });
        });

        getUserModuleConfigList_CusDisplay();
        // 客显--------------端口读取
        if (((typeof Cef) !== 'undefined')) {
            var comlist = Cef.GetComList();
            if (comlist) {
                $("#Set_Hardware_CusDisplay_Port").empty();
                var comlistModel = JSON.parse(comlist);
                if (comlistModel && comlistModel.length > 0) {
                    for (var j = 0; j < comlistModel.length; j++) {
                        $("#Set_Hardware_CusDisplay_Port")
                            .append(' <option value="' + comlistModel[j] + '">' + comlistModel[j] + '</option>');
                    }
                }
            }
        } else {

        }
        // 客显--------------启用客显硬件设置
        $('#setHardwareCusDisplay').click(function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    saveSetHardware_CusDisplay();
                }
            });
        });

        // 保存客显硬件设置
        $('#btn_setHardwareCusDisplay_save').click(function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    saveSetHardware_CusDisplay();
                }
            });
        });

        $("#show_setHardwareCusDisplay_demo_price").on("click", function () {
            if (((typeof Cef) !== 'undefined') &&
                $("#Set_Hardware_CusDisplay_Port").val() &&
                $("#Set_Hardware_CusDisplay_Baud").val()) {
                //客显 显示价格
                Cef.CustomerDisplay($("#Set_Hardware_CusDisplay_Port").val(),
                    parseInt($("#Set_Hardware_CusDisplay_Baud").val()),
                    "One",
                    8,
                    1,
                    $("#show_setHardwareCusDisplay_demo_price_value").val());
            }
        });
        $("#show_setHardwareCusDisplay_demo_total").on("click", function () {
            //客显 显示合计
            if (((typeof Cef) !== 'undefined') &&
                $("#Set_Hardware_CusDisplay_Port").val() &&
                $("#Set_Hardware_CusDisplay_Baud").val()) {
                Cef.CustomerDisplay($("#Set_Hardware_CusDisplay_Port").val(),
                    parseInt($("#Set_Hardware_CusDisplay_Baud").val()),
                    "One",
                    8,
                    2,
                    $("#show_setHardwareCusDisplay_demo_total_value").val());
            }
        });
        $("#show_setHardwareCusDisplay_demo_receive").on("click", function () {
            if (((typeof Cef) !== 'undefined') &&
                $("#Set_Hardware_CusDisplay_Port").val() &&
                $("#Set_Hardware_CusDisplay_Baud").val()) {
                //客显 显示收款
                Cef.CustomerDisplay($("#Set_Hardware_CusDisplay_Port").val(),
                    parseInt($("#Set_Hardware_CusDisplay_Baud").val()),
                    "One",
                    8,
                    3,
                    $("#show_setHardwareCusDisplay_demo_receive_value").val());

            }
        });
        $("#show_setHardwareCusDisplay_demo_change").on("click", function () {
            if (((typeof Cef) !== 'undefined') &&
                $("#Set_Hardware_CusDisplay_Port").val() &&
                $("#Set_Hardware_CusDisplay_Baud").val()) {
                //客显 显示找零
                Cef.CustomerDisplay($("#Set_Hardware_CusDisplay_Port").val(),
                    parseInt($("#Set_Hardware_CusDisplay_Baud").val()),
                    "One",
                    8,
                    4,
                    $("#show_setHardwareCusDisplay_demo_change_value").val());

            }
        });
        //---======================电子秤==========--------------
        // 电子秤 设置电子秤硬件设置开关
        getUserModuleConfigList_Scale();
        $(document).unbind("click", ".Set_Hareware_Scale i").on("click", ".Set_Hareware_Scale i", function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    var values = $('.Set_Hareware_Scale').hasClass('open') == true ? false : true;
                    $.postAsyncJson('/UserModuleConfig/ConfigdetailSetHardwareOperates', {
                        valu: values, muid: 9
                    }, function (result) {
                        if (result == true) {
                            if (values) {
                                $('#show_Set_Hareware_Scale').css('display', 'block');
                                getUserModuleConfigList_Scale();
                                if ($('#show_Set_Hareware_Scale_port').attr('data-id') == "0") {
                                    saveSetHardware_Scale();
                                }
                                $('.Set_Hareware_Scale').addClass('open');
                            }
                            else {
                                $('#show_Set_Hareware_Scale').css('display', 'none');
                                $('.Set_Hareware_Scale').removeClass('open');
                            }
                        }
                        else {
                            layer.msg('设置失败！');
                        }
                    });
                }
            });
        });

        // 保存客显硬件设置
        $('#btn_setHardwareScale_save').click(function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    saveSetHardware_Scale();
                }
            });
        });
        //电子秤--------------端口读取
        if (((typeof Cef) !== 'undefined')) {
            var comlist = Cef.GetComList();
            if (comlist) {
                $("#Set_Hareware_Scale_Port").empty();
                var comlistModel = JSON.parse(comlist);
                if (comlistModel && comlistModel.length > 0) {
                    for (var j = 0; j < comlistModel.length; j++) {
                        $("#Set_Hareware_Scale_Port").append(' <option value="' + comlistModel[j] + '">' + comlistModel[j] + '</option>');
                    }
                }
            }
        }

        //电子秤----------Set_Hareware_Scale_demo，测试称重
        $("#Set_Hareware_Scale_demo").on("click", function () {
            if ($("#Set_Hareware_Scale_Port").val() &&
                $("#Set_Hareware_Scale_Baud").val() &&
                (typeof Cef) !== 'undefined') {
                var timer1 = setInterval(function () {
                    try {
                        var demo_weight = Cef.GetWeight($("#Set_Hareware_Scale_Port").val(),
                            parseInt($("#Set_Hareware_Scale_Baud").val()));
                        if (demo_weight) {
                            var weightModel = JSON.parse(demo_weight);
                            $("#Set_Hareware_Scale_demo_value").val(weightModel.Weight);
                        }
                    } catch (e) {
                        clearInterval(timer1);
                    }
                },
                    500);
            }
        });

        //---======================分屏设置==========--------------

        getUserModuleConfigList_SecondScreen();
        $(document).unbind("click", ".Set_Hardware_SecondScreen i").on("click", ".Set_Hardware_SecondScreen i", function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    var values = $('.Set_Hardware_SecondScreen').hasClass('open') == true ? false : true;
                    $.postAsyncJson('/UserModuleConfig/ConfigdetailSetHardwareOperates', {
                        valu: values, muid: 8
                    }, function (result) {
                        if (result == true) {
                            if (values) {
                                $('#show_Set_Hardware_SecondScreen').css('display', 'block');
                                //getUserModuleConfigList_Scale();
                                getUserModuleConfigList_SecondScreen();
                                if ($('#show_Set_Hardware_SecondScreen').attr('data-id') == "0") {
                                    //saveSetHardware_Scale();
                                    saveSetHardware_SecondScreen();
                                }
                                $('.Set_Hardware_SecondScreen').addClass('open');
                            }
                            else {
                                $('#show_Set_Hardware_SecondScreen').css('display', 'none');
                                $('.Set_Hardware_SecondScreen').removeClass('open');
                            }
                        }
                        else {
                            layer.msg('设置失败！');
                        }
                    });
                }
            });
        });

        // 保存分屏硬件设置（图片路径）
        $('#btn_Set_Hardware_SecondScreen_save').click(function () {
            $.get('/PermissionsVerify/GetPermissionsVerify?modularName=SystemManage&actionName=CustomPrintVerify', function (data) {
                if (isNullOrWhiteSpace(data)) {
                    window.location.href = data;
                } else {
                    //saveSetHardware_CusDisplay();
                    saveSetHardware_SecondScreen();
                }
            });
        });
    }
};

// 标签打印配置
function saveBackSelectLabel(data) {
    $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=SetTardware', data, function (result) {
        if (result) {
            if (result == 1) {
                layer.msg("保存成功");
                getPrintSetingInfo();
            }
            else if (result == -2) {
                layer.msg("你没有该操作权限！");
            }
            else {
                layer.msg("保存失败");
            }
        }
    });
}

function getMoudelConfigByCode(code) {

}

// 保存开关设置
function printSetEnable(moduleId, configId, enable, type) {
    $.postAsyncJson('/UserModuleConfig/ConfigdetailOperatePrintSet', {
        moduleId: moduleId,
        configId: configId,
        enable: enable == true ? false : true
    }, function (result) {
        if (result == true) {
            if (enable) {
                $('.PrintSet_network_enable').removeClass('open');
            }
            else {
                $('.PrintSet_network_enable').addClass('open');
            }
            layer.msg('保存设置成功！');
        }
        else {
            layer.msg('保存设置失败，请稍后重试！');
        }
    });
}

// 保存打印设置信息
function savePrintSet() {
    var detaillist = [];
    var reg = new RegExp("^[0-5]*$");
    var reg_default = new RegExp("^[1-5]*$");
    var printSet_network = $('#PrintSet_network').val().trim();
    var printSet_default = $('#PrintSet_default').val().trim();
    var printSet_enable = $('.printSet_enable').hasClass('open');
    var printSet_default_device = $('#PrintSet_default_device').val();
    var printSet_network_device = $('#PrintSet_network_device').val();
    if (!reg.test(printSet_network) || printSet_network > 5) {
        layer.msg("请输入数字，并且最多只能打印5份");
        $('#PrintSet_network').focus();
        return;
    }

    if (!reg_default.test(printSet_default) || printSet_default > 5) {
        layer.msg("请输入数字，前台打印机只能输入1到5份");
        $('#PrintSet_default').focus();
        return;
    }

    if (printSet_default_device == null || printSet_default_device == '') {
        layer.msg("您前台打印机设置还没有选择打印机设备");
        return;
    }

    if (printSet_network_device == null || printSet_network_device == '') {
        layer.msg("您后台打印机设置还没有选择打印机设备");
        return;
    }

    $(".form-txtPrint").each(function () {
        var data = {
            "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
            "sv_detail_value": $(this).val(),
            "sv_user_config_id": parseInt($(this).attr("data-configid")),
            "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": $(this).attr('data-name'),
            "sv_remark": "打印机设置"
        };
        detaillist.push(data);
    });
    if (detaillist.length != 0) {
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=SetTardware', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    getPrintSetingInfo();
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    }
}

// 读取打印机设置
function getPrintSetingInfo() {
    $.getJSON('/UserModuleConfig/GetUserModuleConfigList?module_code=PrintSeting', function (result) {
        if (result != null) {
            var childInfolist = result.childInfolist;
            if (childInfolist != null && childInfolist.length > 0) {
                for (var i = 0; i < childInfolist.length; i++) {
                    var childDetailList = childInfolist[i].childDetailList[0];
                    if (childDetailList != null) {
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_network_enable') {
                            if (childDetailList.sv_detail_is_enable) {
                                $('.PrintSet_network_enable').addClass('open');
                            }
                            $('.PrintSet_network_enable').attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                        }
                        $('#' + childInfolist[i].sv_user_config_code).val(childDetailList.sv_detail_value).attr('data-id', childDetailList.sv_user_configdetail_id).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_default_device' && childDetailList.sv_detail_value != null && childDetailList.sv_detail_value != '') {
                            if ($('#PrintSet_default_device').html() != null && $('#PrintSet_default_device').html() != '') {
                                $('#PrintSet_default_device').val(childDetailList.sv_detail_value);
                            }
                            else {
                                $('#' + childInfolist[i].sv_user_config_code).html('<option value="' + childDetailList.sv_detail_value + '">' + childDetailList.sv_detail_value + '</option>');
                            }
                        }
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_network_device' && childDetailList.sv_detail_value != null && childDetailList.sv_detail_value != '') {
                            if ($('#PrintSet_network_device').html() != null && $('#PrintSet_network_device').html() != '') {
                                $('#PrintSet_network_device').val(childDetailList.sv_detail_value);
                            }
                            else {
                                $('#' + childInfolist[i].sv_user_config_code).html('<option value="' + childDetailList.sv_detail_value + '">' + childDetailList.sv_detail_value + '</option>');
                            }
                        }
                        // 标签机前台
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_network_device_font_islabel' && childDetailList.sv_detail_value != null && childDetailList.sv_detail_value != '') {
                            if (childDetailList.sv_detail_is_enable == true) {
                                $('#PrintSet_network_device_font_islabel').addClass('on');
                            }
                        }
                        // 标签机前台
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_network_device_back_islabel' && childDetailList.sv_detail_value != null && childDetailList.sv_detail_value != '') {
                            if (childDetailList.sv_detail_is_enable == true) {
                                $('#PrintSet_network_device_back_islabel').addClass('on');
                            }
                        }
                    }
                    else {
                        if (childInfolist[i].sv_user_config_code == 'PrintSet_network_enable') {
                            $('.PrintSet_network_enable').attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                        }
                        $('#' + childInfolist[i].sv_user_config_code).attr('data-id', 0).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                    }
                }
            }
        }
    });
}

// 保存硬件设置
function saveSetHardware() {
    if ($('#SetTardware_type').val() == '2') {
        layer.msg("暂不支持");
        return;
    }
    var detaillist = [];
    $(".form-setTardware").each(function () {
        var data = {
            "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
            "sv_detail_value": $(this).val(),
            "sv_user_config_id": parseInt($(this).attr("data-configid")),
            "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": $(this).attr('data-name'),
            "sv_remark": "IC卡设置"
        };
        detaillist.push(data);
    });
    if (detaillist.length != 0) {
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=SetTardware', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    _g_is_ic_pwd = $("#SetTardware_pwd").val();
                    getUserModuleConfigList();
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    }
}

// 保存硬件设置--客显配置
function saveSetHardware_CusDisplay() {
    var detaillist = [];
    $(".form-setHardwareCusDisplay").each(function () {
        var data = {
            "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
            "sv_detail_value": $(this).val(),
            "sv_user_config_id": parseInt($(this).attr("data-configid")),
            "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": $(this).attr('data-name'),
            "sv_remark": "客显配置"
        };
        detaillist.push(data);
    });
    if (detaillist.length != 0) {
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=Set_Hardware_CusDisplay', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    getUserModuleConfigList();
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    }
}

// 保存硬件设置--电子秤配置
function saveSetHardware_Scale() {
    var detaillist = [];
    $(".form-Set_Hareware_Scale").each(function () {
        var data = {
            "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
            "sv_detail_value": $(this).val(),
            "sv_user_config_id": parseInt($(this).attr("data-configid")),
            "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": $(this).attr('data-name'),
            "sv_remark": "电子秤设置"
        };
        detaillist.push(data);
    });
    if (detaillist.length != 0) {
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=Set_Hareware_Scale', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    getUserModuleConfigList();
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    }
}


// 保存硬件设置-分屏配置
function saveSetHardware_SecondScreen() {
    var detaillist = [];
    $(".form-Set_Hardware_SecondScreen").each(function () {
        var data = {
            "sv_user_configdetail_id": parseInt($(this).attr('data-id')),
            "sv_detail_value": $(this).attr("src"),
            "sv_user_config_id": parseInt($(this).attr("data-configid")),
            "sv_user_module_id": parseInt($(this).attr("data-moduleid")),
            "sv_detail_is_enable": true,
            "sv_user_configdetail_name": $(this).attr('data-name'),
            "sv_remark": "分屏设置"
        };
        detaillist.push(data);
    });
    if (detaillist.length != 0) {
        $.postAsyncContentJson('/UserModuleConfig/SaveConfigdetailList?moduleCode=Set_Hardware_SecondScreen', detaillist, function (result) {
            if (result) {
                if (result == 1) {
                    layer.msg("保存成功");
                    getUserModuleConfigList();
                }
                else if (result == -2) {
                    layer.msg("你没有该操作权限！");
                }
                else {
                    layer.msg("保存失败");
                }
            }
        });
    }
}


// 读取IC硬件设置
function getUserModuleConfigList() {
    $.getJSON('/UserModuleConfig/GetUserModuleConfigList?module_code=SetTardware', function (result) {
        if (result != null) {
            var childInfolist = result.childInfolist;
            if (childInfolist != null && childInfolist.length > 0) {
                for (var i = 0; i < childInfolist.length; i++) {
                    var childDetailList = childInfolist[i].childDetailList[0];
                    if (childDetailList != null) {
                        if (childDetailList.sv_detail_is_enable) {
                            $('#' + childInfolist[i].sv_user_config_code).val(childDetailList.sv_detail_value).attr('data-id', childDetailList.sv_user_configdetail_id).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);

                            $('.setTardware').addClass('open');
                            $('#show_setTardware').css('display', 'block');
                        }
                        else {
                            $('#show_setTardware').css('display', 'none');
                        }
                    }
                    else {
                        $('#' + childInfolist[i].sv_user_config_code).attr('data-id', 0).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                    }
                }
            }
        }
    });
}

// 读取客显硬件设置
function getUserModuleConfigList_CusDisplay() {
    $.getJSON('/UserModuleConfig/GetUserModuleConfigList?module_code=Set_Hardware_CusDisplay', function (result) {
        if (result != null) {
            var childInfolist = result.childInfolist;
            if (childInfolist != null && childInfolist.length > 0) {
                for (var i = 0; i < childInfolist.length; i++) {
                    var childDetailList = childInfolist[i].childDetailList[0];
                    if (childDetailList != null) {
                        if (childDetailList.sv_detail_is_enable) {
                            $('#' + childInfolist[i].sv_user_config_code).val(childDetailList.sv_detail_value).attr('data-id', childDetailList.sv_user_configdetail_id).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);

                            $('.setHardwareCusDisplay').addClass('open');
                            $('#show_setHardwareCusDisplay').css('display', 'block');
                        }
                        else {
                            $('#show_setHardwareCusDisplay').css('display', 'none');
                        }
                    }
                    else {
                        $('#' + childInfolist[i].sv_user_config_code).attr('data-id', 0).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                    }
                }
            }
        }
    });
}

// 读取电子秤硬件设置
function getUserModuleConfigList_Scale() {
    $.getJSON('/UserModuleConfig/GetUserModuleConfigList?module_code=Set_Hareware_Scale', function (result) {
        if (result != null) {
            var childInfolist = result.childInfolist;
            if (childInfolist != null && childInfolist.length > 0) {
                for (var i = 0; i < childInfolist.length; i++) {
                    var childDetailList = childInfolist[i].childDetailList[0];
                    if (childDetailList != null) {
                        if (childDetailList.sv_detail_is_enable) {
                            $('#' + childInfolist[i].sv_user_config_code).val(childDetailList.sv_detail_value).attr('data-id', childDetailList.sv_user_configdetail_id).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);

                            $('.Set_Hareware_Scale').addClass('open');
                            $('#show_Set_Hareware_Scale').css('display', 'block');
                        }
                        else {
                            $('#show_Set_Hareware_Scale').css('display', 'none');
                        }
                    }
                    else {
                        $('#' + childInfolist[i].sv_user_config_code).attr('data-id', 0).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                    }
                }
            }
        }
    });
}

// 读取分屏硬件设置
function getUserModuleConfigList_SecondScreen() {
    $.getJSON('/UserModuleConfig/GetUserModuleConfigList?module_code=Set_Hardware_SecondScreen', function (result) {
        if (result != null) {
            var childInfolist = result.childInfolist;
            if (childInfolist != null && childInfolist.length > 0) {
                for (var i = 0; i < childInfolist.length; i++) {
                    var childDetailList = childInfolist[i].childDetailList[0];
                    if (childDetailList != null) {
                        if (childDetailList.sv_detail_is_enable) {
                            $('#' + childInfolist[i].sv_user_config_code).val(childDetailList.sv_detail_value).attr('data-id', childDetailList.sv_user_configdetail_id).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                            $('#' + childInfolist[i].sv_user_config_code).attr("src", childDetailList.sv_detail_value);
                            $('.Set_Hardware_SecondScreen').addClass('open');
                            $('#show_Set_Hardware_SecondScreen').css('display', 'block');
                        }
                        else {
                            $('#show_Set_Hardware_SecondScreen').css('display', 'none');
                        }
                    }
                    else {
                        $('#' + childInfolist[i].sv_user_config_code).attr('data-id', 0).attr('data-moduleid', result.sv_user_module_id).attr('data-configid', childInfolist[i].sv_user_config_id);
                    }
                }
            }
        }
    });
}


var index = 0;

var Deke = {

    /// <signature>
    ///   <summary>弹窗</summary>
    /// </signature>
    DeKe_dialog: {

        /// <signature>
        ///   <summary>创建弹窗</summary>
        /// </signature>
        show_Url: function (title, url, btn, c, f, area) {

            $.get(url, function (data) {
                index = layer.open({
                    type: 1, //page层
                    title: title,
                    shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 0, //0-6的动画形式，-1不开启
                    area: area || ['620px', '540px'], //宽高
                    closeBtn: 1,
                    content: data,
                    scrollbar: false,
                    btn: btn,//可以无限个按钮
                    yes: c
                });
                if (f) {
                    //alert("sss");
                    f();

                }


            });


        },

        show_Url2: function (title, url, f, area) {
            $.get(url, function (data) {
                index = layer.open({
                    type: 1, //page层
                    title: title,
                    shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 0, //0-6的动画形式，-1不开启
                    area: area || ['620px', '540px'], //宽高
                    closeBtn: 1,
                    content: data,
                    scrollbar: false

                });

                if (f) {
                    setTimeout(function () {
                        f();
                    }, 200);
                }
            });

        },
        show_Url3: function (title, url, f, area, id) {


            $.get(url, function (data) {
                index = layer.open({
                    id: id,
                    type: 1, //page层
                    title: title,
                    shade: 0.6, //遮罩透明度
                    moveType: 1, //拖拽风格，0是默认，1是传统拖动
                    shift: 0, //0-6的动画形式，-1不开启
                    area: area || ['620px', '540px'], //宽高
                    closeBtn: 1,
                    content: data,
                    scrollbar: false

                });

                if (f) {
                    //alert("sss");
                    f();

                }

            });

        },
        /// <signature>
        ///   <summary>加载HTML</summary>
        /// </signature>
        loadHtml: function (url, typeid) {

            $("#" + typeid).load(url);

        }





        ////判断是否第一层
        //if ($(".modal-backdrop").length > 0) {
        //    $(".modal-backdrop").each(function () {

        //        $(this).css("z-index", 1010);
        //    });
        //    $(".modal").each(function () {

        //        $(this).css("z-index", 1020);
        //    });

        //}
        ////生成代码
        //var id = Math.floor(Math.random() * 99999 + 1);
        //$('<div class="modal " id="' + id + '"><div class="modal-dialog"><div class="modal-content" id="modal-content' + id + '"></div><!-- /.modal-content --></div><!-- /.modal --> </div>').appendTo(".motaikuang");
        //if (url != null) {

        //    $("#modal-content" + id).load(url);

        //}

        //$('#' + id).modal('show');
        //$('#' + id).on('hide.bs.modal', function () {
        //    $('#' + id).remove();
        //});
        //,
        ///// <signature>
        /////   <summary>确认框（注意，C 是function 方法）</summary>
        ///// </signature>
        //confirm: function (title, mes, c) {

        //    a = title;
        //    title = title || "系统提示";
        //    var html=' <div class="modal " id="Duihgift">';
        //    html+='<div class="modal-dialog" > <div class="modal-content">';
        //    html+=' <div class="modal-header">';
        //    html+='   <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
        //    html+=' <h4 class="modal-title"> '+title+' </h4>';
        //    html+=' </div>';
        //    html+='<div class="modal-body">';
        //    html+='<div class="titlebox">';
        //    html += '<h3><i class=" icon-question-sign"></i><span>' + mes + '</span></h3>';
        //    html += '</div></div><div class="modal-footer">';
        //    if (a == null) {
        //        html += ' <button type="button" class="button  button-default button-rounded button-small" data-dismiss="modal">我知道了</button>';
        //    }
        //    else {
        //        html += '  <button type="button" class="button  button-primary button-rounded button-small" id="confirmok">确认</button>';
        //        html += ' <button type="button" class="button  button-default button-rounded button-small" data-dismiss="modal">取消</button>';
        //    }
        //    html += ' </div>';
        //    html += ' </div></div> </div>';
        //    $('#Duihgift').on('hide.bs.modal', function () {
        //        $('#Duihgift').remove();
        //    });
        //    $(".motaikuang").append(html);
        //    $('#Duihgift').modal('show');
        //    $("#confirmok").click(c);
        //},
        ///// <signature>
        /////   <summary>Alert提示框</summary>
        ///// </signature>
        //Alert: function (mes)
        //{

        //    Deke.DeKe_dialog.confirm(null,mes,null);
        //}


    }


};

///支出相关
var expenditure = {

    category: function () {


        $.getJSON("/expenditure/GetCategory", function (data) {
            var html = '';

            for (var i = 0; i < data.length; i++) {

                if (data[i].ecategorylive == 0) {
                    html += ' <tr  data-id="' + data[i].ecategoryid + '">';
                    html += '  <td class="textRight">';
                    html += '<ul class="cate_body"><li data-id="' + data[i].ecategoryid + '"><a href="#">' + data[i].ecategoryname + '<i class="poriss  icon-edit " id=' + data[i].ecategoryid + ' + data[b].ecategoryid + ' + '></i><em class="porvv icon-trash delete"  data-id="' + data[i].ecategoryid + '"></em></a></li>';
                    html += '<li class="new_type" data-id="' + data[i].ecategoryid + '">';
                    html += '                       <div style="display: none;">';
                    html += '               <input class="left" value="' + data[i].ecategoryname + '" maxlength="20">';
                    html += '               <i class="icon-ok okbtn1"></i>';
                    html += ' <i class="icon-remove removebtn"></i>';
                    html += ' </div> </li></ul>';
                    html += '</td> <td class="textLeft"> <ul class="cate_body">';
                    for (var b = 0; b < data.length; b++) {

                        if (data[b].superiorecategoryid == data[i].ecategoryid) {
                            html += '<li data-id="' + data[b].ecategoryid + '"><a href="#" id=' + data[b].ecategoryid + '>' + data[b].ecategoryname + '<i class="poriss  icon-edit " id=' + data[b].ecategoryid + '></i><em class="porvv icon-trash delete"  data-id="' + data[b].ecategoryid + '"></em></a></li>';
                            html += '<li class="new_type" data-id="' + data[b].ecategoryid + '">';

                            html += '                       <div style="display: none;">';
                            html += '               <input class="left" value="' + data[b].ecategoryname + '" maxlength="20">';
                            html += '               <i class="icon-ok okbtn1"></i>';
                            html += ' <i class="icon-remove removebtn"></i>';
                            html += ' </div> </li>';
                        }
                    }

                    html += '<li class="new_type">';
                    html += '                     <p class="addSubtype" id=' + data[i].ecategoryid + ' ><i class="icon-plus"></i></p>';
                    html += '                       <div style="display: none;">';
                    html += '               <input class="left" maxlength="20">';
                    html += '               <i class="icon-ok okbtn"></i>';
                    html += ' <i class="icon-remove removebtn"></i>';
                    html += ' </div> </li>';
                    html += '    </ul> </td> </tr>';
                }

            }
            $("#Categorylist").html(html);


        });


        //点击修改
        $(document).on('click', '.icon-edit', function () {

            // alert($(this).parent().parent().next().html());
            //$(this).fadeOut(0).siblings('div').fadeIn(250);

            ////分类添加 的关闭事件
            //$('.removebtn').click(function () {
            //    $(this).parent().fadeOut(0).siblings('p').fadeIn(0);
            //});

            // var val = $(this).prev().text();
            var val = $(this).parent().parent().text();
            var sid = $(this).attr('id');
            layer.prompt({
                formType: 0,
                title: '请输入分类',
                value: val,
                cancel: function (index) {

                    //console.log('弹层的 index', index);
                }
            }, function (value, index, elem) {
                var ecategoryModel = [];
                ecategoryModel.push({
                    name: "model.ecategoryid",
                    value: sid,
                });
                ecategoryModel.push({
                    name: "model.ecategoryname",
                    value: value,
                });
                $.ajax({
                    url: "/expenditure/PpostCategory",
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "json",
                    data: ecategoryModel,
                    success: function (data) {
                        layer.msg("更新成功");
                        expenditure.category();
                    },
                    error: function () {
                        alert("请求超时！");
                    }

                });
            });
            // $(this).parent().parent().fadeOut(2).next().find("div").show();

        });



        //分类点击添加事件

        $(document).on('click', '.addSubtype', function () {

            //$(this).fadeOut(0).siblings('div').fadeIn(250);
            //var val = $(this).parent().parent().parent().parent().text();
            var superiorecategoryid = null;
            var superiorecategoryid = $(this).attr('id');
            layer.prompt({
                formType: 0,
                title: '请输入分类',
                cancel: function (index) {
                    //console.log('弹层的 index', index);  model.superiorecategoryid
                }
            }, function (value, index, elem) {

                $.post("/expenditure/PpostCategory", { "ecategoryname": value, "ecategorylive": 1, "superiorecategoryid": superiorecategoryid }, function (data) {
                    expenditure.category();
                    if (data > 0) {
                        //var html = '<li data-id="' + data + '"><a href="#">' + inputval + '<i class="poriss  icon-edit "></i><em class="porvv icon-trash delete"  data-id="' + data + '"></em></a> </li>';
                        //html += '<li class="new_type" data-id="' + data + '">';

                        //html += '                       <div style="display: none;">';
                        //html += '               <input class="left" value="' + inputval + '" maxlength="20">';
                        //html += '               <i class="icon-ok okbtn1"></i>';
                        //html += ' <i class="icon-remove removebtn"></i>';
                        //html += ' </div> </li>';
                        //isname.parents('li').before(html);
                        //isname.siblings('input').val('');//清空input的值
                        //isname.parent().fadeOut(0).siblings('p').fadeIn(0);
                        layer.msg("添加成功！");
                        expenditure.category();
                    }
                });
                //$.ajax({
                //    url: "/expenditure/PpostCategory",
                //    type: "POST",
                //    contentType: "application/x-www-form-urlencoded",
                //    dataType: "json",
                //    data: ecategoryModel,
                //    success: function (data) {
                //        layer.msg("添加成功");
                //        expenditure.category();
                //    },
                //    error: function () {
                //        alert("请求超时！");
                //    }

                //});
                // systemPwd(value);
                //systemPwd(value);

                //layer.close(index);
            });
            //分类添加 的关闭事件
            //$('.removebtn').click(function () {

            //    $(this).parent().fadeOut(0).siblings('p').fadeIn(0);
            //});

        });
        $("#xxx").click(function () {
            //prompt层
            layer.prompt({
                title: '输入大分类名称，并确认',
                formType: 0 //prompt风格，支持0-2
            }, function (pass) {
                layer.load();
                $.post("/expenditure/PpostCategory", { "ecategoryname": pass, "ecategorylive": 0 }, function (data) {
                    layer.closeAll();
                    if (data > 0) {
                        var html = '';
                        html += '<tr data-id="' + data + '">';
                        html += '<td class="textRight">';
                        html += '<div class="updateclass">';
                        html += '<p class="type cutlong"  id="' + data + '" >' + pass + '</p>';
                        html += '</div></td> <td class="textLeft"> <ul class="cate_body">';
                        html += '<li class="new_type">';
                        html += '<p class="addSubtype"><i class="icon-plus"></i></p>';
                        html += '<div style="display: none;">';
                        html += '<input class="left" maxlength="20">';
                        html += '<i class="icon-ok okbtn"></i>';
                        html += '<i class="icon-remove removebtn"></i>';
                        html += '</div>';
                        html += '</li> </ul></td> </tr>';
                        $("#Categorylist").append(html);

                        layer.msg("添加成功！");
                        expenditure.category();
                    }


                });

            });
        });


        //$(document).on("click", ".okbtn", function () {
        //    var inputval = $(this).siblings('input').val();
        //    if (inputval.length < 1) {
        //        layer.msg("请输入完整分类");
        //        return;
        //    }
        //    var isname = $(this);
        //    // alert($(this).parent().parent().parent().parent().parent().data("id"));
        //    $.post("/expenditure/PpostCategory", { "ecategoryname": inputval, "ecategorylive": 1, "superiorecategoryid": $(this).parent().parent().parent().parent().parent().data("id") }, function (data) {
        //        layer.closeAll();
        //        if (data > 0) {
        //            var html = '<li data-id="' + data + '"><a href="#">' + inputval + '<i class="poriss  icon-edit "></i><em class="porvv icon-trash delete"  data-id="' + data + '"></em></a> </li>';
        //            html += '<li class="new_type" data-id="' + data + '">';

        //            html += '                       <div style="display: none;">';
        //            html += '               <input class="left" value="' + inputval + '" maxlength="20">';
        //            html += '               <i class="icon-ok okbtn1"></i>';
        //            html += ' <i class="icon-remove removebtn"></i>';
        //            html += ' </div> </li>';
        //            isname.parents('li').before(html);
        //            isname.siblings('input').val('');//清空input的值
        //            isname.parent().fadeOut(0).siblings('p').fadeIn(0);
        //            layer.msg("添加成功！");
        //            expenditure.category();
        //        }
        //    });

        //});


        /////修改二级分类

        //$(document).on("click", ".okbtn1", function () {
        //    var inputval = $(this).siblings('input').val();
        //    //$(this).parent().hide().parent().prev().show().find("a").text(inputval);
        //    // var html = '<li><a href="#">' + inputval + '<i class="poriss  icon-edit "></i><em class="porvv icon-trash "></em></a> </li>';
        //    //$(this).parents('li').before(html);
        //    //$(this).siblings('input').val('');//清空input的值
        //    //$(this).parent().fadeOut(0).siblings('p').fadeIn(0);
        //    // alert($(this).parent().parent().parent().parent().parent().data("id"));


        //    //   alert($(this).parent().data("id"));

        //    $.post("/expenditure/PpostCategory", { "ecategoryname": inputval, "ecategorylive": 1, "superiorecategoryid": $(this).parent().parent().parent().parent().parent().data("id"), "ecategoryid": $(this).parent().parent().data("id") }, function (data) {
        //        layer.closeAll();
        //        expenditure.category();
        //        if (data > 0) {
        //            layer.msg("修改成功！");


        //        }
        //    });



        //});


        //分类添加分类名称事件
        //$('.okbtn').click(function () {
        //    var inputval = $(this).siblings('input').val();
        //    var html = '<li><a href="#">' + inputval + '<i class="poriss  icon-edit "></i><em class="porvv icon-trash "></em></a> </li>';
        //    $(this).parents('li').before(html);
        //    $(this).siblings('input').val('');//清空input的值
        //    $(this).parent().fadeOut(0).siblings('p').fadeIn(0);

        //});
        $(document).on("click", ".delete", function () {

            var name = $(this);

            layer.confirm("确认要删除选中的信息吗？", { btn: ["确认", "取消删除"] }, function () {

                $.post("/expenditure/deletecategory/" + name.data("id"), function (data) {
                    if (data > 0) {
                        layer.alert("正在使用中，不能删除");
                        //name.parent().remove();
                        // page($("#date").val(), $("#date2").val()); 
                        return;
                    }
                    else {
                        $.ajax(
                        {
                            type: "GET",
                            url: "/expenditure/deleteCate?id=" + name.data("id"),
                            dataType: "json",
                            success: function (datas) {
                                name.parent().remove();
                                layer.msg("删除成功");
                                //$("#Categorylist").html();
                                expenditure.category();
                            }
                        });
                    }



                });

            });

        });

    }


};

//短信相关
var sms = {

    ///短信设置
    smsconfiguration: function () {

        $('.stecs i').click(function () {
            $(this).parent().toggleClass('on').siblings().removeClass('on');
            var is = $(this).parent().hasClass('on') ? 1 : 0;

            $.post("/sms/Update_smskaiguan", { id: is, name: $(this).parent().attr("id") }, function (data) {

                if (data) {
                    //  layer.closeAll();
                    layer.msg("保存成功");
                    // $("#" + data.name).text(data.text);
                }
            });

        });

        $.getJSON("/system/GetUserSv_userconfig", function (data) {
            //  alert(data.sv_smscontion);
            var model = $.parseJSON(data.sv_smscontion);


            if (model.newuser == 1) {
                $("#newuser").addClass("on");

            } else {
                $("#newuser").removeClass("on");
            }

            if (model.chongci == 1) {
                $("#chongci").addClass("on");

            } else {
                $("#chongci").removeClass("on");
            }
            if (model.ischuxu == 1) {
                $("#ischuxu").addClass("on");

            } else {
                $("#ischuxu").removeClass("on");
            }
            if (model.xiaofei == 1) {
                $("#xiaofei").addClass("on");

            } else {
                $("#xiaofei").removeClass("on");
            }

            if (model.syzfu == 1) {
                $("#syzfu").addClass("on");

            } else {
                $("#syzfu").removeClass("on");
            }
            for (var item in model) {
                if (item != "newuser" && item != "ischuxu" && item != "xiaofei" && item != "ischuxu" && item != "chongci" && item != "syzfu")
                    $("#" + item).text(model[item]);

            }

        });

        $(".chetemplate").click(function () {

            classsid = $(this).data("id");
            Deke.DeKe_dialog.show_Url("更换模板", "/Html/sms/smstempate.html", ["保存", "取消"], savetemp, gettemtlp, ["600px", "560px"]);

        });

        function gettemtlp() {
            $.getJSON("/sms/Getmtemolate/" + classsid, function (data) {

                for (var i = 0; i < data.length; i++) {
                    //class="active"
                    $("#listtemp").append(' <li data-id="' + data[i].sms_mes_id + '">  <p>' + data[i].sms_mes_text + '</p> </li>');
                }
                $('.dxpzxxset li').click(function () {
                    $(this).addClass('active').siblings().removeClass('active');
                });

            });
        }

        function savetemp() {
            $.post("/sms/Update_smstemp", { id: $("#listtemp li.active").data("id"), text: $("#listtemp li.active ").text(), classid: classsid }, function (data) {

                if (data.r) {
                    layer.closeAll();
                    layer.msg("保存成功");
                    $("#" + data.name).text(data.mes);

                }

            });
        }
    },
    List: function () {
        page("", "", "", -1);

        $("#sate_satae").change(function () {


            page($(".bzhxdaohang li.active").data("val"), $("#date").val(), $("#date2").val(), $("#sate_satae").val(), -1);
        });
        //点击查询
        $("#woyaochaxue").click(function () {
            page($(".bzhxdaohang li.active").data("val"), $("#date").val(), $("#date2").val(), -1);
        });
        //选择今日 昨天本月 上月的点击事件
        $('.bzhxdaohang li ,.znfxhyxqbox .bzhxdaohang li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            var index = $('.znfxhyxqbox .bzhxdaohang li').index(this);
            $('.winlvom>div').eq(index).fadeIn().siblings().fadeOut(0);

            if ($(this).data("val") != 3) {
                //  alert($(this).data("val"));
                page($(this).data("val"));
            }
            //点击其他显示时间选择
            if ($('.qitbbb').hasClass('active')) {

                $('.sjxuantime').fadeIn(250);
            } else {
                $('.sjxuantime').hide(150);
            }
        });
        if ($("#usrCount").length == 0) {
            var start = {

                elem: '#date',
                format: 'YYYY/MM/DD',
                //   min: laydate.now(), //设定最小日期为当前日期
                max: '2099-06-16 23:59:59', //最大日期
                istime: false,
                istoday: false,
                choose: function (datas) {
                    end.min = datas; //开始日选好后，重置结束日的最小日期
                    end.start = datas //将结束日的初始值设定为开始日
                }
            };
            var end = {
                elem: '#date2',
                format: 'YYYY/MM/DD',
                min: laydate.now(),
                max: laydate.now(),
                istime: false,
                istoday: false,
                choose: function (datas) {
                    start.max = datas; //结束日选好后，重置开始日的最大日期
                }
            };
            laydate(start);
            laydate(end);
            laydate.skin('molv');//主题皮肤
        }
        function page(day, date, date2, sate) {

            //初始化分页内容
            $.get("/Sms/GetCount/", { "day": day, "date": date, "date2": date2, "sate": sate }, function (data) {

                // $("#User_cout").text(data);
                var i = Math.ceil(data / 6);
                // alert(data);
                laypage({
                    cont: $('#pageGro'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: i, //总页数
                    skin: 'molv', //皮肤
                    first: '首页', //若不显示，设置false即可
                    last: '尾页', //若不显示，设置false即可
                    prev: '上一页', //若不显示，设置false即可
                    next: '下一页', //若不显示，设置false即可

                    jump: function (e, first) {
                        Pgaelist(e.curr, day, date, date2, sate);
                    }
                });
            });
        }

        ////
        function Pgaelist(page, day, date, date2, sate) {

            var namesss = "";
            $.getJSON("/Sms/GetList/" + page, { "day": day, "date": date, "date2": date2, "sate": sate }, function (data) {

                if (data != null) {
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        var sms_smslist_text = data[i].sms_smslist_text;
                        if (sms_smslist_text.length > 20) {
                            sms_smslist_text = sms_smslist_text.substring(0, 30) + '...';
                        }
                        html += ' <tr data-text="' + data[i].sms_smslist_text + '" data-moble="' + data[i].sms_smslistmoble + '" ';
                        html += 'data-name="' + data[i].member_name + '"> <td>' + data[i].member_name + '</td> <td><span>' + data[i].sms_smslistmoble + '</span></td><td>';
                        html += '<span>' + sms_smslist_text + '</span></td>  <td><span>已发送</span></td>  <td>';
                        html += '<span>' + new Date(data[i].sms_smslistdate).Format("yyyy-MM-dd hh:mm:ss") + '</span></td> ';
                        html += '<td><a href="javascript:void(0);" class="view_ms" >详情</a></td> </tr>';
                    }
                }

                $("#prlist").html(html);

                $(".view_ms").click(function () {
                    namesss = $(this).parent().parent();
                    Deke.DeKe_dialog.show_Url("查看信息详情", "/Html/sms/viewmes.html", ["关闭"], null, Tf, ["460px", "350px"]);
                });

                function Tf() {
                    $("#text_name").val(namesss.data("name") + "(" + namesss.data("moble") + ")");
                    $("#txt_content").val(namesss.data("text").replace(/【/ig, '').replace(/】/ig, ''));
                }

            });

        }


    }


};

// 数据请求封装
$.extend({
    getJson: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            async: false,
            cache: true,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    getAsyncJson: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            async: false,
            cache: true,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    postAsyncJson: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            //contentType: "application/json",
            async: true,
            cache: false,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    postAsyncContentJson: function (url, data, success) {
        data = JSON.stringify(data);
        return $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            async: true,
            cache: false,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    postJson: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            async: false,
            cache: false,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    getHtml: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'html',
            async: false,
            cache: false,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    getAsyncHtml: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'get',
            dataType: 'html',
            async: true,
            cache: false,
            data: data,
            success: function (result) {
                success(result);
            }
        });
    },
    postHtml: function (url, data, success) {
        return $.ajax({
            url: url,
            type: 'post',
            dataType: 'html',
            async: true,
            cache: false,
            data: data,
            success: function (result) {
                success(eval(result));
            }
        });
    }
});

// 判断字符串是否为null，还是空或是空字符串,返回true或false
function isNullOrWhiteSpace(str) {
    if (str != null || str != undefined)
        str = str.trim();
    if (str == null || str == '' || str == undefined) {
        return false;
    }
    else {
        return true;
    }
}

// 判断字符串是否为空还是NULL,还是undefined
function isNullOrEmpty(str) {
    if (str.trim() == null || str.trim() == '' || str.trim() == undefined) {
        return false;
    }
    else {
        return true;
    }
}

var money = '';

// 调用计数器方法
function jisuqi(txtmoneyId, jsbutton, title) {
    money = txtmoneyId;

    if (isNullOrWhiteSpace(jsbutton)) {
        $(jsbutton).click(function () {
            Deke.DeKe_dialog.show_Url2(title, "/html/cash/jishu.html?v=25", huidiao, ['310px', '']);
        });
    }

    $("#jishukuan").val($("#jishukuan").val());
}

// 回调
function huidiao() {
    $('.calui li').click(function () {
        $("#jishukuan").val($("#jishukuan").val() + $(this).data("val"));
    });

    $("#jishukuan").val("");
    $("#jishukuan").focus();
    $(".posia").click(function () {
        $("#jishukuan").val("");
        $("#jishukuan").focus();
    });

    $("#woquren").click(function () {
        $(money).val($("#jishukuan").val());
        layer.close(index);
    });

    $("#quxiao i").click(function () {
        layer.close(index);
    });

    $("#jishukuan").keydown(function (key) {
        if (key.keyCode == "13") {
            $("#woquren").click();
        } else if (key.keyCode == "27") {
            layer.close(index);
        }
    });
}

// 省市区联动下拉（省id，市Id,区Id）
function provincialCity(provinceId, cityId, districtId) {
    //页面加载时只需绑定省份下拉框
    $.get("/Ajaxdata/GetPCD/1", function (data) {
        if (data.length > 0) {
            for (var i in data) {
                $(provinceId).append("<option value=\"" + data[i].code + "\">" + data[i].name + "</option>");
            }
            $(provinceId).val($(provinceId).val()).change();
        }
    });

    //联动
    $(provinceId).change(function () {
        $(districtId).empty();
        $.get("/Ajaxdata/GetCityInterlock/" + $(provinceId).val(), function (data1) {
            $(cityId).empty();//清空城市下拉框
            for (var i in data1) {
                $(cityId).append("<option value=\"" + data1[i].code + "\">" + data1[i].name + "</option>");
            }
            $(cityId).val($(cityId).val());
            $(cityId).change();
        });
    });

    //改变省份
    $(cityId).change(function () {
        $.get("/Ajaxdata/GetDistrictInterlock/" + $(cityId).val(), function (data) {
            if (data.length > 0) {
                $(districtId).empty();
                for (var i in data) {
                    $(districtId).append("<option value=\"" + data[i].code + "\">" + data[i].name + "</option>");
                }
                $(districtId).val($(districtId).val());
            }
        });
    });
}

/// <summary>
/// checkbox全选反选
/// </summary>
/// <param name="checkAllId">全选checkbox的Id</param>
/// <param name="checkListName">要全选的checkbox列表名称Name</param>
function checkboxAll(checkAllId, checkListName) {
    var coAll = document.getElementById(checkAllId);
    var coll = document.getElementsByName(checkListName);
    $('#' + checkAllId + '').click(function () {
        if (coAll.checked) {
            for (var i = 0; i < coll.length; i++) {
                coll[i].checked = true;
            }
        } else {
            for (var i = 0; i < coll.length; i++) {
                coll[i].checked = false;
            }
        }
    });

    $(coll).click(function () {
        if ($(this).prop("checked")) {
            setTimeout(function () {
                if ($('input[name=' + checkListName + ']:checked').length == $('input[name=' + checkListName + ']').length) {
                    $(coAll).prop('checked', true);
                }
            }, 200);

        } else {
            $(coAll).prop('checked', false);
        }
    });
}

// 勾选子项复选框
function checkBoxSon(checkAllId, checkListId) {
    $('#' + checkAllId).click(function () {
        var checkAll = document.getElementById(checkAllId);
        var checkList = $('#' + checkListId + ' input:checkbox');
        if (checkAll.checked) {
            $('#' + checkListId + ' input:checkbox').each(function () {
                $(this).prop('checked', true);
            });
        }
        else {
            $('#' + checkListId + ' input:checkbox').each(function () {
                $(this).prop('checked', false);
            });
        }
    });

    $('#' + checkListId + ' input:checkbox').click(function () {
        if ($(this).prop("checked")) {
            $('#' + checkAllId).prop('checked', true);
        }
    });
}

// 单击修改密码按钮
$('#changePwd').click(function () {
    Deke.DeKe_dialog.show_Url3("修改密码", "/html/system/ChangePwd.html?v=60", changePwd, ['400px', '']);
});

// 修改密码回调方法  
function changePwd() {
    $('#btnSaveChangePwd').click(function () {
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var confirmPassword = $('#confirmPassword').val();
        var pa = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,15}$/;
        if (!isNullOrWhiteSpace(oldPassword)) {
            layer.msg("原密码不能为空！");
            $('#oldPassword').focus();
        }
        else if (!isNullOrWhiteSpace(newPassword)) {
            layer.msg("新密码不能为空！");
            $('#newPassword').focus();
        }
        else if (newPassword == oldPassword) {
            layer.msg("新密码不能和旧密码相同！");
            $('#newPassword').focus();
        }
        else if (!pa.test(newPassword)) {
            layer.msg("新密码输入必须是6-15位字母、数字或特殊符号组成！");
            $('#newPassword').focus();
        }
        else if (!isNullOrWhiteSpace(confirmPassword)) {
            layer.msg("确认新密码不能为空");
            $('#confirmPassword').focus();
        }
        else if (newPassword != confirmPassword) {
            layer.msg("两次输入的新密码不一致！");
            $('#confirmPassword').focus();
        }
        else {
            $.postAsyncJson('/AjaxUser/ChangePwd', { oldPassword: oldPassword, newPassword: newPassword }, function (data) {
                if (data == 1) {
                    layer.msg("密码修改成功,请重新用新密码登录！");
                    layer.close(index);
                    setTimeout(function () {
                        $.post('/AjaxUser/LogOut', null, function (data) {
                            location.href = '/login.html';
                        });
                    }, 2000);
                }
                else if (data == -3) {
                    $('#oldPassword').focus();
                    layer.msg("原密码输入错误！");
                }
                else if (data == -5) {
                    layer.msg("你没有该操作权限！");
                    layer.close(index);
                }
                else {
                    layer.msg("密码修改失败,请刷新后再重试！");
                    layer.close(index);
                }
            });
        }
    });
}
//领取试用版
$(document).on("click", "#TrialVersion", function () {
    $.get('/AjaxUser/GetTrialVersionPermissions/', function (data) {
        if (data == 1) {
            layer.msg("您已领取过了！！");
        } else {
            $.post("/AjaxUser/ReceiveTrialVersion", function (data) {
                if (data == 1) {
                    layer.msg("恭喜您，成功领取了高级试用版,退出重新登录即可享受高级版功能");
                }
                else if (data == 2) {
                    layer.msg("领取失败，刷新重新试领");
                }
                else if (data == 2) {
                    layer.msg("您已领取过了！！");
                }
            });
        }
    });
});
// 初始化密码回调方法
function systemPwd(newPassword) {
    if (!isNullOrWhiteSpace(newPassword)) {
        alert("密码不能为空！");
        $('#newPassword').focus();
        return false;
    }
    $.ajax({
        type: "GET",
        url: "/AjaxUser/CheckPwd?passWord=" + newPassword,
        dataType: "json",
        success: function (data) {
            if (data == "0") {
                alert("输入密码不正确");
            }
            else {
                layer.confirm("初始化店铺数据将无法恢复，确认初始化？", { btn: ["确认", "取消"] }, function () {

                    var str = "";
                    $(".uikslx.on").each(function () {
                        str += $(this).data("id") + ",";
                    });
                    if (str != "") {
                        $.post("/System/UpdatedataClor", { seid: str }, function (data) {
                            loggin.chklogn(data);

                            if (data == true) {
                                layer.close();
                                layer.msg("清除成功");

                            }
                            else if (data == -2 || data == -5) {
                                layer.close();
                                layer.msg("你没有该操作权限！");
                            }
                            else {
                                layer.close();
                                layer.msg("删除失败");
                            }


                        });
                    } else {
                        layer.msg("请选择要清除的对象");
                    }
                });
            }

        }

    });


}
//上传店铺LOGO图片
$(document).on('change', "#uplogoImg", function () {
    $.ajaxFileUpload({
        url: '/AjaxUser/UploadLogo/1',
        secureuri: false,
        fileElementId: 'uplogoImg',//file标签的id
        type: "post",
        dataType: 'json',//返回数据的类型
        //data: { name: 'logan' },//一同上传的数据
        success: function (data) {
            if (data.id == true) {
                $('#logoid').attr('src', 'http://decerp.cc' + data.imgurl);
                $('#showlogoImg').attr('src', 'http://decerp.cc' + data.imgurl);
            }
            else {
                layer.msg(data.name);
            }
        }
    });
});

// 上传店铺头像图片
$(document).on('change', "#upLoadImg", function () {
    $.ajaxFileUpload({
        url: '/AjaxUser/UploadLogo/2',
        secureuri: false,
        fileElementId: 'upLoadImg',//file标签的id
        type: "post",
        dataType: 'json',//返回数据的类型
        //data: { name: 'logan' },//一同上传的数据
        success: function (data) {
            if (data.id == true) {
                $('#userImg').attr('src', 'http://decerp.cc' + data.imgurl);
                $('#showImg').attr('src', 'http://decerp.cc' + data.imgurl);
            }
            else {
                layer.msg(data.name);
            }
        }
    });
});

// 提交用户反馈信息
function addUserFeedback() {
    $('#btnAddUserFeedback').click(function () {
        if (isNullOrWhiteSpace($('#userfeedback_content').val()) && $('#userfeedback_content').val().trim().length >= 8) {
            $.ajaxFileUpload({
                url: '/AjaxData/AddUserFeedback',
                secureuri: false,
                fileElementId: 'upFeedbackImg',//file标签的id
                type: "post",
                dataType: 'json',//返回数据的类型
                data: { userfeedback_content: $('#userfeedback_content').val().trim() },//一同上传的数据
                success: function (data, status) {
                    if (data.imgurl == false) {
                        $('#userfeedback_content').val('');
                        $('#upFeedbackImg').val('');
                        $('.am-p1').html('');
                        layer.msg("上传图片失败");
                    }
                    else if (data.imgurl == -3) {
                        layer.msg("您上传的图片过大，请选择小于500kb以下的图片");
                    }
                    else if (data.imgurl) {
                        $('#userfeedback_content').val('');
                        $('#upFeedbackImg').val('');
                        $('.am-p1').html('');
                        layer.msg("数据已提交，感谢您的反馈！");
                    }
                },
                error: function (data, status, e) {
                    layer.msg(e);
                }
            });
        }
        else {
            $('#userfeedback_content').focus();
            layer.msg('提交内容不能少于8个字！');
        }
    });
}

//am
var amtabsildes = function () {
    this.active = 'active';
}
amtabsildes.prototype.init = function (obj) {
    var tabheader1 = $(obj.a);
    var vs = $(obj.b);
    var This = this;
    tabheader1.each(function (index, item) {
        $(item).hover(function () {
            $(this).addClass(This.active).siblings().removeClass(This.active);
            vs.eq(index).addClass(This.active).siblings().removeClass(This.active);
        })
    })
}
var amtabsildes1 = new amtabsildes();
amtabsildes1.init({ 'a': '#tab-header1 li', 'b': '#tab-content1>div' });

// 生成时间戳，清除每次发布后的js，css缓存
var clearCache = new Date().Format("yyyyMMddhhmmss");

// 最新时间戳
//function getTimeStamp() {
//    return new Date().Format("yyyyMMddhhmmss");
//}

// 最新时间戳
function getTimeStamp() {
    var date = new Date();
    //$("#date_ss").text("系统时间：" + new Date().Format("yyyy年MM月dd日 hh:mm:ss"));
    var year = date.getFullYear();//当前年份
    var month = date.getMonth();//当前月份
    var data = date.getDate();//天
    var hours = date.getHours();//小时
    var minute = date.getMinutes();//分
    var second = date.getSeconds();//秒
    var time = year + "" + fnW((month + 1)) + "" + fnW(data) + "" + fnW(hours) + "" + fnW(minute) + "" + fnW(second);
    //return new Date().Format("yyyyMMddhhmmss");
    return time;
}

//补位 当某个字段不是两位数时补0
function fnW(str) {
    var num;
    str >= 10 ? num = str : num = "0" + str;
    return num;
}

// 通过Id启用按钮通用方法
function enabledButton(buttonId) {
    $('#' + buttonId).removeClass("disabled").removeAttr("disabled", "disabled");
}

// 通过Id禁用按钮通用方法
function disableButton(buttonId) {
    $('#' + buttonId).addClass("disabled").attr("disabled", "disabled");
}

// 通过Class启用按钮通用方法
function enabledButtonByClass(buttonClass) {
    $('.' + buttonClass).removeClass("disabled").removeAttr("disabled", "disabled");
}

// 通过Class禁用按钮通用方法
function disableButtonByClass(buttonClass) {
    $('.' + buttonClass).addClass("disabled").attr("disabled", "disabled");
}

// 通过Id启用链接按钮通用方法
function enabledLinkButtonById(buttonId) {
    $('#' + buttonId).attr('href', 'javascript:void(0);');
    //$('#' + buttonId).bind('click');
    $('#' + buttonId).removeAttr('disabed');
    //$('#' + buttonId).click();
}

// 通过Id禁用链接按钮通用方法
function disableButtonById(buttonId) {
    //$('#' + buttonId).unbind('click');
    $('#' + buttonId).removeAttr('onclick');
    $('#' + buttonId).attr('disabed', true);
    $('#' + buttonId).removeAttr('href');
}
//写cookies
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return (arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


// 写入LocalStorage
function setLocalStorage(name, value) {
    if (!window.localStorage) {
        return false;
    }
    else {
        var storage = window.localStorage;
        storage.setItem(name, value);
    }
}

// 读取LocalStorage
function getLocalStorage(name) {
    if (!window.localStorage) {
        return false;
    }
    else {
        var storage = window.localStorage;
        return storage.getItem(name);
    }
}

function removeLocalStorage(name) {
    if (!window.localStorage) {
        return false;
    }
    else {
        if (name != null && name != '' && name != undefined) {
            var storage = window.localStorage;
            storage.removeItem(name);
        }
    }
}

///产品自定义属性配置绑定
function GetProductConfig(productconfig) {

    var is_open_detai_info = false;
    $(".detailinfo").html("");
    var html = ' <div class="makstbox mat15"  id="detailinfo">';
    html += ' <h3 class="timsl">  <span>产品自定义属性设置</span>';
    html += '<i type="button" class="tikxm icon-question-sign tips" data-content="可设置商品自定义属性如：颜色(红色，蓝色...)，规格(S165/155,M170/160...)..."></i>';
    html += '</h3>';
    //产品配置查询
    $.getJSON("/ProductCustomProperties/GetProductAttributeConfiglist", function (data) {
        if (data != null && data.length >= 1) {
            is_open_detai_info = true;

            for (var i = 0; i < data.length; i++) {

                $("#Configinfotext").append(productconfig.replace("@name", data[i].sv_configname).replace("@id", data[i].sv_productconfigid).replace("@name", data[i].sv_configname));
                html += '<div class="makstbox mat15" id="configid_' + data[i].sv_productconfigid + '">';
                html += ' <h3 class="timsl"><span>' + data[i].sv_configname + '</span>';
                if (data[i].sv_is_open) {
                    html += '<span class="swtith configopen open" style="float:none" data-configid="' + data[i].sv_productconfigid + '"><i></i></span>';
                } else {
                    html += '<span class="swtith configopen" style="float:none" data-configid="' + data[i].sv_productconfigid + '"><i></i></span>';
                }
                html += '</h3>';
                html += '<div class="monfot">';
                html += '<text id="attributedetailtext' + data[i].sv_productconfigid + '">';
                if (data[i].childList != null) {
                    for (var j = 0; j < data[i].childList.length; j++) {
                        html += '<a href="javascript:void(0)" class="klisos" data-detailid="' + data[i].childList[j].sv_producdetailid + '" data-name="' + data[i].childList[j].sv_productattributename + '" data-code="' + data[i].childList[j].sv_productattributecode + '" data-configid="' + data[i].sv_productconfigid + '">';
                        html += '<span>' + data[i].childList[j].sv_productattributename + '</span>';
                        html += '<i class="poriss  icon-edit updatedetai"></i><em class="porvv icon-trash detaidelete"  ></em></a>';
                    }
                }
                html += '</text>';
                html += '<a href="javascript:void(0)" class="kkadd attributedetail" data-configid=' + data[i].sv_productconfigid + '  id="attributedetail' + data[i].sv_productconfigid + '"><i class="icon-plus"></i></a>'
                html += '</div></div>';
            }
        }
        html += ' </div>';
        if (is_open_detai_info) {
            $(".detailinfo").append(html);
        }
    });
}
//产品自定义属性设置绑定
function GetProductAttributeDetail(_configid) {
    $("#attributedetailtext" + _configid).html("");
    var html = "";
    $.getJSON("/ProductCustomProperties/GetProductAttributeDetaillist", { configid: _configid }, function (data) {
        if (data != null && data.length >= 1) {
            for (var j = 0; j < data.length; j++) {
                html += '<a href="javascript:void(0)" class="klisos" data-detailid="' + data[j].sv_producdetailid + '" data-name="' + data[j].sv_productattributename + '" data-code="' + data[j].sv_productattributecode + '" data-configid="' + data[j].sv_productconfigid + '">';
                html += '<span>' + data[j].sv_productattributename + '</span>';
                html += '<i class="poriss  icon-edit updatedetai" ></i><em class="porvv icon-trash detaidelete"  ></em></a>';
            }
        }
        $("#attributedetailtext" + _configid).html(html);
    });

}
//获取字符长度
function getstrlength(strname) {

    return strname.replace(/[^\x00-\xFF]/g, '**').length;
}

/** 
* convertImgToBase64 
* @param {String} url 
* @param {Function} callback 
* @param {String} [outputFormat='image/png'] 
* @author HaNdTriX 
* @example 
convertImgToBase64('http://goo.gl/AOxHAL', function(base64Img){ 
console.log('IMAGE:',base64Img); 
}) 
*/
function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up 
        canvas = null;
    };
    img.src = url;
}

// 保留两位小数
function round(v, e) {
    var t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
}
//引导页面
//更新公告栏
var switch0 = false;
var _g_update_flag = 4;
if (_g_update_flag > 0) {
    //1、检查当前配置的更新值
    //2、检查客户端的更新值
    var _l_update_flag = localStorage.getItem("update_demo");
    if (_g_update_flag > _l_update_flag) {
        switch0 = true;
        localStorage.setItem("update_demo", _g_update_flag);
    }
}
function btnknowFn() {
    $('<button class="btn-success btn btn_know" style="font-size: 12px;margin-left: 10px;background-color:#eaead6;color:#666666;border:none;">结束演示</button>').appendTo(".layui-layer-content");
}
function btn_newuserFn() {
    $('<button class="btn-success btn nex1" style="font-size: 12px;background:#7cd97f;color:#ffffff;border:none;">① 下一步</button>').appendTo(".layui-layer-content");
}
function nexbtn_newuserFn() {
    $('<button class="btn-success btn nex2" style="font-size: 12px;background-color:#7cd97f;color:#ffffff;border:none;">② 下一步</button>').appendTo(".layui-layer-content");
}
function nexbtn3_newuserFn() {
    $('<button class="btn-success btn nex3" style="font-size: 12px;color:#ffffff;border:none;float: right;">③ 下一步</button>').appendTo(".layui-layer-content");
}
if (switch0) {
    $(".gonggao_1").addClass("active_block");
    $(".citiebox").css("margin-top", "4%");
    var settimefadIn = setTimeout(function () {
        $(".gonggao_1").removeClass("active_block");
        $(".citiebox").css("margin-top", "7%");
    }, 13000);

} else {
    $(".gonggao_1").css("display", "none");
    $(".citiebox").css("margin-top", "7%");
}
//演示按钮事件
$(".yanshi_btn").click(function () {
    $(".box-black").css("display", "block");
    $(".demo_2").addClass("more_demo");
    layer.tips('①请点击微信营销', '.demo_2', {
        time: 500000,
        tips: 1,
    });
    btnknowFn();
    closeFn_end();
    $(".demo_2").click(function () {
        localStorage.setItem("decerp_demo_result", switch0);
    });
});
//第二步按钮设置
if (localStorage.getItem("decerp_demo_result")) {
    $(".box-black2").css("display", "block");
    $(".demo_3").addClass("more_demo");
    localStorage.clear("decerp_demo_result");
    layer.tips('②请点击微信消息绑定', '.demo_3', {
        time: 500000,
        tips: 3,
    });
    btnknowFn();
    closeFn_end();
    $(".demo_3").click(function () {
        $(".box-black2").css("display", "block");
        $(".demo_3").removeClass("more_demo");
        $(".layui-layer-content").addClass("active_none");
        localStorage.clear("update_demo");
        setTimeout(function () {
            $(".demo_4").addClass("more_demo");
            layer.tips('第三步', '.demo_4', {
                time: 500000,
                tips: 3,
            });
            btnknowFn();
            closeFn_end();
            $(".demo_4").click(function () {
                $(".box-black2").css("display", "none");
                $(".demo_4").removeClass("more_demo");
                $(".layui-layer-content").addClass("active_none");
            })
        }, 60);
    });
}
function closeFn_end() {
    $(".btn_know").click(function () {
        localStorage.clear("update_demo");
        $(".box-black2 ,.box-black").css("display", "none");
        $(".demo_3,.demo_2,.demo_4").removeClass("more_demo");
        $(".layui-layer-content").addClass("active_none");
    });
}

// 通用消息提醒
function layerMsg(icon, text) {
    layer.msg(text, {
        icon: icon, //图标
        time: 2000   //2秒关闭(如果不配置,默认是3秒)
    }, function () {
        layer.closeAll();
    });
}

//----设置
function setDemoItem(key, data) {
    localStorage.setItem("decerp_demo_result", switch0);
}
function getDemoItem(key) {
    localStorage.getItem("decerp_demo_result");
}
//获取配置信息
function PreferentialTopUpGivingConfigList(strmodule_code, config_code) {
    Preferential_TopUpGiving_ConfigList = "";
    if ((typeof moduleConfigList) != "undefined" && moduleConfigList != null && moduleConfigList.length > 0) {
        for (var i = 0; i < moduleConfigList.length; i++) {
            if (moduleConfigList[i].sv_user_module_code == strmodule_code) {
                if (moduleConfigList[i].childInfolist != null && moduleConfigList[i].childInfolist.length > 0) {
                    var childlist = moduleConfigList[i].childInfolist;
                    for (var j = 0; j < childlist.length; j++) {
                        if (childlist[j].sv_user_config_code == config_code) {
                            if (childlist[j].childDetailList != null && childlist[j].childDetailList.length > 0) {
                                is_exist_Preferential_TopUpGiving_ConfigList = true;
                                Preferential_TopUpGiving_ConfigList = childlist[j].childDetailList;
                            }
                        }
                    }

                }

            }
        }

    }
}

//获取配置启用开关信息
function GetConfigStatusInfo(strmodule_code) {
    if ((typeof moduleConfigList) != "undefined" && moduleConfigList != null && moduleConfigList.length > 0) {
        for (var i = 0; i < moduleConfigList.length; i++) {
            if (moduleConfigList[i].sv_user_module_code == strmodule_code) {
                return moduleConfigList[i].sv_detail_is_enable;
            }
        }
    }
    return false;
}


function Timedelay(member_id, product_id, userecord_id, user_id, sv_mcc_leftcount) {

    if (sv_mcc_leftcount > 0) {
        var htmldiv = '<input id="TimedelayDate" style="margin-top:40px;margin-left:30px" type="text" class="laydate-icon" value="">';
        htmldiv += '</div>';
        htmldiv += '<div class="layui-layer-btn">';
        htmldiv += '<button type="button" class="button  button-primary button-rounded button-small" data-loading-text="正在操作中.." id="saveimedelay">确定</button>'
        htmldiv += '<button type="button" class="button  button-default button-rounded button-small" id="cancel">取消</button>'
        layer.open({
            type: 1,
            title: "过期产品延期",
            area: ['220px', '180px'],
            content: htmldiv
        });
        laydate({
            elem: '#TimedelayDate',
            format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
            festival: true,
            min: laydate.now() //设定最小日期为当前日期
        });
        laydate.skin('molv');//主题皮肤
        var datea = new Date();
        datea.setMonth(datea.getMonth() + 1)
        $("#TimedelayDate").val(datea.Format("yyyy-MM-dd"));
        //关闭
        $("#cancel").click(function () {
            layer.closeAll("page");
        });

        $("#saveimedelay").click(function () {
            var modeldata = { member_id: member_id, product_id: product_id, userecord_id: userecord_id, user_id: user_id, validity_date: $("#TimedelayDate").val() }
            $.ajax({
                url: "/Ajaxdata/UpdateTimedelayDate",
                data: JSON.stringify(modeldata),
                type: "POST",
                contentType: "application/json",
                success: function (result) {
                    if (result == true) {
                        layer.closeAll("page");
                        layer.msg("延时成功！");
                        page();
                    } else if (result == -1) {
                        layer.closeAll("page");
                        layer.msg("操作失败，时间有误！");

                    }
                    else {
                        layer.closeAll("page");
                        layer.msg("操作失败，产品有误！");
                    }
                }

            });

        });
    } else {
        layer.close();
        layer.msg("当前产品已没有可用次数！");
    }
}

// 验证数字和计重小数
function textBoxNumberVerification(txtValue, pricingmethod) {
    if (txtValue != null && txtValue != '' && txtValue != undefined) {
        if (pricingmethod == 1) { // 计重验证
            return txtValue.value.replace(/^\d+(\.\d+)?$/i, '');
        }
        else { // 计件验证
            return txtValue.value.replace(/^\d+$/, '');
        }
    }
}

//-------弹出页面变量处理，通用全局变量通用方法
//-------弹出页面，获取全局变量异常
//-------gkey：全局变量名称，glev：层次，默认1，表示一级弹窗
function getGlobalValue(glev) {
    //收银界面->会员列表页
    if ((typeof moduleConfigList) == "undefined") {
        moduleConfigList = parent.moduleConfigList;
    }
    if ((typeof Is_open_commission) == "undefined") {
        Is_open_commission = parent.Is_open_commission;
    }
    if ((typeof _g_is_ic_flag) == "undefined") {
        _g_is_ic_flag = parent._g_is_ic_flag;
    }
}


//验证数量和重量data-sv_pricing_method=
function clearNoNumber_input(obj) {
    if (obj != null && obj != '' && obj != undefined && obj.value != null && obj.value != '' && obj.value != undefined) {
        if ($(obj).data("sv_pricing_method") == "0") {
            obj.value = parseFloat(obj.value || 0)
            obj.value = obj.value.replace(/[^\-\d]/g, '');  //清除“数字
        } else {
            obj.value = obj.value.replace(/[^\-\d\.]/g, "");  //清除“数字”和“.”以外的字符
            obj.value = obj.value.replace(/^\./g, "");  //验证第一个字符是数字而不是.
            obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数

        }

    }
}
//占位符通用icount占位长度
function strPlaceholder(icount) {
    var istr = "";
    if (icount > 0) {
        for (var i = 0; i < icount; i++) {
            istr += "&emsp;";
        }
    }
    return istr;
}

// 去除空格
function clearInputSpace(obj) {
    if (obj != null && obj != '' && obj != undefined && obj.value != null && obj.value != '' && obj.value != undefined) {
        obj.value = obj.value.replace(/\s/g, "");
    }
}

// 时间天数减法
function minusSelectDate(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() - days);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var val = d.getFullYear() + "/" + month + "/" + day + " 00:00:00";
    return val;
}

// 时间天数减法
function addSelectDate(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    var val = d.getFullYear() + "/" + month + "/" + day + " 00:00:00";
    return val;
}

// 加载loading，返回loading Index
function commonOpenLoading(content) {
    var loadIndex = layer.load(1, { shade: [0.1, '#000'] }); //0代表加载的风格，支持0-2
    return loadIndex;
}

// 关闭loading
function commonCloseLoading(index) {
    layer.close(index);
}