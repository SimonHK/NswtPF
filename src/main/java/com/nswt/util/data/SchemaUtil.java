package com.nswt.util.data;

/**
 * Created by hongkai on 2017/4/25.
 */

import com.nswt.util.Constant;
import com.nswt.util.LobUtil;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.zip.ZipFile;

/**
 * Schema和SchemaSet操作的工具类<br>
 * 作者: NSWT<br>
 * 日期：2016-7-3<br>
 * 邮件：nswt@nswt.com.cn<br>
 */
public class SchemaUtil {
    /**
     * 删除表中与指定Schema中填充有值的字段的值相同的所有记录
     */
    public static boolean deleteByCondition(Schema conditionSchema) {
        DataAccess dAccess = new DataAccess();
        try {
            return deleteByCondition(conditionSchema, dAccess);
        } finally {
            try {
                dAccess.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 删除表中与指定Schema中填充有值的字段的值相同的所有记录
     */
    public static boolean deleteByCondition(Schema conditionSchema, DataAccess dAccess) {
        SchemaColumn[] columns = conditionSchema.Columns;
        boolean firstFlag = true;
        StringBuffer sb = new StringBuffer(128);
        sb.append("delete from " + conditionSchema.TableCode);
        for (int i = 0; i < columns.length; i++) {
            SchemaColumn sc = columns[i];
            if (!conditionSchema.isNull(sc)) {
                if (firstFlag) {
                    sb.append(" where ");
                    sb.append(sc.getColumnName());
                    sb.append("=?");
                    firstFlag = false;
                } else {
                    sb.append(" and ");
                    sb.append(sc.getColumnName());
                    sb.append("=?");
                }
            }
        }
        Connection conn = dAccess.getConnection();
        PreparedStatement pstmt = null;
        try {
            pstmt = conn.prepareStatement(sb.toString(), ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            for (int i = 0, j = 0; i < columns.length; i++) {
                SchemaColumn sc = columns[i];
                Object v = conditionSchema.getV(sc.getColumnOrder());
                if (v != null) {
                    if (sc.getColumnType() == DataColumn.DATETIME) {
                        pstmt.setDate(j + 1, new java.sql.Date(((java.util.Date) v).getTime()));
                    } else {
                        pstmt.setObject(j + 1, v);
                    }
                    j++;
                }
            }
            pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (pstmt != null) {
                try {
                    pstmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                pstmt = null;
            }
        }
        return true;
    }

    /**
     * 将一个Schema中的每个字段的数据拷贝到另一个Schema的同名字段，如果没有同名字段，则不拷贝<br>
     * 注意：是深层拷贝，不仅仅是拷贝引用
     */
    public static boolean copyFieldValue(Schema srcSchema, Schema destSchema) {
        try {
            SchemaColumn[] srcSC = srcSchema.Columns;
            SchemaColumn[] destSC = destSchema.Columns;
            for (int i = 0; i < srcSC.length; i++) {
                for (int j = 0; j < destSC.length; j++) {
                    if (srcSC[i].getColumnName().equals(destSC[j].getColumnName())) {
                        int order = destSC[j].getColumnOrder();
                        Object v = srcSchema.getV(srcSC[i].getColumnOrder());
                        if (v == null) {
                            destSchema.setV(order, null);
                        } else if (v instanceof Date) {
                            destSchema.setV(order, ((Date) v).clone());
                        } else if (v instanceof Double) {
                            destSchema.setV(order, new Double(((Double) v).doubleValue()));
                        } else if (v instanceof Float) {
                            destSchema.setV(order, new Float(((Float) v).floatValue()));
                        } else if (v instanceof Integer) {
                            destSchema.setV(order, new Integer(((Integer) v).intValue()));
                        } else if (v instanceof Long) {
                            destSchema.setV(order, new Long(((Long) v).longValue()));
                        } else if (v instanceof byte[]) {
                            destSchema.setV(order, ((byte[]) v).clone());
                        } else if (v instanceof String) {
                            destSchema.setV(order, v);
                        }
                        break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    /**
     * 从B表Schema中获得Z表Schema
     */
    public static Schema getZSchemaFromBSchema(Schema bSchema) {
        String TableCode = bSchema.TableCode;
        if (!TableCode.startsWith("BZ")) {
            throw new RuntimeException("必须传入B表的Schema");
        }
        try {
            Class c = Class.forName(bSchema.NameSpace + "." + TableCode.substring(1) + "Schema");
            Schema schema = (Schema) c.newInstance();
            for (int i = 0; i < schema.Columns.length; i++) {
                schema.setV(i, bSchema.getV(i));
            }
            return schema;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 从B表Set中获得Z表Set，注意B表中多条记录转换后可能只有一条Z表记录<br>
     * 会在转换后的记录中去除掉主键相同的多余记录，只保留BackupNo最大的一条记录
     *
     * @since 1.3
     */
    public static SchemaSet getZSetFromBSet(SchemaSet bset) {
        String TableCode = bset.TableCode;
        if (!TableCode.startsWith("BZ")) {
            throw new RuntimeException("必须传入B表的Set");
        }
        try {
            bset.sort("BackupNo", "asc");
            // 得到主键顺序
            ArrayList list = new ArrayList();
            for (int i = 0; i < bset.Columns.length; i++) {
                if (bset.Columns[i].isPrimaryKey() && !bset.Columns[i].getColumnName().equalsIgnoreCase("BackupNo")) {
                    list.add(new Integer(i));
                }
            }
            int[] keys = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                keys[i] = ((Integer) list.get(i)).intValue();
            }
            for (int i = 0; i < bset.size(); i++) {
                // 取出当前行的主键
                Object[] ks = new Object[keys.length];
                for (int j = 0; j < ks.length; j++) {
                    ks[j] = bset.getObject(i).getV(j);
                }
                for (int j = i + 1; j < bset.size();) {
                    boolean flag = true;
                    for (int k = 0; k < keys.length; k++) {
                        if (!bset.getObject(j).getV(keys[k]).equals(ks[k])) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        bset.removeRange(j, 1);
                    } else {
                        j++;
                    }
                }
            }
            Class c = Class.forName(bset.NameSpace + "." + TableCode.substring(1) + "Set");
            Class schemaClass = Class.forName(bset.NameSpace + "." + TableCode.substring(1) + "Schema");
            SchemaSet set = (SchemaSet) c.newInstance();
            for (int j = 0; j < bset.size(); j++) {
                Schema schema = (Schema) schemaClass.newInstance();
                Schema bSchema = bset.getObject(j);
                for (int i = 0; i < schema.Columns.length; i++) {
                    schema.setV(i, bSchema.getV(i));
                }
                set.add(schema);
            }
            return set;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static long BackupNoBase = System.currentTimeMillis();

    /**
     * 获得唯一备份号
     */
    public synchronized static String getBackupNo() {
        return String.valueOf(BackupNoBase++).substring(1);
    }

    /**
     * 为PreparedStatement设置参数
     */
    public static void setParam(SchemaColumn sc, PreparedStatement pstmt, DBConn conn, int i, Object v)
            throws SQLException {
        if (v == null) {
            if (sc.getColumnType() == DataColumn.LONG) {
                pstmt.setNull(i + 1, java.sql.Types.BIGINT);
            } else if (sc.getColumnType() == DataColumn.INTEGER) {
                pstmt.setNull(i + 1, java.sql.Types.INTEGER);
            } else if (sc.getColumnType() == DataColumn.CLOB) {
                if (conn.getDBConfig().isSybase()) {
                    LobUtil.setClob(conn, pstmt, i + 1, "");// Sybase不允许text类型为空
                } else {
                    pstmt.setNull(i + 1, java.sql.Types.CLOB);
                }
            } else if (sc.getColumnType() == DataColumn.DOUBLE) {
                pstmt.setNull(i + 1, java.sql.Types.DOUBLE);
            } else if (sc.getColumnType() == DataColumn.FLOAT) {
                pstmt.setNull(i + 1, java.sql.Types.FLOAT);
            } else if (sc.getColumnType() == DataColumn.DECIMAL) {
                pstmt.setNull(i + 1, java.sql.Types.DECIMAL);
            } else if (sc.getColumnType() == DataColumn.DATETIME) {
                pstmt.setNull(i + 1, java.sql.Types.DATE);
            } else if (sc.getColumnType() == DataColumn.BIT) {
                pstmt.setNull(i + 1, java.sql.Types.BIT);
            } else if (sc.getColumnType() == DataColumn.SMALLINT) {
                pstmt.setNull(i + 1, java.sql.Types.SMALLINT);
            } else {
                pstmt.setNull(i + 1, java.sql.Types.VARCHAR);
            }
        } else {
            if (sc.getColumnType() == DataColumn.DATETIME) {
                pstmt.setTimestamp(i + 1, new java.sql.Timestamp(((java.util.Date) v).getTime()));
            } else if (sc.getColumnType() == DataColumn.CLOB) {
                String str = (String) v;
                if (conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle()) {// Oracle必须特别处理
                    try {
                        str = new String(str.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
                LobUtil.setClob(conn, pstmt, i + 1, str);
            } else if (sc.getColumnType() == DataColumn.BLOB) {
                LobUtil.setBlob(conn, pstmt, i + 1, (byte[]) v);
            } else if (sc.getColumnType() == DataColumn.STRING) {
                String str = (String) v;
                if (conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle()) {// Oracle必须特别处理
                    try {
                        str = new String(str.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                }
                if (conn.getDBConfig().isSybase() && str.equals("")) {
                    pstmt.setNull(i + 1, java.sql.Types.VARCHAR);
                } else {
                    pstmt.setString(i + 1, str);
                }
            } else {
                pstmt.setObject(i + 1, v);
            }
        }
    }

    /**
     * 返回com.nswt.schema下所有Schema类名
     */
    public static String[] getAllSchemaClassName() {
        Class c = null;
        ArrayList list = new ArrayList();
        try {
            c = Class.forName("com.nswt.schema.ZDConfigSchema");
        } catch (ClassNotFoundException e1) {
            e1.printStackTrace();
        }
        String path = c.getResource("ZDConfigSchema.class").getPath();
        if (System.getProperty("os.name").toLowerCase().indexOf("windows") >= 0) {
            if (path.startsWith("/")) {
                path = path.substring(1);
            } else if (path.startsWith("file:/")) {
                path = path.substring(6);
            }
        } else {
            if (path.startsWith("file:/")) {
                path = path.substring(5);
            }
        }
        path = path.replaceAll("%20", " ");
        if (path.toLowerCase().indexOf(".jar!") > 0) {
            try {
                path = path.substring(0, path.indexOf(".jar!") + 4);
                ZipFile z = new ZipFile(path);
                //z.getEntries();早期版本方法
                Enumeration all = z.entries();
                while (all.hasMoreElements()) {
                    String name = all.nextElement().toString();
                    if (name.startsWith("com.nswt.schema.")) {
                        list.add(name);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            File p = new File(path.substring(0, path.toLowerCase().indexOf("zdconfigschema.class")));
            File[] fs = p.listFiles();
            for (int i = 0; i < fs.length; i++) {
                if (fs[i].getName().endsWith("Schema.class")) {
                    list.add("com/nswt/schema/" + fs[i].getName());
                }
            }
        }
        String[] arr = new String[list.size()];
        for (int i = 0; i < list.size(); i++) {
            String name = (String) list.get(i);
            name = name.replaceAll("\\/", ".");
            name = name.substring(0, name.length() - 6);// 去掉.class
            arr[i] = name;
        }
        return arr;
    }

    /**
     * 根据表名获得相应的Schema实例
     */
    public static Schema findSchema(String tableName) {
        String[] arr = getAllSchemaClassName();
        for (int i = 0; i < arr.length; i++) {
            String name = arr[i].toLowerCase();
            if (name.endsWith("." + tableName.toLowerCase() + "schema")) {
                try {
                    return (Schema) Class.forName(arr[i]).newInstance();
                } catch (InstantiationException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    /**
     * 根据表名和字段名返回字段描述信息
     */
    public static SchemaColumn findColumn(String tableName, String columnName) {
        Schema schema = findSchema(tableName);
        return findColumn(schema.Columns, columnName);
    }

    /**
     * 从字段描述类数组中返回指定字段的描述信息
     */
    public static SchemaColumn findColumn(SchemaColumn[] scs, String columnName) {
        for (int i = 0; i < scs.length; i++) {
            if (scs[i].getColumnName().equalsIgnoreCase(columnName)) {
                return scs[i];
            }
        }
        return null;
    }

    /**
     * 从一组字段描述中返回是主键的字段的名称列表
     */
    public static ArrayList getPrimaryKeyColumns(SchemaColumn[] scs) {
        ArrayList list = new ArrayList();
        for (int i = 0; i < scs.length; i++) {
            if (scs[i].isPrimaryKey()) {
                list.add(scs[i].getColumnName());
            }
        }
        return list;
    }

    /**
     * 获得表代码，主要是提供给框架中的其他类使用，因为Schmea.TableCode被protected修饰
     */
    public static String getTableCode(Schema schema) {
        return schema.TableCode;
    }

    public static String getNameSpace(Schema schema) {
        return schema.NameSpace;
    }

    public static SchemaColumn[] getColumns(Schema schema) {
        return schema.Columns;
    }

    public static String getTableCode(SchemaSet set) {
        return set.TableCode;
    }

    public static String getNameSpace(SchemaSet set) {
        return set.NameSpace;
    }

    public static SchemaColumn[] getColumns(SchemaSet set) {
        return set.Columns;
    }
}
