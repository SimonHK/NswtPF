package com.nswt.util.config;

import com.nswt.util.Mapx;
import com.nswt.util.StringUtil;
import com.nswt.util.data.DBConnConfig;
import com.nswt.util.data.DBConnPool;
import com.nswt.util.data.DataTable;
import com.nswt.util.data.QueryBuilder;
import com.nswt.util.log.LogUtil;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLDecoder;

/**
 * Created by hongkai on 2017/4/25.
 */
public class Config {
    protected static Mapx configMap = new Mapx();// 保存各配置项的Map

    public static int OnlineUserCount = 0;// 当前在线Session数

    public static int LoginUserCount = 0;// 当前己登录人数

    public static boolean isInstalled = false;// 数据库是否己配置

    public static boolean isAllowLogin = true;// 是否临时禁止登录

    private static String AppCode = null;// 应用代码

    private static String AppName = null;// 应用名称

    private static float MainVersion = 1.0f;// 应用主版本号

    private static float MinorVersion = 0;// 应用次版本号

    public static boolean ComplexDepolyMode = false;// 是否是复杂部署模式，复杂部署模式需要考虑到一个应用有多个路径的问题，例如内外网

    public static int ServletMajorVersion;

    public static int ServletMinorVersion;

    private static long LastUpdateTime = 0;// 最后一次读取配置文件的时间

    private static long RefreshPeriod = 60000;// 隔多长时间读取一次配置

    private static Object mutex = new Object();

    /**
     * 初始化配置项
     */
    protected static void init() {
        if (System.currentTimeMillis() - LastUpdateTime > RefreshPeriod) {
            if (!configMap.containsKey("System.JavaVersion")) {
                ConfigLoader.load();
                configMap.put("App.ContextRealPath", Config.getContextRealPath());
                configMap.put("System.JavaVersion", System.getProperty("java.version"));
                configMap.put("System.JavaVendor", System.getProperty("java.vendor"));
                configMap.put("System.JavaHome", System.getProperty("java.home"));
                configMap.put("System.OSPatchLevel", System.getProperty("sun.os.patch.level"));// 其他JDK以后补充
                configMap.put("System.OSArch", System.getProperty("os.arch"));
                configMap.put("System.OSVersion", System.getProperty("os.version"));
                configMap.put("System.OSName", System.getProperty("os.name"));
                configMap.put("System.OSUserLanguage", System.getProperty("user.language"));
                configMap.put("System.OSUserName", System.getProperty("user.name"));
                configMap.put("System.LineSeparator", System.getProperty("line.separator"));
                configMap.put("System.FileSeparator", System.getProperty("file.separator"));
                configMap.put("System.FileEncoding", System.getProperty("file.encoding"));

                //loadDBConfig();
               /* ExtendManager.executeAll("Config.AfterInit", null);*/
            } else {
                //loadDBConfig();
            }
        }
    }

    public static void loadConfig() {
        configMap.remove("System.JavaVersion");
        ConfigLoader.reload();
        LastUpdateTime = 0;
        init();
    }

    /**
     * 载入数据库配置中的配置项
     */
    public static void loadDBConfig() {
        synchronized (mutex) {
            LastUpdateTime = System.currentTimeMillis();
            if (configMap.containsKey("Database.Default.Type")) {
                if ("true".equals(configMap.get("App.ExistPlatformDB"))) {
                    try {
                        DataTable dt = new QueryBuilder("select type,value from zdconfig").executeDataTable();
                        for (int i = 0; dt != null && i < dt.getRowCount(); i++) {
                            configMap.put(dt.getString(i, 0), dt.getString(i, 1));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
     * 提供给外部调用更新 在管理后台修改后直接调用更新
     */
    public static void refresh() {
        if (System.currentTimeMillis() - LastUpdateTime > RefreshPeriod) {
            loadDBConfig();
        }
    }

    /**
     * @deprecated
     */
    public static void update() {
        refresh();
    }

    public static Mapx getMapx() {
        return configMap;
    }

    /**
     * 返回配置项的值
     *
     * @param configName
     * @return
     */
    public static String getValue(String configName) {
        init();
        return (String) configMap.get(configName);
    }

    /**
     * 设置配置项的值
     *
     * @param configName
     * @param configValue
     */
    public static void setValue(String configName, String configValue) {
        init();
        configMap.put(configName, configValue);
    }

    /**
     * 返回class所在目录的实际路径
     */
    public static String getClassesPath() {
        URL url = Thread.currentThread().getContextClassLoader().getResource("/");
        if (url == null) {
            throw new RuntimeException("未找到/目录");
        }
        try {
            String path = URLDecoder.decode(url.getPath(), Config.getFileEncode());
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
            return path.substring(0, path.lastIndexOf("/") + 1);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * WEB应用下返回应用的实际路径
     */
    public static String getContextRealPath() {
        if (configMap != null) {
            String str = (String) configMap.get("App.ContextRealPath");
            if (str != null) {
                return str;
            }
        }
        String path = getClassesPath();
        int index = path.indexOf("WEB-INF");
        if (index > 0) {
            path = path.substring(0, index);
        }
        return path;
    }

    /**
     * 考虑到同一个应用在内外网有不同的路径的情况，该处变量在每一次进入Filter后都会重新设置
     */
  /*  public static String getContextPath() {
        return Config.getValue("App.ContextPath");
        *//*if (ComplexDepolyMode) {
            String path = (String) User.getValue("App.ContextPath");
            if (StringUtil.isEmpty(path)) {
                path = Config.getValue("App.ContextPath");
            }
            return path;
        } else {
            return Config.getValue("App.ContextPath");
        }*//*
    }*/

    /**
     * 获取日志级别
     *
     * @return
     */
    public static String getLogLevel() {
        return Config.getValue("App.LogLevel");
    }

    private static void initProduct() {
        if (AppCode == null) {
            try {
                if (configMap.get("App.Code") != null) {
                    AppCode = configMap.getString("App.Code");
                    AppName = configMap.getString("App.Name");
                }
            } catch (Exception e) {
                AppCode = "ZPlatform";
                AppName = "应用开发平台";
            }
        }
    }

    /**
     * 获取应用代码
     *
     * @return
     */
    public static String getAppCode() {
        initProduct();
        return AppCode;
    }

    /**
     * 获取应用名称
     *
     * @return
     */
    public static String getAppName() {
        initProduct();
        return AppName;
    }

    /**
     * 获取应用主版本号
     *
     * @return
     */
    public static float getMainVersion() {
        initProduct();
        return MainVersion;
    }

    /**
     * 获取应用次版本号
     *
     * @return
     */
    public static float getMinorVersion() {
        initProduct();
        return MinorVersion;
    }

    /**
     * 是否是调试模式，调试模式将会中继Session
     *
     * @return
     */
    public static boolean isDebugMode() {
        return "true".equalsIgnoreCase(Config.getValue("App.DebugMode"));
    }

    /**
     * 获取JVM的版本号
     *
     * @return
     */
    public static String getJavaVersion() {
        return Config.getValue("System.JavaVersion");
    }

    /**
     * 获取JVM厂商
     *
     * @return
     */
    public static String getJavaVendor() {
        return Config.getValue("System.JavaVendor");
    }

    /**
     * 获取JVM安装目录
     *
     * @return
     */
    public static String getJavaHome() {
        return Config.getValue("System.JavaHome");
    }

    /**
     * 获取中间件容器信息
     *
     * @return
     */
    public static String getContainerInfo() {
        return Config.getValue("System.ContainerInfo");
    }

    /**
     * 获取中间件容器的版本
     *
     * @return
     */
    public static String getContainerVersion() {
        String str = Config.getValue("System.ContainerInfo");
        if (str.indexOf("/") > 0) {
            return str.substring(str.lastIndexOf("/") + 1);
        }
        return "0";
    }

    /**
     * 获取操作系统名称
     *
     * @return
     */
    public static String getOSName() {
        return Config.getValue("System.OSName");
    }

    /**
     * 获取操作系统补丁版本
     *
     * @return
     */
    public static String getOSPatchLevel() {
        return Config.getValue("System.OSPatchLevel");
    }

    /**
     * 获取操作系统架构
     *
     * @return
     */
    public static String getOSArch() {
        return Config.getValue("System.OSArch");
    }

    /**
     * 获取操作系统版本
     *
     * @return
     */
    public static String getOSVersion() {
        return Config.getValue("System.OSVersion");
    }

    /**
     * 获取运行中间件的操作系统用户的默认语言
     *
     * @return
     */
    public static String getOSUserLanguage() {
        return Config.getValue("System.OSUserLanguage");
    }

    /**
     * 获取运行中间件的操作系统用户名
     *
     * @return
     */
    public static String getOSUserName() {
        return Config.getValue("System.OSUserName");
    }

    /**
     * 获取文本文件默认分隔符
     *
     * @return
     */
    public static String getLineSeparator() {
        return Config.getValue("System.LineSeparator");
    }

    /**
     * 获取文件名中的路径分隔符
     *
     * @return
     */
    public static String getFileSeparator() {
        return Config.getValue("System.FileSeparator");
    }

    /**
     * 获取操作系统的默认文件编码
     *
     * @return
     */
    public static String getFileEncode() {
        return System.getProperty("file.encoding");
    }

    /**
     * 获取己登录的用户数
     *
     * @return
     */
    public static int getLoginUserCount() {
        return LoginUserCount;
    }

    /**
     * 获取在线用户数（有Session的用户数）
     *
     * @return
     */
    public static int getOnlineUserCount() {
        return OnlineUserCount;
    }

    /**
     * 默认数据库是否是DB2
     *
     * @return
     */
    public static boolean isDB2() {
        return DBConnPool.getDBConnConfig().DBType.equals(DBConnConfig.DB2);
    }

    /**
     * 默认数据库是否是Oracle
     *
     * @return
     */
    public static boolean isOracle() {
        return DBConnPool.getDBConnConfig().DBType.equals(DBConnConfig.ORACLE);
    }

    /**
     * 默认数据库是否是Mysql
     *
     * @return
     */
    public static boolean isMysql() {
        return DBConnPool.getDBConnConfig().DBType.equals(DBConnConfig.MYSQL);
    }

    /**
     * 默认数据库是否是SQL Server
     *
     * @return
     */
    public static boolean isSQLServer() {
        return DBConnPool.getDBConnConfig().DBType.equals(DBConnConfig.MSSQL);
    }

    /**
     * 默认数据库是否是Sybase
     *
     * @return
     */
    public static boolean isSybase() {
        return DBConnPool.getDBConnConfig().DBType.equals(DBConnConfig.SYBASE);
    }

    /**
     * 中间件是否是Tomcat
     *
     * @return
     */
    public static boolean isTomcat() {
        if (StringUtil.isEmpty(Config.getContainerInfo())) {
            getJBossInfo();
        }
        return Config.getContainerInfo().toLowerCase().indexOf("tomcat") >= 0;
    }

    /**
     * JBoss需要特别处理 JBoss调用ServletContext.getServerInfo()时会返回Apache Tomcat 5.x之类的， 且MainFilter会后面Config执行，需要特别处理
     */
    protected static void getJBossInfo() {
        String jboss = System.getProperty("jboss.home.dir");
        if (StringUtil.isNotEmpty(jboss)) {
            try {
                Class c = Class.forName("org.jboss.Version");
                Method m = c.getMethod("getInstance", null);
                Object o = m.invoke(null, null);
                m = c.getMethod("getMajor", null);
                Object major = m.invoke(o, null);
                m = c.getMethod("getMinor", null);
                Object minor = m.invoke(o, null);
                m = c.getMethod("getRevision", null);
                Object revision = m.invoke(o, null);
                m = c.getMethod("getTag", null);
                Object tag = m.invoke(o, null);
                Config.configMap.put("System.ContainerInfo", "JBoss/" + major + "." + minor + "." + revision + "."
                        + tag);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 中间件是否是JBoss
     *
     * @return
     */
    public static boolean isJboss() {
        if (StringUtil.isEmpty(Config.getContainerInfo())) {
            getJBossInfo();
        }
        return Config.getContainerInfo().toLowerCase().indexOf("jboss") >= 0;
    }

    /**
     * 中间件是否是WebLogic
     *
     * @return
     */
    public static boolean isWeblogic() {
        return Config.getContainerInfo().toLowerCase().indexOf("weblogic") >= 0;
    }

    /**
     * 中间件是否是WebSphere
     *
     * @return
     */
    public static boolean isWebSphere() {
        return Config.getContainerInfo().toLowerCase().indexOf("websphere") >= 0;
    }

    /**
     * 是否是复杂部署模式，该模式下一个应用可能因为对外暴露的地址不一样而有多个ContextPath
     *
     * @return
     */
    public static boolean isComplexDepolyMode() {
        return ComplexDepolyMode;
    }

    /**
     * 是否是调试级别的日志输出，为true时会打出SQL
     */
    public static boolean isDebugLoglevel() {
        return "Debug".equalsIgnoreCase(Config.getLogLevel());
    }

}
