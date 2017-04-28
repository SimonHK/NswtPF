package com.nswt.util.data;

import com.nswt.util.*;
import org.apache.commons.lang.ArrayUtils;

import java.io.UnsupportedEncodingException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;

/**
 * Created by hongkai on 2017/4/25.
 */
public class DataTable {

    private static final long serialVersionUID = 1L;

    private boolean isWebMode;// 默认值为false，True表示getString的结果是null或者""时转成&nbsp;

    private DataRow[] rows;

    private DataColumn[] columns;

    public DataTable() {
        this.rows = new DataRow[0];
        this.columns = new DataColumn[0];
    }

    public DataTable(DataColumn[] types, Object[][] values) {
        if (types == null) {
            types = new DataColumn[0];
        }
        columns = null;
        rows = null;
        // 判断是否有相同列名
        if (this.checkColumns(types)) {
            columns = types;
        }
        if (values != null) {
            rows = new DataRow[values.length];
            for (int i = 0; i < rows.length; i++) {
                rows[i] = new DataRow(columns, values[i]);
            }
        } else {
            this.rows = new DataRow[0];
        }
    }

    // 判断是否有相同列名
    public boolean checkColumns(DataColumn[] types) {
        if (types == null) {
            return false;
        }
        for (int i = 0; i < types.length; i++) {
            String columnName = types[i].getColumnName();
            for (int j = 0; j < i; j++) {
                if (columnName == null) {
                    throw new RuntimeException("DataTable中第" + i + "列列名为null!");
                }
                if (columnName.equals(types[j].getColumnName())) {
                    throw new RuntimeException("一个DataTable中不充许有重名的列:" + columnName);
                }
            }
        }
        return true;
    }

    public DataTable(ResultSet rs) {
        this(rs, Integer.MAX_VALUE, 0, false);
    }

    public DataTable(ResultSet rs, boolean latin1Flag) {
        this(rs, Integer.MAX_VALUE, 0, latin1Flag);
    }

    public DataTable(ResultSet rs, int pageSize, int pageIndex) {
        this(rs, pageSize, pageIndex, false);
    }

    /**
     * 当数据库为Oracle，且使用LATIN1或U7ASCII字符集时，latin1Flag为true
     */
    public DataTable(ResultSet rs, int pageSize, int pageIndex, boolean latin1Flag) {
        ResultSetMetaData rsmd;
        try {
            // 以下准备DataColumn[]
            rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            DataColumn[] types = new DataColumn[columnCount];
            for (int i = 1; i <= columnCount; i++) {
                String name = rsmd.getColumnLabel(i);
                boolean b = rsmd.isNullable(i) == ResultSetMetaData.columnNullable;
                DataColumn dc = new DataColumn();
                dc.setAllowNull(b);
                dc.setColumnName(name);

                // 以下设置数据类型
                int dataType = rsmd.getColumnType(i);
                if (dataType == Types.CHAR || dataType == Types.VARCHAR || dataType == Types.LONGVARCHAR) {
                    dc.ColumnType = DataColumn.STRING;
                } else if (dataType == Types.TIMESTAMP || dataType == Types.DATE) {
                    dc.ColumnType = DataColumn.DATETIME;
                } else if (dataType == Types.DECIMAL) {
                    dc.ColumnType = DataColumn.DECIMAL;
                } else if (dataType == Types.DOUBLE || dataType == Types.REAL) {
                    dc.ColumnType = DataColumn.DOUBLE;
                } else if (dataType == Types.FLOAT) {
                    dc.ColumnType = DataColumn.FLOAT;
                } else if (dataType == Types.INTEGER) {
                    dc.ColumnType = DataColumn.INTEGER;
                } else if (dataType == Types.SMALLINT || dataType == Types.TINYINT) {
                    dc.ColumnType = DataColumn.SMALLINT;
                } else if (dataType == Types.BIT) {
                    dc.ColumnType = DataColumn.BIT;
                } else if (dataType == Types.BIGINT) {
                    dc.ColumnType = DataColumn.LONG;
                } else if (dataType == Types.BLOB) {
                    dc.ColumnType = DataColumn.BLOB;
                } else if (dataType == Types.CLOB) {
                    dc.ColumnType = DataColumn.CLOB;
                } else if (dataType == Types.NUMERIC) {
                    int dataScale = rsmd.getScale(i);
                    int dataPrecision = rsmd.getPrecision(i);
                    if (dataScale == 0) {
                        if (dataPrecision == 0) {
                            dc.ColumnType = DataColumn.BIGDECIMAL;
                        } else {
                            dc.ColumnType = DataColumn.LONG;
                        }
                    } else {
                        dc.ColumnType = DataColumn.BIGDECIMAL;
                    }
                } else {
                    dc.ColumnType = DataColumn.STRING;
                }
                types[i - 1] = dc;
            }

            if (this.checkColumns(types)) {
                columns = types;
            }
            // 以下准备ColumnValues[]
            List list = new ArrayList();
            int index = 0;
            int begin = pageIndex * pageSize;
            int end = (pageIndex + 1) * pageSize;
            while (rs.next()) {
                if (index >= end) {
                    break;
                }
                if (index >= begin) {
                    Object[] t = new Object[columnCount];
                    for (int j = 1; j <= columnCount; j++) {
                        if (columns[j - 1].getColumnType() == DataColumn.CLOB) {
                            String str = LobUtil.clobToString(rs.getClob(j));
                            if (latin1Flag && StringUtil.isNotEmpty(str)) {
                                try {
                                    str = new String(str.getBytes("ISO-8859-1"), Constant.GlobalCharset);
                                } catch (UnsupportedEncodingException e) {
                                    e.printStackTrace();
                                }
                            }
                            if (" ".equals(str)) {
                                str = "";// 解决sybase下clob空值会取出空格的问题
                            }
                            t[j - 1] = str;
                        } else if (columns[j - 1].getColumnType() == DataColumn.BLOB) {
                            t[j - 1] = LobUtil.blobToBytes(rs.getBlob(j));
                        } else if (columns[j - 1].getColumnType() == DataColumn.BIT) {
                            t[j - 1] = "true".equals(rs.getString(j)) || "1".equals(rs.getString(j)) ? "1" : "0";
                        } else if (columns[j - 1].getColumnType() == DataColumn.STRING) {
                            String str = rs.getString(j);
                            if (latin1Flag && StringUtil.isNotEmpty(str)) {
                                try {
                                    str = new String(str.getBytes("ISO-8859-1"), Constant.GlobalCharset);
                                } catch (UnsupportedEncodingException e) {
                                    e.printStackTrace();
                                }
                            }
                            t[j - 1] = str;
                        } else {
                            t[j - 1] = rs.getObject(j);
                        }
                    }
                    DataRow tmpRow = new DataRow(columns, t);
                    list.add(tmpRow);
                }
                index++;
            }
            this.rows = new DataRow[list.size()];
            list.toArray(this.rows);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteColumn(int columnIndex) {
        if (columns.length == 0) {
            return;
        }
        if (columnIndex < 0 || (columns != null && columnIndex >= columns.length)) {
            throw new RuntimeException("DataRow中没有指定的列：" + columnIndex);
        }
        this.columns = (DataColumn[]) ArrayUtils.remove(this.columns, columnIndex);
        for (int i = 0; i < rows.length; i++) {
            rows[i].columns = null;
            rows[i].columns = this.columns;
            rows[i].values = ArrayUtils.remove(rows[i].values, columnIndex);
        }
    }

    public void deleteColumn(String columnName) {
        if (columns.length == 0) {
            return;
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                deleteColumn(i);
                break;
            }
        }
    }

    public void insertColumn(String columnName) {
        insertColumn(new DataColumn(columnName, DataColumn.STRING), null, columns.length);
    }

    public void insertColumn(String columnName, Object columnValue) {
        Object[] cv = new Object[rows.length];
        for (int i = 0; i < cv.length; i++) {
            cv[i] = columnValue;
        }
        insertColumn(new DataColumn(columnName, DataColumn.STRING), cv, columns.length);
    }

    public void insertColumns(String[] columnNames) {
        for (int i = 0; i < columnNames.length; i++) {
            insertColumn(new DataColumn(columnNames[i], DataColumn.STRING), null, columns.length);
        }
    }

    public void insertColumn(String columnName, Object[] columnValue) {
        insertColumn(new DataColumn(columnName, DataColumn.STRING), columnValue, columns.length);
    }

    public void insertColumn(DataColumn dc) {
        insertColumn(dc, null, columns.length);
    }

    public void insertColumn(DataColumn dc, Object[] columnValue) {
        insertColumn(dc, columnValue, columns.length);
    }

    public void insertColumn(String columnName, Object[] columnValue, int index) {
        insertColumn(new DataColumn(columnName, DataColumn.STRING), columnValue, index);
    }

    public void insertColumn(DataColumn dc, Object[] columnValue, int index) {
        if (index > columns.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + index);
        }
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(dc.getColumnName())) {
                throw new RuntimeException("DataTable中已经存在列：" + dc.getColumnName());
            }
        }
        this.columns = (DataColumn[]) ArrayUtils.add(columns, index, dc);
        if (columnValue == null) {
            columnValue = new Object[rows.length];
        }
        if (rows.length == 0) {
            rows = new DataRow[columnValue.length];
            for (int i = 0; i < rows.length; i++) {
                rows[i] = new DataRow(this.columns, new Object[] { columnValue[i] });
            }
        } else {
            for (int i = 0; i < rows.length; i++) {
                rows[i].columns = null;
                rows[i].columns = this.columns;
                rows[i].values = ArrayUtils.add(rows[i].values, index, columnValue[i]);
            }
        }
    }

    public void insertRow(DataRow dr) {
        insertRow(dr, rows.length);
    }

    public void insertRow(DataRow dr, int index) {
        if (columns.length == 0) {
            columns = dr.columns;
        }
        insertRow(dr.getDataValues(), index);
    }

    public void insertRow(Object[] rowValue) {
        insertRow(rowValue, rows.length);
    }

    public void insertRow(Object[] rowValue, int index) {
        if (index > rows.length) {
            throw new RuntimeException(index + "超出范围，最大允许值为" + rows.length + "!");
        }
        if (rowValue != null) {
            if (columns.length == 0) {
                columns = new DataColumn[rowValue.length];
                for (int i = 0; i < columns.length; i++) {
                    columns[i] = new DataColumn("_Columns_" + i, DataColumn.STRING);
                }
            }
            if (rowValue.length != columns.length) {
                throw new RuntimeException("新增行的列数为" + rowValue.length + "，要求的列数为" + columns.length + "！");
            }
            for (int i = 0; i < columns.length; i++) {
                if (columns[i].ColumnType == DataColumn.DATETIME) {
                    if (rowValue[i] != null && !Date.class.isInstance(rowValue[i])) {
                        throw new RuntimeException("第" + i + "列必须是Date对象!");
                    }
                }
            }
        } else {
            rowValue = new Object[columns.length];
        }
        DataRow[] newRows = new DataRow[rows.length + 1];
        System.arraycopy(rows, 0, newRows, 0, index);
        if (index < rows.length) {
            System.arraycopy(rows, index, newRows, index + 1, rows.length - index);
        }
        newRows[index] = new DataRow(columns, rowValue);
        rows = newRows;
    }

    public void deleteRow(int index) {
        if (index >= rows.length) {
            throw new RuntimeException(index + "超出范围，最大允许值为" + (rows.length - 1) + "!");
        }
        rows = (DataRow[]) ArrayUtils.remove(rows, index);
    }

    public void deleteRow(DataRow dr) {
        for (int i = 0; i < rows.length; i++) {
            if (dr == rows[i]) {
                deleteRow(i);
                return;
            }
        }
        throw new RuntimeException("指定的DataRow对象不属于此DataTable!");
    }

    public DataRow get(int rowIndex) {
        if (rowIndex >= rows.length || rowIndex < 0) {
            throw new RuntimeException("指定的行索引值超出范围");
        }
        return rows[rowIndex];
    }

    public void set(int rowIndex, int colIndex, Object value) {
        getDataRow(rowIndex).set(colIndex, value);
    }

    public void set(int rowIndex, String columnName, Object value) {
        getDataRow(rowIndex).set(columnName, value);
    }

    public void set(int rowIndex, int colIndex, int value) {
        getDataRow(rowIndex).set(colIndex, value);
    }

    public void set(int rowIndex, String columnName, int value) {
        getDataRow(rowIndex).set(columnName, value);
    }

    public void set(int rowIndex, int colIndex, long value) {
        getDataRow(rowIndex).set(colIndex, value);
    }

    public void set(int rowIndex, String columnName, long value) {
        getDataRow(rowIndex).set(columnName, value);
    }

    public void set(int rowIndex, int colIndex, double value) {
        getDataRow(rowIndex).set(colIndex, value);
    }

    public void set(int rowIndex, String columnName, double value) {
        getDataRow(rowIndex).set(columnName, value);
    }

    public Object get(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).get(colIndex);
    }

    public Object get(int rowIndex, String columnName) {
        return getDataRow(rowIndex).get(columnName);
    }

    public String getString(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).getString(colIndex);
    }

    public String getString(int rowIndex, String columnName) {
        return getDataRow(rowIndex).getString(columnName);
    }

    public int getInt(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).getInt(colIndex);
    }

    public int getInt(int rowIndex, String columnName) {
        return getDataRow(rowIndex).getInt(columnName);
    }

    public long getLong(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).getLong(colIndex);
    }

    public long getLong(int rowIndex, String columnName) {
        return getDataRow(rowIndex).getLong(columnName);
    }

    public double getDouble(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).getDouble(colIndex);
    }

    public double getDouble(int rowIndex, String columnName) {
        return getDataRow(rowIndex).getDouble(columnName);
    }

    public Date getDate(int rowIndex, int colIndex) {
        return getDataRow(rowIndex).getDate(colIndex);
    }

    public Date getDate(int rowIndex, String columnName) {
        return getDataRow(rowIndex).getDate(columnName);
    }

    public DataRow getDataRow(int rowIndex) {
        if (rowIndex >= rows.length || rowIndex < 0) {
            throw new RuntimeException("指定的行索引值超出范围");
        }
        return rows[rowIndex];
    }

    public DataColumn getDataColumn(int columnIndex) {
        if (columnIndex < 0 || columnIndex >= columns.length) {
            throw new RuntimeException("指定的列索引值超出范围");
        }
        return columns[columnIndex];
    }

    public DataColumn getDataColumn(String columnName) {
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return (getDataColumn(i));
            }
        }
        return null;
    }

    public Object[] getColumnValues(int columnIndex) {
        if (columnIndex < 0 || columnIndex >= columns.length) {
            throw new RuntimeException("指定的列索引值超出范围");
        }
        Object[] arr = new Object[this.getRowCount()];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = this.rows[i].values[columnIndex];
        }
        return arr;
    }

    public Object[] getColumnValues(String columnName) {
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(columnName)) {
                return getColumnValues(i);
            }
        }
        return null;
    }

    public void sort(Comparator c) {
        Arrays.sort(rows, c);
    }

    public void sort(String columnName) {
        sort(columnName, "desc", false);
    }

    public void sort(String columnName, String order) {
        sort(columnName, order, false);
    }

    public void sort(String columnName, String order, final boolean isNumber) {
        final String cn = columnName;
        final String od = order;
        sort(new Comparator() {
            public int compare(Object obj1, Object obj2) {
                DataRow dr1 = (DataRow) obj1;
                DataRow dr2 = (DataRow) obj2;
                Object v1 = dr1.get(cn);
                Object v2 = dr2.get(cn);
                if (v1 instanceof Number && v2 instanceof Number) {
                    double d1 = ((Number) v1).doubleValue();
                    double d2 = ((Number) v2).doubleValue();
                    if (d1 == d2) {
                        return 0;
                    } else if (d1 > d2) {
                        return "asc".equalsIgnoreCase(od) ? 1 : -1;
                    } else {
                        return "asc".equalsIgnoreCase(od) ? -1 : 1;
                    }
                } else if (v1 instanceof Date && v2 instanceof Date) {
                    Date d1 = (Date) v1;
                    Date d2 = (Date) v1;
                    if ("asc".equalsIgnoreCase(od)) {
                        return d1.compareTo(d2);
                    } else {
                        return -d1.compareTo(d2);
                    }
                } else if (isNumber) {
                    double d1 = 0, d2 = 0;
                    try {
                        d1 = Double.parseDouble(String.valueOf(v1));
                        d2 = Double.parseDouble(String.valueOf(v2));
                    } catch (Exception e) {
                    }
                    if (d1 == d2) {
                        return 0;
                    } else if (d1 > d2) {
                        return "asc".equalsIgnoreCase(od) ? -1 : 1;
                    } else {
                        return "asc".equalsIgnoreCase(od) ? 1 : -1;
                    }
                } else {
                    int c = dr1.getString(cn).compareTo(dr2.getString(cn));
                    if ("asc".equalsIgnoreCase(od)) {
                        return c;
                    } else {
                        return -c;
                    }
                }
            }
        });
    }

    public DataTable filter(Filter filter) {
        List valueList = new ArrayList();
        for (int i = 0; i < rows.length; i++) {
            if (filter.filter(rows[i])) {
                valueList.add(rows[i]);
            }
        }
        DataTable dt = new DataTable();
        dt.columns = this.columns;
        dt.rows = new DataRow[valueList.size()];
        valueList.toArray(dt.rows);
        dt.setWebMode(this.isWebMode);
        return dt;
    }

    /**
     * 还存在一些问题，只是浅层拷贝,有待于类型更为严格之后再来修改
     */
    public Object clone() {
        DataColumn[] dcs = new DataColumn[columns.length];
        for (int i = 0; i < columns.length; i++) {
            dcs[i] = (DataColumn) this.columns[i].clone();
        }
        DataTable dt = new DataTable();
        dt.columns = dcs;
        dt.rows = (DataRow[]) this.rows.clone();
        dt.setWebMode(this.isWebMode);
        return dt;
    }

    /**
     * 以指定的列字段值为key,以另一指定的列值为value,填充到一个Mapx中，并返回此Mapx
     */
    public Mapx toMapx(String keyColumnName, String valueColumnName) {
        if (StringUtil.isEmpty(keyColumnName)) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        if (StringUtil.isEmpty(valueColumnName)) {
            throw new RuntimeException("不能存取列名为空的列");
        }
        int keyIndex = 0, valueIndex = 0;
        boolean keyFlag = false, valueFlag = false;
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(keyColumnName)) {
                keyIndex = i;
                keyFlag = true;
                if (valueFlag) {
                    break;
                }
            }
            if (columns[i].getColumnName().equalsIgnoreCase(valueColumnName)) {
                valueIndex = i;
                valueFlag = true;
                if (keyFlag) {
                    break;
                }

            }
        }
        return toMapx(keyIndex, valueIndex);
    }

    /**
     * 以指定的列字段值为key,以另一指定的列值为value,填充到一个Mapx中，并返回此Mapx
     */
    public Mapx toMapx(int keyColumnIndex, int valueColumnIndex) {
        if (keyColumnIndex < 0 || keyColumnIndex >= columns.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + keyColumnIndex);
        }
        if (valueColumnIndex < 0 || valueColumnIndex >= columns.length) {
            throw new RuntimeException("DataRow中没有指定的列：" + valueColumnIndex);
        }
        Mapx map = new Mapx();
        for (int i = 0; i < rows.length; i++) {
            Object key = this.rows[i].values[keyColumnIndex];
            if (key == null) {
                map.put(key, this.rows[i].values[valueColumnIndex]);
            } else {
                map.put(key.toString(), this.rows[i].values[valueColumnIndex]);
            }
        }
        return map;
    }

    /**
     * 以指定列的值为key，去map中寻找对应的值，并把值置到新增的列中，新增列的列名=指定列列名+"Name"
     */
    public void decodeColumn(String colName, Map map) {
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(colName)) {
                decodeColumn(i, map);
                return;
            }
        }
    }

    public void decodeColumn(int colIndex, Map map) {
        String newName = this.columns[colIndex].ColumnName + "Name";
        this.insertColumn(newName);
        for (int i = 0; i < getRowCount(); i++) {
            String v = getString(i, colIndex);
            set(i, newName, map.get(v));
        }
    }

    public void decodeDateColumn(String colName) {
        for (int i = 0; i < columns.length; i++) {
            if (columns[i].getColumnName().equalsIgnoreCase(colName)) {
                decodeDateColumn(i);
                return;
            }
        }
    }

    public void decodeDateColumn(int colIndex) {
        String newName = this.columns[colIndex].ColumnName + "Name";
        this.insertColumn(newName);
        for (int i = 0; i < getRowCount(); i++) {
            String v = getString(i, colIndex);
            set(i, newName, DateUtil.toDisplayDateTime(v));
        }
    }

    /**
     * 将两个表的内容合并
     */
    public void union(DataTable anotherDT) {
        if (anotherDT.getRowCount() == 0) {
            return;
        }
        if (this.getRowCount() == 0) {
            this.rows = anotherDT.rows;
            return;
        }
        if (this.getColCount() != anotherDT.getColCount()) {
            throw new RuntimeException("两个DataTable的列数不一致，列数1：" + this.getColCount() + " ,列数2："
                    + anotherDT.getColCount());
        }
        int srcPos = rows.length;
        DataRow[] newRows = new DataRow[rows.length + anotherDT.getRowCount()];
        System.arraycopy(rows, 0, newRows, 0, srcPos);
        System.arraycopy(anotherDT.rows, 0, newRows, srcPos, anotherDT.getRowCount());
        rows = null;
        rows = newRows;
    }

    public int getRowCount() {
        return this.rows.length;
    }

    public int getColCount() {
        return this.columns.length;
    }

    public DataColumn[] getDataColumns() {
        return columns;
    }

    public boolean isWebMode() {
        return isWebMode;
    }

    public void setWebMode(boolean isWebMode) {
        this.isWebMode = isWebMode;
        for (int i = 0; i < rows.length; i++) {
            this.rows[i].setWebMode(isWebMode);
        }
    }

    public String toString() {
        return DataTableUtil.dataTableToTxt(this, (String[]) null, "\t", "\n");
    }

    public boolean containsColumn(String name) {
        return getDataColumn(name) != null;
    }

}
