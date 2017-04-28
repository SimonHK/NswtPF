package com.nswt.util;


import java.lang.reflect.Array;

/**
 * 按自定义格式逐项输出字符串
 */
public abstract class Formatter {
    /**
     * 默认格式化类，会输出数组元素的内容
     */
    public static Formatter DefaultFormatter = new Formatter() {
        public String format(Object o) {
            if (o == null) {
                return null;
            }
            if (o.getClass().isArray()) {
                StringBuffer sb = new StringBuffer();
                sb.append("{");
                for (int i = 0; i < Array.getLength(o); i++) {
                    if (i != 0) {
                        sb.append(",");
                    }
                    sb.append(Array.get(o, i));
                }
                sb.append("}");
                return sb.toString();
            }
            return o.toString();
        }
    };

    /**
     * 格式化对象，返回字符串
     */
    public abstract String format(Object obj);
}

