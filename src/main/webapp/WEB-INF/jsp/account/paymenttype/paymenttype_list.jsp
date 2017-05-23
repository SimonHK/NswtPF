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
<!-- 下拉框 -->
<link rel="stylesheet" href="static/ace/css/chosen.css" />
<!-- jsp文件头和头部 -->
<%@ include file="../../system/index/top.jsp"%>
<!-- 日期框 -->
<link rel="stylesheet" href="static/ace/css/datepicker.css" />
	<link href="plugins/htgl_1/assets/css/bootstrap.min.css" rel="stylesheet" />
	<link rel="stylesheet" href="plugins/htgl_1/css/style.css"/>
	<link href="plugins/htgl_1/assets/css/codemirror.css" rel="stylesheet">
	<link rel="stylesheet" href="plugins/htgl_1/assets/css/ace.min.css" />
	<link rel="stylesheet" href="plugins/htgl_1/font/css/font-awesome.min.css" />
	<!--[if lte IE 8]>
	<link rel="stylesheet" href="plugins/htgl_1/assets/css/ace-ie.min.css" />
	<![endif]-->
	<script src="plugins/htgl_1/js/jquery-1.9.1.min.js"></script>
	<script src="plugins/htgl_1/assets/js/bootstrap.min.js"></script>
	<script src="plugins/htgl_1/assets/layer/layer.js" type="text/javascript" ></script>
	<script src="plugins/htgl_1/assets/js/ace-extra.min.js"></script>
	<script src="plugins/htgl_1/assets/js/typeahead-bs2.min.js"></script>
	<script src="plugins/htgl_1/assets/dist/echarts.js"></script>
	<script type="text/javascript" src="plugins/htgl_1/js/H-ui.js"></script>
</head>
<body class="no-skin">

<%--	<!-- /section:basics/navbar.layout -->
	<div class="main-container" id="main-container">
		<!-- /section:basics/sidebar -->
		<div class="main-content">
			<div class="main-content-inner">
				<div class="page-content">
					<div class="row">
						<div class="col-xs-12">
							
						<!-- 检索  -->
						<form action="paymenttype/list.do" method="post" name="Form" id="Form">
						<table style="margin-top:5px;">
							<tr>
								<td>
									<div class="nav-search">
										<span class="input-icon">
											<input type="text" placeholder="这里输入关键词" class="nav-search-input" id="nav-search-input" autocomplete="off" name="keywords" value="${pd.keywords }" placeholder="这里输入关键词"/>
											<i class="ace-icon fa fa-search nav-search-icon"></i>
										</span>
									</div>
								</td>
								<td style="padding-left:2px;"><input class="span10 date-picker" name="lastStart" id="lastStart"  value="" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" style="width:88px;" placeholder="开始日期" title="开始日期"/></td>
								<td style="padding-left:2px;"><input class="span10 date-picker" name="lastEnd" name="lastEnd"  value="" type="text" data-date-format="yyyy-mm-dd" readonly="readonly" style="width:88px;" placeholder="结束日期" title="结束日期"/></td>
								<td style="vertical-align:top;padding-left:2px;">
								 	<select class="chosen-select form-control" name="name" id="id" data-placeholder="请选择" style="vertical-align:top;width: 120px;">
									<option value=""></option>
									<option value="">全部</option>
									<option value="">1</option>
									<option value="">2</option>
								  	</select>
								</td>
								<c:if test="${QX.cha == 1 }">
								<td style="vertical-align:top;padding-left:2px"><a class="btn btn-light btn-xs" onclick="tosearch();"  title="检索"><i id="nav-search-icon" class="ace-icon fa fa-search bigger-110 nav-search-icon blue"></i></a></td>
								</c:if>
								<c:if test="${QX.toExcel == 1 }"><td style="vertical-align:top;padding-left:2px;"><a class="btn btn-light btn-xs" onclick="toExcel();" title="导出到EXCEL"><i id="nav-search-icon" class="ace-icon fa fa-download bigger-110 nav-search-icon blue"></i></a></td></c:if>
							</tr>
						</table>
						<!-- 检索  -->
					
						<table id="simple-table" class="table table-striped table-bordered table-hover" style="margin-top:5px;">	
							<thead>
								<tr>
									<th class="center" style="width:35px;">
									<label class="pos-rel"><input type="checkbox" class="ace" id="zcheckbox" /><span class="lbl"></span></label>
									</th>
									<th class="center" style="width:50px;">序号</th>
									<th class="center">支付ID</th>
									<th class="center">支付名称</th>
									<th class="center">交易类型</th>
									<th class="center">所属国家</th>
									<th class="center">开通时间</th>
									<th class="center">结束时间</th>
									<th class="center">状态</th>
									<th class="center">介绍说明</th>
									<th class="center">操作</th>
								</tr>
							</thead>
													
							<tbody>
							<!-- 开始循环 -->	
							<c:choose>
								<c:when test="${not empty varList}">
									<c:if test="${QX.cha == 1 }">
									<c:forEach items="${varList}" var="var" varStatus="vs">
										<tr>
											<td class='center'>
												<label class="pos-rel"><input type='checkbox' name='ids' value="${var.PAYMENTTYPE_ID}" class="ace" /><span class="lbl"></span></label>
											</td>
											<td class='center' style="width: 30px;">${vs.index+1}</td>
											<td class='center'>${var.PAYMENT}</td>
											<td class='center'>${var.PAYMENTNAME}</td>
											<td class='center'>${var.TRANSACTIONTYPE}</td>
											<td class='center'>${var.COUNTRY}</td>
											<td class='center'>${var.STARTTIME}</td>
											<td class='center'>${var.ENDTIME}</td>
											<td class='center'>${var.STATE}</td>
											<td class='center'>${var.INTRODUCE}</td>
											<td class="center">
												<c:if test="${QX.edit != 1 && QX.del != 1 }">
												<span class="label label-large label-grey arrowed-in-right arrowed-in"><i class="ace-icon fa fa-lock" title="无权限"></i></span>
												</c:if>
												<div class="hidden-sm hidden-xs btn-group">
													<c:if test="${QX.edit == 1 }">
													<a class="btn btn-xs btn-success" title="编辑" onclick="edit('${var.PAYMENTTYPE_ID}');">
														<i class="ace-icon fa fa-pencil-square-o bigger-120" title="编辑"></i>
													</a>
													</c:if>
													<c:if test="${QX.del == 1 }">
													<a class="btn btn-xs btn-danger" onclick="del('${var.PAYMENTTYPE_ID}');">
														<i class="ace-icon fa fa-trash-o bigger-120" title="删除"></i>
													</a>
													</c:if>
												</div>
												<div class="hidden-md hidden-lg">
													<div class="inline pos-rel">
														<button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown" data-position="auto">
															<i class="ace-icon fa fa-cog icon-only bigger-110"></i>
														</button>
			
														<ul class="dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close">
															<c:if test="${QX.edit == 1 }">
															<li>
																<a style="cursor:pointer;" onclick="edit('${var.PAYMENTTYPE_ID}');" class="tooltip-success" data-rel="tooltip" title="修改">
																	<span class="green">
																		<i class="ace-icon fa fa-pencil-square-o bigger-120"></i>
																	</span>
																</a>
															</li>
															</c:if>
															<c:if test="${QX.del == 1 }">
															<li>
																<a style="cursor:pointer;" onclick="del('${var.PAYMENTTYPE_ID}');" class="tooltip-error" data-rel="tooltip" title="删除">
																	<span class="red">
																		<i class="ace-icon fa fa-trash-o bigger-120"></i>
																	</span>
																</a>
															</li>
															</c:if>
														</ul>
													</div>
												</div>
											</td>
										</tr>
									
									</c:forEach>
									</c:if>
									<c:if test="${QX.cha == 0 }">
										<tr>
											<td colspan="100" class="center">您无权查看</td>
										</tr>
									</c:if>
								</c:when>
								<c:otherwise>
									<tr class="main_info">
										<td colspan="100" class="center" >没有相关数据</td>
									</tr>
								</c:otherwise>
							</c:choose>
							</tbody>
						</table>
						<div class="page-header position-relative">
						<table style="width:100%;">
							<tr>
								<td style="vertical-align:top;">
									<c:if test="${QX.add == 1 }">
									<a class="btn btn-mini btn-success" onclick="add();">新增</a>
									</c:if>
									<c:if test="${QX.del == 1 }">
									<a class="btn btn-mini btn-danger" onclick="makeAll('确定要删除选中的数据吗?');" title="批量删除" ><i class='ace-icon fa fa-trash-o bigger-120'></i></a>
									</c:if>
								</td>
								<td style="vertical-align:top;"><div class="pagination" style="float: right;padding-top: 0px;margin-top: 0px;">${page.pageStr}</div></td>
							</tr>
						</table>
						</div>
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

		<!-- 返回顶部 -->
		<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse">
			<i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i>
		</a>

	</div>
	<!-- /.main-container -->--%>

	<div class="margin clearfix">
		<div class="defray_style">
			<div class="alert alert-danger"> <button type="button" class="close" data-dismiss="alert"><i class="fa fa-remove"></i></button>注：该支付方式启用并不能正常使用，需要开通支付功能才能使用相应的支付方式，</div>
			<div class="border clearfix">
     <span class="l_f">
        <a href="javascript:ovid()" onclick="add_payment()" class="btn btn-primary Pay_add"><i class="fa fa-credit-card"></i>&nbsp;添加支付方式</a>
       </span>
			</div>
			<!--支付列表-->
			<div class="defray_list cover_style clearfix" >
				<div class="type_title">支付方式</div>
				<div class="defray_content clearfix">
					<ul class="defray_info">
						<li class="defray_name">支付宝</li>
						<li class="name_logo"><img src="plugins/htgl_1/products/black/zhifb.jpg"  width="100%" height="150px;" /> </li>
						<li class="description">支付宝（中国）网络技术有限公司是国内领先的第三方支付平台，致力于提供“简单、安全、快速”的支付解决方案</li>
						<li class="select">
							<label><input name="form-field-radio" type="radio" class="ace" checked="checked"><span class="lbl">启用</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<label><input name="form-field-radio" type="radio" class="ace"><span class="lbl">关闭</span></label>
						</li>
						<li class="operating">
							<a href="javascript:ovid()" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;删除</a>
							<a href="javascript:ovid()" class="btn btn-success"><i class="fa  fa-edit "></i>&nbsp;设置</a>
						</li>
					</ul>
					<ul class="defray_info">
						<li class="defray_name">微信支付</li>
						<li class="name_logo"><img src="plugins/htgl_1/products/black/weixin.jpg"  width="100%" height="150px;" /> </li>
						<li class="description">微信支付是集成在微信客户端的支付功能，用户可以通过手机完成快速的支付流程。</li>
						<li class="select">
							<label><input name="form-field-radio1" type="radio" class="ace" checked="checked"><span class="lbl">启用</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<label><input name="form-field-radio1" type="radio" class="ace"><span class="lbl">关闭</span></label>
						</li>
						<li class="operating">
							<a href="javascript:ovid()" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;删除</a>
							<!-- <a href="javascript:ovid()" class="btn btn-success details_btn"><i class="fa  fa-newspaper-o "></i>&nbsp;详细</a>-->
						</li>
					</ul>
					<ul class="defray_info">
						<li class="defray_name">银联</li>
						<li class="name_logo"><img src="plugins/htgl_1/products/black/yinglian.jpg"  width="100%" height="150px;" /> </li>
						<li class="description">中国银联是中国银行卡联合组织，通过银联跨行交易清算系统，实现商业银行系统间的互联互通和资源共享，保证银行卡跨行、跨地区和跨境的使用。</li>
						<li class="select">
							<label><input name="form-field-radio2" type="radio" class="ace" checked="checked"><span class="lbl">启用</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<label><input name="form-field-radio2" type="radio" class="ace"><span class="lbl">关闭</span></label>
						</li>
						<li class="operating">
							<a href="javascript:ovid()" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;删除</a>
							<a href="javascript:ovid()" name="Payment_details.html" title="银联支付详细" onclick="Paymentdetails('134')" class="btn btn-success details_btn"><i class="fa  fa-newspaper-o "></i>&nbsp;详细</a>
						</li>
					</ul>
					<ul class="defray_info">
						<li class="defray_name">怡宝支付</li>
						<li class="name_logo"><img src="plugins/htgl_1/products/black/yozhif.jpg"  width="100%" height="150px;" /> </li>
						<li class="description">中国银联是中国银行卡联合组织，通过银联跨行交易清算系统，实现商业银行系统间的互联互通和资源共享，保证银行卡跨行、跨地区和跨境的使用。</li>
						<li class="select">
							<label><input name="form-field-radio3" type="radio" class="ace" checked="checked"><span class="lbl">启用</span></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<label><input name="form-field-radio3" type="radio" class="ace"><span class="lbl">关闭</span></label>
						</li>
						<li class="operating">
							<a href="javascript:ovid()" class="btn btn-danger"><i class="fa fa-trash"></i>&nbsp;删除</a>
							<!-- <a href="javascript:ovid()" name="Payment_details.html" title="怡宝支付详细" onclick="Paymentdetails('234')" class="btn btn-success details_btn"><i class="fa  fa-newspaper-o "></i>&nbsp;详细</a>-->
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<!--添加支付方式-->
	<div id="add_payment_style" style="display:none">
		<form id="payment_checkbox">
			<ul class="margin payment_list  clearfix">
				<li>
					<label><input name="checkbox" type="checkbox" class="ace" id="checkbox" onclick="select_payment(this,'123')"><span class="lbl"><img src="plugins/htgl_1/products/black/yinglian.jpg"  width="120px" height="100%" /> </span></label>
				</li>
				<li>
					<label><input name="checkbox" type="checkbox" class="ace" id="checkbox" onclick="select_payment(this,'125')"><span class="lbl"><img src="plugins/htgl_1/products/black/yozhif.jpg"  width="120px" height="100%" /></label>
				</li>
				<li>
					<label><input name="checkbox" type="checkbox" class="ace" id="checkbox" onclick="select_payment(this,'126')"><span class="lbl"><img src="plugins/htgl_1/products/black/caifut.jpg"  width="120px" height="100%" /></label>
				</li>
				<li>
					<label><input name="checkbox" type="checkbox" class="ace" id="checkbox" onclick="select_payment(this,'127')"><span class="lbl"><img src="plugins/htgl_1/products/black/weixin.jpg"  width="120px" height="100%" /></label>
				</li>
				<li>
					<label><input name="checkbox" type="checkbox" class="ace" id="checkbox" onclick="select_payment(this,'127')"><span class="lbl"><img src="plugins/htgl_1/products/black/zhifb.jpg"  width="120px" height="100%" /></label>
				</li>
			</ul>
			<div class="add_content clearfix">
				<ul>
					<li class=" clearfix"><label class="label_name">支付方式名称</label><span><input name="支付方式名称" type="text" /></span></li>
					<li  class=" clearfix"><label class="label_name">支持交易货币</label><span style=" margin-left:10px;">人民币</span></li>
					<li  class=" clearfix"><label class="label_name">合作者身份</label><span><input name="合作者身份" type="text" /></span></li>
					<li  class=" clearfix"><label class="label_name">交易安全校验码</label><span><input name="交易安全校验码" type="text" /></span></li>
					<li  class=" clearfix">
						<label class="label_name">选择接口类型</label>
						<span>
        <select class="form-control" id="form-field-select-1">
          <option value="">--选择接口类型--</option>
          <option value="1">使用标准双接口</option>
          <option value="2">使用担保交易接口</option>
          <option value="3">使用即时到帐交易接口</option>
       </select>
      </span>
					</li>
					<li  class=" clearfix"><label class="label_name">支付费率</label><span><input name="支付费率" type="text" />%</span></li>
					<li  class=" clearfix"><label class="label_name">排序</label><span><input name="" type="text"  value="0" style="width:80px;"/></span></li>
					<li  class=" clearfix"><label class="label_name">说明</label><span><textarea name="说明" class="form-textarea" id="form_textarea" placeholder="" onkeyup="checkLength(this);"></textarea><span style=" margin-left:10px;">剩余字数：<em id="sy" style="color:Red;">200</em>字</span></span></li>
				</ul>
			</div>
		</form>
	</div>



<%--	<!-- basic scripts -->
	<!-- 页面底部js¨ -->
	<%@ include file="../../system/index/foot.jsp"%>
	<!-- 删除时确认窗口 -->
	<script src="static/ace/js/bootbox.js"></script>
	<!-- ace scripts -->
	<script src="static/ace/js/ace/ace.js"></script>
	<!-- 下拉框 -->
	<script src="static/ace/js/chosen.jquery.js"></script>
	<!-- 日期框 -->
	<script src="static/ace/js/date-time/bootstrap-datepicker.js"></script>
	<!--提示框-->
	<script type="text/javascript" src="static/js/jquery.tips.js"></script>
	<script type="text/javascript">
		$(top.hangge());//关闭加载状态
		//检索
		function tosearch(){
			top.jzts();
			$("#Form").submit();
		}
		$(function() {
		
			//日期框
			$('.date-picker').datepicker({
				autoclose: true,
				todayHighlight: true
			});
			
			//下拉框
			if(!ace.vars['touch']) {
				$('.chosen-select').chosen({allow_single_deselect:true}); 
				$(window)
				.off('resize.chosen')
				.on('resize.chosen', function() {
					$('.chosen-select').each(function() {
						 var $this = $(this);
						 $this.next().css({'width': $this.parent().width()});
					});
				}).trigger('resize.chosen');
				$(document).on('settings.ace.chosen', function(e, event_name, event_val) {
					if(event_name != 'sidebar_collapsed') return;
					$('.chosen-select').each(function() {
						 var $this = $(this);
						 $this.next().css({'width': $this.parent().width()});
					});
				});
				$('#chosen-multiple-style .btn').on('click', function(e){
					var target = $(this).find('input[type=radio]');
					var which = parseInt(target.val());
					if(which == 2) $('#form-field-select-4').addClass('tag-input-style');
					 else $('#form-field-select-4').removeClass('tag-input-style');
				});
			}
			
			
			//复选框全选控制
			var active_class = 'active';
			$('#simple-table > thead > tr > th input[type=checkbox]').eq(0).on('click', function(){
				var th_checked = this.checked;//checkbox inside "TH" table header
				$(this).closest('table').find('tbody > tr').each(function(){
					var row = this;
					if(th_checked) $(row).addClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', true);
					else $(row).removeClass(active_class).find('input[type=checkbox]').eq(0).prop('checked', false);
				});
			});
		});
		
		//新增
		function add(){
			 top.jzts();
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增";
			 diag.URL = '<%=basePath%>paymenttype/goAdd.do';
			 diag.Width = 450;
			 diag.Height = 355;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮
			 diag.CancelEvent = function(){ //关闭事件
				 if(diag.innerFrame.contentWindow.document.getElementById('zhongxin').style.display == 'none'){
					 if('${page.currentPage}' == '0'){
						 top.jzts();
						 setTimeout("self.location=self.location",100);
					 }else{
						 nextPage(${page.currentPage});
					 }
				}
				diag.close();
			 };
			 diag.show();
		}
		
		//删除
		function del(Id){
			bootbox.confirm("确定要删除吗?", function(result) {
				if(result) {
					top.jzts();
					var url = "<%=basePath%>paymenttype/delete.do?PAYMENTTYPE_ID="+Id+"&tm="+new Date().getTime();
					$.get(url,function(data){
						nextPage(${page.currentPage});
					});
				}
			});
		}
		
		//修改
		function edit(Id){
			 top.jzts();
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑";
			 diag.URL = '<%=basePath%>paymenttype/goEdit.do?PAYMENTTYPE_ID='+Id;
			 diag.Width = 450;
			 diag.Height = 355;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
			 diag.CancelEvent = function(){ //关闭事件
				 if(diag.innerFrame.contentWindow.document.getElementById('zhongxin').style.display == 'none'){
					 nextPage(${page.currentPage});
				}
				diag.close();
			 };
			 diag.show();
		}
		
		//批量操作
		function makeAll(msg){
			bootbox.confirm(msg, function(result) {
				if(result) {
					var str = '';
					for(var i=0;i < document.getElementsByName('ids').length;i++){
					  if(document.getElementsByName('ids')[i].checked){
					  	if(str=='') str += document.getElementsByName('ids')[i].value;
					  	else str += ',' + document.getElementsByName('ids')[i].value;
					  }
					}
					if(str==''){
						bootbox.dialog({
							message: "<span class='bigger-110'>您没有选择任何内容!</span>",
							buttons: 			
							{ "button":{ "label":"确定", "className":"btn-sm btn-success"}}
						});
						$("#zcheckbox").tips({
							side:1,
				            msg:'点这里全选',
				            bg:'#AE81FF',
				            time:8
				        });
						return;
					}else{
						if(msg == '确定要删除选中的数据吗?'){
							top.jzts();
							$.ajax({
								type: "POST",
								url: '<%=basePath%>paymenttype/deleteAll.do?tm='+new Date().getTime(),
						    	data: {DATA_IDS:str},
								dataType:'json',
								//beforeSend: validateData,
								cache: false,
								success: function(data){
									 $.each(data.list, function(i, list){
											nextPage(${page.currentPage});
									 });
								}
							});
						}
					}
				}
			});
		};
		
		//导出excel
		function toExcel(){
			window.location.href='<%=basePath%>paymenttype/excel.do';
		}
	</script>--%>
	<script>
        $(top.hangge());//关闭加载状态
        function select_payment(ojb,id){
            if($('input[name="checkbox"]').prop("checked")){
                $('.add_content').css('display','block');
				/*  var num=0;
				 var str="";
				 $(".add_content input[type$='text']").each(function(n){
				 if($(this).val()=="")
				 {
				 layer.alert(str+=""+$(this).attr("name")+"不能为空！\r\n",{
				 title: '提示框',
				 icon:0,
				 });
				 num++;
				 return false;
				 }
				 });
				 if(num>0){  return false;}	*/
            }
            else{

                $('.add_content').css('display','none');
            }
        }
		/*字数限制*/
        function checkLength(which) {
            var maxChars = 200; //
            if(which.value.length > maxChars){
                layer.open({
                    icon:2,
                    title:'提示框',
                    content:'您输入的字数超过限制!',
                });
                // 超过限制的字数了就将 文本框中的内容按规定的字数 截取
                which.value = which.value.substring(0,maxChars);
                return false;
            }else{
                var curr = maxChars - which.value.length; //250 减去 当前输入的
                document.getElementById("sy").innerHTML = curr.toString();
                return true;
            }
        };
        /**添加支付方式0**/
        function add_payment(index ){
            layer.open({
                type: 1,
                title: '添加支付方式',
                maxmin: true,
                shadeClose:false,
                area : ['830px' , ''],
                content:$('#add_payment_style'),
                btn:['确定','取消'],
                yes: function(index){
                    var checkbox=$('input[name="checkbox"]');
                    if(checkbox.length){
                        var b = false;
                        for(var i=0; i<checkbox.length; i++){
                            if(checkbox[i].checked){
                                b = true;
                                layer.alert('添加成功！',{
                                    title: '提示框',
                                    icon:0,
                                })
                                layer.close(index);
                                break;
                            }

                        }
                        if(!b){
                            layer.alert('请选择所需要的支付方式！',{
                                title: '提示框',
                                icon:0,
                            });

                        }
                    }
                    else{

                    }

                }
            })

        }
        /**面包屑**/
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.iframeAuto(index);
        $('.details_btn').on('click', function(){
            var cname = $(this).attr("title");
            var cnames = parent.$('.Current_page').html();
            var herf = parent.$("#iframe").attr("src");
            parent.$('#parentIframe span').html(cname);
            parent.$('#parentIframe').css("display","inline-block");
            parent.$('.Current_page').attr("name",herf).css({"color":"#4c8fbd","cursor":"pointer"});
            //parent.$('.Current_page').html("<a href='javascript:void(0)' name="+herf+">" + cnames + "</a>");
            parent.layer.close(index);

        });
        function Paymentdetails(id){
            window.location.href = "Payment_details.html?="+id;
        };

	</script>
</body>
</html>