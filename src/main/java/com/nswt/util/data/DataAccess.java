package com.nswt.util.data;


import com.nswt.util.Constant;
import com.nswt.util.LobUtil;
import com.nswt.util.config.Config;
import com.nswt.util.log.LogUtil;

import java.io.UnsupportedEncodingException;
import java.sql.*;
import java.util.ArrayList;
import java.util.Date;

public class DataAccess {
    protected DBConn conn;

    public DataAccess() {

    }

    public DataAccess(DBConn conn) {
        this.conn = conn;
    }

    public DBConn getConnection() {
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        return conn;
    }

    public void setAutoCommit(boolean bCommit) throws SQLException {
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        this.conn.setAutoCommit(bCommit);
    }

    public void commit() throws SQLException {
        if (conn == null) {
            return;
        }
        this.conn.commit();
    }

    public void rollback() throws SQLException {
        if (conn == null) {
            return;
        }
        this.conn.rollback();
    }

    public void close() throws SQLException {
        if (conn == null || conn == BlockingTransaction.getCurrentThreadConnection()) {
            return;
        }
        this.conn.close();
    }

    public static void setParams(PreparedStatement stmt, QueryBuilder qb, DBConn conn) throws SQLException {
        // qb.checkParams();
        ArrayList batches = null;
        if (qb.isBatchMode()) {// 批量模式，以提高性能
            batches = qb.getBatches();
            for (int k = 0; k < batches.size(); k++) {
                ArrayList list = (ArrayList) batches.get(k);
                for (int i = 1; i <= list.size(); i++) {
                    Object o = list.get(i - 1);
                    if (o == null) {
                        stmt.setNull(i, java.sql.Types.VARCHAR);
                    } else if (o instanceof Byte) {
                        stmt.setByte(i, ((Byte) o).byteValue());
                    } else if (o instanceof Short) {
                        stmt.setShort(i, ((Short) o).shortValue());
                    } else if (o instanceof Integer) {
                        stmt.setInt(i, ((Integer) o).intValue());
                    } else if (o instanceof Long) {
                        stmt.setLong(i, ((Long) o).longValue());
                    } else if (o instanceof Float) {
                        stmt.setFloat(i, ((Float) o).floatValue());
                    } else if (o instanceof Double) {
                        stmt.setDouble(i, ((Double) o).doubleValue());
                    } else if (o instanceof Date) {
                        stmt.setTimestamp(i, new java.sql.Timestamp(((java.util.Date) o).getTime()));
                    } else if (o instanceof String) {
                        String str = (String) o;
                        if (conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle()) {// Oracle必须特别处理
                            try {
                                str = new String(str.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                            } catch (UnsupportedEncodingException e) {
                                e.printStackTrace();
                            }
                        }
                        stmt.setString(i, str);
                    } else if (o instanceof Clob) {
                        LobUtil.setClob(conn, stmt, i, o);
                    } else if (o instanceof byte[]) {
                        LobUtil.setBlob(conn, stmt, i, (byte[]) o);
                    } else {
                        stmt.setObject(i, o);
                    }
                }
                stmt.addBatch();
            }
        } else {
            ArrayList list = qb.getParams();
            for (int i = 1; i <= list.size(); i++) {
                Object o = list.get(i - 1);
                if (o == null) {
                    stmt.setNull(i, java.sql.Types.VARCHAR);
                } else if (o instanceof Byte) {
                    stmt.setByte(i, ((Byte) o).byteValue());
                } else if (o instanceof Short) {
                    stmt.setShort(i, ((Short) o).shortValue());
                } else if (o instanceof Integer) {
                    stmt.setInt(i, ((Integer) o).intValue());
                } else if (o instanceof Long) {
                    stmt.setLong(i, ((Long) o).longValue());
                } else if (o instanceof Float) {
                    stmt.setFloat(i, ((Float) o).floatValue());
                } else if (o instanceof Double) {
                    stmt.setDouble(i, ((Double) o).doubleValue());
                } else if (o instanceof Date) {
                    stmt.setTimestamp(i, new java.sql.Timestamp(((java.util.Date) o).getTime()));
                } else if (o instanceof String) {
                    String str = (String) o;
                    if (conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle()) {// Oracle必须特别处理
                        try {
                            str = new String(str.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                        } catch (UnsupportedEncodingException e) {
                            e.printStackTrace();
                        }
                        // } else if (conn.getDBConfig().isSybase() &&
                        // StringUtil.isDigit(str) && str.length() > 2) {
                        // stmt.setObject(i, str, Types.BIGINT);
                    } else {
                        stmt.setString(i, str);
                    }
                } else if (o instanceof Clob) {
                    LobUtil.setClob(conn, stmt, i, o);
                } else if (o instanceof byte[]) {
                    LobUtil.setBlob(conn, stmt, i, (byte[]) o);
                } else {
                    stmt.setObject(i, o);
                }
            }
        }
    }

    public DataTable executeDataTable(QueryBuilder qb) throws SQLException {
        long current = System.currentTimeMillis();
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        PreparedStatement stmt = null;
        ResultSet rs = null;
        DataTable dt = null;
        try {
            String sql = qb.getSQL();
            boolean latin1Flag = conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle();
            if (latin1Flag) {
                try {
                    sql = new String(sql.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            stmt = conn.prepareStatement(sql, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            setParams(stmt, qb, conn);
            rs = stmt.executeQuery();
            dt = new DataTable(rs, latin1Flag);
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                    rs = null;
                }
                if (stmt != null) {
                    stmt.close();
                    stmt = null;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            if (Config.isDebugLoglevel()) {
                long time = System.currentTimeMillis() - current;
                LogUtil.info(time + "ms\t" + qb.toString());
            }
        }
        return dt;
    }

    /**
     * 必须考虑同一个QueryBuilder，多次executePagedDataTable()的情况
     */
    public DataTable executePagedDataTable(QueryBuilder qb, int pageSize, int pageIndex) throws SQLException {
        long current = System.currentTimeMillis();
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        if (pageSize < 1) {
            pageSize = Integer.MAX_VALUE;
        }
        if (pageIndex < 0) {
            pageIndex = 0;
        }
        String pageSQL = getPagedSQL(conn, qb, pageSize, pageIndex);
        PreparedStatement stmt = null;
        ResultSet rs = null;
        DataTable dt = null;
        try {
            boolean latin1Flag = conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle();
            if (latin1Flag) {
                try {
                    pageSQL = new String(pageSQL.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            stmt = conn.prepareStatement(pageSQL, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            setParams(stmt, qb, conn);
            rs = stmt.executeQuery();
            if (conn.getDBConfig().isSQLServer2000()) {
                dt = new DataTable(rs, pageSize, pageIndex, latin1Flag);
            } else {
                dt = new DataTable(rs, latin1Flag);
                if (conn.getDBConfig().isOracle() || conn.getDBConfig().isDB2() || conn.getDBConfig().isSQLServer()
                        || conn.getDBConfig().isSybase()) {
                    dt.deleteColumn(dt.getColCount() - 1);
                }
            }
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
        } finally {
            try {
                // 必须清除后两项参数，以便QueryBuilder能够继续执行executePagedDataTable()
                if (!conn.getDBConfig().isSQLServer2000() && !conn.getDBConfig().isSybase()) {
                    qb.getParams().remove(qb.getParams().size() - 1);
                    qb.getParams().remove(qb.getParams().size() - 1);
                }
                if (rs != null) {
                    rs.close();
                    rs = null;
                }
                if (stmt != null) {
                    stmt.close();
                    stmt = null;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            if (Config.isDebugLoglevel()) {
                long time = System.currentTimeMillis() - current;
                LogUtil.info(time + "ms\t" + pageSQL + " " + pageIndex + "," + pageSize);
            }
        }
        return dt;
    }

    public static String getPagedSQL(DBConn conn, QueryBuilder qb, int pageSize, int pageIndex) {
        StringBuffer sb = new StringBuffer();
        int start = pageIndex * pageSize;
        int end = (pageIndex + 1) * pageSize;
        if (conn.getDBConfig().isOracle()) {
            sb.append("select * from (select rs.*,rownum rnm from (");
            sb.append(qb.getSQL());
            sb.append(") rs where rownum <= ?) rss where rnm > ?");
            qb.add(end);
            qb.add(start);
        } else if (conn.getDBConfig().isDB2()) {
            sb.append("select * from (select rs.*,rownumber() OVER () rnm from (");
            sb.append(qb.getSQL());
            sb.append(") rs) rss WHERE rnm BETWEEN ? and ?");
            qb.add(start + 1);
            qb.add(end);
        } else if (conn.getDBConfig().isSQLServer() || conn.getDBConfig().isSybase()) {
            String sql = qb.getSQL();
            SelectSQLParser sp = new SelectSQLParser();
            try {
                sp.setSQL(sql);
                sp.parse();
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (conn.getDBConfig().isSQLServer()) {
                sb.append(sp.getMSSQLPagedSQL());
                qb.add(start + 1);
                qb.add(end);
            } else {
                sb.append(sp.getSybasePagedSQL(pageSize, pageIndex, conn.ConnID));
            }
        } else if (conn.getDBConfig().isSQLServer2000()) {
            sb.append(qb.getSQL());
        } else if (conn.getDBConfig().isMysql()) {
            sb.append(qb.getSQL());
            sb.append(" limit ?,?");
            qb.add(start);
            qb.add(pageSize);
        }
        return sb.toString();
    }

    public int getCount(QueryBuilder qb) throws SQLException {
        QueryBuilder cqb = new QueryBuilder();
        cqb.setParams((ArrayList) qb.getParams().clone());
        String sql = qb.getSQL();
        int index1 = sql.lastIndexOf(")");
        int index2 = sql.toLowerCase().lastIndexOf("order by");
        if (index2 > index1) {
            sql = sql.substring(0, index2);
        }
        cqb.setSQL("select count(1) from (" + sql + ") t1");
        return Integer.parseInt(executeOneValue(cqb).toString());
    }

    public Object executeOneValue(QueryBuilder qb) throws SQLException {
        long current = System.currentTimeMillis();
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        PreparedStatement stmt = null;
        ResultSet rs = null;
        Object t = null;
        try {
            String sql = qb.getSQL();
            boolean latin1Flag = conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle();
            if (latin1Flag) {
                try {
                    sql = new String(sql.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            stmt = conn.prepareStatement(sql, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            setParams(stmt, qb, conn);
            rs = stmt.executeQuery();
            if (rs.next()) {
                t = rs.getObject(1);
                if (t instanceof Clob) {
                    t = LobUtil.clobToString((Clob) t);
                }
                if (t instanceof Blob) {
                    t = LobUtil.blobToBytes((Blob) t);
                }
            }
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                    rs = null;
                }
                if (stmt != null) {
                    stmt.close();
                    stmt = null;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            if (Config.isDebugLoglevel()) {
                long time = System.currentTimeMillis() - current;
                LogUtil.info(time + "ms\t" + qb.toString());
            }
        }
        return t;
    }

    public int executeNoQuery(QueryBuilder qb) throws SQLException {
        long current = System.currentTimeMillis();
        if (conn == null) {
            conn = DBConnPool.getConnection();
        }
        PreparedStatement stmt = null;
        int t = -1;
        try {
            String sql = qb.getSQL();
            if (conn.getDBConfig().isLatin1Charset && conn.getDBConfig().isOracle()) {
                try {
                    sql = new String(sql.getBytes(Constant.GlobalCharset), "ISO-8859-1");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            stmt = conn.prepareStatement(sql, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            setParams(stmt, qb, conn);
            if (qb.isBatchMode()) {
                stmt.executeBatch();
            } else {
                t = stmt.executeUpdate();
            }
            conn.setLastSuccessExecuteTime(System.currentTimeMillis());
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                    stmt = null;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            if (Config.isDebugLoglevel()) {
                long time = System.currentTimeMillis() - current;
                LogUtil.info(time + "ms\t" + qb.toString());
            }
        }
        return t;
    }

    public void insert(Schema schema) {
        schema.setDataAccess(this);
        schema.insert();
    }

    public void update(Schema schema) {
        schema.setDataAccess(this);
        schema.update();
    }

    public void delete(Schema schema) {
        schema.setDataAccess(this);
        schema.delete();
    }

    public void deleteAndBackup(Schema schema) {
        schema.setDataAccess(this);
        schema.deleteAndBackup();
    }

    public void deleteAndInsert(Schema schema) {
        schema.setDataAccess(this);
        schema.deleteAndInsert();
    }

    public void insert(SchemaSet set) {
        set.setDataAccess(this);
        set.insert();
    }

    public void update(SchemaSet set) {
        set.setDataAccess(this);
        set.update();
    }

    public void delete(SchemaSet set) {
        set.setDataAccess(this);
        set.delete();
    }

    public void deleteAndBackup(SchemaSet set) {
        set.setDataAccess(this);
        set.deleteAndBackup();
    }

    public void deleteAndInsert(SchemaSet set) {
        set.setDataAccess(this);
        set.deleteAndInsert();
    }
}
