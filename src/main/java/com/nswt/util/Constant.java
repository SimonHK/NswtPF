package com.nswt.util;

import java.util.regex.Pattern;

/**
 * Created by hongkai on 2017/4/25.
 */
public class Constant {

    /**
     * 正则表达式，匹配形如${FieldName}的字符串
     */
    public static final Pattern PatternField = Pattern.compile("\\$\\{(\\w+?)\\}");

    /**
     * 正则表达式，匹配形如${@FieldName}的字符串
     */
    public static final Pattern PatternSpeicalField = Pattern.compile("\\$\\{[@#](\\w+?)\\}");

    /**
     * 正则表达式，匹配形如${Table.FieldName}的字符串
     */
    public static final Pattern PatternPropField = Pattern.compile("\\$\\{(\\w+?)\\.(\\w+?)(\\|(.*?))??\\}");

    /**
     * Session中的User对象的属性名
     */
    public static final String UserAttrName = "_NSWT_USER";

    /**
     * User对象中验证码字符串的属性名
     */
    public static final String DefaultAuthKey = "_NSWT_AUTHKEY";

    /**
     * Cookie中SessionID对应的Cookie项名称，不同的中间件可能有所不同
     */
    public static final String SessionIDCookieName = "JSESSIONID";

    /**
     * Response对象中需要游览器执行的JS段
     */
    public static final String ResponseScriptAttr = "_NSWT_SCRIPT";

    /**
     * Response对象中需要浏览器显示的消息文本
     */
    public static final String ResponseMessageAttrName = "_NSWT_MESSAGE";//

    /**
     * Response对象中反馈给游览器的状态值，一般0表示有错误，1表示执行成功
     */
    public static final String ResponseStatusAttrName = "_NSWT_STATUS";

    /**
     * DataGrid中表示SQL的属性名
     */
    public static final String DataGridSQL = "_NSWT_DATAGRID_SQL";

    /**
     * DataGrid中的表示当前页数的属性名，从0开始，0表示第一页
     */
    public static final String DataGridPageIndex = "_NSWT_PAGEINDEX";

    /**
     * DataGrid中表示记录总数的属性名
     */
    public static final String DataGridPageTotal = "_NSWT_PAGETOTAL";

    /**
     * DataGrid中表示排序方式的属性名，其值形如id desc,name asc
     */
    public static final String DataGridSortString = "_NSWT_SORTSTRING";

    /**
     * DataGrid中表示当前动作是插入空白行的属性名
     */
    public static final String DataGridInsertRow = "_NSWT_INSERTROW";

    /**
     * DataGrid中表示允许多选的属性名
     */
    public static final String DataGridMultiSelect = "_NSWT_MULTISELECT";

    /**
     * DataGrid中表示要求自动填充空白行以保持DataGrid高度的属性名
     */
    public static final String DataGridAutoFill = "_NSWT_AUTOFILL";

    /**
     * DataGrid中表示允许内容滚动的属性
     */
    public static final String DataGridScroll = "_NSWT_SCROLL";

    /**
     * 表示属性值是一个DataTable
     */
    public static final String DataTable = "_NSWT_DataTable";

    /**
     * 表示属性值是唯一ID
     */
    public static final String ID = "_NSWT_ID";

    /**
     * 表示属性值是一个后台Page类的方法
     */
    public static final String Method = "_NSWT_METHOD";

    /**
     * 表示是否允许分页，值为字 符串true和false
     */
    public static final String Page = "_NSWT_PAGE";

    /**
     * 表示大小的属性名，例如分页大小
     */
    public static final String Size = "_NSWT_SIZE";

    /**
     * 表示控件标签包含的HTML内容的属性名
     */
    public static final String TagBody = "_NSWT_TAGBODY";

    /**
     * 表示树形结构中层级的属性名
     */
    public static final String TreeLevel = "_NSWT_TREE_LEVEL";

    /**
     * 树形控件中表示是否延迟加载的属性名
     */
    public static final String TreeLazy = "_NSWT_TREE_LAZY"; // 延迟加载

    /**
     * 树形控件中表示是否全部展开的属性名
     */
    public static final String TreeExpand = "_NSWT_TREE_EXPAND"; // 是否在延迟加载是全部展开

    /**
     * 树形控件中表示css的属性名
     */
    public static final String TreeStyle = "_NSWT_TREE_STYLE";

    /**
     * 表示属性值是一个DataCollection对象
     */
    public static final String Data = "_NSWT_DATA";

    /**
     * 表示属性值是一个URL
     */
    public static final String URL = "_NSWT_URL";

    /**
     * 表示一个空字符串。（某些场合下如果直接传空字符串，会被过滤掉，如URL中）
     */
    public static final String Null = "_NSWT_NULL";

    /**
     * 文章分页分隔符，用于一段内容由多个部分组成的场合，如CMS中的多页文章
     */
    public static final String PAGE_BREAK = "<!--_NSWT_PAGE_BREAK_-->";

    /**
     * 全局字符集设置，在UTF-8版的应用中值为“UTF-8”，在GBK版的应用中值为“GBK”
     */
    public static String GlobalCharset = "GBK";

    /**
     * 在GBK版本中的特殊处理用UTF-B
     * */
    public static String UTF8Charset = "UTF8";

}
