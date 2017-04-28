package com.nswt.util.data;


import com.nswt.util.StringUtil;

import java.util.ArrayList;

/**
 * 将一个Select SQL语句分解成各组成部分，但该SQL语句不能包含Union
 *
 * @Mail nswt@nswt.com.cn
 *
 */
public class SelectSQLParser {
    private String SQL = null;

    private String lowerSQL = null;

    private String ColumnPart;

    private String FromPart;

    private String WherePart;

    private String OrderbyPart;

    private String GroupByPart;

    private String HavingPart;

    private String FormatSQL;

    private String[] Columns;

    private String[] Tables;

    private String[] Conditions;

    private String[] ConditionLogics;

    private String[] OrderByFields;

    private String[] GroupByFields;

    private String[] HavingConditions;

    private String[] HavingConditionLogics;

    public SelectSQLParser() {
    }

    public SelectSQLParser(String sql) {
        if (sql == null || sql == "") {
            throw new NullPointerException();
        }
        this.SQL = sql.trim();
        this.lowerSQL = SQL.toLowerCase();
    }

    public void setSQL(String sql) {
        if (sql == null || sql == "") {
            throw new NullPointerException();
        }
        this.SQL = sql.trim();
        this.lowerSQL = SQL.toLowerCase();
    }

    public void parse() throws Exception {
        if (!this.lowerSQL.startsWith("select ")) {
            throw new Exception("String：\"" + this.SQL + "\" is not a Select SQL statement.");
        }
        // 初始化各变量为空，以便于多次setSQL后执行parse
        this.ColumnPart = null;
        this.FromPart = null;
        this.WherePart = null;
        this.GroupByPart = null;
        this.HavingPart = null;
        this.OrderbyPart = null;
        this.FormatSQL = null;

        ArrayList cols = new ArrayList();
        ArrayList tables = new ArrayList();

        int leftBracketCount = 0;
        int rightBracketCount = 0;
        int singleQuoteCount = 0;
        int startIndex = 6;
        // 以下解析各列
        for (int i = startIndex; i < SQL.length(); i++) {
            if (SQL.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (SQL.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (SQL.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (SQL.charAt(i) == ',') {
                    cols.add(SQL.substring(startIndex, i).trim());
                    startIndex = i + 1;
                }
                if (SQL.charAt(i) == ' ' && lowerSQL.substring(i).trim().startsWith("from ")) {
                    cols.add(SQL.substring(startIndex, i).trim());
                    startIndex = lowerSQL.indexOf("from ", i) + 5;
                    break;
                }
            }
        }
        this.Columns = new String[cols.size()];
        for (int i = 0; i < cols.size(); i++) {
            this.Columns[i] = (String) cols.get(i);
        }
        // 以下解析FromTable
        for (int i = startIndex; i < SQL.length(); i++) {
            if (SQL.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (SQL.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (SQL.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (SQL.charAt(i) == ',') {
                    tables.add(SQL.substring(startIndex, i).trim());
                    startIndex = i + 1;
                }
                if (SQL.charAt(i) == ' ') {
                    if (lowerSQL.substring(i).trim().startsWith("where ")) {
                        tables.add(SQL.substring(startIndex, i).trim());
                        parseWhere(SQL.substring(i + 1).trim());
                        break;
                    }
                    if (lowerSQL.substring(i).trim().startsWith("group ")) {
                        tables.add(SQL.substring(startIndex, i).trim());
                        parseGroupBy(SQL.substring(i + 1).trim());
                        break;
                    }
                    if (lowerSQL.substring(i).trim().startsWith("order ")) {
                        tables.add(SQL.substring(startIndex, i).trim());
                        parseOrderBy(SQL.substring(i + 1).trim());
                        break;
                    }
                }
                if (i == SQL.length() - 1) {
                    tables.add(SQL.substring(startIndex).trim());
                }
            }
        }
        this.Tables = new String[tables.size()];
        for (int i = 0; i < tables.size(); i++) {
            this.Tables[i] = (String) tables.get(i);
        }
    }

    private void parseWhere(String wherePart) {
        int leftBracketCount = 0;
        int rightBracketCount = 0;
        int singleQuoteCount = 0;
        int startIndex = 6;
        String lowerWherePart = wherePart.toLowerCase();
        ArrayList conditions = new ArrayList();
        ArrayList conditionLogics = new ArrayList();
        // 以下解析wherePart
        for (int i = startIndex; i < wherePart.length(); i++) {
            if (wherePart.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (wherePart.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (wherePart.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (wherePart.charAt(i) == ' ') {
                    if (lowerWherePart.substring(i).trim().startsWith("and ")) {
                        conditions.add(wherePart.substring(startIndex, i).trim());
                        conditionLogics.add("and");
                        startIndex = i = lowerWherePart.indexOf("and ", i) + 3;
                    }
                    if (lowerWherePart.substring(i).trim().startsWith("or ")) {
                        conditions.add(wherePart.substring(startIndex, i).trim());
                        conditionLogics.add("or");
                        startIndex = i = lowerWherePart.indexOf("or ", i) + 2;
                    }
                    if (lowerWherePart.substring(i).trim().startsWith("group ")) {
                        conditions.add(wherePart.substring(startIndex, i).trim());
                        parseGroupBy(wherePart.substring(i + 1).trim());
                        break;
                    }
                    if (lowerWherePart.substring(i).trim().startsWith("order ")) {
                        conditions.add(wherePart.substring(startIndex, i).trim());
                        parseOrderBy(wherePart.substring(i + 1).trim());
                        break;
                    }
                }
                if (i == wherePart.length() - 1) {
                    conditions.add(wherePart.substring(startIndex).trim());
                }

            }
        }
        this.Conditions = new String[conditions.size()];
        if (conditionLogics.size() > 0) {
            this.ConditionLogics = new String[conditions.size()];
        }
        for (int i = 0; i < conditions.size(); i++) {
            this.Conditions[i] = (String) conditions.get(i);
            if (i < conditionLogics.size()) {
                ConditionLogics[i] = (String) conditionLogics.get(i);
            }
        }
    }

    private void parseGroupBy(String groupPart) {
        int leftBracketCount = 0;
        int rightBracketCount = 0;
        int singleQuoteCount = 0;
        String lowerGroupPart = groupPart.toLowerCase();
        int startIndex = lowerGroupPart.indexOf(" by ") + 3;
        ArrayList groupFields = new ArrayList();
        // 以下解析wherePart
        for (int i = startIndex; i < groupPart.length(); i++) {
            if (groupPart.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (groupPart.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (groupPart.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (groupPart.charAt(i) == ',') {
                    groupFields.add(groupPart.substring(startIndex, i).trim());
                    startIndex = i + 1;
                }
                if (groupPart.charAt(i) == ' ') {
                    if (lowerGroupPart.substring(i).trim().startsWith("having ")) {
                        groupFields.add(groupPart.substring(startIndex, i).trim());
                        parseHaving(groupPart.substring(i + 1).trim());
                        break;
                    }
                    if (lowerGroupPart.substring(i).trim().startsWith("order ")) {
                        groupFields.add(groupPart.substring(startIndex, i).trim());
                        parseOrderBy(groupPart.substring(i + 1).trim());
                        break;
                    }
                }
                if (i == groupPart.length() - 1) {
                    groupFields.add(groupPart.substring(startIndex).trim());
                }

            }
        }
        this.GroupByFields = new String[groupFields.size()];
        for (int i = 0; i < groupFields.size(); i++) {
            this.GroupByFields[i] = (String) groupFields.get(i);
        }
    }

    private void parseOrderBy(String orderPart) {
        int leftBracketCount = 0;
        int rightBracketCount = 0;
        int singleQuoteCount = 0;
        ArrayList orderFields = new ArrayList();
        int startIndex = orderPart.toLowerCase().indexOf(" by ") + 3;
        // 以下解析wherePart
        for (int i = startIndex; i < orderPart.length(); i++) {
            if (orderPart.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (orderPart.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (orderPart.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (orderPart.charAt(i) == ',') {
                    orderFields.add(orderPart.substring(startIndex, i).trim());
                    startIndex = i + 1;
                }
                if (i == orderPart.length() - 1) {
                    orderFields.add(orderPart.substring(startIndex).trim());
                }

            }
        }
        this.OrderByFields = new String[orderFields.size()];
        for (int i = 0; i < orderFields.size(); i++) {
            this.OrderByFields[i] = (String) orderFields.get(i);
        }
    }

    private void parseHaving(String havingPart) {
        int leftBracketCount = 0;
        int rightBracketCount = 0;
        int singleQuoteCount = 0;
        int startIndex = 7;
        String lowerHavingPart = havingPart.toLowerCase();
        ArrayList havingConditions = new ArrayList();
        ArrayList havingConditionLogics = new ArrayList();
        // 以下解析wherePart
        for (int i = startIndex; i < havingPart.length(); i++) {
            if (havingPart.charAt(i) == '(') {
                leftBracketCount++;
            }
            if (havingPart.charAt(i) == ')') {
                rightBracketCount++;
            }
            if (havingPart.charAt(i) == '\'') {
                singleQuoteCount++;
            }
            if (leftBracketCount == rightBracketCount && singleQuoteCount % 2 == 0) {
                if (havingPart.charAt(i) == ' ') {
                    if (lowerHavingPart.substring(i).trim().startsWith("and ")) {
                        havingConditions.add(havingPart.substring(startIndex, i).trim());
                        havingConditionLogics.add("and");
                        startIndex = i = lowerHavingPart.indexOf("and ", i) + 3;
                    }
                    if (lowerHavingPart.substring(i).trim().startsWith("or ")) {
                        havingConditions.add(havingPart.substring(startIndex, i).trim());
                        havingConditionLogics.add("or");
                        startIndex = i = lowerHavingPart.indexOf("or ", i) + 2;
                    }
                    if (lowerHavingPart.substring(i).trim().startsWith("order ")) {
                        havingConditions.add(havingPart.substring(startIndex, i).trim());
                        parseOrderBy(havingPart.substring(i + 1).trim());
                        break;
                    }
                }
                if (i == havingPart.length() - 1) {
                    havingConditions.add(havingPart.substring(startIndex).trim());
                }

            }
        }
        this.HavingConditions = new String[havingConditions.size()];
        if (havingConditionLogics.size() > 0) {
            this.HavingConditionLogics = new String[havingConditionLogics.size()];
        }
        for (int i = 0; i < havingConditions.size(); i++) {
            this.HavingConditions[i] = (String) havingConditions.get(i);
            if (i < havingConditions.size() - 1) {
                this.HavingConditionLogics[i] = (String) havingConditionLogics.get(i);
            }
        }

    }

    private void generatePartString() {
        StringBuffer sb = new StringBuffer();
        // Columns
        for (int i = 0; i < this.Columns.length; i++) {
            if (i != 0) {
                sb.append(",");
            }
            sb.append(this.Columns[i]);

        }
        this.ColumnPart = sb.toString();

        // Tables
        sb = new StringBuffer();
        for (int i = 0; i < this.Tables.length; i++) {
            if (i != 0) {
                sb.append(",");
            }
            sb.append(this.Tables[i]);
        }
        this.FromPart = sb.toString();

        // Where
        sb = new StringBuffer();
        if (Conditions == null) {
            this.WherePart = "";
        } else {
            for (int i = 0; i < this.Conditions.length; i++) {
                if (i != 0) {
                    sb.append(" ");
                }
                sb.append(this.Conditions[i]);
                if (i != this.Conditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.ConditionLogics[i]);
                }
            }
            this.WherePart = sb.toString();
        }

        // Group By
        sb = new StringBuffer();
        if (GroupByFields == null) {
            this.GroupByPart = "";
        } else {
            for (int i = 0; i < this.GroupByFields.length; i++) {
                if (i != 0) {
                    sb.append(",");
                }
                sb.append(this.GroupByFields[i]);
            }
            this.GroupByPart = sb.toString();
        }
        // Having
        sb = new StringBuffer();
        if (HavingConditions == null) {
            this.HavingPart = "";
        } else {
            for (int i = 0; i < this.HavingConditions.length; i++) {
                if (i != 0) {
                    sb.append(" ");
                }
                sb.append(this.HavingConditions[i]);
                if (i != this.HavingConditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.HavingConditionLogics[i]);
                }
            }
            this.HavingPart = sb.toString();
        }
        // Order By
        sb = new StringBuffer();
        if (OrderByFields == null) {
            this.OrderbyPart = "";
        } else {
            for (int i = 0; i < this.OrderByFields.length; i++) {
                if (i != 0) {
                    sb.append(",");
                }
                sb.append(this.OrderByFields[i]);
            }
            this.OrderbyPart = sb.toString();
        }
    }

    public String getFormatSQL() {
        if (this.FormatSQL != null) {
            return this.FormatSQL;
        }
        StringBuffer sb = new StringBuffer();
        // Columns
        sb.append("SELECT\n\t");
        for (int i = 0; i < this.Columns.length; i++) {
            if (i != 0) {
                sb.append(",\n\t");
            }
            sb.append(this.Columns[i]);
        }

        // Tables
        sb.append("\nFROM\n\t");
        for (int i = 0; i < this.Tables.length; i++) {
            if (i != 0) {
                sb.append(",\n\t");
            }
            sb.append(this.Tables[i]);
        }

        // Where
        if (Conditions != null) {
            sb.append("\nWHERE\n");
            for (int i = 0; i < this.Conditions.length; i++) {
                sb.append("\t");
                sb.append(this.Conditions[i]);
                if (i != this.Conditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.ConditionLogics[i]);
                }
                sb.append(" \n");
            }
        }

        // Group By
        if (GroupByFields != null) {
            sb.append("GROUP BY\n\t");
            for (int i = 0; i < this.GroupByFields.length; i++) {
                if (i != 0) {
                    sb.append(",\n\t");
                }
                sb.append(this.GroupByFields[i]);
            }
        }
        // Having
        if (HavingConditions != null) {
            sb.append("\nHAVING\n");
            for (int i = 0; i < this.HavingConditions.length; i++) {
                sb.append("\t");
                sb.append(this.HavingConditions[i]);
                if (i != this.HavingConditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.HavingConditionLogics[i]);
                }
                sb.append(" \n");
            }
        }
        // Order By
        if (OrderByFields != null) {
            sb.append("ORDER BY\n\t");
            for (int i = 0; i < this.OrderByFields.length; i++) {
                if (i != 0) {
                    sb.append(",\n\t");
                }
                sb.append(this.OrderByFields[i]);
            }
        }
        this.FormatSQL = sb.toString();
        return FormatSQL;
    }

    public String getMSSQLPagedSQL() {
        StringBuffer sb = new StringBuffer();
        // Columns
        sb.append("select * from (select ");
        sb.append(StringUtil.join(this.Columns));
        sb.append(",ROW_NUMBER() over (");
        // Order By
        if (OrderByFields != null) {
            sb.append("order by ");
            sb.append(StringUtil.join(this.OrderByFields));
        } else {
            String tmp = ("," + StringUtil.join(this.Columns, ",") + ",").toLowerCase();
            if (tmp.indexOf(",id,") >= 0) {
                sb.append("order by id");
            } else if (tmp.indexOf(",addtime,") >= 0) {
                sb.append("order by addtime");
            } else if (tmp.equals(",*,")) {
                sb.append("order by addtime");
            } else {
                String column = this.Columns[0];
                if (column.trim().indexOf(' ') > 0) {// 说明有可能是子查询
                    sb.append("order by id");
                } else {
                    sb.append("order by " + this.Columns[0]);
                }
            }
        }
        sb.append(") as _RowNumber");

        // Tables
        sb.append(" from ");
        sb.append(StringUtil.join(this.Tables));

        // Where
        if (Conditions != null) {
            sb.append(" where ");
            for (int i = 0; i < this.Conditions.length; i++) {
                sb.append(" ");
                sb.append(this.Conditions[i]);
                if (i != this.Conditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.ConditionLogics[i]);
                }
                sb.append(" ");
            }
        }

        // Group By
        if (GroupByFields != null) {
            sb.append(" group by ");
            sb.append(StringUtil.join(this.GroupByFields));
        }
        // Having
        if (HavingConditions != null) {
            sb.append(" having ");
            for (int i = 0; i < this.HavingConditions.length; i++) {
                sb.append(" ");
                sb.append(this.HavingConditions[i]);
                if (i != this.HavingConditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.HavingConditionLogics[i]);
                }
                sb.append(" ");
            }
        }
        sb.append(") _Results where  _RowNumber between ? and ?");
        return sb.toString();
    }

    public String getSybasePagedSQL(int pageSize, int pageIndex, int connID) {
        StringBuffer sb = new StringBuffer();
        sb.append("set rowcount " + (pageIndex + 1) * pageSize + " select " + StringUtil.join(this.Columns));
        sb.append(",_RowNumber=identity(12) into #tmp_z_" + connID + " from " + StringUtil.join(this.Tables));
        if (Conditions != null) {
            sb.append(" where ");
            for (int i = 0; i < this.Conditions.length; i++) {
                sb.append(" ");
                sb.append(this.Conditions[i]);
                if (i != this.Conditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.ConditionLogics[i]);
                }
                sb.append(" ");
            }
        }
        if (OrderByFields != null) {
            sb.append(" order by ");
            sb.append(StringUtil.join(this.OrderByFields));
        }
        if (GroupByFields != null) {
            sb.append(" group by ");
            sb.append(StringUtil.join(this.GroupByFields));
        }
        if (HavingConditions != null) {
            sb.append(" having ");
            for (int i = 0; i < this.HavingConditions.length; i++) {
                sb.append(" ");
                sb.append(this.HavingConditions[i]);
                if (i != this.HavingConditions.length - 1) {
                    sb.append(" ");
                    sb.append(this.HavingConditionLogics[i]);
                }
                sb.append(" ");
            }
        }
        sb.append(" select * from #tmp_z_" + connID + " where _RowNumber>" + (pageIndex * pageSize)
                + " drop table #tmp_z_" + connID + " set rowcount 0");
        return sb.toString();
    }

    public String getColumnPart() {
        if (this.ColumnPart == null) {
            this.generatePartString();
        }
        return ColumnPart;
    }

    public String getFromPart() {
        if (this.FromPart == null) {
            this.generatePartString();
        }
        return FromPart;
    }

    public String getGroupByPart() {
        if (this.GroupByPart == null) {
            this.generatePartString();
        }
        return GroupByPart;
    }

    public String getHavingPart() {
        if (this.HavingPart == null) {
            this.generatePartString();
        }
        return HavingPart;
    }

    public String getOrderbyPart() {
        if (this.OrderbyPart == null) {
            this.generatePartString();
        }
        return OrderbyPart;
    }

    public String getWherePart() {
        if (this.WherePart == null) {
            this.generatePartString();
        }
        return WherePart;
    }

    public String[] getColumns() {
        return Columns;
    }

    public String[] getConditions() {
        return Conditions;
    }

    public String[] getGroupByFields() {
        return GroupByFields;
    }

    public String[] getOrderByFields() {
        return OrderByFields;
    }

    public String[] getTables() {
        return Tables;
    }

    public String[] getHavingConditions() {
        return HavingConditions;
    }

    public String[] getConditionLogics() {
        return ConditionLogics;
    }

    public String[] getHavingConditionLogics() {
        return HavingConditionLogics;
    }

    /**
     * @param args
     */
    public static void main(String[] args) {
        String sql = "select id, dsf , fds,(select a from b where id=lcpol.id) from lcpol , lccont where polno>'1' and grpcontno>'2' group by grpcontno , id having x>3 and t<6 order by id, x , y";
        long t = System.currentTimeMillis();
        try {
            for (int i = 0; i < 10000; i++) {
                SelectSQLParser sp = new SelectSQLParser();
                sp.setSQL(sql);
                sp.parse();
                System.out.println(sp.getMSSQLPagedSQL());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(System.currentTimeMillis() - t);
    }

}

