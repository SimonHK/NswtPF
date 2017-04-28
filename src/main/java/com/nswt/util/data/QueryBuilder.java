package com.nswt.util.data;


import java.sql.SQLException;
import java.util.ArrayList;

/**
 * SQL查询构造器，用于构造参数化SQL并执行，以避免SQL注入。支持批量模式
 *
 * @Author NSWT
 * @Date 2008-7-29
 * @Mail nswt@nswt.com.cn
 */
public class QueryBuilder {
    private ArrayList list = new ArrayList();

    private ArrayList batches;

    /**
     * 批量操作时，返回所有批量操作的参数列表
     */
    protected ArrayList getBatches() {
        return batches;
    }

    private StringBuffer sql = new StringBuffer();

    /**
     * 构造一个空的查询，等待使用setSQL()方法设置SQL语句
     */
    public QueryBuilder() {
    }

    /**
     * 根据传入的SQL字符串构造一个SQL查询
     */
    public QueryBuilder(String sql) {
        setSQL(sql);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, int param) {
        setSQL(sql);
        add(param);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, long param) {
        setSQL(sql);
        add(param);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, Object param) {
        setSQL(sql);
        add(param);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, int param1, Object param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, long param1, Object param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, Object param1, int param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, Object param1, long param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, int param1, int param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, long param1, long param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    /**
     * 根据传入的参数化SQL字符串和参数，构造一个SQL查询
     */
    public QueryBuilder(String sql, Object param1, Object param2) {
        setSQL(sql);
        add(param1);
        add(param2);
    }

    private boolean batchMode;

    /**
     * 当前SQL操作是否是批量模式
     */
    public boolean isBatchMode() {
        return batchMode;
    }

    /**
     * 设置批量模式
     */
    public void setBatchMode(boolean batchMode) {
        if (batchMode && batches == null) {
            batches = new ArrayList();
        }
        this.batchMode = batchMode;
    }

    /**
     * 增加一批参数
     */
    public void addBatch() {
        if (!batchMode) {
            throw new RuntimeException("非批处理模式下不能使用addBatch()");
        }
        batches.add(list);
        list = new ArrayList();
    }

    /**
     * 增加一个SQL参数
     */
    public void add(int param) {
        list.add(new Integer(param));
    }

    /**
     * 增加一个SQL参数
     */
    public void add(long param) {
        list.add(new Long(param));
    }

    /**
     * 增加一个SQL参数
     */
    public void add(Object param) {
        list.add(param);
    }

    /**
     * 设置指定位置的SQL参数
     */
    public void set(int index, int param) {
        list.set(index, new Integer(param));
    }

    /**
     * 设置指定位置的SQL参数
     */
    public void set(int index, long param) {
        list.set(index, new Long(param));
    }

    /**
     * 设置指定位置的SQL参数
     */
    public void set(int index, Object param) {
        list.set(index, param);
    }

    /**
     * 设置SQL语句
     */
    public void setSQL(String sql) {
        this.sql = new StringBuffer(sql);
    }

    /**
     * 请改为使用append(String sqlPart)方法
     *
     * @deprecated
     */
    public void appendSQLPart(String sqlPart) {
        sql.append(sqlPart);
    }

    /**
     * 追加部分SQL语句，主要用于追加where条件
     */
    public QueryBuilder append(String sqlPart) {
        sql.append(sqlPart);
        return this;
    }

    /**
     * 追加部分SQL语句，同时追加SQL参数
     */
    public QueryBuilder append(String sqlPart, int param) {
        sql.append(sqlPart);
        add(param);
        return this;
    }

    /**
     * 追加部分SQL语句，同时追加SQL参数
     */
    public QueryBuilder append(String sqlPart, long param) {
        sql.append(sqlPart);
        add(param);
        return this;
    }

    /**
     * 追加部分SQL语句，同时追加SQL参数
     */
    public QueryBuilder append(String sqlPart, Object param) {
        sql.append(sqlPart);
        add(param);
        return this;
    }

    /**
     * 执行查询，返回DataTable
     */
    public DataTable executeDataTable() {
        return executeDataTable(null);
    }

    /**
     * 在执定连接池上执行查询，返回DataTable
     */
    public DataTable executeDataTable(String poolName) {
        DataAccess da = new DataAccess(DBConnPool.getConnection(poolName));
        DataTable dt = null;
        try {
            dt = da.executeDataTable(this);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        } finally {
            try {
                da.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return dt;
    }

    /**
     * 以分页方式执行查询，并返回代表指定页的DataTable
     */
    public DataTable executePagedDataTable(int pageSize, int pageIndex) {
        return executePagedDataTable(null, pageSize, pageIndex);
    }

    public DataTable executePagedDataTable(String poolName, int pageSize, int pageIndex) {
        DataAccess da = new DataAccess(DBConnPool.getConnection(poolName));
        DataTable dt = null;
        try {
            dt = da.executePagedDataTable(this, pageSize, pageIndex);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        } finally {
            try {
                da.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return dt;
    }

    /**
     * 执行查询，并返回第一条记录的第一个字段的值，如果没有记录，则返回null
     */
    public Object executeOneValue() {
        return executeOneValue(null);
    }

    public Object executeOneValue(String poolName) {
        DataAccess da = new DataAccess(DBConnPool.getConnection(poolName));
        Object t = null;
        try {
            t = da.executeOneValue(this);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        } finally {
            try {
                da.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return t;
    }

    /**
     * 执行查询，并返回第一条记录的第一个字段的值并转化为String，如果没有记录，则返回null
     */
    public String executeString() {
        return executeString(null);
    }

    public String executeString(String poolName) {
        Object o = executeOneValue(poolName);
        if (o == null) {
            return null;
        } else {
            return o.toString();
        }
    }

    /**
     * 执行查询，并返回第一条记录的第一个字段的值并转化为int，如果没有记录，则返回null
     */
    public int executeInt() {
        return executeInt(null);
    }

    public int executeInt(String poolName) {
        Object o = executeOneValue(poolName);
        if (o == null) {
            return 0;
        } else {
            return Integer.parseInt(o.toString());
        }
    }

    /**
     * 执行查询，并返回第一条记录的第一个字段的值并转化为long，如果没有记录，则返回null
     */
    public long executeLong() {
        return executeLong(null);
    }

    public long executeLong(String poolName) {
        Object o = executeOneValue(poolName);
        if (o == null) {
            return 0;
        } else {
            return Long.parseLong(o.toString());
        }
    }

    /**
     * 执行查询，并返回查询影响的记录数。如果发生SQL异常，则抛出异常
     */
    public int executeNoQueryWithException() throws SQLException {
        return executeNoQueryWithException(null);
    }

    public int executeNoQueryWithException(String poolName) throws SQLException {
        DataAccess da = new DataAccess(DBConnPool.getConnection(poolName));
        int t = -1;
        try {
            t = da.executeNoQuery(this);
        } catch (SQLException e) {
            throw e;
        } finally {
            try {
                da.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return t;
    }

    /**
     * 执行查询，并返回查询影响的记录数
     */
    public int executeNoQuery() {
        return executeNoQuery(null);
    }

    public int executeNoQuery(String poolName) {
        try {
            return executeNoQueryWithException(poolName);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 获得本查询使用的参数化SQL
     */
    public String getSQL() {
        return sql.toString();
    }

    /**
     * 返回当前所有SQL参数
     */
    public ArrayList getParams() {
        return list;
    }

    /**
     * 一次性设置所有SQL参数
     */
    public void setParams(ArrayList list) {
        this.list = list;
    }

    /**
     * 批量模式下清空所有批次
     */
    public void clearBatches() {
        if (batchMode) {
            if (batches != null) {
                batches.clear();
            }
            batches = new ArrayList();
        }
    }

    /**
     * 检查参数化SQL中的问号个数与SQL参数个数是否相符
     */
    public boolean checkParams() {
        char[] arr = sql.toString().toCharArray();
        boolean StringCharFlag = false;
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            char c = arr[i];
            if (c == '\'') {
                if (!StringCharFlag) {
                    StringCharFlag = true;
                } else {
                    StringCharFlag = false;
                }
            } else if (c == '?') {
                if (!StringCharFlag) {
                    count++;
                }
            }
        }
        if (count != list.size()) {
            throw new RuntimeException("SQL中含有" + count + "个参数，但有" + list.size() + "个参数置值!");
        }
        return true;
    }

    /*
     * 转成可读的SQL语句
     *
     * @see java.lang.Object#toString()
     */
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append(sql);
        sb.append("\t{");
        for (int i = 0; i < list.size(); i++) {
            if (i != 0) {
                sb.append(",");
            }
            Object o = list.get(i);
            if (o == null) {
                sb.append("null");
                continue;
            }
            String str = list.get(i).toString();
            if (str.length() > 40) {
                str = str.substring(0, 37);
                sb.append(str);
                sb.append("...");
            } else {
                sb.append(str);
            }
        }
        sb.append("}");
        return sb.toString();
    }
}