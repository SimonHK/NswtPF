package com.nswt.controller.system.bpm;

import com.nswt.controller.base.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * 类名称：bpm流程管理
 * 创建人：HongKai
 * 修改时间：2014年11月17日
 * @version
 */
@Controller
@RequestMapping(value="/bpm")
public class BpmController extends BaseController {
    String menuUrl = "bpm/bpmDesigen.do"; //菜单地址(流程设计器)

    /**流程设计器
     * @return
     */
    @RequestMapping(value="/bpmDesigen")
    public ModelAndView bpmDesigen(){
        ModelAndView mv = this.getModelAndView();
        mv.setViewName("system/bpm/bpmDesigen");
        return mv;
    }
}
