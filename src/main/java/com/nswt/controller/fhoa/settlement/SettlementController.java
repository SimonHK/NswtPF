package com.nswt.controller.fhoa.settlement;

import com.nswt.controller.base.BaseController;
import com.nswt.util.PageData;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 说明: 结算模块
 * 创建人：HongKai
 * 创建时间：2016-05-27
 */
@Controller
@RequestMapping(value="/settle")
public class SettlementController extends BaseController {

    String menuUrl = "settle/settlement.do"; //菜单地址(权限用)

    /**去结算页面
     * @param
     * @throws Exception
     */
    @RequestMapping(value="/settlement")
    public ModelAndView goAdd()throws Exception{
        ModelAndView mv = this.getModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        mv.setViewName("fhoa/settle/settlement");
        mv.addObject("pd", pd);
        return mv;
    }

}
