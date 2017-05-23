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
					
					<form action="transaction/${msg }.do" name="Form" id="Form" method="post">
						<input type="hidden" name="TRANSACTION_ID" id="TRANSACTION_ID" value="${pd.TRANSACTION_ID}"/>
						<div id="zhongxin" style="padding-top: 13px;">
						<table id="table_report" class="table table-striped table-bordered table-hover">
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">ID:</td>
								<td><input type="number" name="ID" id="ID" value="${pd.ID}" maxlength="32" placeholder="这里输入ID" title="ID" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">物品名称:</td>
								<td><input type="text" name="ITEMNAME" id="ITEMNAME" value="${pd.ITEMNAME}" maxlength="255" placeholder="这里输入物品名称" title="物品名称" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">销售数量:</td>
								<td><input type="number" name="SALESVOLUMES" id="SALESVOLUMES" value="${pd.SALESVOLUMES}" maxlength="32" placeholder="这里输入销售数量" title="销售数量" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">销售时间:</td>
								<td><input class="span10 date-picker" name="TIME" id="TIME" value="${pd.TIME}" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" placeholder="销售时间" title="销售时间" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">付款状态:</td>
								<td><input type="text" name="PAYMENTSTATUS" id="PAYMENTSTATUS" value="${pd.PAYMENTSTATUS}" maxlength="16" placeholder="这里输入付款状态" title="付款状态" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">发货状态:</td>
								<td><input type="text" name="SHIPSTATUS" id="SHIPSTATUS" value="${pd.SHIPSTATUS}" maxlength="16" placeholder="这里输入发货状态" title="发货状态" style="width:98%;"/></td>
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
			if($("#ID").val()==""){
				$("#ID").tips({
					side:3,
		            msg:'请输入ID',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#ID").focus();
			return false;
			}
			if($("#ITEMNAME").val()==""){
				$("#ITEMNAME").tips({
					side:3,
		            msg:'请输入物品名称',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#ITEMNAME").focus();
			return false;
			}
			if($("#SALESVOLUMES").val()==""){
				$("#SALESVOLUMES").tips({
					side:3,
		            msg:'请输入销售数量',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#SALESVOLUMES").focus();
			return false;
			}
			if($("#TIME").val()==""){
				$("#TIME").tips({
					side:3,
		            msg:'请输入销售时间',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TIME").focus();
			return false;
			}
			if($("#PAYMENTSTATUS").val()==""){
				$("#PAYMENTSTATUS").tips({
					side:3,
		            msg:'请输入付款状态',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#PAYMENTSTATUS").focus();
			return false;
			}
			if($("#SHIPSTATUS").val()==""){
				$("#SHIPSTATUS").tips({
					side:3,
		            msg:'请输入发货状态',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#SHIPSTATUS").focus();
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