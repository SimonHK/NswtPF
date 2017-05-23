package com.nswt.controller.system.report;

import com.nswt.controller.base.BaseController;
import com.nswt.entity.Page;
import com.nswt.util.Jurisdiction;
import com.nswt.util.PageData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * 说明：高级报表管理
 * 创建人：hongkai
 * 创建时间：2017-05-20
 * 邮箱地址：18611949252@163.com
 */
@Controller
@RequestMapping(value="/reportmanager")
public class ReportController extends BaseController {

    String menuUrl = "reportmanager/wizards.do"; //菜单地址(权限用)

    /**列表
     * @param page
     * @throws Exception
     */
    @RequestMapping(value="/wizards")
    public ModelAndView wizardsinfo(Page page) throws Exception{
        logBefore(logger, Jurisdiction.getUsername()+"报表向导工具");
        //if(!Jurisdiction.buttonJurisdiction(menuUrl, "cha")){return null;} //校验权限(无权查看时页面会有提示,如果不注释掉这句代码就无法进入列表页面,所以根据情况是否加入本句代码)
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        String keywords = pd.getString("keywords");				//关键词检索条件
        if(null != keywords && !"".equals(keywords)){
            pd.put("keywords", keywords.trim());
        }
        page.setPd(pd);
        mv.setViewName("report/editor/editor_wizard");
        mv.addObject("pd", pd);
        mv.addObject("QX",Jurisdiction.getHC());	//按钮权限
        return mv;
    }


}
