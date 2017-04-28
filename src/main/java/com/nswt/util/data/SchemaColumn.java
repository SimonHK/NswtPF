package com.nswt.util.data;


/**
 * Schema中单个字段的描述信息<br>
 *
 * 作者: NSWT<br>
 * 日期：2016-7-3<br>
 * 邮件：nswt@nswt.com.cn<br>
 */
public class SchemaColumn implements java.io.Serializable {
    private static final long serialVersionUID = 1L;

    private int ColumnType;

    private String ColumnName;

    private int ColumnOrder;

    private int Length;

    private int Precision;

    private boolean Mandatory;

    private boolean isPrimaryKey;

    /**
     * name: 字段名<br>
     * type: 字段类型<br>
     * order: 字段在表中的顺序<br>
     * length: 字段长度<br>
     * precision: 字段精度<br>
     * mandatory: 是否必填<br>
     * ispk: 是否是主键<br>
     */
    public SchemaColumn(String name, int type, int order, int length, int precision, boolean mandatory, boolean ispk) {
        ColumnType = type;
        ColumnName = name;
        ColumnOrder = order;
        Length = length;
        Precision = precision;
        Mandatory = mandatory;
        isPrimaryKey = ispk;
    }

    /**
     * 获取字段名
     */
    public String getColumnName() {
        return ColumnName;
    }

    /**
     * 获取字段顺序
     */
    public int getColumnOrder() {
        return ColumnOrder;
    }

    /**
     * 获取字段类型
     */
    public int getColumnType() {
        return ColumnType;
    }

    /**
     * 是否是主键
     */
    public boolean isPrimaryKey() {
        return isPrimaryKey;
    }

    /**
     * 获取字段长度
     */
    public int getLength() {
        return Length;
    }

    /**
     * 获取字段精度
     */
    public int getPrecision() {
        return Precision;
    }

    /**
     * 是否是非空字段
     */
    public boolean isMandatory() {
        return Mandatory;
    }
}
