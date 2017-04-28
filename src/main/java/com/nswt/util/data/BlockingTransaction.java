package com.nswt.util.data;


import java.sql.SQLException;

/**
 * 阻塞型事务处理类，使用本类处理事务时会在一开始就占用数据库连接，<br>
 * 并在提交时自动释放连接。<br>
 * 两种情况下必须使用本类处理事务：<br>
 * 1、事务中后续操作需要查询前面操作的结果。<br>
 * 2、事务中涉及到大量数据的操作。<br>
 * 3、事务提交后会自动关闭连接，如果一直未关闭连接，则会在退出Servlet线程时自动关闭。<br>
 * 以一次插入一百万条数据为例，使用非阻塞事务，<br>
 * 即便是分成1万次操作，一次插入100条，也会将100w条数据全部缓存在内存中，<br>
 * 因而需要100万条数据的内存容量；而使用本类时,因每次操作都己提交到数据库，<br>
 * 则始终只需要100条数据的内存容量。<br>
 *
 * @since 1.3
 * @Mail nswt@nswt.com.cn
 */
public class BlockingTransaction extends Transaction {
    /**
     * 是否还有未决操作，即是否有操作已经发送到数据库但既未提交又未回滚。
     */
    private boolean isExistsOpeningOperate = false;

    private static ThreadLocal current = new ThreadLocal();

    private DBConn conn;

    public BlockingTransaction() {
        if (dataAccess == null) {
            conn = DBConnPool.getConnection();
            conn.isBlockingTransactionStarted = true;
            dataAccess = new DataAccess(conn);
            try {
                dataAccess.setAutoCommit(false);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            bindTransactionToThread();
        }
    }

    public BlockingTransaction(String poolName) {
        dataAccess = new DataAccess(DBConnPool.getConnection(poolName));
        conn = dataAccess.getConnection();
        conn.isBlockingTransactionStarted = true;
        try {
            dataAccess.setAutoCommit(false);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        bindTransactionToThread();
    }

    public BlockingTransaction(DataAccess da) {
        dataAccess = da;
        conn = dataAccess.getConnection();
        conn.isBlockingTransactionStarted = true;
        try {
            dataAccess.setAutoCommit(false);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        bindTransactionToThread();
    }

    /**
     * 设置当前事务使用的DataAccess对象
     */
    public void setDataAccess(DataAccess dAccess) {
        if (dataAccess != null && !outerConnFlag) {//
            throw new RuntimeException("BlockingTransaction.setDataAccess():请检查代码，阻塞型事务只能在事务开始之前设置DataAccess");
        }
        super.setDataAccess(dAccess);
    }

    /**
     * 增加一个SQL操作,并立即将操作发送到数据库
     */
    public void add(QueryBuilder qb) {
        executeWithBlockedConnection(qb, Transaction.SQL, true);
    }

    /**
     * 增加一个Schema操作,并立即将操作发送到数据库
     */
    public void add(Schema schema, int type) {
        executeWithBlockedConnection(schema, type, true);
    }

    /**
     * 增加一个SchemaSet操作,并立即将操作发送到数据库
     */
    public void add(SchemaSet set, int type) {
        executeWithBlockedConnection(set, type, true);
    }

    /**
     * 增加一个SQL操作,并立即将操作发送到数据库
     */
    public void addWithException(QueryBuilder qb) throws Exception {
        executeWithBlockedConnection(qb, Transaction.SQL, false);
    }

    /**
     * 增加一个Schema操作,并立即将操作发送到数据库
     */
    public void addWithException(Schema schema, int type) throws Exception {
        executeWithException(schema, type);
    }

    /**
     * 增加一个SchemaSet操作,并立即将操作发送到数据库
     */
    public void addWithException(SchemaSet set, int type) throws Exception {
        executeWithException(set, type);
    }

    /**
     * 执行操作并开始占用连接,如果执行有误，则直接回滚
     */
    private void executeWithBlockedConnection(Object obj, int type, boolean rollBackFlag) {
        try {
            executeObject(obj, type);
            isExistsOpeningOperate = true;
        } catch (SQLException e) {
            if (!outerConnFlag && rollBackFlag) {
                try {
                    dataAccess.rollback();
                    conn.isBlockingTransactionStarted = false;
                } catch (SQLException e1) {
                    e1.printStackTrace();
                } finally {
                    try {
                        dataAccess.close();
                    } catch (SQLException e1) {
                        e1.printStackTrace();
                    }
                }
            }
            throw new RuntimeException(e);
        }
    }

    /**
     * 执行操作并开始占用连接,如果执行有误，则抛出异常
     */
    private void executeWithException(Object obj, int type) throws Exception {
        executeObject(obj, type);
        isExistsOpeningOperate = true;
    }

    /**
     * 提交事务到数据库
     */
    public boolean commit() {
        return commit(true);
    }

    /**
     * 提交事务，并关闭连接<br>
     * 若setAutoCommitStatus为false并且使用的是外部的DataAccess，则提交后并不设置连接的AutoCommit状态。
     */
    public boolean commit(boolean setAutoCommitStatus) {
        if (dataAccess != null) {
            try {
                dataAccess.commit();
            } catch (SQLException e) {
                e.printStackTrace();
                this.exceptionMessage = e.getMessage();
                if (!outerConnFlag) {
                    try {
                        dataAccess.rollback();// 如果有错，则回滚。有可能add()时没有错误，但提交时报错
                    } catch (SQLException e1) {
                        e1.printStackTrace();
                    }
                }
                return false;
            } finally {
                try {
                    if (!outerConnFlag || setAutoCommitStatus) {
                        dataAccess.setAutoCommit(true);
                    }
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
                if (!outerConnFlag) {
                    try {
                        conn.isBlockingTransactionStarted = false;
                        dataAccess.getConnection().close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
                isExistsOpeningOperate = false;
                current.set(null);// 已经关闭，不能再绑定
            }
            for (int i = 0; i < executorList.size(); i++) {
                Executor executor = (Executor) executorList.get(i);
                executor.execute();
            }
        }
        return true;
    }

    /**
     * 回滚事务,并关闭连接
     */
    public void rollback() {
        if (dataAccess != null) {
            try {
                dataAccess.rollback();
                isExistsOpeningOperate = false;
            } catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                conn.isBlockingTransactionStarted = false;
                dataAccess.getConnection().close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            current.set(null);// 已经关闭，不能再绑定
        }
    }

    /**
     * 将事务绑定到当前线程
     */
    private void bindTransactionToThread() {
        Object obj = current.get();
        if (obj == null) {
            current.set(this);
        } else {
            throw new RuntimeException("同一线程中只能有一个阻塞型事务!");
        }
    }

    /**
     * 清除掉事务与线程的绑定，并检测连接是否己被关闭。<br>
     * 此方法仅供MainFilter调用。
     */
    public static void clearTransactionBinding() {
        Object obj = current.get();
        if (obj == null) {
            return;
        }
        BlockingTransaction bt = (BlockingTransaction) obj;
        if (bt.isExistsOpeningOperate) {
            bt.rollback();
        }
        current.set(null);
    }

    /**
     * 获取当前线程中的阻塞型事务所用的连接。<br>
     * 此方法主要供DBConnPool.getConnection()调用，<br>
     * 以保证在阻塞型事务中执行的查询类操作能够获得正确的结果。
     */
    public static DBConn getCurrentThreadConnection() {
        Object obj = current.get();
        if (obj == null) {
            return null;
        }
        BlockingTransaction bt = (BlockingTransaction) obj;
        if (bt.dataAccess == null || bt.dataAccess.conn == null) {// 注意如果没有dataAccess.conn的检测，则会死循环
            return null;
        }
        return bt.dataAccess.getConnection();
    }
}