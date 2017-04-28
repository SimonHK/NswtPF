package com.nswt.util.data;

import com.nswt.util.Constant;
import com.nswt.util.Mapx;
import com.nswt.util.StringUtil;
import com.nswt.util.config.Config;
import com.nswt.util.log.LogUtil;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;
import java.sql.*;
import java.util.Hashtable;
import java.util.Properties;

/**
 * Created by hongkai on 2017/4/25.
 */

public class DBConnPoolImpl {
    private DBConnConfig dcc;

    protected DBConn[] conns;

    public DBConnPoolImpl(String poolName) {
        this.dcc = new DBConnConfig();
        dcc.PoolName = poolName;
    }

    public DBConnPoolImpl(DBConnConfig config) {
        this.dcc = config;
        if (DBConnPool.getPoolMap().get(dcc.PoolName + ".") != null) {
            throw new RuntimeException("连接池序列中己存在名为" + dcc.PoolName + "的连接池，不能覆盖！");
        }
        DBConnPool.getPoolMap().put(dcc.PoolName + ".", this);
        fillInitConn();
    }

    private void fillInitConn() {
        if (!dcc.isJNDIPool) {
            conns = new DBConn[dcc.MaxConnCount];
            try {
                for (int i = 0; i < dcc.InitConnCount; i++) {
                    conns[i] = createConnection(dcc, false);
                    conns[i].isUsing = false;
                }
                dcc.ConnCount = dcc.InitConnCount;
                LogUtil.getLogger().warn("----" + dcc.PoolName + "成功初始化" + dcc.InitConnCount + "个连接");
            } catch (Exception e) {
                LogUtil.getLogger().warn("----" + dcc.PoolName + "初始化连接失败");
                e.printStackTrace();
            }
        }
    }

    public DBConn[] getDBConns() {
        return conns;
    }

    public void clear() {
        if (conns == null) {
            return;
        }
        for (int i = 0; i < conns.length; i++) {
            if (conns[i] != null) {
                try {
                    conns[i].Conn.close();
                    conns[i] = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        dcc.ConnCount = 0;
    }

    public String getDBType() {
        return dcc.DBType;
    }

    public DBConnConfig getDBConnConfig() {
        return dcc;
    }

    public void init() {
        init(dcc, Config.getMapx());
        fillInitConn();
    }

    public static void init(DBConnConfig dcc, Mapx map) {
        if (dcc.DBType != null) {
            return;
        }
        dcc.DBType = map.getString("Database." + dcc.PoolName + "Type");
        dcc.JNDIName = map.getString("Database." + dcc.PoolName + "JNDIName");
        dcc.isLatin1Charset = "true".equalsIgnoreCase(map.getString("Database." + dcc.PoolName + "isLatin1Charset"));
        if (StringUtil.isNotEmpty(dcc.JNDIName)) {
            dcc.isJNDIPool = true;
        } else {
            dcc.DBServerAddress = map.getString("Database." + dcc.PoolName + "ServerAddress");
            dcc.DBName = map.getString("Database." + dcc.PoolName + "Name");
            dcc.DBUserName = map.getString("Database." + dcc.PoolName + "UserName");
            dcc.DBPassword = map.getString("Database." + dcc.PoolName + "Password");
            dcc.TestTable = map.getString("Database." + dcc.PoolName + "TestTable");
            if (dcc.DBType == null || dcc.DBType.equals("")) {
                throw new RuntimeException("缺少配置项DB.Type");
            }
            if (dcc.DBServerAddress == null || dcc.DBServerAddress.equals("")) {
                throw new RuntimeException("缺少配置项DB.ServerAddress");
            }
            if (dcc.DBName == null || dcc.DBName.equals("")) {
                throw new RuntimeException("缺少配置项DB.Name");
            }
            if (dcc.DBUserName == null || dcc.DBUserName.equals("")) {
                throw new RuntimeException("缺少配置项DB.UserName");
            }
            if (dcc.DBPassword == null) {// 可能为空
                throw new RuntimeException("缺少配置项DB.Password");
            }
            String s = map.getString("Database." + dcc.PoolName + "InitConnCount");
            try {
                dcc.InitConnCount = Integer.parseInt(s);
            } catch (NumberFormatException e) {
                dcc.InitConnCount = 0;
                LogUtil.getLogger().warn("配置项DB.InitConnCount错误," + s + "不是有效的整数，该配置项将采用默认值0!");
            }
            s = map.getString("Database." + dcc.PoolName + "MaxConnCount");
            try {
                dcc.MaxConnCount = Integer.parseInt(s);
            } catch (NumberFormatException e) {
                dcc.MaxConnCount = 20;
                LogUtil.getLogger().warn("配置项DB.MaxConnCount错误," + s + "不是有效的整数,该配置项将采用默认值20!");
            }
            s = map.getString("Database." + dcc.PoolName + "Port");
            try {
                dcc.DBPort = Integer.parseInt(s);
            } catch (NumberFormatException e) {
                dcc.DBPort = getDefaultPort(dcc);
                LogUtil.getLogger().warn("配置项DB.Port错误," + s + "不是有效的整数，该配置项将采用默认值!");
            }
        }
    }

    public DBConn getConnection() {
        return getConnection(false);
    }

    public DBConn getConnection(boolean bLongTimeFlag) {
        if (dcc.DBType == null) {
            init();
        }
        if (dcc.isJNDIPool) {
            return getJNDIPoolConnection(dcc);
        }
        long now = System.currentTimeMillis();
        DBConn conn = null;
        synchronized (this) {
            for (int i = 0; i < dcc.ConnCount; i++) {
                conn = conns[i];
                if (conn.isUsing) {
                    if (!conn.LongTimeFlag) {
                        if (now - conn.LastSuccessExecuteTime > dcc.MaxConnUsingTime) {
                            LogUtil.error(dcc.PoolName + ":检测到连接使用超时，程序可能存在连接池泄漏，将自动关闭连接。以下是调用堆栈:");
                            LogUtil.error(conn.CallerString);
                            try {
                                if (!conn.Conn.getAutoCommit()) {
                                    conn.Conn.rollback();
                                }
                                conn.Conn.close();// 先关闭，再创建新的
                            } catch (SQLException e) {
                                e.printStackTrace();
                            } finally {
                                try {
                                    conn = createConnection(dcc, bLongTimeFlag);
                                    conns[i] = conn;
                                    LogUtil.info(dcc.PoolName + ":创建新连接，总数：" + dcc.ConnCount);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                    throw new RuntimeException("DBConnPoolImpl," + dcc.PoolName + ":创建连接失败!");
                                }
                            }
                        }
                    } else if (now - conn.LastSuccessExecuteTime > 4 * dcc.MaxConnUsingTime
                            && now - conn.LastWarnTime > 300000) {
                        LogUtil.getLogger()
                                .warn(dcc.PoolName + ":检测到连接长时间使用，共使用了" + (now - conn.LastSuccessExecuteTime)
                                        + "毫秒。以下是调用堆栈:");
                        LogUtil.warn(conn.CallerString);
                        conn.LastWarnTime = now;
                    }
                } else if (!conn.isBlockingTransactionStarted) {// 阻塞型不可用
                    conn.LongTimeFlag = bLongTimeFlag;
                    conn.isUsing = true;
                    conn.LastApplyTime = now;
                    setCaller(conn);
                    // 检查连接是否己失效，若己失效则重新连接
                    if (System.currentTimeMillis() - conn.getLastSuccessExecuteTime() > dcc.RefershPeriod) {
                        DataAccess dAccess = new DataAccess(conn);
                        try {
                            dAccess.executeOneValue(new QueryBuilder("select 1 from " + dcc.TestTable + " where 1=2"));
                        } catch (Exception e) {
                            try {
                                conn.Conn.close();
                            } catch (SQLException e1) {
                            }
                            try {
                                conn.Conn = createConnection(dcc, bLongTimeFlag).Conn;
                            } catch (Exception e1) {
                                LogUtil.error(dcc.PoolName + ":连接失效重连时发生错误:" + e1.getMessage());
                            }
                        }
                    }
                    return conn;
                }
            }
            if (dcc.ConnCount < dcc.MaxConnCount) {
                try {
                    conn = createConnection(dcc, bLongTimeFlag);
                    conns[dcc.ConnCount] = conn;
                    dcc.ConnCount++;
                    LogUtil.info(dcc.PoolName + ":创建新连接，总数：" + dcc.ConnCount);
                    setCaller(conn);
                    return conn;
                } catch (Exception e) {
                    e.printStackTrace();
                    throw new RuntimeException("DBConnPoolImpl," + dcc.PoolName + ":创建连接失败!");
                }
            } else {
                throw new RuntimeException("DBConnPoolImpl," + dcc.PoolName + ":所有连接都在使用，无法分配连接!");
            }
        }
    }

    public static DBConn getJNDIPoolConnection(DBConnConfig dbcc) {
        int connID = DBConn.getConnID();
        try {
            Context ctx = new InitialContext();
            Connection conn = null;
            if (Config.isTomcat()) {
                ctx = (Context) ctx.lookup("java:comp/env");
                DataSource ds = (DataSource) ctx.lookup(dbcc.JNDIName);
                conn = ds.getConnection();
            } else if (Config.isJboss()) {
                Hashtable environment = new Hashtable();
                environment.put(Context.INITIAL_CONTEXT_FACTORY, "org.jnp.interfaces.NamingContextFactory");
                environment.put(Context.URL_PKG_PREFIXES, "org.jboss.naming.client ");
                environment.put(Context.PROVIDER_URL, "jnp://127.0.0.1:1099");
                ctx = new InitialContext(environment);
                DataSource ds = (DataSource) ctx.lookup("java:" + dbcc.JNDIName);
                conn = ds.getConnection();
            } else {
                DataSource ds = (DataSource) ctx.lookup(dbcc.JNDIName);
                conn = ds.getConnection();
            }
            if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.ORACLE)) {
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("alter session set nls_date_format = 'YYYY-MM-DD HH24:MI:SS'");
                stmt.close();
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.MYSQL)) {
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("SET NAMES '" + Constant.GlobalCharset.replaceAll("\\-", "").toLowerCase() + "'");
                stmt.close();
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.SYBASE)) {
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("set textsize 20971520");// 防止text字段超32K后，32K之后的部分不能取出来
                stmt.execute("drop table #tmp_z_" + connID);// 防止text字段超32K后，32K之后的部分不能取出来
                stmt.close();
            }
            DBConn dbconn = new DBConn();
            dbconn.Conn = conn;
            dbconn.DBConfig = dbcc;
            dbconn.ConnID = connID;
            return dbconn;
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.warn("查找JNDI连接池失败!" + e.getMessage());
            DBConn.removeConnID(connID);
        }
        return null;
    }

    public static DBConn createConnection(DBConnConfig dbcc, boolean bLongTimeFlag) throws Exception {
        Connection conn = null;
        if (dbcc.isJNDIPool) {
            return getJNDIPoolConnection(dbcc);
        } else {
            // 判定数据库类型
            if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.ORACLE)) {
                Class.forName("oracle.jdbc.driver.OracleDriver");
                Properties props = new Properties();
                props.setProperty("user", dbcc.DBUserName);
                props.setProperty("password", dbcc.DBPassword);
                props.setProperty("oracle.jdbc.V8Compatible", "true");// oracle10g
                // date类型丢失时间精度
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), props);
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("alter session set nls_date_format = 'YYYY-MM-DD HH24:MI:SS'");
                stmt.close();
            } else if (dbcc.DBType.equalsIgnoreCase("INFORMIX")) {
                Class.forName("com.informix.jdbc.IfxDriver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc));
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.MSSQL)) {
                Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), dbcc.DBUserName, dbcc.DBPassword);
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.DB2)) {
                Class.forName("com.ibm.db2.jcc.DB2Driver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), dbcc.DBUserName, dbcc.DBPassword);
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.SYBASE)) {
                Class.forName("com.sybase.jdbc3.jdbc.SybDriver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), dbcc.DBUserName, dbcc.DBPassword);
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("set textsize 20971520");// 防止text字段超32K后，32K之后的部分不能取出来
                stmt.close();
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.MYSQL)) {
                Class.forName("com.mysql.jdbc.Driver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), dbcc.DBUserName, dbcc.DBPassword);
                Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
                stmt.execute("SET NAMES '" + Constant.GlobalCharset.replaceAll("\\-", "").toLowerCase() + "'");
                stmt.close();
            } else if (dbcc.DBType.equalsIgnoreCase(DBConnConfig.MSSQL2000)) {
                Class.forName("net.sourceforge.jtds.jdbc.Driver");
                conn = DriverManager.getConnection(getJdbcUrl(dbcc), dbcc.DBUserName, dbcc.DBPassword);
            } else {
                LogUtil.error("目前暂不支持此种类型的数据库!");
            }
        }
        DBConn dbconn = new DBConn();
        dbconn.Conn = conn;
        dbconn.isUsing = true;
        dbconn.LongTimeFlag = bLongTimeFlag;
        dbconn.LastApplyTime = System.currentTimeMillis();
        dbconn.DBConfig = dbcc;
        dbconn.ConnID = DBConn.getConnID();
        return dbconn;
    }

    public static String getJdbcUrl(DBConnConfig dcc) {
        StringBuffer sUrl = new StringBuffer(128);
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.ORACLE)) {
            sUrl.append("jdbc:oracle:thin:@");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append(":");
            sUrl.append(dcc.DBName);
        }
        if (dcc.DBType.trim().toUpperCase().equals("INFORMIX")) {
            sUrl.append("jdbc:informix-sqli://");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append(dcc.DBName);
            sUrl.append(":");
            sUrl.append("informixserver=");
            sUrl.append(dcc.DBName);
            sUrl.append(";");
            sUrl.append("user=");
            sUrl.append(dcc.DBUserName);
            sUrl.append(";");
            sUrl.append("dcc.DBPassword=");
            sUrl.append(dcc.DBPassword);
            sUrl.append(";");
        }
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.MSSQL)) {// SQL
            // Server
            // 2005
            sUrl.append("jdbc:sqlserver://");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append(";DatabaseName=");
            sUrl.append(dcc.DBName);
        }
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.MSSQL2000)) {// SQL
            // Server
            // 2000
            sUrl.append("jdbc:jtds:sqlserver://");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append(";DatabaseName=");
            sUrl.append(dcc.DBName);
            sUrl.append(";useLOBs=false");
        }
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.DB2)) {
            sUrl.append("jdbc:db2://");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append("/");
            sUrl.append(dcc.DBName);
        }
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.SYBASE)) {
            sUrl.append("jdbc:sybase:Tds:");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append("/");
            sUrl.append(dcc.DBName);
        }
        if (dcc.DBType.trim().toUpperCase().equals(DBConnConfig.MYSQL)) {
            sUrl.append("jdbc:mysql://");
            sUrl.append(dcc.DBServerAddress);
            sUrl.append(":");
            sUrl.append(dcc.DBPort);
            sUrl.append("/");
            sUrl.append(dcc.DBName);
        }
        return sUrl.toString();
    }

    private void setCaller(DBConn conn) {
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
        conn.CallerString = sb.toString();
    }

    private static int getDefaultPort(DBConnConfig dcc) {
        if (dcc.DBType.equals(DBConnConfig.MSSQL)) {
            return 1433;
        }
        if (dcc.DBType.equals(DBConnConfig.ORACLE)) {
            return 1521;
        }
        if (dcc.DBType.equals(DBConnConfig.DB2)) {
            return 50000;
        }
        if (dcc.DBType.equals(DBConnConfig.MYSQL)) {
            return 3306;
        }
        if (dcc.DBType.equals(DBConnConfig.SYBASE)) {
            return 5000;
        }
        return 0;
    }
}
