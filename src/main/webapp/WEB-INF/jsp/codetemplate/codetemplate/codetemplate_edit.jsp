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
	<!-- 下拉框 -->
	<link rel="stylesheet" href="static/ace/css/chosen.css" />
	<!-- jsp文件头和头部 -->
	<%@ include file="../../system/index/top.jsp"%>
	<!-- 日期框 -->
	<link rel="stylesheet" href="static/ace/css/datepicker.css" />
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
					
					<form action="codetemplate/${msg }.do" name="Form" id="Form" method="post">
						<input type="hidden" name="CODETEMPLATE_ID" id="CODETEMPLATE_ID" value="${pd.CODETEMPLATE_ID}"/>
						<div id="zhongxin" style="padding-top: 13px;">
						<table id="table_report" class="table table-striped table-bordered table-hover">
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">模版ID:</td>
								<td><input type="number" name="TEMPLATE_ID" id="TEMPLATE_ID" value="${pd.TEMPLATE_ID}" maxlength="32" placeholder="这里输入模版ID" title="模版ID" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">模版名称:</td>
								<td><input type="text" name="TEMPLATE_NAME" id="TEMPLATE_NAME" value="${pd.TEMPLATE_NAME}" maxlength="255" placeholder="这里输入模版名称" title="模版名称" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">模版类型:</td>
								<td><input type="text" name="TEMPLATE_TYPE" id="TEMPLATE_TYPE" value="${pd.TEMPLATE_TYPE}" maxlength="255" placeholder="这里输入模版类型" title="模版类型" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">模版语言:</td>
								<td><input type="text" name="TEMPLATE_LANGUAGE" id="TEMPLATE_LANGUAGE" value="${pd.TEMPLATE_LANGUAGE}" maxlength="255" placeholder="这里输入模版语言" title="模版语言" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">模版代码:</td>
								<td><input type="text" name="TEMPLATE_CODE" id="TEMPLATE_CODE" value="${pd.TEMPLATE_CODE}" maxlength="4000" placeholder="这里输入模版代码" title="模版代码" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="text-align: center;" colspan="10">
									<a class="btn btn-mini btn-primary" onclick="save();">保存</a>
									<a class="btn btn-mini btn-danger" onclick="top.Dialog.close();">取消</a>
								</td>
							</tr>
						</table>
						</div>
						<div id="zhongxin2" class="center" style="display:none"><br/><br/><br/><br/><br/><img src="static/images/jiazai.gif" /><br/><h4 class="lighter block green">提交中...</h4></div>
					</form>
					</div>
					<!-- /.col -->
				</div>
				<!-- /.row -->
			</div>
			<!-- /.page-content -->
		</div>
	</div>
	<!-- /.main-content -->
</div>
<!-- /.main-container -->


	<!-- 页面底部js¨ -->
	<%@ include file="../../system/index/foot.jsp"%>
	<!-- 下拉框 -->
	<script src="static/ace/js/chosen.jquery.js"></script>
	<!-- 日期框 -->
	<script src="static/ace/js/date-time/bootstrap-datepicker.js"></script>
	<!--提示框-->
	<script type="text/javascript" src="static/js/jquery.tips.js"></script>
		<script type="text/javascript">
		$(top.hangge());
		//保存
		function save(){
			if($("#TEMPLATE_ID").val()==""){
				$("#TEMPLATE_ID").tips({
					side:3,
		            msg:'请输入模版ID',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TEMPLATE_ID").focus();
			return false;
			}
			if($("#TEMPLATE_NAME").val()==""){
				$("#TEMPLATE_NAME").tips({
					side:3,
		            msg:'请输入模版名称',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TEMPLATE_NAME").focus();
			return false;
			}
			if($("#TEMPLATE_TYPE").val()==""){
				$("#TEMPLATE_TYPE").tips({
					side:3,
		            msg:'请输入模版类型',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TEMPLATE_TYPE").focus();
			return false;
			}
			if($("#TEMPLATE_LANGUAGE").val()==""){
				$("#TEMPLATE_LANGUAGE").tips({
					side:3,
		            msg:'请输入模版语言',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TEMPLATE_LANGUAGE").focus();
			return false;
			}
			if($("#TEMPLATE_CODE").val()==""){
				$("#TEMPLATE_CODE").tips({
					side:3,
		            msg:'请输入模版代码',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TEMPLATE_CODE").focus();
			return false;
			}
			$("#Form").submit();
			$("#zhongxin").hide();
			$("#zhongxin2").show();
		}
		
		$(function() {
			//日期框
			$('.date-picker').datepicker({autoclose: true,todayHighlight: true});
		});
		</script>
</body>
</html>