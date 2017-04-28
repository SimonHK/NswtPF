package com.nswt.util.data;

import com.nswt.util.CaseIgnoreMapx;
import com.nswt.util.DateUtil;
import com.nswt.util.Mapx;
import com.nswt.util.StringUtil;
import com.nswt.util.log.LogUtil;
import org.apache.commons.lang.ArrayUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;

/**
 * Created by hongkai on 2017/4/25.
 */
public class DataRow implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean isWebMode;// 默认为false;

    protected DataColumn[] columns;

    protected Object[] values;

    public DataRow(DataColumn[] types, Object[] values) {
        columns = types;
        this.values = values;
    }

    public Object get(int index) {
        if (values == null) {
            return null;
        }
        if (index < 0 || index >= columns.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + index);
        }
        return values[index];
    }

    public Object get(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return values[i];
            }
        }
        LogUtil.getLogger().warn("指定的列名没有找到:" + columnName);
        return null;
    }

    public String getString(int index) {
        if (values[index] != null) {
            if (!"".equals(values[index]) && this.columns[index].getColumnType() == DataColumn.DATETIME) {
                if (!(values[index] instanceof Date)) {// DataTable.set或DataRow.set时不会校验类型，所以值的类型可能不再是Date了
                    return String.valueOf(values[index]);
                }
                if (StringUtil.isNotEmpty(this.columns[index].getDateFormat())) {
                    return DateUtil.toString((Date) values[index], this.columns[index].getDateFormat());
                } else {
                    return DateUtil.toString((Date) values[index], "yyyy-MM-dd HH:mm:ss");
                }
            }
            String t = String.valueOf(values[index]).trim();
            if (isWebMode) {
                if (t == null || t.equals("")) {
                    return "&nbsp;";
                }
            }
            return t;
        } else {
            if (isWebMode) {
                return "&nbsp;";
            }
            return "";
        }
    }

    public String getString(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getString(i);
            }
        }
        return "";
    }

    public Date getDate(int index) {
        Object obj = get(index);
        if (obj == null) {
            return null;
        }
        if (obj instanceof Date) {
            return (Date) obj;
        } else {
            return DateUtil.parseDateTime(obj.toString());
        }
    }

    public Date getDate(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getDate(i);
            }
        }
        return null;
    }

    public double getDouble(int index) {
        Object obj = get(index);
        if (obj == null) {
            return 0;
        }
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        } else {
            String str = obj.toString();
            if (StringUtil.isEmpty(str)) {
                return 0;
            }
            return Double.parseDouble(str);
        }
    }

    public double getDouble(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getDouble(i);
            }
        }
        return 0;
    }

    public long getLong(int index) {
        Object obj = get(index);
        if (obj == null) {
            return 0;
        }
        if (obj instanceof Number) {
            return ((Number) obj).longValue();
        } else {
            String str = obj.toString();
            if (StringUtil.isEmpty(str)) {
                return 0;
            }
            return Long.parseLong(str);
        }
    }

    public long getLong(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getLong(i);
            }
        }
        return 0;
    }

    public int getInt(int index) {
        Object obj = get(index);
        if (obj == null) {
            return 0;
        }
        if (obj instanceof Number) {
            return ((Number) obj).intValue();
        } else {
            String str = obj.toString();
            if (StringUtil.isEmpty(str)) {
                return 0;
            }
            return Integer.parseInt(str);
        }
    }

    public int getInt(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getInt(i);
            }
        }
        return 0;
    }

    public boolean isNull(int index) {
        return get(index) == null;
    }

    public boolean isNull(String columnName) {
        return get(columnName) == null;
    }

    public void set(int index, Object value) {
        if (values == null) {
            return;
        }
        if (index < 0 || index >= values.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + index);
        }
        values[index] = value;
    }

    public void set(String columnName, Object value) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < values.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                values[i] = value;
                return;
            }
        }
        throw new RuntimeException("指定的列名没有找到：" + columnName);

    }

    public void set(int index, int value) {
        set(index, new Integer(value));
    }

    public void set(String columnName, int value) {
        set(columnName, new Integer(value));
    }

    public void set(String columnName, long value) {
        set(columnName, new Long(value));
    }

    public void set(int index, long value) {
        set(index, new Long(value));
    }

    public void set(String columnName, double value) {
        set(columnName, new Double(value));
    }

    public void set(int index, double value) {
        set(index, new Double(value));
    }

    public DataColumn getDataColumn(int index) {
        if (index < 0 || index >= columns.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + index);
        }
        return columns[index];
    }

    public DataColumn getDataColumn(String columnName) {
        if (columnName == null || columnName.equals("")) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return columns[i];
            }
        }
        throw new RuntimeException("指定的列名没有找到");
    }

    public int getColumnCount() {
        return columns.length;
    }

    public Object[] getDataValues() {
        return values;
    }

    public DataColumn[] getDataColumns() {
        return columns;
    }

    public void insertColumn(String columnName, Object columnValue) {
        insertColumn(new DataColumn(columnName, DataColumn.STRING), columnValue);
    }

    public void insertColumn(String columnName, Object columnValue, int index) {
        insertColumn(new DataColumn(columnName, DataColumn.STRING), columnValue, index);
    }

    public void insertColumn(DataColumn dc, Object columnValue) {
        insertColumn(dc, columnValue, values.length);
    }

    public void insertColumn(DataColumn dc, Object columnValue, int index) {
        if (index < 0 || index > columns.length) {
            throw new RuntimeException(index + "超出范围，最大允许值为" + columns.length + "!");
        }
        columns = (DataColumn[]) ArrayUtils.add(columns, index, dc);
        values = ArrayUtils.add(values, index, columnValue);
    }

    public boolean isWebMode() {
        return isWebMode;
    }

    public void setWebMode(boolean isWebMode) {
        this.isWebMode = isWebMode;
    }

    public Mapx toMapx() {
        Mapx map = new Mapx();
        for (int i = 0; i < columns.length; i++) {
            map.put(columns[i].getColumnName(), values[i]);
        }
        return map;
    }

    public CaseIgnoreMapx toCaseIgnoreMapx() {
        CaseIgnoreMapx map = new CaseIgnoreMapx(new HashMap());
        for (int i = 0; i < columns.length; i++) {
            map.put(columns[i].getColumnName(), values[i]);
        }
        return map;
    }

    public void fill(Mapx map) {// Map中的键和列名可能有大小写差异
        if (map == null) {
            return;
        }
        Object[] ks = map.keyArray();
        Object[] vs = map.valueArray();
        for (int i = 0; i < map.size(); i++) {
            Object key = ks[i];
            if (key == null) {
                continue;
            }
            for (int j = 0; j < columns.length; j++) {
                if (key.toString().equalsIgnoreCase(columns[j].getColumnName())) {
                    Object v = vs[i];
                    if (columns[j].ColumnType == DataColumn.DATETIME && !Date.class.isInstance(v)) {
                        throw new RuntimeException("数组的第" + j + "个元素必须是Date对象!");
                    }
                    set(j, v);
                }
            }

        }
    }

    public void fill(Object[] values) {
        if (values == null) {
            return;
        }
        if (values.length != getColumnCount()) {
            throw new RuntimeException("执行fill操作数组长度为" + values.length + "，要求的长度为" + getColumnCount() + "！");
        }
        for (int i = 0; i < values.length; i++) {
            if (columns[i].ColumnType == DataColumn.DATETIME && !Date.class.isInstance(values[i])) {
                throw new RuntimeException("第" + i + "列必须是Date对象!");
            }
            set(i, values[i]);
        }
    }

    public String toString() {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < this.columns.length; i++) {
            if (i != 0) {
                sb.append(",");
            }
            sb.append(this.columns[i].getColumnName());
            sb.append(":");
            sb.append(this.values[i]);
        }
        return sb.toString();
    }
}
