package com.nswt.controller.analysis.transaction;

import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.annotation.Resource;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.nswt.controller.base.BaseController;
import com.nswt.entity.Page;
import com.nswt.util.AppUtil;
import com.nswt.util.ObjectExcelView;
import com.nswt.util.PageData;
import com.nswt.util.Jurisdiction;
import com.nswt.service.analysis.transaction.TransactionManager;

/** 
 * 说明：交易分析
 * 创建人：hongkai
 * 创建时间：2017-05-20
 * 邮箱地址：18611949252@163.com
 */
@Controller
@RequestMapping(value="/transaction")
public class TransactionController extends BaseController {
	
	String menuUrl = "transaction/list.do"; //菜单地址(权限用)
	@Resource(name="transactionService")
	private TransactionManager transactionService;
	
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/save")
	public ModelAndView save() throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"新增Transaction");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "add")){return null;} //校验权限
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		pd.put("TRANSACTION_ID", this.get32UUID());	//主键
		transactionService.save(pd);
		mv.addObject("msg","success");
		mv.setViewName("save_result");
		return mv;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	public void delete(PrintWriter out) throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"删除Transaction");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "del")){return;} //校验权限
		PageData pd = new PageData();
		pd = this.getPageData();
		transactionService.delete(pd);
		out.write("success");
		out.close();
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	public ModelAndView edit() throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"修改Transaction");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "edit")){return null;} //校验权限
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		transactionService.edit(pd);
		mv.addObject("msg","success");
		mv.setViewName("save_result");
		return mv;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	public ModelAndView list(Page page) throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"列表Transaction");
		//if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		String keywords = pd.getString("keywords");				//关键词检索条件
		if(null != keywords && !"".equals(keywords)){
			pd.put("keywords", keywords.trim());
		}
		page.setPd(pd);
		List<PageData>	varList = transactionService.list(page);	//列出Transaction列表
		mv.setViewName("analysis/transaction/transaction_list");
		mv.addObject("varList", varList);
		mv.addObject("pd", pd);
		mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
		return mv;
	}
	
	/**去新增页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goAdd")
	public ModelAndView goAdd()throws Exception{
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		mv.setViewName("analysis/transaction/transaction_edit");
		mv.addObject("msg", "save");
		mv.addObject("pd", pd);
		return mv;
	}	
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	public ModelAndView goEdit()throws Exception{
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = transactionService.findById(pd);	//根据ID读取
		mv.setViewName("analysis/transaction/transaction_edit");
		mv.addObject("msg", "edit");
		mv.addObject("pd", pd);
		return mv;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll() throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"批量删除Transaction");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "del")){return null;} //校验权限
		PageData pd = new PageData();		
		Map<String,Object> map = new HashMap<String,Object>();
		pd = this.getPageData();
		List<PageData> pdList = new ArrayList<PageData>();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(null != DATA_IDS && !"".equals(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			transactionService.deleteAll(ArrayDATA_IDS);
			pd.put("msg", "ok");
		}else{
			pd.put("msg", "no");
		}
		pdList.add(pd);
		map.put("list", pdList);
		return AppUtil.returnObject(pd, map);
	}
	
	 /**导出到excel
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
	public ModelAndView exportExcel() throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"导出Transaction到excel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;}
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("ID");	//1
		titles.add("物品名称");	//2
		titles.add("销售数量");	//3
		titles.add("销售时间");	//4
		titles.add("付款状态");	//5
		titles.add("发货状态");	//6
		dataMap.put("titles", titles);
		List<PageData> varOList = transactionService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).get("ID").toString());	//1
			vpd.put("var2", varOList.get(i).getString("ITEMNAME"));	    //2
			vpd.put("var3", varOList.get(i).get("SALESVOLUMES").toString());	//3
			vpd.put("var4", varOList.get(i).getString("TIME"));	    //4
			vpd.put("var5", varOList.get(i).getString("PAYMENTSTATUS"));	    //5
			vpd.put("var6", varOList.get(i).getString("SHIPSTATUS"));	    //6
			varList.add(vpd);
		}
		dataMap.put("varList", varList);
		ObjectExcelView erv = new ObjectExcelView();
		mv = new ModelAndView(erv,dataMap);
		return mv;
	}
	
	@InitBinder
	public void initBinder(WebDataBinder binder){
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		binder.registerCustomEditor(Date.class, new CustomDateEditor(format,true));
	}


	@RequestMapping(value="/getTimeChar")
	public Object getTimeChar(){

		Map<String, Object> map = new HashMap<String,Object>();// 柱状图数据
		String errInfo = "success";
		List<Double> inCosts = new ArrayList<Double>();   //投入成本
		List<Double> outCosts = new ArrayList<Double>();  //产出成本
		List<Double> profits = new ArrayList<Double>();   //利润

		Calendar now= new GregorianCalendar();
		int y= now.get(Calendar.YEAR);
		inCosts.add(22.22);
		inCosts.add(24.33);
		outCosts.add(33.4);
		outCosts.add(66.5);
		/*inCosts = intoService.getInto(y);
		outCosts = intoService.getOut(y);*/

		for (int i = 0; i < inCosts.size(); i++) {
			double temp = outCosts.get(i) - inCosts.get(i);
			if(temp < 0){
				profits.add(0.0);
			}else{
				profits.add(temp);
			}
		}

		BarDTO<Double> one = new BarDTO<Double>();
		one.setName("投入资金");
		one.setType("bar");
		one.setData(inCosts);

		BarDTO<Double> two = new BarDTO<Double>();
		two.setName("产出资金");
		two.setType("bar");
		two.setData(outCosts);

		BarDTO<Double> three = new BarDTO<Double>();
		three.setName("利润");
		three.setType("bar");
		three.setData(profits);

		map.put("inCosts",one);
		map.put("outCosts",two);
		map.put("profits",three);
		map.put("result",errInfo);				//返回结果
		return AppUtil.returnObject(new PageData(), map);
	}

}
