package com.nswt.util;


/**
 * 可传递参数的过滤器
 *
 * @author NSWT
 * @date 2009-11-15
 * @email nswt@nswt.com.cn
 */
public abstract class Filter {
    protected Object Param;// 用于传递参数

    /**
     * 创建一个空的过滤器对象
     */
    public Filter() {
    }

    /**
     * 创建一个有参数的过滤器对象
     *
     * @param param
     */
    public Filter(Object param) {
        this.Param = param;
    }

    /**
     * 返回true表示保留，返回false表示过滤掉
     */
    public abstract boolean filter(Object obj);

}
