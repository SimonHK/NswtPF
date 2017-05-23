package com.nswt.controller.prudoct;

import com.nswt.controller.base.BaseController;
import com.nswt.entity.Page;
import com.nswt.util.Jurisdiction;
import com.nswt.util.PageData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * Created by hongkai on 2017/5/15.
 */

@Controller
@RequestMapping(value="/prudoct")
public class PrudoctController extends BaseController {

    String menuUrl = "prudoct/list.do"; //商品列表菜单地址(权限用)
    String brandUrl = "prudoct/brandlist.do";//品牌管理
    String categoryUrl = "prudoct/categorylist.do";//分类管理

    /**商品列表
     * @param page
     * @throws Exception
     */
    @RequestMapping(value="/list")
    public ModelAndView list(Page page) throws Exception{
        logBefore(logger, Jurisdiction.getUsername()+"列表Prudoct");
        //if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        String keywords = pd.getString("keywords");				//关键词检索条件
        if(null != keywords && !"".equals(keywords)){
            pd.put("keywords", keywords.trim());
        }
        page.setPd(pd);
     /*   List<PageData> varList = cornfeiService.list(page);	//列出CornFei列表*/
        mv.setViewName("app_plugs/product/products_list");
      /*  mv.addObject("varList", varList);*/
        mv.addObject("pd", pd);
        mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
        return mv;
    }

    /**品牌管理
     * @param page
     * @throws Exception
     */
    @RequestMapping(value="/brandlist")
    public ModelAndView brandlist(Page page) throws Exception{
        logBefore(logger, Jurisdiction.getUsername()+"品牌列表Prudoct");
        //if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        String keywords = pd.getString("keywords");				//关键词检索条件
        if(null != keywords && !"".equals(keywords)){
            pd.put("keywords", keywords.trim());
        }
        page.setPd(pd);
     /*   List<PageData> varList = cornfeiService.list(page);	//列出CornFei列表*/
        mv.setViewName("app_plugs/product/brand_manage");
      /*  mv.addObject("varList", varList);*/
        mv.addObject("pd", pd);
        mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
        return mv;
    }

    /**分类管理
     * @param page
     * @throws Exception
     */
    @RequestMapping(value="/categorylist")
    public ModelAndView categorylist(Page page) throws Exception{
        logBefore(logger, Jurisdiction.getUsername()+"分类管理Prudoct");
        //if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        String keywords = pd.getString("keywords");				//关键词检索条件
        if(null != keywords && !"".equals(keywords)){
            pd.put("keywords", keywords.trim());
        }
        page.setPd(pd);
     /*   List<PageData> varList = cornfeiService.list(page);	//列出CornFei列表*/
        mv.setViewName("app_plugs/product/category_manage");
      /*  mv.addObject("varList", varList);*/
        mv.addObject("pd", pd);
        mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
        return mv;
    }

    /**添加或编辑商品
     * @param
     * @throws Exception
     */
    @RequestMapping(value="/prudoctAdd")
    public ModelAndView prudoctAdd() throws Exception{
        logBefore(logger, Jurisdiction.getUsername()+"添加商品prudoctAdd");
        if(!Jurisdiction.buttonJurisdiction(menuUrl, "edit")){return null;} //校验权限
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        mv.setViewName("app_plugs/product/product_edit");
        mv.addObject("msg", "save");
        mv.addObject("pd", pd);
        return mv;
    }

}