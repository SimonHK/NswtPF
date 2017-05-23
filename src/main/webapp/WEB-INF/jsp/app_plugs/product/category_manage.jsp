<%--
  Created by IntelliJ IDEA.
  User: hongkai
  Date: 2017/5/15
  Time: 下午3:47
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<%=basePath%>">
    <link href="htgl_1/assets/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="htgl_1/css/style.css"/>
    <link rel="stylesheet" href="htgl_1/assets/css/ace.min.css" />
    <link rel="stylesheet" href="htgl_1/assets/css/font-awesome.min.css" />
    <link href="htgl_1/Widget/icheck/icheck.css" rel="stylesheet" type="text/css" />
    <!--[if IE 7]>
    <link rel="stylesheet" href="htgl_1/assets/css/font-awesome-ie7.min.css" />
    <![endif]-->
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="htgl_1/assets/css/ace-ie.min.css" />
    <![endif]-->
    <script src="htgl_1/assets/js/jquery.min.js"></script>
    <!-- <![endif]-->
    <!--[if IE]>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <![endif]-->
    <!--[if !IE]> -->
    <script type="text/javascript">
        window.jQuery || document.write("<script src='htgl_1/assets/js/jquery-2.0.3.min.js'>"+"<"+"/script>");
    </script>
    <!-- <![endif]-->
    <!--[if IE]>
    <script type="text/javascript">
        window.jQuery || document.write("<script src='htgl_1/assets/js/jquery-1.10.2.min.js'>"+"<"+"/script>");
    </script>
    <![endif]-->
    <script src="htgl_1/assets/js/ace-elements.min.js"></script>
    <script src="htgl_1/assets/js/ace.min.js"></script>
    <script src="htgl_1/assets/js/bootstrap.min.js"></script>
    <script src="htgl_1/assets/js/typeahead-bs2.min.js"></script>
    <script type="text/javascript" src="htgl_1/Widget/zTree/js/jquery.ztree.all-3.5.min.js"></script>
    <script src="htgl_1/js/lrtk.js" type="text/javascript" ></script>
    <title>分类管理</title>
</head>

<body>
<div class=" clearfix">
    <div id="category">
        <div id="scrollsidebar" class="left_Treeview">
            <div class="show_btn" id="rightArrow"><span></span></div>
            <div class="widget-box side_content" >
                <div class="side_title"><a title="隐藏" class="close_btn"><span></span></a></div>
                <div class="side_list">
                    <div class="widget-header header-color-green2">
                        <h4 class="lighter smaller">产品类型列表</h4>
                    </div>
                    <div class="widget-body">
                        <div class="widget-main padding-8">
                            <div  id="treeDemo" class="ztree"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--产品类型管理-->
    <div class="type_style">
        <div class="type_title">产品类型信息</div>
        <div class="type_content">
            <div class="Operate_btn">
                <a href="javascript:ovid()" class="btn  btn-warning"><i class="icon-edit align-top bigger-125"></i>新增子类型</a>
                <a href="javascript:ovid()" class="btn  btn-success"><i class="icon-ok align-top bigger-125"></i>禁用该类型</a>
                <a href="javascript:ovid()" class="btn  btn-danger"><i class="icon-trash   align-top bigger-125"></i>删除该类型</a>
            </div>
            <form action="" method="post" class="form form-horizontal" id="form-user-add">
                <div class="Operate_cont clearfix">
                    <label class="form-label"><span class="c-red">*</span>分类名称：</label>
                    <div class="formControls ">
                        <input type="text" class="input-text" value="" placeholder="" id="user-name" name="product-category-name">
                    </div>
                </div>
                <div class="Operate_cont clearfix">
                    <label class="form-label"><span class="c-red">*</span>排序：</label>
                    <div class="formControls ">
                        <input type="text" class="input-text" value="" placeholder="" id="user-query" name="product-category-name">
                    </div>
                </div>
                <div class="Operate_cont clearfix">
                    <label class="form-label">备注：</label>
                    <div class="formControls">
                        <textarea name="" rows="" class="textarea"  placeholder="说点什么...最少输入10个字符" datatype="*10-100" dragonfly="true" nullmsg="备注不能为空！" onKeyUp="textarealength(this,100)"></textarea>
                        <p class="textarea-numberbar"><em class="textarea-length">0</em>/100</p>
                    </div>
                </div>
                <div class="">
                    <div class="" style=" text-align:center">
                        <input class="btn btn-primary radius" type="submit" value="提交">
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
<script type="text/javascript">
    $(function() {
        $("#category").fix({
            float : 'left',
            //minStatue : true,
            skin : 'green',
            durationTime :false
        });
    });
</script>
<script type="text/javascript">
    $(top.hangge());//关闭加载状态
    //初始化宽度、高度
    $(".widget-box").height($(window).height());
    $(".page_right_style").width($(window).width()-220);
    //当文档窗口发生改变时 触发
    $(window).resize(function(){
        $(".widget-box").height($(window).height());
        $(".page_right_style").width($(window).width()-220);
    })

    /**************/
    var setting = {
        view: {
            dblClickExpand: false,
            showLine: false,
            selectedMulti: false
        },
        data: {
            simpleData: {
                enable:true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: ""
            }
        },
        callback: {
            beforeClick: function(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("tree");
                if (treeNode.isParent) {
                    zTree.expandNode(treeNode);
                    return false;
                } else {
                    demoIframe.attr("src",treeNode.file + ".html");
                    return true;
                }
            }
        }
    };

    var zNodes =[
        { id:1, pId:0, name:"商城分类列表", open:true},
        { id:11, pId:1, name:"蔬菜水果"},
        { id:111, pId:11, name:"蔬菜"},
        { id:112, pId:11, name:"苹果"},
        { id:113, pId:11, name:"大蒜"},
        { id:114, pId:11, name:"白菜"},
        { id:115, pId:11, name:"青菜"},
        { id:12, pId:1, name:"手机数码"},
        { id:121, pId:12, name:"手机 "},
        { id:122, pId:12, name:"照相机 "},
        { id:13, pId:1, name:"电脑配件"},
        { id:131, pId:13, name:"手机 "},
        { id:122, pId:13, name:"照相机 "},
        { id:14, pId:1, name:"服装鞋帽"},
        { id:141, pId:14, name:"手机 "},
        { id:42, pId:14, name:"照相机 "},
    ];

    var code;

    function showCode(str) {
        if (!code) code = $("#code");
        code.empty();
        code.append("<li>"+str+"</li>");
    }

    $(document).ready(function(){
        var t = $("#treeDemo");
        t = $.fn.zTree.init(t, setting, zNodes);
        demoIframe = $("#testIframe");
        demoIframe.bind("load", loadReady);
        var zTree = $.fn.zTree.getZTreeObj("tree");
        zTree.selectNode(zTree.getNodeByParam("id",'11'));
    });
</script>
<script type="text/javascript" src="htgl_1/Widget/icheck/jquery.icheck.min.js"></script>
<script type="text/javascript" src="htgl_1/Widget/Validform/5.3.2/Validform.min.js"></script>
<script type="text/javascript" src="htgl_1/assets/layer/layer.js"></script>
<script type="text/javascript" src="htgl_1/js/H-ui.js"></script>
<script type="text/javascript" src="htgl_1/js/H-ui.admin.js"></script>
<script type="text/javascript">
    $(function(){
        $('.skin-minimal input').iCheck({
            checkboxClass: 'icheckbox-blue',
            radioClass: 'iradio-blue',
            increaseArea: '20%'
        });

        $("#form-user-add").Validform({
            tiptype:2,
            callback:function(form){
                form[0].submit();
                var index = parent.layer.getFrameIndex(window.name);
                parent.$('.btn-refresh').click();
                parent.layer.close(index);
            }
        });
    });
</script>