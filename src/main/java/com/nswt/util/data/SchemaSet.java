package com.nswt.util.data;


import com.nswt.entity.system.User;
import com.nswt.util.Filter;
import com.nswt.util.StringUtil;
import com.nswt.util.log.LogUtil;

import java.io.Serializable;
import java.sql.BatchUpdateException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;

/**
 * SchemaSet类，对应于数据库中一组记录<br>
 *
 * 作者: NSWT<br>
 * 日期：2016-7-7<br>
 * 邮件：nswt@nswt.com.cn<br>
 */
public abstract class SchemaSet implements Serializable, Cloneable {
    private static final long serialVersionUID = 1L;

    private Schema[] elementData;

    private int elementCount;

    private int capacityIncrement;

    protected String TableCode;

    protected String NameSpace;

    protected SchemaColumn[] Columns;

    protected String InsertAllSQL;

    protected String UpdateAllSQL;

    protected String FillAllSQL;

    protected String DeleteSQL;

    protected int bConnFlag = 0;// 1为连接从外部传入，0为未传入连接

    protected boolean bOperateFlag = false;

    protected int[] operateColumnOrders;

    protected transient DataAccess mDataAccess;

    /**
     * 初始化一个指定容量和增长率的SchemaSet
     */
    protected SchemaSet(int initialCapacity, int capacityIncrement) {
        if (initialCapacity < 0) {
            throw new RuntimeException("SchemaSet的初始容量不能小于0");
        }
        this.elementData = new Schema[initialCapacity];
        this.capacityIncrement = capacityIncrement;
        this.elementCount = 0;
    }

    /**
     *初始化一个指定容量的SchemaSet
     */
    protected SchemaSet(int initialCapacity) {
        this(initialCapacity, 0);
    }

    /**
     * 初始化一个SchemaSet，初始容量为10
     */
    protected SchemaSet() {
        this(10);
    }

    /**
     * 为Schema设置DataAccess，设置DataAccess之后insert(),update()等操作都会使用此DataAccess进行
     */
    public void setDataAccess(DataAccess dAccess) {
        mDataAccess = dAccess;
        bConnFlag = 1;
    }

    /**
     * 往Set中增加一个Schema
     */
    public boolean add(Schema s) {
        if (s == null || s.TableCode != this.TableCode) {
            LogUtil.warn("传入的参数不是一个" + this.TableCode + "Schema");
            return false;
        }
        ensureCapacityHelper(elementCount + 1);
        elementData[elementCount] = s;
        elementCount++;
        return true;
    }

    /**
     * 将一个SchemaSet全体加入到另一个SchemaSet中去
     */
    public boolean add(SchemaSet aSet) {
        if (aSet == null) {
            return false;
        }
        int n = aSet.size();
        ensureCapacityHelper(elementCount + n);
        for (int i = 0; i < n; i++) {
            elementData[elementCount + i] = aSet.getObject(i);
        }
        elementCount += n;
        return true;
    }

    /**
     * 从Set中去掉一个Schema
     */
    public boolean remove(Schema aSchema) {
        if (aSchema == null) {
            return false;
        }
        for (int i = 0; i < elementCount; i++) {
            if (aSchema.equals(elementData[i])) {
                int j = elementCount - i - 1;
                if (j > 0) {
                    System.arraycopy(elementData, i + 1, elementData, i, j);
                }
                elementCount--;
                elementData[elementCount] = null;
                return true;
            }
        }
        return false;
    }

    /**
     * 指索引范围去掉一组Schema
     */
    public boolean removeRange(int index, int length) {
        if (index < 0 || length < 0 || index + length > elementCount) {
            return false;
        }
        if (elementCount > index + length) {
            System.arraycopy(elementData, index + length, elementData, index, length);
        }
        for (int i = 0; i < length; i++) {
            elementData[elementCount - i - 1] = null;
        }
        elementCount -= length;
        return true;
    }

    /**
     * 清除掉Set中的所有Schema
     */
    public void clear() {
        for (int i = 0; i < elementCount; i++) {
            elementData[i] = null;
        }
        elementCount = 0;
    }

    /**
     * 判断当前Set中是否有Schema
     */
    public boolean isEmpty() {
        return elementCount == 0;
    }

    /**
     * 返回第index个Schmea
     */
    public Schema getObject(int index) {
        if (index > elementCount) {
            throw new RuntimeException("SchemaSet索引过大," + index);
        }
        return elementData[index];
    }

    /**
     * 设置第index个Schema
     */
    public boolean set(int index, Schema aSchema) {
        if (index > elementCount) {
            throw new RuntimeException("SchemaSet索引过大," + index);
        }
        elementData[index] = aSchema;
        return true;
    }

    /**
     * 和另一个Set共用一组内部数据
     *
     * @deprecated
     */
    public boolean set(SchemaSet aSet) {
        this.elementData = aSet.elementData;
        this.elementCount = aSet.elementCount;
        this.capacityIncrement = aSet.capacityIncrement;
        return true;
    }

    /**
     * 返回SchemaSet中Schema的个数
     */
    public int size() {
        return elementCount;
    }

    /**
     * 根据需要扩大SchemaSet的容量
     */
    private void ensureCapacityHelper(int minCapacity) {
        int oldCapacity = elementData.length;
        if (minCapacity > oldCapacity) {
            Object oldData[] = elementData;
            int newCapacity = (capacityIncrement > 0) ? (oldCapacity + capacityIncrement) : (oldCapacity * 2);
            if (newCapacity < minCapacity) {
                newCapacity = minCapacity;
            }
            elementData = new Schema[newCapacity];
            System.arraycopy(oldData, 0, elementData, 0, elementCount);
        }
    }

    /**
     * 将SchemaSet中的所有数据插入到数据库中
     */
    public boolean insert() {
        if (bConnFlag == 0) {
            mDataAccess = new DataAccess();
        }
        PreparedStatement pstmt = null;
        try {
            DBConn conn = mDataAccess.getConnection();
            boolean autoComit = conn.getAutoCommit();
            if (bConnFlag == 0) {
                conn.setAutoCommit(false);
            }
            pstmt = conn.prepareStatement(InsertAllSQL, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            for (int k = 0; k < elementCount; k++) {
                for (int i = 0; i < Columns.length; i++) {
                    Schema schema = elementData[k];
                    SchemaColumn sc = Columns[i];
                    if (sc.isMandatory()) {
                        if (schema.getV(i) == null) {
                            LogUtil.warn("表" + this.TableCode + "的列" + sc.getColumnName() + "不能为空");
                            return false;
                        }
                    }
                    Object v = schema.getV(i);
                    SchemaUtil.setParam(sc, pstmt, conn, i, v);
                }
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            if (bConnFlag == 0) {
                conn.commit();
                conn.setAutoCommit(autoComit);
            }
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
            return true;
        } catch (Throwable e) {
            // 批量增加时发生异常很难调试，例如字段超长，主键冲突等，需要输出整个SchemaSet到日志中
            if (e instanceof BatchUpdateException) {
                LogUtil.warn(this.toDataTable());
            }
            LogUtil.warn("操作表" + this.TableCode + "时发生错误:" + e.getMessage());
            throw new RuntimeException(e);
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                pstmt = null;
            }
            if (bConnFlag == 0) {
                try {
                    mDataAccess.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 将SchemaSet中的所有数据更新到数据库
     */
    public boolean update() {
        String sql = UpdateAllSQL;
        if (bConnFlag == 0) {
            mDataAccess = new DataAccess();
        }
        if (bOperateFlag) {
            StringBuffer sb = new StringBuffer("update " + TableCode + " set ");
            for (int i = 0; i < operateColumnOrders.length; i++) {
                if (i != 0) {
                    sb.append(",");
                }
                sb.append(Columns[operateColumnOrders[i]].getColumnName());
                sb.append("=?");
            }
            sb.append(sql.substring(sql.indexOf(" where")));
            sql = sb.toString();
        }
        if (mDataAccess.getConnection().getDBConfig().isSybase()) {// Sybase下的临时措施，将来要改掉
            sql = StringUtil.replaceAllIgnoreCase(sql, " Count=", "\"Count\"=");
            sql = StringUtil.replaceAllIgnoreCase(sql, " Scroll=", "\"Scroll\"=");
            sql = StringUtil.replaceAllIgnoreCase(sql, ",Count=", ",\"Count\"=");
            sql = StringUtil.replaceAllIgnoreCase(sql, ",Scroll=", ",\"Scroll\"=");
        }
        PreparedStatement pstmt = null;
        try {
            DBConn conn = mDataAccess.getConnection();
            boolean autoComit = conn.getAutoCommit();
            if (bConnFlag == 0) {
                conn.setAutoCommit(false);
            }
            pstmt = conn.prepareStatement(sql, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            for (int k = 0; k < elementCount; k++) {
                Schema schema = elementData[k];
                if (bOperateFlag) {
                    for (int i = 0; i < operateColumnOrders.length; i++) {
                        Object v = schema.getV(operateColumnOrders[i]);
                        SchemaUtil.setParam(Columns[operateColumnOrders[i]], pstmt, conn, operateColumnOrders[i], v);
                    }
                } else {
                    for (int i = 0; i < Columns.length; i++) {
                        Object v = schema.getV(i);
                        SchemaUtil.setParam(Columns[i], pstmt, conn, i, v);
                    }
                }
                int pkIndex = 0;
                for (int i = 0, j = 0; i < Columns.length; i++) {
                    SchemaColumn sc = Columns[i];
                    if (sc.isPrimaryKey()) {
                        Object v = schema.getV(sc.getColumnOrder());
                        if (schema.OldKeys != null) {
                            v = schema.OldKeys[pkIndex++];
                        }
                        if (v == null) {
                            LogUtil.warn("不满足Update的条件，" + TableCode + "Schema的" + sc.getColumnName() + "为空");
                            return false;
                        } else {
                            if (bOperateFlag) {
                                SchemaUtil.setParam(Columns[i], pstmt, conn, j + operateColumnOrders.length, v);
                            } else {
                                SchemaUtil.setParam(Columns[i], pstmt, conn, j + Columns.length, v);
                            }
                        }
                        j++;
                    }
                }
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            if (bConnFlag == 0) {
                conn.commit();
                conn.setAutoCommit(autoComit);
            }
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
            return true;
        } catch (Throwable e) {
            LogUtil.warn("操作表" + this.TableCode + "时发生错误:" + e.getMessage());
            e.printStackTrace();
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                pstmt = null;
            }
            if (bConnFlag == 0) {
                try {
                    mDataAccess.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    /**
     * 按主键删除SchemaSet中的所有记录
     */
    public boolean delete() {
        if (bConnFlag == 0) {
            mDataAccess = new DataAccess();
        }
        PreparedStatement pstmt = null;
        try {
            DBConn conn = mDataAccess.getConnection();
            boolean autoComit = conn.getAutoCommit();
            if (bConnFlag == 0) {
                conn.setAutoCommit(false);
            }
            pstmt = conn.prepareStatement(DeleteSQL, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            for (int k = 0; k < elementCount; k++) {
                Schema schema = elementData[k];
                int pkIndex = 0;
                for (int i = 0, j = 0; i < Columns.length; i++) {
                    SchemaColumn sc = Columns[i];
                    if (sc.isPrimaryKey()) {
                        Object v = schema.getV(sc.getColumnOrder());
                        if (schema.OldKeys != null) {
                            v = schema.OldKeys[pkIndex++];
                        }
                        if (v == null) {
                            LogUtil.warn("不满足delete的条件，" + TableCode + "Schema的" + sc.getColumnName() + "为空");
                            return false;
                        } else {
                            SchemaUtil.setParam(Columns[i], pstmt, conn, j, v);
                        }
                        j++;
                    }
                }
                pstmt.addBatch();
            }
            pstmt.executeBatch();
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
            if (bConnFlag == 0) {
                conn.commit();
                conn.setAutoCommit(autoComit);
            }
            return true;
        } catch (Throwable e) {
            LogUtil.warn("操作表" + this.TableCode + "时发生错误:" + e.getMessage());
            e.printStackTrace();
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                pstmt = null;
            }
            if (bConnFlag == 0) {
                try {
                    mDataAccess.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }

    /**
     * 按主键删除Set中的所有数据后再插入，某些情况下为保证插入不会失败而使用本方法
     */
    public boolean deleteAndInsert() {
        if (bConnFlag == 1) {
            if (!delete()) {
                return false;
            }
            return insert();
        } else {
            mDataAccess = new DataAccess();
            bConnFlag = 1;
            try {
                mDataAccess.setAutoCommit(false);
                delete();
                insert();
                mDataAccess.commit();
                return true;
            } catch (Throwable e) {
                e.printStackTrace();
                try {
                    mDataAccess.rollback();
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
                return false;
            } finally {
                try {
                    mDataAccess.setAutoCommit(true);
                    mDataAccess.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                this.mDataAccess = null;
                this.bConnFlag = 0;
            }
        }
    }

    /**
     * 删除Set中的所有记录并备份到B表
     */
    public boolean deleteAndBackup() {
        return deleteAndBackup(null, null);
    }

    /**
     * 删除Set中的所有记录并备份到B表，并指定备份人和备份备注
     */
    public boolean deleteAndBackup(String backupOperator, String backupMemo) {
        try {
            //backupOperator = StringUtil.isEmpty(backupOperator) ? User.getUserName() : backupOperator;
            backupOperator = StringUtil.isEmpty(backupOperator) ? "SYSTEM" : backupOperator;

            Class c = Class.forName("com.nswt.schema.B" + this.TableCode + "Schema");
            Class s = Class.forName("com.nswt.schema.B" + this.TableCode + "Set");
            SchemaSet bSet = (SchemaSet) s.newInstance();
            Date now = new Date();
            for (int k = 0; k < elementCount; k++) {
                Schema schema = elementData[k];
                Schema bSchema = (Schema) c.newInstance();
                int i = 0;
                for (; i < this.Columns.length; i++) {
                    bSchema.setV(i, schema.getV(i));
                }
                bSchema.setV(i, SchemaUtil.getBackupNo());
                bSchema.setV(i + 1, backupOperator);
                bSchema.setV(i + 2, now);
                bSchema.setV(i + 3, backupMemo);
                bSet.add(bSchema);
            }
            if (bConnFlag == 1) {
                bSet.setDataAccess(mDataAccess);
                if (!delete()) {
                    return true;
                }
                bSet.insert();
                return true;
            } else {
                mDataAccess = new DataAccess();
                bConnFlag = 1;
                bSet.setDataAccess(mDataAccess);
                try {
                    mDataAccess.setAutoCommit(false);
                    delete();
                    bSet.insert();
                    mDataAccess.commit();
                    return true;
                } catch (Throwable e) {
                    e.printStackTrace();
                    try {
                        mDataAccess.rollback();
                    } catch (SQLException e1) {
                        e1.printStackTrace();
                    }
                    return false;
                } finally {
                    try {
                        mDataAccess.setAutoCommit(true);
                        mDataAccess.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                    this.mDataAccess = null;
                    this.bConnFlag = 0;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 将Set中的所有数据备份到B表
     */
    public boolean backup() {
        return backup(null, null);
    }

    /**
     * 将Set中的所有记录备份到B表，并指定备份人和备份备注
     */
    public boolean backup(String backupOperator, String backupMemo) {
        try {
            //backupOperator = StringUtil.isEmpty(backupOperator) ? User.getUserName() : backupOperator;
            backupOperator = StringUtil.isEmpty(backupOperator) ? "SYSTEM" : backupOperator;

            Class c = Class.forName("com.nswt.schema.B" + this.TableCode + "Schema");
            Class s = Class.forName("com.nswt.schema.B" + this.TableCode + "Set");
            SchemaSet bSet = (SchemaSet) s.newInstance();
            Date now = new Date();
            for (int k = 0; k < elementCount; k++) {
                Schema schema = elementData[k];
                Schema bSchema = (Schema) c.newInstance();
                int i = 0;
                for (; i < this.Columns.length; i++) {
                    bSchema.setV(i, schema.getV(i));
                }
                bSchema.setV(i, SchemaUtil.getBackupNo());
                bSchema.setV(i + 1, backupOperator);
                bSchema.setV(i + 2, now);
                bSchema.setV(i + 3, backupMemo);
                bSet.add(bSchema);
            }
            if (bConnFlag == 1) {
                bSet.setDataAccess(mDataAccess);
            }
            return bSet.insert();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 按字段名指定要操作的列，调用本方法后，query()时只会获取指定,update()时只会更新指定列
     */
    public void setOperateColumns(String[] colNames) {
        if (colNames == null || colNames.length == 0) {
            bOperateFlag = false;
            return;
        }
        operateColumnOrders = new int[colNames.length];
        for (int i = 0, k = 0; i < colNames.length; i++) {
            boolean flag = false;
            for (int j = 0; j < Columns.length; j++) {
                if (colNames[i].toString().toLowerCase().equals(Columns[j].getColumnName().toLowerCase())) {
                    operateColumnOrders[k] = j;
                    k++;
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                throw new RuntimeException("指定的列名" + colNames[i] + "不正确");
            }
        }
        bOperateFlag = true;
    }

    /**
     * 按字段顺序指定要操作的列，调用本方法后，query()时只会获取指定,update()时只会更新指定列
     */
    public void setOperateColumns(int[] colOrder) {
        if (colOrder == null || colOrder.length == 0) {
            bOperateFlag = false;
            return;
        }
        for (int i = 0; i < elementCount; i++) {
            elementData[i].setOperateColumns(colOrder);
        }
        operateColumnOrders = colOrder;
        bOperateFlag = true;
    }

    /**
     * 将SchemaSet转化为DataTable
     */
    public DataTable toDataTable() {
        if (bOperateFlag) {
            DataColumn[] dcs = new DataColumn[operateColumnOrders.length];
            Object[][] values = new Object[elementCount][Columns.length];
            for (int i = 0; i < operateColumnOrders.length; i++) {
                DataColumn dc = new DataColumn();
                dc.setColumnName(Columns[operateColumnOrders[i]].getColumnName());
                dc.setColumnType(Columns[operateColumnOrders[i]].getColumnType());
                dcs[i] = dc;
            }
            for (int i = 0; i < elementCount; i++) {
                for (int j = 0; j < operateColumnOrders.length; j++) {
                    values[i][j] = elementData[i].getV(operateColumnOrders[j]);
                }
            }
            DataTable dt = new DataTable(dcs, values);
            return dt;
        }
        DataColumn[] dcs = new DataColumn[Columns.length];
        Object[][] values = new Object[elementCount][Columns.length];
        for (int i = 0; i < Columns.length; i++) {
            DataColumn dc = new DataColumn();
            dc.setColumnName(Columns[i].getColumnName());
            dc.setColumnType(Columns[i].getColumnType());
            dcs[i] = dc;
        }
        for (int i = 0; i < elementCount; i++) {
            for (int j = 0; j < Columns.length; j++) {
                values[i][j] = elementData[i].getV(j);
            }
        }
        DataTable dt = new DataTable(dcs, values);
        return dt;
    }

    /*
     * (non-Javadoc)
     *
     * @see java.lang.Object#clone()
     */
    public Object clone() {
        SchemaSet set = this.newInstance();
        for (int i = 0; i < this.size(); i++) {
            set.add((Schema) elementData[i].clone());
        }
        return set;
    }

    /**
     * 按指定的比较器类排序
     */
    public void sort(Comparator c) {
        Schema[] newData = new Schema[elementCount];
        System.arraycopy(elementData, 0, newData, 0, elementCount);
        Arrays.sort(newData, c);
        elementData = newData;
    }

    /**
     * 按指定的列逆序排列
     */
    public void sort(String columnName) {
        sort(columnName, "desc", false);
    }

    /**
     * 按指定的列、排序方式（desc或asc）排序
     */
    public void sort(String columnName, String order) {
        sort(columnName, order, false);
    }

    /**
     * 按指定的列、排序方式（desc或asc）排序，如果isNumber为空，则比较大小时先将字段值转化为数值
     */
    public void sort(String columnName, String order, final boolean isNumber) {
        final String cn = columnName;
        final String od = order;
        sort(new Comparator() {
            public int compare(Object obj1, Object obj2) {
                DataRow dr1 = ((Schema) obj1).toDataRow();
                DataRow dr2 = ((Schema) obj2).toDataRow();
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

    /**
     * 使用指定的过滤器过滤掉SchemaSet中的Schema
     */
    public SchemaSet filter(Filter filter) {
        SchemaSet set = this.newInstance();
        for (int i = 0; i < elementCount; i++) {
            if (filter.filter(elementData[i])) {
                set.add((Schema) elementData[i].clone());
            }
        }
        return set;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < elementCount; i++) {
            sb.append(elementData[i] + "\n");
        }
        return sb.toString();
    }

    /**
     * 初始化一个新的SchmeaSet实例，本方法在子类中实现
     */
    protected abstract SchemaSet newInstance();
}
