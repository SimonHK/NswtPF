package com.nswt.util;


import java.util.Map;

/**
 * 键名不区分大写小的Map
 *
 * @Author NSWT
 * @Date 2009-1-5
 * @Mail nswt@nswt.com.cn
 */
public class CaseIgnoreMapx extends Mapx {
    private static final long serialVersionUID = 1L;

    /**
     * 创建一个键名不区分大小的Map
     */
    public CaseIgnoreMapx() {
        super();
    }

    /**
     * 根据指定Map创建一个键名不区分大小的Map
     */
    public CaseIgnoreMapx(Map map) {
        super();
        this.putAll(map);
    }

    /**
     * 设置Map键值对，如果键是字符串，则不区分大小写
     *
     * @see java.util.HashMap#put(K, V)
     */
    public Object put(Object key, Object value) {
        if (key != null && key instanceof String) {
            return super.put(key.toString().toLowerCase(), value);
        }
        return super.put(key, value);
    }

    /**
     * 获取Map中的键值，如果键是字符串，则不区分大小写
     *
     * @see com.nswt.framework.utility.Mapx#get(java.lang.Object)
     */
    public Object get(Object key) {
        if (key != null && key instanceof String) {
            return super.get(key.toString().toLowerCase());
        }
        return super.get(key);
    }

    /**
     * 判断是否含有指定键，如果键是字符串，则不区分大小写
     */
    public boolean containsKey(Object key) {
        if (key != null && key instanceof String) {
            return super.containsKey(key.toString().toLowerCase());
        }
        return super.containsKey(key);
    }

    /**
     * 移除指定键，如果键是字符串，则不区分大小写
     */
    public Object remove(Object key) {
        if (key != null && key instanceof String) {
            return super.remove(key.toString().toLowerCase());
        }
        return super.remove(key);
    }
}
