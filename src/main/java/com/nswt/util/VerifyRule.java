package com.nswt.util;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by hongkai on 2017/4/25.
 */
public class VerifyRule {

    /**
     * 字符串格式要求：字符串中可以是任何字符，但不能包括有潜在危险性的SQL语句和Script语句
     */
    public static final String F_String = "String";

    /**
     * 字符串格式要求：字符串中可以是任何字符，包括有潜在危险性的SQL语句和Script语句
     */
    public static final String F_Any = "Any";

    /**
     * 字符串格式要求：字符串必须代表一个数值，可以是整数或者浮点，可以是负数，或者是科学记数
     */
    public static final String F_Number = "Number";

    /**
     * 字符串格式要求：字符串必须代表一个有效日期，格式为指定格式，默认为YYYY-MM-DD
     */
    public static final String F_Date = "Date";

    /**
     * 字符串格式要求：字符串必须代表一个有效时间,格式为HH:MM:SS
     */
    public static final String F_Time = "Time";

    /**
     * 字符串格式要求：字符串必须代表一个有效日期时间,格式为指定格式，默认为YYYY-MM-DD HH:MM:SS
     */
    public static final String F_DateTime = "DateTime";

    /**
     * 字符串格式要求：字符串必须代表一个有效年份，可以使用AD/DC标志
     */
    public static final String F_Year = "Year";

    /**
     * 字符串格式要求：字符串必须代表一个有效月份
     */
    public static final String F_Month = "Month";

    /**
     * 字符串格式要求：字符串必须代表一个有效日
     */
    public static final String F_Day = "Day";

    /**
     * 字符串格式要求：字符串必须代表一个整数，可以为负数
     */
    public static final String F_Int = "Int";

    /**
     * 字符串格式要求：字符串中所有字符必须是数字
     */
    public static final String F_DigitChar = "DigitChar";

    /**
     * 字符串格式要求：字符串中所有字符必须是Ascii字符
     */
    public static final String F_AsciiChar = "AsciiChar";

    /**
     * 字符串格式要求：字符串中所有字符必须是字母
     */
    public static final String F_LetterChar = "LetterChar";

    /**
     * 字符串格式要求：字符串中所有字母字符必须是大写字母
     */
    public static final String F_UpperChar = "UpperChar";

    /**
     * 字符串格式要求：字符串中所有字母字符必须是小写字母
     */
    public static final String F_LowerChar = "LowerChar";

    /**
     * 字符串格式要求：字符串不能为空
     */
    public static final String F_NotNull = "NotNull";

    /**
     * 字符串格式要求：必须是合法的电子邮箱
     */
    public static final String F_Email = "Email";

    /**
     * 字符串格式要求：字符串值应该是CodeSelect中某一code的范围之内
     */
    public static final String F_Code = "Code";

    /**
     * 字符串格式要求：字符串值中每一个字符都应该是半角字符或者汉字
     */
    public static final String F_HalfChar = "HalfChar";

    /**
     * 字符串格式要求：字符串值中每一个字符都应该是全角字符或者汉字
     */
    public static final String F_FullChar = "FullChar";

    /**
     * 格式逻辑运算符：与操作
     */
    public static final String O_Add = "&&";

    /**
     * 格式逻辑运算符：或操作
     */
    public static final String O_Or = "||";

    /**
     * 格式逻辑运算符：非操作
     */
    public static final String O_Not = "!";

    /**
     * 属性：自定义格式，支持*与?两者通配符
     */
    public static final String A_Format = "Format";

    /**
     * 属性：格式必须符合指定的正则表达式
     */
    public static final String A_RegFormat = "RegFormat";

    /**
     * 属性：最大值
     */
    public static final String A_Max = "Max";

    /**
     * 属性：最小值
     */
    public static final String A_Min = "Min";

    /**
     * 属性：字符串长度
     */
    public static final String A_Len = "Length";

    private static final String regEmail = "^[_\\-a-z0-9A-Z]*?[\\._\\-a-z0-9]*?[a-z0-9]+@[a-z0-9]+[a-z0-9\\-]*?[a-z0-9]+\\.[\\.a-z0-9]*$";

    private static Pattern patternEmail = null;

    private String Rule;

    private String[] Features;

    private ArrayList Messages;

    /**
     * 创建一个空白校验规则对象
     */
    public VerifyRule() {
    }

    /**
     * 创建含有指定规则的校验规则对象
     *
     * @param rule
     */
    public VerifyRule(String rule) {
        Rule = rule;
    }

    /**
     * 校验指定的值是否符合本对象的校验规则
     *
     * @param value
     * @return
     */
    public boolean verify(String value) {
        Messages = new ArrayList();
        Features = Rule.split("\\&\\&");
        boolean sqlFlag = true;
        boolean verifyFlag = true;
        try {
            for (int i = 0; i < Features.length; i++) {
                String op = "=";
                if (Features[i].indexOf('>') > 0) {
                    op = ">";
                } else if (Features[i].indexOf('<') > 0) {
                    op = "<";
                }
                String[] f = Features[i].split("\\" + op);
                String fName = f[0];
                String fValue = null;
                if (f.length > 1) {
                    fValue = f[1];
                }
                if (fName.equals(VerifyRule.F_Any)) {
                    sqlFlag = false;
                } else if (fName.equals(VerifyRule.F_NotNull)) {
                    if (value == null || value.equals("")) {
                        Messages.add("不能为空");
                        return false;
                    }
                } else if (fName.equals(VerifyRule.F_Code)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                } else if (fName.equals(VerifyRule.F_Date)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    if (!DateUtil.isDate(value)) {
                        Messages.add("不是正确的日期值");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_Time)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    if (!DateUtil.isTime(value)) {
                        Messages.add("不是正确的日期值");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_DateTime)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    String[] arr = value.split(" ");
                    if (arr.length == 1 && !DateUtil.isDate(arr[0])) {
                        Messages.add("不是正确的日期值");
                        verifyFlag = false;
                    } else if (arr.length == 2) {
                        if (!DateUtil.isDate(arr[0]) || !DateUtil.isTime(arr[1])) {
                            Messages.add("不是正确的日期值");
                            verifyFlag = false;
                        }
                    } else {
                        Messages.add("不是正确的日期值");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_Number)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    try {
                        Double.parseDouble(value);
                    } catch (Exception e) {
                        Messages.add("不是正确的数值");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_Int)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    try {
                        Integer.parseInt(value);
                    } catch (Exception e) {
                        Messages.add("不是正确的整数值");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_String)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    if (value.indexOf('\'') >= 0 || value.indexOf('\"') >= 0) {
                        Messages.add("可能是非法字符串");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.F_Email)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    if (patternEmail == null) {
                        patternEmail = Pattern.compile(regEmail);
                    }
                    Matcher m = patternEmail.matcher(value);
                    if (!m.find()) {
                        Messages.add("不是正确的电子邮箱地址");
                        verifyFlag = false;
                    }
                } else if (fName.equals(VerifyRule.A_Len)) {
                    if (value == null || value.equals("")) {
                        continue;
                    }
                    if (fValue == null || fValue.equals("")) {
                        throw new RuntimeException("校验规则错误，Length后面必须是数字");
                    } else {
                        try {
                            int len = Integer.parseInt(fValue);
                            if (op.equals("=") && value.length() != len) {
                                Messages.add("长度必须是" + len);
                                verifyFlag = false;
                            } else if (op.equals(">") && value.length() <= len) {
                                Messages.add("长度必须大于" + len);
                                verifyFlag = false;
                            } else if (op.equals("<") && value.length() >= len) {
                                Messages.add("长度必须小于" + len);
                                verifyFlag = false;
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                            throw new RuntimeException("校验规则错误，Length后面必须是整数");
                        }
                    }
                }
            }
            if (sqlFlag) {// 校验SQL入侵
                if (value != null) {
                    if ((value.indexOf(" and ") > 0 || value.indexOf(" or ") > 0)
                            && (value.indexOf('!') > 0 || value.indexOf(" like ") > 0 || value.indexOf('=') > 0
                            || value.indexOf('>') > 0 || value.indexOf('<') > 0)) {
                        Messages.add("请不要尝试输入SQL语句!");
                        verifyFlag = false;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("不正确的校验规则:" + Rule);
        }
        if (sqlFlag) {
            if (!checkSQL(value)) {
                verifyFlag = false;
            }
        }
        return verifyFlag;
    }

    /**
     * 返回校验结果
     *
     * @param fieldName
     * @return
     */
    public String getMessages(String fieldName) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < Messages.size(); i++) {
            sb.append(fieldName);
            sb.append(":");
            sb.append(Messages.get(i));
            sb.append("\n");
        }
        return sb.toString();
    }

    /**
     * 检查指定值是否是一个SQL语句（未实现）
     *
     * @param value
     * @return
     */
    private boolean checkSQL(String value) {
        return true;
    }

    /**
     * 返回本对象的校验规则
     *
     * @return
     */
    protected String getRule() {
        return Rule;
    }

    /**
     * 设置本对象的校验规则
     *
     * @param rule
     */
    protected void setRule(String rule) {
        Rule = rule;
    }

    public static void main(String[] args) {
        VerifyRule rule = new VerifyRule();
        rule.setRule("Email");
        System.out.println(rule.verify("wyuch_.-2@m165-a.com"));
        System.out.println(rule.getMessages("电子邮相"));
    }

}
