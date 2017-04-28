package com.nswt.util;

import com.nswt.util.data.DataColumn;
import com.nswt.util.data.DataTable;
import com.nswt.util.log.LogUtil;

import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by hongkai on 2017/4/25.
 */
public class Mapx extends LinkedHashMap {

    private static final float DEFAULT_LOAD_FACTOR = 0.75f;

    private static final int DEFAULT_INIT_CAPACITY = 16;

    private static final long serialVersionUID = 200904201752L;

    private final int maxCapacity;

    private final boolean maxFlag;

    private int hitCount = 0;

    private int missCount = 0;

    private long lastWarnTime = 0;

    private ExitEventListener listener;

    /**
     * 有最大容量限制的HashMap,当LRUFlag为true时按LRU算法换入换出,为false时按FIFO算法换入换出
     */
    public Mapx(int maxCapacity, boolean LRUFlag) {
        super(maxCapacity, DEFAULT_LOAD_FACTOR, LRUFlag);
        this.maxCapacity = maxCapacity;
        maxFlag = true;
    }

    /**
     * 键值无顺序,有最大容量,使用LRU算法换入换出的HashMap
     */
    public Mapx(int maxCapacity) {
        this(maxCapacity, true);
    }

    /**
     * 键值按加入先后顺序排序的HashMap,没有容量限制,不支持换入换出
     */
    public Mapx() {
        super(DEFAULT_INIT_CAPACITY, DEFAULT_LOAD_FACTOR, false);
        maxCapacity = 0;
        maxFlag = false;
    }

    /**
     * 递归Clone,防止Mapx中有Mapx时出现同步问题
     */
    public Object clone() {
        Mapx map = (Mapx) super.clone();
        Object[] ks = keyArray();
        Object[] vs = valueArray();
        for (int i = 0; i < ks.length; i++) {
            Object v = vs[i];
            if (v instanceof Mapx) {
                map.put(ks[i], ((Mapx) v).clone());
            }
        }
        return map;
    }

    protected boolean removeEldestEntry(Map.Entry eldest) {
        boolean flag = maxFlag && size() > maxCapacity;
        if (flag && listener != null) {
            listener.onExit(eldest.getKey(), eldest.getValue());
        }
        return flag;
    }

    /**
     * 设置换出事件监听器,当键值对换出调用
     */
    public void setExitEventListener(ExitEventListener listener) {
        this.listener = listener;
    }

    /**
     * 获取键的数组
     */
    public Object[] keyArray() {
        if (size() == 0) {
            return new Object[0];
        }
        Object[] arr = new Object[size()];
        int i = 0;
        for (Iterator iter = this.keySet().iterator(); iter.hasNext();) {
            arr[i++] = iter.next();
        }
        return arr;
    }

    /**
     * 获取键值的数组，键值数组与键数组之间在顺序上是一一对应的
     */
    public Object[] valueArray() {
        if (size() == 0) {
            return new Object[0];
        }
        Object[] arr = new Object[size()];
        int i = 0;
        for (Iterator iter = this.values().iterator(); iter.hasNext();) {
            arr[i++] = iter.next();
        }
        return arr;
    }

    public String getString(Object key) {
        Object o = get(key);
        if (o == null) {
            return null;
        } else {
            return o.toString();
        }
    }

    public void put(Object key, int num) {
        put(key, new Integer(num));
    }

    public void put(Object key, long num) {
        put(key, new Long(num));
    }

    public int getInt(Object key) {
        Object o = get(key);
        if (o instanceof Number) {
            return ((Number) o).intValue();
        } else if (o != null) {
            try {
                return Integer.parseInt(o.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return 0;
    }

    public long getLong(Object key) {
        Object o = get(key);
        if (o instanceof Number) {
            return ((Number) o).longValue();
        } else if (o != null) {
            try {
                return Long.parseLong(o.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return 0;
    }

    public Date getDate(Object key) {
        Object o = get(key);
        if (o instanceof Date) {
            return (Date) o;
        } else if (o != null) {
            try {
                return DateUtil.parse(o.toString());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 为实现命中率统计,覆盖此方法.
     */
    public Object get(Object key) {
        Object o = super.get(key);
        if (maxFlag) {
            if (o == null) {
                missCount++;
            } else {
                hitCount++;
            }
            if (missCount > 1000 && hitCount * 1.0 / missCount < 0.1) {// 命中率过低时每小时报警
                if (System.currentTimeMillis() - lastWarnTime > 1000000) {
                    lastWarnTime = System.currentTimeMillis();
                    StackTraceElement stack[] = (new Throwable()).getStackTrace();
                    StringBuffer sb = new StringBuffer();
                    for (int i = 0; i < stack.length; i++) {
                        StackTraceElement ste = stack[i];
                        if (ste.getClassName().indexOf("DBConnPoolImpl") == -1) {
                            sb.append("\t");
                            sb.append(ste.getClassName());
                            sb.append(".");
                            sb.append(ste.getMethodName());
                            sb.append("(),行号:");
                            sb.append(ste.getLineNumber());
                            sb.append("\n");
                        }
                    }
                    LogUtil.getLogger().warn("缓存命中率过低!");
                    LogUtil.getLogger().warn(sb);
                }
            }
        }
        return o;
    }

    /**
     * 将一个Map转为Mapx
     */
    public static Mapx convertToMapx(Map map) {
        Mapx mapx = new Mapx();
        mapx.putAll(map);
        return mapx;
    }

    /**
     * 将一个Map转为含有Key和Value两个字段的DataTable
     */
    public DataTable toDataTable() {
        DataColumn[] dcs = new DataColumn[] { new DataColumn("Key", DataColumn.STRING),
                new DataColumn("Value", DataColumn.STRING) };
        Object[] ks = this.keyArray();
        Object[][] vs = new Object[ks.length][2];
        DataTable dt = new DataTable(dcs, vs);
        for (int i = 0; i < ks.length; i++) {
            dt.set(i, 0, ks[i]);
            dt.set(i, 1, get(ks[i]));
        }
        return dt;
    }

}
