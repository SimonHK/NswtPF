<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <base href="<%=basePath%>">
    <!-- jsp文件头和头部 -->
    <%@ include file="../index/top.jsp"%>
</head>
<body class="no-skin">
<!-- /section:basics/navbar.layout -->
<div class="main-container" id="main-container">
    <!-- /section:basics/sidebar -->
    <div class="main-content">
        <div class="main-content-inner">
            <div class="page-content">
                <div class="row">
                    <div class="col-xs-12">
                        <div class="span12">
                            <div class="widget-box">
                                <div class="widget-header widget-header-blue widget-header-flat wi1dget-header-large">
                                    <h4 class="lighter">OSP数据开放平台接口测试</h4>
                                </div>
                                <div class="widget-body">
                                    <div class="widget-main">
                                        <div class="step-content row-fluid position-relative">
                                            <input name="form-field-radio1" id="form-field-radio1" onclick="setType('POST');" type="radio" value="icon-edit" checked="checked" class="ace"><span class="lbl">POST</span>&nbsp;&nbsp;
                                            <input name="form-field-radio1" id="form-field-radio2" onclick="setType('GET');" type="radio" value="icon-edit" class="ace"><span class="lbl">GET</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">appKey:</span><input type="text" id="appKey" title="appKey" value="00001" style="width:540px;">
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">secret:</span><input type="text" id="secret" title="secret" value="abcdeabcdeabcdeabcdeabcde" style="width:540px;">
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">userName:</span><input id="userName" type="text" value="tomson"/>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">password:</span><input id="password" type="text" value="123456"/>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">1.接口方法名</span><input id="methodName" type="text" value="service.list"/> 接口参数:<input id="travelPage" type="text" value="test001"/>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">2.方法版本</span><input id="methodVersin" type="text" value="1.0"/>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <span class="lbl">3.数据格式</span><input id="getDataType" type="text" value="json"/>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <div style="float: left;">
												<span class="input-icon">
													routerUrl:<input type="text" id="routerUrl" title="输入请求地址" value="http://localhost:8080/osp-1.0.0-SNAPSHOT/router" style="width:540px;">
												</span>
                                            </div>
                                            <div>
                                                &nbsp;&nbsp;<a class="btn btn-sm btn-success" onclick="methodgetJson();">获取JSON数据</a>
                                                &nbsp;&nbsp;<a class="btn btn-sm btn-info" onclick="gReload();">重置</a>
                                            </div>
                                        </div>
                                        <div class="step-content row-fluid position-relative" style="padding-top: 10px;">
                                            <textarea id="json-field" title="返回结果" class="autosize-transition span12" style="width:690px;"></textarea>
                                        </div>
                                        服务器当前服务列表：<div id="methodResult" style="background-color: #EFEFEF"></div>
                                        <input type="hidden" name="S_TYPE" id="S_TYPE" value="POST"/>
                                    </div><!--/widget-main-->
                                </div><!--/widget-body-->
                            </div>
                        </div>
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.page-content -->
        </div>
    </div>
    <!-- /.main-content -->
    <!-- 返回顶部 -->
    <a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
        <i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
    </a>
</div>
<!-- /.main-container -->
<!-- basic scripts -->
<!-- 页面底部js¨ -->
<%@ include file="../index/foot.jsp"%>
<!-- ace scripts -->
<script src="static/ace/js/ace/ace.js"></script>
<!--MD5-->
<script type="text/javascript" src="static/js/jQuery.md5.js"></script>
<!--提示框-->
<script type="text/javascript" src="static/js/jquery.tips.js"></script>
<!--引入属于此页面的js -->
<script type="text/javascript" src="static/osp/jquery.encoding.js"></script>
<script type="text/javascript" src="static/js/myjs/interfaceTest.js"></script>
<script type="text/javascript">
    $(top.hangge());
    $(document).ready(function() { initService();})
</script>
</body>
</html>