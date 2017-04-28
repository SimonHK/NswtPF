package com.nswt.util.data;


import com.nswt.util.Mapx;
import com.nswt.util.config.Config;
import com.nswt.util.data.nativejdbc.CommonsDbcpNativeJdbcExtractor;
import com.nswt.util.data.nativejdbc.JBossNativeJdbcExtractor;
import com.nswt.util.data.nativejdbc.WebLogicNativeJdbcExtractor;
import com.nswt.util.data.nativejdbc.WebSphereNativeJdbcExtractor;
import org.apache.commons.lang.ArrayUtils;

import java.sql.*;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.Executor;

public class DBConn implements Connection {
    protected boolean LongTimeFlag = false;

    protected Connection Conn;

    protected long LastApplyTime;

    protected boolean isUsing = false;

    protected String CallerString = null;

    protected int ConnID = 0;

    protected long LastWarnTime;// 上次警告时间'

    protected long LastSuccessExecuteTime = System.currentTimeMillis();

    protected boolean isBlockingTransactionStarted;// 是否处于阻塞型事务之中

    protected DBConnConfig DBConfig;

    protected DBConn() {
    }

    public Connection getPhysicalConnection() {
        if (DBConfig.isJNDIPool) {
            try {
                if (Config.isTomcat()) {
                    return CommonsDbcpNativeJdbcExtractor.doGetNativeConnection(Conn);
                } else if (Config.isWeblogic()) {
                    return WebLogicNativeJdbcExtractor.doGetNativeConnection(Conn);
                } else if (Config.isWebSphere()) {
                    return WebSphereNativeJdbcExtractor.doGetNativeConnection(Conn);
                } else {// JBOSS
                    return JBossNativeJdbcExtractor.doGetNativeConnection(Conn);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return Conn;
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getHoldability()
     */
    public int getHoldability() throws SQLException {
        return Conn.getHoldability();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getTransactionIsolation()
     */
    public int getTransactionIsolation() throws SQLException {
        return Conn.getTransactionIsolation();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#clearWarnings()
     */
    public void clearWarnings() throws SQLException {
        Conn.clearWarnings();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#close()
     */
    public void close() throws SQLException {// 不真正关闭连接
        isUsing = false;
        LastApplyTime = 0;
        setAutoCommit(true);
        removeConnID(ConnID);
        if (DBConfig.isJNDIPool) {
            this.Conn.close();
        }
    }

    public void closeReally() throws SQLException {// 真正关闭
        DBConnPoolImpl pool = (DBConnPoolImpl) DBConnPool.PoolMap.get(DBConfig.DBName + ".");
        removeConnID(ConnID);
        if (pool != null) {
            ArrayUtils.removeElement(pool.conns, this);
        }
        Conn.close();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#commit()
     */
    public void commit() throws SQLException {
        if(!Conn.getAutoCommit()){
            Conn.commit();
        }
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#rollback()
     */
    public void rollback() throws SQLException {
        Conn.rollback();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getAutoCommit()
     */
    public boolean getAutoCommit() throws SQLException {
        return Conn.getAutoCommit();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#isClosed()
     */
    public boolean isClosed() throws SQLException {
        return Conn.isClosed();// 总是处于打开状态
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#isReadOnly()
     */
    public boolean isReadOnly() throws SQLException {
        return Conn.isReadOnly();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setHoldability(int)
     */
    public void setHoldability(int holdability) throws SQLException {
        Conn.setHoldability(holdability);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setTransactionIsolation(int)
     */
    public void setTransactionIsolation(int level) throws SQLException {
        Conn.setTransactionIsolation(level);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setAutoCommit(boolean)
     */
    public void setAutoCommit(boolean autoCommit) throws SQLException {
        if (Conn.getAutoCommit() != autoCommit) {
            Conn.setAutoCommit(autoCommit);
            // 避免Sybase下多次调用setAutoCommit出现SET CHAINED command not allowed
            // within multi-statement transaction的错误
        }
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setReadOnly(boolean)
     */
    public void setReadOnly(boolean readOnly) throws SQLException {
        Conn.setReadOnly(readOnly);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getCatalog()
     */
    public String getCatalog() throws SQLException {
        return Conn.getCatalog();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setCatalog(java.lang.String)
     */
    public void setCatalog(String catalog) throws SQLException {
        Conn.setCatalog(catalog);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getMetaData()
     */
    public DatabaseMetaData getMetaData() throws SQLException {
        return Conn.getMetaData();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getWarnings()
     */
    public SQLWarning getWarnings() throws SQLException {
        return Conn.getWarnings();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setSavepoint()
     */
    public Savepoint setSavepoint() throws SQLException {
        return Conn.setSavepoint();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#releaseSavepoint(java.sql.Savepoint)
     */
    public void releaseSavepoint(Savepoint savepoint) throws SQLException {
        Conn.releaseSavepoint(savepoint);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#rollback(java.sql.Savepoint)
     */
    public void rollback(Savepoint savepoint) throws SQLException {
        Conn.rollback(savepoint);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#createStatement()
     */
    public Statement createStatement() throws SQLException {
        return Conn.createStatement();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#createStatement(int, int)
     */
    public Statement createStatement(int resultSetType, int resultSetConcurrency) throws SQLException {
        return Conn.createStatement(resultSetType, resultSetConcurrency);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#createStatement(int, int, int)
     */
    public Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability)
            throws SQLException {
        return Conn.createStatement(resultSetType, resultSetConcurrency, resultSetHoldability);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#getTypeMap()
     */
    public Map getTypeMap() throws SQLException {
        return Conn.getTypeMap();
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setTypeMap(java.util.Map)
     */
    public void setTypeMap(Map map) throws SQLException {
        Conn.setTypeMap(map);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#nativeSQL(java.lang.String)
     */
    public String nativeSQL(String sql) throws SQLException {
        return Conn.nativeSQL(sql);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareCall(java.lang.String)
     */
    public CallableStatement prepareCall(String sql) throws SQLException {
        return Conn.prepareCall(sql);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareCall(java.lang.String, int, int)
     */
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency) throws SQLException {
        return Conn.prepareCall(sql, resultSetType, resultSetConcurrency);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareCall(java.lang.String, int, int, int)
     */
    public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency,
                                         int resultSetHoldability) throws SQLException {
        return Conn.prepareCall(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String)
     */
    public PreparedStatement prepareStatement(String sql) throws SQLException {
        return Conn.prepareStatement(sql);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String, int)
     */
    public PreparedStatement prepareStatement(String sql, int autoGeneratedKeys) throws SQLException {
        return Conn.prepareStatement(sql, autoGeneratedKeys);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String, int, int)
     */
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency)
            throws SQLException {
        return Conn.prepareStatement(sql, resultSetType, resultSetConcurrency);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String, int, int,
     * int)
     */
    public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency,
                                              int resultSetHoldability) throws SQLException {
        return Conn.prepareStatement(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String, int[])
     */
    public PreparedStatement prepareStatement(String sql, int[] columnIndexes) throws SQLException {
        return Conn.prepareStatement(sql, columnIndexes);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#setSavepoint(java.lang.String)
     */
    public Savepoint setSavepoint(String name) throws SQLException {
        return Conn.setSavepoint(name);
    }

    /*
     * （非 Javadoc）
     *
     * @see java.sql.Connection#prepareStatement(java.lang.String,
     * java.lang.String[])
     */
    public PreparedStatement prepareStatement(String sql, String[] columnNames) throws SQLException {
        return Conn.prepareStatement(sql, columnNames);
    }

    public long getLastSuccessExecuteTime() {
        return LastSuccessExecuteTime;
    }

    public void setLastSuccessExecuteTime(long lastSuccessExecuteTime) {
        LastSuccessExecuteTime = lastSuccessExecuteTime;
    }

    public DBConnConfig getDBConfig() {
        return DBConfig;
    }

    public void setPoolName(DBConnConfig dbcc) {
        DBConfig = dbcc;
    }

    /**
     * 兼容1.2以前的写法
     *
     * @deprecated
     */
    public String getDBType() {
        return DBConfig.DBType;
    }

    private static Mapx IDMap = new Mapx();

    private static Object mutex = new Object();

    /**
     * 连接的唯一ID，有些数据库例如Sybase需要根据这个清除临时表
     */
    public static int getConnID() {
        synchronized (mutex) {
            for (int i = 1; i <= 2000; i++) {// 最多2000个连接
                if (!IDMap.containsKey(i + "")) {
                    IDMap.put(i + "", "1");
                    return i;
                }
            }
        }
        return 0;
    }

    public static void removeConnID(int id) {
        synchronized (mutex) {
            IDMap.remove(id + "");
        }
    }

    public Array createArrayOf(String arg0, Object[] arg1) throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public Blob createBlob() throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public Clob createClob() throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public NClob createNClob() throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public SQLXML createSQLXML() throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public Struct createStruct(String arg0, Object[] arg1) throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setSchema(String schema) throws SQLException {

    }

    @Override
    public String getSchema() throws SQLException {
        return null;
    }

    @Override
    public void abort(Executor executor) throws SQLException {

    }

    @Override
    public void setNetworkTimeout(Executor executor, int milliseconds) throws SQLException {

    }

    @Override
    public int getNetworkTimeout() throws SQLException {
        return 0;
    }

    public Properties getClientInfo() throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public String getClientInfo(String arg0) throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }

    public boolean isValid(int arg0) throws SQLException {
        // TODO Auto-generated method stub
        return false;
    }

    public void setClientInfo(Properties arg0) throws SQLClientInfoException {
        // TODO Auto-generated method stub

    }

    public void setClientInfo(String arg0, String arg1)
            throws SQLClientInfoException {
        // TODO Auto-generated method stub

    }

    public boolean isWrapperFor(Class arg0) throws SQLException {
        // TODO Auto-generated method stub
        return false;
    }

    public Object unwrap(Class arg0) throws SQLException {
        // TODO Auto-generated method stub
        return null;
    }
}
