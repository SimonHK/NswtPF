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
					
					<form action="integral/${msg }.do" name="Form" id="Form" method="post">
						<input type="hidden" name="INTEGRAL_ID" id="INTEGRAL_ID" value="${pd.INTEGRAL_ID}"/>
						<div id="zhongxin" style="padding-top: 13px;">
						<table id="table_report" class="table table-striped table-bordered table-hover">
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">卡号:</td>
								<td><input type="number" name="CARDNUMBER" id="CARDNUMBER" value="${pd.CARDNUMBER}" maxlength="32" placeholder="这里输入卡号" title="卡号" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">变动类型:</td>
								<td><input type="text" name="CHANGETYPE" id="CHANGETYPE" value="${pd.CHANGETYPE}" maxlength="32" placeholder="这里输入变动类型" title="变动类型" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">变动数额:</td>
								<td><input type="number" name="VARIABLEAMOUNT" id="VARIABLEAMOUNT" value="${pd.VARIABLEAMOUNT}" maxlength="32" placeholder="这里输入变动数额" title="变动数额" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">消费店铺:</td>
								<td><input type="text" name="CONSUMERSHOP" id="CONSUMERSHOP" value="${pd.CONSUMERSHOP}" maxlength="255" placeholder="这里输入消费店铺" title="消费店铺" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">原始店铺:</td>
								<td><input type="text" name="ORIGINALSHOP" id="ORIGINALSHOP" value="${pd.ORIGINALSHOP}" maxlength="255" placeholder="这里输入原始店铺" title="原始店铺" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">操作员:</td>
								<td><input type="text" name="OPERATOR" id="OPERATOR" value="${pd.OPERATOR}" maxlength="255" placeholder="这里输入操作员" title="操作员" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">变动时间:</td>
								<td><input class="span10 date-picker" name="CHANGETIME" id="CHANGETIME" value="${pd.CHANGETIME}" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" placeholder="变动时间" title="变动时间" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">备注:</td>
								<td><input type="text" name="REMARKS" id="REMARKS" value="${pd.REMARKS}" maxlength="255" placeholder="这里输入备注" title="备注" style="width:98%;"/></td>
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
			if($("#CARDNUMBER").val()==""){
				$("#CARDNUMBER").tips({
					side:3,
		            msg:'请输入卡号',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#CARDNUMBER").focus();
			return false;
			}
			if($("#CHANGETYPE").val()==""){
				$("#CHANGETYPE").tips({
					side:3,
		            msg:'请输入变动类型',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#CHANGETYPE").focus();
			return false;
			}
			if($("#VARIABLEAMOUNT").val()==""){
				$("#VARIABLEAMOUNT").tips({
					side:3,
		            msg:'请输入变动数额',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#VARIABLEAMOUNT").focus();
			return false;
			}
			if($("#CONSUMERSHOP").val()==""){
				$("#CONSUMERSHOP").tips({
					side:3,
		            msg:'请输入消费店铺',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#CONSUMERSHOP").focus();
			return false;
			}
			if($("#ORIGINALSHOP").val()==""){
				$("#ORIGINALSHOP").tips({
					side:3,
		            msg:'请输入原始店铺',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#ORIGINALSHOP").focus();
			return false;
			}
			if($("#OPERATOR").val()==""){
				$("#OPERATOR").tips({
					side:3,
		            msg:'请输入操作员',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#OPERATOR").focus();
			return false;
			}
			if($("#CHANGETIME").val()==""){
				$("#CHANGETIME").tips({
					side:3,
		            msg:'请输入变动时间',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#CHANGETIME").focus();
			return false;
			}
			if($("#REMARKS").val()==""){
				$("#REMARKS").tips({
					side:3,
		            msg:'请输入备注',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#REMARKS").focus();
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