package com.nswt.util.data;


import com.nswt.util.DateUtil;
import com.nswt.util.Mapx;
import com.nswt.util.StringUtil;
import com.nswt.util.log.LogUtil;
import org.apache.poi.hssf.usermodel.*;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.NumberFormat;
import java.util.Date;

/**
 * @Mail nswt@nswt.com.cn
 */
public class DataTableUtil {

    public static DataTable txtToDataTable(String content) {
        return txtToDataTable(content, (String[]) null, ",", "\\n");
    }

    public static DataTable txtToDataTable(String content, String fieldspliter, String rowspliter) {
        return txtToDataTable(content, (String[]) null, fieldspliter, rowspliter);
    }

    public static DataTable txtToDataTable(String content, String[] columnNames) {
        return txtToDataTable(content, columnNames, ",", "\\n");
    }

    public static DataTable txtToDataTable(String content, String[] columnNames, String fieldspliter, String rowspliter) {
        String[] rows = content.split(rowspliter);
        int startIndex = 0;
        if (columnNames == null) {
            columnNames = rows[0].split(fieldspliter);
            Mapx map = new Mapx();
            for (int i = 0; i < columnNames.length; i++) {
                String name = columnNames[i];
                String tmp = name;
                int k = 2;
                while (map.containsKey(tmp)) {
                    tmp = name + k++;
                }
                map.put(tmp, tmp);
                columnNames[i] = tmp;
            }
            startIndex = 1;
        }
        if (columnNames == null || columnNames.length == 0) {
            return null;
        }
        DataColumn[] dcs = new DataColumn[columnNames.length];
        for (int i = 0; i < columnNames.length; i++) {
            DataColumn dc = new DataColumn();
            dc.setColumnName(columnNames[i]);
            dc.setColumnType(DataColumn.STRING);
            dcs[i] = dc;
        }
        Object[][] values = new Object[rows.length - startIndex][columnNames.length];
        for (int i = startIndex; i < rows.length; i++) {
            if (rows[i] == null) {
                continue;
            }
            String[] cols = rows[i].trim().split(fieldspliter);
            if (cols == null) {
                continue;
            }
            for (int j = 0; j < cols.length && j < columnNames.length; j++) {
                values[i - startIndex][j] = StringUtil.javaDecode(cols[j]);
            }
        }
        return new DataTable(dcs, values);
    }

    public static String dataTableToTxt(DataTable dt) {
        return dataTableToTxt(dt, null, ",", "\\n");
    }

    public static String dataTableToTxt(DataTable dt, String fieldspliter, String rowspliter) {
        return dataTableToTxt(dt, null, fieldspliter, rowspliter);
    }

    public static String dataTableToTxt(DataTable dt, String[] columnNames, String fieldspliter, String rowspliter) {
        StringBuffer sb = new StringBuffer();
        if (columnNames == null) {
            columnNames = new String[dt.getColCount()];
            for (int i = 0; i < columnNames.length; i++) {
                columnNames[i] = dt.getDataColumn(i).getColumnName();
            }
        }
        for (int i = 0; i < columnNames.length; i++) {
            if (i != 0) {
                sb.append(fieldspliter);
            }
            sb.append(columnNames[i]);
        }
        sb.append(rowspliter);
        for (int i = 0; i < dt.getRowCount(); i++) {
            for (int j = 0; j < dt.getColCount(); j++) {
                if (j != 0) {
                    sb.append(fieldspliter);
                }
                sb.append(StringUtil.javaEncode(dt.getString(i, j)));
            }
            sb.append(rowspliter);
        }
        return sb.toString();
    }

    public static void dataTableToExcel(DataTable dt, String fileName) {
        dataTableToExcel(dt, fileName, null, null);
    }

    public static void dataTableToExcel(DataTable dt, String fileName, String[] columnNames, String[] widths) {
        try {
            FileOutputStream fos = new FileOutputStream(fileName);
            dataTableToExcel(dt, fos, columnNames, widths);
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void dataTableToExcel(DataTable dt, OutputStream os) {
        dataTableToExcel(dt, os, null, null);
    }

    public static void dataTableToExcel(DataTable dt, OutputStream os, String[] columnNames, String[] widths) {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("First");
        try {
            HSSFFont fontBold = wb.createFont();
            fontBold.setFontHeightInPoints((short) 10);
            fontBold.setFontName("宋体");
            fontBold.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

            HSSFFont fontNormal = wb.createFont();
            fontNormal.setFontHeightInPoints((short) 10);
            fontNormal.setFontName("宋体");
            fontNormal.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);

            HSSFCellStyle styleBorderBold = wb.createCellStyle();
            styleBorderBold.setBorderBottom(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderLeft(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderRight(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderTop(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
            styleBorderBold.setAlignment(HSSFCellStyle.ALIGN_CENTER);
            styleBorderBold.setWrapText(true);
            // styleBorderBold.setFillBackgroundColor((short)0);
            styleBorderBold.setFont(fontBold);

            HSSFCellStyle styleBorderNormal = wb.createCellStyle();
            styleBorderNormal.setBorderBottom(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderLeft(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderRight(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderTop(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
            styleBorderNormal.setFont(fontNormal);

            HSSFCellStyle styleBold = wb.createCellStyle();
            styleBold.setFont(fontBold);

            HSSFCellStyle styleNormal = wb.createCellStyle();
            styleNormal.setFont(fontNormal);

            // 转换头部
            HSSFRow row = sheet.getRow(0);
            if (row == null) {
                row = sheet.createRow(0);
            }
            for (int i = 0; i < dt.getColCount(); i++) {
                HSSFCell cell = row.getCell((short) i);
                if (cell == null) {
                    cell = row.createCell((short) i);
                }
                cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                cell.setCellStyle(styleBorderBold);
                /*cell.setEncoding(HSSFCell.ENCODING_UTF_16);*/
                if (columnNames != null && columnNames.length > i) {
                    cell.setCellValue(columnNames[i]);
                } else {
                    cell.setCellValue(dt.getDataColumn(i).getColumnName());
                }

                row.setHeightInPoints(30);

                if (widths != null && widths.length > i) {
                    sheet.setColumnWidth((short) i, (short) (Short.parseShort(widths[i]) * 37.5));
                }
            }
            // 转换数据
            for (int i = 0; i < dt.getRowCount(); i++) {
                row = sheet.getRow(i + 1);
                if (row == null) {
                    row = sheet.createRow(i + 1);
                }
                // row.setHeightInPoints(18);
                row.setHeight((short) (15.5 * 23));
                for (int j = 0; j < dt.getColCount(); j++) {
                    HSSFCell cell = row.getCell((short) j);
                    if (cell == null) {
                        cell = row.createCell((short) j);
                    }
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    cell.setCellStyle(styleBorderNormal);
                   /* cell.setEncoding(HSSFCell.ENCODING_UTF_16);*/
                    if (dt.get(i, j) == null) {
                        cell.setCellValue("");
                    } else if (dt.getDataColumn(j).getColumnType() == DataColumn.DATETIME) {
                        cell.setCellValue(DateUtil.toString((Date) dt.get(i, j), "yyyy-MM-dd"));
                    } else {
                        cell.setCellValue(dt.getString(i, j));
                    }
                }
            }
            wb.write(os);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void dataTableToExcel(DataTable dt, OutputStream os, String[] columnNames, String[] widths,
                                        String[] columnIndexes) {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("First");
        try {
            HSSFFont fontBold = wb.createFont();
            fontBold.setFontHeightInPoints((short) 10);
            fontBold.setFontName("宋体");
            fontBold.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

            HSSFFont fontNormal = wb.createFont();
            fontNormal.setFontHeightInPoints((short) 10);
            fontNormal.setFontName("宋体");
            fontNormal.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);

            HSSFCellStyle styleBorderBold = wb.createCellStyle();
            styleBorderBold.setBorderBottom(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderLeft(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderRight(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setBorderTop(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
            styleBorderBold.setAlignment(HSSFCellStyle.ALIGN_CENTER);
            styleBorderBold.setWrapText(true);
            // styleBorderBold.setFillBackgroundColor((short)0);
            styleBorderBold.setFont(fontBold);

            HSSFCellStyle styleBorderNormal = wb.createCellStyle();
            styleBorderNormal.setBorderBottom(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderLeft(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderRight(HSSFCellStyle.BORDER_THIN);
            styleBorderNormal.setBorderTop(HSSFCellStyle.BORDER_THIN);
            styleBorderBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
            styleBorderNormal.setFont(fontNormal);

            HSSFCellStyle styleBold = wb.createCellStyle();
            styleBold.setFont(fontBold);

            HSSFCellStyle styleNormal = wb.createCellStyle();
            styleNormal.setFont(fontNormal);

            // 转换头部
            HSSFRow row = sheet.getRow(0);
            if (row == null) {
                row = sheet.createRow(0);
            }
            for (int i = 0; i < columnNames.length; i++) {
                HSSFCell cell = row.getCell((short) i);
                if (cell == null) {
                    cell = row.createCell((short) i);
                }
                cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                cell.setCellStyle(styleBorderBold);
                /*cell.setEncoding(HSSFCell.ENCODING_UTF_16);*/
                cell.setCellValue(columnNames[i]);
                row.setHeightInPoints(30);
                if (widths != null && widths.length > i) {
                    sheet.setColumnWidth((short) i, (short) (Integer.parseInt(widths[i]) * 37.5));
                }
            }

            for (int i = 0; i < columnIndexes.length; i++) {
                int j = Integer.parseInt(columnIndexes[i]);
                for (int k = 0; k < dt.getRowCount(); k++) {
                    row = sheet.getRow(k + 1);
                    if (row == null) {
                        row = sheet.createRow(k + 1);
                    }
                    HSSFCell cell = row.getCell((short) i);
                    if (cell == null) {
                        cell = row.createCell((short) i);
                    }
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    cell.setCellStyle(styleBorderNormal);
                    /*cell.setEncoding(HSSFCell.ENCODING_UTF_16);*/
                    if (dt.get(k, j) == null) {
                        cell.setCellValue("");
                    } else if (dt.getDataColumn(j).getColumnType() == DataColumn.DATETIME) {
                        cell.setCellValue(DateUtil.toString((Date) dt.get(k, j), "MM/dd/yyyy"));
                    } else {
                        cell.setCellValue(dt.getString(k, j));
                    }
                }
            }
            wb.write(os);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 以第一行为列名
     */
    public static DataTable xlsToDataTable(String fileName) throws Exception {
        return xlsToDataTable(fileName, 0);
    }

    public static DataTable xlsToDataTable(String fileName, String sheetName) throws Exception {
        HSSFWorkbook book = new HSSFWorkbook(new FileInputStream(fileName));
        int index = book.getSheetIndex(sheetName);
        if (index < 0) {
            throw new RuntimeException("未找到SheetName:" + sheetName);
        }
        return xlsToDataTable(book, index);
    }

    public static DataTable xlsToDataTable(String fileName, int sheetNo) throws Exception {
        HSSFWorkbook book = new HSSFWorkbook(new FileInputStream(fileName));
        return xlsToDataTable(book, sheetNo);
    }

    public static DataTable xlsToDataTable(HSSFWorkbook book, int sheetNo) throws Exception {
        HSSFSheet sheet = book.getSheetAt(sheetNo);
        int maxRow = sheet.getPhysicalNumberOfRows();
        int maxCol = sheet.getRow(0).getPhysicalNumberOfCells();
        DataColumn[] dcs = new DataColumn[maxCol];
        int StartRowIndex = 1;
        Object[][] values = new Object[maxRow - StartRowIndex][maxCol];
        Mapx map = new Mapx();
        for (int i = 0; i < maxCol; i++) {
            DataColumn dc = new DataColumn();
            HSSFCell cell = sheet.getRow(0).getCell((short) i);
            String name = getCellValue(cell);
            String tmp = name;
            int k = 2;
            while (map.containsKey(tmp)) {
                tmp = name + k++;
            }
            map.put(tmp, tmp);

            dc.setColumnName(tmp);
            dc.setColumnType(DataColumn.STRING);
            dcs[i] = dc;
        }
        for (int i = StartRowIndex; i < maxRow; i++) {
            HSSFRow row = sheet.getRow(i);
            if (row == null) {
                break;
            }
            HSSFCell cell = row.getCell((short) 0);
            for (int j = 0; j < maxCol; j++) {
                cell = row.getCell((short) j);
                values[i - StartRowIndex][j] = getCellValue(cell);
            }
            LogUtil.info("正在读取Excle文件的第" + i + "行...");
        }
        DataTable dt = new DataTable(dcs, values);
        return dt;
    }

    private static String getCellValue(HSSFCell cell) {
        String value = null;
        if (cell == null) {
            return "";
        }
        if (cell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
            if (HSSFDateUtil.isCellDateFormatted(cell)) {
                value = DateUtil.toString(cell.getDateCellValue());
            } else {
                if (cell.getCellStyle().getDataFormat() == 31 || cell.getCellStyle().getDataFormat() == 181) {// 中文日期和默认日期格式
                    Date d = cell.getDateCellValue();
                    value = DateUtil.toString(d);
                } else {
                    value = NumberFormat.getNumberInstance().format(cell.getNumericCellValue());
                    value = StringUtil.replaceEx(value, ",", "");
                }
            }
        } else if (cell.getCellType() == HSSFCell.CELL_TYPE_FORMULA) {
            value = String.valueOf(cell.getNumericCellValue());
        } else {
            value = cell.getStringCellValue();
        }
        value = trimEx(value);
        return value;
    }

    private static String trimEx(String str) {
        String r = str.trim();
        while (r.startsWith("　")) {// 去掉全角
            r = r.substring(1);
        }
        while (r.endsWith("　")) {// 去掉全角
            r = r.substring(0, r.length() - 1);
        }
        return r.trim();
    }

    public static DataTable extendBackupData(DataTable dt, String sql, String key) {
        for (int i = 0; i < dt.getRowCount(); i++) {
            DataRow dr = dt.getDataRow(i);
            String keyValue = dr.getString(key);
            DataTable backdt = new QueryBuilder(sql, keyValue).executePagedDataTable(1, 0);
            if (i == 0) {
                for (int j = 0; j < backdt.getColCount(); j++) {
                    backdt.getDataColumn(j).setColumnName("Backup" + backdt.getDataColumn(j).getColumnName());
                    dt.insertColumn(backdt.getDataColumn(j).getColumnName());
                }
            }
            if (backdt.getRowCount() == 1) {
                System.arraycopy(backdt.getDataRow(0).getDataValues(), 0, dt.getDataRow(i).getDataValues(),
                        dt.getColCount() - backdt.getColCount(), backdt.getColCount());
            }
        }
        return null;
    }
}
