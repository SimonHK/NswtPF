package com.nswt.controller.system.createcode;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import com.nswt.entity.system.Menu;
import com.nswt.service.system.fhlog.FHlogManager;
import com.nswt.service.system.menu.MenuManager;
import com.nswt.util.*;
import com.nswt.util.config.Config;
import com.nswt.util.maven.MavenUtil;
import net.sf.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.nswt.controller.base.BaseController;
import com.nswt.entity.Page;
import com.nswt.service.system.createcode.CreateCodeManager;

import static com.nswt.util.PropValuesUtil.getPprVue;

/** 
 * 类名称： 代码生成器
 * 创建人：HongKai
 * 修改时间：2015年11月23日
 * @version
 */
@Controller
@RequestMapping(value="/createCode")
public class CreateCodeController extends BaseController {
	
	String menuUrl = "createcode/list.do"; //菜单地址(权限用)
	@Resource(name="createcodeService")
	private CreateCodeManager createcodeService;
	@Resource(name="menuService")
	private MenuManager menuService;
	@Resource(name="fhlogService")
	private FHlogManager FHLOG;


	/**列表
	 * @param page
	 * @return
	 */
	@RequestMapping(value="/list")
	public ModelAndView list(Page page) throws Exception{
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){} 		//校验权限
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		String keywords = pd.getString("keywords");	//检索条件
		if(null != keywords && !"".equals(keywords)){
			keywords = keywords.trim();
			pd.put("keywords", keywords);
		}
		page.setPd(pd);
		List<PageData>	varList = createcodeService.list(page);	//列出CreateCode列表
		mv.setViewName("system/createcode/createcode_list");
		mv.addObject("varList", varList);
		mv.addObject("pd", pd);
		mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
		return mv;
	}
	
	/**去代码生成器页面(进入弹窗)
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/goProductCode")
	public ModelAndView goProductCode() throws Exception{
		ModelAndView mv = this.getModelAndView();
		PageData pd = new PageData();
		pd = this.getPageData();
		String CREATECODE_ID = pd.getString("CREATECODE_ID");
		if(!"add".equals(CREATECODE_ID)){
			pd = createcodeService.findById(pd);
			mv.addObject("pd", pd);
			mv.addObject("msg", "edit");
			
		}else{
			mv.addObject("msg", "add");
		}
		List<PageData> varList = createcodeService.listFa(); //列出所有主表结构的
		List<Menu> athmenuList = menuService.listAllMenuQx("0");					//获取某菜单下所有子菜单
		mv.addObject("menuList",athmenuList);
		mv.addObject("varList", varList);
		mv.setViewName("system/createcode/productCode");
		return mv;
	}
	
	/**生成代码
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value="/proCode")
	public void proCode(HttpServletResponse response) throws Exception{
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "add")){} 		//校验权限
		logBefore(logger, Jurisdiction.getUsername()+"执行代码生成器");
		PageData pd = new PageData();
		pd = this.getPageData();
		save(pd);	//保存到数据库
		/* ============================================================================================= */
		String faobject = pd.getString("faobject");  				//主表名				========参数0-1 主附结构用
		String FHTYPE = pd.getString("FHTYPE");  					//模块类型			========参数0-2 类型，单表、树形结构、主表明细表
		String TITLE = pd.getString("TITLE");  						//说明				========参数0
		String packageName = pd.getString("packageName");  			//包名				========参数1
		String objectName = pd.getString("objectName");	   			//类名				========参数2
		String tabletop = pd.getString("tabletop");	   				//表前缀				========参数3
		tabletop = null == tabletop?"":tabletop.toUpperCase();		//表前缀转大写
		String zindext = pd.getString("zindex");	   	   			//属性总数
		String USERNAME = "hongkai";								//创建人
		String USERMAILL = "18611949252@163.com";					//创建人MAILL
		String MENU_ID = pd.getString("MENU_ID");              //功能组（菜单组）
		int zindex = 0;
		if(null != zindext && !"".equals(zindext)){
			zindex = Integer.parseInt(zindext);
		}
		List<String[]> fieldList = new ArrayList<String[]>();   	//属性集合			========参数4
		for(int i=0; i< zindex; i++){
			fieldList.add(pd.getString("field"+i).split(",fh,"));	//属性放到集合里面
		}
		Map<String,Object> root = new HashMap<String,Object>();		//创建数据模型
		root.put("fieldList", fieldList);
		root.put("faobject", faobject.toUpperCase());				//主附结构用，主表名
		root.put("TITLE", TITLE);									//说明
		root.put("USERNAME",USERNAME);								//创建人
		root.put("USERMAILL",USERMAILL);								//创建人MAILL
		root.put("packageName", packageName);						//包名
		root.put("objectName", objectName);							//类名
		root.put("objectNameLower", objectName.toLowerCase());		//类名(全小写)
		root.put("objectNameUpper", objectName.toUpperCase());		//类名(全大写)
		root.put("tabletop", tabletop);								//表前缀	
		root.put("nowDate", new Date());							//当前日期
		
		DelAllFile.delFolder(PathUtil.getClasspath()+"admin/ftl"); //生成代码前,先清空之前生成的代码
		/* ============================================================================================= */
		String filePath = "admin/ftl/code/";						//存放路径
		String ftlPath = "createCode";								//ftl路径
		if("tree".equals(FHTYPE)){
			ftlPath = "createTreeCode";
			/*生成实体类*/
			Freemarker.printFile("entityTemplate.ftl", root, "entity/"+packageName+"/"+objectName+".java", filePath, ftlPath);
			/*生成jsp_tree页面*/
			Freemarker.printFile("jsp_tree_Template.ftl", root, "jsp/"+packageName+"/"+objectName.toLowerCase()+"/"+objectName.toLowerCase()+"_tree.jsp", filePath, ftlPath);
		}else if("fathertable".equals(FHTYPE)){
			ftlPath = "createFaCode";	//主表
		}else if("sontable".equals(FHTYPE)){
			ftlPath = "createSoCode";	//明细表
		}

		/*=============================================代码生成=============================================*/
		/*生成controller*/
		Freemarker.printFile("controllerTemplate.ftl", root, "controller/"+packageName+"/"+objectName.toLowerCase()+"/"+objectName+"Controller.java", filePath, ftlPath);
		/*生成service*/
		Freemarker.printFile("serviceTemplate.ftl", root, "service/"+packageName+"/"+objectName.toLowerCase()+"/impl/"+objectName+"Service.java", filePath, ftlPath);
		/*生成manager*/
		Freemarker.printFile("managerTemplate.ftl", root, "service/"+packageName+"/"+objectName.toLowerCase()+"/"+objectName+"Manager.java", filePath, ftlPath);
		/*生成mybatis xml*/
		Freemarker.printFile("mapperMysqlTemplate.ftl", root, "mybatis_mysql/"+packageName+"/"+objectName+"Mapper.xml", filePath, ftlPath);
		Freemarker.printFile("mapperOracleTemplate.ftl", root, "mybatis_oracle/"+packageName+"/"+objectName+"Mapper.xml", filePath, ftlPath);
		Freemarker.printFile("mapperSqlserverTemplate.ftl", root, "mybatis_sqlserver/"+packageName+"/"+objectName+"Mapper.xml", filePath, ftlPath);
		/*生成SQL脚本*/
		Freemarker.printFile("mysql_SQL_Template.ftl", root, "mysql数据库脚本/"+tabletop+objectName.toUpperCase()+".sql", filePath, ftlPath);
		Freemarker.printFile("oracle_SQL_Template.ftl", root, "oracle数据库脚本/"+tabletop+objectName.toUpperCase()+".sql", filePath, ftlPath);
		Freemarker.printFile("sqlserver_SQL_Template.ftl", root, "sqlserver数据库脚本/"+tabletop+objectName.toUpperCase()+".sql", filePath, ftlPath);
		/*生成jsp页面*/
		Freemarker.printFile("jsp_list_Template.ftl", root, "jsp/"+packageName+"/"+objectName.toLowerCase()+"/"+objectName.toLowerCase()+"_list.jsp", filePath, ftlPath);
		Freemarker.printFile("jsp_edit_Template.ftl", root, "jsp/"+packageName+"/"+objectName.toLowerCase()+"/"+objectName.toLowerCase()+"_edit.jsp", filePath, ftlPath);
		/*生成说明文档*/
		/*===========================================代码生成完毕=============================================*/

		/*=================================依据生成sql创建数据库表=============================================*/
		String dbtype =   getPprVue("dbfh.properties").getProperty("dbtype");
		String sqlfilepath = getPprVue("autocreate.properties").getProperty("project_web")+"/"+filePath;
		if ("mysql".equals(dbtype)){sqlfilepath+="mysql数据库脚本/";}
		if ("oracle".equals(dbtype)){sqlfilepath+="oracle数据库脚本/";}
		if ("sqlserver".equals(dbtype)){sqlfilepath+="sqlserver数据库脚本/";}
		String sqlfilename = sqlfilepath+tabletop+objectName.toUpperCase()+".sql";
		DbFH dbFH = new DbFH();
		String reCreateMessage = dbFH.recover(faobject,sqlfilename).toString();
		/*=============================================创建完毕==============================================*/

		/*=============================================拷贝生成代码入开发目录中待编译===========================*/
		String projectwebpath = getPprVue("autocreate.properties").getProperty("project_web"); //===获取开发web目录
		String sourcepath = getPprVue("autocreate.properties").getProperty("project_source");  //===获取开发source目录
		String javasource = sourcepath+"/java";
		String resourcespath = sourcepath+"/resources";
		String webapppath =  sourcepath+"/webapp";
		String controllersource = javasource+"/com/nswt/controller/";								    //===控制层代码路径
		String servicesource = javasource+"/com/nswt/service/";											//===服务层代码路径
		String mybatissource = resourcespath+"/mybatis/";												//===mybatis代码路径
		String jspsource = webapppath+"/WEB-INF/jsp/";													//===页面路径
		/*拷贝controller到工程目录下*/
		FileUtil.copyDir(new File(projectwebpath+"/"+filePath+"controller/"),controllersource);
		/*拷贝service到工程目录下*/
		FileUtil.copyDir(new File(projectwebpath+"/"+filePath+"service/"),servicesource);
		/*拷贝mybatis xml 到工程目录下*/
		FileUtil.copyDir(new File(projectwebpath+"/"+filePath+"mybatis_mysql/"),mybatissource);
		/*拷贝JSP 到工程目录下*/
		FileUtil.copyDir(new File(projectwebpath+"/"+filePath+"jsp/"),jspsource);
		/*=============================================拷贝完成=============================================*/

		/*========================创建菜单=======================*/
		String menuurl = objectName.toLowerCase()+"/list.do";
		Menu menu = new Menu();
		menu.setMENU_NAME(TITLE);
		menu.setMENU_URL(menuurl);
		menu.setPARENT_ID(StringUtil.noNull(MENU_ID).equals("")?"67":MENU_ID);
		menu.setMENU_ORDER("99");
		menu.setMENU_TYPE("1");
		menu.setMENU_STATE("1");
		if (addMenu(menu)){
			FHLOG.save(Jurisdiction.getUsername(), "动态创建代码及菜单成功，功能地址"+menu.getMENU_NAME());
		}
		/*========================创建菜单完成====================*/
		//this.print("oracle_SQL_Template.ftl", root);  控制台打印
		/*=====================================生成的全部代码压缩成zip文件=====================================*/
		if(FileZip.zip(PathUtil.getClasspath()+"admin/ftl/code", PathUtil.getClasspath()+"admin/ftl/code.zip")){
			/*下载代码*/
			FileDownload.fileDownload(response, PathUtil.getClasspath()+"admin/ftl/code.zip", "code.zip");
		}
	}
	
	/**保存到数据库
	 * @throws Exception
	 */
	public void save(PageData pd) throws Exception{
		pd.put("PACKAGENAME", pd.getString("packageName"));	//包名
		pd.put("OBJECTNAME", pd.getString("objectName"));	//类名
		pd.put("TABLENAME", pd.getString("tabletop")+",fh,"+pd.getString("objectName").toUpperCase());	//表名
		pd.put("FIELDLIST", pd.getString("FIELDLIST"));		//属性集合
		pd.put("CREATETIME", DateUtil.getTime());			//创建时间
		pd.put("TITLE", pd.getString("TITLE"));				//说明
		pd.put("CREATECODE_ID", this.get32UUID());			//主键
		createcodeService.save(pd);
	}
	
	/**
	 * 通过ID获取数据
	 */
	@RequestMapping(value="/findById")
	@ResponseBody
	public Object findById() throws Exception {
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			pd = createcodeService.findById(pd);
		} catch (Exception e) {
			logger.error(e.toString(), e);
		} finally {
			logAfter(logger);
		}
		map.put("pd", pd);
		return AppUtil.returnObject(pd, map);
	}
	
	/**删除
	 * @param out
	 */
	@RequestMapping(value="/delete")
	public void delete(PrintWriter out) throws Exception{
		logBefore(logger, Jurisdiction.getUsername()+"删除CreateCode");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "del")){return;} //校验权限
		PageData pd = new PageData();
		pd = this.getPageData();
		createcodeService.delete(pd);
		out.write("success");
		out.close();
	}
	
	/**
	 * 批量删除
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"批量删除CreateCode");
		if(!Jurisdiction.buttonJurisdiction(menuUrl, "dell")){return null;} //校验权限
		PageData pd = new PageData();		
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			pd = this.getPageData();
			List<PageData> pdList = new ArrayList<PageData>();
			String DATA_IDS = pd.getString("DATA_IDS");
			if(null != DATA_IDS && !"".equals(DATA_IDS)){
				String ArrayDATA_IDS[] = DATA_IDS.split(",");
				createcodeService.deleteAll(ArrayDATA_IDS);
				pd.put("msg", "ok");
			}else{
				pd.put("msg", "no");
			}
			pdList.add(pd);
			map.put("list", pdList);
		} catch (Exception e) {
			logger.error(e.toString(), e);
		} finally {
			logAfter(logger);
		}
		return AppUtil.returnObject(pd, map);
	}

	/**
	 * 重启发布
	 */
	@RequestMapping(value="/commdCode")
	@ResponseBody
	public Object commdCode() throws Exception {
		logBefore(logger, Jurisdiction.getUsername()+"commdCode");
		try {
			goOrder();
		} catch (Exception e) {
			logger.error(e.toString(), e);
		} finally {
			logAfter(logger);
		}
		return "";
	}

	private boolean addMenu(Menu menu)throws Exception{
		boolean isAddMenu = false;
		logBefore(logger, Jurisdiction.getUsername()+"保存菜单");
		try{
			menu.setMENU_ID(String.valueOf(Integer.parseInt(menuService.findMaxIdNoParm())+1));
			menu.setMENU_ICON("menu-icon fa fa-leaf black");//默认菜单图标
			menuService.saveMenu(menu); //保存菜单
			FHLOG.save(Jurisdiction.getUsername(), "新增菜单"+menu.getMENU_NAME());
			isAddMenu = true;
		} catch(Exception e){
			logger.error(e.toString(), e);
		}
		return isAddMenu;
	}

	private void goOrder(){
		String path = PathUtil.getClassResources();
		String mvnOrder = "tomcat7:deploy";
		String shellCommond = path+"mvnCommond.sh";
		//给模板赋执行权限在mac系统和linux系统中使用
		String systemName = Config.getValue("System.OSName").substring(0,1).toLowerCase();
		switch (systemName){
			case "m" : //MAC系统
				MavenUtil.setpermission(shellCommond);
				break;
			case "l" : //类Linux系统
				MavenUtil.setpermission(shellCommond);
				break;
			case "r" : //RedHat系统
				MavenUtil.setpermission(shellCommond);
				break;
			case "c" : //CentOS系统
				MavenUtil.setpermission(shellCommond);
				break;
			default:
				break;
		}
		try {
			MavenUtil.callMacShell(shellCommond,path, mvnOrder);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

	}
	/**根据角色权限获取本权限的菜单列表(递归处理)
	 * @param menuList：传入的总菜单
	 * @param roleRights：加密的权限字符串
	 * @return
	 */
	private List<Menu> readMenu(List<Menu> menuList,String roleRights){
		for(int i=0;i<menuList.size();i++){
			menuList.get(i).setHasMenu(RightsHelper.testRights(roleRights, menuList.get(i).getMENU_ID()));
			if(menuList.get(i).isHasMenu() && "1".equals(menuList.get(i).getMENU_STATE())){	//判断是否有此菜单权限并且是否隐藏
				this.readMenu(menuList.get(i).getSubMenu(), roleRights);					//是：继续排查其子菜单
			}else{
				menuList.remove(i);
				i--;
			}
		}
		return menuList;
	}
}