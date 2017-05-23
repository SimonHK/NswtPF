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
					
					<form action="paymenttype/${msg }.do" name="Form" id="Form" method="post">
						<input type="hidden" name="PAYMENTTYPE_ID" id="PAYMENTTYPE_ID" value="${pd.PAYMENTTYPE_ID}"/>
						<div id="zhongxin" style="padding-top: 13px;">
						<table id="table_report" class="table table-striped table-bordered table-hover">
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">支付ID:</td>
								<td><input type="number" name="PAYMENT" id="PAYMENT" value="${pd.PAYMENT}" maxlength="32" placeholder="这里输入支付ID" title="支付ID" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">支付名称:</td>
								<td><input type="text" name="PAYMENTNAME" id="PAYMENTNAME" value="${pd.PAYMENTNAME}" maxlength="255" placeholder="这里输入支付名称" title="支付名称" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">交易类型:</td>
								<td><input type="text" name="TRANSACTIONTYPE" id="TRANSACTIONTYPE" value="${pd.TRANSACTIONTYPE}" maxlength="64" placeholder="这里输入交易类型" title="交易类型" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">所属国家:</td>
								<td><input type="text" name="COUNTRY" id="COUNTRY" value="${pd.COUNTRY}" maxlength="255" placeholder="这里输入所属国家" title="所属国家" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">开通时间:</td>
								<td><input class="span10 date-picker" name="STARTTIME" id="STARTTIME" value="${pd.STARTTIME}" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" placeholder="开通时间" title="开通时间" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">结束时间:</td>
								<td><input class="span10 date-picker" name="ENDTIME" id="ENDTIME" value="${pd.ENDTIME}" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" placeholder="结束时间" title="结束时间" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">状态:</td>
								<td><input type="text" name="STATE" id="STATE" value="${pd.STATE}" maxlength="16" placeholder="这里输入状态" title="状态" style="width:98%;"/></td>
							</tr>
							<tr>
								<td style="width:75px;text-align: right;padding-top: 13px;">介绍说明:</td>
								<td><input type="text" name="INTRODUCE" id="INTRODUCE" value="${pd.INTRODUCE}" maxlength="2000" placeholder="这里输入介绍说明" title="介绍说明" style="width:98%;"/></td>
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
			if($("#PAYMENT").val()==""){
				$("#PAYMENT").tips({
					side:3,
		            msg:'请输入支付ID',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#PAYMENT").focus();
			return false;
			}
			if($("#PAYMENTNAME").val()==""){
				$("#PAYMENTNAME").tips({
					side:3,
		            msg:'请输入支付名称',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#PAYMENTNAME").focus();
			return false;
			}
			if($("#TRANSACTIONTYPE").val()==""){
				$("#TRANSACTIONTYPE").tips({
					side:3,
		            msg:'请输入交易类型',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#TRANSACTIONTYPE").focus();
			return false;
			}
			if($("#COUNTRY").val()==""){
				$("#COUNTRY").tips({
					side:3,
		            msg:'请输入所属国家',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#COUNTRY").focus();
			return false;
			}
			if($("#STARTTIME").val()==""){
				$("#STARTTIME").tips({
					side:3,
		            msg:'请输入开通时间',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#STARTTIME").focus();
			return false;
			}
			if($("#ENDTIME").val()==""){
				$("#ENDTIME").tips({
					side:3,
		            msg:'请输入结束时间',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#ENDTIME").focus();
			return false;
			}
			if($("#STATE").val()==""){
				$("#STATE").tips({
					side:3,
		            msg:'请输入状态',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#STATE").focus();
			return false;
			}
			if($("#INTRODUCE").val()==""){
				$("#INTRODUCE").tips({
					side:3,
		            msg:'请输入介绍说明',
		            bg:'#AE81FF',
		            time:2
		        });
				$("#INTRODUCE").focus();
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