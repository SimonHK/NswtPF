package com.nswt.controller.system.bpm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nswt.controller.base.BaseController;
import com.nswt.entity.Page;
import com.nswt.service.bpm.bpmmodel.BpmModelManager;
import com.nswt.util.AppUtil;
import com.nswt.util.Jurisdiction;
import com.nswt.util.ObjectExcelView;
import com.nswt.util.PageData;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Model;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/** 
 * 说明：流程模型建模
 * 创建人：hongkai
 * 创建时间：2017-02-02
 * 邮箱地址：18611949252@163.com
 */
@Controller
@RequestMapping(value="/bpmmodel")
public class BpmModelController extends BaseController {
	
	String menuUrl = "bpmmodel/list.do"; //菜单地址(权限用)
	@Resource(name="bpmmodelService")
	private BpmModelManager bpmmodelService;
	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/save")
	public ModelAndView save() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"新增BpmModel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "add")){return null;} //校验权限
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();

		RepositoryService repositoryService = processEngine.getRepositoryService();

		ObjectMapper objectMapper = new ObjectMapper();
		ObjectNode editNode = objectMapper.createObjectNode();
		String autoCreatedId = this.get32UUID();
		editNode.put("id",pd.getString("NAME_")+autoCreatedId);
		editNode.put("resourceId",pd.getString("NAME_")+autoCreatedId+"res");

		ObjectNode stencilSetNode = objectMapper.createObjectNode();
		stencilSetNode.put("namespace","http://b3mn.org/stencilset/bpm2.0#");
		editNode.set("stencilset",stencilSetNode);

		ObjectNode modelObjectNode = objectMapper.createObjectNode();
		modelObjectNode.put("name",pd.getString("NAME_"));
		modelObjectNode.put("revision",pd.getString("VERSION_"));
		modelObjectNode.put("description","admin1");

		Model modelData = repositoryService.newModel();
		modelData.setCategory(null);
		modelData.setDeploymentId(null);
		modelData.setKey(null);
		modelData.setMetaInfo(modelObjectNode.toString());
		modelData.setName(pd.getString("NAME_"));
		modelData.setTenantId("");
		modelData.setVersion(Integer.valueOf(pd.getString("VERSION_")));

		repositoryService.saveModel(modelData);
		repositoryService.addModelEditorSource(modelData.getId(),editNode.toString().getBytes("utf-8"));

		System.out.println("******************:["+modelData.getId()+"]********************");



		mv.addObject("msg","success");
		mv.setViewName("save_result");
		return mv;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	public void delete(PrintWriter out) throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"删除BpmModel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "del")){return;} //校验权限
		PageData pd = new PageData();
		pd = this.getPageData();
		bpmmodelService.delete(pd);
		out.write("success");
		out.close();
	}
	
	/**修改
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	public ModelAndView edit() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"修改BpmModel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "edit")){return null;} //校验权限
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		bpmmodelService.edit(pd);
		mv.addObject("msg","success");
		mv.setViewName("save_result");
		return mv;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	public ModelAndView list(Page page) throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"列表BpmModel");
		//if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		String keywords = pd.getString("keywords");				//关键词检索条件
		if(null != keywords && !"".equals(keywords)){
			pd.put("keywords", keywords.trim());
		}
		page.setPd(pd);
		List<PageData> varList = bpmmodelService.list(page);	//列出BpmModel列表
		mv.setViewName("system/bpmmodel/bpmmodel_list");
		mv.addObject("varList", varList);
		mv.addObject("pd", pd);
		mv.addObject("QX", Jurisdiction.getHC());	//按钮权限
		return mv;
	}
	
	/**去新增页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goAdd")
	public ModelAndView goAdd()throws Exception {
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		mv.setViewName("system/bpmmodel/bpmmodel_edit");
		mv.addObject("msg", "save");
		mv.addObject("pd", pd);
		return mv;
	}	
	
	 /**去修改页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	public ModelAndView goEdit()throws Exception {
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = bpmmodelService.findById(pd);	//根据ID读取
		mv.setViewName("system/bpmmodel/bpmmodel_edit");
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
	public Object deleteAll() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"批量删除BpmModel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "del")){return null;} //校验权限
		PageData pd = new PageData();
		Map<String,Object> map = new HashMap<String,Object>();
		pd = this.getPageData();
		List<PageData> pdList = new ArrayList<PageData>();
		String DATA_IDS = pd.getString("DATA_IDS");
		if(null != DATA_IDS && !"".equals(DATA_IDS)){
			String ArrayDATA_IDS[] = DATA_IDS.split(",");
			bpmmodelService.deleteAll(ArrayDATA_IDS);
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
	public ModelAndView exportExcel() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"导出BpmModel到excel");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;}
		ModelAndView mv = new ModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> dataMap = new HashMap<String,Object>();
		List<String> titles = new ArrayList<String>();
		titles.add("备注1");	//1
		titles.add("备注2");	//2
		titles.add("备注3");	//3
		titles.add("备注4");	//4
		titles.add("备注5");	//5
		titles.add("备注6");	//6
		titles.add("备注7");	//7
		titles.add("备注8");	//8
		titles.add("备注9");	//9
		titles.add("备注10");	//10
		titles.add("备注11");	//11
		titles.add("备注12");	//12
		titles.add("备注13");	//13
		dataMap.put("titles", titles);
		List<PageData> varOList = bpmmodelService.listAll(pd);
		List<PageData> varList = new ArrayList<PageData>();
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("ID_"));	    //1
			vpd.put("var2", varOList.get(i).get("REV_").toString());	//2
			vpd.put("var3", varOList.get(i).getString("NAME_"));	    //3
			vpd.put("var4", varOList.get(i).getString("KEY_"));	    //4
			vpd.put("var5", varOList.get(i).getString("CATEGORY_"));	    //5
			vpd.put("var6", varOList.get(i).getString("CREATE_TIME_"));	    //6
			vpd.put("var7", varOList.get(i).getString("LAST_UPDATE_TIME_"));	    //7
			vpd.put("var8", varOList.get(i).get("VERSION_").toString());	//8
			vpd.put("var9", varOList.get(i).getString("META_INFO_"));	    //9
			vpd.put("var10", varOList.get(i).getString("DEPLOYMENT_ID_"));	    //10
			vpd.put("var11", varOList.get(i).getString("EDITOR_SOURCE_VALUE_ID_"));	    //11
			vpd.put("var12", varOList.get(i).getString("EDITOR_SOURCE_EXTRA_VALUE_ID_"));	    //12
			vpd.put("var13", varOList.get(i).getString("TENANT_ID_"));	    //13
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
}
