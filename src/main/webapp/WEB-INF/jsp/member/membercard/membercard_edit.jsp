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
					
					<form action="membercard/${msg }.do" name="Form" id="Form" method="post">
						<input type="hidden" name="MEMBERCARD_ID" id="MEMBERCARD_ID" value="${pd.MEMBERCARD_ID}"/>
						<div id="zhongxin" style="padding-top: 13px;">
						<table id="table_report" class="table table-striped table-bordered table-hover">
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">卡号:</td>
								<td><input type="number" name="CARDNUMBER" id="CARDNUMBER" value="${pd.CARDNUMBER}" maxlength="32" placeholder="这里输入卡号" title="卡号" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">操作类型:</td>
								<td><input type="text" name="OPTIONTYPE" id="OPTIONTYPE" value="${pd.OPTIONTYPE}" maxlength="64" placeholder="这里输入操作类型" title="操作类型" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">支付类型:</td>
								<td><input type="text" name="PAYMENTTYPE" id="PAYMENTTYPE" value="${pd.PAYMENTTYPE}" maxlength="64" placeholder="这里输入支付类型" title="支付类型" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">变动前金额:</td>
								<td><input type="number" name="AMOUNTBEFORE" id="AMOUNTBEFORE" value="${pd.AMOUNTBEFORE}" maxlength="32" placeholder="这里输入变动前金额" title="变动前金额" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">充值金额:</td>
								<td><input type="number" name="RECHARGEAMOUNT" id="RECHARGEAMOUNT" value="${pd.RECHARGEAMOUNT}" maxlength="32" placeholder="这里输入充值金额" title="充值金额" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">赠送金额:</td>
								<td><input type="number" name="DONATIONAMOUNT" id="DONATIONAMOUNT" value="${pd.DONATIONAMOUNT}" maxlength="32" placeholder="这里输入赠送金额" title="赠送金额" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">变动后金额:</td>
								<td><input type="number" name="VARIABLEAMOUNT" id="VARIABLEAMOUNT" value="${pd.VARIABLEAMOUNT}" maxlength="32" placeholder="这里输入变动后金额" title="变动后金额" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">充值时间:</td>
								<td><input class="span10 date-picker" name="RECHARGETIME" id="RECHARGETIME" value="${pd.RECHARGETIME}" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" placeholder="充值时间" title="充值时间" style="width:98%;"/></td>
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
			if($("#OPTIONTYPE").val()==""){
				$("#OPTIONTYPE").tips({
					side:3,
		            msg:'请输入操作类型',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#OPTIONTYPE").focus();
			return false;
			}
			if($("#PAYMENTTYPE").val()==""){
				$("#PAYMENTTYPE").tips({
					side:3,
		            msg:'请输入支付类型',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#PAYMENTTYPE").focus();
			return false;
			}
			if($("#AMOUNTBEFORE").val()==""){
				$("#AMOUNTBEFORE").tips({
					side:3,
		            msg:'请输入变动前金额',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#AMOUNTBEFORE").focus();
			return false;
			}
			if($("#RECHARGEAMOUNT").val()==""){
				$("#RECHARGEAMOUNT").tips({
					side:3,
		            msg:'请输入充值金额',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#RECHARGEAMOUNT").focus();
			return false;
			}
			if($("#DONATIONAMOUNT").val()==""){
				$("#DONATIONAMOUNT").tips({
					side:3,
		            msg:'请输入赠送金额',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#DONATIONAMOUNT").focus();
			return false;
			}
			if($("#VARIABLEAMOUNT").val()==""){
				$("#VARIABLEAMOUNT").tips({
					side:3,
		            msg:'请输入变动后金额',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#VARIABLEAMOUNT").focus();
			return false;
			}
			if($("#RECHARGETIME").val()==""){
				$("#RECHARGETIME").tips({
					side:3,
		            msg:'请输入充值时间',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#RECHARGETIME").focus();
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