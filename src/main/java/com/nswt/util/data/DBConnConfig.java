package com.nswt.util.data;

/**
 * Created by hongkai on 2017/4/25.
 */
public class DBConnConfig {
    public static final String ORACLE = "ORACLE";

    public static final String DB2 = "DB2";

    public static final String MYSQL = "MYSQL";

    public static final String MSSQL = "MSSQL";

    public static final String MSSQL2000 = "MSSQL2000";

    public static final String SYBASE = "SYBASE";

    public String JNDIName = null;

    public boolean isJNDIPool = false;

    public int MaxConnCount = 1000;

    public int InitConnCount = 0;

    public int ConnCount;

    public int MaxConnUsingTime = 300000;// 以毫秒为单位

    public int RefershPeriod = 60000;// 一分钟检查一次连接是否己失效（数据库重启等原因造成）

    public String DBType;

    public String DBServerAddress;

    public int DBPort;

    public String DBName;

    public String DBUserName;

    public String DBPassword;

    public String TestTable;

    public String PoolName;

    public boolean isLatin1Charset;// 是否是latin1字符集，如果在Oracle下是此字符集，则SQL及返回结果必须转码

    public boolean isOracle() {
        return DBType.equalsIgnoreCase(ORACLE);
    }

    public boolean isDB2() {
        return DBType.equalsIgnoreCase(DB2);
    }

    public boolean isMysql() {
        return DBType.equalsIgnoreCase(MYSQL);
    }

    public boolean isSQLServer() {
        return DBType.equalsIgnoreCase(MSSQL);
    }

    public boolean isSQLServer2000() {
        return DBType.equalsIgnoreCase(MSSQL2000);
    }

    public boolean isSybase() {
        return DBType.equalsIgnoreCase(SYBASE);
    }
}
