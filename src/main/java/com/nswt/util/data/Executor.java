package com.nswt.util.data;

/**
 * 执行器,将要执行的JAVA逻辑传递给其他函数，让其他函数择机调用。<br>
 *
 * 日期 : 2010-2-8 <br>
 * 作者: NSWT <br>
 * 邮箱：nswt@nswt.com.cn <br>
 */
public abstract class Executor {
    protected Object param;

    public Executor(Object param) {
        this.param = param;
    }

    public abstract boolean execute();
}