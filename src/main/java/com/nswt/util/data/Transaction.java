package com.nswt.util.data;


import java.sql.SQLException;
import java.util.ArrayList;

/**
 * 非阻塞事务处理类，使用本类处理事务不会一开始即占用连接，只有在最后commit()时<br>
 * 才会最终占用数据库连接，在此之前只是将操作缓存在内存之中，从而节约占用数据库连接的时间。<br>
 * 1、一般情况都要求使用本类处理事务，本类在任何情况下都不需要手工管理连接，并且性能较优。<br>
 * 2、因本类缓存了数据库操作，如果数据库操作涉及到大量数据的插入(例如一次插入100W条数据)，<br>
 * 则可能会导致内存溢出，此种情况下请使用阻塞型事务。<br>
 * 3、在本类的事务处理过程中查询数据库，查询到的值依然是事务未开始之前的值(因为在未commit()<br>
 * 之前，实际上未向数据库提交任何操作)。 <br>
 * 4、如果事务处理的过程中需要从数据库查询值，并且要求查询到的值是本次事务己提交的操作的结果，<br>
 * 则需要使用阻塞型事务处理。 <br>
 * 5、若要使用JDBC原生事务处理，请使用DataAccess类，一般情况下不推荐使用。<br>
 *
 * @see com.nswt.framework.data.BlockingTransaction 作者: NSWT<br>
 *      日期：2016-7-12<br>
 *      邮件：nswt@nswt.com.cn<br>
 */
public class Transaction {
    /**
     * 插入数据
     */
    public static final int INSERT = 1;

    /**
     * 更新数据
     */
    public static final int UPDATE = 2;

    /**
     * 删除数据
     */
    public static final int DELETE = 3;

    /**
     * 往B表备份数据
     */
    public static final int BACKUP = 4;

    /**
     * 删除并且备份数据
     */
    public static final int DELETE_AND_BACKUP = 5;

    /**
     * 先删除再插入数据
     */
    public static final int DELETE_AND_INSERT = 6;

    /**
     * SQL操作
     */
    public static final int SQL = 7;

    protected boolean outerConnFlag = false;// 1为连接从外部传入，0为未传入连接

    protected DataAccess dataAccess;

    protected ArrayList list = new ArrayList();

    protected String backupOperator;

    protected String backupMemo;

    protected String exceptionMessage;// 异常消息

    protected ArrayList executorList = new ArrayList(4);

    protected String poolName;

    public Transaction() {
    }

    public Transaction(String poolName) {
        this.poolName = poolName;
    }

    /**
     * 设置当前事务使用的DataAccess对象
     */
    public void setDataAccess(DataAccess dAccess) {
        dataAccess = dAccess;
        outerConnFlag = true;
    }

    /**
     * 增加一个SQL操作
     */
    public void add(QueryBuilder qb) {
        list.add(new Object[] { qb, new Integer(Transaction.SQL) });
    }

    /**
     * 增加一个Schema操作
     */
    public void add(Schema schema, int type) {
        list.add(new Object[] { schema, new Integer(type) });
    }

    /**
     * 增加一个SchemaSet操作
     */
    public void add(SchemaSet set, int type) {
        list.add(new Object[] { set, new Integer(type) });
    }

    /**
     * 提交事务到数据库
     */
    public boolean commit() {
        return commit(true);
    }

    /**
     * 提交事务，若setAutoCommitStatus为false并且使用的是外部的DataAccess，则只将SQL提交到DataAccess。
     */
    public boolean commit(boolean setAutoCommitStatus) {
        if (!outerConnFlag) {
            dataAccess = new DataAccess(DBConnPool.getConnection(poolName));
        }
        boolean NoErrFlag = true;
        try {
            if (!outerConnFlag || setAutoCommitStatus) {
                dataAccess.setAutoCommit(false);
            }
            for (int i = 0; i < list.size(); i++) {
                Object[] arr = (Object[]) list.get(i);
                Object obj = arr[0];
                int type = ((Integer) arr[1]).intValue();
                if (!executeObject(obj, type)) {
                    NoErrFlag = false;
                    return false;
                }
            }
            dataAccess.commit();
            list.clear();
        } catch (Exception e) {
            e.printStackTrace();
            this.exceptionMessage = e.getMessage();
            NoErrFlag = false;
            return false;
        } finally {
            if (!NoErrFlag) {
                try {
                    dataAccess.rollback();
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
            }
            try {
                if (!outerConnFlag || setAutoCommitStatus) {
                    dataAccess.setAutoCommit(true);
                }
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            if (!outerConnFlag) {
                try {
                    dataAccess.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        for (int i = 0; i < executorList.size(); i++) {
            Executor executor = (Executor) executorList.get(i);
            executor.execute();
        }
        return true;
    }

    protected boolean executeObject(Object obj, int type) throws SQLException {
        if (obj instanceof QueryBuilder) {
            dataAccess.executeNoQuery((QueryBuilder) obj);
        } else if (obj instanceof Schema) {
            Schema s = (Schema) obj;
            s.setDataAccess(dataAccess);
            if (type == Transaction.INSERT) {
                if (!s.insert()) {
                    return false;
                }
            } else if (type == Transaction.UPDATE) {
                if (!s.update()) {
                    return false;
                }
            } else if (type == Transaction.DELETE) {
                if (!s.delete()) {
                    return false;
                }
            } else if (type == Transaction.BACKUP) {
                if (!s.backup(this.backupOperator, this.backupMemo)) {
                    return false;
                }
            } else if (type == Transaction.DELETE_AND_BACKUP) {
                if (!s.deleteAndBackup(this.backupOperator, this.backupMemo)) {
                    return false;
                }
            } else if (type == Transaction.DELETE_AND_INSERT) {
                if (!s.deleteAndInsert()) {
                    return false;
                }
            }
        } else if (obj instanceof SchemaSet) {
            SchemaSet s = (SchemaSet) obj;
            s.setDataAccess(dataAccess);
            if (type == Transaction.INSERT) {
                if (!s.insert()) {
                    return false;
                }
            } else if (type == Transaction.UPDATE) {
                if (!s.update()) {
                    return false;
                }
            } else if (type == Transaction.DELETE) {
                if (!s.delete()) {
                    return false;
                }
            } else if (type == Transaction.BACKUP) {
                if (!s.backup(this.backupOperator, this.backupMemo)) {
                    return false;
                }
            } else if (type == Transaction.DELETE_AND_BACKUP) {
                if (!s.deleteAndBackup(this.backupOperator, this.backupMemo)) {
                    return false;
                }
            } else if (type == Transaction.DELETE_AND_INSERT) {
                if (!s.deleteAndInsert()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 清除所有的操作
     */
    public void clear() {
        this.list.clear();
    }

    /**
     * 获取执行过程中的SQL异常消息
     */
    public String getExceptionMessage() {
        return exceptionMessage;
    }

    /**
     * 获取本次事务统一的备份备注信息
     */
    public String getBackupMemo() {
        return backupMemo;
    }

    /**
     * 设置本次事务统一的备份备注信息
     */
    public void setBackupMemo(String backupMemo) {
        this.backupMemo = backupMemo;
    }

    /**
     * 获取本次事务统一的备份人信息
     */
    public String getBackupOperator() {
        return backupOperator;
    }

    /**
     * 设置本次事务统一的备份人信息
     */
    public void setBackupOperator(String backupOperator) {
        this.backupOperator = backupOperator;
    }

    /**
     * 返回包含所有操作的Map
     */
    public ArrayList getOperateList() {
        return list;
    }

    /**
     * 增加一个执行器，执行器中的逻辑将在commit()之后执行
     */
    public void addExecutor(Executor executor) {
        executorList.add(executor);
    }
}

