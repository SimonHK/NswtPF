package com.nswt.util.data;

import com.nswt.util.Mapx;
import com.nswt.util.config.Config;

/**
 * 连接池类,同时支持多个连接池
 *
 * @Author NSWT
 * @Date 2007-5-30
 * @Mail nswt@nswt.com.cn
 */
public class DBConnPool {
    protected static Mapx PoolMap = new Mapx();
    private static Object mutex = new Object();

    public static DBConn getConnection() {
        return getConnection(null, false);
    }

    public static DBConn getConnection(boolean bLongTimeFlag) {
        return getConnection(null, bLongTimeFlag);
    }

    public static DBConn getConnection(String poolName) {
        return getConnection(poolName, false);
    }

    public static DBConnConfig getDBConnConfig() {
        return getDBConnConfig(null);
    }

    public static DBConnConfig getDBConnConfig(String poolName) {
        if (poolName == null || poolName.equals("")) {
            poolName = "Default";
        }
        poolName = poolName + ".";
        Object o = PoolMap.get(poolName);
        DBConnPoolImpl pool = null;
        if (o == null) {
            synchronized (mutex) {
                if (Config.getValue("Database." + poolName + "Type") != null) {
                    pool = new DBConnPoolImpl(poolName);
                    PoolMap.put(poolName, pool);
                } else {
                    throw new RuntimeException("指定的连接池不存在:" + poolName);
                }
            }
        } else {
            pool = (DBConnPoolImpl) o;
        }
        return pool.getDBConnConfig();
    }

    public static DBConn getConnection(String poolName, boolean bLongTimeFlag) {
        return getConnection(poolName, bLongTimeFlag, true);
    }

    public static DBConn getConnection(String poolName, boolean bLongTimeFlag, boolean bCurrentThreadConnectionFlag) {
        if (poolName == null || poolName.equals("")) {
            poolName = "Default";
        }
        poolName = poolName + ".";
        if (bCurrentThreadConnectionFlag) {
            DBConn conn = BlockingTransaction.getCurrentThreadConnection();
            if (conn != null && conn.DBConfig.PoolName.equals(poolName)) {
                return conn;// 如果存在阻塞型事务，并且其中的连接的连接池名和当前申请的连接池名称一致，则直接返回该连接，以保证整个处理过程中能够查询到正确的数据。
            }
        }
        Object o = PoolMap.get(poolName);
        DBConnPoolImpl pool = null;
        if (o == null) {
            synchronized (mutex) {
                if (Config.getValue("Database." + poolName + "Type") != null) {
                    pool = new DBConnPoolImpl(poolName);
                    PoolMap.put(poolName, pool);
                } else {
                    throw new RuntimeException("指定的连接池不存在:" + poolName);
                }
            }

        } else {
            pool = (DBConnPoolImpl) o;
        }
        return pool.getConnection(bLongTimeFlag);
    }

    public static Mapx getPoolMap() {
        return PoolMap;
    }
}

